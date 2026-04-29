import {
  IndexTable,
  Text,
} from "@shopify/polaris";

export default function OrdersTable({
  filteredOrders,
  selectedOrders,
  handleSelectionChange,
  formatDate,
}) {
  const resourceName = {
    singular: "order",
    plural: "orders",
  };

  const rowMarkup = filteredOrders.map((o, index) => (
    <IndexTable.Row
      id={o.id}
      key={o.id}
      selected={selectedOrders.includes(o.id)}
      position={index}
    >
      <IndexTable.Cell>
        <Text variant="bodyMd" fontWeight="bold">
          {o.name}
        </Text>
      </IndexTable.Cell>

      <IndexTable.Cell>{o.displayFulfillmentStatus}</IndexTable.Cell>

      <IndexTable.Cell>
        {o.totalPriceSet?.shopMoney?.amount}{" "}
        {o.totalPriceSet?.shopMoney?.currencyCode}
      </IndexTable.Cell>

      <IndexTable.Cell>{o.customer?.displayName}</IndexTable.Cell>
      <IndexTable.Cell>{o.customer?.email}</IndexTable.Cell>
      <IndexTable.Cell>{formatDate(o.createdAt)}</IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <IndexTable
      resourceName={resourceName}
      itemCount={filteredOrders.length}
      selectedItemsCount={
        selectedOrders.length === filteredOrders.length
          ? "All"
          : selectedOrders.length
      }
      onSelectionChange={handleSelectionChange} //  from parent
      headings={[
        { title: "Order" },
        { title: "Status" },
        { title: "Total" },
        { title: "Customer" },
        { title: "Email" },
        { title: "Date" },
      ]}
    >
      {rowMarkup}
    </IndexTable>
  );
}