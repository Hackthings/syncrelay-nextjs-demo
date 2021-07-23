// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Client } from "@syncrelay/node";

type Data = {
  consumerToken: string;
};

const accessToken = process.env.SYNCRELAY_ACCESS_TOKEN;
const projectId = process.env.SYNCRELAY_PROJECT_ID;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (!accessToken || !projectId) {
    throw new Error("Missing SyncRelay access token or project");
  }

  const client = new Client({
    accessToken,
  });

  const roomName = req.query["room"];
  if (!roomName) {
    throw new Error("Missing room");
  }

  // TODO Authorize the user to see if they are to subscribe to this room

  const { consumerToken } = await client.authorizeConsumer({
    data: {
      projectId,
      allowedTopics: [`/rooms/${roomName}`],
    },
  });

  res.json({ consumerToken });
}
