import { createTheme } from "@mui/material/styles";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#b2874a",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#5c4033",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f8f4ed",
      paper: "#ffffff",
    },
    text: {
      primary: "#1d1b18",
      secondary: "#5f5245",
    },
  },
  typography: {
    fontFamily: ["Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
    h1: {
      fontWeight: 700,
      fontSize: "3rem",
      letterSpacing: "-0.03em",
    },
    h2: {
      fontWeight: 700,
      fontSize: "2.5rem",
    },
    h3: {
      fontWeight: 700,
      fontSize: "2rem",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.75,
    },
    button: {
      textTransform: "none",
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#f8f4ed",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: "0 16px 40px rgba(34, 35, 58, 0.08)",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 14,
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          backgroundColor: "#fdf7ee",
          transition: "background-color 200ms ease",
          "&:hover": {
            backgroundColor: "#fff7e6",
          },
          "&.Mui-focused": {
            backgroundColor: "#ffffff",
          },
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        ul: {
          gap: "12px",
        },
      },
    },
  },
});

export default theme;
