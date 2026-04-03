import { getHeaders, formatOrderRows } from "../utils/csv.server";

export const action = async ({ request }) => {
  const body = await request.json();
  const orders = body.orders || [];

  const headers = getHeaders();
  const rows = formatOrderRows(orders);

  const csv =
    [headers, ...rows]
      .map((row) =>
        row.map((f) => `"${String(f).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=orders.csv",
    },
  });
};