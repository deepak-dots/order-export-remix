import "@shopify/shopify-app-react-router/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
} from "@shopify/shopify-app-react-router/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma from "./db.server";

// 🔹 Shopify App Config (UNCHANGED)
const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.October25,
  scopes: process.env.SCOPES?.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.CustomApp,
  future: {
    expiringOfflineAccessTokens: true,
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
});

// 🔹 Exports (UNCHANGED)
export default shopify;
export const apiVersion = ApiVersion.October25;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;

// 🔥 FINAL PLANS (CLEANED → Only Free + Pro)
export const PLANS = {
  FREE: {
    name: "Free",
    price: 0,
  },
  PRO: {
    name: "Pro",
    price: 5,
  },
};

// 🔥 Get Current Active Plan from Shopify (FINAL)
export async function getCurrentPlan(admin) {
  try {
    const response = await admin.graphql(`
      {
        currentAppInstallation {
          activeSubscriptions {
            name
            status
          }
        }
      }
    `);

    const data = await response.json();

    const subscriptions =
      data?.data?.currentAppInstallation?.activeSubscriptions || [];

    // ✅ Find ACTIVE subscription only
    const activeSub = subscriptions.find(
      (sub) => sub.status === "ACTIVE"
    );

    const planName = activeSub?.name;

    // ✅ Normalize plan name
    if (planName === "Pro" || planName === "Pro Plan") {
      return "Pro";
    }

    // ✅ Default
    return "Free";
  } catch (error) {
    console.error("Error fetching current plan:", error);
    return "Free";
  }
}