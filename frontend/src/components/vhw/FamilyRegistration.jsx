import React, { useState } from 'react';
import { 
  Home, Users, CheckCircle2, ChevronRight, ChevronLeft, Plus, Trash2, 
  Heart, AlertTriangle, ShieldCheck, UserCheck, Calendar, Activity 
} from 'lucide-react';
import { api } from '../../services/apiClient';

const STEPS = [
  { id: 1, label: 'Village', icon: MapCircleIcon },
  { id: 2, label: 'House Details', icon: Home },
  { id: 3, label: 'Family Head', icon: UserCheck },
  { id: 4, label: 'Members', icon: Users },
  { id: 5, label: 'Vaccinations', icon: ShieldCheck },
  { id: 6, label: 'Pregnancy/ANC', icon: Heart },
  { id: 7, label: 'BMI Screening', icon: Activity },
  { id: 8, label: 'Review & Submit', icon: CheckCircle2 },
];

function MapCircleIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

export default function FamilyRegistration({ 
  visibleVillages, 
  isOnline, 
  setOfflineQueue, 
  setState,
  notify, 
  notifyError,
  setActiveSubTab 
}) {
  const [currentStep, setCurrentStep] = useState(1);

  // Unified Registration State
  const [formData, setFormData] = useState({
    village_id: '',
    house_no: '',
    rooms: '1',
    electricity: true,
    cooking_source: 'LPG',
    toilet_availability: 'Yes',
    water_source: 'Tap',
    economic_status: 'BPL',
    occupation: '',
    address: '',
    head: {
      name: '',
      age: '',
      gender: 'Female',
      mobile_number: '',
      blood_group: 'O+',
      marital_status: 'Married',
      education: 'Primary',
      occupation: 'Farmer',
      income_per_month: '',
      resident_status: 'Permanent',
      vaccinations: {},
      pregnancy: null,
      bmi: { height_cm: '', weight_kg: '', remarks: '' },
      chronic_diseases: []
    },
    members: []
  });

  // Helper state for adding members dynamically
  const [newMember, setNewMember] = useState({
    name: '',
    age: '',
    gender: 'Female',
    relationship: 'Spouse',
    mobile_number: '',
    blood_group: 'O+',
    marital_status: 'Married',
    education: 'Primary',
    occupation: 'Farmer',
    income_per_month: '',
    resident_status: 'Permanent',
    vaccinations: {},
    pregnancy: null,
    bmi: { height_cm: '', weight_kg: '', remarks: '' },
    chronic_diseases: []
  });

  // Step Navigations
  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 8));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const validateCurrentStep = () => {
    if (currentStep === 1 && !formData.village_id) {
      notifyError('Please select a village to proceed.');
      return false;
    }
    if (currentStep === 2 && !formData.house_no) {
      notifyError('Please enter a House Number.');
      return false;
    }
    if (currentStep === 3) {
      if (!formData.head.name || !formData.head.age) {
        notifyError('Please fill in the Family Head Name and Age.');
        return false;
      }
      if (formData.head.gender === 'Male' && formData.head.pregnancy) {
        notifyError('Maternal tracking is only applicable to female members.');
        return false;
      }
    }
    return true;
  };

  // Handle Head and Member Fields
  const updateHead = (fields) => {
    setFormData(prev => ({
      ...prev,
      head: { ...prev.head, ...fields }
    }));
  };

  const updateMember = (index, fields) => {
    setFormData(prev => {
      const updated = [...prev.members];
      updated[index] = { ...updated[index], ...fields };
      return { ...prev, members: updated };
    });
  };

  const addMember = () => {
    if (!newMember.name || !newMember.age) {
      notifyError('Please enter member Name and Age.');
      return;
    }
    setFormData(prev => ({
      ...prev,
      members: [...prev.members, { ...newMember }]
    }));
    setNewMember({
      name: '',
      age: '',
      gender: 'Female',
      relationship: 'Son',
      mobile_number: '',
      blood_group: 'O+',
      marital_status: 'Single',
      education: 'Primary',
      occupation: 'Student',
      income_per_month: '',
      resident_status: 'Permanent',
      vaccinations: {},
      pregnancy: null,
      bmi: { height_cm: '', weight_kg: '', remarks: '' },
      chronic_diseases: []
    });
  };

  const removeMember = (index) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.filter((_, idx) => idx !== index)
    }));
  };

  // BMI Classification Helper
  const getBmiCategory = (height, weight) => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!h || !w || h <= 0) return '—';
    const bmiVal = w / Math.pow(h / 100, 2);
    if (bmiVal < 18.5) return 'Underweight';
    if (bmiVal < 25.0) return 'Normal';
    if (bmiVal < 30.0) return 'Overweight';
    return 'Obese';
  };

  // Submit final payload
  const handleSubmit = async () => {
    const payload = { ...formData };
    
    // Clean up empty objects / optional fields before submit
    if (payload.head.pregnancy && payload.head.gender !== 'Female') {
      payload.head.pregnancy = null;
    }
    payload.members = payload.members.map(m => {
      if (m.pregnancy && m.gender !== 'Female') {
        return { ...m, pregnancy: null };
      }
      return m;
    });

    if (isOnline) {
      try {
        const res = await api.post('/families/register', payload);
        if (res.data && res.data.success) {
          notify(`Successfully registered family: ${res.data.family_code}`);
          
          // Refresh local state lists
          const [fRes, iRes] = await Promise.all([
            api.get('/families'),
            api.get('/individuals')
          ]);
          setState(prev => ({
            ...prev,
            families: fRes.data.data || fRes.data || [],
            individuals: iRes.data.data || iRes.data || []
          }));

          setActiveSubTab('home');
        }
      } catch (err) {
        notifyError(err.response?.data?.message || 'Failed to submit registration.');
      }
    } else {
      // Queue offline
      setOfflineQueue(prev => [...prev, { type: 'family_registration', data: payload }]);
      notify('Offline Mode: Registration saved to sync queue.');
      setActiveSubTab('home');
    }
  };

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-sm space-y-6 animate-fadeIn">
      {/* Steps Progress Indicator */}
      <div className="flex justify-between items-center overflow-x-auto pb-3 border-b border-[var(--border-color)] scrollbar-hide">
        {STEPS.map((s, idx) => {
          const StepIcon = s.icon;
          const isActive = currentStep === s.id;
          const isCompleted = currentStep > s.id;
          return (
            <div key={s.id} className="flex items-center shrink-0">
              <div className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition ${
                isActive 
                  ? 'bg-brand-500/10 text-brand-500 font-bold' 
                  : isCompleted 
                    ? 'text-emerald-500 font-medium' 
                    : 'text-[var(--text-secondary)] opacity-60'
              }`}>
                <StepIcon className="w-4 h-4" />
                <span className="text-[9px] uppercase tracking-wider">{s.label}</span>
              </div>
              {idx < STEPS.length - 1 && (
                <ChevronRight className="w-3 h-3 text-[var(--text-secondary)] mx-1 opacity-50 shrink-0" />
              )}
            </div>
          );
        })}
      </div>

      {/* STEP 1: SELECT VILLAGE */}
      {currentStep === 1 && (
        <div className="space-y-4 max-w-md mx-auto py-4">
          <div className="text-center space-y-1">
            <h3 className="text-sm font-black text-[var(--text-primary)]">Select Program Village</h3>
            <p className="text-[11px] text-[var(--text-secondary)]">Begin by linking this household to an authorized program village.</p>
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-wider">Select Village</label>
            <select
              value={formData.village_id}
              onChange={e => setFormData({ ...formData, village_id: e.target.value })}
              className="w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl px-3 py-2.5 text-[var(--text-primary)] text-xs focus:outline-none focus:border-brand-500"
            >
              <option value="">Select Village</option>
              {visibleVillages.map(v => (
                <option key={v.id} value={v.id}>{v.name} (ID: {v.id})</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* STEP 2: HOUSE DETAILS */}
      {currentStep === 2 && (
        <div className="space-y-4 max-w-lg mx-auto py-2">
          <div className="text-center space-y-1">
            <h3 className="text-sm font-black text-[var(--text-primary)]">Household Infrastructure</h3>
            <p className="text-[11px] text-[var(--text-secondary)]">Document physical characteristics and living conditions.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-wider">House Number *</label>
              <input
                type="text"
                placeholder="e.g. H-42"
                value={formData.house_no}
                onChange={e => setFormData({ ...formData, house_no: e.target.value })}
                className="w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)] text-xs focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-wider">Rooms Count</label>
              <input
                type="number"
                min="1"
                value={formData.rooms}
                onChange={e => setFormData({ ...formData, rooms: e.target.value })}
                className="w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)] text-xs focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-wider">Drinking Water Source</label>
              <select
                value={formData.water_source}
                onChange={e => setFormData({ ...formData, water_source: e.target.value })}
                className="w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)] text-xs focus:outline-none"
              >
                <option value="Tap">Piped Tap Water</option>
                <option value="Well">Open Well</option>
                <option value="Borewell">Borewell / Handpump</option>
                <option value="River">River / Pond</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-wider">Toilet Availability</label>
              <select
                value={formData.toilet_availability}
                onChange={e => setFormData({ ...formData, toilet_availability: e.target.value })}
                className="w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)] text-xs focus:outline-none"
              >
                <option value="Yes">Yes (Own Latrine)</option>
                <option value="Shared">Shared / Community Toilet</option>
                <option value="No">No (Open Defecation)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-wider">Cooking Energy Source</label>
              <select
                value={formData.cooking_source}
                onChange={e => setFormData({ ...formData, cooking_source: e.target.value })}
                className="w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)] text-xs focus:outline-none"
              >
                <option value="LPG">LPG / Cylinder</option>
                <option value="Wood">Firewood</option>
                <option value="Biogas">Biogas / Gobar Gas</option>
                <option value="Kerosene">Kerosene</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-wider">Economic Status</label>
              <select
                value={formData.economic_status}
                onChange={e => setFormData({ ...formData, economic_status: e.target.value })}
                className="w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)] text-xs focus:outline-none"
              >
                <option value="BPL">BPL (Below Poverty Line)</option>
                <option value="APL">APL (Above Poverty Line)</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 items-center bg-[var(--bg-inner)] p-3 rounded-xl border border-[var(--border-color)] mt-2">
            <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-wider">Grid Electricity:</span>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.electricity}
                onChange={e => setFormData({ ...formData, electricity: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-350 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-500 relative"></div>
              <span className="ml-2 text-xs font-bold text-[var(--text-primary)]">{formData.electricity ? 'Yes' : 'No'}</span>
            </label>
          </div>
        </div>
      )}

      {/* STEP 3: REGISTER FAMILY HEAD */}
      {currentStep === 3 && (
        <div className="space-y-4 max-w-lg mx-auto py-2">
          <div className="text-center space-y-1">
            <h3 className="text-sm font-black text-[var(--text-primary)]">Family Head Profile</h3>
            <p className="text-[11px] text-[var(--text-secondary)]">Create the master record for the primary household contact.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-wider">Head Name *</label>
              <input
                type="text"
                placeholder="Name"
                value={formData.head.name}
                onChange={e => updateHead({ name: e.target.value })}
                className="w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)] text-xs focus:outline-none"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-wider">Age (Years) *</label>
              <input
                type="number"
                placeholder="Age"
                value={formData.head.age}
                onChange={e => updateHead({ age: e.target.value })}
                className="w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)] text-xs focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-wider">Gender</label>
              <select
                value={formData.head.gender}
                onChange={e => updateHead({ gender: e.target.value })}
                className="w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)] text-xs focus:outline-none"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-wider">Mobile Number</label>
              <input
                type="text"
                placeholder="Mobile"
                value={formData.head.mobile_number}
                onChange={e => updateHead({ mobile_number: e.target.value })}
                className="w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)] text-xs focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-wider">Marital Status</label>
              <select
                value={formData.head.marital_status}
                onChange={e => updateHead({ marital_status: e.target.value })}
                className="w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)] text-xs focus:outline-none"
              >
                <option value="Married">Married</option>
                <option value="Single">Single</option>
                <option value="Widowed">Widowed</option>
                <option value="Divorced">Divorced</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-wider">Education Level</label>
              <select
                value={formData.head.education}
                onChange={e => updateHead({ education: e.target.value })}
                className="w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)] text-xs focus:outline-none"
              >
                <option value="Illiterate">Illiterate</option>
                <option value="Primary">Primary (Up to 5th)</option>
                <option value="Secondary">Secondary (Up to 10th)</option>
                <option value="Graduate">Graduate</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: ADD MEMBERS */}
      {currentStep === 4 && (
        <div className="space-y-4 py-2">
          <div className="text-center space-y-1">
            <h3 className="text-sm font-black text-[var(--text-primary)]">Household Members ({formData.members.length})</h3>
            <p className="text-[11px] text-[var(--text-secondary)]">Register all other co-residents in the house.</p>
          </div>

          <div className="bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl p-4 space-y-3">
            <span className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-wider">Onboard New Member</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <input
                type="text"
                placeholder="Name"
                value={newMember.name}
                onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-2 text-xs text-[var(--text-primary)]"
              />
              <input
                type="number"
                placeholder="Age"
                value={newMember.age}
                onChange={e => setNewMember({ ...newMember, age: e.target.value })}
                className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-2 text-xs text-[var(--text-primary)]"
              />
              <select
                value={newMember.gender}
                onChange={e => setNewMember({ ...newMember, gender: e.target.value })}
                className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-2 text-xs text-[var(--text-primary)]"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
              <select
                value={newMember.relationship}
                onChange={e => setNewMember({ ...newMember, relationship: e.target.value })}
                className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-2 text-xs text-[var(--text-primary)]"
              >
                <option value="Spouse">Spouse</option>
                <option value="Son">Son</option>
                <option value="Daughter">Daughter</option>
                <option value="Parent">Parent</option>
                <option value="Other">Other</option>
              </select>
              <select
                value={newMember.marital_status}
                onChange={e => setNewMember({ ...newMember, marital_status: e.target.value })}
                className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-2 text-xs text-[var(--text-primary)]"
              >
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Widowed">Widowed</option>
              </select>
              <button
                type="button"
                onClick={addMember}
                className="h-10 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer transition"
              >
                <Plus className="w-3.5 h-3.5" /> Append Member
              </button>
            </div>
          </div>

          {/* Members List Table */}
          {formData.members.length > 0 && (
            <div className="border border-[var(--border-color)] rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-[var(--bg-inner)]">
                  <tr>
                    <th className="p-3">Name</th>
                    <th className="p-3">Age/Gender</th>
                    <th className="p-3">Relationship</th>
                    <th className="p-3 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {formData.members.map((m, i) => (
                    <tr key={i} className="hover:bg-[var(--bg-inner)]">
                      <td className="p-3 font-bold">{m.name}</td>
                      <td className="p-3">{m.age} Yrs / {m.gender}</td>
                      <td className="p-3">{m.relationship}</td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => removeMember(i)}
                          className="text-rose-500 hover:text-rose-600 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* STEP 5: VACCINATION RECORDS */}
      {currentStep === 5 && (
        <div className="space-y-4 py-2">
          <div className="text-center space-y-1">
            <h3 className="text-sm font-black text-[var(--text-primary)]">Immunization Tracking</h3>
            <p className="text-[11px] text-[var(--text-secondary)]">Document primary pediatric and adult immunization records.</p>
          </div>

          <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
            {/* Head Vaccination */}
            <div className="border border-[var(--border-color)] rounded-xl p-4 bg-[var(--bg-inner)] space-y-3">
              <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-2">
                <span className="font-bold text-xs text-brand-500">{formData.head.name} (Head)</span>
                <span className="text-[9px] uppercase font-bold text-[var(--text-secondary)]">Card Verified</span>
              </div>
              {['BCG', 'Polio', 'DPT', 'Measles'].map(vName => {
                const checked = formData.head.vaccinations[vName]?.verified || false;
                return (
                  <div key={vName} className="flex justify-between items-center text-xs">
                    <span className="font-semibold">{vName} Vaccine</span>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={e => {
                        const vObj = formData.head.vaccinations[vName] || {};
                        updateHead({
                          vaccinations: {
                            ...formData.head.vaccinations,
                            [vName]: { ...vObj, verified: e.target.checked }
                          }
                        });
                      }}
                      className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
                    />
                  </div>
                );
              })}
            </div>

            {/* Other Members Vaccinations */}
            {formData.members.map((m, mIdx) => (
              <div key={mIdx} className="border border-[var(--border-color)] rounded-xl p-4 bg-[var(--bg-inner)] space-y-3">
                <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-2">
                  <span className="font-bold text-xs text-brand-500">{m.name} ({m.relationship})</span>
                  <span className="text-[9px] uppercase font-bold text-[var(--text-secondary)]">Card Verified</span>
                </div>
                {['BCG', 'Polio', 'DPT', 'Measles'].map(vName => {
                  const checked = m.vaccinations?.[vName]?.verified || false;
                  return (
                    <div key={vName} className="flex justify-between items-center text-xs">
                      <span className="font-semibold">{vName} Vaccine</span>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={e => {
                          const vObj = m.vaccinations?.[vName] || {};
                          updateMember(mIdx, {
                            vaccinations: {
                              ...m.vaccinations,
                              [vName]: { ...vObj, verified: e.target.checked }
                            }
                          });
                        }}
                        className="w-4 h-4 text-brand-600 rounded border-slate-300"
                      />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 6: PREGNANCY/ANC */}
      {currentStep === 6 && (
        <div className="space-y-4 py-2">
          <div className="text-center space-y-1">
            <h3 className="text-sm font-black text-[var(--text-primary)]">Maternal ANC Registry</h3>
            <p className="text-[11px] text-[var(--text-secondary)]">Record clinical details for ongoing antenatal pregnancies.</p>
          </div>

          <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
            {/* Head Pregnancy if female */}
            {formData.head.gender === 'Female' && (
              <div className="border border-[var(--border-color)] rounded-xl p-4 bg-[var(--bg-inner)] space-y-4">
                <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-2">
                  <span className="font-bold text-xs text-brand-500">{formData.head.name} (Head)</span>
                  <label className="text-[10px] font-bold text-[var(--text-secondary)] flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      checked={!!formData.head.pregnancy}
                      onChange={e => {
                        updateHead({
                          pregnancy: e.target.checked
                            ? { lmp: '', edd: '', doctor_visits: 0, hb_level: '' }
                            : null
                        });
                      }}
                      className="w-3.5 h-3.5 text-brand-600 rounded"
                    />
                    Is Pregnant
                  </label>
                </div>

                {formData.head.pregnancy && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-[var(--text-secondary)] uppercase">LMP Date</label>
                      <input
                        type="date"
                        value={formData.head.pregnancy.lmp}
                        onChange={e => {
                          const lmpVal = e.target.value;
                          let eddVal = '';
                          if (lmpVal) {
                            const d = new Date(lmpVal);
                            d.setDate(d.getDate() + 280); // standard pregnancy duration 280 days
                            eddVal = d.toISOString().split('T')[0];
                          }
                          updateHead({
                            pregnancy: { ...formData.head.pregnancy, lmp: lmpVal, edd: eddVal }
                          });
                        }}
                        className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] p-2 rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-[var(--text-secondary)] uppercase">EDD (Auto Calculated)</label>
                      <input
                        type="date"
                        disabled
                        value={formData.head.pregnancy.edd}
                        className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] p-2 rounded-lg text-xs opacity-70"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-[var(--text-secondary)] uppercase">Doctor Visits</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.head.pregnancy.doctor_visits}
                        onChange={e => updateHead({
                          pregnancy: { ...formData.head.pregnancy, doctor_visits: parseInt(e.target.value) || 0 }
                        })}
                        className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] p-2 rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-[var(--text-secondary)] uppercase">Haemoglobin (Hb Level)</label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="g/dL"
                        value={formData.head.pregnancy.hb_level}
                        onChange={e => updateHead({
                          pregnancy: { ...formData.head.pregnancy, hb_level: e.target.value }
                        })}
                        className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] p-2 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Other Female Members */}
            {formData.members.map((m, idx) => {
              if (m.gender !== 'Female') return null;
              return (
                <div key={idx} className="border border-[var(--border-color)] rounded-xl p-4 bg-[var(--bg-inner)] space-y-4">
                  <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-2">
                    <span className="font-bold text-xs text-brand-500">{m.name} ({m.relationship})</span>
                    <label className="text-[10px] font-bold text-[var(--text-secondary)] flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        checked={!!m.pregnancy}
                        onChange={e => {
                          updateMember(idx, {
                            pregnancy: e.target.checked
                              ? { lmp: '', edd: '', doctor_visits: 0, hb_level: '' }
                              : null
                          });
                        }}
                        className="w-3.5 h-3.5 text-brand-600 rounded"
                      />
                      Is Pregnant
                    </label>
                  </div>

                  {m.pregnancy && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-[var(--text-secondary)] uppercase">LMP Date</label>
                        <input
                          type="date"
                          value={m.pregnancy.lmp}
                          onChange={e => {
                            const lmpVal = e.target.value;
                            let eddVal = '';
                            if (lmpVal) {
                              const d = new Date(lmpVal);
                              d.setDate(d.getDate() + 280);
                              eddVal = d.toISOString().split('T')[0];
                            }
                            updateMember(idx, {
                              pregnancy: { ...m.pregnancy, lmp: lmpVal, edd: eddVal }
                            });
                          }}
                          className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] p-2 rounded-lg text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-[var(--text-secondary)] uppercase">EDD (Auto)</label>
                        <input
                          type="date"
                          disabled
                          value={m.pregnancy.edd}
                          className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] p-2 rounded-lg text-xs opacity-70"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-[var(--text-secondary)] uppercase">Doctor Visits</label>
                        <input
                          type="number"
                          min="0"
                          value={m.pregnancy.doctor_visits}
                          onChange={e => updateMember(idx, {
                            pregnancy: { ...m.pregnancy, doctor_visits: parseInt(e.target.value) || 0 }
                          })}
                          className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] p-2 rounded-lg text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-[var(--text-secondary)] uppercase">Haemoglobin (Hb Level)</label>
                        <input
                          type="number"
                          step="0.1"
                          placeholder="g/dL"
                          value={m.pregnancy.hb_level}
                          onChange={e => updateMember(idx, {
                            pregnancy: { ...m.pregnancy, hb_level: e.target.value }
                          })}
                          className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] p-2 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 7: BMI SCREENING */}
      {currentStep === 7 && (
        <div className="space-y-4 py-2">
          <div className="text-center space-y-1">
            <h3 className="text-sm font-black text-[var(--text-primary)]">Body Mass Index (BMI) Screenings</h3>
            <p className="text-[11px] text-[var(--text-secondary)]">Document height/weight to calculate nutritional metrics.</p>
          </div>

          <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
            {/* Head BMI */}
            <div className="border border-[var(--border-color)] rounded-xl p-4 bg-[var(--bg-inner)] space-y-3">
              <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-2">
                <span className="font-bold text-xs text-brand-500">{formData.head.name} (Head)</span>
                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/10">
                  Category: {getBmiCategory(formData.head.bmi.height_cm, formData.head.bmi.weight_kg)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <input
                  type="number"
                  step="0.1"
                  placeholder="Height (cm)"
                  value={formData.head.bmi.height_cm}
                  onChange={e => updateHead({
                    bmi: { ...formData.head.bmi, height_cm: e.target.value }
                  })}
                  className="bg-[var(--bg-card)] border border-[var(--border-color)] p-2 rounded-lg text-xs"
                />
                <input
                  type="number"
                  step="0.1"
                  placeholder="Weight (kg)"
                  value={formData.head.bmi.weight_kg}
                  onChange={e => updateHead({
                    bmi: { ...formData.head.bmi, weight_kg: e.target.value }
                  })}
                  className="bg-[var(--bg-card)] border border-[var(--border-color)] p-2 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Other Members BMI */}
            {formData.members.map((m, idx) => (
              <div key={idx} className="border border-[var(--border-color)] rounded-xl p-4 bg-[var(--bg-inner)] space-y-3">
                <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-2">
                  <span className="font-bold text-xs text-brand-500">{m.name} ({m.relationship})</span>
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/10">
                    Category: {getBmiCategory(m.bmi?.height_cm, m.bmi?.weight_kg)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Height (cm)"
                    value={m.bmi?.height_cm || ''}
                    onChange={e => updateMember(idx, {
                      bmi: { ...m.bmi, height_cm: e.target.value }
                    })}
                    className="bg-[var(--bg-card)] border border-[var(--border-color)] p-2 rounded-lg text-xs"
                  />
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Weight (kg)"
                    value={m.bmi?.weight_kg || ''}
                    onChange={e => updateMember(idx, {
                      bmi: { ...m.bmi, weight_kg: e.target.value }
                    })}
                    className="bg-[var(--bg-card)] border border-[var(--border-color)] p-2 rounded-lg text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 8: REVIEW & SUBMIT */}
      {currentStep === 8 && (
        <div className="space-y-4 py-2">
          <div className="text-center space-y-1">
            <h3 className="text-sm font-black text-[var(--text-primary)]">Review Information</h3>
            <p className="text-[11px] text-[var(--text-secondary)]">Verify all household details before final database commit.</p>
          </div>

          <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1 text-xs">
            {/* Household Summary */}
            <div className="bg-[var(--bg-inner)] border border-[var(--border-color)] p-4 rounded-xl space-y-2">
              <h4 className="font-bold border-b border-[var(--border-color)] pb-1.5 text-[var(--text-primary)]">Infrastructure Summary</h4>
              <div className="grid grid-cols-2 gap-y-2">
                <div><span className="text-[var(--text-secondary)]">House Number:</span> <span className="font-bold">{formData.house_no}</span></div>
                <div><span className="text-[var(--text-secondary)]">Economic Status:</span> <span className="font-bold">{formData.economic_status}</span></div>
                <div><span className="text-[var(--text-secondary)]">Water Source:</span> <span>{formData.water_source}</span></div>
                <div><span className="text-[var(--text-secondary)]">Toilet:</span> <span>{formData.toilet_availability}</span></div>
                <div><span className="text-[var(--text-secondary)]">Cooking Energy:</span> <span>{formData.cooking_source}</span></div>
                <div><span className="text-[var(--text-secondary)]">Electricity:</span> <span>{formData.electricity ? 'Yes' : 'No'}</span></div>
              </div>
            </div>

            {/* People Summary */}
            <div className="bg-[var(--bg-inner)] border border-[var(--border-color)] p-4 rounded-xl space-y-3">
              <h4 className="font-bold border-b border-[var(--border-color)] pb-1.5 text-[var(--text-primary)]">Roster Summary</h4>
              
              <div className="space-y-2">
                <div className="flex justify-between font-bold border-b border-dashed border-[var(--border-color)] pb-1">
                  <span>{formData.head.name} (Head)</span>
                  <span>{formData.head.age} Yrs / {formData.head.gender}</span>
                </div>
                {formData.members.map((m, i) => (
                  <div key={i} className="flex justify-between border-b border-dashed border-[var(--border-color)] pb-1 last:border-b-0">
                    <span>{m.name} ({m.relationship})</span>
                    <span>{m.age} Yrs / {m.gender}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4 border-t border-[var(--border-color)] pt-4 relative z-10">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={prevStep}
            className="flex-1 h-10 border border-[var(--border-color)] rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-inner)] font-black text-xs flex items-center justify-center gap-1 cursor-pointer transition"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
        )}
        
        {currentStep < 8 ? (
          <button
            type="button"
            onClick={nextStep}
            className="flex-1 h-10 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-black text-xs flex items-center justify-center gap-1 cursor-pointer transition shadow"
          >
            Continue <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs flex items-center justify-center gap-1 cursor-pointer transition shadow"
          >
            Submit Registry <CheckCircle2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
