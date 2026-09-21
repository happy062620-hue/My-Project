import React, { useState } from 'react';
import { 
  Network, 
  Wifi, 
  WifiOff, 
  Server, 
  HardDrive, 
  Database,
  ShieldCheck, 
  Layers, 
  Activity, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle,
  ArrowDown,
  Info,
  ExternalLink,
  Laptop
} from 'lucide-react';
import { NetworkDevice } from '../types';
import { INTERNET_DEPENDENCY_MATRIX } from '../data/initialData';

interface LocalNetworkTopologyProps {
  devices: NetworkDevice[];
  internetConnected: boolean;
  setInternetConnected: (connected: boolean) => void;
}

export const LocalNetworkTopology: React.FC<LocalNetworkTopologyProps> = ({
  devices,
  internetConnected,
  setInternetConnected
}) => {
  const [activeTab, setActiveTab] = useState<'topology' | 'matrix' | 'devices'>('topology');

  return (
    <div className="space-y-6">
      {/* Top Banner & Sub-Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-sky-100 text-sky-800">
                Specification 2.11, 2.12 & 2.13
              </span>
              <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
                internetConnected ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {internetConnected ? 'WAN Uplink Connected' : '100% Air-Gapped Local Mode'}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Local Network Infrastructure & Internet-Independent Architecture
            </h2>
            <p className="text-sm text-slate-600">
              Dedicated isolated router / network switch (192.168.10.0/24). Core access verification, attendance recording, database operation, RFID issuance, and automated backups operate with zero internet dependency.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="topology-wan-toggle-btn"
              onClick={() => setInternetConnected(!internetConnected)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm ${
                internetConnected
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {internetConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              <span>{internetConnected ? 'Simulate Severing Internet (Air-Gap)' : 'Simulate External WAN Restored'}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-5 border-b border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab('topology')}
            className={`pb-2.5 font-medium border-b-2 transition-colors ${
              activeTab === 'topology'
                ? 'border-sky-600 text-sky-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Mandated Network Topology Diagram (Section 2.11)
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`pb-2.5 font-medium border-b-2 transition-colors ${
              activeTab === 'matrix'
                ? 'border-sky-600 text-sky-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Internet Connectivity Dependency Matrix (Section 2.13)
          </button>
          <button
            onClick={() => setActiveTab('devices')}
            className={`pb-2.5 font-medium border-b-2 transition-colors ${
              activeTab === 'devices'
                ? 'border-sky-600 text-sky-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Local Hardware Devices & Heartbeat ({devices.length})
          </button>
        </div>
      </div>

      {/* VIEW: TOPOLOGY DIAGRAM */}
      {activeTab === 'topology' && (
        <div className="space-y-6">
          {/* Visual Interactive Diagram */}
          <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 shadow-sm relative overflow-hidden">
            {/* Top Status Indicators */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-mono text-emerald-400 font-bold">
                  LOCAL SUBNET: 192.168.10.0/24 (VLAN 10 ACCESS CONTROL)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400">WAN Gateway 0.0.0.0:</span>
                <span className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                  internetConnected ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-slate-800 text-slate-400'
                }`}>
                  {internetConnected ? 'EXTERNAL UPLINK ACTIVE' : 'AIR-GAPPED (DISCONNECTED)'}
                </span>
              </div>
            </div>

            {/* FLOW DIAGRAM NODES */}
            <div className="py-6 space-y-4 max-w-3xl mx-auto">
              {/* LEVEL 1: READERS */}
              <div className="bg-slate-800/90 rounded-xl p-4 border border-slate-700 shadow-sm">
                <div className="flex items-center justify-between text-xs font-semibold text-sky-400 mb-2">
                  <span>LEVEL 1: RFID & BIOMETRIC READERS</span>
                  <span className="font-mono text-[10px] text-slate-400">13.56 MHz / 125 kHz / OSDP v2.2</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-900 rounded border border-slate-800 text-center">
                    <span className="text-white font-bold block">Mifare DESFire / Classic</span>
                    <span className="text-[10px] text-slate-400">13.56 MHz ISO14443A</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded border border-slate-800 text-center">
                    <span className="text-white font-bold block">Biometric Fingerprint</span>
                    <span className="text-[10px] text-slate-400">Local Template Matching</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded border border-slate-800 text-center">
                    <span className="text-white font-bold block">EM4100 / Prox LF</span>
                    <span className="text-[10px] text-slate-400">125 kHz Proximity</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center text-sky-400 font-bold text-lg">↓</div>

              {/* LEVEL 2: CONTROLLERS */}
              <div className="bg-slate-800/90 rounded-xl p-4 border border-slate-700 shadow-sm">
                <div className="flex items-center justify-between text-xs font-semibold text-sky-400 mb-2">
                  <span>LEVEL 2: DOOR ACCESS CONTROLLERS</span>
                  <span className="font-mono text-[10px] text-slate-400">Wiegand / RS-485 / Encrypted IP</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                    <span className="text-white font-bold block">Mercury LP1502 Dual-Door Controllers</span>
                    <span className="text-[10px] text-slate-400 font-mono">192.168.10.41 & 192.168.10.42 • Sub-millisecond grant</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                    <span className="text-white font-bold block">InBio-460 / VertX Access Panels</span>
                    <span className="text-[10px] text-slate-400 font-mono">192.168.10.43 & 192.168.10.45 • Local relay control</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center text-sky-400 font-bold text-lg">↓</div>

              {/* LEVEL 3: DEDICATED ROUTER / SWITCH */}
              <div className="bg-sky-950/70 rounded-xl p-4 border border-sky-600/60 shadow-sm">
                <div className="flex items-center justify-between text-xs font-semibold text-sky-300 mb-2">
                  <span>LEVEL 3: DEDICATED LOCAL ROUTER / POE+ GIGABIT SWITCH</span>
                  <span className="font-mono text-[10px] text-sky-400">192.168.10.1 • ZERO CLOUD BRIDGE</span>
                </div>
                <div className="text-xs text-slate-300 leading-relaxed">
                  Physically dedicated hardware switch isolated from public internet. Delivers PoE+ power to readers and controllers, guaranteeing continuous sub-millisecond packet delivery without external routing dependencies.
                </div>
              </div>

              <div className="flex justify-center text-sky-400 font-bold text-lg">↓</div>

              {/* LEVEL 4: CENTRAL SERVER & DUAL HDD */}
              <div className="bg-slate-950 rounded-xl p-5 border-2 border-emerald-500/80 shadow-lg">
                <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 mb-3">
                  <span>LEVEL 4: LOCAL CENTRAL SERVER & DUAL HDD STORAGE</span>
                  <span className="font-mono text-[10px] text-emerald-300">192.168.10.200 • AIR-GAPPED</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-900 rounded-lg border border-sky-700/60">
                    <div className="flex items-center gap-1.5 text-sky-400 font-bold mb-1">
                      <HardDrive className="w-4 h-4" />
                      <span>Primary Online HDD (/dev/sda1)</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Active database: Employee master records, RFID permissions, attendance logs, live transaction stream.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-lg border border-emerald-700/60">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                      <Database className="w-4 h-4" />
                      <span>Separate Offline Backup HDD (/dev/sdb1)</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Automatic scheduled cron backups: 02:00 AM full + hourly differential snapshots. Zero manual intervention.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-center text-xs text-slate-400">
              Requirement 2.11 Compliance: "Internet connectivity shall not be required for normal local operation, access verification, attendance recording, database operation, reporting, or automatic local backup."
            </div>
          </div>
        </div>
      )}

      {/* VIEW: SECTION 2.13 DEPENDENCY MATRIX */}
      {activeTab === 'matrix' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm">
              Section 2.13 Internet Dependency & Air-Gap Compliance Matrix
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              The supplier must clearly identify every function that requires internet connectivity. Core security operations must maintain 100% local autonomy.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/75 text-slate-700 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">System Capability / Function</th>
                  <th className="py-3 px-4">Connectivity Dependency</th>
                  <th className="py-3 px-4">Status When Offline (Air-Gapped)</th>
                  <th className="py-3 px-4">Technical Architecture Rationale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {INTERNET_DEPENDENCY_MATRIX.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {row.feature}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        row.dependency.includes('100% Local')
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {row.dependency}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-800">
                        {row.offlineStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-[11px]">
                      {row.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: LOCAL HARDWARE DEVICES */}
      {activeTab === 'devices' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm">
              Local Hardware Nodes on Dedicated LAN Subnet (192.168.10.x)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Heartbeat latency monitored continuously over internal VLAN.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/75 text-slate-700 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Device Name</th>
                  <th className="py-3 px-4">Role / Type</th>
                  <th className="py-3 px-4">LAN IP Address</th>
                  <th className="py-3 px-4">Hardware MAC</th>
                  <th className="py-3 px-4">Protocol</th>
                  <th className="py-3 px-4">Latency</th>
                  <th className="py-3 px-4">Local Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {devices.map((dev) => (
                  <tr key={dev.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {dev.name}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                        {dev.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                      {dev.ipAddress}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                      {dev.macAddress}
                    </td>
                    <td className="py-3 px-4 text-[11px] text-slate-600">
                      {dev.protocol}
                    </td>
                    <td className="py-3 px-4 font-mono text-emerald-600 font-bold">
                      {dev.latencyMs} ms
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        {dev.status}
                      </span>
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
