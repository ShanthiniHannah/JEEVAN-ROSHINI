import React from 'react';
import { Heart, AlertTriangle, Save } from 'lucide-react';

/**
 * IndividualForm — Form for registering a patient screening record.
 * Follows VHW rules: inputs text-base (16px), buttons h-12 (48px).
 */
export default function IndividualForm({
  individualForm,
  setIndividualForm,
  visibleFamilies,
  handleToggleDisease,
  liveRiskAlerts,
  handleAddIndividual
}) {
  return (
    <div className="bg-slate-900/60 p-4 border border-slate-800 rounded-2xl space-y-4">
      <div className="flex justify-between items-center pb-2 border-b border-slate-800">
        <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
          Patient Health Card
        </h3>
      </div>

      <form onSubmit={handleAddIndividual} className="space-y-4">
        {/* Select Family Unit */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Select Family Unit</label>
          <select 
            value={individualForm.familyId}
            onChange={(e) => setIndividualForm({ ...individualForm, familyId: e.target.value })}
            required
            className="w-full h-12 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-base text-white focus:outline-none focus:border-[#0ea5e9]"
          >
            <option value="" className="bg-slate-950">-- Choose Family --</option>
            {visibleFamilies.map(f => (
              <option key={f.id} value={f.id} className="bg-slate-950">
                {f.id} ({f.village?.name || f.village_id || f.villageName || '—'})
              </option>
            ))}
          </select>
        </div>

        {/* Patient Name */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Patient Full Name</label>
          <input 
            type="text" 
            value={individualForm.name}
            onChange={(e) => setIndividualForm({ ...individualForm, name: e.target.value })}
            placeholder="Full Name"
            required
            className="w-full h-12 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-base text-white focus:outline-none focus:border-[#0ea5e9] placeholder:text-slate-600"
          />
        </div>

        {/* Age / Gender / Blood Group Grid */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Age (Y)</label>
            <input 
              type="number" 
              value={individualForm.age}
              onChange={(e) => setIndividualForm({ ...individualForm, age: e.target.value })}
              placeholder="Age"
              required
              className="w-full h-12 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-base text-white focus:outline-none focus:border-[#0ea5e9] placeholder:text-slate-600"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Gender</label>
            <select 
              value={individualForm.gender}
              onChange={(e) => setIndividualForm({ ...individualForm, gender: e.target.value })}
              className="w-full h-12 bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-base text-white focus:outline-none focus:border-[#0ea5e9]"
            >
              <option value="Female" className="bg-slate-950">Female</option>
              <option value="Male" className="bg-slate-950">Male</option>
              <option value="Other" className="bg-slate-950">Other</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-455 tracking-wider">Blood</label>
            <select 
              value={individualForm.bloodGroup}
              onChange={(e) => setIndividualForm({ ...individualForm, bloodGroup: e.target.value })}
              className="w-full h-12 bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-base text-white focus:outline-none focus:border-[#0ea5e9]"
            >
              <option value="A+" className="bg-slate-950">A+</option>
              <option value="A-" className="bg-slate-950">A-</option>
              <option value="B+" className="bg-slate-950">B+</option>
              <option value="O+" className="bg-slate-950">O+</option>
              <option value="AB+" className="bg-slate-950">AB+</option>
              <option value="Invalid" className="bg-slate-950">Z- (Invalid)</option>
            </select>
          </div>
        </div>

        {/* Mobile Number */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Mobile Number</label>
          <input 
            type="text" 
            value={individualForm.phone}
            onChange={(e) => setIndividualForm({ ...individualForm, phone: e.target.value })}
            placeholder="e.g. 9886012948"
            className="w-full h-12 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-base text-white focus:outline-none focus:border-[#0ea5e9] placeholder:text-slate-600"
          />
        </div>

        {/* Conditional Geriatric / Pregnancy Fields */}
        {individualForm.gender === 'Female' && (
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Pregnancy Status</label>
            <select 
              value={individualForm.pregnancyStatus}
              onChange={(e) => setIndividualForm({ ...individualForm, pregnancyStatus: e.target.value })}
              className="w-full h-12 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-base text-white focus:outline-none focus:border-[#0ea5e9]"
            >
              <option value="No" className="bg-slate-950">No</option>
              <option value="Yes" className="bg-slate-950">Yes (Pregnant)</option>
            </select>
          </div>
        )}

        {parseInt(individualForm.age) <= 5 && (
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-455 tracking-wider">Child Malnutrition</label>
            <select 
              value={individualForm.malnutritionStatus}
              onChange={(e) => setIndividualForm({ ...individualForm, malnutritionStatus: e.target.value })}
              className="w-full h-12 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-base text-white focus:outline-none focus:border-[#0ea5e9]"
            >
              <option value="none" className="bg-slate-950">Normal</option>
              <option value="moderate" className="bg-slate-950">MAM</option>
              <option value="severe" className="bg-slate-950">SAM</option>
            </select>
          </div>
        )}

        {parseInt(individualForm.age) >= 65 && (
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-455 tracking-wider">Geriatric: Lives Alone?</label>
            <select 
              value={individualForm.livingAlone}
              onChange={(e) => setIndividualForm({ ...individualForm, livingAlone: e.target.value })}
              className="w-full h-12 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-base text-white focus:outline-none focus:border-[#0ea5e9]"
            >
              <option value="no" className="bg-slate-950">No (With Family)</option>
              <option value="yes" className="bg-slate-950">Yes (Lives Alone)</option>
            </select>
          </div>
        )}

        {/* Disability / Vaccination Row */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Disability Status</label>
            <select 
              value={individualForm.disabilityStatus}
              onChange={(e) => setIndividualForm({ ...individualForm, disabilityStatus: e.target.value })}
              className="w-full h-12 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-base text-white focus:outline-none focus:border-[#0ea5e9]"
            >
              <option value="No" className="bg-slate-950">No</option>
              <option value="Yes" className="bg-slate-950">Yes</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Vaccination</label>
            <select 
              value={individualForm.vaccinationStatus}
              onChange={(e) => setIndividualForm({ ...individualForm, vaccinationStatus: e.target.value })}
              className="w-full h-12 bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-base text-white focus:outline-none focus:border-[#0ea5e9]"
            >
              <option value="Full" className="bg-slate-950">Fully Vaccinated</option>
              <option value="Partial" className="bg-slate-950">Partially Vaccinated</option>
              <option value="None" className="bg-slate-950">Unvaccinated</option>
            </select>
          </div>
        </div>

        {/* Chronic Disease Screen */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Chronic Disease Screening</label>
          <div className="grid grid-cols-2 gap-2.5 p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold">
            {['Diabetes', 'Hypertension', 'Tuberculosis', 'Cancer Risk', 'Asthma'].map(disease => (
              <label key={disease} className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input 
                  type="checkbox" 
                  checked={individualForm.chronicDiseases.includes(disease)}
                  onChange={() => handleToggleDisease(disease)}
                  className="w-4 h-4 rounded text-rose-500 focus:ring-rose-500 bg-slate-900 border-slate-800 cursor-pointer"
                />
                <span>{disease}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Consent management */}
        <div className="bg-indigo-950/20 border border-indigo-900/30 p-3.5 rounded-xl space-y-2">
          <div className="flex items-center gap-2.5">
            <input 
              type="checkbox" 
              id="consent"
              checked={individualForm.consentGiven}
              onChange={(e) => setIndividualForm({ ...individualForm, consentGiven: e.target.checked })}
              className="w-4 h-4 rounded text-indigo-500 focus:ring-indigo-500 bg-slate-950 border-slate-850 cursor-pointer"
            />
            <label htmlFor="consent" className="text-xs font-bold text-indigo-200 cursor-pointer select-none">
              Consent Captured for Records
            </label>
          </div>
          {individualForm.consentGiven && (
            <div className="animate-fadeIn space-y-1">
              <label className="text-[8.5px] font-extrabold uppercase text-indigo-400 tracking-wider">Verification Signature Method</label>
              <select
                value={individualForm.consentMethod}
                onChange={(e) => setIndividualForm({ ...individualForm, consentMethod: e.target.value })}
                className="w-full h-10 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white"
              >
                <option value="Thumbprint" className="bg-slate-950">Biometric Thumbprint Impression</option>
                <option value="Written Signature" className="bg-slate-950">Signed Consent Form PDF</option>
                <option value="Verbal on Audio" className="bg-slate-950">Verbal Consent Audio Rec</option>
              </select>
            </div>
          )}
        </div>

        {/* Risk warning panel */}
        {liveRiskAlerts.length > 0 && (
          <div className="bg-rose-500/10 border border-rose-500/25 p-3 rounded-xl space-y-1.5 animate-fadeIn">
            <p className="text-[10px] font-black text-rose-455 flex items-center gap-1 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              Identified Risk Indicators:
            </p>
            {liveRiskAlerts.map((al, idx) => (
              <div key={idx} className="text-[10px] text-rose-300 pl-2.5 border-l border-rose-500/60 font-medium">
                <strong>{al.type}</strong>: {al.reason}
              </div>
            ))}
          </div>
        )}

        <button 
          type="submit" 
          className="w-full h-12 bg-gradient-to-r from-rose-600 to-pink-700 hover:from-rose-700 hover:to-pink-800 text-white font-black rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-rose-900/10 transition duration-200"
        >
          <Save className="w-4 h-4" />
          Register Patient Card
        </button>
      </form>
    </div>
  );
}
