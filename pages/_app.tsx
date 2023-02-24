import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

export default function App({ Component, pageProps }: AppProps) {
  const mdTheme = createTheme({
    palette: {
      mode: "dark",
      text: {
        primary: "#fff",
        secondary: "#888",
        disabled: "#888",
      },
      primary: {
        main: "#00df98", // green: #00df98
      },
      secondary: {
        main: "#fff",
      },
      background: {
        default: "#000", // background: #000
        paper: "#000", // use #111 for secondary
      },
      divider: "#333", // borders: #333
      info: {
        main: "#006ff3",
      },
      error: {
        main: "#ff0000",
      },
      warning: {
        main: "#ffff00",
      },
    },
    typography: {
      fontWeightLight: 200,
      fontWeightRegular: 400,
      fontWeightMedium: 400,
      fontWeightBold: 600,
      h1: {
        fontWeight: 600,
        fontSize: "2.4rem",
      },
      h2: {
        fontWeight: 600,
        fontSize: "2.4rem",
      },
      h3: {
        fontWeight: 600,
        fontSize: "1.5rem",
      },
      h4: {
        fontWeight: 600,
        fontSize: "1.5rem",
      },
      h5: {
        fontWeight: 600,
        fontSize: "1.2rem",
      },
      h6: {
        fontWeight: 600,
        fontSize: "1.2rem",
      },
      subtitle1: {
        fontWeight: 600,
        fontSize: "1rem",
      },
      subtitle2: {
        fontWeight: 600,
        fontSize: "0.875rem",
      },
      body1: {
        fontWeight: 400,
        fontSize: "1rem",
      },
      body2: {
        fontWeight: 400,
        fontSize: "0.875rem",
      },
      button: {
        textTransform: "none",
        fontWeight: 600,
        fontSize: "0.9rem",
      },
      fontFamily: [
        "Inter",
        "Roboto",
        "-apple-system",
        "BlinkMacSystemFont",
        "Segoe UI",
      ].join(","),
    },
  });
  return (
    <>
      <Head>
        <title>Wizi - AI powered frontend tools</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider theme={mdTheme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
