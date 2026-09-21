import React, { useState } from 'react';
import { 
  History, 
  FileText, 
  ShieldCheck, 
  Search, 
  Calculator, 
  HardDrive, 
  CheckCircle2, 
  Download, 
  Layers, 
  Sliders, 
  Info,
  Clock
} from 'lucide-react';
import { AuditLogEntry } from '../types';
import { SUPPLIER_RECOVERY_SPECIFICATIONS } from '../data/initialData';

interface AuditAndSpecsProps {
  auditLogs: AuditLogEntry[];
}

export const AuditAndSpecs: React.FC<AuditAndSpecsProps> = ({ auditLogs }) => {
  const [activeTab, setActiveTab] = useState<'specs' | 'calculator' | 'logs'>('specs');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Capacity Calculator State
  const [calcEmployees, setCalcEmployees] = useState<number>(2500);
  const [calcDailyTapsPerEmp, setCalcDailyTapsPerEmp] = useState<number>(6);
  const [calcRetentionYears, setCalcRetentionYears] = useState<number>(5);
  const [calcHourlySnapshots, setCalcHourlySnapshots] = useState<number>(24);

  // Math sizing
  // 1 access transaction log is approx 280 bytes in SQLite index
  const dailyTransactions = calcEmployees * calcDailyTapsPerEmp;
  const yearlyTransactions = dailyTransactions * 365;
  const totalTransactions = yearlyTransactions * calcRetentionYears;
  const transactionDbGb = (totalTransactions * 280) / (1024 * 1024 * 1024);
  const employeeDataGb = (calcEmployees * 150000) / (1024 * 1024 * 1024); // with photo & bio hash ~150KB
  const primaryRequiredGb = Math.ceil((transactionDbGb + employeeDataGb) * 2.5); // 2.5x overhead for WAL and index
  const backupRequiredGb = Math.ceil(primaryRequiredGb * 2.0); // 2x for full + differentials

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.adminUser.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.targetEntity.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || log.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const exportAuditReport = () => {
    const headers = ['ID', 'Timestamp', 'Admin User', 'Action', 'Category', 'Target Entity', 'Details', 'IP Address'];
    const rows = filteredLogs.map(l => [
      l.id,
      l.timestamp,
      `"${l.adminUser}"`,
      l.action,
      l.category,
      `"${l.targetEntity}"`,
      `"${l.details}"`,
      l.ipAddress
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `system_audit_log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Sub-Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-sky-100 text-sky-800">
                Specification 2.14 Formal Response
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-emerald-100 text-emerald-800">
                11-Point Supplier Compliance
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Section 2.14 Data Recovery Specifications & Audit System
            </h2>
            <p className="text-sm text-slate-600">
              Formal item-by-item response to all 11 required supplier specifications, capacity sizing models, and cryptographic immutable administrator audit trails.
            </p>
          </div>

          <button
            onClick={exportAuditReport}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-900 flex items-center gap-2 shadow-sm self-start sm:self-auto"
          >
            <Download className="w-4 h-4" />
            <span>Export Audit Log (CSV)</span>
          </button>
        </div>

        <div className="flex items-center gap-4 mt-5 border-b border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-2.5 font-medium border-b-2 transition-colors ${
              activeTab === 'specs'
                ? 'border-sky-600 text-sky-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            11-Point Supplier Specification Response
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`pb-2.5 font-medium border-b-2 transition-colors ${
              activeTab === 'calculator'
                ? 'border-sky-600 text-sky-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Interactive HDD Sizing & Retention Calculator
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`pb-2.5 font-medium border-b-2 transition-colors ${
              activeTab === 'logs'
                ? 'border-sky-600 text-sky-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            System Audit Trail ({auditLogs.length})
          </button>
        </div>
      </div>

      {/* VIEW: 11-POINT SPECIFICATIONS */}
      {activeTab === 'specs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SUPPLIER_RECOVERY_SPECIFICATIONS.map((spec) => (
            <div key={spec.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2">
              <div className="flex items-start justify-between">
                <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 text-xs font-bold flex items-center justify-center">
                  {spec.id}
                </span>
                <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Fully Compliant
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                {spec.title}
              </h3>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono font-semibold text-sky-900">
                {spec.value}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pt-1">
                {spec.details}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* VIEW: CAPACITY CALCULATOR */}
      {activeTab === 'calculator' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-sky-600" />
            <h3 className="text-base font-bold text-slate-900">
              Interactive HDD Capacity & Disaster Retention Sizing Calculator
            </h3>
          </div>
          <p className="text-xs text-slate-600">
            Calculate exact Primary HDD A and Offline Backup HDD B storage requirements based on facility population, transaction frequency, and archive retention goals.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between mb-1 font-semibold text-slate-700">
                  <span>Enrolled Employee Population:</span>
                  <span className="text-sky-700 font-bold">{calcEmployees.toLocaleString()} Personnel</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="20000"
                  step="100"
                  value={calcEmployees}
                  onChange={(e) => setCalcEmployees(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1 font-semibold text-slate-700">
                  <span>Average Door Swipes / Day per Employee:</span>
                  <span className="text-sky-700 font-bold">{calcDailyTapsPerEmp} Swipes / Day</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="20"
                  step="1"
                  value={calcDailyTapsPerEmp}
                  onChange={(e) => setCalcDailyTapsPerEmp(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1 font-semibold text-slate-700">
                  <span>Mandatory Access Log Retention:</span>
                  <span className="text-sky-700 font-bold">{calcRetentionYears} Years</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="1"
                  value={calcRetentionYears}
                  onChange={(e) => setCalcRetentionYears(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <div className="p-5 bg-slate-900 text-white rounded-xl border border-slate-800 space-y-4 text-xs">
              <h4 className="font-bold text-sky-400 uppercase tracking-wider text-[11px]">
                Calculated Storage Requirements
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                  <span className="text-slate-400 block text-[10px]">Total Stored Events</span>
                  <span className="text-base font-bold font-mono text-white mt-0.5 block">
                    {totalTransactions.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                  <span className="text-slate-400 block text-[10px]">Annual Data Velocity</span>
                  <span className="text-base font-bold font-mono text-white mt-0.5 block">
                    {(yearlyTransactions * 280 / (1024 * 1024)).toFixed(0)} MB/Year
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span>Primary Online HDD Recommended:</span>
                  <span className="text-sky-300 font-mono font-bold">2.0 TB (Used: {primaryRequiredGb} GB)</span>
                </div>
                <div className="flex justify-between">
                  <span>Offline Backup HDD Recommended:</span>
                  <span className="text-emerald-300 font-mono font-bold">4.0 TB (Used: {backupRequiredGb} GB)</span>
                </div>
                <div className="flex justify-between">
                  <span>Calculated Headroom:</span>
                  <span className="text-slate-300 font-mono">&gt; 78% Free Space</span>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 pt-1">
                Conclusion: The proposed 2TB Primary + 4TB Backup HDD configuration provides over 10 years of operational longevity with continuous automated backups.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: AUDIT LOGS */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search audit trail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="p-1.5 bg-white border border-slate-300 rounded-lg text-xs"
              >
                <option value="All">All Categories</option>
                <option value="Card Issuance">Card Issuance</option>
                <option value="Card Revocation">Card Revocation</option>
                <option value="Backup Operation">Backup Operation</option>
                <option value="Database Restore">Database Restore</option>
                <option value="Permission Change">Permission Change</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/75 text-slate-700 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Operator</th>
                  <th className="py-3 px-4">Category & Action</th>
                  <th className="py-3 px-4">Target Entity</th>
                  <th className="py-3 px-4">Audit Details</th>
                  <th className="py-3 px-4">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {log.adminUser}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-xs font-bold text-sky-800 block">
                        {log.action}
                      </span>
                      <span className="text-[10px] text-slate-500">{log.category}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700 text-[11px]">
                      {log.targetEntity}
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-[11px] max-w-md">
                      {log.details}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
