import React, {useContext} from "react";
import {Avatar, Chip, Typography} from "@mui/material";
import {UserContext} from "../../context/UserContext";
import {grey} from "@mui/material/colors";


export default function StatsChip() {
  const { stats } = useContext(UserContext)

  const newLongestStreak = (stats?.current_streak ?? 0) < (stats?.longest_streak ?? 1)

  return (
    <Chip
      avatar={
        <Avatar sx={{ bgcolor: newLongestStreak ? "success.main": grey[300] }}>
          <Typography variant={"subtitle2"} color={newLongestStreak ? "white" : "black"}>{stats?.current_streak ?? 0}</Typography>
        </Avatar>
      }
      label={"Current Streak"}
    />
  )
}
