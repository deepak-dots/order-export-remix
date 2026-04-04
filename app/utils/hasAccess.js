import { PLANS } from "./plans";

export function hasAccess(plan, feature) {
  const currentPlan = PLANS[plan] || PLANS.Free;

  return !!currentPlan.features[feature];
}