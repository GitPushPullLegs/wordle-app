import React, {useCallback, useEffect, useState} from "react";
import Navbar from "../components/Navbar";
import {Card} from "@mui/material";
import {grey} from "@mui/material/colors";
import TileGrid from "../components/gameboard/TileGrid";


export default function PlayPage() {

  const [guesses, setGuesses] = useState<string[]>([])
  const [currentGuess, setCurrentGuess] = useState("")

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    let key = event.key
    if (key === "Backspace") {
      setCurrentGuess(current => current.slice(0, -1))
    } else if (/^[a-zA-Z]$/i.test(key)) {
      setCurrentGuess(current => current.length >= 5 ? current : current + key.toUpperCase())
    } else if (key === "Enter") {
      if (currentGuess.length !== 5) {
        console.log("Too short.") // TODO: Inform the user.
      } else {
        console.log("Submit the guess.")
      }
    }
  }, [currentGuess, guesses])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress)

    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])

  return (<>
    <Navbar/>
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
      <TileGrid guesses={guesses} currentGuess={currentGuess} answer={"123"} />
    </Card>
  </>)
}
