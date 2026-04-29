export const exportOrders = (data, fileName, formatDate) => {
  if (!data.length) return alert("No orders");

  const csv = [
    [
      'Name',
      'Email',
      'Financial Status',
      'Paid at',
      'Fulfillment Status',
      'Fulfilled at',
      'Currency',
      'Subtotal',
      'Shipping',
      'Taxes',
      'Total',
      'Discount Code',
      'Discount Amount',
      'Shipping Method',
      'Created at',
      'Lineitem quantity',
      'Lineitem name',
      'Lineitem price',
      'Lineitem sku',
      'Lineitem requires shipping',
      'Lineitem taxable',
      'Lineitem fulfillment status',
      'Billing Name',
      'Billing Address1',
      'Billing City',
      'Billing Zip',
      'Billing Country',
      'Shipping Name',
      'Shipping Address1',
      'Shipping City',
      'Shipping Zip',
      'Shipping Country',
      'Notes',
      'Tags',
      'Phone',
      'Custom Properties'
    ],
    ...data.map((o) => [
      o.name || "",
      o.customer?.email || "",
      o.financialStatus || "",
      o.paidAt ? formatDate(o.paidAt) : "",
      o.displayFulfillmentStatus || "",
      o.fulfilledAt ? formatDate(o.fulfilledAt) : "",
      o.totalPriceSet?.shopMoney?.currencyCode || "",
      o.subtotalPrice || "",
      o.shippingPrice || "",
      o.taxes || "",
      o.totalPriceSet?.shopMoney?.amount || "",
      o.discountCode || "",
      o.discountAmount || "",
      o.shippingMethod || "",
      o.createdAt ? formatDate(o.createdAt) : "",
      o.lineItems?.[0]?.quantity || "",
      o.lineItems?.[0]?.name || "",
      o.lineItems?.[0]?.price || "",
      o.lineItems?.[0]?.sku || "",
      o.lineItems?.[0]?.requiresShipping || "",
      o.lineItems?.[0]?.taxable || "",
      o.lineItems?.[0]?.fulfillmentStatus || "",
      o.billingAddress?.name || "",
      o.billingAddress?.address1 || "",
      o.billingAddress?.city || "",
      o.billingAddress?.zip || "",
      o.billingAddress?.country || "",
      o.shippingAddress?.name || "",
      o.shippingAddress?.address1 || "",
      o.shippingAddress?.city || "",
      o.shippingAddress?.zip || "",
      o.shippingAddress?.country || "",
      o.note || "",
      (o.tags || []).join("; "),
      o.phone || "",
      (o.customAttributes || []).map((a) => `${a.key}: ${a.value}`).join(" | "),
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