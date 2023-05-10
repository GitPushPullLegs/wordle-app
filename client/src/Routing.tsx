import React, {useContext} from "react";
import {Navigate, Outlet, Route, Routes} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import {UserContext} from "./context/UserContext";
import PlayPage from "./pages/PlayPage";


function PrivateRoute() {
  const { fetchStatus, user } = useContext(UserContext)

  if (fetchStatus === "fetched" && user.user_id) {  // If fetched and user found, continue.
    return <Outlet/>
  } else if (fetchStatus === "fetched" || fetchStatus === "failed") {  // Else, redirect to log in.
    return <Navigate to={"/w/"} />
  } else {  // If still fetching.
    return <></>
  }
}

export default function Routing() {
  return (
    <Routes>
      <Route path={"/w/"} element={<LoginPage/>} />
      <Route element={<PrivateRoute/>}>
        <Route path={"/w/play"} element={<PlayPage/>} />
      </Route>
      <Route path={"*"} element={<Navigate to={"/w/"} replace />} />
    </Routes>
  )
}
