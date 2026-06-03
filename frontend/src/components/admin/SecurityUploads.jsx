import React from 'react';
import { FileText, Plus, X } from 'lucide-react';

export default function SecurityUploads({
  isUploading,
  uploadLogs,
  uploadErrors,
  handleDocUploadSimulate,
  setUploadErrors
}) {
  return (
    <div className="space-y-6 text-xs">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl">
        <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-indigo-500" />
          Encrypted Document &amp; Patient Consent Form Vault
        </h3>
        <p className="text-[10.5px] text-[var(--text-secondary)] mb-4">Validate signature compliance and upload paper consent forms securely. Audited automatically by central vault engines.</p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-[var(--bg-inner)] p-4 border border-[var(--border-color)] rounded-xl">
          <div className="text-center sm:text-left">
            <h4 className="font-bold text-[var(--text-primary)]">Consent Forms Scanner Pipeline</h4>
            <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">Supports PDF scan bundles up to 10MB.</p>
          </div>
          <button
            onClick={handleDocUploadSimulate}
            disabled={isUploading}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
              isUploading
                ? 'bg-[var(--bg-inner)] text-[var(--text-secondary)] cursor-not-allowed border border-[var(--border-color)]'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer active:scale-97 shadow-lg'
            }`}
          >
            <Plus className="w-4 h-4" /> {isUploading ? 'Decrypting Scanner Bundle...' : 'Simulate Scanner Upload'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SCANNER LOGS */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl space-y-3">
          <h4 className="font-bold text-[var(--text-primary)] uppercase tracking-wider text-[10px] border-b border-[var(--border-color)] pb-2 flex justify-between items-center">
            <span>Scanner Pipeline logs</span>
            <span className="font-mono text-cyan-500 dark:text-cyan-400 uppercase tracking-widest text-[8px] bg-[var(--bg-inner)] px-1.5 py-0.5 rounded border border-[var(--border-color)]">Vault Stream</span>
          </h4>
          <div className="bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl p-3.5 font-mono text-[9.5px] text-[var(--text-secondary)] space-y-1.5 max-h-52 overflow-y-auto">
            {uploadLogs.map((log, idx) => (
              <p key={idx} className={log.includes('[Success]') ? 'text-emerald-500 dark:text-emerald-400' : 'text-[var(--text-secondary)]'}>{log}</p>
            ))}
            {uploadLogs.length === 0 && <p className="text-[var(--text-secondary)] italic">Vault is idle. Ready to decrypt bundles.</p>}
          </div>
        </div>

        {/* ERROR BANNERS */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl space-y-3">
          <h4 className="font-bold text-[var(--text-primary)] uppercase tracking-wider text-[10px] border-b border-[var(--border-color)] pb-2 flex justify-between items-center">
            <span>Signature Compliance Exceptions ({uploadErrors.length})</span>
            {uploadErrors.length > 0 && (
              <button
                onClick={() => setUploadErrors([])}
                className="text-[8px] text-rose-500 uppercase underline font-bold cursor-pointer"
              >
                Clear Warnings
              </button>
            )}
          </h4>
          <div className="space-y-2 max-h-52 overflow-y-auto">
            {uploadErrors.map((err, idx) => (
              <div key={idx} className="bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-400 p-3 rounded-xl flex justify-between items-start">
                <p className="text-[10px] leading-relaxed flex-1"><strong className="text-rose-500">Exception:</strong> {err}</p>
                <button onClick={() => setUploadErrors(prev => prev.filter((_, i) => i !== idx))} className="text-rose-500 hover:text-rose-400 ml-2 cursor-pointer"><X className="w-3.5 h-3.5" /></button>
              </div>
            ))}
            {uploadErrors.length === 0 && <p className="text-[var(--text-secondary)] italic p-4 text-center">No compliance violations in current stream.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
