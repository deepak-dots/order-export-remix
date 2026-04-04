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

// ✅ Only 2 plans
const plans = [
  {
    name: "Free",
    price: "$0/month",
    features: [
      "Shopify default order export",
      "Manual export only",
    ],
  },
  {
    name: "Pro",
    price: "$5/month",
    features: [
      "Export custom properties",
      "Scheduled export",
      "Remove Shopify branding",
    ],
  },
];

// ✅ Plan hierarchy and feature access
export const PLAN_HIERARCHY = {
  Free: 0,
  Pro: 1,
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
  const activePlan = currentPlan || localStorage.getItem("userPlan") || "Free";

  return (
    <div style={{ overflowX: "auto" }}>
      <InlineStack gap="400" wrap={false}>
        {plans.map((plan) => (
          <div key={plan.name} style={{ minWidth: "280px" }}>
            <Card
              sectioned
              // ✅ Highlight current plan
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

                {/* ✅ PLAN BUTTON */}
                {plan.name === activePlan ? (
                  <Button variant="secondary" fullWidth disabled>
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => {
                      if (plan.name === "Free") {
                        navigate("/app");
                        return;
                      }

                      // ✅ DEV MODE
                      if (import.meta.env.VITE_SHOPIFY_APP_PUBLIC !== "true") {
                        localStorage.setItem("userPlan", plan.name);
                        alert(`Simulating subscription for ${plan.name} plan`);
                        navigate("/app");
                        return;
                      }

                      // ✅ PRODUCTION
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