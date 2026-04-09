import { useState, useMemo } from "react";
import { useLoaderData } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate, getCurrentPlan } from "../shopify.server";
import { hasAccess } from "../utils/plans";
import { getSessionToken } from "@shopify/app-bridge/utilities";
import { useAppBridge } from "@shopify/app-bridge-react";

//  LOADER (UNCHANGED)
export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const plan = await getCurrentPlan(admin);

  const ordersResponse = await admin.graphql(`
    {
      orders(first: 10, sortKey: CREATED_AT, reverse: true) {
        edges {
          node {
            id
            name
            displayFulfillmentStatus
            createdAt
            totalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
            customer {
              displayName
              email
            }
            customAttributes {
              key
              value
            }
          }
        }
      }
    }
  `);

  const ordersJson = await ordersResponse.json();

  return {
    plan,
    orders:
      ordersJson?.data?.orders?.edges?.map((edge) => edge.node) || [],
  };
};

export default function Index() {
  const { orders, plan } = useLoaderData();
  const userPlan = plan;

  console.log("User Plan:", userPlan);

  const [selectedOrders, setSelectedOrders] = useState([]);
  const [search, setSearch] = useState("");

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const s = search.toLowerCase();

      const matchSearch =
        !search ||
        o.name?.toLowerCase().includes(s) ||
        o.customer?.displayName?.toLowerCase().includes(s) ||
        o.customer?.email?.toLowerCase().includes(s);

      const orderDate = new Date(o.createdAt);

      const matchDate =
        (!startDate || orderDate >= new Date(startDate)) &&
        (!endDate || orderDate <= new Date(endDate));

      const matchStatus =
        !statusFilter || o.displayFulfillmentStatus === statusFilter;

      return matchSearch && matchDate && matchStatus;
    });
  }, [orders, search, startDate, endDate, statusFilter]);

  const toggleOrder = (id) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map((o) => o.id));
    }
  };

  const exportOrders = (data, fileName) => {
    if (!data.length) return alert("No orders");

    const csv = [
      ["Order", "Status", "Total", "Customer", "Email", "Date"],
      ...data.map((o) => [
        o.name,
        o.displayFulfillmentStatus,
        o.totalPriceSet?.shopMoney?.amount,
        o.customer?.displayName,
        o.customer?.email,
        formatDate(o.createdAt),
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

  const exportAllOrders = () => exportOrders(filteredOrders, "all-orders.csv");

  const exportSelectedOrders = () => {
    const selected = filteredOrders.filter((o) =>
      selectedOrders.includes(o.id)
    );
    exportOrders(selected, "selected-orders.csv");
  };

const exportCustomOrders = async () => {
  console.log("Exporting custom orders...");

  if (!hasAccess(userPlan, "customProperties")) {
    alert("Upgrade to Pro plan to use Custom Export");
    return;
  }

  if (selectedOrders.length === 0) {
    alert("No orders selected for custom export");
    return;
  }

  const customSelectedOrders = filteredOrders.filter((o) =>
    selectedOrders.includes(o.id)
  );

  try {
    const res = await fetch("/app/export", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orders: customSelectedOrders }),
    });

    const text = await res.text();

    console.log("Response:", text);

    if (text.startsWith("<!DOCTYPE")) {
      alert("Still not authenticated ❌");
      return;
    }

    const blob = new Blob([text], { type: "text/csv" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "custom-orders.csv";
    a.click();

  } catch (err) {
    console.error(err);
    alert("Failed to export orders");
  }
};

  return (
    <div style={{ width: "100%", maxWidth: "100%", padding: "20px" }}>
      <s-page heading={`Orders (${userPlan} Plan)`} fullWidth>
        <s-section>
          <s-stack direction="block" gap="base">
            {/* SEARCH */}
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "6px",
                width: "300px",
              }}
            />

            {/* FILTER */}
            <div style={{ position: "relative" }}>
              <s-button onClick={() => setFiltersOpen(!filtersOpen)}>
                Filter by
              </s-button>

              {filtersOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "40px",
                    background: "#fff",
                    border: "1px solid #ddd",
                    padding: "15px",
                    borderRadius: "8px",
                    zIndex: 10,
                    width: "250px",
                  }}
                >
                  {!activeFilter && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <button onClick={() => setActiveFilter("date")}>
                        Date
                      </button>
                      <button onClick={() => setActiveFilter("status")}>
                        Status
                      </button>
                    </div>
                  )}

                  {activeFilter && (
                    <button onClick={() => setActiveFilter(null)}>← Back</button>
                  )}

                  {activeFilter === "date" && (
                    <>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </>
                  )}

                  {activeFilter === "status" && (
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="">All</option>
                      <option value="FULFILLED">Fulfilled</option>
                      <option value="UNFULFILLED">Unfulfilled</option>
                    </select>
                  )}
                </div>
              )}
            </div>

            {/* EXPORT BUTTONS */}
            <s-stack direction="inline" gap="base">
              <s-button onClick={exportAllOrders}>Export All</s-button>

              <s-button
                onClick={exportSelectedOrders}
                variant="primary"
                disabled={selectedOrders.length === 0}
              >
                Export Selected ({selectedOrders.length})
              </s-button>

              <s-button
                onClick={exportCustomOrders}
                variant="primary"
                disabled={
                  selectedOrders.length === 0 ||
                  !hasAccess(userPlan, "customProperties")
                }
              >
                Custom Export (Pro)
              </s-button>

            </s-stack>

            {/* TABLE */}
            <s-table>
              <s-table-head>
                <s-table-row>
                  <s-table-cell variant="header">
                    <input
                      type="checkbox"
                      checked={
                        selectedOrders.length === filteredOrders.length &&
                        filteredOrders.length > 0
                      }
                      onChange={toggleAll}
                    />
                  </s-table-cell>
                  <s-table-cell variant="header">Order</s-table-cell>
                  <s-table-cell variant="header">Status</s-table-cell>
                  <s-table-cell variant="header">Total</s-table-cell>
                  <s-table-cell variant="header">Customer</s-table-cell>
                  <s-table-cell variant="header">Email</s-table-cell>
                  <s-table-cell variant="header">Date</s-table-cell>
                </s-table-row>
              </s-table-head>

              <s-table-body>
                {filteredOrders.map((o) => (
                  <s-table-row key={o.id}>
                    <s-table-cell>
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(o.id)}
                        onChange={() => toggleOrder(o.id)}
                      />
                    </s-table-cell>
                    <s-table-cell>{o.name}</s-table-cell>
                    <s-table-cell>{o.displayFulfillmentStatus}</s-table-cell>
                    <s-table-cell>
                      {o.totalPriceSet?.shopMoney?.amount}{" "}
                      {o.totalPriceSet?.shopMoney?.currencyCode}
                    </s-table-cell>
                    <s-table-cell>{o.customer?.displayName}</s-table-cell>
                    <s-table-cell>{o.customer?.email}</s-table-cell>
                    <s-table-cell suppressHydrationWarning>
                      {formatDate(o.createdAt)}
                    </s-table-cell>
                  </s-table-row>
                ))}
              </s-table-body>
            </s-table>
          </s-stack>
        </s-section>
      </s-page>
    </div>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};