import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import { useLoaderData } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate, getCurrentPlan } from "../shopify.server";
import { Page, Layout, useIndexResourceState } from "@shopify/polaris";
import OrdersTable from "../components/OrdersTable";
import OrdersFilters from "../components/FilterSection";
import OrdersExport from "../components/OrdersExportButton";
import PlanBanner from "../components/PlanBanner";

import { exportOrders } from "../utils/freeExportOrdersCSV";
import { exportProOrders } from "../utils/proExportOrdersCSV";

/* ================= LOADER ================= */
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

/* ================= MAIN ================= */
export default function Index() {
  const navigate = useNavigate();

  const { orders, plan } = useLoaderData();

  const [userPlan, setUserPlan] = useState(plan);
  const isPro = userPlan === "pro";

  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");


  const [productFilter, setProductFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [customFilter, setCustomFilter] = useState("");
  const [metafieldFilter, setMetafieldFilter] = useState("");


  /* ================= PLAN SYNC ================= */
  useEffect(() => {
    const syncPlan = () => {
      const localPlan = localStorage.getItem("plan");
      setUserPlan(localPlan ? localPlan.toLowerCase() : plan);
    };

    syncPlan();
    window.addEventListener("storage", syncPlan);

    return () => window.removeEventListener("storage", syncPlan);
  }, [plan]);

  /* ================= DATE FORMAT ================= */
  const formatDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  /* ================= FILTER ORDERS ================= */
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

  /* ================= SELECTION ================= */
const {
  selectedResources: selectedOrders,
  allResourcesSelected,
  handleSelectionChange,
} = useIndexResourceState(filteredOrders);


  // free plan export (basic)
  const exportAllOrders = () =>
    exportOrders(filteredOrders, "all-orders.csv", formatDate);

  const exportSelectedOrders = () => {
    const selected = filteredOrders.filter((o) =>
      selectedOrders.includes(o.id)
    );

    exportOrders(selected, "selected-orders.csv", formatDate);
  };


  // pro plan export (with custom properties + extra columns)
  const exportAllOrdersPro = () =>
    exportProOrders(filteredOrders, "all-orders-pro.csv", formatDate);

  const exportSelectedOrdersPro = () => {
    const selected = filteredOrders.filter((o) =>
      selectedOrders.includes(o.id)
    );

    exportProOrders(selected, "selected-orders-pro.csv", formatDate);
  };

  return (
    <div style={{ padding: "20px" }}>
      <PlanBanner plan={userPlan} />
      <Page fullWidth title="">
        <s-section>
          <s-stack direction="block" gap="base">

            {/* FILTERS */}
            <OrdersFilters
              search={search}
              setSearch={setSearch}

              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}

              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}

              productFilter={productFilter}
              setProductFilter={setProductFilter}

              tagFilter={tagFilter}
              setTagFilter={setTagFilter}

              customFilter={customFilter}
              setCustomFilter={setCustomFilter}

              metafieldFilter={metafieldFilter}
              setMetafieldFilter={setMetafieldFilter}
            />

            <OrdersExport
              isPro={isPro}
              exportAllOrders={exportAllOrders}
              exportSelectedOrders={exportSelectedOrders}
              exportAllOrdersPro={exportAllOrdersPro}
              exportSelectedOrdersPro={exportSelectedOrdersPro}
              selectedOrders={selectedOrders}
              goToPlan={() => navigate("/app/price")}
            />

            <OrdersTable
              filteredOrders={filteredOrders}
              selectedOrders={selectedOrders}
              handleSelectionChange={handleSelectionChange}
              formatDate={formatDate}
            />

          </s-stack>
        </s-section>
      </Page>
    </div>
  );
}

export const headers = (args) => boundary.headers(args);