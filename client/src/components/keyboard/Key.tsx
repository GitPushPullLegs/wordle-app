import React from "react";
import {Button} from "@mui/material";
import {grey} from "@mui/material/colors";


interface KeyProps {
  value: string
  onClick: (value: string) => void
  state: "in-word" | "not-in-word" | "unknown"
}


export default function Key({ value, onClick, state }: KeyProps) {
  return (
    <Button
      sx={{
        bgcolor: state !== "unknown" ? (state === "in-word" ? "success.main" : grey[800]) : grey[50],
        color: state !== "unknown" ? "white" : grey[800],
      }}
      onClick={() => onClick(value)}
    >
      {value}
    </Button>
  )
}
