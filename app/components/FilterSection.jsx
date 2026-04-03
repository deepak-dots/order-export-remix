import { useState } from "react";

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
            </>
          )}

          {active && (
            <button onClick={() => setActive(null)}>← Back</button>
          )}

          {active === "date" && (
            <>
              <input type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)} />
              <input type="date" value={endDate} onChange={(e)=>setEndDate(e.target.value)} />
            </>
          )}

          {active === "status" && (
            <select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)}>
              <option value="">All</option>
              <option value="FULFILLED">Fulfilled</option>
              <option value="UNFULFILLED">Unfulfilled</option>
            </select>
          )}
        </div>
      )}
    </div>
  );
}