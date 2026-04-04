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