import { type Workspace } from "@/util/providers/WorkspaceProvider";
import { stripe } from "@/util/stripeServer";
import {
  createOrRetrieveCustomer,
  supabaseServer,
} from "@/util/supabaseServer";
import { NextApiRequest, NextApiResponse } from "next";

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const {
    data: { user },
  } = await supabaseServer.auth.getUser(req.headers.authorization);

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const customerId = await createOrRetrieveCustomer(user.id);

  if (!customerId) {
    return res.status(500).json({ error: "Failed to create customer" });
  }

  const pendingWorkspace = req.body.workspace as Partial<Workspace>;

  if (!pendingWorkspace) {
    return res.status(400).json({ error: "Missing workspace" });
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
    return res.status(500).json({ error: "Failed to create workspace" });
  }

  if (!workspaceData) {
    return res.status(500).json({ error: "Failed to create workspace" });
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
    return res.status(500).json({ error: "Failed to create subscription" });
  }

  await supabaseServer
    .from("workspaces")
    .update({ stripe_subscription_id: sub.id })
    .eq("id", workspaceData.id);

  return res.status(200).json({ sub });
}
