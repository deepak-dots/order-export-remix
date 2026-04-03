export async function fetchProducts(session, search) {
  const res = await fetch(
    `https://${session.shop}/admin/api/2024-01/products.json?limit=20&title=${search || ""}`,
    {
      headers: {
        "X-Shopify-Access-Token": session.accessToken,
      },
    }
  );

  const data = await res.json();

  return (data.products || []).map((p) => ({
    id: p.id,
    title: p.title,
  }));
}