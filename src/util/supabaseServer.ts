import { Database } from "@/types/supabase";
import { createClient } from "@supabase/supabase-js";
import { stripe } from "./stripeServer";

const supabaseServer = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

const createOrRetrieveCustomer = async (id: string) => {
  const { data, error } = await supabaseServer
    .from("accounts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    return;
  }

  if (data.stripe_customer_id) {
    return data.stripe_customer_id;
  }

  const {
    data: { user },
    error: err,
  } = await supabaseServer.auth.admin.getUserById(id);

  if (err) {
    console.error(err);
    return;
  }

  const customer = await stripe.customers.create({
    email: user?.email,
    name: data.username,
    metadata: {
      discord_id: data.discord_id,
    },
  });

  await supabaseServer
    .from("accounts")
    .update({ stripe_customer_id: customer.id })
    .eq("id", id);

  return customer.id;
};

export { supabaseServer, createOrRetrieveCustomer };
