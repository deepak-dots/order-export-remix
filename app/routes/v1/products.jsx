import { json } from "@remix-run/node";
import { getSession } from "~/utils/shopify.server";
import { fetchProducts } from "~/services/product.service";

export async function loader({ request }) {
  const session = await getSession(request);

  const url = new URL(request.url);
  const search = url.searchParams.get("search");

  const products = await fetchProducts(session, search);

  return json(products);
}