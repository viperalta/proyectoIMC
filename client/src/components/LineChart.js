import React, {useEffect} from 'react';
import * as chartjs from 'chart.js';
import { Line,Bar, ChartData, LinearComponentProps } from 'react-chartjs-2';
import 'chartjs-plugin-annotation';

const LineChart = (props) => {
    
const options = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          min: 0
        }    
      }]
    }
  };

  

  //Código de options y plugins no sirve
  
    
    return (
        <div>
            <Line 
             data={{
                labels: props.labels,
                datasets: [{
                  label: 'Índice de Masa Corporal (IMC)',
                  data: props.data,
                  fill: false,
                  borderColor: 'rgb(75, 192, 192)',
                  tension: 0.1
                }]
            }}
            height={400}
            width={600}
            options = {{options}}
            plugins= {{
                autocolors: false,
                annotation: {
                    drawTime: "afterDraw",
                    events: ['dblclick'],
                    annotations: [{
                        id: 'low-box',
                      type: 'box',
                      xScaleID: 'x-axis-1',
                      yScaleID: 'y-axis-1',
                      xMin: -100,
                      xMax: 100,
                      yMin: -100,
                      yMax: -40,
                      backgroundColor: 'rgba(255, 0, 0, 0.3)',
                      //borderColor: 'rgb(255, 0, 0)',
                      borderWidth: 1
                    },{
                        id: 'hi-box',
                      type: 'box',
                      xScaleID: 'x-axis-1',
                      yScaleID: 'y-axis-1',
                      xMin: -100,
                      xMax: 100,
                      yMin: 100,
                      yMax: 40,
                      backgroundColor: 'rgba(255, 0, 0, 0.3)',
                      //borderColor: 'rgb(255, 0, 0)',
                      borderWidth: 1
                    }] }
            } }
            
            />
            
        </div>
    );
}


export default LineChart;
