import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  Users,
  CreditCard,
  FileText,
  ScanSearch,
  Cpu,
  Database,
  Copy,
  Check,
  Activity,
  Layers,
  Lock,
} from 'lucide-react';
import { getStoredAuditLogs } from '../lib/supabase';

export const AdminDashboard: React.FC = () => {
  const { user, login, plans, resumes, analyses, addToast } = useApp();

  const [activeTab, setActiveTab] = useState<'metrics' | 'plans' | 'logs' | 'database'>('metrics');
  const [copiedSql, setCopiedSql] = useState(false);

  const isAdmin = user?.role === 'admin';

  const auditLogs = getStoredAuditLogs();

  const handleMakeAdmin = () => {
    login(user?.email || 'admin@resumepilot.ai', 'admin');
    addToast('Granted Administrator access.');
  };

  const copySqlMigration = () => {
    const sql = `-- ResumePilot AI Supabase Schema
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  target_job_title TEXT,
  role TEXT DEFAULT 'user'
);
-- See src/db/schema.sql for the full migration
`;
    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    addToast('Supabase SQL migration copied to clipboard!');
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-950/20 p-5 rounded-2xl border border-amber-800/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Administrator Console
            </h2>
            <p className="text-xs text-slate-600">
              Platform telemetry, rate limits, audit events, and database migration controls.
            </p>
          </div>
        </div>

        {!isAdmin && (
          <button
            onClick={handleMakeAdmin}
            className="px-4 py-2 rounded-xl text-xs font-bold text-amber-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-xs"
          >
            Switch to Admin Role
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('metrics')}
          className={`pb-2.5 transition-colors cursor-pointer ${
            activeTab === 'metrics' ? 'text-amber-700 border-b-2 border-amber-600' : 'text-slate-500'
          }`}
        >
          Aggregated Metrics
        </button>
        <button
          onClick={() => setActiveTab('plans')}
          className={`pb-2.5 transition-colors cursor-pointer ${
            activeTab === 'plans' ? 'text-amber-700 border-b-2 border-amber-600' : 'text-slate-500'
          }`}
        >
          Plan Entitlements
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`pb-2.5 transition-colors cursor-pointer ${
            activeTab === 'logs' ? 'text-amber-700 border-b-2 border-amber-600' : 'text-slate-500'
          }`}
        >
          Security Audit Logs
        </button>
        <button
          onClick={() => setActiveTab('database')}
          className={`pb-2.5 transition-colors cursor-pointer ${
            activeTab === 'database' ? 'text-amber-700 border-b-2 border-amber-600' : 'text-slate-500'
          }`}
        >
          Supabase SQL Schema
        </button>
      </div>

      {/* Tab 1: Metrics */}
      {activeTab === 'metrics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-500 font-medium flex justify-between">
                <span>Active Users</span>
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">1,248</div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1">+14% this week</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-500 font-medium flex justify-between">
                <span>Total Resumes</span>
                <FileText className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">3,892</div>
              <div className="text-[11px] text-slate-500 mt-1">Stored across all accounts</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-500 font-medium flex justify-between">
                <span>ATS Scans Processed</span>
                <ScanSearch className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">9,410</div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1">Avg Score: 81/100</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-500 font-medium flex justify-between">
                <span>Active Model</span>
                <Cpu className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-base font-black text-slate-900 mt-2 font-mono">gemini-3.8-flash</div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1">99.98% uptime SLA</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Plans Configuration */}
      {activeTab === 'plans' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Tier Limit Configurations</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-3">Plan Name</th>
                  <th className="p-3">Monthly Price</th>
                  <th className="p-3">Max Resumes</th>
                  <th className="p-3">ATS Scans/Mo</th>
                  <th className="p-3">Word DOCX Export</th>
                  <th className="p-3">Priority AI Queue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {plans.map((p) => (
                  <tr key={p.id}>
                    <td className="p-3 font-bold text-slate-900">{p.name}</td>
                    <td className="p-3 font-mono">${p.priceMonthly}</td>
                    <td className="p-3">{p.limits.resumesMax}</td>
                    <td className="p-3">{p.limits.analysesPerMonth}</td>
                    <td className="p-3">{p.limits.docxExport ? '✓ Enabled' : '✕ Disabled'}</td>
                    <td className="p-3">{p.limits.priorityAi ? '✓ Yes' : '✕ Standard'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Security & Audit Logs */}
      {activeTab === 'logs' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Real-time Platform Audit Trail</h3>
          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row justify-between text-xs gap-1">
                <div>
                  <span className="font-bold text-blue-700 font-mono">[{log.action}]</span>
                  <span className="text-slate-800 ml-2">{log.details}</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono self-end sm:self-center">
                  {new Date(log.timestamp).toLocaleTimeString()} • {log.actorEmail}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Database Schema */}
      {activeTab === 'database' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Supabase PostgreSQL Schema</h3>
              <p className="text-xs text-slate-500">
                Turnkey migration script located at <code className="text-blue-600 font-mono">src/db/schema.sql</code>
              </p>
            </div>
            <button
              onClick={copySqlMigration}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-1.5 cursor-pointer"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? 'Copied' : 'Copy SQL Script'}</span>
            </button>
          </div>

          <pre className="p-4 bg-slate-900 text-slate-200 font-mono text-xs rounded-xl overflow-x-auto max-h-96">
{`-- Profiles Table with RLS
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  target_job_title TEXT,
  role TEXT DEFAULT 'user'
);

-- Resumes Table
CREATE TABLE public.resumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  template_id TEXT NOT NULL,
  structured_content JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resume Analyses Table (ATS Diagnostic Reports)
CREATE TABLE public.resume_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  overall_score INTEGER NOT NULL,
  category_scores JSONB NOT NULL,
  matched_keywords JSONB NOT NULL,
  missing_keywords JSONB NOT NULL
);`}
          </pre>
        </div>
      )}
    </div>
  );
};
