import React from 'react';
import { useApp } from '../context/AppContext';
import {
  CreditCard,
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  Check,
  Clock,
} from 'lucide-react';

export const BillingPage: React.FC = () => {
  const { user, plans, activePlan, upgradePlan, resumes, analyses, jobTargets, coverLetters, addToast } = useApp();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Subscription & Usage Management
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Review your active quota, upgrade your plan, or manage feature entitlements.
        </p>
      </div>

      {/* Active Plan & Usage Meter Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Current Subscription</div>
            <div className="text-2xl font-extrabold text-slate-900 flex items-center gap-2 mt-1">
              <span>{activePlan.name}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Active
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{activePlan.tagline}</p>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-2xl font-black text-slate-900">
              ${activePlan.priceMonthly} <span className="text-xs font-medium text-slate-500">/ month</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Renews automatically each month</div>
          </div>
        </div>

        {/* Real-time Usage Meters */}
        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-4">
            Current Monthly Usage Quotas
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Meter 1: Resumes */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 font-medium">Resumes Created</span>
                <span className="font-bold text-slate-900">{resumes.length} / {activePlan.limits.resumesMax}</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${Math.min(100, (resumes.length / activePlan.limits.resumesMax) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Meter 2: ATS Scans */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 font-medium">ATS Compatibility Scans</span>
                <span className="font-bold text-slate-900">{analyses.length} / {activePlan.limits.analysesPerMonth}</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{ width: `${Math.min(100, (analyses.length / activePlan.limits.analysesPerMonth) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Meter 3: Job Targets */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 font-medium">Job Match Reports</span>
                <span className="font-bold text-slate-900">{jobTargets.length} / {activePlan.limits.jobMatchesPerMonth}</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-2 rounded-full"
                  style={{ width: `${Math.min(100, (jobTargets.length / activePlan.limits.jobMatchesPerMonth) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Meter 4: Cover Letters */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 font-medium">Cover Letters</span>
                <span className="font-bold text-slate-900">{coverLetters.length} / {activePlan.limits.coverLettersPerMonth}</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: `${Math.min(100, (coverLetters.length / activePlan.limits.coverLettersPerMonth) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plans Comparison & Upgrade Flow */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-900 text-lg">Available Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isCurrent = plan.id === activePlan.id;

            return (
              <div
                key={plan.id}
                className={`bg-white rounded-2xl p-6 border ${
                  isCurrent ? 'border-2 border-blue-600 shadow-md' : 'border-slate-200 shadow-xs'
                } flex flex-col justify-between`}
              >
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold text-slate-900 text-base">{plan.name}</h4>
                    {isCurrent && (
                      <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 min-h-[32px]">{plan.tagline}</p>

                  <div className="my-5">
                    <span className="text-3xl font-black text-slate-900">${plan.priceMonthly}</span>
                    <span className="text-xs text-slate-500 ml-1">/ month</span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-700 pt-3 border-t border-slate-100">
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-3">
                  {isCurrent ? (
                    <button
                      disabled
                      className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-400 bg-slate-100 cursor-not-allowed"
                    >
                      Active Plan
                    </button>
                  ) : (
                    <button
                      onClick={() => upgradePlan(plan.id)}
                      className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all cursor-pointer"
                    >
                      Switch to {plan.name}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
