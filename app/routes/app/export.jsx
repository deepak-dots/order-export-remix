// app/routes/app.export.jsx
import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = await request.json();
    const orders = body.orders || [];

    if (!orders.length) {
      return new Response("No orders selected", { status: 400 });
    }

    const csv = [
      ["Order", "Status", "Total", "Customer", "Email", "Date"],
      ...orders.map((o) => [
        o.name || "",
        o.displayFulfillmentStatus || "",
        o.totalPriceSet?.shopMoney?.amount || "",
        o.customer?.displayName || "",
        o.customer?.email || "",
        new Date(o.createdAt).toLocaleString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      ]),
    ]
      .map((r) => r.join(","))
      .join("\n");

    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="custom-orders-${Date.now()}.csv"`,
      },
    });
  } catch (err) {
    console.error("EXPORT ERROR:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
};