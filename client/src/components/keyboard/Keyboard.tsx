import React from "react";
import {Stack} from "@mui/material";
import Key from "./Key";


interface KeyboardProps {
  onClick: (value: string) => void
  inWordKeys: string[]
  notInWordKeys: string[]
}


export default function Keyboard({ onClick, inWordKeys, notInWordKeys }: KeyboardProps) {
  return (
    <Stack
      spacing={1}
      alignItems={"center"}
      sx={{
        position: "absolute",
        bottom: "0%",
        left: "50%",
        transform: "translate(-50%, -20%)",
      }}
    >
      <Stack direction={"row"} spacing={1}>
        {["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].map((v => (
          <Key key={v} value={v} onClick={onClick} state={inWordKeys.includes(v) ? "in-word" : (notInWordKeys.includes(v) ? "not-in-word" : "unknown")} />
        )))}
      </Stack>
      <Stack direction={"row"} spacing={1}>
        {["A", "S", "D", "F", "G", "H", "J", "K", "L"].map((v => (
          <Key key={v} value={v} onClick={onClick} state={inWordKeys.includes(v) ? "in-word" : (notInWordKeys.includes(v) ? "not-in-word" : "unknown")} />
        )))}
      </Stack>
      <Stack direction={"row"} spacing={1}>
        <Key value={"Enter"} onClick={onClick} state={"unknown"} />
        {["Z", "X", "C", "V", "B", "N", "M"].map((v => (
          <Key key={v} value={v} onClick={onClick} state={inWordKeys.includes(v) ? "in-word" : (notInWordKeys.includes(v) ? "not-in-word" : "unknown")} />
        )))}
        <Key value={"Delete"} onClick={onClick} state={"unknown"} />
      </Stack>
    </Stack>
  )
}
