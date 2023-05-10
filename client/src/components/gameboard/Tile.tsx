import React from "react";
import {Paper, Typography} from "@mui/material";
import {grey} from "@mui/material/colors";


interface TileProps {
  letter?: string
  state?: "correct" | "in-word" | "not-in-word"
  reveal: boolean
}

export default function Tile({ letter, state, reveal = false }: TileProps) {
  return (
    <Paper
      sx={{
        bgcolor: reveal ? (state === "correct" ? "success.main" : state === "in-word" ? "warning.main" : grey[800]) : grey[50],
        width: 50,
        height: 50,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography
        variant={"h4"}
        sx={{
          color: reveal ? "white": "black",
        }}
      >
        {letter}
      </Typography>
    </Paper>
  )
}
