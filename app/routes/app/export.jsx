// app/routes/app/export.jsx

import { generateCSV } from "../../utils/csv.server";
import { authenticate, getCurrentPlan } from "../shopify.server";

export const action = async ({ request }) => {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { orders } = await request.json();

    if (!orders || !orders.length) {
      return new Response("No orders provided", { status: 400 });
    }

    const csv = await generateCSV(orders, "Pro", {});

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=custom-orders.csv",
      },
    });
  } catch (err) {
    console.error("EXPORT ERROR:", err);
    return new Response("Failed to export orders", { status: 500 });
  }
};

export default function ExportRoute() {
  return null;
}