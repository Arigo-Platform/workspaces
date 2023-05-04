import { type Workspace } from "@/util/providers/WorkspaceProvider";
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

  const pendingWorkspace = body.workspace as Partial<Workspace>;

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

  const sub = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: process.env.STRIPE_PRICE_ID as string }],
    metadata: {
      workspaceId: workspaceData.id,
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

  return NextResponse.json({ subscription: sub });
}
