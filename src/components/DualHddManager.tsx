import React, { useState } from 'react';
import { 
  HardDrive, 
  Database, 
  ShieldCheck, 
  RefreshCw, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Lock, 
  Server, 
  Sparkles,
  ArrowRight,
  Download,
  Flame,
  Layers,
  Check
} from 'lucide-react';
import { HddDriveInfo, BackupSnapshot, AuditLogEntry } from '../types';

interface DualHddManagerProps {
  hddList: HddDriveInfo[];
  backups: BackupSnapshot[];
  onTriggerBackup: () => void;
  onRestoreBackup: (snapshotId: string) => void;
  onVerifySnapshot: (snapshotId: string) => void;
  isBackingUp: boolean;
  backupProgress: number;
  backupStatusStep: string;
  simulatedHddFailure: boolean;
  setSimulatedHddFailure: (failed: boolean) => void;
}

export const DualHddManager: React.FC<DualHddManagerProps> = ({
  hddList,
  backups,
  onTriggerBackup,
  onRestoreBackup,
  onVerifySnapshot,
  isBackingUp,
  backupProgress,
  backupStatusStep,
  simulatedHddFailure,
  setSimulatedHddFailure
}) => {
  const [selectedSnapshot, setSelectedSnapshot] = useState<string | null>(backups[0]?.id || null);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [restoreStep, setRestoreStep] = useState(0);
  const [isRestoring, setIsRestoring] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'snapshots' | 'disaster-recovery'>('overview');

  const primaryHdd = hddList.find(d => d.role === 'Primary Active Online');
  const backupHdd = hddList.find(d => d.role === 'Offline Scheduled Backup');
  const secondaryHdd = hddList.find(d => d.role === 'Secondary Redundant Backup');

  const handleStartRestore = (snapshotId: string) => {
    setSelectedSnapshot(snapshotId);
    setRestoreStep(1);
    setShowRestoreModal(true);
  };

  const executeRestore = () => {
    if (!selectedSnapshot) return;
    setIsRestoring(true);
    setRestoreStep(2);
    setTimeout(() => {
      setRestoreStep(3);
      setTimeout(() => {
        setIsRestoring(false);
        setRestoreStep(4);
        onRestoreBackup(selectedSnapshot);
      }, 1500);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Sub-Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-sky-100 text-sky-800">
                Specification 2.10 & 2.12
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-emerald-100 text-emerald-800">
                100% Air-Gapped Local Architecture
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Dual HDD Local Storage & Automatic Offline Backup Engine
            </h2>
            <p className="text-sm text-slate-600">
              Live operational database runs entirely on Primary Online HDD; automated cron daemon writes scheduled incremental & full snapshots to physically separate Offline Backup HDD without cloud connectivity.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              id="trigger-backup-now-btn"
              onClick={onTriggerBackup}
              disabled={isBackingUp || simulatedHddFailure}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm text-white transition-all shadow-sm ${
                isBackingUp
                  ? 'bg-sky-400 cursor-not-allowed'
                  : simulatedHddFailure
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-sky-600 hover:bg-sky-700 active:scale-95'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isBackingUp ? 'animate-spin' : ''}`} />
              <span>{isBackingUp ? 'Backing Up Data...' : 'Perform Immediate Local Backup'}</span>
            </button>

            <button
              id="simulate-hdd-failure-btn"
              onClick={() => setSimulatedHddFailure(!simulatedHddFailure)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                simulatedHddFailure
                  ? 'bg-red-50 text-red-700 border-red-300'
                  : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
              title="Test Section 2.14 failover and recovery from Backup HDD"
            >
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>{simulatedHddFailure ? 'Failure Active (Recover)' : 'Simulate Primary HDD Crash'}</span>
            </button>
          </div>
        </div>

        {/* Live Backup Progress Indicator */}
        {isBackingUp && (
          <div className="mt-4 p-4 rounded-lg bg-sky-50 border border-sky-200 animate-pulse">
            <div className="flex justify-between text-xs font-semibold text-sky-900 mb-1.5">
              <span className="flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-600" />
                {backupStatusStep}
              </span>
              <span>{backupProgress}%</span>
            </div>
            <div className="w-full bg-sky-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-sky-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${backupProgress}%` }}
              ></div>
            </div>
            <div className="mt-2 text-[11px] text-sky-700 flex items-center justify-between">
              <span>Syncing: Employees • RFID Records • Biometric Hashes • Time & Attendance Logs</span>
              <span className="font-mono">Direct SATA Bus: 245 MB/s</span>
            </div>
          </div>
        )}

        {/* Simulated Failure Warning */}
        {simulatedHddFailure && (
          <div className="mt-4 p-4 rounded-lg bg-red-50 border-2 border-red-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                <AlertTriangle className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-red-900">
                  CRITICAL ALARM: Primary Online HDD Failure Detected (/dev/sda1)
                </h4>
                <p className="text-xs text-red-700 mt-0.5">
                  Chassis buzzer active (85dB simulated). Live transactions diverted to local cache. Offline Backup HDD (/dev/sdb1) is 100% intact and ready for hot-swap restoration per Section 2.14.
                </p>
              </div>
            </div>
            <button
              onClick={() => handleStartRestore(backups[0]?.id)}
              className="px-4 py-2 text-xs font-bold bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-sm shrink-0"
            >
              Launch Recovery Wizard
            </button>
          </div>
        )}

        {/* Navigation Sub-Tabs */}
        <div className="flex items-center gap-2 mt-5 border-b border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2.5 font-medium transition-colors border-b-2 ${
              activeTab === 'overview'
                ? 'border-sky-600 text-sky-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Physical Storage Architecture
          </button>
          <button
            onClick={() => setActiveTab('snapshots')}
            className={`pb-2.5 font-medium transition-colors border-b-2 ${
              activeTab === 'snapshots'
                ? 'border-sky-600 text-sky-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Offline Backup Catalog ({backups.length})
          </button>
          <button
            onClick={() => setActiveTab('disaster-recovery')}
            className={`pb-2.5 font-medium transition-colors border-b-2 ${
              activeTab === 'disaster-recovery'
                ? 'border-sky-600 text-sky-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Section 2.14 Data Recovery Procedure
          </button>
        </div>
      </div>

      {/* VIEW: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Side by Side Dual HDD Visual Hardware Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {/* Drive A: Primary Online HDD */}
            <div className={`rounded-xl border p-5 transition-all shadow-sm ${
              simulatedHddFailure 
                ? 'bg-red-50/50 border-red-300 ring-2 ring-red-400' 
                : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2.5 rounded-lg ${simulatedHddFailure ? 'bg-red-100 text-red-600' : 'bg-sky-100 text-sky-600'}`}>
                    <HardDrive className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                      Function A (Section 2.10)
                    </span>
                    <h3 className="font-bold text-slate-900 text-base">
                      Primary Online / Active HDD
                    </h3>
                  </div>
                </div>

                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  simulatedHddFailure 
                    ? 'bg-red-200 text-red-800 font-bold' 
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {simulatedHddFailure ? 'FAILED' : 'ONLINE ACTIVE'}
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-700">Model: </span>
                  {primaryHdd?.model}
                </div>
                <div className="text-xs text-slate-600 font-mono">
                  <span className="font-semibold text-slate-700">Mount: </span>
                  {primaryHdd?.mountPoint}
                </div>

                {/* Capacity Bar */}
                <div className="pt-1">
                  <div className="flex justify-between text-xs text-slate-600 mb-1">
                    <span>Used: {primaryHdd?.usedGb} GB</span>
                    <span className="font-semibold text-slate-800">{primaryHdd?.capacityGb} GB Total</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${simulatedHddFailure ? 'bg-red-500' : 'bg-sky-600'}`}
                      style={{ width: `${((primaryHdd?.usedGb || 0) / (primaryHdd?.capacityGb || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Live Storage Items Checked */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5 text-[11px] text-slate-700">
                  <div className="font-semibold text-slate-800 flex items-center justify-between border-b border-slate-200 pb-1">
                    <span>Active Operational Database:</span>
                    <span className="font-mono text-emerald-600">Live WAL</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[11px]">
                    <div className="flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" /> Employee Records
                    </div>
                    <div className="flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" /> RFID / Department IDs
                    </div>
                    <div className="flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" /> Biometric Profiles
                    </div>
                    <div className="flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" /> Access Permissions
                    </div>
                    <div className="flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" /> Door Controllers
                    </div>
                    <div className="flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" /> Time & Attendance
                    </div>
                    <div className="flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" /> Granted / Denied Logs
                    </div>
                    <div className="flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" /> System Alarms & Logs
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                  <div className="p-2 bg-slate-50 rounded border border-slate-100">
                    <span className="block text-[10px] text-slate-400">SMART Status</span>
                    <span className={`text-xs font-bold ${simulatedHddFailure ? 'text-red-600' : 'text-emerald-600'}`}>
                      {simulatedHddFailure ? 'FAULT' : 'PASSED'}
                    </span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-100">
                    <span className="block text-[10px] text-slate-400">Temp</span>
                    <span className="text-xs font-bold text-slate-700">{primaryHdd?.temperatureC}°C</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-100">
                    <span className="block text-[10px] text-slate-400">Throughput</span>
                    <span className="text-xs font-bold text-slate-700 font-mono">{primaryHdd?.readSpeedMbps} MB/s</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Drive B: Separate Offline Backup HDD */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-bl-lg">
                PHYSICALLY SEPARATE
              </div>

              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-700">
                    <Database className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                      Function B (Section 2.10)
                    </span>
                    <h3 className="font-bold text-slate-900 text-base">
                      Offline Backup HDD Storage
                    </h3>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-700">Model: </span>
                  {backupHdd?.model}
                </div>
                <div className="text-xs text-slate-600 font-mono">
                  <span className="font-semibold text-slate-700">Mount: </span>
                  {backupHdd?.mountPoint}
                </div>

                {/* Capacity Bar */}
                <div className="pt-1">
                  <div className="flex justify-between text-xs text-slate-600 mb-1">
                    <span>Used: {backupHdd?.usedGb} GB</span>
                    <span className="font-semibold text-slate-800">{backupHdd?.capacityGb} GB Total (200% Size)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-emerald-600"
                      style={{ width: `${((backupHdd?.usedGb || 0) / (backupHdd?.capacityGb || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Automatic Backup Details */}
                <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-100 space-y-1.5 text-[11px] text-slate-700">
                  <div className="font-semibold text-emerald-900 flex items-center justify-between border-b border-emerald-200/60 pb-1">
                    <span>Automatic Schedule (Section 2.12):</span>
                    <span className="font-mono text-emerald-700 font-bold">02:00 AM Daily</span>
                  </div>
                  <div className="text-xs space-y-1 text-slate-600">
                    <div className="flex justify-between">
                      <span>Latest Full Snapshot:</span>
                      <span className="font-mono font-medium text-slate-800">{backups[0]?.timestamp}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SHA-256 Integrity:</span>
                      <span className="font-mono text-emerald-700 font-semibold">MATCH VERIFIED</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Intervention Required:</span>
                      <span className="font-semibold text-slate-800">ZERO (100% Autonomous)</span>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                  <div className="p-2 bg-slate-50 rounded border border-slate-100">
                    <span className="block text-[10px] text-slate-400">Total Backups</span>
                    <span className="text-xs font-bold text-slate-800">{backups.length} Sets</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-100">
                    <span className="block text-[10px] text-slate-400">Filesystem</span>
                    <span className="text-xs font-bold text-slate-800">ZFS Checksum</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-100">
                    <span className="block text-[10px] text-slate-400">Physical Bay</span>
                    <span className="text-xs font-bold text-emerald-700">Bay 2 Isolated</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Drive C: Optional Secondary Hot-Swap Backup */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-lg bg-indigo-100 text-indigo-700">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                      Specification 2.14 Point 10 & 11
                    </span>
                    <h3 className="font-bold text-slate-900 text-base">
                      Secondary Backup HDD (Hot-Swap)
                    </h3>
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-indigo-100 text-indigo-800">
                  REDUNDANT TIER
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-700">Model: </span>
                  {secondaryHdd?.model}
                </div>
                <div className="text-xs text-slate-600 font-mono">
                  <span className="font-semibold text-slate-700">Mount: </span>
                  {secondaryHdd?.mountPoint}
                </div>

                {/* Capacity Bar */}
                <div className="pt-1">
                  <div className="flex justify-between text-xs text-slate-600 mb-1">
                    <span>Used: {secondaryHdd?.usedGb} GB</span>
                    <span className="font-semibold text-slate-800">{secondaryHdd?.capacityGb} GB</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-indigo-600"
                      style={{ width: `${((secondaryHdd?.usedGb || 0) / (secondaryHdd?.capacityGb || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="p-3 bg-indigo-50/60 rounded-lg border border-indigo-100 text-xs text-slate-700 space-y-1.5">
                  <div className="font-semibold text-indigo-900">
                    Off-site Rotation & Physical Disaster Redundancy:
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Complies with Section 2.14 recommendations for dual backup redundancy. Enables safe hot-swap unmounting for physical vault transport without stopping local server operation.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-500 font-mono">Status: Mounted LUKS</span>
                  <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    Rotation Ready
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Architecture Flow Diagram (Section 2.10 & 2.11) */}
          <div className="bg-slate-900 text-white rounded-xl p-5 shadow-sm border border-slate-800">
            <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Server className="w-4 h-4" />
              <span>Mandated Hardware Architecture Data Path</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-center">
              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700 flex flex-col justify-center">
                <span className="text-[10px] text-sky-400 font-mono">INPUT</span>
                <span className="text-xs font-bold text-slate-100 mt-1">Employee ID Card / Biometric</span>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700 flex flex-col justify-center">
                <span className="text-[10px] text-sky-400 font-mono">READER</span>
                <span className="text-xs font-bold text-slate-100 mt-1">RFID / Biometric Reader (13.56M/125K)</span>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700 flex flex-col justify-center">
                <span className="text-[10px] text-sky-400 font-mono">CONTROLLER</span>
                <span className="text-xs font-bold text-slate-100 mt-1">Door Access Controller / Terminal</span>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700 flex flex-col justify-center">
                <span className="text-[10px] text-sky-400 font-mono">LOCAL LAN</span>
                <span className="text-xs font-bold text-slate-100 mt-1">Dedicated Router / Switch (192.168.10.x)</span>
              </div>

              <div className="p-3 bg-sky-950/80 rounded-lg border border-sky-600/80 flex flex-col justify-center">
                <span className="text-[10px] text-sky-300 font-mono">PRIMARY</span>
                <span className="text-xs font-bold text-white mt-1">Primary Online HDD (Live DB & Attendance)</span>
              </div>

              <div className="p-3 bg-emerald-950/80 rounded-lg border border-emerald-600/80 flex flex-col justify-center">
                <span className="text-[10px] text-emerald-300 font-mono">BACKUP</span>
                <span className="text-xs font-bold text-white mt-1">Separate Offline Backup HDD (/dev/sdb1)</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
              <span>Zero Cloud Dependency • Automatic Scheduled Execution • Hardware-Level Separation</span>
              <span className="text-emerald-400 font-mono font-medium">Local Air-Gapped Integrity: PASSED</span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: SNAPSHOT CATALOG */}
      {activeTab === 'snapshots' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Stored Offline Backup Archives on Drive B (/dev/sdb1)
              </h3>
              <p className="text-xs text-slate-500">
                All backup images are signed with SHA-256 and verified against live SQLite database catalogs.
              </p>
            </div>
            <button
              onClick={onTriggerBackup}
              disabled={isBackingUp}
              className="px-3 py-1.5 bg-sky-600 text-white rounded-lg text-xs font-medium hover:bg-sky-700 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isBackingUp ? 'animate-spin' : ''}`} />
              <span>Create New Snapshot</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/75 text-slate-700 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Snapshot ID & Timestamp</th>
                  <th className="py-3 px-4">Backup Type</th>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Catalog Records</th>
                  <th className="py-3 px-4">SHA-256 Integrity Checksum</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {backups.map((snap) => (
                  <tr key={snap.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block font-mono">{snap.id}</span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" /> {snap.timestamp}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded font-medium text-[11px] bg-slate-100 text-slate-700">
                        {snap.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">
                      {snap.sizeMb.toFixed(1)} MB
                    </td>
                    <td className="py-3 px-4 text-[11px] text-slate-600">
                      <div>{snap.recordCount.employees} Employees • {snap.recordCount.cards} Cards</div>
                      <div className="text-slate-500">{snap.recordCount.transactions} Access Logs • {snap.recordCount.attendance} Attendance</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[10px] text-slate-500 max-w-xs truncate" title={snap.sha256Checksum}>
                      {snap.sha256Checksum}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        {snap.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => onVerifySnapshot(snap.id)}
                        className="px-2.5 py-1 text-[11px] rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                      >
                        Verify Hash
                      </button>
                      <button
                        onClick={() => handleStartRestore(snap.id)}
                        className="px-2.5 py-1 text-[11px] rounded bg-sky-600 hover:bg-sky-700 text-white font-medium shadow-sm"
                      >
                        Restore From This
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: DISASTER RECOVERY PROCEDURE (SECTION 2.14) */}
      {activeTab === 'disaster-recovery' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-sky-600" />
              <span>Section 2.14 Official Database Restoration & Failure Recovery Procedure</span>
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              In accordance with contract requirements, authorized administrators can restore the central operational database from the separate offline backup HDD in under 90 seconds. Follow the 4-step audited workflow below:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-5">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <span className="w-6 h-6 rounded-full bg-sky-600 text-white text-xs font-bold flex items-center justify-center mb-2">1</span>
                <h4 className="text-xs font-bold text-slate-800">Select Backup Snapshot</h4>
                <p className="text-[11px] text-slate-600 mt-1">
                  Choose verified point-in-time image from Backup HDD B (/mnt/offline_backup).
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <span className="w-6 h-6 rounded-full bg-sky-600 text-white text-xs font-bold flex items-center justify-center mb-2">2</span>
                <h4 className="text-xs font-bold text-slate-800">Pre-Restore Hash Check</h4>
                <p className="text-[11px] text-slate-600 mt-1">
                  Automated SHA-256 verification confirms zero sector corruption or tampering.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <span className="w-6 h-6 rounded-full bg-sky-600 text-white text-xs font-bold flex items-center justify-center mb-2">3</span>
                <h4 className="text-xs font-bold text-slate-800">Database Engine Halt & Write</h4>
                <p className="text-[11px] text-slate-600 mt-1">
                  Local database engine halts writes; snapshot unpacks onto Primary Online volume.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <span className="w-6 h-6 rounded-full bg-sky-600 text-white text-xs font-bold flex items-center justify-center mb-2">4</span>
                <h4 className="text-xs font-bold text-slate-800">Reboot & Controller Sync</h4>
                <p className="text-[11px] text-slate-600 mt-1">
                  Server restarts access daemon, syncs door controllers, and logs audit event.
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-lg bg-sky-50 border border-sky-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-sky-900 block">
                  Quick Restore Target: {backups[0]?.id} ({backups[0]?.timestamp})
                </span>
                <span className="text-[11px] text-sky-700">
                  Size: {backups[0]?.sizeMb.toFixed(1)} MB • Contains latest employee & RFID card permissions
                </span>
              </div>
              <button
                id="open-recovery-wizard-btn"
                onClick={() => handleStartRestore(backups[0]?.id)}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow-sm"
              >
                Launch Point-in-Time Restore Wizard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DISASTER RECOVERY INTERACTIVE MODAL */}
      {showRestoreModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2 text-sky-700 font-bold">
                <RotateCcw className="w-5 h-5" />
                <span>Point-in-Time Database Recovery Wizard</span>
              </div>
              <button
                onClick={() => setShowRestoreModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <div className="py-4">
              {restoreStep === 1 && (
                <div className="space-y-4">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                    <span className="font-bold block">CONFIRM RESTORATION SOURCE:</span>
                    Restoring will overwrite current live tables on Primary Online HDD with snapshot:
                    <div className="font-mono font-bold mt-1 text-slate-900">{selectedSnapshot}</div>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Source Storage:</span>
                      <span className="font-semibold text-slate-800">Backup HDD B (/mnt/offline_backup)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Target Storage:</span>
                      <span className="font-semibold text-slate-800">Primary HDD A (/mnt/primary_data)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Controller Impact:</span>
                      <span className="text-emerald-700 font-medium">Automatic Resync on Finish</span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3">
                    <button
                      onClick={() => setShowRestoreModal(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={executeRestore}
                      className="px-4 py-1.5 text-xs bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-sm"
                    >
                      Confirm & Execute Restore
                    </button>
                  </div>
                </div>
              )}

              {restoreStep === 2 && (
                <div className="py-8 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-sky-600 animate-spin mx-auto" />
                  <h4 className="text-sm font-bold text-slate-900">Step 2: Verifying Cryptographic Checksums...</h4>
                  <p className="text-xs text-slate-500 font-mono">
                    Computing SHA-256 hash against catalog manifest...
                  </p>
                </div>
              )}

              {restoreStep === 3 && (
                <div className="py-8 text-center space-y-3">
                  <Database className="w-8 h-8 text-indigo-600 animate-pulse mx-auto" />
                  <h4 className="text-sm font-bold text-slate-900">Step 3: Unpacking Snapshot to Primary HDD...</h4>
                  <p className="text-xs text-slate-500">
                    Copying employee records, RFID authorizations, and access rules to /dev/sda1
                  </p>
                </div>
              )}

              {restoreStep === 4 && (
                <div className="py-4 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Database Successfully Restored!</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Primary Online HDD has been restored to snapshot state. Door controllers have been synchronized, and the recovery has been recorded in the immutable audit log.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowRestoreModal(false)}
                    className="px-5 py-2 text-xs bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 shadow-sm"
                  >
                    Close Recovery Wizard
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
