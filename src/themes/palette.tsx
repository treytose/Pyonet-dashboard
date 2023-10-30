import { createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#55a2e6",
    },
    secondary: {
      main: "#cc3838",
    },
    error: {
      main: "#b71c1c",
    },
    background: {
      default: "#282c34",
      paper: "#24272e",
    },
  },
});
