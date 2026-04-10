export default function OrdersExport({
  isPro,
  exportAllOrders,
  exportSelectedOrders,
  exportAllOrdersPro,
  exportSelectedOrdersPro,
  selectedOrders,
  goToPlan,
}) {
  return (
    <s-stack direction="inline" gap="base">
      {isPro ? (
        <>
          <s-button onClick={exportAllOrdersPro}>
            Export Orders + Addon Data
          </s-button>

          <s-button
            onClick={exportSelectedOrdersPro}
            disabled={selectedOrders.length === 0}
          >
            Selected Export ({selectedOrders.length})
          </s-button>
        </>
      ) : (
        <>
          <s-button onClick={exportAllOrders}>Export Orders</s-button>

          <s-button
            onClick={exportSelectedOrders}
            disabled={selectedOrders.length === 0}
          >
            Selected Export ({selectedOrders.length})
          </s-button>

          <s-button onClick={goToPlan}>Go to Plan Page</s-button>
        </>
      )}
    </s-stack>
  );
}