import { useEffect, useState } from "react";
import PricingTable from "../components/PricingTable";
import { Page, AppProvider, Banner } from "@shopify/polaris";
import enTranslations from "@shopify/polaris/locales/en.json";

export default function Home() {
  const [userPlan, setUserPlan] = useState("Free");

  useEffect(() => {
    const storedPlan = localStorage.getItem("userPlan") || "Free";
    setUserPlan(storedPlan);
  }, []);

  return (
    <AppProvider i18n={enTranslations}>
      {/* ✅ FIXED Banner */}
      <Banner title={`Current Plan: ${userPlan}`} tone="info" />

      <Page title="Pricing Plans">
        <PricingTable />
      </Page>
    </AppProvider>
  );
}