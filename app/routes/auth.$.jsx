import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import { registerWebhooks } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  //await registerWebhooks({ session });

  return null;
};

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
