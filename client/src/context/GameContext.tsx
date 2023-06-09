import React, {createContext, useContext, useEffect, useState} from "react";
import useFetch from "../api/useFetch";
import {UserContext, Stats} from "./UserContext";


interface Game {
  game_id: string
  word: string
}

interface Guess {
  guess: string
}

interface GameContextData {
  game?: Game
  previousGuesses: Guess[]
  state: "loading" | "loaded" | number | string  // If the state is a number, that's the row it was solved. If it's text that's not loading or loaded, it's the answer.
  startGame: () => void
  endGame: (solvedRow?: number) => void
  getPreviousGuesses: (gameId: string) => void
  guess: (word: string) => Promise<any>
}

export const GameContext = createContext<GameContextData>({
  previousGuesses: [],
  state: "loading",
  startGame: () => {},
  endGame: () => {},
  getPreviousGuesses: () => {},
  guess: () => new Promise(() => {}),
})


export function GameProvider({ children }: { children: React.ReactNode}) {

  const fetch = useFetch()
  const { user, updateStats } = useContext(UserContext)

  const [game, setGame] = useState<Game>()
  const [previousGuesses, setPreviousGuesses] = useState<Guess[]>([])
  const [state, setState] = useState<"loading"|"loaded"|number|string>("loading")

  function startGame() {
    setState("loading")
    fetch("/api/game/start")
      .then((response: {status: string, game: Game, is_new: boolean}) => {
        setGame(response.game)
        return response
      })
      .then((response) => {
        if (!response.is_new) {
          getPreviousGuesses(response.game.game_id)
        } else {
          setState("loaded")
        }
      })
  }

  function endGame(solvedRow?: number) {
    if (game) {
      if (!solvedRow) {  // Immediately provide feedback.
        setState(game.word)
      }
      fetch("/api/game/stop", {
        args: {
          game_id: game.game_id,
          finished_at: new Date().toISOString(),
          ...(solvedRow && { solved_row: solvedRow })
        }
      })
        .then((response: { status: string, stats: object }) => {
          if (response.stats) {
            // @ts-ignore
            let newDistribution = JSON.parse(response.stats.distribution)
            updateStats({...response.stats, distribution: newDistribution} as Stats)
          }
        })
        .then(() => {
          setGame(undefined)
          setPreviousGuesses([])
        })
    } else {
      console.log("No active game.")
    }
  }

  function getPreviousGuesses(gameId: string) {
    fetch("/api/game/guess/list", {
      args: {
        game_id: gameId,
      }
    })
      .then((response: { status: string, guess_list: Guess[] }) => {
        setPreviousGuesses(response.guess_list)
      })
      .finally(() => setState("loaded"))
  }

  function guess(word: string) {
    if (game) {
      if (word.length < 5) {
        return Promise.reject("too-short")
      }
      if (word === game.word) {
        setState(previousGuesses.length + 1)
      }
      return fetch("/api/game/guess/submit", {
        args: {
          game_id: game.game_id,
          guess: word,
          is_correct: word === game.word
        }
      })
        .then((response) => {
          if (response.is_in_dictionary === false) {
            return Promise.reject("not-in-dictionary")
          } else {
            setPreviousGuesses(current => [...current, { guess: word }])
          }
          return response
        })
    } else {
      return Promise.reject("No active game")
    }
  }

  useEffect(() => {
    // End game will make game undefined. This will start a new game.
    // Also has the benefit of preloading the first game.
    if (!game && user.user_id) {
      startGame()
    }
  }, [game, user.user_id])

  useEffect(() => {
    // If the user has solved the game or if they've ran out of guesses, end the game.
    if (game && previousGuesses.length > 0) {
      if (previousGuesses[previousGuesses.length - 1].guess === game.word) {
        endGame(previousGuesses.length)
      } else if (previousGuesses.length === 6) {
        endGame()
      }
    }
  }, [previousGuesses])

  return (
    <GameContext.Provider value={{ game, previousGuesses, state, startGame, endGame, getPreviousGuesses, guess }}>
      {children}
    </GameContext.Provider>
  )
}
