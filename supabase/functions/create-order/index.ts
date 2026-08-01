import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface OrderItemInput {
  product_id: string;
  product_name: string;
  size: string | null;
  unit_price_cents: number;
  sale_percentage: number;
  quantity: number;
}

interface CreateOrderBody {
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  delivery_method: "courier" | "paxi";
  delivery_address: string | null;
  paxi_pickup_point: string | null;
  city: string | null;
  province: string | null;
  postal_code: string | null;
  subtotal_cents: number;
  sale_discount_cents: number;
  promo_code: string | null;
  promo_discount_cents: number;
  delivery_fee_cents: number;
  total_cents: number;
  items: OrderItemInput[];
}

function generateOrderNumber(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `AILG-${code}`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body: CreateOrderBody = await req.json();

    // Basic validation
    if (!body.customer_name || body.customer_name.length > 200) {
      return new Response(JSON.stringify({ error: "Invalid name" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!body.customer_email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(body.customer_email)) {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!body.delivery_method || !["courier", "paxi"].includes(body.delivery_method)) {
      return new Response(JSON.stringify({ error: "Invalid delivery method" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (body.delivery_method === "courier" && !body.delivery_address) {
      return new Response(JSON.stringify({ error: "Delivery address required for courier" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (body.delivery_method === "paxi" && !body.paxi_pickup_point) {
      return new Response(JSON.stringify({ error: "Paxi pickup point required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!body.items || body.items.length === 0) {
      return new Response(JSON.stringify({ error: "No items in order" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use service role to insert order + items
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Generate unique order number (retry on conflict)
    let orderNumber = generateOrderNumber();
    let attempts = 0;
    while (attempts < 5) {
      const { data: existing } = await supabase
        .from("orders")
        .select("order_number")
        .eq("order_number", orderNumber)
        .maybeSingle();
      if (!existing) break;
      orderNumber = generateOrderNumber();
      attempts++;
    }

    // Insert order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_name: body.customer_name,
        customer_email: body.customer_email,
        customer_phone: body.customer_phone,
        delivery_method: body.delivery_method,
        delivery_address: body.delivery_address,
        paxi_pickup_point: body.paxi_pickup_point,
        city: body.city,
        province: body.province,
        postal_code: body.postal_code,
        subtotal_cents: body.subtotal_cents,
        sale_discount_cents: body.sale_discount_cents,
        promo_code: body.promo_code,
        promo_discount_cents: body.promo_discount_cents,
        delivery_fee_cents: body.delivery_fee_cents,
        total_cents: body.total_cents,
        status: "pending",
      })
      .select()
      .single();

    if (orderError) {
      return new Response(JSON.stringify({ error: "Failed to create order", details: orderError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Insert order items
    const orderItems = body.items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      size: item.size,
      unit_price_cents: item.unit_price_cents,
      sale_percentage: item.sale_percentage,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      // Order was created but items failed — still return the order
      // The owner can manually reconcile
      return new Response(JSON.stringify({
        order_number: orderNumber,
        warning: "Order created but items partially failed",
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Increment promo code usage if applicable
    if (body.promo_code) {
      await supabase.rpc("increment_promo_usage", { code_input: body.promo_code }).then(() => {});
    }

    return new Response(JSON.stringify({ order_number: orderNumber }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
