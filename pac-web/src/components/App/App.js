import React from 'react';
import Router from 'components/Router';
import { BrowserRouter } from 'react-router-dom';
import ColyseusClient from 'components/ColyseusClient'; 

import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

function App() {
  return (
    <div className='App'>
      <div style={{
        height: '100%',
        backgroundImage: 'url(/background.png)',
      }} >
        <ColyseusClient>
          <BrowserRouter>
            <Router/>
          </BrowserRouter>
        </ColyseusClient>
      </div>
    </div>
  );
}

export default App;
