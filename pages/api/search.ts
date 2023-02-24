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
      const pineconeClient = new PineconeClient({});
      const pineconeStore = await PineconeStore.fromExistingIndex(
        pineconeClient,
        new OpenAIEmbeddings()
      );
      const queryResult = await pineconeStore.similaritySearch(query, 5);

      res.status(200).json(queryResult);
    }
    default: {
      res.setHeader("Allow", ["POST"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
}
