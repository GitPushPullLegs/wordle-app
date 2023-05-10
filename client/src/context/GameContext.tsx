import React, {createContext, useEffect, useState} from "react";
import useFetch from "../api/useFetch";


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
  startGame: () => void
  endGame: (solvedRow?: number) => void
  getPreviousGuesses: (gameId: string) => void
  guess: (word: string) => void
}

export const GameContext = createContext<GameContextData>({
  previousGuesses: [],
  startGame: () => {},
  endGame: () => {},
  getPreviousGuesses: () => {},
  guess: () => {},
})


export function GameProvider({ children }: { children: React.ReactNode}) {
  const fetch = useFetch()

  const [game, setGame] = useState<Game>()
  const [previousGuesses, setPreviousGuesses] = useState<Guess[]>([])

  function startGame() {
    fetch("/api/game/start")
      .then((response: {status: string, game: Game, is_new: boolean}) => {
        setGame(response.game)
        return response
      })
      .then((response) => {
        if (!response.is_new) {
          getPreviousGuesses(response.game.game_id)
        }
      })
  }

  function endGame(solvedRow?: number) {
    if (game) {
      fetch("/api/game/stop", {
        args: {
          game_id: game.game_id,
          finished_at: new Date().toISOString(),
          ...(solvedRow && { solved_row: solvedRow })
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
  }

  function guess(word: string) {
    if (game) {
      setPreviousGuesses(current => [...current, { guess: word }])
      fetch("/api/game/guess/submit", {
        args: {
          game_id: game.game_id,
          guess: word,
          correct: word === game.word
        }
      })
    } else {
      console.log("No active game.")
    }
  }

  useEffect(() => {
    // End game will make game undefined. This will start a new game.
    // Also has the benefit of preloading the first game.
    if (!game) {
      startGame()
    }
  }, [game])

  return (
    <GameContext.Provider value={{ game, previousGuesses, startGame, endGame, getPreviousGuesses, guess }}>
      {children}
    </GameContext.Provider>
  )
}
