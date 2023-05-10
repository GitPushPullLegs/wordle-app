import React from "react";
import {AppBar, Toolbar} from "@mui/material";
import Logo from "./Logo";

export default function Navbar() {
  return (<>
    <AppBar position={"static"} elevation={0} sx={{
      backgroundColor: "#fff",
      color: "#000",
      position: "fixed",
    }}>
      <Toolbar>
        <Logo/>
      </Toolbar>
    </AppBar>
  </>)
}
