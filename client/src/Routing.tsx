import React, {useContext} from "react";
import {Navigate, Outlet, Route, Routes} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import {UserContext} from "./context/UserContext";


function PrivateRoute() {
  const { fetchStatus, user } = useContext(UserContext)

  if (fetchStatus === "fetched" && user.user_id) {  // If fetched and user found, continue.
    return <Outlet/>
  } else if (fetchStatus === "fetched" || fetchStatus === "failed") {  // Else, redirect to log in.
    return <Navigate to={"/"} />
  } else {  // If still fetching.
    return <></>
  }
}

export default function Routing() {
  return (
    <Routes>
      <Route path={"/"} element={<LoginPage/>} />
      <Route element={<PrivateRoute/>}>
        <Route path={"/play"} element={<>Play</>} />
      </Route>
    </Routes>
  )
}
