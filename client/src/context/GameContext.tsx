import React, {createContext, useState} from "react";


interface Game {
  game_id: string
  word: string
}

interface GameContextData {
  game?: Game
  startGame: () => void
  endGame: () => void
  getPreviousGuesses: () => void
  guess: (word: string) => void
}

export const GameContext = createContext<GameContextData>({
  startGame: () => {},
  endGame: () => {},
  getPreviousGuesses: () => {},
  guess: () => {},
})


export function GameProvider({ children }: { children: React.ReactNode}) {
  const [game, setGame] = useState<Game>()
  function startGame() {
    console.log("start game")
  }

  function endGame() {
    console.log("end game")
  }

  function getPreviousGuesses() {
    console.log("get previous guesses")
  }

  function guess(word: string) {
    console.log(word)
  }

  return (
    <GameContext.Provider value={{ game, startGame, endGame, getPreviousGuesses, guess }}>
      {children}
    </GameContext.Provider>
  )
}
