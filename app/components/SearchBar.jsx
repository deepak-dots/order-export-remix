export default function SearchBar({ search, setSearch }) {
  return (
    <input
      type="text"
      placeholder="Search orders..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={{
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "6px",
        width: "300px"
      }}
    />
  );
}