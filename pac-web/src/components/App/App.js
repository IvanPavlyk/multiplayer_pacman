import Router from "components/Router";
import { BrowserRouter } from "react-router-dom";

import './app.css';
import 'bootstrap/dist/css/bootstrap.min.css';

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
