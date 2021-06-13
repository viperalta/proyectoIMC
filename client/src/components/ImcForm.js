import React from 'react';
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import {useHistory} from "react-router-dom";

const PlayerForm = (props) => {
    const { initialAltura,initialPeso, onSubmitProp } = props;

    return (
        
          <Formik
          initialValues={{
          altura : initialAltura,
          peso:initialPeso,
        }}
        validationSchema={Yup.object().shape({
            altura: Yup.number(),
            peso: Yup.number(),
            
        })}

        onSubmit={(values, {setSubmitting}) =>{
            const timeOut = setTimeout(( )=>{
                console.log(values);
                onSubmitProp( values );
                setSubmitting(false);
                clearTimeout(timeOut);
            }, 1000);
        }}
        >
            {({
                values,
                errors,
                touched,
                handleSubmit,
                //isSubmitting,
                //validating,
                valid,
            }) =>{
        return (
            <div>
                <h5>Agrega tu altura y tu peso para saber tu IMC</h5>
                <Form className= "contact" method= "post" onSubmit={handleSubmit}>
                        <label htmlFor="altura" className="col-form-label">
                            Altura (cm)
                        </label>
                        <Field id= 'altura'type="number" className="form-control" placeholder="Altura" name='altura'/>
                         {errors.altura && touched.altura && <p className="perror">{errors.altura}</p>}
                     
                
                         <label className="col-form-label">Peso (kg)</label>
                         <Field  id= 'peso' type="number" placeholder="Peso" className="form-control" name='peso'/>
                         {errors.peso && touched.peso && <p className="perror">{errors.peso}</p>}
    <br></br>
                        <button type="submit" className="btn btn-success" disabled={Object.values(errors).length > 0}>Aceptar</button>
                </Form>
                </div>
        );
        }}
        </Formik>
        
      );
    
}

export default PlayerForm;
