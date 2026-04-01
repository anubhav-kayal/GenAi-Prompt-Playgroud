export const MODEL_PRICING = {
  'gemini-2.5-flash': {
    displayName: 'Gemini 2.5 Flash',
    inputPerMillionUsd: 0.35,
    outputPerMillionUsd: 1.05,
    cachedInputPerMillionUsd: 0.0875,
  },
};

export const BILLING_PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    monthlyBudgetUsd: 15,
    softLimitPercent: 80,
    hardLimitPercent: 100,
  },
  {
    id: 'growth',
    name: 'Growth',
    monthlyBudgetUsd: 75,
    softLimitPercent: 85,
    hardLimitPercent: 100,
  },
  {
    id: 'scale',
    name: 'Scale',
    monthlyBudgetUsd: 250,
    softLimitPercent: 90,
    hardLimitPercent: 100,
  },
];

const BILLING_PLAN_KEY = 'nexus_billing_plan';

export const roundUsd = (value) => Number(Number(value || 0).toFixed(6));

export const formatUsd = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0);

export const getModelPricing = (model) => {
  return MODEL_PRICING[model] || MODEL_PRICING['gemini-2.5-flash'];
};

export const extractUsageFromGeminiResponse = (response, fallbackText = '') => {
  const usage = response?.usageMetadata || {};
  const inputTokens = Number(usage.promptTokenCount ?? 0);
  const outputTokens = Number(usage.candidatesTokenCount ?? 0);
  const totalFromMetadata = Number(usage.totalTokenCount ?? 0);

  const estimatedOutputTokens = Math.max(1, Math.round((fallbackText || '').length / 4));
  const safeOutputTokens = outputTokens > 0 ? outputTokens : estimatedOutputTokens;
  const safeTotal = totalFromMetadata > 0 ? totalFromMetadata : inputTokens + safeOutputTokens;

  return {
    inputTokens,
    outputTokens: safeOutputTokens,
    cachedInputTokens: Number(usage.cachedContentTokenCount ?? 0),
    totalTokens: safeTotal,
  };
};

export const calculateRequestCostUsd = ({
  model,
  inputTokens = 0,
  outputTokens = 0,
  cachedInputTokens = 0,
}) => {
  const pricing = getModelPricing(model);

  const inputCostUsd = (Number(inputTokens) / 1_000_000) * pricing.inputPerMillionUsd;
  const outputCostUsd = (Number(outputTokens) / 1_000_000) * pricing.outputPerMillionUsd;
  const cachedInputCostUsd =
    (Number(cachedInputTokens) / 1_000_000) * pricing.cachedInputPerMillionUsd;

  const totalCostUsd = inputCostUsd + outputCostUsd + cachedInputCostUsd;

  return {
    model: model || 'gemini-2.5-flash',
    inputCostUsd: roundUsd(inputCostUsd),
    outputCostUsd: roundUsd(outputCostUsd),
    cachedInputCostUsd: roundUsd(cachedInputCostUsd),
    totalCostUsd: roundUsd(totalCostUsd),
  };
};

export const saveBillingPlanId = (planId) => {
  localStorage.setItem(BILLING_PLAN_KEY, planId);
};

export const getCurrentBillingPlan = () => {
  const saved = localStorage.getItem(BILLING_PLAN_KEY);
  const found = BILLING_PLANS.find((plan) => plan.id === saved);
  return found || BILLING_PLANS[0];
};

export const isCurrentMonth = (timestamp) => {
  if (!timestamp) return false;
  const now = new Date();
  const value = new Date(timestamp);
  return value.getFullYear() === now.getFullYear() && value.getMonth() === now.getMonth();
};

export const getMonthUsage = (logs) => {
  const monthLogs = (logs || []).filter((log) => isCurrentMonth(log.timestamp));

  const totalCalls = monthLogs.length;
  const inputTokens = monthLogs.reduce((sum, log) => sum + Number(log.inputTokens || 0), 0);
  const outputTokens = monthLogs.reduce((sum, log) => sum + Number(log.outputTokens || 0), 0);
  const totalTokens = monthLogs.reduce((sum, log) => sum + Number(log.totalTokens || log.tokens || 0), 0);
  const totalSpendUsd = monthLogs.reduce((sum, log) => sum + Number(log.costUsd || 0), 0);

  return {
    logs: monthLogs,
    totalCalls,
    inputTokens,
    outputTokens,
    totalTokens,
    totalSpendUsd: roundUsd(totalSpendUsd),
  };
};

export const quoteFromForecast = ({
  model = 'gemini-2.5-flash',
  expectedInputTokens = 0,
  expectedOutputTokens = 0,
  expectedCachedInputTokens = 0,
  platformFeePercent = 10,
}) => {
  const provider = calculateRequestCostUsd({
    model,
    inputTokens: expectedInputTokens,
    outputTokens: expectedOutputTokens,
    cachedInputTokens: expectedCachedInputTokens,
  });

  const platformFeeUsd = roundUsd((provider.totalCostUsd * Number(platformFeePercent || 0)) / 100);
  const quoteTotalUsd = roundUsd(provider.totalCostUsd + platformFeeUsd);

  return {
    providerCostUsd: provider.totalCostUsd,
    platformFeeUsd,
    quoteTotalUsd,
    breakdown: provider,
  };
};