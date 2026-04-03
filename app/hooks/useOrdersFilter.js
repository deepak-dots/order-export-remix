import { useMemo } from "react";

export function useOrdersFilter(orders, search, startDate, endDate, statusFilter) {
  return useMemo(() => {
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
        !statusFilter ||
        o.displayFulfillmentStatus === statusFilter;

      return matchSearch && matchDate && matchStatus;
    });
  }, [orders, search, startDate, endDate, statusFilter]);
}