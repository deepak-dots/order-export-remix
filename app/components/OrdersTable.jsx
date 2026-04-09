import { useMemo } from "react";

//  Safe date formatter (NO hydration issue)
const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toISOString().replace("T", " ").slice(0, 19);
};

export default function OrdersTable({
  orders,
  selectedOrders,
  toggleOrder,
  toggleAll,
}) {
  const allSelected =
    orders.length > 0 && selectedOrders.length === orders.length;

  return (
    <s-table>
      {/* HEADER */}
      <s-table-head>
        <s-table-row>
          <s-table-cell>
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleAll}
            />
          </s-table-cell>
          <s-table-cell>Order</s-table-cell>
          <s-table-cell>Customer</s-table-cell>
          <s-table-cell>Status</s-table-cell>
          <s-table-cell>Total</s-table-cell>
          <s-table-cell>Date</s-table-cell>
        </s-table-row>
      </s-table-head>

      {/* BODY */}
      <s-table-body>
        {orders.map((order) => {
          const isSelected = selectedOrders.includes(order.id);

          return (
            <s-table-row key={order.id}>
              <s-table-cell>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleOrder(order.id)}
                />
              </s-table-cell>

              <s-table-cell>{order.name}</s-table-cell>

              <s-table-cell>
                {order.customer?.displayName || "-"}
              </s-table-cell>

              <s-table-cell>
                {order.displayFulfillmentStatus}
              </s-table-cell>

              <s-table-cell>
                {order.totalPriceSet?.shopMoney?.amount}{" "}
                {order.totalPriceSet?.shopMoney?.currencyCode}
              </s-table-cell>

              {/*  FIXED DATE */}
              <s-table-cell>
                {formatDate(order.createdAt)}
              </s-table-cell>
            </s-table-row>
          );
        })}
      </s-table-body>
    </s-table>
  );
}