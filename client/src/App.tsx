import React from 'react';
import './App.css';
import {BrowserRouter} from "react-router-dom";
import Routing from "./Routing";
import {UserProvider} from "./context/UserContext";
import {GameProvider} from "./context/GameContext";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <GameProvider>
          <Routing/>
        </GameProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
