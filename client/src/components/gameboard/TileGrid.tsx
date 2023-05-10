import React from "react";
import {Stack} from "@mui/material";
import TileRow from "./TileRow";


interface TileGridProps {
  guesses: string[]
  currentGuess: string
  answer: string
}

export default function TileGrid({ guesses, currentGuess, answer }: TileGridProps) {
  return (
    <Stack spacing={1} sx={{ p: 2 }}>
      {/* Renders a TileRow for each past guess. */}
      {guesses.map((guess, i) => (
        <TileRow key={i} state={"past"} guess={guess} answer={answer} />
      ))}
      {/* If we haven't ran out of chances, render a current guess row. */}
      {guesses.length < 6 && (
        <TileRow guess={currentGuess} state={"current"} answer={answer} />
      )}
      {/* If the user hasn't ran out of chances, render the future chances so the grid doesn't grow with every submit. */}
      {Array.from({ length: 5 - guesses.length }, (_, i) => (
        <TileRow key={i} guess={""} state={"future"} answer={answer} />
      ))}
    </Stack>
  )
}
