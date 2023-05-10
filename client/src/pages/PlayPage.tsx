import React, {useCallback, useContext, useEffect, useState} from "react";
import Navbar from "../components/Navbar";
import {Card} from "@mui/material";
import {grey} from "@mui/material/colors";
import TileGrid from "../components/gameboard/TileGrid";
import {GameContext} from "../context/GameContext";


export default function PlayPage() {

  const { game, previousGuesses, state, guess } = useContext(GameContext)
  const [currentGuess, setCurrentGuess] = useState("")

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (state === "loading") return
    let key = event.key
    if (key === "Backspace") {
      setCurrentGuess(current => current.slice(0, -1))
    } else if (/^[a-zA-Z]$/i.test(key)) {  // Ensure that the key is a letter.
      setCurrentGuess(current => current.length >= 5 ? current : current + key.toUpperCase())
    } else if (key === "Enter") {
      if (currentGuess.length !== 5) {
        console.log("Too short.") // TODO: Inform the user.
      } else {
        guess(currentGuess)
        setCurrentGuess("")
      }
    }
  }, [currentGuess, previousGuesses, state])

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
      <TileGrid guesses={previousGuesses.map(g => g.guess)} currentGuess={currentGuess} answer={game?.word ?? ""} />
    </Card>
  </>)
}
