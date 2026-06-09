import React, { useState } from 'react';
import { FileText, Download, RefreshCw, CheckCircle } from 'lucide-react';

const REPORTS = [
  { id: 'village',   label: 'Village Report',        desc: 'All villages with population, water status, risk level', color: 'from-blue-500 to-blue-700' },
  { id: 'family',    label: 'Family Report',          desc: 'All registered families with household details', color: 'from-teal-500 to-teal-700' },
  { id: 'health',    label: 'Health Summary Report',  desc: 'BP readings, blood sugar, chronic diseases', color: 'from-green-500 to-green-700' },
  { id: 'vhw',       label: 'VHW Performance Report', desc: 'Village Health Worker visits, attendance, coverage', color: 'from-purple-500 to-purple-700' },
  { id: 'attendance','label': 'Attendance Report',   desc: 'VHW attendance, check-in/out logs', color: 'from-amber-500 to-amber-700' },
  { id: 'training',  label: 'Training Report',        desc: 'All trainings, venues, attendance, evidence', color: 'from-rose-500 to-rose-700' },
  { id: 'beneficiary','label':'Beneficiary Support',  desc: 'Support distributions, amounts, beneficiary details', color: 'from-cyan-500 to-cyan-700' },
];

export default function ReportsPanel({ state }) {
  const [selected, setSelected]   = useState(null);
  const [exporting, setExporting] = useState(null);
  const [exported, setExported]   = useState(null);

  const handleExport = async (reportId, format) => {
    setExporting(`${reportId}-${format}`);
    // Simulate export delay
    await new Promise(r => setTimeout(r, 1500));
    setExporting(null);
    setExported(`${reportId}-${format}`);
    setTimeout(() => setExported(null), 3000);

    // In production: call API endpoint /api/v1/admin/reports/export?type={reportId}&format={format}
    // and handle the file download response
    console.log(`[Reports] Export requested: type=${reportId} format=${format}`);
  };

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-black text-[var(--text-primary)]">Reports & Export</h3>
          <p className="text-xs text-[var(--text-secondary)]">Generate reports in PDF, Excel, or CSV format</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
          <FileText className="w-4 h-4" />
          {REPORTS.length} report types available
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {REPORTS.map(r => {
          const isSelected = selected === r.id;
          return (
            <div
              key={r.id}
              className={`bg-[var(--bg-card)] border rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer ${
                isSelected ? 'border-blue-500 shadow-lg shadow-blue-500/10' : 'border-[var(--border-color)] hover:border-blue-300'
              }`}
              onClick={() => setSelected(isSelected ? null : r.id)}
            >
              {/* Gradient bar */}
              <div className={`h-1 bg-gradient-to-r ${r.color}`} />
              <div className="p-4">
                <h4 className="text-sm font-bold text-[var(--text-primary)] mb-1">{r.label}</h4>
                <p className="text-xs text-[var(--text-secondary)] mb-4">{r.desc}</p>

                {/* Export buttons */}
                <div className="flex gap-2">
                  {['PDF', 'Excel', 'CSV'].map(fmt => {
                    const key = `${r.id}-${fmt}`;
                    const isExporting = exporting === key;
                    const isDone      = exported === key;
                    return (
                      <button
                        key={fmt}
                        id={`export-${r.id}-${fmt.toLowerCase()}`}
                        onClick={e => { e.stopPropagation(); handleExport(r.id, fmt.toLowerCase()); }}
                        disabled={!!exporting}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                          isDone
                            ? 'bg-emerald-100 text-emerald-700'
                            : fmt === 'PDF'
                              ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                              : fmt === 'Excel'
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        } disabled:opacity-60 disabled:cursor-not-allowed`}
                      >
                        {isExporting ? (
                          <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : isDone ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <Download className="w-3 h-3" />
                        )}
                        {isDone ? 'Done!' : fmt}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-xs text-[var(--text-secondary)]">
        <span className="font-bold text-[var(--text-primary)]">Note: </span>
        PDF exports use server-side rendering (DomPDF) for professional formatting.
        Excel/CSV exports include all current data with proper column headers.
        Large reports may take a few seconds to generate.
      </div>

    </div>
  );
}
