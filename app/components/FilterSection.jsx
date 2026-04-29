import {
  TextField,
  Button,
  Popover,
  ActionList,
  Card,
  Select,
  Text,
  BlockStack,
  InlineStack,
  Tag,
} from "@shopify/polaris";
import { useState, useCallback } from "react";

export default function OrdersFilters({
  search,
  setSearch,

  startDate,
  setStartDate,
  endDate,
  setEndDate,

  statusFilter,
  setStatusFilter,

  productFilter,
  setProductFilter,
  tagFilter,
  setTagFilter,
  customFilter,
  setCustomFilter,
  metafieldFilter,
  setMetafieldFilter,
}) {
  const [popoverActive, setPopoverActive] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const goBack = () => setActiveFilter(null);

  const togglePopover = useCallback(
    () => setPopoverActive((active) => !active),
    []
  );

  const activator = <Button onClick={togglePopover}>Filter</Button>;

  return (
    <BlockStack gap="300">
      
      {/* SEARCH + BUTTON */}
      <InlineStack gap="200">
        <TextField
          value={search}
          onChange={setSearch}
          placeholder="Search orders..."
          autoComplete="off"
        />

        <Popover active={popoverActive} activator={activator} onClose={togglePopover}>
          <Card>
            <BlockStack gap="300" padding="300">

              {!activeFilter && (
                <ActionList
                  items={[
                    { content: "Date", onAction: () => setActiveFilter("date") },
                    { content: "Status", onAction: () => setActiveFilter("status") },
                    { content: "Product", onAction: () => setActiveFilter("product") },
                    { content: "Tag", onAction: () => setActiveFilter("tag") },
                    { content: "Custom Property", onAction: () => setActiveFilter("custom") },
                    { content: "Metafield", onAction: () => setActiveFilter("meta") },
                  ]}
                />
              )}

              {/* DATE */}
              {activeFilter === "date" && (
                <BlockStack>
                  <Button onClick={() => {
                    const today = new Date().toISOString().split("T")[0];
                    setStartDate(today);
                    setEndDate(today);
                  }}>Today</Button>

                  <Button onClick={() => {
                    const now = new Date();
                    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
                    setStartDate(firstDay.toISOString().split("T")[0]);
                    setEndDate(new Date().toISOString().split("T")[0]);
                  }}>This Month</Button>

                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

                  <Button onClick={() => setActiveFilter(null)}>Back</Button>
                </BlockStack>
              )}

              {/* STATUS */}
              {activeFilter === "status" && (
                <BlockStack gap="200">
                  <Text variant="headingSm">Select Status</Text>

                  <Select
                    options={[
                      { label: "All", value: "" },
                      { label: "Fulfilled", value: "FULFILLED" },
                      { label: "Unfulfilled", value: "UNFULFILLED" },
                    ]}
                    value={statusFilter}
                    onChange={setStatusFilter}
                  />

                  <Button onClick={goBack}>Back</Button>
                </BlockStack>
              )}

              {/* PRODUCT */}
              {activeFilter === "product" && (
                <BlockStack gap="200">
                  <Text variant="headingSm">Product</Text>

                  <TextField
                    value={productFilter}
                    onChange={setProductFilter}
                  />

                  <Button onClick={goBack}>Back</Button>
                </BlockStack>
              )}

              {/* TAG */}
              {activeFilter === "tag" && (
                <BlockStack gap="200">
                  <Text variant="headingSm">Tag</Text>

                  <TextField
                    value={tagFilter}
                    onChange={setTagFilter}
                  />

                  <Button onClick={goBack}>Back</Button>
                </BlockStack>
              )}

              {/* CUSTOM */}
              {activeFilter === "custom" && (
                <BlockStack gap="200">
                  <Text variant="headingSm">Custom Property</Text>

                  <TextField
                    value={customFilter}
                    onChange={setCustomFilter}
                  />

                  <Button onClick={goBack}>Back</Button>
                </BlockStack>
              )}

              {/* META */}
              {activeFilter === "meta" && (
                <BlockStack gap="200">
                  <Text variant="headingSm">Metafield</Text>

                  <TextField
                    value={metafieldFilter}
                    onChange={setMetafieldFilter}
                  />

                  <Button onClick={goBack}>Back</Button>
                </BlockStack>
              )}

            </BlockStack>
          </Card>
        </Popover>
      </InlineStack>

      {/* 🔥 SELECTED FILTER TAGS */}
      <InlineStack gap="200">

        {statusFilter && (
          <Tag onRemove={() => setStatusFilter("")}>
            Status: {statusFilter}
          </Tag>
        )}

        {startDate && (
          <Tag onRemove={() => {
            setStartDate("");
            setEndDate("");
          }}>
            Date: {startDate} → {endDate}
          </Tag>
        )}

        {productFilter && (
          <Tag onRemove={() => setProductFilter("")}>
            Product: {productFilter}
          </Tag>
        )}

        {tagFilter && (
          <Tag onRemove={() => setTagFilter("")}>
            Tag: {tagFilter}
          </Tag>
        )}

        {customFilter && (
          <Tag onRemove={() => setCustomFilter("")}>
            Custom: {customFilter}
          </Tag>
        )}

        {metafieldFilter && (
          <Tag onRemove={() => setMetafieldFilter("")}>
            Meta: {metafieldFilter}
          </Tag>
        )}

      </InlineStack>
    </BlockStack>
  );
}