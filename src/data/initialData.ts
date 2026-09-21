import {
  Employee,
  RfidCard,
  DoorController,
  AccessTransaction,
  AttendanceRecord,
  AuditLogEntry,
  BackupSnapshot,
  HddDriveInfo,
  NetworkDevice,
  CardTemplate
} from '../types';

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-001',
    employeeNumber: 'EMP-10492',
    firstName: 'Elena',
    lastName: 'Rostova',
    department: 'Cybersecurity & Systems',
    position: 'Chief Systems Architect',
    email: 'e.rostova@local.corp',
    phone: '+1 (555) 234-8901',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    hireDate: '2021-03-15',
    status: 'Active',
    biometricRegistered: true,
    biometricTemplateHash: 'SHA256:8f9a2b0c1e4d3a2f7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0',
    rfidCardId: 'card-001',
    accessSchedule: '24/7 Unlimited',
    allowedDoorIds: ['door-01', 'door-02', 'door-03', 'door-04', 'door-05']
  },
  {
    id: 'emp-002',
    employeeNumber: 'EMP-10493',
    firstName: 'Marcus',
    lastName: 'Vance',
    department: 'Facilities & Security',
    position: 'Lead Security Officer',
    email: 'm.vance@local.corp',
    phone: '+1 (555) 234-8902',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    hireDate: '2019-08-01',
    status: 'Active',
    biometricRegistered: true,
    biometricTemplateHash: 'SHA256:1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2',
    rfidCardId: 'card-002',
    accessSchedule: '24/7 Unlimited',
    allowedDoorIds: ['door-01', 'door-02', 'door-03', 'door-04', 'door-05']
  },
  {
    id: 'emp-003',
    employeeNumber: 'EMP-10494',
    firstName: 'Sophia',
    lastName: 'Chen',
    department: 'Hardware Engineering',
    position: 'Embedded Firmware Specialist',
    email: 's.chen@local.corp',
    phone: '+1 (555) 234-8903',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    hireDate: '2022-01-10',
    status: 'Active',
    biometricRegistered: true,
    biometricTemplateHash: 'SHA256:4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5',
    rfidCardId: 'card-003',
    accessSchedule: 'Business Hours (08:00 - 18:00)',
    allowedDoorIds: ['door-01', 'door-03', 'door-05']
  },
  {
    id: 'emp-004',
    employeeNumber: 'EMP-10495',
    firstName: 'David',
    lastName: 'Kowalski',
    department: 'Finance & Payroll',
    position: 'Payroll Supervisor',
    email: 'd.kowalski@local.corp',
    phone: '+1 (555) 234-8904',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    hireDate: '2020-05-18',
    status: 'Active',
    biometricRegistered: false,
    rfidCardId: 'card-004',
    accessSchedule: 'Business Hours (08:00 - 18:00)',
    allowedDoorIds: ['door-01', 'door-04']
  },
  {
    id: 'emp-005',
    employeeNumber: 'EMP-10496',
    firstName: 'Amara',
    lastName: 'Okafor',
    department: 'Human Resources',
    position: 'HR & Personnel Director',
    email: 'a.okafor@local.corp',
    phone: '+1 (555) 234-8905',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    hireDate: '2021-11-04',
    status: 'Active',
    biometricRegistered: true,
    biometricTemplateHash: 'SHA256:9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0',
    rfidCardId: 'card-005',
    accessSchedule: 'Business Hours (08:00 - 18:00)',
    allowedDoorIds: ['door-01', 'door-04']
  }
];

export const INITIAL_CARDS: RfidCard[] = [
  {
    id: 'card-001',
    cardUid: '04:A2:8F:B1:9C:20:80',
    cardType: 'MIFARE DESFire EV2 (AES-128)',
    operatingFrequency: '13.56 MHz',
    memoryCapacity: '4 KB EEPROM with 3DES/AES hardware crypto',
    facilityCode: 104,
    cardNumber: 8821,
    status: 'Active',
    issuedAt: '2025-01-15',
    expiresAt: '2028-01-15',
    employeeId: 'emp-001',
    employeeName: 'Elena Rostova',
    department: 'Cybersecurity & Systems',
    accessLevel: 'All Zones (Master)',
    encryptionKeyConfigured: true,
    notes: 'Master security clearance. Dual-factor enabled.'
  },
  {
    id: 'card-002',
    cardUid: '3A:7E:90:F2:18:4B:00',
    cardType: 'MIFARE DESFire EV2 (AES-128)',
    operatingFrequency: '13.56 MHz',
    memoryCapacity: '4 KB EEPROM with 3DES/AES hardware crypto',
    facilityCode: 104,
    cardNumber: 8822,
    status: 'Active',
    issuedAt: '2024-08-01',
    expiresAt: '2027-08-01',
    employeeId: 'emp-002',
    employeeName: 'Marcus Vance',
    department: 'Facilities & Security',
    accessLevel: 'All Zones (Master)',
    encryptionKeyConfigured: true,
    notes: 'Security guard physical patrol badge.'
  },
  {
    id: 'card-003',
    cardUid: 'E2:80:68:1A',
    cardType: 'MIFARE Classic 1K',
    operatingFrequency: '13.56 MHz',
    memoryCapacity: '1 KB (16 sectors x 4 blocks)',
    facilityCode: 104,
    cardNumber: 8823,
    status: 'Active',
    issuedAt: '2025-01-10',
    expiresAt: '2027-01-10',
    employeeId: 'emp-003',
    employeeName: 'Sophia Chen',
    department: 'Hardware Engineering',
    accessLevel: 'Restricted Zone',
    encryptionKeyConfigured: true,
    notes: 'Hardware engineering lab access.'
  },
  {
    id: 'card-004',
    cardUid: '00:1A:4C:E9:55',
    cardType: 'EM4100 / TK4100 (125 kHz)',
    operatingFrequency: '125 kHz',
    memoryCapacity: '64-bit Read-Only Manchester',
    facilityCode: 104,
    cardNumber: 8824,
    status: 'Active',
    issuedAt: '2024-05-20',
    expiresAt: '2026-05-20',
    employeeId: 'emp-004',
    employeeName: 'David Kowalski',
    department: 'Finance & Payroll',
    accessLevel: 'Standard Staff',
    encryptionKeyConfigured: false,
    notes: 'Standard office & administrative area.'
  },
  {
    id: 'card-005',
    cardUid: '04:19:33:AA:BB:CC:DD',
    cardType: 'HID iCLASS SE (13.56 MHz)',
    operatingFrequency: '13.56 MHz',
    memoryCapacity: '2 KB with SIO data model',
    facilityCode: 104,
    cardNumber: 8825,
    status: 'Active',
    issuedAt: '2024-11-10',
    expiresAt: '2027-11-10',
    employeeId: 'emp-005',
    employeeName: 'Amara Okafor',
    department: 'Human Resources',
    accessLevel: 'Standard Staff',
    encryptionKeyConfigured: true,
    notes: 'HR executive office credentials.'
  }
];

export const INITIAL_DOORS: DoorController[] = [
  {
    id: 'door-01',
    name: 'Main Perimeter Turnstile A',
    zone: 'Zone 1 - Perimeter Lobby',
    controllerIp: '192.168.10.41',
    controllerModel: 'Mercury LP1502 Dual Door PoE+',
    protocol: 'OSDP v2.2 (Encrypted)',
    status: 'Online',
    doorState: 'Locked',
    readerType: 'RFID + Biometric Fingerprint',
    allowedDepartments: ['Cybersecurity & Systems', 'Facilities & Security', 'Hardware Engineering', 'Finance & Payroll', 'Human Resources'],
    requiresBiometric: false
  },
  {
    id: 'door-02',
    name: 'Central Server Vault & HDD Array',
    zone: 'Zone 4 - High Security Core',
    controllerIp: '192.168.10.42',
    controllerModel: 'Mercury LP1502 Dual Door PoE+',
    protocol: 'OSDP v2.2 (Encrypted)',
    status: 'Online',
    doorState: 'Locked',
    readerType: 'RFID + Biometric Fingerprint',
    allowedDepartments: ['Cybersecurity & Systems', 'Facilities & Security'],
    requiresBiometric: true
  },
  {
    id: 'door-03',
    name: 'Hardware R&D Cleanroom Lab',
    zone: 'Zone 3 - Engineering Restricted',
    controllerIp: '192.168.10.43',
    controllerModel: 'VertX EVO V1000 Master Controller',
    protocol: 'Wiegand 34-bit',
    status: 'Online',
    doorState: 'Locked',
    readerType: 'RFID + Biometric Fingerprint',
    allowedDepartments: ['Cybersecurity & Systems', 'Facilities & Security', 'Hardware Engineering'],
    requiresBiometric: true
  },
  {
    id: 'door-04',
    name: 'Executive & Financial Records Suite',
    zone: 'Zone 2 - Administration Wing',
    controllerIp: '192.168.10.44',
    controllerModel: 'VertX EVO V1000 Master Controller',
    protocol: 'OSDP v2.2 (Encrypted)',
    status: 'Online',
    doorState: 'Locked',
    readerType: 'RFID Only',
    allowedDepartments: ['Cybersecurity & Systems', 'Facilities & Security', 'Finance & Payroll', 'Human Resources'],
    requiresBiometric: false
  },
  {
    id: 'door-05',
    name: 'Rear Logistics & Loading Bay',
    zone: 'Zone 1 - Operations Facility',
    controllerIp: '192.168.10.45',
    controllerModel: 'InBio-460 Pro IP Access Panel',
    protocol: 'RS-485 Local Bus',
    status: 'Online',
    doorState: 'Locked',
    readerType: 'RFID Only',
    allowedDepartments: ['Cybersecurity & Systems', 'Facilities & Security', 'Hardware Engineering'],
    requiresBiometric: false
  }
];

export const INITIAL_HDD_STORAGE: HddDriveInfo[] = [
  {
    driveId: 'HDD-A',
    mountPoint: '/mnt/primary_data (Active /dev/sda1)',
    role: 'Primary Active Online',
    model: 'Western Digital Ultrastar DC HC550 Enterprise 2.0 TB',
    serialNumber: 'WDC-WUS721818ALE6L4-8902',
    capacityGb: 2048,
    usedGb: 486.2,
    filesystem: 'ext4 (Journaled with WAL Commit)',
    temperatureC: 34,
    health: '100% Optimal',
    readSpeedMbps: 265,
    writeSpeedMbps: 250,
    smartStatus: 'PASSED',
    isPhysicallySeparate: false
  },
  {
    driveId: 'HDD-B',
    mountPoint: '/mnt/offline_backup (Dedicated /dev/sdb1)',
    role: 'Offline Scheduled Backup',
    model: 'Seagate IronWolf Pro Enterprise NAS 4.0 TB',
    serialNumber: 'ST4000NE001-2MA101-7719',
    capacityGb: 4096,
    usedGb: 1240.8,
    filesystem: 'ZFS Mirror with SHA-256 Checksums',
    temperatureC: 31,
    health: '100% Optimal',
    readSpeedMbps: 240,
    writeSpeedMbps: 235,
    smartStatus: 'PASSED',
    isPhysicallySeparate: true
  },
  {
    driveId: 'HDD-C',
    mountPoint: '/mnt/secondary_cold (External Hot-Swap /dev/sdc1)',
    role: 'Secondary Redundant Backup',
    model: 'Toshiba MG Series Enterprise High-Endurance 4.0 TB',
    serialNumber: 'MG08ACA16TE-5501',
    capacityGb: 4096,
    usedGb: 980.5,
    filesystem: 'ext4 (Encrypted LUKS Volume)',
    temperatureC: 29,
    health: '100% Optimal',
    readSpeedMbps: 260,
    writeSpeedMbps: 245,
    smartStatus: 'PASSED',
    isPhysicallySeparate: true
  }
];

export const INITIAL_BACKUPS: BackupSnapshot[] = [
  {
    id: 'snap-20260921-0200',
    timestamp: '2026-09-21 02:00:00',
    type: 'Automatic Scheduled (Full)',
    sizeMb: 1420.5,
    recordCount: {
      employees: 5,
      cards: 5,
      transactions: 2840,
      attendance: 712,
      systemLogs: 1940
    },
    sha256Checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    targetHdd: 'Backup HDD (Drive B - 4TB)',
    status: 'Verified (Intact)',
    verifiedAt: '2026-09-21 02:04:12'
  },
  {
    id: 'snap-20260921-0100',
    timestamp: '2026-09-21 01:00:00',
    type: 'Automatic Incremental (Hourly)',
    sizeMb: 42.1,
    recordCount: {
      employees: 5,
      cards: 5,
      transactions: 2824,
      attendance: 712,
      systemLogs: 1920
    },
    sha256Checksum: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    targetHdd: 'Backup HDD (Drive B - 4TB)',
    status: 'Verified (Intact)',
    verifiedAt: '2026-09-21 01:01:05'
  },
  {
    id: 'snap-20260920-0200',
    timestamp: '2026-09-20 02:00:00',
    type: 'Automatic Scheduled (Full)',
    sizeMb: 1395.2,
    recordCount: {
      employees: 5,
      cards: 5,
      transactions: 2690,
      attendance: 680,
      systemLogs: 1810
    },
    sha256Checksum: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    targetHdd: 'Backup HDD (Drive B - 4TB)',
    status: 'Verified (Intact)',
    verifiedAt: '2026-09-20 02:04:10'
  }
];

export const INITIAL_NETWORK_DEVICES: NetworkDevice[] = [
  {
    id: 'dev-srv-01',
    name: 'Local Access Control Server (Dual HDD Engine)',
    type: 'Central Server',
    ipAddress: '192.168.10.200',
    macAddress: '70:85:C2:A1:09:44',
    protocol: 'Local TCP/IP (Static LAN)',
    latencyMs: 0.1,
    status: 'Active Local',
    isLocalOnly: true
  },
  {
    id: 'dev-sw-01',
    name: 'Dedicated Managed PoE+ Gigabit Switch (Cisco SG350)',
    type: 'Network Switch',
    ipAddress: '192.168.10.1',
    macAddress: 'CC:D5:39:88:12:00',
    protocol: '802.1Q VLAN 10 (Access Control Isolated)',
    latencyMs: 0.3,
    status: 'Active Local',
    isLocalOnly: true
  },
  {
    id: 'dev-dc-01',
    name: 'Door Controller 01 - Main Lobby Turnstiles',
    type: 'Door Controller',
    ipAddress: '192.168.10.41',
    macAddress: '00:15:8D:11:A2:33',
    protocol: 'OSDP v2.2 Encrypted over IP',
    latencyMs: 1.2,
    status: 'Active Local',
    isLocalOnly: true
  },
  {
    id: 'dev-dc-02',
    name: 'Door Controller 02 - Server Vault & Core Storage',
    type: 'Door Controller',
    ipAddress: '192.168.10.42',
    macAddress: '00:15:8D:11:A2:34',
    protocol: 'OSDP v2.2 Encrypted over IP',
    latencyMs: 1.1,
    status: 'Active Local',
    isLocalOnly: true
  },
  {
    id: 'dev-dc-03',
    name: 'Door Controller 03 - R&D Engineering Lab',
    type: 'Door Controller',
    ipAddress: '192.168.10.43',
    macAddress: '00:15:8D:11:A2:35',
    protocol: 'Wiegand 34-bit over IP Module',
    latencyMs: 1.5,
    status: 'Active Local',
    isLocalOnly: true
  },
  {
    id: 'dev-rw-01',
    name: 'Desktop USB/LAN RFID Card Reader/Writer (Dual-Freq 13.56M/125K)',
    type: 'RFID Reader/Writer',
    ipAddress: '192.168.10.60 (USB Virtual COM / TCP)',
    macAddress: 'A4:C3:F0:88:19:B2',
    protocol: 'CCID / PC/SC & Direct Sector Encoding',
    latencyMs: 0.8,
    status: 'Active Local',
    isLocalOnly: true
  },
  {
    id: 'dev-ws-01',
    name: 'Admin Issuance Workstation (Security Office Console)',
    type: 'Admin Workstation',
    ipAddress: '192.168.10.50',
    macAddress: '3C:52:82:77:4A:10',
    protocol: 'HTTPS Local TLS 1.3 on LAN',
    latencyMs: 0.5,
    status: 'Active Local',
    isLocalOnly: true
  }
];

export const INITIAL_TRANSACTIONS: AccessTransaction[] = [
  {
    id: 'tx-1001',
    timestamp: '2026-09-21 08:55:12',
    employeeId: 'emp-001',
    employeeName: 'Elena Rostova',
    cardUid: '04:A2:8F:B1:9C:20:80',
    doorId: 'door-01',
    doorName: 'Main Perimeter Turnstile A',
    result: 'Access Granted',
    verificationMode: 'RFID Card'
  },
  {
    id: 'tx-1002',
    timestamp: '2026-09-21 08:58:30',
    employeeId: 'emp-001',
    employeeName: 'Elena Rostova',
    cardUid: '04:A2:8F:B1:9C:20:80',
    doorId: 'door-02',
    doorName: 'Central Server Vault & HDD Array',
    result: 'Access Granted',
    verificationMode: 'RFID + Biometric'
  },
  {
    id: 'tx-1003',
    timestamp: '2026-09-21 09:02:14',
    employeeId: 'emp-003',
    employeeName: 'Sophia Chen',
    cardUid: 'E2:80:68:1A',
    doorId: 'door-01',
    doorName: 'Main Perimeter Turnstile A',
    result: 'Access Granted',
    verificationMode: 'RFID Card'
  },
  {
    id: 'tx-1004',
    timestamp: '2026-09-21 09:14:05',
    employeeId: 'emp-004',
    employeeName: 'David Kowalski',
    cardUid: '00:1A:4C:E9:55',
    doorId: 'door-02',
    doorName: 'Central Server Vault & HDD Array',
    result: 'Access Denied - Restricted Zone',
    verificationMode: 'RFID Card'
  },
  {
    id: 'tx-1005',
    timestamp: '2026-09-21 09:20:18',
    employeeId: 'emp-002',
    employeeName: 'Marcus Vance',
    cardUid: '3A:7E:90:F2:18:4B:00',
    doorId: 'door-05',
    doorName: 'Rear Logistics & Loading Bay',
    result: 'Access Granted',
    verificationMode: 'RFID Card'
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-001',
    employeeId: 'emp-001',
    employeeName: 'Elena Rostova',
    department: 'Cybersecurity & Systems',
    date: '2026-09-21',
    clockIn: '08:55:12',
    totalHours: 8.5,
    status: 'On Time',
    syncedToLocalPayroll: true
  },
  {
    id: 'att-002',
    employeeId: 'emp-002',
    employeeName: 'Marcus Vance',
    department: 'Facilities & Security',
    date: '2026-09-21',
    clockIn: '07:45:00',
    totalHours: 9.0,
    status: 'On Time',
    syncedToLocalPayroll: true
  },
  {
    id: 'att-003',
    employeeId: 'emp-003',
    employeeName: 'Sophia Chen',
    department: 'Hardware Engineering',
    date: '2026-09-21',
    clockIn: '09:02:14',
    totalHours: 7.8,
    status: 'Normal',
    syncedToLocalPayroll: true
  },
  {
    id: 'att-004',
    employeeId: 'emp-004',
    employeeName: 'David Kowalski',
    department: 'Finance & Payroll',
    date: '2026-09-21',
    clockIn: '08:30:00',
    totalHours: 8.0,
    status: 'On Time',
    syncedToLocalPayroll: true
  },
  {
    id: 'att-005',
    employeeId: 'emp-005',
    employeeName: 'Amara Okafor',
    department: 'Human Resources',
    date: '2026-09-21',
    clockIn: '08:42:15',
    totalHours: 8.0,
    status: 'On Time',
    syncedToLocalPayroll: true
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-001',
    timestamp: '2026-09-21 02:04:12',
    adminUser: 'SYSTEM (Local Daemon)',
    action: 'AUTOMATIC_BACKUP_COMPLETED',
    category: 'Backup Operation',
    targetEntity: 'Offline Backup HDD (/dev/sdb1)',
    details: 'Daily Full Database Image (1,420.5 MB) committed to separate offline HDD. SHA-256 integrity passed.',
    ipAddress: '127.0.0.1 (Local Server Bus)'
  },
  {
    id: 'aud-002',
    timestamp: '2026-09-20 14:10:00',
    adminUser: 'admin_security01',
    action: 'RFID_CARD_ISSUED',
    category: 'Card Issuance',
    targetEntity: 'Card UID 04:A2:8F:B1:9C:20:80',
    details: 'MIFARE DESFire EV2 card issued to Elena Rostova (EMP-10492). Master clearance programmed to sector 02.',
    ipAddress: '192.168.10.50'
  },
  {
    id: 'aud-003',
    timestamp: '2026-09-20 11:35:22',
    adminUser: 'admin_security01',
    action: 'DOOR_PERMISSION_UPDATED',
    category: 'Permission Change',
    targetEntity: 'Door Controller 02 (Vault)',
    details: 'Updated multi-factor authentication requirement: Biometric Fingerprint required in addition to RFID.',
    ipAddress: '192.168.10.50'
  },
  {
    id: 'aud-004',
    timestamp: '2026-09-19 16:22:01',
    adminUser: 'sys_admin',
    action: 'INTEGRITY_VERIFICATION',
    category: 'Backup Operation',
    targetEntity: 'Backup Snapshot snap-20260920-0200',
    details: 'Block-level hash comparison matched primary database catalog with 0 bad sectors.',
    ipAddress: '127.0.0.1'
  }
];

export const INITIAL_TEMPLATES: CardTemplate[] = [
  {
    id: 'tpl-corporate-master',
    name: 'Executive & High-Security Platinum',
    orientation: 'portrait',
    dimensions: 'CR80 (85.60 x 53.98 mm)',
    headerBgColor: '#0f172a',
    accentColor: '#38bdf8',
    cardBgColor: '#ffffff',
    textColor: '#0f172a',
    companyName: 'TITAN CORE SYSTEMS',
    companySubtitle: 'DEPARTMENT OF SECURE INFRASTRUCTURE',
    showPhoto: true,
    showQrCode: true,
    showBarcode: true,
    showChipGraphic: true,
    showSignatureLine: true,
    showDepartmentBadge: true,
    showSecurityHologram: true,
    watermarkText: 'RESTRICTED FACILITY ACCESS',
    backNotes: 'This card is the property of the issuing facility. Property must be returned upon termination. If found, return to Security Desk or drop in nearest mailbox.'
  },
  {
    id: 'tpl-engineering',
    name: 'Technical Operations & Engineering',
    orientation: 'portrait',
    dimensions: 'CR80 (85.60 x 53.98 mm)',
    headerBgColor: '#064e3b',
    accentColor: '#10b981',
    cardBgColor: '#f8fafc',
    textColor: '#0f172a',
    companyName: 'TITAN CORE SYSTEMS',
    companySubtitle: 'HARDWARE & SYSTEMS DIVISION',
    showPhoto: true,
    showQrCode: true,
    showBarcode: true,
    showChipGraphic: true,
    showSignatureLine: false,
    showDepartmentBadge: true,
    showSecurityHologram: false,
    watermarkText: 'R&D CLEANROOM AUTHORIZED',
    backNotes: 'Valid for R&D Cleanrooms, Server Operations, and Logistics. Unauthorized duplication is strictly prohibited.'
  },
  {
    id: 'tpl-standard-staff',
    name: 'Corporate Staff & Administration',
    orientation: 'landscape',
    dimensions: 'CR80 (85.60 x 53.98 mm)',
    headerBgColor: '#1e3a8a',
    accentColor: '#60a5fa',
    cardBgColor: '#ffffff',
    textColor: '#0f172a',
    companyName: 'TITAN CORE SYSTEMS',
    companySubtitle: 'HEADQUARTERS ADMINISTRATIVE BADGE',
    showPhoto: true,
    showQrCode: false,
    showBarcode: true,
    showChipGraphic: true,
    showSignatureLine: true,
    showDepartmentBadge: true,
    showSecurityHologram: false,
    watermarkText: 'STANDARD ACCESS',
    backNotes: 'General headquarters building access during standard operational hours.'
  }
];

// Section 2.13 Matrix
export const INTERNET_DEPENDENCY_MATRIX = [
  {
    feature: 'RFID Card Tap & Instant Door Grant/Deny',
    dependency: '100% Local / Zero Internet Required',
    offlineStatus: 'Fully Operational',
    notes: 'Access decisions evaluated directly by local Door Controller / Central Server database in <12ms.'
  },
  {
    feature: 'Time & Attendance Clock-in / Clock-out',
    dependency: '100% Local / Zero Internet Required',
    offlineStatus: 'Fully Operational',
    notes: 'Logged directly to Primary HDD /dev/sda1 and aggregated locally for on-site payroll export.'
  },
  {
    feature: 'RFID Card Issuance & Hardware Encoding',
    dependency: '100% Local / Zero Internet Required',
    offlineStatus: 'Fully Operational',
    notes: 'Reads UID and encodes cryptographic sectors via local USB/TCP Reader-Writer; binds to local DB.'
  },
  {
    feature: 'ID Card Layout Design & Direct Thermal Printing',
    dependency: '100% Local / Zero Internet Required',
    offlineStatus: 'Fully Operational',
    notes: 'WYSIWYG layout rendered in local browser and sent via local print spooler to thermal card printer.'
  },
  {
    feature: 'Dual HDD Automatic Scheduled Offline Backup',
    dependency: '100% Local / Zero Internet Required',
    offlineStatus: 'Fully Operational',
    notes: 'Direct high-speed bus transfer from Primary HDD to Separate Backup HDD without any cloud relay.'
  },
  {
    feature: 'Database Restoration & Disaster Recovery',
    dependency: '100% Local / Zero Internet Required',
    offlineStatus: 'Fully Operational',
    notes: 'Point-in-time restore from local Backup HDD B or Secondary HDD C using local admin authentication.'
  },
  {
    feature: 'Audit Log & Historical Report Generation',
    dependency: '100% Local / Zero Internet Required',
    offlineStatus: 'Fully Operational',
    notes: 'Immutable system audit logs stored locally and exported as PDF/CSV without external networks.'
  },
  {
    feature: 'Remote Vendor Technical Support (Optional)',
    dependency: 'Optional External Internet Required',
    offlineStatus: 'Disabled during air-gapped mode',
    notes: 'Requires administrator-approved outbound VPN tunnel only when remote diagnostics are requested.'
  },
  {
    feature: 'Off-site Cloud Mirror / Remote Branch Sync (Optional)',
    dependency: 'Optional External Internet Required',
    offlineStatus: 'Disabled during air-gapped mode',
    notes: 'Optional asynchronous synchronization to external cloud; core system remains 100% autonomous without it.'
  },
  {
    feature: 'External SMTP Email & SMS Gateway Alerts (Optional)',
    dependency: 'Optional External Internet Required',
    offlineStatus: 'Local Audible Buzzer & UI Alerts Active',
    notes: 'Chassis buzzer & local GUI alert instantly notify security staff locally without needing email.'
  }
];

// Section 2.14 11-Point Supplier Specifications
export const SUPPLIER_RECOVERY_SPECIFICATIONS = [
  {
    id: 1,
    title: 'Primary HDD Capacity',
    value: '2.0 TB Enterprise Grade (Expandable to 8.0 TB RAID-1)',
    details: 'Western Digital Ultrastar DC HC550 or Seagate Exos 7200 RPM Enterprise SATA/SAS with 2.5M hours MTBF. Accommodates 10+ years of 50,000 employee records, biometric hashes, and 15,000,000 access transactions.'
  },
  {
    id: 2,
    title: 'Backup HDD Capacity',
    value: '4.0 TB Dedicated High-Endurance Offline Storage (Expandable to 16.0 TB)',
    details: 'Seagate IronWolf Pro / WD Gold Enterprise HDD in physically separated drive bay. Sized at 200% of Primary HDD capacity to maintain extensive multi-generational differential and full snapshots.'
  },
  {
    id: 3,
    title: 'Backup Frequency',
    value: 'Dual-Tier: Continuous Real-Time WAL Mirroring + Hourly Incremental + Daily Full',
    details: 'Write-Ahead Logs (WAL) continuously mirror transactions. Differential snapshot every 60 minutes. Complete bare-metal database archive every 24 hours at 02:00:00.'
  },
  {
    id: 4,
    title: 'Automatic Backup Schedule',
    value: 'Scheduled Cron Execution: 02:00:00 Local Server Time (Zero Intervention)',
    details: 'Non-disruptive hot snapshot executed automatically by local server background daemon during lowest traffic hours. No user intervention or manual trigger required.'
  },
  {
    id: 5,
    title: 'Backup Retention Capacity',
    value: '90-Day Rolling Incremental Snapshots + 12 Monthly Full Baseline Archives',
    details: 'Automated disk pruning retains all hourly snapshots for 7 days, daily snapshots for 90 days, and month-end snapshots for 12 months with automatic FIFO sector reclaim.'
  },
  {
    id: 6,
    title: 'Backup Verification Method',
    value: 'Automated Dual-Pass: SHA-256 Hash Verification + Mount Integrity Test',
    details: 'Every backup job executes an immediate SHA-256 cryptographic checksum calculation, followed by a simulated mount check and SQLite/SQL PRAGMA integrity_check.'
  },
  {
    id: 7,
    title: 'Backup Failure Notification',
    value: 'Multi-Channel Local Alert: 85dB Chassis Buzzer + Red Front LED + UI Alert Banner',
    details: 'In the event of a write failure, checksum mismatch, or drive disconnection, the local server triggers an audible chime, visual LED beacon, screen pop-up, and local syslog alert.'
  },
  {
    id: 8,
    title: 'Database Restoration Procedure',
    value: '4-Step Point-in-Time GUI Recovery Wizard (Average Recovery Time: < 90 Seconds)',
    details: '1. Admin selects target snapshot from Backup HDD. 2. Cryptographic checksum re-verified. 3. Active database engine halted and snapshot restored to primary volume. 4. Service restarts and controller synchronization completes.'
  },
  {
    id: 9,
    title: 'Expected Recovery Following Primary HDD Failure',
    value: 'Complete Recovery in < 15 Minutes via Hot-Swap Drive Rebuild & Auto-Clone',
    details: 'Replace failed Primary HDD with new physical drive. System automatically boots into Recovery Console, formats new drive, restores latest verified snapshot from Backup HDD, and rebuilds live transaction log without data loss.'
  },
  {
    id: 10,
    title: 'Recommended Additional Backup HDD Capacity',
    value: '4.0 TB External Cold-Storage Drive for Weekly Off-Site Vault Rotation',
    details: 'Recommended 1x additional 4.0 TB external hot-swap drive (HDD C) rotated off-site weekly to satisfy physical disaster recovery and fire/flood isolation policies.'
  },
  {
    id: 11,
    title: 'Secondary Backup HDD Support',
    value: 'Fully Supported: Native Multi-Target Dual Backup (HDD B Local + HDD C Mirror)',
    details: 'The system natively supports concurrent or alternating replication to a Secondary Backup HDD (Drive C) via hot-swap bay or dedicated secondary SATA/SAS backplane.'
  }
];
