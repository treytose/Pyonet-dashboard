import React from "react";
import logo from "./logo.svg";
import "./App.css";

import { Link, Outlet } from "react-router-dom";
import { Button } from "@mui/material";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <Link to="/dashboard">
          <Button variant="contained"> Dashboard </Button>
        </Link>

        <Outlet />
      </header>
    </div>
  );
}

export default App;
