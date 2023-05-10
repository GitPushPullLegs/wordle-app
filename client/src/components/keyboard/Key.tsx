import React from "react";
import {Button} from "@mui/material";
import {grey} from "@mui/material/colors";


interface KeyProps {
  value: string
  onClick: (value: string) => void
  state: "in-word" | "not-in-word" | "unknown"
  width?: number | string
}


export default function Key({ value, onClick, state, width }: KeyProps) {
  return (
    <Button
      sx={{
        bgcolor: state !== "unknown" ? (state === "in-word" ? "success.main" : grey[800]) : grey[50],
        color: state !== "unknown" ? "white" : grey[800],
        flex: 1,
        ...(width ? { minWidth: width } : {})
      }}
      size={"small"}
      onClick={() => onClick(value)}
    >
      {value}
    </Button>
  )
}
