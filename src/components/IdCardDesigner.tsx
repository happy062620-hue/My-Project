import React, { useState, useRef } from 'react';
import { 
  Palette, 
  Printer, 
  Download, 
  RotateCw, 
  Upload, 
  Sparkles, 
  Check, 
  Eye, 
  Sliders, 
  FileCode, 
  HelpCircle,
  Shield,
  QrCode,
  Barcode,
  Layers
} from 'lucide-react';
import { Employee, RfidCard, CardTemplate } from '../types';
import { INITIAL_TEMPLATES } from '../data/initialData';
import { generateBarcodeSvgBars, generateQrMatrix } from '../utils/cardUtils';

interface IdCardDesignerProps {
  employees: Employee[];
  cards: RfidCard[];
  selectedEmployee: Employee | null;
  selectedCard: RfidCard | null;
  onSelectEmployee: (emp: Employee) => void;
}

export const IdCardDesigner: React.FC<IdCardDesignerProps> = ({
  employees,
  cards,
  selectedEmployee,
  selectedCard,
  onSelectEmployee
}) => {
  const [templates, setTemplates] = useState<CardTemplate[]>(INITIAL_TEMPLATES);
  const [currentTemplate, setCurrentTemplate] = useState<CardTemplate>(INITIAL_TEMPLATES[0]);
  const [cardSide, setCardSide] = useState<'front' | 'back'>('front');
  const [activeTab, setActiveTab] = useState<'studio' | 'specifications'>('studio');

  // Customizer state
  const [companyName, setCompanyName] = useState(currentTemplate.companyName);
  const [companySubtitle, setCompanySubtitle] = useState(currentTemplate.companySubtitle);
  const [headerBgColor, setHeaderBgColor] = useState(currentTemplate.headerBgColor);
  const [accentColor, setAccentColor] = useState(currentTemplate.accentColor);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(currentTemplate.orientation);
  const [showBarcode, setShowBarcode] = useState(currentTemplate.showBarcode);
  const [showQrCode, setShowQrCode] = useState(currentTemplate.showQrCode);
  const [showHologram, setShowHologram] = useState(currentTemplate.showSecurityHologram);
  const [showSignature, setShowSignature] = useState(currentTemplate.showSignatureLine);

  // Fallback employee and card if none selected
  const activeEmp = selectedEmployee || employees[0];
  const activeCard = selectedCard || cards.find(c => c.employeeId === activeEmp.id) || cards[0];

  const handleApplyTemplate = (tpl: CardTemplate) => {
    setCurrentTemplate(tpl);
    setCompanyName(tpl.companyName);
    setCompanySubtitle(tpl.companySubtitle);
    setHeaderBgColor(tpl.headerBgColor);
    setAccentColor(tpl.accentColor);
    setOrientation(tpl.orientation);
    setShowBarcode(tpl.showBarcode);
    setShowQrCode(tpl.showQrCode);
    setShowHologram(tpl.showSecurityHologram);
    setShowSignature(tpl.showSignatureLine);
  };

  const handlePrint = () => {
    window.print();
  };

  const qrMatrix = generateQrMatrix(`ID:${activeEmp.employeeNumber}|UID:${activeCard.cardUid}|DEPT:${activeEmp.department}`);
  const barcodeBars = generateBarcodeSvgBars(activeEmp.employeeNumber, 180, 28);

  return (
    <div className="space-y-6">
      {/* Top Banner & Sub-Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-sky-100 text-sky-800">
                Specification 2.15 C
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-emerald-100 text-emerald-800">
                CR80 Direct Print Engine
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              ID Card Layout & Design Software Studio
            </h2>
            <p className="text-sm text-slate-600">
              Interactive WYSIWYG card designer for official employee Department ID badges. Supports CR80 / CR79 dimensions, dual-sided layouts, barcodes, and direct thermal card printing.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="print-id-card-btn"
              onClick={handlePrint}
              className="px-4 py-2 bg-sky-600 text-white rounded-lg text-xs font-bold hover:bg-sky-700 flex items-center gap-2 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Badge (CR80)</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-5 border-b border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab('studio')}
            className={`pb-2.5 font-medium border-b-2 transition-colors ${
              activeTab === 'studio'
                ? 'border-sky-600 text-sky-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Visual Badge Studio & Preview
          </button>
          <button
            onClick={() => setActiveTab('specifications')}
            className={`pb-2.5 font-medium border-b-2 transition-colors ${
              activeTab === 'specifications'
                ? 'border-sky-600 text-sky-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Printer Hardware & Format Specifications (2.15 C)
          </button>
        </div>
      </div>

      {activeTab === 'studio' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: Live Customizer Controls (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Personnel Selector */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
              <label className="text-xs font-bold text-slate-800 block">
                Active Employee & Card Selection:
              </label>
              <select
                value={activeEmp.id}
                onChange={(e) => {
                  const emp = employees.find(x => x.id === e.target.value);
                  if (emp) onSelectEmployee(emp);
                }}
                className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
              >
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName} ({emp.employeeNumber} - {emp.department})
                  </option>
                ))}
              </select>
            </div>

            {/* Template Presets */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
              <label className="text-xs font-bold text-slate-800 block">
                Pre-Configured Department Templates:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {templates.map(tpl => (
                  <button
                    key={tpl.id}
                    onClick={() => handleApplyTemplate(tpl)}
                    className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                      currentTemplate.id === tpl.id
                        ? 'border-sky-600 bg-sky-50 text-sky-900 font-semibold ring-1 ring-sky-500'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="w-3 h-3 rounded-full mb-1" style={{ backgroundColor: tpl.headerBgColor }} />
                    <div className="truncate font-semibold">{tpl.name.split(' ')[0]}</div>
                    <div className="text-[10px] text-slate-500 capitalize">{tpl.orientation}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Layout Controls */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3 text-xs">
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-sky-600" />
                <span>Card Geometry & Color Attributes</span>
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Orientation:</label>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setOrientation('portrait')}
                      className={`flex-1 py-1.5 rounded border text-[11px] font-medium ${
                        orientation === 'portrait' ? 'bg-sky-600 text-white border-sky-600' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      Portrait
                    </button>
                    <button
                      onClick={() => setOrientation('landscape')}
                      className={`flex-1 py-1.5 rounded border text-[11px] font-medium ${
                        orientation === 'landscape' ? 'bg-sky-600 text-white border-sky-600' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      Landscape
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Badge Dimension:</label>
                  <div className="p-1.5 bg-slate-50 rounded border border-slate-200 text-[11px] font-mono font-medium text-slate-700">
                    CR80 (85.6 x 54 mm)
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Company / Facility Title:</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Department Header Subtitle:</label>
                <input
                  type="text"
                  value={companySubtitle}
                  onChange={(e) => setCompanySubtitle(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Header Background:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={headerBgColor}
                      onChange={(e) => setHeaderBgColor(e.target.value)}
                      className="w-8 h-8 rounded border cursor-pointer"
                    />
                    <span className="font-mono text-[11px] text-slate-600 uppercase">{headerBgColor}</span>
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Accent Line Color:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-8 h-8 rounded border cursor-pointer"
                    />
                    <span className="font-mono text-[11px] text-slate-600 uppercase">{accentColor}</span>
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-2 border-t border-slate-200 space-y-2">
                <label className="flex items-center justify-between text-[11px] text-slate-700 cursor-pointer">
                  <span>Show Code 128 Barcode</span>
                  <input
                    type="checkbox"
                    checked={showBarcode}
                    onChange={(e) => setShowBarcode(e.target.checked)}
                    className="rounded text-sky-600"
                  />
                </label>
                <label className="flex items-center justify-between text-[11px] text-slate-700 cursor-pointer">
                  <span>Show Encrypted QR Code Matrix</span>
                  <input
                    type="checkbox"
                    checked={showQrCode}
                    onChange={(e) => setShowQrCode(e.target.checked)}
                    className="rounded text-sky-600"
                  />
                </label>
                <label className="flex items-center justify-between text-[11px] text-slate-700 cursor-pointer">
                  <span>Show Security Holographic Seal Effect</span>
                  <input
                    type="checkbox"
                    checked={showHologram}
                    onChange={(e) => setShowHologram(e.target.checked)}
                    className="rounded text-sky-600"
                  />
                </label>
                <label className="flex items-center justify-between text-[11px] text-slate-700 cursor-pointer">
                  <span>Show Authorized Signatory Line</span>
                  <input
                    type="checkbox"
                    checked={showSignature}
                    onChange={(e) => setShowSignature(e.target.checked)}
                    className="rounded text-sky-600"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT: WYSIWYG Interactive Badge Preview (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-100 rounded-xl border border-slate-300 p-6 flex flex-col items-center justify-center min-h-[480px]">
              {/* Flip Card / Side Toggle Bar */}
              <div className="flex items-center gap-2 mb-6 bg-white p-1 rounded-lg border border-slate-200 shadow-xs">
                <button
                  onClick={() => setCardSide('front')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    cardSide === 'front'
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Front Face
                </button>
                <button
                  onClick={() => setCardSide('back')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    cardSide === 'back'
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Reverse Face
                </button>
                <button
                  onClick={() => setCardSide(cardSide === 'front' ? 'back' : 'front')}
                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md"
                  title="Flip Card"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* CARD CONTAINER (CR80 standard 85.6mm x 53.98mm approx 320x500px in portrait, 500x320px in landscape) */}
              <div
                id="printable-id-card"
                className={`bg-white rounded-xl shadow-xl overflow-hidden border border-slate-300 relative transition-all duration-300 select-none ${
                  orientation === 'portrait'
                    ? 'w-[300px] h-[475px]'
                    : 'w-[475px] h-[300px]'
                }`}
                style={{
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
                }}
              >
                {/* Security Holographic Overlay */}
                {showHologram && (
                  <div className="absolute inset-0 pointer-events-none opacity-20 bg-gradient-to-tr from-amber-400 via-pink-400 to-sky-400 mix-blend-color-dodge z-20"></div>
                )}

                {/* CARD FRONT FACE */}
                {cardSide === 'front' && (
                  <div className="h-full flex flex-col justify-between relative z-10 bg-white">
                    {/* Header Strip */}
                    <div
                      className="p-3 text-white text-center relative"
                      style={{ backgroundColor: headerBgColor }}
                    >
                      <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold tracking-wider uppercase">
                        <Shield className="w-3 h-3 text-sky-400" />
                        <span>{companyName}</span>
                      </div>
                      <div className="text-[8px] tracking-widest text-slate-300 font-mono mt-0.5 uppercase">
                        {companySubtitle}
                      </div>
                      {/* Accent Line */}
                      <div
                        className="absolute bottom-0 left-0 right-0 h-1"
                        style={{ backgroundColor: accentColor }}
                      />
                    </div>

                    {/* Middle Content */}
                    <div className="p-3 flex-1 flex flex-col items-center justify-center text-center">
                      {/* Photo Frame */}
                      <div className="relative mb-2">
                        <div
                          className="w-24 h-28 rounded-lg overflow-hidden border-2 p-0.5 shadow-sm bg-white"
                          style={{ borderColor: accentColor }}
                        >
                          <img
                            src={activeEmp.photoUrl}
                            alt={activeEmp.firstName}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>

                        {/* RFID Contactless Wave Symbol */}
                        <div
                          className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-white shadow border flex items-center justify-center"
                          title="Contactless RFID Smart Chip"
                        >
                          <span className="text-[10px] font-bold text-sky-700">)))</span>
                        </div>
                      </div>

                      {/* Name & Title */}
                      <h3 className="font-bold text-slate-900 text-sm tracking-tight">
                        {activeEmp.firstName} {activeEmp.lastName}
                      </h3>
                      <div className="text-[11px] font-semibold text-slate-600 mt-0.5">
                        {activeEmp.position}
                      </div>

                      {/* Department Badge */}
                      <div
                        className="mt-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider text-white"
                        style={{ backgroundColor: headerBgColor }}
                      >
                        {activeEmp.department}
                      </div>

                      {/* Employee ID & Card UID */}
                      <div className="mt-2 text-[10px] font-mono text-slate-500 space-y-0.5">
                        <div>ID: <strong className="text-slate-800">{activeEmp.employeeNumber}</strong></div>
                        <div className="text-[9px] text-slate-400">UID: {activeCard.cardUid}</div>
                      </div>

                      {/* Dynamic Barcode */}
                      {showBarcode && (
                        <div className="mt-2">
                          <svg width="160" height="24" className="mx-auto">
                            {barcodeBars.map((bar, idx) => (
                              <path key={idx} d={bar} stroke="#0f172a" strokeWidth="1.5" />
                            ))}
                          </svg>
                          <span className="font-mono text-[8px] text-slate-400 tracking-widest block">
                            *{activeEmp.employeeNumber}*
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Footer Strip */}
                    <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[9px] font-mono text-slate-500">
                      <span>EXP: {activeCard.expiresAt}</span>
                      <span className="font-bold text-slate-700">{activeCard.accessLevel.split(' ')[0]}</span>
                    </div>
                  </div>
                )}

                {/* CARD REVERSE FACE */}
                {cardSide === 'back' && (
                  <div className="h-full flex flex-col justify-between p-4 bg-slate-50 text-slate-800 text-xs relative z-10">
                    {/* Magnetic Stripe representation */}
                    <div className="-mx-4 -mt-4 h-9 bg-slate-900 mb-3" />

                    <div className="space-y-2">
                      <div className="text-[9px] text-slate-600 leading-relaxed">
                        {currentTemplate.backNotes}
                      </div>

                      <div className="p-2 bg-white rounded border border-slate-200 text-[9px] space-y-1">
                        <div className="flex justify-between font-mono">
                          <span>FACILITY CODE:</span>
                          <strong className="text-slate-900">{activeCard.facilityCode}</strong>
                        </div>
                        <div className="flex justify-between font-mono">
                          <span>CARD SERIAL:</span>
                          <strong className="text-slate-900">{activeCard.cardNumber}</strong>
                        </div>
                        <div className="flex justify-between font-mono">
                          <span>TECH STANDARD:</span>
                          <span className="text-slate-700">{activeCard.cardType.split(' ')[0]}</span>
                        </div>
                      </div>

                      {/* QR Code Matrix */}
                      {showQrCode && (
                        <div className="flex items-center justify-center p-2 bg-white rounded border border-slate-200">
                          <div className="grid grid-cols-21 gap-[1px] w-20 h-20 bg-white p-1">
                            {qrMatrix.map((row, rIdx) => 
                              row.map((cell, cIdx) => (
                                <div
                                  key={`${rIdx}-${cIdx}`}
                                  className={`w-full h-full ${cell ? 'bg-slate-950' : 'bg-transparent'}`}
                                />
                              ))
                            )}
                          </div>
                        </div>
                      )}

                      {/* Authorized Signature Line */}
                      {showSignature && (
                        <div className="pt-1">
                          <div className="h-6 border-b border-dashed border-slate-400 flex items-end">
                            <span className="text-[8px] font-mono text-slate-400 italic">
                              Elena Rostova (Authorized Cryptographic Officer)
                            </span>
                          </div>
                          <span className="text-[7px] uppercase font-bold text-slate-400 block mt-0.5">
                            Authorized Security Signatory
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex justify-between text-[8px] font-mono text-slate-400">
                      <span>SECURE LOCAL SYSTEM</span>
                      <span>100% AIR-GAPPED</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Dimensions tag */}
              <div className="mt-4 text-xs text-slate-500 font-mono flex items-center gap-2">
                <span>ISO/IEC 7810 ID-1 Standard (85.60 × 53.98 × 0.76 mm)</span>
                <span>• 300 DPI</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: SPECIFICATIONS (SECTION 2.15 C) */}
      {activeTab === 'specifications' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileCode className="w-5 h-5 text-sky-600" />
            <span>Section 2.15 C ID Card Layout & Design Software Specifications</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
              <h4 className="font-bold text-slate-800 text-sm">Printing & Dimensions Compliance</h4>
              <ul className="space-y-1.5">
                <li className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="font-semibold">Supported Card Dimensions:</span>
                  <span>CR80 (85.60 x 53.98 mm) & CR79 (83.90 x 51.00 mm)</span>
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="font-semibold">Supported ID Card Printers:</span>
                  <span>Zebra ZC300/ZXP, Fargo HDP5000, Evolis Primacy, Magicard 300</span>
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="font-semibold">Print Method:</span>
                  <span>Direct-to-Card Dye Sublimation & Reverse Thermal Re-transfer</span>
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="font-semibold">Image & Photo Formats:</span>
                  <span>PNG (with alpha), JPEG, WebP, SVG vector logos</span>
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="font-semibold">Barcode Capabilities:</span>
                  <span>Code 128, Code 39, Interleaved 2 of 5, EAN-13</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
              <h4 className="font-bold text-slate-800 text-sm">Database & Template Management</h4>
              <ul className="space-y-1.5">
                <li className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="font-semibold">Database Integration:</span>
                  <span>Native 2-way sync with Employee & Card tables on Primary HDD</span>
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="font-semibold">Number of Templates:</span>
                  <span>Unlimited custom layouts stored in SQLite database</span>
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="font-semibold">Template Backup & Restore:</span>
                  <span>Automatically included in Backup HDD snapshots</span>
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="font-semibold">Multi-Admin Support:</span>
                  <span>Concurrent browser-based design access with role-based restrictions</span>
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="font-semibold">Offline Operation:</span>
                  <span className="text-emerald-700 font-bold">100% Local / Zero Cloud Dependency</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
