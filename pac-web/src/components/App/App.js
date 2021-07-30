import React from 'react';
import Router from 'components/Router';
import { BrowserRouter } from 'react-router-dom';
import ColyseusClient from 'components/ColyseusClient'; 
import NavigationBar from 'components/NavigationBar';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className='App'>
      <NavigationBar>
        <ColyseusClient>
          <BrowserRouter>
            <Router/>
          </BrowserRouter>
        </ColyseusClient>
      </NavigationBar>
    </div>
  );
}

export default App;
