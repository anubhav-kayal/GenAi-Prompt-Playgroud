import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Coins, CreditCard, ReceiptText, TrendingUp } from 'lucide-react';
import { getLogs } from '../utils/logger';
import {
  BILLING_PLANS,
  formatUsd,
  getCurrentBillingPlan,
  getMonthUsage,
  quoteFromForecast,
  saveBillingPlanId,
} from '../utils/billing';

const Billing = () => {
  const [selectedPlanId, setSelectedPlanId] = useState(getCurrentBillingPlan().id);
  const [forecast, setForecast] = useState({
    expectedInputTokens: 12000,
    expectedOutputTokens: 8000,
    expectedCachedInputTokens: 0,
    platformFeePercent: 10,
  });

  const logs = getLogs();

  const usage = useMemo(() => getMonthUsage(logs), [logs]);
  const selectedPlan = useMemo(
    () => BILLING_PLANS.find((plan) => plan.id === selectedPlanId) || BILLING_PLANS[0],
    [selectedPlanId]
  );

  const budgetUsedPercent = Math.min(
    100,
    selectedPlan.monthlyBudgetUsd > 0
      ? (usage.totalSpendUsd / selectedPlan.monthlyBudgetUsd) * 100
      : 0
  );

  const quote = useMemo(
    () =>
      quoteFromForecast({
        model: 'gemini-2.5-flash',
        expectedInputTokens: Number(forecast.expectedInputTokens || 0),
        expectedOutputTokens: Number(forecast.expectedOutputTokens || 0),
        expectedCachedInputTokens: Number(forecast.expectedCachedInputTokens || 0),
        platformFeePercent: Number(forecast.platformFeePercent || 0),
      }),
    [forecast]
  );

  const onPlanChange = (planId) => {
    setSelectedPlanId(planId);
    saveBillingPlanId(planId);
  };

  return (
    <div className="flex flex-col h-full w-full bg-zinc-950 p-6 lg:p-8 overflow-auto">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h2 className="text-3xl font-black text-white tracking-tight">Billing & Quotes</h2>
        <p className="text-zinc-400 mt-2 text-sm max-w-2xl">
          Token-based billing with live monthly usage, estimated cost tracking, and request quote forecasting.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-zinc-900/40 border border-zinc-800/70 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard size={16} className="text-cyan-400" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-200">Plan</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {BILLING_PLANS.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => onPlanChange(plan.id)}
                  className={`text-left rounded-xl border p-4 transition-colors ${
                    selectedPlan.id === plan.id
                      ? 'border-cyan-500/40 bg-cyan-500/10'
                      : 'border-zinc-800 bg-zinc-900/70 hover:border-zinc-700'
                  }`}
                >
                  <p className="text-sm font-semibold text-white mb-1">{plan.name}</p>
                  <p className="text-xs text-zinc-500">Monthly budget</p>
                  <p className="text-lg font-black text-cyan-300 mt-1">{formatUsd(plan.monthlyBudgetUsd)}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/70 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Coins size={16} className="text-cyan-400" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-200">Current Month Usage</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3">
                <p className="text-[10px] uppercase tracking-widest text-zinc-500">Calls</p>
                <p className="text-xl font-black text-white">{usage.totalCalls}</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3">
                <p className="text-[10px] uppercase tracking-widest text-zinc-500">Input Tokens</p>
                <p className="text-xl font-black text-white">{usage.inputTokens.toLocaleString()}</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3">
                <p className="text-[10px] uppercase tracking-widest text-zinc-500">Output Tokens</p>
                <p className="text-xl font-black text-white">{usage.outputTokens.toLocaleString()}</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3">
                <p className="text-[10px] uppercase tracking-widest text-zinc-500">Spend</p>
                <p className="text-xl font-black text-cyan-300">{formatUsd(usage.totalSpendUsd)}</p>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-zinc-400">Budget utilization</span>
                <span className="text-cyan-300 font-semibold">{budgetUsedPercent.toFixed(1)}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-950 border border-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-600 to-blue-500"
                  style={{ width: `${budgetUsedPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-zinc-500 mt-2">
                {formatUsd(usage.totalSpendUsd)} of {formatUsd(selectedPlan.monthlyBudgetUsd)} used.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900/40 border border-zinc-800/70 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calculator size={16} className="text-cyan-400" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-200">Quote Estimator</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-zinc-400">Expected Input Tokens</label>
                <input
                  type="number"
                  min="0"
                  value={forecast.expectedInputTokens}
                  onChange={(event) =>
                    setForecast((prev) => ({ ...prev, expectedInputTokens: event.target.value }))
                  }
                  className="mt-1 w-full rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-zinc-200"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400">Expected Output Tokens</label>
                <input
                  type="number"
                  min="0"
                  value={forecast.expectedOutputTokens}
                  onChange={(event) =>
                    setForecast((prev) => ({ ...prev, expectedOutputTokens: event.target.value }))
                  }
                  className="mt-1 w-full rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-zinc-200"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400">Cached Input Tokens</label>
                <input
                  type="number"
                  min="0"
                  value={forecast.expectedCachedInputTokens}
                  onChange={(event) =>
                    setForecast((prev) => ({ ...prev, expectedCachedInputTokens: event.target.value }))
                  }
                  className="mt-1 w-full rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-zinc-200"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400">Platform Fee (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={forecast.platformFeePercent}
                  onChange={(event) =>
                    setForecast((prev) => ({ ...prev, platformFeePercent: event.target.value }))
                  }
                  className="mt-1 w-full rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-zinc-200"
                />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/10 border border-cyan-800/30 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <ReceiptText size={16} className="text-cyan-300" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-cyan-100">Quote Summary</h3>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-zinc-300">
                <span>Provider cost</span>
                <span>{formatUsd(quote.providerCostUsd)}</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>Platform fee</span>
                <span>{formatUsd(quote.platformFeeUsd)}</span>
              </div>
              <div className="h-px bg-zinc-700 my-2" />
              <div className="flex justify-between font-bold text-cyan-200">
                <span>Total quote</span>
                <span>{formatUsd(quote.quoteTotalUsd)}</span>
              </div>
            </div>

            <div className="mt-6 text-[11px] text-zinc-400">
              Per-request estimate using Gemini 2.5 Flash pricing and your input/output token forecast.
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/70 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={16} className="text-cyan-400" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-200">Tip</h3>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Reduce output token caps for low-complexity prompts to lower blended request cost and increase monthly run volume.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;