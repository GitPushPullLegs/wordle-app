import React from "react";
import {Alert, Snackbar} from "@mui/material";


interface FeedbackSnackbarProps {
  answer: string
  open: boolean
  onClose: () => void
  row: number
}

export default function FeedbackSnackbar({ answer, open, onClose, row }: FeedbackSnackbarProps) {
  const messages = [
    "Amazing!",
    "Great job!",
    "Nice work!",
    "You win!",
    "Phew!",
    "Barely made it!",
    `Oops! It was ${answer}!`,
  ]

  return (
    <Snackbar
      open={open}
      autoHideDuration={2225}
      onClose={() => onClose()}
      anchorOrigin={{
        vertical: "top",
        horizontal: "center"
      }}
    >
      <Alert icon={false} severity={row > 0 ? "success" : "error"} sx={{ width: '100%' }}>
        {messages[row === 0 ? messages.length - 1 : row - 1]}
      </Alert>
    </Snackbar>
  )
}
