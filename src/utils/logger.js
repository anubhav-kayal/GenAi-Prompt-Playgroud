export const logActivity = (type, target, status, tokens = 0) => {
  // 1. Fetch existing logs (or an empty array if none exist)
  const existingLogs = JSON.parse(localStorage.getItem('nexus_logs') || '[]');
  
  // 2. Create the new log entry
  const newLog = {
    id: Date.now(),
    type,       // e.g., "Code Refactor" or "Text Generation"
    target,     // e.g., "React useEffect debug"
    status,     // "Success" or "Failed"
    tokens,     // Estimated tokens used
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    timestamp: Date.now()
  };

  // 3. Save the updated array back to local storage (keeping only the latest 50 logs to save space)
  const updatedLogs = [newLog, ...existingLogs].slice(0, 50);
  localStorage.setItem('nexus_logs', JSON.stringify(updatedLogs));
  
  return updatedLogs;
};

export const getLogs = () => {
  return JSON.parse(localStorage.getItem('nexus_logs') || '[]');
};

export const getStats = () => {
  const logs = getLogs();
  const successfulLogs = logs.filter(log => log.status === 'Success');
  
  return {
    totalCalls: logs.length,
    successRate: logs.length ? Math.round((successfulLogs.length / logs.length) * 100) : 0,
    totalTokens: logs.reduce((sum, log) => sum + (log.tokens || 0), 0)
  };
};