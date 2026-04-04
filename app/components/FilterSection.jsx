import { useState } from "react";
import { hasAccess } from "../utils/plans"; // ✅ ADD
import { useLoaderData } from "react-router"; // ✅ ADD
// import AdvancedFilters from "./AdvancedFilters"; // ✅ (assume already created)

export default function FilterSection({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  statusFilter,
  setStatusFilter
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);

  const { plan } = useLoaderData(); // ✅ GET PLAN

  return (
    <div style={{ position: "relative" }}>
      <s-button onClick={() => setOpen(!open)}>Filter</s-button>

      {open && (
        <div style={{
          position: "absolute",
          top: "40px",
          background: "#fff",
          border: "1px solid #ddd",
          padding: "15px",
          borderRadius: "8px",
          width: "250px"
        }}>

          {!active && (
            <>
              <button onClick={() => setActive("date")}>Date</button>
              <button onClick={() => setActive("status")}>Status</button>

              {/* 🔥 ADVANCED FILTER ENTRY */}
              {hasAccess(plan, "filterPresets") && (
                <button onClick={() => setActive("advanced")}>
                  Advanced Filters
                </button>
              )}
            </>
          )}

          {active && (
            <button onClick={() => setActive(null)}>← Back</button>
          )}

          {/* DATE FILTER */}
          {active === "date" && (
            <>
              <input
                type="date"
                value={startDate}
                onChange={(e)=>setStartDate(e.target.value)}
              />
              <input
                type="date"
                value={endDate}
                onChange={(e)=>setEndDate(e.target.value)}
              />
            </>
          )}

          {/* STATUS FILTER */}
          {active === "status" && (
            <select
              value={statusFilter}
              onChange={(e)=>setStatusFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="FULFILLED">Fulfilled</option>
              <option value="UNFULFILLED">Unfulfilled</option>
            </select>
          )}

          {/* 🔥 ADVANCED FILTER UI */}
          {active === "advanced" && hasAccess(plan, "filterPresets") && (
            <div>
              {/* Example Advanced Filters */}
              <input placeholder="Min Order Value" />
              <input placeholder="Max Order Value" />
              <input placeholder="Customer Email" />
            </div>
          )}

        </div>
      )}
    </div>
  );
}