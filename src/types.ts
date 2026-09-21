export type CardType = 
  | 'MIFARE Classic 1K'
  | 'MIFARE DESFire EV2 (AES-128)'
  | 'HID iCLASS SE (13.56 MHz)'
  | 'EM4100 / TK4100 (125 kHz)'
  | 'HID Prox (125 kHz)';

export type CardStatus = 'Active' | 'Lost' | 'Damaged' | 'Expired' | 'Replaced' | 'Cancelled';

export type AccessPermissionLevel = 'Standard Staff' | 'Restricted Zone' | 'High Security / Server Vault' | 'All Zones (Master)';

export interface Employee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  department: string;
  position: string;
  email: string;
  phone: string;
  photoUrl: string;
  hireDate: string;
  status: 'Active' | 'On Leave' | 'Terminated';
  biometricRegistered: boolean;
  biometricTemplateHash?: string;
  rfidCardId?: string;
  accessSchedule: '24/7 Unlimited' | 'Business Hours (08:00 - 18:00)' | 'Night Shift (20:00 - 06:00)' | 'Custom';
  allowedDoorIds: string[];
}

export interface RfidCard {
  id: string;
  cardUid: string;
  cardType: CardType;
  operatingFrequency: '13.56 MHz' | '125 kHz' | 'Dual Frequency';
  memoryCapacity: string;
  facilityCode: number;
  cardNumber: number;
  status: CardStatus;
  issuedAt: string;
  expiresAt: string;
  employeeId?: string;
  employeeName?: string;
  department?: string;
  accessLevel: AccessPermissionLevel;
  encryptionKeyConfigured: boolean;
  notes?: string;
  replacedCardId?: string;
  replacementReason?: string;
}

export interface DoorController {
  id: string;
  name: string;
  zone: string;
  controllerIp: string;
  controllerModel: string;
  protocol: 'OSDP v2.2 (Encrypted)' | 'Wiegand 34-bit' | 'RS-485 Local Bus';
  status: 'Online' | 'Offline' | 'Alarm';
  doorState: 'Locked' | 'Unlocked' | 'Forced Open Alert';
  readerType: 'RFID + Biometric Fingerprint' | 'RFID Only' | 'Facial Recognition + RFID';
  allowedDepartments: string[];
  requiresBiometric: boolean;
}

export interface AccessTransaction {
  id: string;
  timestamp: string;
  employeeId: string;
  employeeName: string;
  cardUid: string;
  doorId: string;
  doorName: string;
  result: 'Access Granted' | 'Access Denied - Invalid Card' | 'Access Denied - Restricted Zone' | 'Access Denied - Time Restriction' | 'Access Denied - Card Revoked';
  verificationMode: 'RFID Card' | 'RFID + Biometric' | 'PIN + RFID';
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  totalHours: number;
  status: 'On Time' | 'Late' | 'Early Departure' | 'Normal';
  syncedToLocalPayroll: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  adminUser: string;
  action: string;
  category: 'Card Issuance' | 'Card Revocation' | 'Backup Operation' | 'Database Restore' | 'Permission Change' | 'System Config';
  targetEntity: string;
  details: string;
  ipAddress: string;
}

export interface BackupSnapshot {
  id: string;
  timestamp: string;
  type: 'Automatic Scheduled (Full)' | 'Automatic Incremental (Hourly)' | 'Manual Snapshot';
  sizeMb: number;
  recordCount: {
    employees: number;
    cards: number;
    transactions: number;
    attendance: number;
    systemLogs: number;
  };
  sha256Checksum: string;
  targetHdd: 'Backup HDD (Drive B - 4TB)' | 'Secondary Backup (Drive C - 4TB)';
  status: 'Verified (Intact)' | 'In Progress' | 'Corrupt';
  verifiedAt: string;
}

export interface HddDriveInfo {
  driveId: string;
  mountPoint: string;
  role: 'Primary Active Online' | 'Offline Scheduled Backup' | 'Secondary Redundant Backup';
  model: string;
  serialNumber: string;
  capacityGb: number;
  usedGb: number;
  filesystem: string;
  temperatureC: number;
  health: '100% Optimal' | 'Warning' | 'Failing';
  readSpeedMbps: number;
  writeSpeedMbps: number;
  smartStatus: 'PASSED' | 'ALERT';
  isPhysicallySeparate: boolean;
}

export interface NetworkDevice {
  id: string;
  name: string;
  type: 'Central Server' | 'Door Controller' | 'RFID Reader/Writer' | 'Network Switch' | 'Admin Workstation';
  ipAddress: string;
  macAddress: string;
  protocol: string;
  latencyMs: number;
  status: 'Active Local' | 'Degraded' | 'Offline';
  isLocalOnly: boolean;
}

export interface CardTemplate {
  id: string;
  name: string;
  orientation: 'portrait' | 'landscape';
  dimensions: 'CR80 (85.60 x 53.98 mm)' | 'CR79 (83.90 x 51.00 mm)';
  headerBgColor: string;
  accentColor: string;
  cardBgColor: string;
  textColor: string;
  companyName: string;
  companySubtitle: string;
  showPhoto: boolean;
  showQrCode: boolean;
  showBarcode: boolean;
  showChipGraphic: boolean;
  showSignatureLine: boolean;
  showDepartmentBadge: boolean;
  showSecurityHologram: boolean;
  watermarkText?: string;
  backNotes: string;
}
