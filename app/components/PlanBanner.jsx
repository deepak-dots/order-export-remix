import { useNavigate } from "react-router";

export default function PlanBanner({ plan }) {
  const navigate = useNavigate();

  const isPro = plan === "pro";

  if (isPro) return null;

  return (
    <div
      style={{
        background: "#fff3cd",
        border: "1px solid #ffeeba",
        padding: "12px 16px",
        borderRadius: "8px",
        marginBottom: "15px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        ⚠️ You are on <b>Free Plan</b>
        <div style={{ fontSize: "12px", marginTop: "4px" }}>
          Add-on features locked: Custom Export, Scheduled Export, Branding removal
        </div>
      </div>

      <button
        onClick={() => navigate("/app/price")}
        style={{
          background: "#000",
          color: "#fff",
          padding: "8px 14px",
          borderRadius: "6px",
          border: "none",
          cursor: "pointer",
        }}
      >
        Upgrade
      </button>
    </div>
  );
}