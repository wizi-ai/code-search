// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PineconeStore } from "langchain/vectorstores";
import { OpenAIEmbeddings } from "langchain/embeddings";
import { PineconeClient } from "pinecone-client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { query } = req.body;
  switch (req.method) {
    case "POST": {
      const pineconeClient = new PineconeClient({
        apiKey: process.env.PINECONE_API_KEY,
        baseUrl: process.env.PINECONE_BASE_URL,
      });
      const openaiClient = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
      });
      const pineconeStore = await PineconeStore.fromExistingIndex(
        pineconeClient,
        openaiClient
      );
      const queryResult = await pineconeStore.similaritySearchWithScore(
        query,
        5
      );

      let formattedResults: {
        pageContent: any;
        metadata: { source: any; score: any };
      }[] = [];
      queryResult.map((result: any[]) => {
        formattedResults.push({
          pageContent: result[0].pageContent,
          metadata: {
            source: result[0].metadata.source,
            score: result[1],
          },
        });
      });

      return res.status(200).json(formattedResults);
    }
    default: {
      res.setHeader("Allow", ["POST"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
}
