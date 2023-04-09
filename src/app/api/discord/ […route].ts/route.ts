import { type NextRequest, type NextResponse } from "next/server";

export default async function handler(
  req: Request,
  { params }: { params: { route: string } }
): Response {
  const discordRes = await fetch(`https://discord.com/api/v10/${route}`, {
    method: "GET",
    headers: new Headers(),
    body: req.body,
  });

  const json = await discordRes.json();

  return new Response(json, {
    status: discordRes.status,
    headers: {
      "content-type": "application/json",
    },
  });
}

export async function GET(
  req: Request,
  { params }: { params: { route: string } }
) {
  return handler(req, { params });
}

export async function POST(
  req: Request,
  { params }: { params: { route: string } }
) {
  return handler(req, { params });
}

export async function PUT(
  req: Request,
  { params }: { params: { route: string } }
) {
  return handler(req, { params });
}

export async function PATCH(
  req: Request,
  { params }: { params: { route: string } }
) {
  return handler(req, { params });
}

export async function DELETE(
  req: Request,
  { params }: { params: { route: string } }
) {
  return handler(req, { params });
}

export async function OPTIONS(
  req: Request,
  { params }: { params: { route: string } }
) {
  return handler(req, { params });
}
