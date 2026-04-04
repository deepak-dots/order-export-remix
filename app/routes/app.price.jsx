import PricingTable from "../components/PricingTable";
import { Page, AppProvider } from "@shopify/polaris";
import enTranslations from "@shopify/polaris/locales/en.json";

export default function Home() {
  return (
    <AppProvider i18n={enTranslations}>
      <Page title="Pricing Plans">
        <PricingTable />
      </Page>
    </AppProvider>
  );
}