import React from 'react';
import Router from 'components/Router';
import { BrowserRouter } from 'react-router-dom';
import ColyseusClient from 'components/ColyseusClient'; 

import 'bootstrap/dist/css/bootstrap.min.css';
import './app.scss';
import './fonts.scss';

function App() {
  return (
    <div className='App'>
      <ColyseusClient>
        <BrowserRouter>
          <Router/>
        </BrowserRouter>
      </ColyseusClient>
    </div>
  );
}

export default App;
