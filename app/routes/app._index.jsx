  import { useState, useMemo, useEffect } from "react";
  import { useLoaderData, useFetcher } from "react-router";
  import { boundary } from "@shopify/shopify-app-react-router/server";
  import { authenticate, getCurrentPlan } from "../shopify.server";
  import { hasAccess } from "../utils/plans";

  //  LOADER (UNCHANGED)
 export const loader = async ({ request }) => {
    const { admin } = await authenticate.admin(request);

    const plan = (await getCurrentPlan(admin) || "free")
      .toLowerCase()
      .trim();

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
    const [userPlan, setUserPlan] = useState(
      (plan || "free").toLowerCase().trim()
    );
    const isPro = userPlan === "pro";

    console.log("User Plan:", userPlan);

    const [selectedOrders, setSelectedOrders] = useState([]);
    const [search, setSearch] = useState("");
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const fetcher = useFetcher();

    //  Trigger download when fetcher.data is updated
    useEffect(() => {
      if (fetcher.data) {
        const blob = new Blob([fetcher.data], { type: "text/csv" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `custom-orders-${Date.now()}.csv`;
        a.click();
      }
    }, [fetcher.data]);

    useEffect(() => {
      if (import.meta.env.DEV) {
        const localPlan = localStorage.getItem("plan");
        if (localPlan) {
          setUserPlan(localPlan.toLowerCase());
          console.log("Index Page Plan:", localPlan);
        }
      }
    }, []);

    useEffect(() => {
      const syncPlan = () => {
        const localPlan = localStorage.getItem("plan");
        setUserPlan(localPlan ? localPlan.toLowerCase() : "free");
      };

      syncPlan(); // initial load

      window.addEventListener("storage", syncPlan);

      return () => window.removeEventListener("storage", syncPlan);
    }, []);

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

    //  Export helpers
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


      // ==================== Pro exports (with addon fields) ====================

      // Export all orders (Pro)
      const exportAllOrdersPro = () => {
        exportProOrders(filteredOrders, "all-orders-pro.csv");
      };

      // Export selected orders (Pro)
      const exportSelectedOrdersPro = () => {
        const selected = filteredOrders.filter(o => selectedOrders.includes(o.id));
        exportProOrders(selected, "selected-orders-pro.csv");
      };

      // ==================== Helper functions ====================


      // Generic Pro export function
      function exportProOrders(data, fileName) {
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
            (o.customAttributes || []).map(attr => `${attr.key}: ${attr.value}`).join(" | "),
            "", // Scheduled Export placeholder
            "", // Remove Shopify Branding placeholder
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
    }

 const exportCustomOrders = async () => {
  if (userPlan !== "pro") {
    alert("Upgrade to Pro plan to use Custom Export");
    return;
  }

  if (selectedOrders.length === 0) {
    alert("No orders selected");
    return;
  }

  const customSelectedOrders = filteredOrders.filter((o) =>
    selectedOrders.includes(o.id)
  );

  try {
    const res = await fetch("/app/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orders: customSelectedOrders }),
    });

    if (!res.ok) throw new Error("Failed to export orders");

    const text = await res.text();

    const blob = new Blob([text], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `custom-orders-${Date.now()}.csv`;
    a.click();

    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("EXPORT ERROR:", err);
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
                {isPro ? (
                  <>
                    <s-button className="btn-pro" onClick={exportAllOrdersPro}>
                      Export Orders + Addon Data
                    </s-button>

                    <s-button
                      className="btn-pro"
                      onClick={exportSelectedOrdersPro}
                      disabled={selectedOrders.length === 0}
                    >
                      Selected Export + Addon Data ({selectedOrders.length})
                    </s-button>

                    <s-button
                      className="btn-pro"
                      onClick={() => (window.location.href = "/app/price")}
                    >
                      Go to Plan Page
                    </s-button>
                  </>
                ) : (
                  <>
                    <s-button className="btn-free" onClick={exportAllOrders}>
                      Export Orders
                    </s-button>

                    <s-button
                      className="btn-free"
                      onClick={exportSelectedOrders}
                      disabled={selectedOrders.length === 0}
                    >
                      Selected Export ({selectedOrders.length})
                    </s-button>
                  </>
                )}
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