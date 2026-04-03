import { json } from "@remix-run/node";
import shopify from "~/shopify.server";

export const loader = async ({ request }) => {
  const session = await shopify.authenticate(request, { returnHeader: true });
  if (!session) return json({ error: "Unauthorized" }, { status: 401 });

  const { shop, accessToken } = session;

  const url = `https://${shop}/admin/api/2024-01/orders.json?status=any&limit=50`;

  const res = await fetch(url, {
    headers: { "X-Shopify-Access-Token": accessToken },
  });

  if (!res.ok) return json({ error: "Failed to fetch orders" }, { status: res.status });

  const data = await res.json();
  return json({ orders: data.orders });
};