import { stripe } from "@/util/stripeServer";
import {
  createOrRetrieveCustomer,
  supabaseServer,
} from "@/util/supabaseServer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const auth = req.headers.get("Authorization");
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const {
    data: { user },
  } = await supabaseServer.auth.getUser(auth);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const customerId = await createOrRetrieveCustomer(user.id);

  if (!customerId) {
    return NextResponse.json(
      { error: "Failed to create customer" },
      { status: 500 }
    );
  }

  const body = await req.json();

  const botId = body.bot as string;
  const workspaceId = body.workspace as string;
  const paymentIntentId = body.paymentIntent as string;

  if (!botId) {
    return NextResponse.json({ error: "No bot provided" }, { status: 400 });
  }

  if (!workspaceId) {
    return NextResponse.json(
      { error: "No workspace provided" },
      { status: 400 }
    );
  }

  if (!paymentIntentId) {
    return NextResponse.json(
      { error: "No payment intent provided" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseServer
    .from("bots")
    .select("*, workspace(*)")
    .eq("id", botId)
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch bot" }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Bot not found" }, { status: 404 });
  }

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (!paymentIntent) {
    return NextResponse.json(
      { error: "Payment intent not found" },
      { status: 404 }
    );
  }

  if (paymentIntent.status !== "succeeded") {
    return NextResponse.json(
      { error: "Payment intent not succeeded" },
      { status: 400 }
    );
  }

  const { error: botStatusError } = await supabaseServer
    .from("bots_statuses")
    .update({
      active: true,
    })
    .eq("id", botId);

  if (botStatusError) {
    console.error(botStatusError);
    return NextResponse.json(
      { error: "Failed to update bot status" },
      { status: 500 }
    );
  }

  const { error: botUpdateError } = await supabaseServer
    .from("bots")
    .update({
      region: "us-east",
    })
    .eq("id", botId);

  if (botUpdateError) {
    console.error(botUpdateError);
    return NextResponse.json(
      { error: "Failed to update bot" },
      { status: 500 }
    );
  }
}
