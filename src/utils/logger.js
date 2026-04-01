const LOG_KEY = 'nexus_logs';
const MAX_LOGS = 200;

const safeParse = (value, fallback) => {
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

export const logActivity = (type, target, status, tokens = 0, meta = {}) => {
  const existingLogs = safeParse(localStorage.getItem(LOG_KEY), []);

  const inputTokens = Number(meta.inputTokens ?? 0);
  const outputTokens = Number(meta.outputTokens ?? 0);
  const cachedInputTokens = Number(meta.cachedInputTokens ?? 0);

  const fallbackTotalFromParts = inputTokens + outputTokens;
  const totalTokens = Number(
    meta.totalTokens ?? (fallbackTotalFromParts > 0 ? fallbackTotalFromParts : tokens ?? 0)
  );

  const newLog = {
    id: Date.now(),
    type,
    target,
    status,
    requestType: meta.requestType || type,
    model: meta.model || 'unknown-model',
    inputTokens,
    outputTokens,
    cachedInputTokens,
    totalTokens,
    tokens: totalTokens,
    costUsd: Number(meta.costUsd ?? 0),
    currency: 'USD',
    errorMessage: meta.errorMessage || '',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    timestamp: Date.now(),
  };

  const updatedLogs = [newLog, ...existingLogs].slice(0, MAX_LOGS);
  localStorage.setItem(LOG_KEY, JSON.stringify(updatedLogs));
  return updatedLogs;
};

export const getLogs = () => {
  return safeParse(localStorage.getItem(LOG_KEY), []);
};

export const getStats = () => {
  const logs = getLogs();
  const successfulLogs = logs.filter((log) => log.status === 'Success');

  const inputTokens = logs.reduce((sum, log) => sum + Number(log.inputTokens || 0), 0);
  const outputTokens = logs.reduce((sum, log) => sum + Number(log.outputTokens || 0), 0);
  const totalTokens = logs.reduce((sum, log) => sum + Number(log.totalTokens || log.tokens || 0), 0);
  const totalSpendUsd = logs.reduce((sum, log) => sum + Number(log.costUsd || 0), 0);

  return {
    totalCalls: logs.length,
    successRate: logs.length ? Math.round((successfulLogs.length / logs.length) * 100) : 0,
    inputTokens,
    outputTokens,
    totalTokens,
    totalSpendUsd: Number(totalSpendUsd.toFixed(6)),
    avgCostPerCallUsd: logs.length ? Number((totalSpendUsd / logs.length).toFixed(6)) : 0,
  };
};

export const clearLogs = () => {
  localStorage.removeItem(LOG_KEY);
};

