import React from 'react';
import './App.css';
import {BrowserRouter} from "react-router-dom";
import Routing from "./Routing";
import {UserProvider} from "./context/UserContext";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routing/>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
