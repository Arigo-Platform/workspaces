import { type NextRequest, type NextResponse } from "next/server";
import { headers } from "next/headers";

export default async function handler(
  req: Request,
  { params }: { params: { slug: string[] } }
) {
  const h = headers();
  const discordRes = await fetch(
    `https://discord.com/api/v10/guilds/864016187107966996/channels`,
    {
      method: "GET",
      headers: new Headers({
        Authorization:
          "Bot OTUyMzEwNzYxODY5NDEwNDU1.GAJtgN.ACPoaTizmrY1Ubp6-toBD9ht5IozhHYymvOAwI",
      }),
      body: req.body,
    }
  );

  const json = await discordRes.text();
  return new Response(json, discordRes);
}
