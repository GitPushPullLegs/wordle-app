import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";
import useFetch from "../api/useFetch";


interface User {
  user_id: string
  first_name?: string
  last_name?: string
  full_name?: string

  level: number

  // These may be moved to a new model, but I'll start them here.
  current_streak: number
  longest_streak: number
}

type FetchStatus = "fetching" | "fetched" | "failed"

interface UserContextData {
  user: User,
  fetchStatus?: FetchStatus
}

const UserContext = createContext<UserContextData>({
  user: {
    user_id: "",
    level: 1,
    current_streak: 0,
    longest_streak: 0,
  }
})

export function UserProvider({ children }: { children: ReactNode }) {
  const fetch = useFetch()

  const [user, setUser] = useState<User>({
    user_id: "",
    level: 1,
    current_streak: 0,
    longest_streak: 0,
  })
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>()

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

  return (
    <UserContext.Provider value={{ user, fetchStatus }}>
      {children}
    </UserContext.Provider>
  )
}

export default function useUser() {
  const { user } = useContext(UserContext)
  return user
}
