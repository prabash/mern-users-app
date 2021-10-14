import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "../components/login/login.jsx"

import Menu from '../components/menu/menu.jsx'
import UserHome from '../components/user-home/user-home.jsx'

function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      {/* <Menu/> */}
      <Router>
        <Switch>
          <Route path='/login' component={Login} />
          <Route path='/' component={() => <Menu /> } />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
