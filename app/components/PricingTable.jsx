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
    name: "Basic",
    price: "$3/month",
    features: ["Export custom properties"],
  },
  {
    name: "Pro",
    price: "$5/month",
    features: ["Scheduled export"],
  },
  {
    name: "Advanced",
    price: "$9/month",
    features: ["Email delivery"],
    recommended: true,
  },
  {
    name: "Plus",
    price: "$14/month",
    features: ["API access"],
  },
];



export default function PricingTable() {
  const navigate = useNavigate();

  return (
    <div style={{ overflowX: "auto" }}>
      <InlineStack gap="400" wrap={false}>
        {plans.map((plan) => (
          <div key={plan.name} style={{ minWidth: "280px" }}>
            <Card>
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

                {/* ✅ FIXED BUTTON */}
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

              </BlockStack>
            </Card>
          </div>
        ))}
      </InlineStack>
    </div>
  );
}