import React, { useState } from 'react';
import { 
  DoorOpen, 
  DoorClosed, 
  CreditCard, 
  Fingerprint, 
  CheckCircle2, 
  XCircle, 
  Download, 
  Clock, 
  Calendar, 
  User, 
  ShieldAlert, 
  Volume2, 
  VolumeX,
  FileSpreadsheet
} from 'lucide-react';
import { Employee, RfidCard, DoorController, AccessTransaction, AttendanceRecord } from '../types';

interface LiveAccessSimulatorProps {
  employees: Employee[];
  cards: RfidCard[];
  doors: DoorController[];
  transactions: AccessTransaction[];
  attendance: AttendanceRecord[];
  onSimulateTap: (card: RfidCard, door: DoorController) => void;
  internetConnected: boolean;
}

export const LiveAccessSimulator: React.FC<LiveAccessSimulatorProps> = ({
  employees,
  cards,
  doors,
  transactions,
  attendance,
  onSimulateTap,
  internetConnected
}) => {
  const [selectedDoorId, setSelectedDoorId] = useState<string>(doors[0]?.id || '');
  const [selectedCardId, setSelectedCardId] = useState<string>(cards[0]?.id || '');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [tapResultAnimation, setTapResultAnimation] = useState<{
    status: 'granted' | 'denied';
    message: string;
  } | null>(null);

  const selectedDoor = doors.find(d => d.id === selectedDoorId);
  const selectedCard = cards.find(c => c.id === selectedCardId);
  const associatedEmp = employees.find(e => e.id === selectedCard?.employeeId);

  const handleExecuteTap = () => {
    if (!selectedCard || !selectedDoor) return;

    // Check permission logic
    const isCardActive = selectedCard.status === 'Active';
    const isDeptAllowed = selectedDoor.allowedDepartments.includes(selectedCard.department || '');
    const hasMasterClearance = selectedCard.accessLevel === 'All Zones (Master)';
    const meetsBiometric = !selectedDoor.requiresBiometric || associatedEmp?.biometricRegistered;

    let granted = false;
    let message = '';

    if (!isCardActive) {
      granted = false;
      message = `ACCESS DENIED: Card is ${selectedCard.status.toUpperCase()}`;
    } else if (selectedDoor.requiresBiometric && !meetsBiometric) {
      granted = false;
      message = 'ACCESS DENIED: Biometric Match Required';
    } else if (isDeptAllowed || hasMasterClearance) {
      granted = true;
      message = `ACCESS GRANTED: Welcome ${associatedEmp?.firstName || 'Personnel'}`;
    } else {
      granted = false;
      message = `ACCESS DENIED: Unauthorized for ${selectedDoor.zone}`;
    }

    setTapResultAnimation({
      status: granted ? 'granted' : 'denied',
      message
    });

    onSimulateTap(selectedCard, selectedDoor);

    setTimeout(() => {
      setTapResultAnimation(null);
    }, 3000);
  };

  const exportPayrollCsv = () => {
    const headers = ['Record ID', 'Employee ID', 'Employee Name', 'Department', 'Date', 'Clock In', 'Total Hours', 'Status', 'Payroll Synced'];
    const rows = attendance.map(a => [
      a.id,
      a.employeeId,
      `"${a.employeeName}"`,
      `"${a.department}"`,
      a.date,
      a.clockIn,
      a.totalHours,
      a.status,
      a.syncedToLocalPayroll ? 'YES' : 'NO'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `local_payroll_attendance_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-sky-100 text-sky-800">
                Specification 2.10 A & 2.12
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-emerald-100 text-emerald-800">
                Live Transaction Stream
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Live Door Access Terminal & Time-Attendance Simulator
            </h2>
            <p className="text-sm text-slate-600">
              Test real-time physical card taps against door controllers. Transactions log instantly to Primary Online HDD and feed local payroll reports even in 100% offline air-gapped mode.
            </p>
          </div>

          <button
            onClick={exportPayrollCsv}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 flex items-center gap-2 shadow-sm self-start sm:self-auto"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Local Payroll (CSV)</span>
          </button>
        </div>
      </div>

      {/* Simulator Terminal & Controller Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Terminal Controls (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <DoorOpen className="w-4 h-4 text-sky-600" />
            <span>Simulate Physical Reader Scan / Card Tap</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Select Door Access Controller:</label>
              <select
                value={selectedDoorId}
                onChange={(e) => setSelectedDoorId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
              >
                {doors.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.zone}) {d.requiresBiometric ? '• Bio Required' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Select RFID Card to Present:</label>
              <select
                value={selectedCardId}
                onChange={(e) => setSelectedCardId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
              >
                {cards.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.employeeName || 'Unassigned'} — UID: {c.cardUid} [{c.status}]
                  </option>
                ))}
              </select>
            </div>

            {selectedDoor && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1 text-[11px] text-slate-600">
                <div className="font-semibold text-slate-800">Target Controller Specification:</div>
                <div>• Model: {selectedDoor.controllerModel} ({selectedDoor.controllerIp})</div>
                <div>• Bus Protocol: {selectedDoor.protocol}</div>
                <div>• Reader Type: {selectedDoor.readerType}</div>
                <div>• Status: <span className="text-emerald-700 font-bold">LAN Online (&lt;1.2ms)</span></div>
              </div>
            )}

            {/* Tap Action Button */}
            <button
              id="tap-rfid-card-btn"
              onClick={handleExecuteTap}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <CreditCard className="w-4 h-4 text-sky-400" />
              <span>TAP PRESENTED RFID CARD AT READER</span>
            </button>
          </div>

          {/* Feedback Animation Banner */}
          {tapResultAnimation && (
            <div
              className={`p-4 rounded-xl border text-center transition-all animate-bounce ${
                tapResultAnimation.status === 'granted'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-red-50 border-red-300 text-red-900'
              }`}
            >
              <div className="flex items-center justify-center gap-2 font-bold text-sm">
                {tapResultAnimation.status === 'granted' ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>{tapResultAnimation.message}</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span>{tapResultAnimation.message}</span>
                  </>
                )}
              </div>
              <p className="text-[11px] mt-1 text-slate-600">
                Committed to Primary Live HDD (/mnt/primary_data) in 8ms. Zero internet required.
              </p>
            </div>
          )}
        </div>

        {/* Live Door Controllers Grid (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">
              Real-Time Door Controllers on Local Network
            </h3>
            <span className="text-xs font-mono text-emerald-600 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              All 5 Terminals Connected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {doors.map(door => (
              <div
                key={door.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  selectedDoorId === door.id
                    ? 'border-sky-500 bg-sky-50/40 ring-1 ring-sky-400'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
                      <DoorClosed className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{door.name}</h4>
                      <span className="text-[10px] text-slate-500">{door.zone}</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                    {door.doorState}
                  </span>
                </div>

                <div className="mt-2 text-[10px] font-mono text-slate-500 space-y-0.5">
                  <div>IP: {door.controllerIp} • {door.protocol.split(' ')[0]}</div>
                  <div>Bio Required: <span className={door.requiresBiometric ? 'text-indigo-600 font-bold' : 'text-slate-600'}>{door.requiresBiometric ? 'YES' : 'NO'}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time Live Stream & Attendance Logs Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Access Transactions */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-sky-600" />
              <span>Access Granted / Denied Event Stream</span>
            </h4>
            <span className="text-[11px] font-mono text-slate-500">Live WAL Commit</span>
          </div>

          <div className="max-h-64 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 text-[11px] uppercase font-semibold sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3">Employee</th>
                  <th className="py-2.5 px-3">Door Location</th>
                  <th className="py-2.5 px-3">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.slice(0, 8).map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {tx.timestamp.split(' ')[1]}
                    </td>
                    <td className="py-2 px-3 font-medium text-slate-900">
                      {tx.employeeName}
                    </td>
                    <td className="py-2 px-3 text-slate-600 text-[11px]">
                      {tx.doorName.split(' ')[0]} {tx.doorName.split(' ')[1]}
                    </td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        tx.result === 'Access Granted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {tx.result.split(' - ')[0]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Time & Attendance */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Time & Attendance Local Records</span>
            </h4>
            <span className="text-[11px] font-mono text-emerald-700 font-semibold">Ready for Payroll</span>
          </div>

          <div className="max-h-64 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 text-[11px] uppercase font-semibold sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">Employee</th>
                  <th className="py-2.5 px-3">Clock In</th>
                  <th className="py-2.5 px-3">Hours</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Payroll Sync</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attendance.map(att => (
                  <tr key={att.id} className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-semibold text-slate-900">
                      <div>{att.employeeName}</div>
                      <div className="text-[10px] text-slate-500">{att.department}</div>
                    </td>
                    <td className="py-2 px-3 font-mono text-slate-600">
                      {att.clockIn}
                    </td>
                    <td className="py-2 px-3 font-mono text-slate-800 font-bold">
                      {att.totalHours}h
                    </td>
                    <td className="py-2 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 font-medium">
                        {att.status}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                        LOCAL READY
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
