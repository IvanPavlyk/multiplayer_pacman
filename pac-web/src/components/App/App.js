import Router from "components/Router";
import { BrowserRouter } from "react-router-dom";
import { Client } from 'colyseus.js';

import 'styles/reset.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'styles/index.css'
import './app.css';

// initialize client-side server communication
window.colyseus = new Client('ws://localhost:3000');

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </div>
  )
};

export default App;
