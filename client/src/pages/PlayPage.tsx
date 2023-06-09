import React, {useCallback, useContext, useEffect, useState} from "react";
import Navbar from "../components/Navbar";
import {Backdrop, Card, CircularProgress} from "@mui/material";
import {grey} from "@mui/material/colors";
import TileGrid from "../components/gameboard/TileGrid";
import {GameContext} from "../context/GameContext";
import Keyboard from "../components/keyboard/Keyboard";
import FeedbackSnackbar from "../components/FeedbackSnackbar";


export default function PlayPage() {

  const { game, previousGuesses, state, guess } = useContext(GameContext)
  const [currentGuess, setCurrentGuess] = useState("")
  const [inWordKeys, setInWordKeys] = useState<string[]>([])
  const [notInWordKeys, setNotInWordKeys] = useState<string[]>([])
  const [showSnack, setShowSnack] = useState(false)
  const [wordState, setWordState] = useState<"not-in-dictionary"|"too-short">()

  const handleInput = (key: string) => {
    if (state === "loading") return
    if (key === "Backspace" || key === "Delete") {
      setCurrentGuess(current => current.slice(0, -1))
    } else if (/^[a-zA-Z]$/i.test(key)) {  // Ensure that the key is a letter.
      setCurrentGuess(current => current.length >= 5 ? current : current + key.toUpperCase())
    } else if (key === "Enter") {
      guess(currentGuess)
        .catch((err) => {
          if (err === "too-short") {
            setWordState("too-short")
          } else if (err === "not-in-dictionary") {
            setWordState("not-in-dictionary")
          }
        })
        .finally(() => setCurrentGuess(""))
    }
  }

  /** Responds to on-screen keyboard key presses. */
  const handleKeyClick = (key: string) => {
    handleInput(key)
  }

  /** Responds to physical keyboard key presses. */
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    let key = event.key
    handleInput(key)
  }, [currentGuess, previousGuesses, state])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress)

    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])

  useEffect(() => {
    if (previousGuesses.length > 0) {
      let newInWordKeys: string[] = []
      let newNotInWordKeys: string[] = []
      previousGuesses.forEach((guess) => {
        const splitGuess = guess.guess.split("")
        splitGuess.forEach((letter) => {
          if (game?.word.includes(letter)) {
            newInWordKeys.push(letter)
          } else {
            newNotInWordKeys.push(letter)
          }
        })
      })
      setInWordKeys(newInWordKeys)
      setNotInWordKeys(newNotInWordKeys)
    }
  }, [previousGuesses])

  // Provide the user with feedback if they won or lost.
  useEffect(() => {
    if (typeof state === "number" || (state !== "loading" && state !== "loaded")) {
      setShowSnack(true)
      setInWordKeys([])
      setNotInWordKeys([])
    }
  }, [state])

  // Provide the user feedback if their word is not in the dictionary or too short.
  useEffect(() => {
    if (wordState === "not-in-dictionary") {
      setShowSnack(true)
    } else if (wordState === "too-short") {
      setShowSnack(true)
    }
  }, [wordState])

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
      <Backdrop open={state === "loading"} sx={{ bgcolor: "rgba(227, 242, 253, 0.5)"}}>
        <CircularProgress />
      </Backdrop>
      <TileGrid guesses={previousGuesses.map(g => g.guess)} currentGuess={currentGuess} answer={game?.word ?? ""} />
    </Card>
    <Keyboard onClick={handleKeyClick} inWordKeys={inWordKeys} notInWordKeys={notInWordKeys} />
    <FeedbackSnackbar open={showSnack} onClose={() => {
      setShowSnack(false)
      if (wordState) {
        setWordState(undefined)
      }
    }} value={state} validWord={wordState} />
  </>)
}
