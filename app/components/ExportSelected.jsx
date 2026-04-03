export default function ExportSection({
  exportAll,
  exportSelected,
  selectedCount,
}) {
  return (
    <s-stack direction="inline" gap="base">
      <s-button onClick={exportAll}>
        Export All
      </s-button>

      <s-button
        onClick={exportSelected}
        disabled={selectedCount === 0}
        variant="primary"
      >
        Export Selected ({selectedCount})
      </s-button>
    </s-stack>
  );
}