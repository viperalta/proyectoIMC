import React, { useState, useEffect, useRef } from "react";
import { useUser } from "../contexts/userContext";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from "react-router-dom";
import ImcForm from "../components/ImcForm";
import axios from "axios";
import Swal from "sweetalert2";
import LineChart from "../components/LineChart";
import moment from "moment";
import Pdf from "react-to-pdf";

const ref = React.createRef();
const options = {
  orientation: "landscape",
  unit: "in",
  format: [18, 9],
};

const Main = () => {
  const { user, setUser } = useUser();
  const history = useHistory();
  const [imcs, setImcs] = useState();
  const [errors, setErrors] = useState([]);
  const [hide, setHide] = useState(false);

  const divRef = useRef(null);

  const createImc = (values) => {
    const imc = { altura: values.altura, peso: values.peso, userId: user._id };
    console.log(imc);

    axios
      .post("/api/imc/new", imc)
      .then((res) => {
        console.log(res);
        const tuimc =
          Math.round((imc.peso / (imc.altura * imc.altura)) * 10000 * 10) / 10;
        Swal.fire({
          icon: "success",
          title: "Tu IMC es de: " + tuimc,
          showConfirmButton: false,
          timer: 3000,
        });
        axios
          .get(`/api/user/${res.data._id}`, { withCredentials: true })
          .then((res) => {
            setUser(res.data);
          })
          .catch((err) => {
            console.error(err);
            return { success: false, data: err.message };
          });
      })
      .catch((err) => {
        const errorResponse = err.response.data.errors; // Get the errors from err.response.data
        const errorArr = []; // Define a temp error array to push the messages in
        for (const key of Object.keys(errorResponse)) {
          // Loop through all errors and get the messages
          errorArr.push(errorResponse[key].message);
        }
        // Set Errors
        setErrors(errorArr);
      });
  };

  const removeImc = (id) => {
    const imc = { userId: user._id, imcId: id };
    axios.put("/api/imc/pull", imc, { withCredentials: true }).then((res) => {
      axios
        .get(`/api/user/${res.data._id}`, { withCredentials: true })
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.error(err);
          return { success: false, data: err.message };
        });
    });
  };

  const renderMain = () => {
    if (user) {
      /*  let labels = user.imcs.map((imc)=>imc.createdAt.moment.format('YYYY-mm-dd')); */
      let labels = user.imcs.map((imc) => {
        let date = new Date(imc.createdAt);
        var formatted_date = moment(date).format("DD-MM-YYYY");
        return formatted_date;
      });
      let data = user.imcs.map((imc) => imc.imc);

      let lastimc = 0;
      let estado = "";
      let description = "";
      if (user.imcs.length > 0) {
        lastimc = user.imcs[user.imcs.length - 1].imc;
        if (lastimc >= 30) {
          estado = "Obesidad";
          description = (
            <>
              <p>
                La obesidad, así como las enfermedades no transmisibles
                vinculadas, pueden prevenirse en su mayoría. En el plano
                individual, puedes optar por:
              </p>
              <ul>
                <li>
                  Limitar la ingesta energética procedente de la cantidad de
                  grasa total y de azúcares
                </li>
                <li>
                  Aumentar el consumo de frutas y verduras, así como de
                  legumbres, cereales integrales y frutos secos
                </li>
                <li>
                  Realizar una actividad física periódica (60 minutos diarios
                  para los jóvenes y 150 minutos semanales para los adultos)
                </li>
              </ul>
            </>
          );
        } else if (lastimc >= 25 && lastimc < 30) {
          estado = "Sobrepeso";
          description = (
            <>
              <p>
                El sobrepeso, así como las enfermedades no transmisibles
                vinculadas, pueden prevenirse en su mayoría. En el plano
                individual, puedes optar por:
              </p>

              <ul>
                <li>
                  Limitar la ingesta energética procedente de la cantidad de
                  grasa total y de azúcares
                </li>
                <li>
                  Aumentar el consumo de frutas y verduras, así como de
                  legumbres, cereales integrales y frutos secos
                </li>
                <li>
                  Realizar una actividad física periódica (60 minutos diarios
                  para los jóvenes y 150 minutos semanales para los adultos)
                </li>
              </ul>
            </>
          );
        } else if (lastimc >= 18.5 && lastimc < 25) {
          estado = "Normal";
          description = (
            <>
              <p>
                ¡Felicitaciones! Tu IMC se encuentra en rangos normales.
                Recuerda mantener una vida sana, y realizar una actividad física
                periódica (60 minutos diarios para los jóvenes y 150 minutos
                semanales para los adultos).
              </p>
            </>
          );
        } else {
          estado = "Delgadez";
          description = (
            <>
              <p>
                Tu IMC arroja que te encuentras en un estado de Delgadez. Te
                recomendamos lo siguiente:
              </p>
              <ul>
                <li>
                  Escoger comidas ricas en nutrientes y comer con mayor
                  frecuencia
                </li>
                <li>Tomar batidos y licuados de frutas</li>
                <li>Elegir productos lácteos enteros.</li>
                <li>Cocinar salsas y sopas con leche en lugar de agua.</li>
              </ul>
            </>
          );
        }
      }

      const clickToPdf = async (toPdf) => {
        setHide(true);

        setTimeout(() => {
          console.log("tiempo");
          toPdf();
        }, 500);

        setTimeout(() => {
          console.log("tiempo");
          setHide(false);
        }, 1000);
      };

      return (
        <>
          <div className="container-fluid" ref={divRef}>
            <div className="row">
              <div className="col-md-2">
                <ImcForm
                  onSubmitProp={createImc}
                  initialAltura={0}
                  initialPeso={0}
                />
              </div>
              <div className="col-md-10">
                <div className="row" ref={ref}>
                  <div className="col-md-6">
                    {user.imcs.length > 0 ? (
                      <>
                        <div className="card">
                          <div className="card-body">
                            <h4
                              className={`${
                                hide ? "" : "hide"
                              }`}
                            >
                              Informe IMC de {user.firstName} {user.lastName}{" "}
                            </h4>
                            <h5 className="card-title">
                              IMC ACTUAL: {Math.round(lastimc * 10) / 10}
                            </h5>
                            <h6 className="card-subtitle mb-2 text-muted">
                              {estado}
                            </h6>
                            <p className="card-text">{description}</p>
                            <Pdf
                              targetRef={ref}
                              filename={`Informe IMC de ${user.firstName} ${user.lastName}.pdf`}
                              options={options}
                              scale={1}
                            >
                              {({ toPdf }) => (
                                <button
                                  onClick={() => clickToPdf(toPdf)}
                                  className={`btn btn-primary ${
                                    hide ? "hide" : ""
                                  }`}
                                >
                                  Descargar Informe
                                </button>
                              )}
                            </Pdf>
                          </div>
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">Fecha</th>
                          <th scope="col">Altura</th>
                          <th scope="col">Peso</th>
                          <th scope="col">IMC</th>
                          <th scope="col">
                            <i class="bi bi-trash"></i>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {user.imcs.map((imc, index) => {
                          let date = new Date(imc.createdAt);
                          var formatted_date =
                            moment(date).format("DD-MM-YYYY");
                          return (
                            <tr key={index}>
                              <td>{formatted_date}</td>
                              <td>{imc.altura}</td>
                              <td>{imc.peso}</td>
                              <td>{Math.round(imc.imc * 10) / 10}</td>
                              <td>
                                <button
                                  className={`${hide ? "hide" : ""}`}
                                  onClick={() => removeImc(imc._id)}
                                >
                                  Eliminar
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-6">
                    <LineChart labels={labels} data={data} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    } else {
      return (
        <>
          <h4 className="mt-3">
            Bienvenido/a al Proyecto IMC. En este sitio podrás calcular tu IMC,
            hacerle un seguimiento en el tiempo, y recibir recomendaciones
            respecto a tu salud!
          </h4>
        </>
      );
    }
  };

  return (
    <div>
      {errors.map((err, index) => (
        <div className="alert alert-danger" role="alert">
          {err}
        </div>
      ))}
      {renderMain()}
    </div>
  );
};

export default Main;
