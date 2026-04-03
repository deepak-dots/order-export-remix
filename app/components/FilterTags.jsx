export default function FilterTags({ startDate, endDate, statusFilter, clearFilters }) {
  if (!startDate && !endDate && !statusFilter) return null;

  return (
    <div style={{ display: "flex", gap: "10px" }}>
      {startDate && <span>From: {startDate}</span>}
      {endDate && <span>To: {endDate}</span>}
      {statusFilter && <span>Status: {statusFilter}</span>}

      <button onClick={clearFilters}>Clear</button>
    </div>
  );
}