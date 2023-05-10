import React from "react";
import {Route, Routes} from "react-router-dom";
import LoginPage from "./pages/LoginPage";

export default function Routing() {
  return (
    <Routes>
      <Route path={"/"} element={<LoginPage/>} />
    </Routes>
  )
}
