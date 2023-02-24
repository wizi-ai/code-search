import { useState } from "react";

import Head from "next/head";
import { Inter } from "@next/font/google";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

import Container from "@mui/material/Container";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import LoadingButton from "@mui/lab/LoadingButton";
import CircularProgress from "@mui/material/CircularProgress";
import LaunchIcon from "@mui/icons-material/Launch";

import Text from "components/Text";
import Layout from "components/Layout";

const inter = Inter({ subsets: ["latin"] }); // <h2 className={inter.className}>

interface CodeSnippet {
  code: string;
  filepath: string;
  id: string;
  line_start: number;
  line_end: number;
  score: number;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [initComponentLoading, setInitComponentLoading] = useState(false);
  const [githubUrl, setGithubUrl] = useState(
    "https://github.com/zalkar-z/withpotential.io/tree/main/"
  );

  if (initComponentLoading) {
    return (
      <>
        <main>
          <Layout>
            <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
              <CircularProgress
                color="primary"
                sx={{ position: "absolute", top: "50%", left: "50%" }}
              />
            </Container>
          </Layout>
        </main>
      </>
    );
  }

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
      <main>
        <Layout>
          <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
            <>
              <Grid container>
                <Text type="header" variant="h4">
                  Settings
                </Text>
              </Grid>
              <Grid container sx={{ mt: 2 }}>
                <Text type="header" variant="subtitle2">
                  Please visit{" "}
                  <a
                    href="https://github.com/wizi-ai/code-search"
                    target="_blank"
                    rel="noreferrer"
                  >
                    https://github.com/wizi-ai/code-search
                  </a>{" "}
                  for more information.
                </Text>
              </Grid>
            </>
          </Container>
        </Layout>
      </main>
    </>
  );
}
