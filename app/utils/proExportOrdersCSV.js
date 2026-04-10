export const exportProOrders = (data, fileName, formatDate) => {
  if (!data.length) return alert("No orders");

  const csv = [
    [
      "Order",
      "Status",
      "Total",
      "Customer",
      "Email",
      "Date",
      "Custom Properties",
      "Scheduled Export",
      "Remove Shopify Branding",
    ],
    ...data.map((o) => [
      o.name,
      o.displayFulfillmentStatus,
      o.totalPriceSet?.shopMoney?.amount,
      o.customer?.displayName,
      o.customer?.email,
      formatDate(o.createdAt),
      (o.customAttributes || [])
        .map((a) => `${a.key}: ${a.value}`)
        .join(" | "),
      "",
      "",
    ]),
  ]
    .map((r) => r.join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
};