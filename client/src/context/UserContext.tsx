import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";
import useFetch from "../api/useFetch";


interface User {
  user_id?: string
  first_name?: string
  last_name?: string
  full_name?: string

  level: number
}

type FetchStatus = "fetching" | "fetched" | "failed"

interface UserContextData {
  user: User,
  fetchStatus?: FetchStatus
}

export const UserContext = createContext<UserContextData>({
  user: {
    level: 1,
  }
})

export function UserProvider({ children }: { children: ReactNode }) {
  const fetch = useFetch()

  const [user, setUser] = useState<User>({
    level: 1,
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
