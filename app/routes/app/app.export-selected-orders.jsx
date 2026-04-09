import { getSession } from "~/utils/shopify.server";
import { fetchOrderById } from "~/services/order.service";
import { getHeaders, formatOrderRows } from "~/utils/csv.server";

export async function loader({ request }) {
  const session = await getSession(request);

  const url = new URL(request.url);
  const ids = url.searchParams.get("order_ids")?.split(",") || [];

  let rows = [];

  for (const id of ids) {
    if (!id) continue;

    const order = await fetchOrderById(session, id);

    if (order) {
      rows.push(...formatOrderRows([order]));
    }
  }

  const csv = [getHeaders(), ...rows]
    .map((r) => r.join(","))
    .join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=selected_orders.csv",
    },
  });
}