export function getHeaders() {
  return [
    "Name","Email","Financial Status","Paid at","Fulfillment Status",
    "Fulfilled at","Currency","Subtotal","Shipping","Taxes","Total",
    "Discount Code","Discount Amount","Shipping Method","Created at",
    "Lineitem quantity","Lineitem name","Lineitem price","Lineitem sku",
    "Lineitem requires shipping","Lineitem taxable","Lineitem fulfillment status",
    "Billing Name","Billing Address1","Billing City","Billing Zip","Billing Country",
    "Shipping Name","Shipping Address1","Shipping City","Shipping Zip","Shipping Country",
    "Notes","Tags","Phone","Custom Properties"
  ];
}

export function formatOrderRows(orders) {
  const rows = [];

  for (const order of orders) {
    const billing = order.billing_address || {};
    const shipping = order.shipping_address || {};

    const email =
      order.email ||
      order.contact_email ||
      order.customer?.email ||
      "";

    const tags = Array.isArray(order.tags)
      ? order.tags.join(",")
      : order.tags;

    for (const item of order.line_items || []) {
      const props = (item.properties || [])
        .filter((p) => p.value)
        .map((p) => `${p.name}: ${p.value}`)
        .join(" | ");

      rows.push([
        order.name || "",
        email,
        order.financial_status || "",
        order.processed_at || "",
        order.fulfillment_status || "",
        order.fulfillments?.[0]?.created_at || "",
        order.currency || "",
        order.subtotal_price || "",
        order.total_shipping_price_set?.shop_money?.amount || "",
        order.total_tax || "",
        order.total_price || "",
        order.discount_codes?.[0]?.code || "",
        order.total_discounts || "",
        order.shipping_lines?.[0]?.title || "",
        order.created_at || "",
        item.quantity || "",
        item.title || "",
        item.price || "",
        item.sku || "",
        item.requires_shipping || "",
        item.taxable || "",
        item.fulfillment_status || "",
        `${billing.first_name || ""} ${billing.last_name || ""}`,
        billing.address1 || "",
        billing.city || "",
        billing.zip || "",
        billing.country || "",
        `${shipping.first_name || ""} ${shipping.last_name || ""}`,
        shipping.address1 || "",
        shipping.city || "",
        shipping.zip || "",
        shipping.country || "",
        order.note || "",
        tags || "",
        order.phone || "",
        props
      ]);
    }
  }

  return rows;
}