import { generateCSV } from "../../utils/csv.server";
import { authenticate, getCurrentPlan } from "../../shopify.server";

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const plan = await getCurrentPlan(admin);

  const { orders } = await request.json();

  const csv = generateCSV(orders, plan);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=orders.csv",
    },
  });
};