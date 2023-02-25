import { useEffect, useState } from "react";

import Head from "next/head";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

import { Octokit } from "octokit";
import path from "path";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
// import { encoding_for_model } from "@dqbd/tiktoken";
import { PineconeStore } from "langchain/vectorstores";
import { OpenAIEmbeddings } from "langchain/embeddings";
import { PineconeClient } from "pinecone-client";

import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import LoadingButton from "@mui/lab/LoadingButton";
import LaunchIcon from "@mui/icons-material/Launch";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import Text from "components/Text";
import Layout from "components/Layout";

interface CodeSnippetMeta {
  source: string;
  score: number;
}

interface CodeSnippet {
  pageContent: string;
  metadata: CodeSnippetMeta;
}

interface LocalStorageObject {
  id: number;
  name: string;
  full_name: string;
  owner: string;
  html_url: string;
  default_branch: string;
  indexed_by_wizi: boolean;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [matches, setMatches] = useState<CodeSnippet[]>([]);
  const [localStorageObject, setLocalStorageObject] =
    useState<LocalStorageObject | null>(null);
  const [userRepos, setUserRepos] = useState<any[]>([]);
  const [indexingInProgress, setIndexingInProgress] = useState(false);
  const [indexed, setIndexed] = useState(false);
  const [selectedRepoId, setSelectedRepoId] = useState<string>("");

  const getSearchResults = async () => {
    setIsLoading(true);

    const response = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: searchQuery,
      }),
    });
    const data = await response.json();
    setMatches(data);
    setIsLoading(false);
  };

  const getUserRepositories = async () => {
    const response = await fetch("/api/repositories", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setUserRepos(data);
  };

  useEffect(() => {
    const localObject = localStorage.getItem("wizi-ai-selected-repo");
    if (localObject) {
      const temp = JSON.parse(localObject);
      setLocalStorageObject(temp);
      setIndexed(temp.indexed_by_wizi);
    } else {
      getUserRepositories();
    }
  }, []);
  const setSelectedRepo = (id: string) => {
    setSelectedRepoId(id);
    const repo = userRepos.filter((repo) => repo.id.toString() === id)[0];
    localStorage.setItem(
      "wizi-ai-selected-repo",
      JSON.stringify({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        owner: repo.owner.login,
        html_url: repo.html_url,
        default_branch: repo.default_branch,
        indexed_by_wizi: false,
      })
    );
    const localObject = localStorage.getItem("wizi-ai-selected-repo");
    setIndexed(false);
    if (localObject) {
      setLocalStorageObject(JSON.parse(localObject));
    }
  };

  const indexSelectedRepo = async () => {
    if (localStorageObject) {
      setIndexingInProgress(true);
      // const response = await fetch("/api/embeddings", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     owner: localStorageObject.owner,
      //     repo: localStorageObject.name,
      //   }),
      // });
      // const data = await response.json();
      // console.log("DATA: ", data);

      let allDocuments: any[] = [];
      const owner = localStorageObject.owner;
      const repo = localStorageObject.name;
      const octokit = new Octokit({
        auth: process.env.NEXT_PUBLIC_GITHUB_PERSONAL_ACCESS_TOKEN,
      });

      const response = await octokit.request(
        "GET /repos/{owner}/{repo}/contents/{path}",
        {
          mediaType: {
            format: "raw",
          },
          owner: owner,
          repo: repo,
          path: "",
        }
      );

      const reactCodeSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 800,
        chunkOverlap: 0,
        separators: [
          "\nconst ",
          "\nlet ",
          "\nfunction ",
          "\ninterface ",
          "\nconsole ",
          "\nexport ",
          "\nuseEffect ",
          "\nimport ",
          "\n\n",
          "\n",
          " ",
          "",
        ],
      });

      let contents: any = [];
      if (Array.isArray(response.data)) {
        contents = response.data;
      }
      while (contents.length) {
        const fileContent = contents.shift();
        if (fileContent.type === "dir") {
          const fileResponse = await octokit.request(
            "GET /repos/{owner}/{repo}/contents/{path}",
            {
              mediaType: {
                format: "raw",
              },
              owner: owner,
              repo: repo,
              path: fileContent.path,
            }
          );
          contents = contents.concat(fileResponse.data);
        } else if (fileContent.path) {
          const { name, ext } = path.parse(fileContent.path);

          if ([".js", ".ts", ".tsx", ".jsx"].includes(ext)) {
            const temp = await octokit.request(
              "GET /repos/{owner}/{repo}/contents/{path}",
              {
                mediaType: {
                  format: "raw",
                },
                owner: owner,
                repo: repo,
                path: fileContent.path,
              }
            );
            let codeString: string = "";
            if (typeof temp.data === "string") {
              codeString = temp.data;
            }
            allDocuments = allDocuments.concat(
              reactCodeSplitter.createDocuments(
                [codeString],
                [{ source: fileContent.path }]
              )
            );
          }
        }
      }

      // let totalTokens = 0;
      // const enc = encoding_for_model("text-embedding-ada-002");

      // allDocuments.map((doc) => {
      //   totalTokens += enc.encode(doc.pageContent).length;
      // });
      // const approximateOpenAICostForIndexing = (
      //   (totalTokens / 1000) *
      //   0.0004
      // ).toPrecision(4);

      // console.log("TOTAL DOCS: ", allDocuments.length);
      // console.log("TOTAL TOKENS: ", totalTokens);
      // console.log(
      //   "APPROXIMATE OPENAI COST FOR INDEXING: $",
      //   approximateOpenAICostForIndexing
      // );

      const pineconeClient = new PineconeClient({
        apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY,
        baseUrl: process.env.NEXT_PUBLIC_PINECONE_BASE_URL,
      });
      const openaiClient = new OpenAIEmbeddings({
        openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      });

      pineconeClient.delete({ deleteAll: true });

      const pineconeStore = await PineconeStore.fromDocuments(
        pineconeClient,
        allDocuments,
        openaiClient
      );
      localStorage.setItem(
        "wizi-ai-selected-repo",
        JSON.stringify({
          id: localStorageObject.id,
          name: localStorageObject.name,
          full_name: localStorageObject.full_name,
          owner: localStorageObject.owner,
          html_url: localStorageObject.html_url,
          default_branch: localStorageObject.default_branch,
          indexed_by_wizi: true,
        })
      );
      setIndexed(true);
      setIndexingInProgress(false);
    }
  };

  if (localStorageObject === null) {
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
                <div style={{ marginTop: "20px" }}>
                  <Alert severity="warning" sx={{ mb: 4 }}>
                    Please select a repo to proceed to Wizi AI Code Search.
                  </Alert>
                  <FormControl fullWidth>
                    <InputLabel id="repo-select-label">
                      Select a repo
                    </InputLabel>
                    <Select
                      labelId="repo-select-label"
                      id="repo-select"
                      value={selectedRepoId}
                      label="Select a repo"
                      onChange={(event: SelectChangeEvent) => {
                        setSelectedRepo(event.target.value);
                      }}
                    >
                      {userRepos.map((repo, it) => (
                        <MenuItem value={repo.id.toString()} key={it}>
                          {repo.full_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </>
            </Container>
          </Layout>
        </main>
      </>
    );
  }

  if (localStorageObject && !indexed) {
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
                <div style={{ marginTop: "20px", textAlign: "center" }}>
                  <p style={{ textAlign: "left", marginBottom: "10px" }}>
                    Selected repo: {localStorageObject.full_name}
                  </p>
                  <Alert severity="warning" sx={{ mb: 4 }}>
                    Wizi AI needs to index the repo before it is able to search
                    it. Indexing usually takes less than 2 minutes. Feel free to
                    grab some coffee!
                  </Alert>
                  <LoadingButton
                    loading={indexingInProgress}
                    variant="outlined"
                    onClick={() => indexSelectedRepo()}
                  >
                    Start indexing
                  </LoadingButton>
                </div>
              </>
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
                  Code Search by Wizi AI
                </Text>
              </Grid>
              <Grid
                container
                alignItems="center"
                sx={{
                  mt: 6,
                  mb: 1,
                  border: 1,
                  borderColor: "divider",
                  pt: 1,
                  pb: 1,
                  pl: 2,
                  pr: 1,
                  borderRadius: "5px",
                }}
              >
                <Grid
                  item
                  xs={10}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Grid item xs={10} sx={{ pl: 2 }}>
                    <Text type="header" variant="subtitle1">
                      {localStorageObject.full_name}
                    </Text>
                  </Grid>
                </Grid>
                <Grid item xs={2} style={{ textAlign: "right" }}>
                  <Chip
                    label="indexed"
                    color="primary"
                    size="medium"
                    sx={{ fontSize: "0.9rem", ml: 1 }}
                    variant="outlined"
                  />
                </Grid>
              </Grid>

              <Grid
                container
                sx={{
                  border: 1,
                  borderColor: "divider",
                  mt: 2,
                  borderRadius: "5px",
                }}
              >
                <Grid item xs={12} sx={{ pl: 4, pr: 4, pt: 4, pb: 4 }}>
                  <Grid item xs={12}>
                    <Text type="header" variant="subtitle1">
                      Ask a question about your codebase...
                    </Text>
                  </Grid>
                  <Grid item xs={12} sx={{ mt: 4 }}>
                    <TextField
                      id="document_id"
                      label=""
                      placeholder="Where can I check if user has an active subscription?"
                      variant="outlined"
                      fullWidth
                      value={searchQuery}
                      onChange={(event) =>
                        setSearchQuery(event.currentTarget.value)
                      }
                    />
                  </Grid>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{
                    textAlign: "right",
                    pl: 4,
                    pr: 4,
                    pt: 2,
                    pb: 2,
                    bgcolor: "#111",
                    borderTop: 1,
                    borderColor: "divider",
                  }}
                >
                  <LoadingButton
                    loading={isLoading}
                    variant="outlined"
                    onClick={getSearchResults}
                  >
                    Search
                  </LoadingButton>
                </Grid>
              </Grid>
              <Grid container sx={{ mt: 6 }}>
                {matches.length > 0 && (
                  <Grid item xs={8} sx={{ mb: 4 }}>
                    <Text type="header" variant="h4">
                      Top matches
                    </Text>
                  </Grid>
                )}
                {matches.map((match, it) => (
                  <Grid item xs={12} key={it}>
                    <Grid container xs={12} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Chip
                          label={match.metadata.source}
                          size="small"
                          color="primary"
                          sx={{ fontSize: "0.9rem", ml: 1, p: 1 }}
                          variant="outlined"
                          clickable
                        />
                        <Chip
                          label={`Match: ${Math.round(
                            match.metadata.score * 100
                          )}%`}
                          size="small"
                          color={
                            Math.round(match.metadata.score * 100) < 80
                              ? "warning"
                              : "primary"
                          }
                          sx={{ fontSize: "0.85rem", ml: 1, p: 1 }}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={6} sx={{ textAlign: "right" }}>
                        <Chip
                          label="View on Github"
                          color="default"
                          component="a"
                          href={`${localStorageObject.html_url}/tree/${localStorageObject.default_branch}/${match.metadata.source}`}
                          size="small"
                          sx={{ fontSize: "0.85rem", ml: 1, p: 1 }}
                          variant="outlined"
                          clickable
                          target="_blank"
                          onDelete={() => {}}
                          deleteIcon={<LaunchIcon />}
                        />
                      </Grid>
                    </Grid>
                    <Grid item xs={12} key={it} sx={{ mb: 8 }}>
                      <Grid item xs={12}>
                        <SyntaxHighlighter
                          language="jsx"
                          style={atomDark}
                          showLineNumbers
                          showInlineLineNumbers
                          startingLineNumber={1}
                          wrapLongLines
                          customStyle={{ color: "red" }}
                        >
                          {match.pageContent}
                        </SyntaxHighlighter>
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </>
          </Container>
        </Layout>
      </main>
    </>
  );
}
