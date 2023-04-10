import { type NextRequest, type NextResponse } from "next/server";
import { headers } from "next/headers";

export default async function handler(
  req: Request,
  { params }: { params: { slug: string[] } }
) {
  const h = headers();
  const discordRes = await fetch(
    `https://discord.com/api/v10/${params.slug.join("/")}`,
    {
      method: "GET",
      headers: new Headers({
        Authorization: h.get("Authorization") || "",
        "Content-Type": "application/json",
      }),
      body: req.body,
    }
  );

  const json = await discordRes.text();

  return new Response(json, {
    status: discordRes.status,
    headers: {
      "content-type": "application/json",
    },
  });
}

export async function GET(
  req: Request,
  { params }: { params: { slug: string[] } }
) {
  return await handler(req, { params });
}

export async function POST(
  req: Request,
  { params }: { params: { slug: string[] } }
) {
  return await handler(req, { params });
}

export async function PUT(
  req: Request,
  { params }: { params: { slug: string[] } }
) {
  return await handler(req, { params });
}

export async function PATCH(
  req: Request,
  { params }: { params: { slug: string[] } }
) {
  return await handler(req, { params });
}

export async function DELETE(
  req: Request,
  { params }: { params: { slug: string[] } }
) {
  return await handler(req, { params });
}

export async function OPTIONS(
  req: Request,
  { params }: { params: { slug: string[] } }
) {
  return await handler(req, { params });
}
