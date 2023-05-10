import React, {useContext, useEffect} from "react";
import {UserContext} from "../context/UserContext";
import {useNavigate} from "react-router-dom";
import {Card, Stack, Typography} from "@mui/material";
import {grey} from "@mui/material/colors";
import Logo from "../components/Logo";
import {LoadingButton} from "@mui/lab";


export default function LoginPage() {

  const { fetchStatus, user } = useContext(UserContext)

  const navigate = useNavigate()
  useEffect(() => {
    if (fetchStatus === "fetched" && user.user_id) {
      navigate("/w/play")
    }
  }, [user])

  return (
    <Card
      variant={"outlined"}
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        bgcolor: grey[50]
      }}
    >
      <Stack
        sx={{ p: 2 }}
        spacing={2}
        alignItems={"center"}
      >
        <Logo/>
        <Typography variant={"h6"}>{`Ready to play?`}</Typography>
        <LoadingButton
          variant={"outlined"}
          component={"a"}
          href={"/api/auth/login"}
          loading={fetchStatus === "fetching"}
          startIcon={
            <img
              src={"https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"}
              width={20}
              alt={"Google sign-in"}
            />}
          sx={{ width: "max-content"}}
        >
          {`Continue with Google`}
        </LoadingButton>
      </Stack>
    </Card>
  )
}
