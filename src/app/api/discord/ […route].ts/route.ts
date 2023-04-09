import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Got Called");
  const { route } = req.query;
  const discordRes = await fetch(`https://discord.com/api/v10/${route}`, {
    method: req.method,
    headers: new Headers(),
    body: req.body,
  }).then(async (r) => await r.json());
  res.send(discordRes as object);
}
