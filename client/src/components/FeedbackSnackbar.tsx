import React from "react";
import {Alert, Snackbar} from "@mui/material";


interface FeedbackSnackbarProps {
  open: boolean
  onClose: () => void
  value: number | string
}

export default function FeedbackSnackbar({ open, onClose, value }: FeedbackSnackbarProps) {
  const messages = [
    "Amazing!",
    "Great job!",
    "Nice work!",
    "You win!",
    "Phew!",
    "Barely made it!",
    `Oops! It was ${value}!`,
    "Too short!",
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
      <Alert icon={false} severity={typeof value === "number" ? "success" : "error"} sx={{ width: '100%' }}>
        {messages[typeof value === "string" ? (value === "too-short" ? messages.length - 1 : messages.length - 2) : value - 1]}
      </Alert>
    </Snackbar>
  )
}
