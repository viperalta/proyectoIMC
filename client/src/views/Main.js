import React, { useState, useEffect } from "react";
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
import moment from 'moment';

const Main = () => {
  const { user, setUser } = useUser();
  const history = useHistory();
  const [imcs, setImcs] = useState();
  const [errors, setErrors] = useState([]);

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
    axios.put("/api/imc/pull", imc, {withCredentials: true}).then((res) => {

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
  }

  const renderMain = () => {
    
    if (user) {

     /*  let labels = user.imcs.map((imc)=>imc.createdAt.moment.format('YYYY-mm-dd')); */
     let labels = user.imcs.map((imc)=>{
       let date=new Date(imc.createdAt);
       var formatted_date = moment(date).format('DD-MM-YYYY');
       return formatted_date;

     });
      let data = user.imcs.map((imc)=>imc.imc);

      return (
        <>
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-2">
                <ImcForm
                  onSubmitProp={createImc}
                  initialAltura={0}
                  initialPeso={0}
                />
              </div>
              <div className="col-md-4">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Fecha</th>
                      <th scope="col">Altura</th>
                      <th scope="col">Peso</th>
                      <th scope="col">IMC</th>
                      <th scope="col"><i class="bi bi-trash"></i></th>
                    </tr>
                  </thead>
                  <tbody>
                    {user.imcs.map((imc, index) => {
                      let date=new Date(imc.createdAt);
                      var formatted_date = moment(date).format('DD-MM-YYYY');
                      return (
                        <tr key={index}>
                          <td>{formatted_date}</td>
                          <td>{imc.altura}</td>
                          <td>{imc.peso}</td>
                          <td>{Math.round(imc.imc * 10) / 10}</td>
                          <td><button onClick={()=>removeImc(imc._id)}>Eliminar</button></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="col-md-6"><LineChart labels={labels} data={data} /></div>
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
