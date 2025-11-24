 import React, { useState, useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import FullWidthMenu from "./FullWidthMenu";


export default function LightDarkTheme() {

const [mode, setMode] = useState("light");
const theme = useMemo(
() =>
createTheme({
palette: {
mode,
primary: {
main: mode === "light" ? "#1976d2" : "#90caf9",
},
background: {
default: mode === "light" ? "#fff" : "#121212",
paper: mode === "light" ? "#fff" : "#1e1e1e",
},
customBg:{
    Highlight:mode ==="light" ? "f0f4f8" : "#1a1a1a"
}
},
}),
[mode]
);
const toggleTheme = () => {
setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
};
return (
<ThemeProvider theme={theme}>
<CssBaseline />
<FullWidthMenu toggleTheme={toggleTheme} mode={mode} />

</ThemeProvider>
);
}