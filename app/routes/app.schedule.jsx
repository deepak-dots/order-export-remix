import { authenticate, getCurrentPlan } from "../shopify.server";
import { hasAccess } from "../utils/plans";

// 🔥 POST /api/schedule
export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const plan = await getCurrentPlan(admin);

  // ❌ Block if not allowed
  if (!hasAccess(plan, "scheduledExport")) {
    return new Response(
      JSON.stringify({ error: "Upgrade to Pro plan to use scheduled export" }),
      {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const body = await request.json();
    const { frequency, email } = body;

    console.log("Schedule Request:", {
      shop: admin?.rest?.session?.shop,
      frequency,
      email,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Scheduled export created (demo)",
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Schedule Error:", error);

    return new Response(
      JSON.stringify({ error: "Something went wrong" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};