import PricingTable from "../components/PricingTable";
import { Page, AppProvider, Banner } from "@shopify/polaris";
import enTranslations from "@shopify/polaris/locales/en.json";
import { useLoaderData } from "react-router";
import { useEffect, useState } from "react";
import { authenticate, getCurrentPlan } from "../shopify.server";

// free LOADER (same)
export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const plan = (await getCurrentPlan(admin) || "free")
    .toLowerCase()
    .trim();

  return { plan };
};

export default function Pricing() {
  const data = useLoaderData() ?? {};

  // free FIX: useState
  const [userPlan, setUserPlan] = useState(
    (data.plan || "free").toLowerCase()
  );

  // free FIX: localStorage only in client
  useEffect(() => {
    const syncPlan = () => {
      const localPlan = localStorage.getItem("plan");
      setUserPlan(localPlan ? localPlan.toLowerCase() : "free");
    };

    syncPlan();

    window.addEventListener("storage", syncPlan);

    return () => window.removeEventListener("storage", syncPlan);
  }, []);

  return (
    <AppProvider i18n={enTranslations}>
      <Banner title={`Current Plan: ${userPlan}`} tone="info" />

      <Page title="Pricing Plans">
        <PricingTable currentPlan={userPlan} />
      </Page>
    </AppProvider>
  );
}