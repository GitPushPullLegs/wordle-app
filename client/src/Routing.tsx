import React from "react";
import {Route, Routes} from "react-router-dom";

export default function Routing() {
  return (
    <Routes>
      <Route path={"/"} element={<>Hello World</>} />
    </Routes>
  )
}
