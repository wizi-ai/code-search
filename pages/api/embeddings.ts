// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Octokit } from "octokit";
import path from "path";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { encoding_for_model } from "@dqbd/tiktoken";
import { PineconeStore } from "langchain/vectorstores";
import { OpenAIEmbeddings } from "langchain/embeddings";
import { PineconeClient } from "pinecone-client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { documents } = req.body;
  switch (req.method) {
    case "POST": {
      // let allDocuments: any[] = [];
      // const octokit = new Octokit({
      //   auth: process.env.NEXT_PUBLIC_GITHUB_PERSONAL_ACCESS_TOKEN,
      // });

      // const response = await octokit.request(
      //   "GET /repos/{owner}/{repo}/contents/{path}",
      //   {
      //     mediaType: {
      //       format: "raw",
      //     },
      //     owner: owner,
      //     repo: repo,
      //     path: "",
      //   }
      // );

      // const reactCodeSplitter = new RecursiveCharacterTextSplitter({
      //   chunkSize: 800,
      //   chunkOverlap: 0,
      //   separators: [
      //     "\nconst ",
      //     "\nlet ",
      //     "\nfunction ",
      //     "\ninterface ",
      //     "\nconsole ",
      //     "\nexport ",
      //     "\nuseEffect ",
      //     "\nimport ",
      //     "\n\n",
      //     "\n",
      //     " ",
      //     "",
      //   ],
      // });

      // let contents: any = [];
      // if (Array.isArray(response.data)) {
      //   contents = response.data;
      // }
      // while (contents.length) {
      //   const fileContent = contents.shift();
      //   if (fileContent.type === "dir") {
      //     const fileResponse = await octokit.request(
      //       "GET /repos/{owner}/{repo}/contents/{path}",
      //       {
      //         mediaType: {
      //           format: "raw",
      //         },
      //         owner: owner,
      //         repo: repo,
      //         path: fileContent.path,
      //       }
      //     );
      //     contents = contents.concat(fileResponse.data);
      //   } else if (fileContent.path) {
      //     const { name, ext } = path.parse(fileContent.path);

      //     if ([".js", ".ts", ".tsx", ".jsx"].includes(ext)) {
      //       const temp = await octokit.request(
      //         "GET /repos/{owner}/{repo}/contents/{path}",
      //         {
      //           mediaType: {
      //             format: "raw",
      //           },
      //           owner: owner,
      //           repo: repo,
      //           path: fileContent.path,
      //         }
      //       );
      //       let codeString: string = "";
      //       if (typeof temp.data === "string") {
      //         codeString = temp.data;
      //       }
      //       allDocuments = allDocuments.concat(
      //         reactCodeSplitter.createDocuments(
      //           [codeString],
      //           [{ source: fileContent.path }]
      //         )
      //       );
      //     }
      //   }
      // }

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
        apiKey: process.env.PINECONE_API_KEY,
        baseUrl: process.env.PINECONE_BASE_URL,
      });
      const openaiClient = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
      });

      pineconeClient.delete({ deleteAll: true });

      await PineconeStore.fromDocuments(
        pineconeClient,
        documents,
        openaiClient
      );

      return res.status(200).json("Indexing complete");
    }
    default: {
      res.setHeader("Allow", ["POST"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
}
