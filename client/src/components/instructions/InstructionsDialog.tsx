import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle, IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";

import {Close} from "@mui/icons-material";
import TileRow from "../gameboard/TileRow";



interface StatsDialogProps {
  open: boolean
  onClose: () => void
}

export default function InstructionsDialog({ open, onClose }: StatsDialogProps) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"))

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
          How To Play
          <IconButton onClick={() => onClose()}><Close/></IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={1}>
          <Typography variant={"subtitle2"}>Guess the Wordle in 6 tries.</Typography>
          <ul>
            <li>Each guess must be a valid 5-letter word.</li>
            <li>The color of the tiles will change to show how close your guess was to the word.</li>
          </ul>
          <Typography variant={"subtitle2"} sx={{ pt: 1 }}>Guess Distribution</Typography>
          <TileRow state={"past"} guess={"WEARY"} answer={"Wwwww"} />
          <Typography variant={"caption"}>W is in the word and in the correct spot.</Typography>
          <TileRow state={"past"} guess={"PILLS"} answer={"Iwwww"} />
          <Typography variant={"caption"}>I is in the word but in the wrong spot.</Typography>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
