import { redirect } from "react-router";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);

  console.log("SESSION:", session);

  const url = new URL(request.url);
  const plan = url.searchParams.get("plan");

  const prices = {
    Basic: 3,
    Pro: 5,
    Advanced: 9,
    Plus: 14,
  };

  if (!plan || !prices[plan]) {
    throw new Error("Invalid plan selected");
  }

  const returnUrl = `${url.origin}/app`;

  // ✅ DEV MODE: skip Shopify billing
  if (process.env.SHOPIFY_APP_PUBLIC !== "true") {
    console.log("DEV MODE: Skipping Shopify Billing API for plan:", plan);
    return redirect("/app");
  }

  // ✅ REAL BILLING (only works after app is public)
  const mutation = `
    mutation appSubscriptionCreate($name: String!, $returnUrl: URL!, $price: Decimal!) {
      appSubscriptionCreate(
        name: $name
        returnUrl: $returnUrl
        lineItems: [
          {
            plan: {
              appRecurringPricingDetails: {
                price: { amount: $price, currencyCode: USD }
              }
            }
          }
        ]
        test: true
      ) {
        confirmationUrl
        userErrors {
          message
        }
      }
    }
  `;

  const response = await admin.graphql(mutation, {
    variables: {
      name: `${plan} Plan`,
      returnUrl,
      price: prices[plan],
    },
  });

  const data = await response.json();

  console.log("SHOPIFY RESPONSE:", data);

  const errors = data?.data?.appSubscriptionCreate?.userErrors;

  if (errors?.length) {
    throw new Error(errors.map((e) => e.message).join(", "));
  }

  const confirmationUrl =
    data?.data?.appSubscriptionCreate?.confirmationUrl;

  if (!confirmationUrl) {
    throw new Error("No confirmation URL");
  }

  return redirect(confirmationUrl);
};