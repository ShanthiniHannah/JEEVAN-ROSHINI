import React from 'react';
import { Heart, AlertTriangle, Save } from 'lucide-react';

export default function IndividualForm({
  individualForm,
  setIndividualForm,
  visibleFamilies,
  handleToggleDisease,
  liveRiskAlerts,
  handleAddIndividual
}) {
  return (
    <div className="bg-slate-800/40 p-4 border border-slate-700/60 rounded-2xl">
      <h3 className="text-xs font-black text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
        <Heart className="w-4 h-4 text-rose-400" />
        Patient Health Card
      </h3>

      <form onSubmit={handleAddIndividual} className="space-y-3">
        <div>
          <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Select Family Unit</label>
          <select 
            value={individualForm.familyId}
            onChange={(e) => setIndividualForm({ ...individualForm, familyId: e.target.value })}
            required
            className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2.5 py-2 text-xs text-white mt-1 focus:outline-none"
          >
            <option value="">-- Choose Family --</option>
            {visibleFamilies.map(f => (
              <option key={f.id} value={f.id}>{f.id} ({f.village?.name || f.village_id || f.villageName || '—'})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Patient Full Name</label>
          <input 
            type="text" 
            value={individualForm.name}
            onChange={(e) => setIndividualForm({ ...individualForm, name: e.target.value })}
            placeholder="Full Name"
            required
            className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none mt-1"
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Age (Y)</label>
            <input 
              type="number" 
              value={individualForm.age}
              onChange={(e) => setIndividualForm({ ...individualForm, age: e.target.value })}
              placeholder="Age"
              required
              className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2 py-2 text-xs text-white focus:outline-none mt-1"
            />
          </div>
          <div>
            <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Gender</label>
            <select 
              value={individualForm.gender}
              onChange={(e) => setIndividualForm({ ...individualForm, gender: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-1.5 py-2 text-xs text-white mt-1 focus:outline-none"
            >
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Blood Group</label>
            <select 
              value={individualForm.bloodGroup}
              onChange={(e) => setIndividualForm({ ...individualForm, bloodGroup: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-1.5 py-2 text-xs text-white mt-1 focus:outline-none"
            >
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="O+">O+</option>
              <option value="AB+">AB+</option>
              <option value="Invalid">Z- (Test Invalid)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Mobile Number</label>
          <input 
            type="text" 
            value={individualForm.phone}
            onChange={(e) => setIndividualForm({ ...individualForm, phone: e.target.value })}
            placeholder="e.g. 9886012948"
            className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none mt-1"
          />
        </div>

        {individualForm.gender === 'Female' && (
          <div>
            <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Pregnancy Status</label>
            <select 
              value={individualForm.pregnancyStatus}
              onChange={(e) => setIndividualForm({ ...individualForm, pregnancyStatus: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2 py-2 text-xs text-white mt-1 focus:outline-none"
            >
              <option value="No">No</option>
              <option value="Yes">Yes (Pregnant)</option>
            </select>
          </div>
        )}

        {parseInt(individualForm.age) <= 5 && (
          <div>
            <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Child Malnutrition</label>
            <select 
              value={individualForm.malnutritionStatus}
              onChange={(e) => setIndividualForm({ ...individualForm, malnutritionStatus: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2 py-2 text-xs text-white mt-1 focus:outline-none"
            >
              <option value="none">Normal</option>
              <option value="moderate">MAM</option>
              <option value="severe">SAM</option>
            </select>
          </div>
        )}

        {parseInt(individualForm.age) >= 65 && (
          <div>
            <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Geriatric: Lives Alone?</label>
            <select 
              value={individualForm.livingAlone}
              onChange={(e) => setIndividualForm({ ...individualForm, livingAlone: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2 py-2 text-xs text-white mt-1 focus:outline-none"
            >
              <option value="no">No (With family)</option>
              <option value="yes">Yes (Lives alone)</option>
            </select>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Disability Status</label>
            <select 
              value={individualForm.disabilityStatus}
              onChange={(e) => setIndividualForm({ ...individualForm, disabilityStatus: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2 py-2 text-xs text-white mt-1 focus:outline-none"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          <div>
            <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Vaccination</label>
            <select 
              value={individualForm.vaccinationStatus}
              onChange={(e) => setIndividualForm({ ...individualForm, vaccinationStatus: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2 py-2 text-xs text-white mt-1 focus:outline-none"
            >
              <option value="Full">Fully Vaccinated</option>
              <option value="Partial">Partially Vaccinated</option>
              <option value="None">Unvaccinated</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Chronic Disease Screening</label>
          <div className="grid grid-cols-2 gap-1.5 mt-1 bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-[10px]">
            {['Diabetes', 'Hypertension', 'Tuberculosis', 'Cancer Risk', 'Asthma'].map(disease => (
              <label key={disease} className="flex items-center gap-1.5 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={individualForm.chronicDiseases.includes(disease)}
                  onChange={() => handleToggleDisease(disease)}
                  className="rounded text-rose-500 focus:ring-rose-500 bg-slate-800 border-slate-700"
                />
                <span>{disease}</span>
              </label>
            ))}
          </div>
        </div>

        {/* ── CONSENT MANAGEMENT ── */}
        <div className="bg-indigo-950/20 border border-indigo-900/40 p-3 rounded-xl space-y-2">
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="consent"
              checked={individualForm.consentGiven}
              onChange={(e) => setIndividualForm({ ...individualForm, consentGiven: e.target.checked })}
              className="rounded text-indigo-500 focus:ring-indigo-500 bg-slate-900 border-slate-850"
            />
            <label htmlFor="consent" className="text-[10px] font-bold text-indigo-200 cursor-pointer">Consent Given for Health Records?</label>
          </div>
          {individualForm.consentGiven && (
            <div className="animate-fadeIn">
              <label className="text-[8.5px] font-extrabold uppercase text-indigo-400 tracking-wider">Verification Signature Method</label>
              <select
                value={individualForm.consentMethod}
                onChange={(e) => setIndividualForm({ ...individualForm, consentMethod: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[10px] text-white mt-1"
              >
                <option value="Thumbprint">Biometric Thumbprint Impression</option>
                <option value="Written Signature">Signed Consent Form PDF</option>
                <option value="Verbal on Audio">Verbal Consent Audio Rec</option>
              </select>
            </div>
          )}
        </div>

        {/* Live Risk warnings */}
        {liveRiskAlerts.length > 0 && (
          <div className="bg-rose-500/10 border border-rose-500/30 p-2.5 rounded-xl">
            <p className="text-[9px] font-bold text-rose-400 flex items-center gap-1 uppercase tracking-wider">
              <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
              Auto-Identified Risk Alerts:
            </p>
            {liveRiskAlerts.map((al, idx) => (
              <div key={idx} className="text-[9px] text-rose-300 mt-1 pl-1 border-l border-rose-500">
                <strong>{al.type}</strong>: {al.reason}
              </div>
            ))}
          </div>
        )}

        <button 
          type="submit" 
          className="w-full mt-1 bg-gradient-to-r from-rose-600 to-pink-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition flex items-center justify-center gap-1.5 active:scale-[0.99] shadow-lg"
        >
          <Save className="w-3.5 h-3.5" />
          Register Screening
        </button>
      </form>
    </div>
  );
}
