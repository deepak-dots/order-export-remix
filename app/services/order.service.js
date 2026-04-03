export async function fetchOrders(session, pageInfo = null) {
  const url = pageInfo
    ? `https://${session.shop}/admin/api/2024-01/orders.json?page_info=${pageInfo}`
    : `https://${session.shop}/admin/api/2024-01/orders.json?limit=100&status=any&order=created_at+desc`;

  const res = await fetch(url, {
    headers: {
      "X-Shopify-Access-Token": session.accessToken,
    },
  });

  const data = await res.json();

  const link = res.headers.get("link");

  let nextPage = null;
  let prevPage = null;

  if (link) {
    const nextMatch = link.match(/page_info=([^&>]*)[^>]*>; rel="next"/);
    const prevMatch = link.match(/page_info=([^&>]*)[^>]*>; rel="previous"/);

    nextPage = nextMatch?.[1] || null;
    prevPage = prevMatch?.[1] || null;
  }

  return {
    orders: data.orders || [],
    nextPage,
    prevPage,
  };
}

export async function fetchOrderById(session, id) {
  const res = await fetch(
    `https://${session.shop}/admin/api/2024-01/orders/${id}.json`,
    {
      headers: {
        "X-Shopify-Access-Token": session.accessToken,
      },
    }
  );

  const data = await res.json();
  return data.order;
}