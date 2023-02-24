// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Octokit } from "octokit";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  switch (req.method) {
    case "GET": {
      const octokit = new Octokit({
        auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
      });

      const response = await octokit.request("GET /user/repos", {
        per_page: 100,
      });
      res.status(200).json(response.data);
    }
    default: {
      res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
}
