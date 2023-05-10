import React, {useContext, useEffect, useState} from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle, IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import {UserContext} from "../../context/UserContext";
import {
  Bar,
} from "react-chartjs-2";
import {Chart, registerables} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {Close} from "@mui/icons-material";

Chart.register(...registerables);


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
      <DialogTitle>
        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
          Your Stats
          <IconButton onClick={() => onClose()}><Close/></IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={1}>
          <Typography variant={"subtitle2"}>Statistics</Typography>
          <Stack direction={"row"} spacing={2} justifyContent={"space-between"}>
            <StatItem label={"Played"} value={stats?.games_played ?? 0} />
            <StatItem label={"Win %"} value={winPercentage ?? 0} />
            <StatItem label={"Current Streak"} value={stats?.current_streak ?? 0} />
            <StatItem label={"Max Streak"} value={stats?.longest_streak ?? 0} />
          </Stack>
          <Typography variant={"subtitle2"} sx={{ pt: 1 }}>Guess Distribution</Typography>
          <DistributionChart />
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

function DistributionChart() {

  const { stats } = useContext(UserContext)

  const data = {
    labels: ["1", "2", "3", "4", "5", "6"],
    datasets: [
      {
        label: "Guess Distribution",
        data: stats?.distribution ? Object.values(stats.distribution): [0, 0, 0, 0, 0, 0],
        borderWidth: 1,
      }
    ]
  }

  return (
    <Bar
      data={data}
      options={{
        indexAxis: "y",
        plugins: {
          title: {
            display: false,
            text: "Guess Distribution",
          },
          legend: { display: false },
          datalabels: {
            color: "#000",
            align: "center",
            anchor: "end",
            font: { weight: "bold" },
            formatter: function(value) { return value ? `${value}      ` : "" }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { display: false }
          },
          y: { grid: { display: false } }
        },
      }}
      plugins={[ChartDataLabels]}
    />
  )
}
