import React from "react";
import {Stack} from "@mui/material";
import Tile from "./Tile";

interface TileRowProps {
  state: "past" | "current" | "future"
  guess: string
  answer: string
}

export default function TileRow({ guess, state, answer }: TileRowProps) {
  const splitGuess = guess.split("")
  const splitAnswer = answer.split("")

  const remainingTiles = 5 - splitGuess.length

  return (
    <Stack direction={"row"} spacing={1}>
      {splitGuess.map((letter, i) => (
        <Tile
          key={i}
          letter={letter}
          state={answer.includes(letter) ? (splitAnswer[i] === letter ? "correct" : "in-word") : "not-in-word"}
          reveal={state === "past"}  // Only reveal the tile if the guess is in the past. On submit, the guess becomes a past guess.
        />
      ))}
      {/* Render any remaining empty tiles since we need 5 for the row. */}
      {Array.from({ length: remainingTiles }, (_, i) => <Tile key={i} reveal={false} />)}
    </Stack>
  )
}
