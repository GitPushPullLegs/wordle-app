import React from "react";
import {Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";


export default function Logo() {
  const navigate = useNavigate()
  return (
    <Typography
      variant="h6"
      noWrap
      onClick={() => navigate("/")}
      sx={{
        fontFamily: 'monospace',
        fontWeight: 700,
        letterSpacing: '.3rem',
        color: 'inherit',
        textDecoration: 'none',
      }}
    >
      Wordle
    </Typography>
  )
}
