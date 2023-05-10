import React, {useContext, useEffect, useState} from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import {UserContext} from "../../context/UserContext";


interface StatsDialogProps {
  open: boolean
  onClose: () => void
}

export default function StatsDialog({ open, onClose }: StatsDialogProps) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"))

  const { stats } = useContext(UserContext)
  const [winPercentage, setWinPercentage] = useState(0)
  useEffect(() => {
    if (stats) {
      let gamesWon = Object.values(stats.distribution).reduce((a, b) => a + b, 0)
      setWinPercentage(Math.round((gamesWon / stats.games_played) * 100))
    }
  }, [stats?.games_played])

  return (
    <Dialog
      open={open}
      fullScreen={fullScreen}
      onClose={onClose}
      maxWidth={"xs"}
      fullWidth
    >
      <DialogTitle>Your Stats</DialogTitle>
      <DialogContent>
        <Stack spacing={1}>
          <Typography variant={"subtitle2"}>Statistics</Typography>
          <Stack direction={"row"} spacing={2} justifyContent={"space-between"}>
            <StatItem label={"Played"} value={stats?.games_played ?? 0} />
            <StatItem label={"Win %"} value={winPercentage} />
            <StatItem label={"Current Streak"} value={stats?.current_streak ?? 0} />
            <StatItem label={"Max Streak"} value={stats?.longest_streak ?? 0} />
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

function StatItem({ label, value }: { label: string, value: string | number }) {
  return (
    <Stack direction={"column"} spacing={0} alignItems={"center"}>
      <Typography>{value}</Typography>
      <Typography variant={"caption"}>{label}</Typography>
    </Stack>
  )
}
