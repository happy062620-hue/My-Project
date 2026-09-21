import React, { useState } from 'react';
import { 
  Server, 
  HardDrive, 
  Wifi, 
  WifiOff, 
  ShieldCheck, 
  CreditCard, 
  Palette, 
  Network, 
  History, 
  DoorOpen, 
  Menu, 
  X,
  Database,
  Cpu
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  internetConnected: boolean;
  setInternetConnected: (connected: boolean) => void;
  backupCount: number;
  primaryHddHealth: string;
  backupHddHealth: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  internetConnected,
  setInternetConnected,
  backupCount,
  primaryHddHealth,
  backupHddHealth
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dual-hdd', label: 'Dual HDD & Backup', icon: HardDrive, badge: `${backupCount} Backups` },
    { id: 'card-issuance', label: 'RFID Issuance', icon: CreditCard },
    { id: 'card-designer', label: 'ID Card Studio', icon: Palette },
    { id: 'network-topology', label: 'Local Network', icon: Network, badge: internetConnected ? 'WAN Active' : 'Air-Gapped' },
    { id: 'access-monitor', label: 'Door & Attendance', icon: DoorOpen },
    { id: 'audit-specs', label: '11-Pt Specs & Audit', icon: History }
  ];

  return (
    <header className="bg-slate-900 text-slate-100 border-b border-slate-800 sticky top-0 z-40 shadow-md">
      {/* Top Status Strip */}
      <div className="bg-slate-950 px-4 py-1.5 text-xs border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto text-[11px] sm:text-xs">
          <div className="flex items-center gap-1.5 font-mono text-emerald-400 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>SERVER: 192.168.10.200 (LAN ONLY)</span>
          </div>

          <div className="hidden md:flex items-center gap-1 text-slate-300 font-mono">
            <HardDrive className="w-3.5 h-3.5 text-sky-400" />
            <span>PRIMARY HDD: {primaryHddHealth}</span>
          </div>

          <div className="hidden md:flex items-center gap-1 text-slate-300 font-mono">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>OFFLINE BACKUP: {backupHddHealth}</span>
          </div>
        </div>

        {/* Internet Connection Simulator Switch */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-slate-400 text-[11px] hidden sm:inline">Network Uplink:</span>
          <button
            id="internet-toggle-btn"
            onClick={() => setInternetConnected(!internetConnected)}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium transition-all ${
              internetConnected 
                ? 'bg-amber-950/80 text-amber-300 border border-amber-600/60 hover:bg-amber-900/80' 
                : 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/60 hover:bg-emerald-900/80'
            }`}
            title="Toggle Internet connection to demonstrate complete air-gapped offline autonomy"
          >
            {internetConnected ? (
              <>
                <Wifi className="w-3 h-3 text-amber-400" />
                <span>External WAN Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 text-emerald-400" />
                <span className="font-semibold">100% Air-Gapped (Offline)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-700 flex items-center justify-center text-white shadow-inner">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base sm:text-lg tracking-tight text-white flex items-center gap-1.5">
                TITAN CORE ACCESS
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-700/60 font-normal">
                  Sec 2.10 - 2.15
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Dedicated Local Server • Dual HDD Offline Backup • RFID Issuance & Studio
            </p>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-sky-700 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center">
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
