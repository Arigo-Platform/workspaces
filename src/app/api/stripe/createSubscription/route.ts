import { Bot } from "@/util/providers/BotProvider";
import { type Workspace } from "@/util/providers/WorkspaceProvider";
import { stripe } from "@/util/stripeServer";
import {
  createOrRetrieveCustomer,
  supabaseServer,
} from "@/util/supabaseServer";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

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

  const pendingWorkspace = body.workspace as Partial<Workspace>;
  const pendingBot = body.bot as Partial<Bot>;

  if (!pendingWorkspace) {
    return NextResponse.json(
      { error: "No workspace provided" },
      { status: 400 }
    );
  }

  const { data: workspaceData, error } = await supabaseServer
    .from("workspaces")
    .insert({
      name: pendingWorkspace.name,
      guild_id: pendingWorkspace.guild_id!,
      owner: user.id,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create workspace" },
      { status: 500 }
    );
  }

  if (!workspaceData) {
    return NextResponse.json(
      { error: "Failed to create workspace" },
      { status: 500 }
    );
  }

  const { data: workspaceMemberData, error: workspaceMemberError } =
    await supabaseServer.from("workspace_members").insert({
      workspace: workspaceData.id,
      user: user.id,
      created_at: new Date().toISOString(),
      role: "OWNER",
    });

  if (workspaceMemberError) {
    console.error(workspaceMemberError);
    return NextResponse.json(
      { error: "Failed to create workspace member" },
      { status: 500 }
    );
  }

  if (!workspaceMemberData) {
    return NextResponse.json(
      { error: "Failed to create workspace member" },
      { status: 500 }
    );
  }

  const { data: botData, error: botError } = await supabaseServer
    .from("bots")
    .insert({
      workspace: workspaceData.id,
      created_at: new Date().toISOString(),
      token: pendingBot.token,
      statuses: [
        {
          name: "with Arigo!",
          type: 0,
        },
      ],
    })
    .select()
    .single();

  if (botError) {
    console.error(botError);
    return NextResponse.json(
      { error: "Failed to create bot" },
      { status: 500 }
    );
  }

  const sub = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: process.env.STRIPE_PRICE_ID as string }],
    metadata: {
      workspaceId: workspaceData.id,
      botId: botData.id,
    },
    payment_behavior: "default_incomplete",
    expand: ["latest_invoice.payment_intent"],
  });

  if (!sub) {
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    );
  }

  await supabaseServer
    .from("workspaces")
    .update({ stripe_subscription_id: sub.id })
    .eq("id", workspaceData.id);

  await supabaseServer.from("bots_statuses").insert({
    id: botData.id,
    active: false,
    payment_intents: [
      (
        (sub.latest_invoice as Stripe.Invoice)
          .payment_intent as Stripe.PaymentIntent
      ).id,
    ],
  });

  return NextResponse.json({ subscription: sub });
}
