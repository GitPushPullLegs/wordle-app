import React from "react";
import {Alert, Snackbar} from "@mui/material";


interface FeedbackSnackbarProps {
  open: boolean
  onClose: () => void
  value: number | string
  validWord?: "not-in-dictionary" | "too-short"
}

export default function FeedbackSnackbar({ open, onClose, value, validWord }: FeedbackSnackbarProps) {
  const messages = [
    "Amazing!",
    "Great job!",
    "Nice work!",
    "You win!",
    "Phew!",
    "Barely made it!",
    `Oops! It was ${value}!`,
  ]

  const wordMessages = {
    "not-in-dictionary": "Not a valid word!",
    "too-short": "Too short!",
  }

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
        {validWord ? wordMessages[validWord] : messages[typeof value === "string" ? messages.length - 1 : value - 1]}
      </Alert>
    </Snackbar>
  )
}
