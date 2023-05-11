import React, {useState} from "react";
import {AppBar, IconButton, Stack, Toolbar} from "@mui/material";
import Logo from "./Logo";
import StatsChip from "./stats/StatsChip";
import {Help} from "@mui/icons-material";
import InstructionsDialog from "./instructions/InstructionsDialog";

export default function Navbar() {

  const [openInstructions, setOpenInstructions] = useState(false)

  return (<>
    <AppBar position={"static"} elevation={0} sx={{
      backgroundColor: "#fff",
      color: "#000",
      position: "fixed",
    }}>
      <Toolbar>
        <Logo/>
        <div style={{ flex: "1 0 0" }} />
        <Stack spacing={0.5} direction={"row"} alignItems={"center"}>
          <StatsChip />
          <IconButton onClick={() => setOpenInstructions(true)}><Help/></IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
    <InstructionsDialog open={openInstructions} onClose={() => setOpenInstructions(false)} />
  </>)
}
