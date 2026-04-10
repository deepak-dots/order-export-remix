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
  const normalizedPlan = plan?.toLowerCase();
  const level = PLAN_HIERARCHY[normalizedPlan];
  const required = FEATURE_ACCESS[feature];

  if (required === undefined) return true; // free features

  return level >= required;
};