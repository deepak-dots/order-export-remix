import { redirect } from "react-router";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const url = new URL(request.url);
  const plan = url.searchParams.get("plan");

  const prices = {
    pro: 5,
  };

  if (!plan || !prices[plan]) {
    throw new Error("Invalid plan");
  }

  const returnUrl = `${url.origin}/app`;

  // DEV MODE

  // if (process.env.NODE_ENV === "development") {
  //   return redirect("/app");
  // }

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
      }
    }
  `;

  const res = await admin.graphql(mutation, {
    variables: {
      name: "pro",
      returnUrl,
      price: 5,
    },
  });

  const data = await res.json();

  return redirect(
    data?.data?.appSubscriptionCreate?.confirmationUrl
  );
};