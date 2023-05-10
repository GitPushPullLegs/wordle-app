import React, {createContext, ReactNode, useEffect, useState} from "react";
import useFetch from "../api/useFetch";


interface User {
  user_id?: string
  first_name?: string
  last_name?: string
  full_name?: string

  level: number
}

export interface Stats {
  user_id: string
  games_played: number
  current_streak: number
  longest_streak: number
  distribution: { [key: string]: number }
}

type FetchStatus = "fetching" | "fetched" | "failed"

interface UserContextData {
  user: User,
  stats?: Stats,
  fetchStatus?: FetchStatus
  updateStats: (newStats: Stats) => void
}

export const UserContext = createContext<UserContextData>({
  user: {
    level: 1,
  },
  updateStats: () => {},
})

export function UserProvider({ children }: { children: ReactNode }) {
  const fetch = useFetch()

  const [user, setUser] = useState<User>({
    level: 1,
  })
  const [stats, setStats] = useState<Stats>({
    user_id: "",
    games_played: 0,
    current_streak: 0,
    longest_streak: 0,
    distribution: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
  })

  const [fetchStatus, setFetchStatus] = useState<FetchStatus>()

  const updateStats = (newStats: Stats) => {
    setStats(newStats)
  }

  useEffect(() => {
    if (!fetchStatus) {
      fetch("/api/user/")
        .then((response: {status: string, user?: User}) => {
          if (response.user) {
            setUser(response.user)
            setFetchStatus("fetched")
          } else {
            setFetchStatus("failed")
          }
        })
        .catch((err) => {
          console.log(err)
          setFetchStatus("failed")
        })
    }
  }, [])

  useEffect(() => {
    if (user.user_id && stats.user_id === "") {
      fetch("/api/user/stats")
        .then((response: {status: string, stats?: any}) => {
          if (response.stats) {
            let newDistribution = JSON.parse(response.stats.distribution)
            setStats({...response.stats, distribution: newDistribution})
          }
        })
    }
  }, [user.user_id])

  return (
    <UserContext.Provider value={{ user, stats, updateStats, fetchStatus }}>
      {children}
    </UserContext.Provider>
  )
}
