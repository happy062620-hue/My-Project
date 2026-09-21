import React, { useState } from 'react';
import { 
  CreditCard, 
  UserCheck, 
  Scan, 
  Key, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Plus, 
  RotateCcw, 
  FileCheck, 
  Printer, 
  Lock, 
  Radio, 
  ArrowRight,
  UserPlus,
  AlertCircle
} from 'lucide-react';
import { Employee, RfidCard, CardType, CardStatus, AccessPermissionLevel, DoorController } from '../types';
import { generateRandomUid } from '../utils/cardUtils';

interface RfidCardIssuanceProps {
  employees: Employee[];
  cards: RfidCard[];
  doors: DoorController[];
  onIssueCard: (newCard: RfidCard, updatedEmployee: Employee) => void;
  onReplaceCard: (oldCardId: string, newUid: string, reason: string) => void;
  onRevokeCard: (cardId: string, status: CardStatus, reason: string) => void;
  onSelectForDesign: (employee: Employee, card: RfidCard) => void;
}

export const RfidCardIssuance: React.FC<RfidCardIssuanceProps> = ({
  employees,
  cards,
  doors,
  onIssueCard,
  onReplaceCard,
  onRevokeCard,
  onSelectForDesign
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'workflow' | 'card-list' | 'reader-hardware'>('workflow');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(employees[0]?.id || '');
  
  // Issuance Wizard State
  const [selectedCardType, setSelectedCardType] = useState<CardType>('MIFARE DESFire EV2 (AES-128)');
  const [detectedUid, setDetectedUid] = useState<string>('04:5D:88:1A:3B:70:99');
  const [isScanningReader, setIsScanningReader] = useState<boolean>(false);
  const [readerStatus, setReaderStatus] = useState<'Ready' | 'Reading' | 'Card Detected' | 'Sector Encoded'>('Ready');
  const [accessLevel, setAccessLevel] = useState<AccessPermissionLevel>('Standard Staff');
  const [validityYears, setValidityYears] = useState<number>(3);
  const [selectedDoorIds, setSelectedDoorIds] = useState<string[]>(['door-01', 'door-04']);

  // Replacement Modal State
  const [replacementModalOpen, setReplacementModalOpen] = useState<boolean>(false);
  const [cardToReplace, setCardToReplace] = useState<RfidCard | null>(null);
  const [replacementReason, setReplacementReason] = useState<string>('Physical Card Damaged / Chipped');
  const [newReplacementUid, setNewReplacementUid] = useState<string>('');

  const selectedEmployee = employees.find(e => e.id === selectedEmployeeId);
  const existingCard = cards.find(c => c.employeeId === selectedEmployeeId && c.status === 'Active');

  // Reader Simulator: Scan Card
  const handleSimulateReaderScan = () => {
    setIsScanningReader(true);
    setReaderStatus('Reading');
    setTimeout(() => {
      const generated = generateRandomUid(selectedCardType);
      setDetectedUid(generated);
      setIsScanningReader(false);
      setReaderStatus('Card Detected');
    }, 1000);
  };

  // Complete Issuance Action
  const handleCompleteIssuance = () => {
    if (!selectedEmployee) return;

    const today = new Date().toISOString().split('T')[0];
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + validityYears);
    const expiresAt = expiry.toISOString().split('T')[0];

    const newCard: RfidCard = {
      id: `card-${Date.now()}`,
      cardUid: detectedUid,
      cardType: selectedCardType,
      operatingFrequency: selectedCardType.includes('125 kHz') ? '125 kHz' : '13.56 MHz',
      memoryCapacity: selectedCardType.includes('DESFire') 
        ? '4 KB EEPROM with AES-128' 
        : selectedCardType.includes('Classic') 
        ? '1 KB EEPROM' 
        : '2 KB SIO',
      facilityCode: 104,
      cardNumber: Math.floor(1000 + Math.random() * 9000),
      status: 'Active',
      issuedAt: today,
      expiresAt: expiresAt,
      employeeId: selectedEmployee.id,
      employeeName: `${selectedEmployee.firstName} ${selectedEmployee.lastName}`,
      department: selectedEmployee.department,
      accessLevel: accessLevel,
      encryptionKeyConfigured: true,
      notes: `Issued via Local Workstation. Assigned to ${selectedEmployee.department}.`
    };

    const updatedEmployee: Employee = {
      ...selectedEmployee,
      rfidCardId: newCard.id,
      allowedDoorIds: selectedDoorIds
    };

    onIssueCard(newCard, updatedEmployee);
    setCurrentStep(5); // Success step
  };

  // Open Replacement Modal
  const openReplaceDialog = (card: RfidCard) => {
    setCardToReplace(card);
    setNewReplacementUid(generateRandomUid(card.cardType));
    setReplacementModalOpen(true);
  };

  const confirmReplacement = () => {
    if (!cardToReplace || !newReplacementUid) return;
    onReplaceCard(cardToReplace.id, newReplacementUid, replacementReason);
    setReplacementModalOpen(false);
    setCardToReplace(null);
  };

  const filteredCards = cards.filter(c => 
    c.cardUid.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Sub-Navigation */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-sky-100 text-sky-800">
                Specification 2.15 A, B, D, E
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-emerald-100 text-emerald-800">
                Local Encoder Online
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              RFID Card Issuance, Reader/Writer & Lifecycle Management
            </h2>
            <p className="text-sm text-slate-600">
              Controlled 10-step workflow: Employee identification • UID reading & cryptographic encoding • Department access permission binding • Card printing & historical audit logging.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setCurrentStep(1);
                setActiveSubTab('workflow');
              }}
              className="px-3 py-2 bg-sky-600 text-white rounded-lg text-xs font-medium hover:bg-sky-700 flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Issue New Card</span>
            </button>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-4 mt-5 border-b border-slate-200 text-xs">
          <button
            onClick={() => setActiveSubTab('workflow')}
            className={`pb-2.5 font-medium border-b-2 transition-colors ${
              activeSubTab === 'workflow'
                ? 'border-sky-600 text-sky-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Controlled Issuance Workflow (Section 2.15 D)
          </button>
          <button
            onClick={() => setActiveSubTab('card-list')}
            className={`pb-2.5 font-medium border-b-2 transition-colors ${
              activeSubTab === 'card-list'
                ? 'border-sky-600 text-sky-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Active & Historical Card Registry ({cards.length})
          </button>
          <button
            onClick={() => setActiveSubTab('reader-hardware')}
            className={`pb-2.5 font-medium border-b-2 transition-colors ${
              activeSubTab === 'reader-hardware'
                ? 'border-sky-600 text-sky-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Reader/Writer Hardware Specification (2.15 A)
          </button>
        </div>
      </div>

      {/* VIEW: CONTROLLED WORKFLOW (SECTION 2.15 D) */}
      {activeSubTab === 'workflow' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          {/* Visual Step Indicator */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 border-b border-slate-200 pb-4 text-xs font-medium">
            <div className={`flex items-center gap-2 p-2 rounded-lg ${currentStep === 1 ? 'bg-sky-50 text-sky-700 font-bold' : 'text-slate-500'}`}>
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px]">1</span>
              <span>Employee Record</span>
            </div>
            <div className={`flex items-center gap-2 p-2 rounded-lg ${currentStep === 2 ? 'bg-sky-50 text-sky-700 font-bold' : 'text-slate-500'}`}>
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px]">2</span>
              <span>RFID Hardware Scan</span>
            </div>
            <div className={`flex items-center gap-2 p-2 rounded-lg ${currentStep === 3 ? 'bg-sky-50 text-sky-700 font-bold' : 'text-slate-500'}`}>
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px]">3</span>
              <span>Access Permissions</span>
            </div>
            <div className={`flex items-center gap-2 p-2 rounded-lg ${currentStep === 4 ? 'bg-sky-50 text-sky-700 font-bold' : 'text-slate-500'}`}>
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px]">4</span>
              <span>Activation & Encoding</span>
            </div>
            <div className={`flex items-center gap-2 p-2 rounded-lg ${currentStep === 5 ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-500'}`}>
              <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center text-[10px]">5</span>
              <span>Issued & Print Ready</span>
            </div>
          </div>

          {/* STEP 1: SELECT EMPLOYEE */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                Step 1: Select or Confirm Employee Record
              </h3>
              <p className="text-xs text-slate-500">
                Choose the personnel to receive department ID and physical access credentials.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">Target Personnel:</label>
                  <select
                    value={selectedEmployeeId}
                    onChange={(e) => setSelectedEmployeeId(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                  >
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.employeeNumber} - {emp.firstName} {emp.lastName} ({emp.department})
                      </option>
                    ))}
                  </select>

                  {existingCard && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Active Card Detected:</span> Employee already possesses an active card (UID: {existingCard.cardUid}). Issuing a new card will follow Section 2.15 E replacement workflow to deactivate the old card while preserving historical access logs.
                      </div>
                    </div>
                  )}
                </div>

                {selectedEmployee && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-4">
                    <img
                      src={selectedEmployee.photoUrl}
                      alt={selectedEmployee.firstName}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div className="text-xs space-y-1">
                      <div className="font-bold text-slate-900 text-sm">
                        {selectedEmployee.firstName} {selectedEmployee.lastName}
                      </div>
                      <div className="text-slate-600">{selectedEmployee.position}</div>
                      <div className="text-sky-700 font-medium">{selectedEmployee.department}</div>
                      <div className="text-slate-500 font-mono text-[11px]">{selectedEmployee.employeeNumber}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 bg-sky-600 text-white rounded-lg text-xs font-bold hover:bg-sky-700 flex items-center gap-2"
                >
                  <span>Proceed to Hardware Reader Scan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: RFID HARDWARE SCAN & COMPATIBILITY CHECK */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-slate-900">
                Step 2: Scan Physical Card on RFID Reader/Writer (Section 2.15 A)
              </h3>
              <p className="text-xs text-slate-500">
                Place the blank RFID card on the local USB/TCP Reader/Writer to extract UID and check technology compatibility.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Card Technology & Frequency:
                    </label>
                    <select
                      value={selectedCardType}
                      onChange={(e) => setSelectedCardType(e.target.value as CardType)}
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                    >
                      <option value="MIFARE DESFire EV2 (AES-128)">MIFARE DESFire EV2 (AES-128 High Security - 13.56 MHz)</option>
                      <option value="MIFARE Classic 1K">MIFARE Classic 1K (ISO 14443A - 13.56 MHz)</option>
                      <option value="HID iCLASS SE (13.56 MHz)">HID iCLASS SE / SIO (13.56 MHz)</option>
                      <option value="EM4100 / TK4100 (125 kHz)">EM4100 / TK4100 Proximity (125 kHz)</option>
                    </select>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-3">
                    <Radio className={`w-8 h-8 mx-auto ${isScanningReader ? 'text-amber-500 animate-spin' : 'text-sky-600'}`} />
                    <div className="text-xs font-medium text-slate-700">
                      Local Reader: Desktop CCID / PC/SC USB Reader/Writer (Online)
                    </div>
                    <button
                      id="simulate-reader-scan-btn"
                      onClick={handleSimulateReaderScan}
                      disabled={isScanningReader}
                      className="px-4 py-2 bg-slate-800 text-white hover:bg-slate-900 rounded-lg text-xs font-bold shadow-sm"
                    >
                      {isScanningReader ? 'Reading Card on RF Field...' : 'Place Card on Reader / Scan UID'}
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-slate-900 text-white rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">HARDWARE INTERFACE:</span>
                    <span className="text-emerald-400 font-bold">{readerStatus}</span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-slate-400">Captured Card UID:</div>
                    <div className="text-lg text-sky-300 font-bold tracking-widest bg-slate-950 p-2.5 rounded border border-slate-800">
                      {detectedUid}
                    </div>
                  </div>

                  <div className="space-y-1 text-[11px] text-slate-300 pt-2 border-t border-slate-800">
                    <div>• Frequency: {selectedCardType.includes('125 kHz') ? '125 kHz LF' : '13.56 MHz HF (ISO14443A)'}</div>
                    <div>• Anti-Collision: Supported (Type A Bit Frame)</div>
                    <div>• Sector Crypto: AES-128 Hardware Cryptographic Engine Ready</div>
                    <div>• Compatibility Check: <span className="text-emerald-400 font-bold">100% PASS</span></div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-200">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-medium"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2 bg-sky-600 text-white rounded-lg text-xs font-bold hover:bg-sky-700 flex items-center gap-2"
                >
                  <span>Confirm UID & Assign Permissions</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ACCESS PERMISSIONS & DOOR CLEARANCE */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-slate-900">
                Step 3: Configure Access Permissions & Door Clearance
              </h3>
              <p className="text-xs text-slate-500">
                Assign allowed access zones and security clearance tier for this department ID card.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Clearance Tier:
                  </label>
                  <select
                    value={accessLevel}
                    onChange={(e) => setAccessLevel(e.target.value as AccessPermissionLevel)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg mb-4"
                  >
                    <option value="Standard Staff">Standard Staff (Lobby & General Dept Wing)</option>
                    <option value="Restricted Zone">Restricted Zone (Engineering & Labs)</option>
                    <option value="High Security / Server Vault">High Security / Server Vault (Biometric Required)</option>
                    <option value="All Zones (Master)">All Zones (Master Administrator Clearance)</option>
                  </select>

                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Credential Validity Period:
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 5].map(yrs => (
                      <button
                        key={yrs}
                        type="button"
                        onClick={() => setValidityYears(yrs)}
                        className={`flex-1 py-2 text-xs rounded-lg border font-medium ${
                          validityYears === yrs
                            ? 'bg-sky-50 border-sky-600 text-sky-700 font-bold'
                            : 'bg-white border-slate-300 text-slate-700'
                        }`}
                      >
                        {yrs} {yrs === 1 ? 'Year' : 'Years'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-2">
                    Select Authorized Door Controllers:
                  </label>
                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    {doors.map(door => {
                      const isChecked = selectedDoorIds.includes(door.id);
                      return (
                        <label
                          key={door.id}
                          className={`flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer ${
                            isChecked ? 'bg-sky-50 border-sky-300' : 'bg-white border-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedDoorIds([...selectedDoorIds, door.id]);
                                } else {
                                  setSelectedDoorIds(selectedDoorIds.filter(id => id !== door.id));
                                }
                              }}
                              className="rounded text-sky-600"
                            />
                            <div>
                              <span className="font-semibold text-slate-900">{door.name}</span>
                              <span className="block text-[10px] text-slate-500">{door.zone}</span>
                            </div>
                          </div>
                          {door.requiresBiometric && (
                            <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-medium">
                              Bio Required
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-200">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-medium"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="px-4 py-2 bg-sky-600 text-white rounded-lg text-xs font-bold hover:bg-sky-700 flex items-center gap-2"
                >
                  <span>Review & Program Card</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: ACTIVATION & ENCODING */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-slate-900">
                Step 4: Card Activation & Hardware Sector Encoding
              </h3>
              <p className="text-xs text-slate-500">
                Writing application keys to RFID card memory, associating with employee record in local database, and creating audit record.
              </p>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Employee:</span>
                  <span className="font-bold text-slate-900">{selectedEmployee?.firstName} {selectedEmployee?.lastName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Department:</span>
                  <span className="font-bold text-slate-900">{selectedEmployee?.department}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Programmed UID:</span>
                  <span className="font-bold font-mono text-sky-700">{detectedUid}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Card Tech:</span>
                  <span className="font-bold text-slate-900">{selectedCardType}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2 font-mono text-xs">
                <div className="text-emerald-400 font-bold">READY TO WRITE TO PRIMARY DATABASE:</div>
                <div className="text-slate-300">• Target: /mnt/primary_data (Local Server SQLite WAL)</div>
                <div className="text-slate-300">• Queue for Next Automatic Backup: Backup HDD (/dev/sdb1)</div>
                <div className="text-slate-300">• Audit Trail Category: CARD_ISSUANCE</div>
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-200">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-medium"
                >
                  Back
                </button>
                <button
                  id="commit-card-issuance-btn"
                  onClick={handleCompleteIssuance}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Execute Card Issuance & Register in Database</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: ISSUANCE COMPLETE & PRINT READY */}
          {currentStep === 5 && (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  RFID Card Issued & Registered Successfully!
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                  UID <span className="font-mono font-bold text-sky-700">{detectedUid}</span> is now active on all authorized door controllers. Ready for thermal card printing in Card Studio.
                </p>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    if (selectedEmployee) {
                      const issuedCard = cards.find(c => c.cardUid === detectedUid);
                      if (issuedCard) onSelectForDesign(selectedEmployee, issuedCard);
                    }
                  }}
                  className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>Open in ID Card Designer & Print</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentStep(1);
                    setActiveSubTab('card-list');
                  }}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  View in Card Registry
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW: ACTIVE & HISTORICAL CARD REGISTRY (SECTION 2.15 B, E) */}
      {activeSubTab === 'card-list' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by UID, Name, Dept, Status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Total Issued: <strong className="text-slate-800">{cards.length}</strong></span>
              <span>• Active: <strong className="text-emerald-700">{cards.filter(c => c.status === 'Active').length}</strong></span>
              <span>• Revoked/Replaced: <strong className="text-amber-700">{cards.filter(c => c.status !== 'Active').length}</strong></span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/75 text-slate-700 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Card UID & Technology</th>
                  <th className="py-3 px-4">Assigned Employee</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Access Tier</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Valid Until</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredCards.map(card => {
                  const emp = employees.find(e => e.id === card.employeeId);
                  return (
                    <tr key={card.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-slate-900 block">{card.cardUid}</span>
                        <span className="text-[11px] text-slate-500">{card.cardType} ({card.operatingFrequency})</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{card.employeeName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">ID #{card.cardNumber} (FC:{card.facilityCode})</div>
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {card.department}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                          {card.accessLevel}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          card.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : card.status === 'Replaced'
                            ? 'bg-sky-50 text-sky-700 border border-sky-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {card.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {card.expiresAt}
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                        {card.status === 'Active' ? (
                          <>
                            <button
                              onClick={() => {
                                if (emp) onSelectForDesign(emp, card);
                              }}
                              className="px-2 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium"
                              title="Open in ID Card Designer"
                            >
                              Design / Print
                            </button>
                            <button
                              onClick={() => openReplaceDialog(card)}
                              className="px-2 py-1 text-[11px] bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded font-medium"
                              title="Replace Lost/Damaged Card (Section 2.15 E)"
                            >
                              Replace Card
                            </button>
                            <button
                              onClick={() => onRevokeCard(card.id, 'Cancelled', 'Administrator Revoked')}
                              className="px-2 py-1 text-[11px] bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded font-medium"
                              title="Revoke and cancel card"
                            >
                              Revoke
                            </button>
                          </>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">
                            Historical Retained
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: READER/WRITER HARDWARE SPEC (SECTION 2.15 A) */}
      {activeSubTab === 'reader-hardware' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Radio className="w-5 h-5 text-sky-600" />
            <span>Section 2.15 A RFID Card Reader/Writer Technical Specification</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-800 text-sm">RF Hardware Capabilities</h4>
              <ul className="space-y-2 text-slate-700">
                <li className="flex justify-between border-b border-slate-200 pb-1">
                  <span>Operating Frequencies:</span>
                  <span className="font-bold">Dual 13.56 MHz HF & 125 kHz LF</span>
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-1">
                  <span>Supported HF Protocols:</span>
                  <span>ISO/IEC 14443 Type A/B, ISO 15693, NFC Forum Tag 1-5</span>
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-1">
                  <span>Supported Card Families:</span>
                  <span>MIFARE Classic, Plus, DESFire EV1/EV2/EV3, HID iCLASS, FeliCa</span>
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-1">
                  <span>Supported LF Protocols:</span>
                  <span>EM4100 / TK4100, HID Prox, Indala, T5577 Multi-Encoding</span>
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-1">
                  <span>Read / Write Range:</span>
                  <span>Up to 70 mm (Standard Contactless Card)</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-800 text-sm">Host Interface & Cryptographic Security</h4>
              <ul className="space-y-2 text-slate-700">
                <li className="flex justify-between border-b border-slate-200 pb-1">
                  <span>Communication Interface:</span>
                  <span className="font-bold">USB 2.0 Full-Speed (CCID) & RS-232 / TCP-IP</span>
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-1">
                  <span>Driver Standard:</span>
                  <span>PC/SC 2.01 Standard Driverless USB HID</span>
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-1">
                  <span>Security Hardware:</span>
                  <span>Built-in SAM (Secure Access Module) Slot for AES Keys</span>
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-1">
                  <span>Local Server Dependency:</span>
                  <span className="text-emerald-700 font-bold">100% Local / Zero Cloud Needed</span>
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-1">
                  <span>Audit Logging:</span>
                  <span>Every sector write event committed to Primary HDD log</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* CARD REPLACEMENT MODAL (SECTION 2.15 E) */}
      {replacementModalOpen && cardToReplace && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-amber-600" />
                <span>Card Replacement & Revocation (Section 2.15 E)</span>
              </h3>
              <button
                onClick={() => setReplacementModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800 space-y-1">
              <div className="font-bold">Controlled Replacement Protocol:</div>
              <div>• Current UID <span className="font-mono font-bold text-slate-900">{cardToReplace.cardUid}</span> will be immediately deactivated across all door controllers.</div>
              <div>• Employee historical access logs and attendance will remain intact in database.</div>
              <div>• Access permissions will be seamlessly transferred to new replacement card.</div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Reason for Replacement:</label>
                <select
                  value={replacementReason}
                  onChange={(e) => setReplacementReason(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                >
                  <option value="Physical Card Damaged / Chipped">Physical Card Damaged / Chipped</option>
                  <option value="Card Lost by Employee">Card Lost by Employee</option>
                  <option value="Card Stolen (Security Alert)">Card Stolen (Security Alert)</option>
                  <option value="Card Expired">Card Expired</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">New Blank Card UID (Scanned):</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newReplacementUid}
                    onChange={(e) => setNewReplacementUid(e.target.value)}
                    className="flex-1 p-2 font-mono font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                  <button
                    onClick={() => setNewReplacementUid(generateRandomUid(cardToReplace.cardType))}
                    className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-300"
                  >
                    Scan Reader
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setReplacementModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmReplacement}
                className="px-4 py-1.5 text-xs bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-sm"
              >
                Execute Replacement & Deactivate Old Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
