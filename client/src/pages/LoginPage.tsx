import React, {useContext, useEffect} from "react";
import {UserContext} from "../context/UserContext";
import {useNavigate} from "react-router-dom";


export default function LoginPage() {

  const { fetchStatus, user } = useContext(UserContext)

  const navigate = useNavigate()
  useEffect(() => {
    if (fetchStatus === "fetched" && user.user_id) {
      navigate("/play")
    }
  }, [user])

  return (
    <>
      <h1>Login Page</h1>
    </>
  )
}
