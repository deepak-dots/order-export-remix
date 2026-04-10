import React from "react";
import { useNavigate } from "react-router";

import {
  Card,
  Text,
  Button,
  Badge,
  InlineStack,
  BlockStack,
} from "@shopify/polaris";

// freeOnly 2 plans
const plans = [
  {
    name: "free",
    price: "$0/month",
    features: [
      "Shopify default order export",
      "Manual export only",
    ],
  },
  {
    name: "pro",
    price: "$5/month",
    features: [
      "Export custom properties",
      "Scheduled export",
      "Remove Shopify branding",
    ],
  },
];

// freePlan hierarchy and feature access
export const PLAN_HIERARCHY = {
  free: 0,
  pro: 1,
};

export const FEATURE_ACCESS = {
  customProperties: 1,
  removeBranding: 1,
  metafields: 1,
};

export const hasAccess = (plan, feature) => {
  const level = PLAN_HIERARCHY[plan];
  const required = FEATURE_ACCESS[feature];

  if (required === undefined) return true; // free features
  return level >= required;
};

export default function PricingTable({ currentPlan }) {
  const navigate = useNavigate();
  const activePlan = (currentPlan || "free").toLowerCase();

  return (
    <div style={{ overflowX: "auto" }}>
      <InlineStack gap="400" wrap={false}>
        {plans.map((plan) => (
          <div key={plan.name} style={{ minWidth: "280px" }}>
            <Card
              sectioned
              // freeHighlight current plan
              borderColor={plan.name === activePlan ? "#28a745" : undefined}
            >
              <BlockStack gap="300">

                <InlineStack align="space-between">
                  <Text variant="headingMd">{plan.name}</Text>
                  {plan.recommended && (
                    <Badge tone="success">Recommended</Badge>
                  )}
                </InlineStack>

                <Text variant="headingLg" fontWeight="bold">
                  {plan.price}
                </Text>

                <BlockStack gap="200">
                  {plan.features.map((feature, index) => (
                    <Text key={index} as="p" tone="subdued">
                      • {feature}
                    </Text>
                  ))}
                </BlockStack>

                {/* freePLAN BUTTON */}
                {plan.name === activePlan ? (
                  <Button variant="secondary" fullWidth disabled>
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => {
                      if (plan.name === "free") {
                        localStorage.removeItem("plan"); // reset plan
                        window.dispatchEvent(new Event("storage")); // force UI update
                        navigate("/app");
                        return;
                      }

                      // DEV MODE
                      if (import.meta.env.DEV) {
                        localStorage.setItem("plan", plan.name);
                        alert(`Simulating ${plan.name} plan`);
                        navigate("/app");
                        return;
                      }

                      // PRODUCTION
                      navigate(`/app/subscribe?plan=${plan.name}`);
                    }}
                  >
                    Choose {plan.name}
                  </Button>
                )}

              </BlockStack>
            </Card>
          </div>
        ))}
      </InlineStack>
    </div>
  );
}