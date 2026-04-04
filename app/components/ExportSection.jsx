import { useLoaderData } from "react-router";
import { hasAccess } from "../utils/plans";

export default function ExportSection({
  exportAll,
  exportSelected,
  selectedCount,
}) {
  const { plan } = useLoaderData();

  return (
    <s-stack direction="inline" gap="base">
      
      {/* Always Available */}
      <s-button onClick={exportAll}>
        Export All
      </s-button>

      {/* Custom Export (Basic+) */}
      <s-button
        onClick={() => {
          if (!hasAccess(plan, "customProperties")) {
            alert("Upgrade to Basic plan to export selected orders");
            return;
          }
          exportSelected();
        }}
        disabled={selectedCount === 0}
        variant="primary"
      >
        Export Selected ({selectedCount})
      </s-button>

      {/* Scheduled Export (Pro+) */}
      {hasAccess(plan, "scheduledExport") && (
        <s-button
          onClick={() => {
            alert("Scheduled export triggered (demo)");
          }}
        >
          Schedule Export
        </s-button>
      )}

      {/* Email Export (Advanced+) */}
      {hasAccess(plan, "emailDelivery") && (
        <s-button
          onClick={() => {
            alert("Email sent successfully (demo)");
          }}
        >
          Email CSV
        </s-button>
      )}

    </s-stack>
  );
}