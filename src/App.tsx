import React, { useState } from 'react';
import { Header } from './components/Header';
import { DualHddManager } from './components/DualHddManager';
import { RfidCardIssuance } from './components/RfidCardIssuance';
import { IdCardDesigner } from './components/IdCardDesigner';
import { LocalNetworkTopology } from './components/LocalNetworkTopology';
import { LiveAccessSimulator } from './components/LiveAccessSimulator';
import { AuditAndSpecs } from './components/AuditAndSpecs';

import { 
  INITIAL_EMPLOYEES, 
  INITIAL_CARDS, 
  INITIAL_DOORS, 
  INITIAL_HDD_STORAGE, 
  INITIAL_BACKUPS, 
  INITIAL_NETWORK_DEVICES, 
  INITIAL_TRANSACTIONS, 
  INITIAL_ATTENDANCE, 
  INITIAL_AUDIT_LOGS 
} from './data/initialData';

import { 
  Employee, 
  RfidCard, 
  DoorController, 
  HddDriveInfo, 
  BackupSnapshot, 
  NetworkDevice, 
  AccessTransaction, 
  AttendanceRecord, 
  AuditLogEntry, 
  CardStatus 
} from './types';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('dual-hdd');

  // Core Data Storage States (Simulating Primary Online Live Database on /dev/sda1)
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [cards, setCards] = useState<RfidCard[]>(INITIAL_CARDS);
  const [doors, setDoors] = useState<DoorController[]>(INITIAL_DOORS);
  const [hddList, setHddList] = useState<HddDriveInfo[]>(INITIAL_HDD_STORAGE);
  const [backups, setBackups] = useState<BackupSnapshot[]>(INITIAL_BACKUPS);
  const [transactions, setTransactions] = useState<AccessTransaction[]>(INITIAL_TRANSACTIONS);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [networkDevices, setNetworkDevices] = useState<NetworkDevice[]>(INITIAL_NETWORK_DEVICES);

  // Network & Connectivity (Default to 100% Air-Gapped Local Server as per specs)
  const [internetConnected, setInternetConnected] = useState<boolean>(false);

  // Backup Engine States
  const [isBackingUp, setIsBackingUp] = useState<boolean>(false);
  const [backupProgress, setBackupProgress] = useState<number>(0);
  const [backupStatusStep, setBackupStatusStep] = useState<string>('');
  const [simulatedHddFailure, setSimulatedHddFailure] = useState<boolean>(false);

  // Card Studio Selection State
  const [designerEmployee, setDesignerEmployee] = useState<Employee | null>(null);
  const [designerCard, setDesignerCard] = useState<RfidCard | null>(null);

  // Notification / Alert Banner
  const [systemNotice, setSystemNotice] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setSystemNotice(msg);
    setTimeout(() => {
      setSystemNotice(null);
    }, 4000);
  };

  // Automated or Manual Local Backup Execution
  const handleTriggerBackup = () => {
    if (isBackingUp || simulatedHddFailure) return;

    setIsBackingUp(true);
    setBackupProgress(10);
    setBackupStatusStep('Locking Write-Ahead Logs & Preparing Snapshot...');

    setTimeout(() => {
      setBackupProgress(40);
      setBackupStatusStep('Direct SATA Bus High-Speed Copy to Backup HDD (/dev/sdb1)...');

      setTimeout(() => {
        setBackupProgress(75);
        setBackupStatusStep('Calculating SHA-256 Cryptographic Checksum...');

        setTimeout(() => {
          setBackupProgress(100);
          setBackupStatusStep('Verifying Block Consistency & Releasing Locks...');

          setTimeout(() => {
            const now = new Date();
            const timeStr = now.toTimeString().split(' ')[0];
            const dateStr = now.toISOString().split('T')[0];
            const timestamp = `${dateStr} ${timeStr}`;
            const randomHex = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

            const newSnapshot: BackupSnapshot = {
              id: `snap-${dateStr.replace(/-/g, '')}-${timeStr.replace(/:/g, '').slice(0, 4)}`,
              timestamp,
              type: 'Manual Snapshot',
              sizeMb: parseFloat((1400 + Math.random() * 50).toFixed(1)),
              recordCount: {
                employees: employees.length,
                cards: cards.length,
                transactions: transactions.length,
                attendance: attendance.length,
                systemLogs: auditLogs.length + 1
              },
              sha256Checksum: randomHex,
              targetHdd: 'Backup HDD (Drive B - 4TB)',
              status: 'Verified (Intact)',
              verifiedAt: timestamp
            };

            setBackups(prev => [newSnapshot, ...prev]);

            // Add Audit Log
            const auditEntry: AuditLogEntry = {
              id: `aud-${Date.now()}`,
              timestamp,
              adminUser: 'sys_admin',
              action: 'MANUAL_BACKUP_COMPLETED',
              category: 'Backup Operation',
              targetEntity: `Backup HDD B (/dev/sdb1) - Snapshot ${newSnapshot.id}`,
              details: `Full image snapshot (${newSnapshot.sizeMb} MB) committed to separate offline HDD. SHA-256 verified.`,
              ipAddress: '127.0.0.1 (Local Bus)'
            };
            setAuditLogs(prev => [auditEntry, ...prev]);

            // Update backup HDD stats
            setHddList(prev => prev.map(hdd => {
              if (hdd.role === 'Offline Scheduled Backup') {
                return { ...hdd, usedGb: parseFloat((hdd.usedGb + 1.4).toFixed(1)) };
              }
              return hdd;
            }));

            setIsBackingUp(false);
            setBackupProgress(0);
            showNotification(`Backup snapshot ${newSnapshot.id} successfully created on separate offline HDD B!`);
          }, 600);
        }, 800);
      }, 900);
    }, 800);
  };

  // Restore Database from Offline Backup HDD (Disaster Recovery)
  const handleRestoreBackup = (snapshotId: string) => {
    const snap = backups.find(b => b.id === snapshotId);
    if (!snap) return;

    setSimulatedHddFailure(false);

    const now = new Date();
    const timestamp = `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0]}`;

    const auditEntry: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp,
      adminUser: 'sys_admin',
      action: 'DATABASE_RESTORE_EXECUTED',
      category: 'Database Restore',
      targetEntity: `Primary HDD A (/dev/sda1) from Snapshot ${snap.id}`,
      details: `Database restored from Offline Backup HDD B. SHA-256 pre-check passed (${snap.sha256Checksum.slice(0, 16)}...). All door controllers synchronized.`,
      ipAddress: '127.0.0.1 (Local Console)'
    };

    setAuditLogs(prev => [auditEntry, ...prev]);
    showNotification(`Database successfully restored to snapshot state (${snap.timestamp})!`);
  };

  // Verify Snapshot Checksum
  const handleVerifySnapshot = (snapshotId: string) => {
    const snap = backups.find(b => b.id === snapshotId);
    if (!snap) return;

    showNotification(`SHA-256 Checksum verified for ${snapshotId}: MATCH 100% (No block corruption)`);
  };

  // Issue New RFID Card
  const handleIssueCard = (newCard: RfidCard, updatedEmployee: Employee) => {
    setCards(prev => [newCard, ...prev]);
    setEmployees(prev => prev.map(e => e.id === updatedEmployee.id ? updatedEmployee : e));

    const now = new Date();
    const timestamp = `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0]}`;

    const auditEntry: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp,
      adminUser: 'admin_security01',
      action: 'RFID_CARD_ISSUED',
      category: 'Card Issuance',
      targetEntity: `Card UID ${newCard.cardUid}`,
      details: `${newCard.cardType} issued to ${updatedEmployee.firstName} ${updatedEmployee.lastName} (${updatedEmployee.employeeNumber}). Clearance: ${newCard.accessLevel}.`,
      ipAddress: '192.168.10.50'
    };
    setAuditLogs(prev => [auditEntry, ...prev]);
    showNotification(`Card ${newCard.cardUid} issued and committed to Primary HDD!`);
  };

  // Replace Card (Section 2.15 E)
  const handleReplaceCard = (oldCardId: string, newUid: string, reason: string) => {
    const oldCard = cards.find(c => c.id === oldCardId);
    if (!oldCard) return;

    const today = new Date().toISOString().split('T')[0];
    const newCardId = `card-${Date.now()}`;

    // Deactivate old card
    const updatedOldCard: RfidCard = {
      ...oldCard,
      status: 'Replaced',
      notes: `Deactivated & Replaced. Reason: ${reason}`
    };

    // Create new card
    const newCard: RfidCard = {
      ...oldCard,
      id: newCardId,
      cardUid: newUid,
      status: 'Active',
      issuedAt: today,
      cardNumber: Math.floor(1000 + Math.random() * 9000),
      replacedCardId: oldCard.id,
      replacementReason: reason,
      notes: `Replacement card for old UID ${oldCard.cardUid}. Retained employee records & permissions.`
    };

    setCards(prev => [newCard, ...prev.map(c => c.id === oldCard.id ? updatedOldCard : c)]);

    // Update employee reference
    if (oldCard.employeeId) {
      setEmployees(prev => prev.map(e => {
        if (e.id === oldCard.employeeId) {
          return { ...e, rfidCardId: newCardId };
        }
        return e;
      }));
    }

    const now = new Date();
    const timestamp = `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0]}`;

    const auditEntry: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp,
      adminUser: 'admin_security01',
      action: 'CARD_REPLACED_REVOKED',
      category: 'Card Revocation',
      targetEntity: `Old UID: ${oldCard.cardUid} -> New UID: ${newUid}`,
      details: `Card replaced for ${oldCard.employeeName}. Reason: ${reason}. Historical transactions retained.`,
      ipAddress: '192.168.10.50'
    };
    setAuditLogs(prev => [auditEntry, ...prev]);
    showNotification(`Card replaced successfully. Old UID ${oldCard.cardUid} deactivated.`);
  };

  // Revoke Card
  const handleRevokeCard = (cardId: string, status: CardStatus, reason: string) => {
    const targetCard = cards.find(c => c.id === cardId);
    if (!targetCard) return;

    setCards(prev => prev.map(c => {
      if (c.id === cardId) {
        return { ...c, status, notes: `Revoked: ${reason}` };
      }
      return c;
    }));

    const now = new Date();
    const timestamp = `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0]}`;

    const auditEntry: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp,
      adminUser: 'admin_security01',
      action: 'CARD_REVOKED',
      category: 'Card Revocation',
      targetEntity: `Card UID ${targetCard.cardUid}`,
      details: `Card marked as ${status}. Reason: ${reason}.`,
      ipAddress: '192.168.10.50'
    };
    setAuditLogs(prev => [auditEntry, ...prev]);
    showNotification(`Card UID ${targetCard.cardUid} revoked.`);
  };

  // Simulate Door Tap
  const handleSimulateTap = (card: RfidCard, door: DoorController) => {
    const emp = employees.find(e => e.id === card.employeeId);
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const dateStr = now.toISOString().split('T')[0];
    const timestamp = `${dateStr} ${timeStr}`;

    const isCardActive = card.status === 'Active';
    const isDeptAllowed = door.allowedDepartments.includes(card.department || '');
    const hasMasterClearance = card.accessLevel === 'All Zones (Master)';
    const meetsBiometric = !door.requiresBiometric || emp?.biometricRegistered;

    let resultText: AccessTransaction['result'] = 'Access Granted';
    if (!isCardActive) {
      resultText = 'Access Denied - Card Revoked';
    } else if (door.requiresBiometric && !meetsBiometric) {
      resultText = 'Access Denied - Restricted Zone';
    } else if (!isDeptAllowed && !hasMasterClearance) {
      resultText = 'Access Denied - Restricted Zone';
    }

    const newTx: AccessTransaction = {
      id: `tx-${Date.now()}`,
      timestamp,
      employeeId: card.employeeId || 'unknown',
      employeeName: card.employeeName || 'Unknown Visitor',
      cardUid: card.cardUid,
      doorId: door.id,
      doorName: door.name,
      result: resultText,
      verificationMode: door.requiresBiometric ? 'RFID + Biometric' : 'RFID Card'
    };

    setTransactions(prev => [newTx, ...prev]);

    // If granted, update or append attendance record
    if (resultText === 'Access Granted' && emp) {
      setAttendance(prev => {
        const existing = prev.find(a => a.employeeId === emp.id && a.date === dateStr);
        if (existing) {
          return prev.map(a => {
            if (a.id === existing.id) {
              return { ...a, clockOut: timeStr, totalHours: 8.5 };
            }
            return a;
          });
        } else {
          const newAtt: AttendanceRecord = {
            id: `att-${Date.now()}`,
            employeeId: emp.id,
            employeeName: `${emp.firstName} ${emp.lastName}`,
            department: emp.department,
            date: dateStr,
            clockIn: timeStr,
            totalHours: 8.0,
            status: 'Normal',
            syncedToLocalPayroll: true
          };
          return [newAtt, ...prev];
        }
      });
    }
  };

  // Handle Switch to Card Designer
  const handleSelectForDesign = (emp: Employee, card: RfidCard) => {
    setDesignerEmployee(emp);
    setDesignerCard(card);
    setActiveTab('card-designer');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col antialiased">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        internetConnected={internetConnected}
        setInternetConnected={setInternetConnected}
        backupCount={backups.length}
        primaryHddHealth={simulatedHddFailure ? 'FAULT ALERT' : 'HEALTHY (ext4)'}
        backupHddHealth="SYNCED (ZFS)"
      />

      {/* Floating System Notification */}
      {systemNotice && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm p-4 bg-slate-900 text-white rounded-xl shadow-2xl border border-sky-500/80 text-xs flex items-center justify-between gap-3 animate-fade-in">
          <span>{systemNotice}</span>
          <button
            onClick={() => setSystemNotice(null)}
            className="text-slate-400 hover:text-white font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main App Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8">
        {activeTab === 'dual-hdd' && (
          <DualHddManager
            hddList={hddList}
            backups={backups}
            onTriggerBackup={handleTriggerBackup}
            onRestoreBackup={handleRestoreBackup}
            onVerifySnapshot={handleVerifySnapshot}
            isBackingUp={isBackingUp}
            backupProgress={backupProgress}
            backupStatusStep={backupStatusStep}
            simulatedHddFailure={simulatedHddFailure}
            setSimulatedHddFailure={setSimulatedHddFailure}
          />
        )}

        {activeTab === 'card-issuance' && (
          <RfidCardIssuance
            employees={employees}
            cards={cards}
            doors={doors}
            onIssueCard={handleIssueCard}
            onReplaceCard={handleReplaceCard}
            onRevokeCard={handleRevokeCard}
            onSelectForDesign={handleSelectForDesign}
          />
        )}

        {activeTab === 'card-designer' && (
          <IdCardDesigner
            employees={employees}
            cards={cards}
            selectedEmployee={designerEmployee}
            selectedCard={designerCard}
            onSelectEmployee={(emp) => {
              setDesignerEmployee(emp);
              const linkedCard = cards.find(c => c.employeeId === emp.id);
              if (linkedCard) setDesignerCard(linkedCard);
            }}
          />
        )}

        {activeTab === 'network-topology' && (
          <LocalNetworkTopology
            devices={networkDevices}
            internetConnected={internetConnected}
            setInternetConnected={setInternetConnected}
          />
        )}

        {activeTab === 'access-monitor' && (
          <LiveAccessSimulator
            employees={employees}
            cards={cards}
            doors={doors}
            transactions={transactions}
            attendance={attendance}
            onSimulateTap={handleSimulateTap}
            internetConnected={internetConnected}
          />
        )}

        {activeTab === 'audit-specs' && (
          <AuditAndSpecs auditLogs={auditLogs} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Contract Specification Compliance: <strong>2.10, 2.11, 2.12, 2.13, 2.14 & 2.15</strong>
          </span>
          <span className="font-mono text-[11px] text-emerald-700 font-medium">
            Air-Gapped Autonomous Operation • Zero Cloud Dependency
          </span>
        </div>
      </footer>
    </div>
  );
}
