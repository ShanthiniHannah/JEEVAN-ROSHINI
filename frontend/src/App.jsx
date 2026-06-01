import React, { useState, useEffect } from 'react';
import { LanguageProvider, useTranslation } from './context/LanguageContext';
import VhwPortal from './components/VhwPortal';
import DirectorPortal from './components/DirectorPortal';
import AdminPortal from './components/AdminPortal';
import InteractiveBackground from './components/InteractiveBackground';
import CommunityHealthIllustration from './components/CommunityHealthIllustration';
import { evaluateRiskAlerts } from './utils/riskAlertEngine';
import { 
  Users, Shield, Smartphone, ArrowRight, CheckCircle, RefreshCw, Wifi, WifiOff, Globe, Sparkles, Lock, LogOut, Key, Mail, Building, Sun, Moon, Paintbrush
} from 'lucide-react';
import logoDark from './assets/logo_dark.png';
import logoLight from './assets/logo_light.png';
import logoBrand from './assets/logo_brand.png';
import LogoShowcase from './components/LogoShowcase';

function LoginScreen({ onLogin, staffList, theme, setTheme, onOpenShowcase }) {
  const isLight = theme === 'light';
  const { t, locale, setLocale } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const localT = {
    en: {
      welcome: "Jeevan Roshini Portal",
      tagline: "Ayathana Trust Health Governance & Offline Field PWA",
      emailLabel: "Email Address",
      passwordLabel: "Password",
      signIn: "Sign In to Portal",
      invalid: "Invalid email or password",
      demoTitle: "Quick Demo Logins",
      demoSubtitle: "Click to autofill and sign in immediately",
      superAdmin: "Super Admin (Trust)",
      director: "Project Director",
      vhw1: "VHW - Preema D'Souza",
      vhw2: "VHW - Shobha Nayak"
    },
    kn: {
      welcome: "ಜೀವನ ರೋಶಿನಿ ಪೋರ್ಟಲ್",
      tagline: "ಆಯತನ ಟ್ರಸ್ಟ್ ಆರೋಗ್ಯ ಆಡಳಿತ ಮತ್ತು ಆಫ್‌ಲೈನ್ ಕ್ಷೇತ್ರ PWA",
      emailLabel: "ಇಮೇಲ್ ವಿಳಾಸ",
      passwordLabel: "ಪಾಸ್ವರ್ಡ್",
      signIn: "ಲಾಗಿನ್ ಮಾಡಿ",
      invalid: "ಅಮಾನ್ಯ ಇಮೇಲ್ ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್",
      demoTitle: "ತ್ವರಿತ ಡೆಮೊ ಲಾಗಿನ್‌ಗಳು",
      demoSubtitle: "ತಕ್ಷಣವೇ ಲಾಗಿನ್ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ",
      superAdmin: "ಸೂಪರ್ ಅಡ್ಮಿನ್ (ಟ್ರಸ್ಟ್)",
      director: "ಯೋಜನಾ ನಿರ್ದೇಶಕರು",
      vhw1: "ಆರೋಗ್ಯ ಕಾರ್ಯಕರ್ತ - ಪ್ರೀಮಾ",
      vhw2: "ಆರೋಗ್ಯ ಕಾರ್ಯಕರ್ತ - ಶೋಭಾ"
    },
    ml: {
      welcome: "ജീവൻ റോഷ്നി പോർട്ടൽ",
      tagline: "ആയതന ട്രസ്റ്റ് ഹെൽത്ത് ഗവേണൻസും ഓഫ്‌ലൈൻ ഫീൽഡ് PWA-യും",
      emailLabel: "ഇമെയിൽ വിലാസം",
      passwordLabel: "പാസ്‌വേഡ്",
      signIn: "സൈൻ ഇൻ ചെയ്യുക",
      invalid: "അസാധുവായ ഇമെയിൽ അല്ലെങ്കിൽ പാസ്‌വേഡ്",
      demoTitle: "ഡെമോ ലോഗിനുകൾ",
      demoSubtitle: "ഉടൻ സൈൻ ഇൻ ചെയ്യാൻ ക്ലിക്ക് ചെയ്യുക",
      superAdmin: "സൂപ്പർ അഡ്മിൻ (ട്രസ്റ്റ്)",
      director: "പ്രോജക്ട് ഡയറക്ടർ",
      vhw1: "വി.എച്ച്.ഡബ്ല്യു - പ്രീമ",
      vhw2: "വി.എച്ച്.ഡബ്ല്യു - ശോഭ"
    },
    hi: {
      welcome: "जीवन रोशनी पोर्टल",
      tagline: "आयतन ट्रस्ट स्वास्थ्य शासन और ऑफलाइन फील्ड PWA",
      emailLabel: "ईमेल पता",
      passwordLabel: "पासवर्ड",
      signIn: "साइन इन करें",
      invalid: "अमान्य ईमेल या पासवर्ड",
      demoTitle: "त्वरित डेमो लॉगिन",
      demoSubtitle: "तुरंत साइन इन करने के लिए क्लिक करें",
      superAdmin: "सुपर एडमिन (ट्रस्ट)",
      director: "परियोजना निदेशक",
      vhw1: "वी.एच.डब्ल्यू - प्रीमा",
      vhw2: "वी.एच.डब्ल्यू - शोभा"
    },
    te: {
      welcome: "జీవన్ రోషిణి పోర్టల్",
      tagline: "ఆయతన ట్రస్ట్ హెల్త్ గవర్నెన్స్ & ఆఫ్‌లైన్ ఫీల్డ్ PWA",
      emailLabel: "ఈమెయిల్ చిరునామా",
      passwordLabel: "పాస్‌వర్డ్",
      signIn: "పోర్టల్‌లోకి సైన్ ఇన్ చేయండి",
      invalid: "చెల్లని ఈమెయిల్ లేదా పాస్‌వర్డ్",
      demoTitle: "త్వరిత డెమో లాగిన్‌లు",
      demoSubtitle: "వెంటనే సైన్ ఇన్ చేయడానికి క్లిక్ చేయండి",
      superAdmin: "సూపర్ అడ్మిన్ (ట్రస్ట్)",
      director: "ప్రాజెక్ట్ డైరెక్టర్",
      vhw1: "VHW - ప్రీమా డిసౌజా",
      vhw2: "VHW - శోభా నాయక్"
    },
    ta: {
      welcome: "ஜீவன் ரோஷினி போர்டல்",
      tagline: "ஆயதன அறக்கட்டளை சுகாதார நிர்வாகம் & ஆஃப்லைன் கள PWA",
      emailLabel: "மின்னஞ்சல் முகவரி",
      passwordLabel: "கடவுச்சொல்",
      signIn: "போர்டலில் உள்நுழைக",
      invalid: "மின்னஞ்சல் அல்லது கடவுச்சொல் தவறானது",
      demoTitle: "விரைவான டெமோ உள்நுழைவுகள்",
      demoSubtitle: "உடனடியாக உள்நுழைய கிளிக் செய்க",
      superAdmin: "சூப்பர் அட்மின் (அறக்கட்டளை)",
      director: "திட்ட இயக்குனர்",
      vhw1: "VHW - பிரீமா டிசோசா",
      vhw2: "சோபா நாயக்"
    },
    mr: {
      welcome: "जीवन रोशनी पोर्टल",
      tagline: "आयतन ट्रस्ट आरोग्य प्रशासन आणि ऑफलाइन फील्ड PWA",
      emailLabel: "ईमेल पत्ता",
      passwordLabel: "पासवर्ड",
      signIn: "पोर्टलमध्ये साइन इन करा",
      invalid: "अवैध ईमेल किंवा पासवर्ड",
      demoTitle: "त्वरित डेमो लॉगिन",
      demoSubtitle: "त्वरित साइन इन करण्यासाठी क्लिक करा",
      superAdmin: "सुपर ॲडमिन (ट्रस्ट)",
      director: "प्रकल्प संचालक",
      vhw1: "VHW - प्रीमा डिसूझा",
      vhw2: "VHW - शोभा नायक"
    },
    bn: {
      welcome: "জীবন রোশনি পোর্টাল",
      tagline: "আয়তন ট্রাস্ট স্বাস্থ্য শাসন ও অফলাইন ফিল্ড PWA",
      emailLabel: "ইমেল ঠিকানা",
      passwordLabel: "পাসওয়ার্ড",
      signIn: "পোর্টালে সাইন ইন করুন",
      invalid: "অকার্যকর ইমেল বা পাসওয়ার্ড",
      demoTitle: "দ্রুত ডেমো লগইন",
      demoSubtitle: "অবিলম্বে সাইন ইন করতে ক্লিক করুন",
      superAdmin: "সুপার অ্যাডমিন (ট্রাস্ট)",
      director: "প্রকল্প পরিচালক",
      vhw1: "VHW - প্রীমা ডিসুজা",
      vhw2: "VHW - শোভা নায়েক"
    },
    gu: {
      welcome: "જીવન રોશની પોર્ટલ",
      tagline: "આયતન ટ્રસ્ટ હેલ્થ ગવર્નન્સ અને ઓફલાઇન ફીલ્ડ PWA",
      emailLabel: "ઇમેઇલ સરનામું",
      passwordLabel: "પાસવર્ડ",
      signIn: "પોર્ટલમાં સાઇન ઇન કરો",
      invalid: "અમાન્ય ઇમેઇલ અથવા પાસવર્ડ",
      demoTitle: "ઝડપી ડેમો લોગિન",
      demoSubtitle: "તરત જ સાઇન ઇન કરવા માટે ક્લિક કરો",
      superAdmin: "સુપર એડમિન (ટ્રાસ્ટ)",
      director: "પ્રોજેક્ટ ડિરેક્ટર",
      vhw1: "VHW - પ્રીમા ડિસોઝા",
      vhw2: "VHW - શોભા નાયક"
    }
  };

  const getT = (key) => {
    return localT[locale]?.[key] || localT['en'][key] || key;
  };

  const [show2FA, setShow2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [userInputCode, setUserInputCode] = useState('');
  const [pendingUser, setPendingUser] = useState(null);
  const [notif2FA, setNotif2FA] = useState('');

  const trigger2FA = (user) => {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setTwoFactorCode(code);
    setPendingUser(user);
    setShow2FA(true);
    setNotif2FA(`[2FA Delivery Engine] Security Verification Code sent to registered device: ${code}`);
  };

  const handleVerify2FA = (e) => {
    e.preventDefault();
    const cleanInput = userInputCode.trim();
    const match = cleanInput.match(/\d{6}/);
    const codeToVerify = match ? match[0] : cleanInput;

    if (codeToVerify === twoFactorCode || codeToVerify === '123456' || codeToVerify === '582910') {
      onLogin(pendingUser);
    } else {
      setError("Invalid 2FA verification code. (Try bypass code '123456' or the code shown in the notification box)");
      setUserInputCode('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const foundStaff = staffList.find(
      (s) => s.email.toLowerCase() === email.toLowerCase() && s.password === password
    );

    if (foundStaff) {
      if (foundStaff.status !== 'Active') {
        setError("Account suspended. Contact central admin.");
        return;
      }
      if (foundStaff.role === 'Super Admin (Trust)' || foundStaff.role === 'Project Director') {
        trigger2FA(foundStaff);
      } else {
        onLogin(foundStaff);
      }
    } else {
      setError(getT('invalid'));
    }
  };

  const handleQuickLogin = (emailVal, passVal) => {
    setEmail(emailVal);
    setPassword(passVal);
    setError('');
    
    const foundStaff = staffList.find(
      (s) => s.email.toLowerCase() === emailVal.toLowerCase() && s.password === passVal
    );
    if (foundStaff) {
      if (foundStaff.role === 'Super Admin (Trust)' || foundStaff.role === 'Project Director') {
        trigger2FA(foundStaff);
      } else {
        onLogin(foundStaff);
      }
    }
  };

  return (
    <div 
      className={`min-h-screen flex flex-col justify-center items-center p-4 relative font-sans overflow-hidden theme-transition ${isLight ? 'text-slate-800' : 'text-slate-100'}`} 
      style={{
        backgroundColor: isLight ? '#eef6fa' : '#020c14',
        backgroundImage: isLight 
          ? 'url(/login-bg-new.png)'
          : 'linear-gradient(rgba(2, 12, 20, 0.75), rgba(2, 12, 20, 0.75)), url(/login-bg-new.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundBlendMode: 'normal'
      }}
    >
      
      {/* Theme toggle floating button */}
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className={`fixed top-4 right-4 z-50 p-2.5 rounded-full border shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 ${isLight ? 'bg-white/80 border-teal-200 text-teal-700 hover:bg-white' : 'bg-slate-800/80 border-slate-700 text-cyan-400 hover:bg-slate-700'}`}
        title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      >
        {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
      </button>

      {/* Subtle dot grid overlay */}
      <div className="med-grid" />

      {/* Animated glowing orbs */}
      <div className="pulse-orb pulse-orb-1" />
      <div className="pulse-orb pulse-orb-2" />
      <div className="pulse-orb pulse-orb-3" />

      {/* Centered Column Layout: Login Form on top, Pulsing Heart below */}
      <div className="w-full max-w-md flex flex-col items-center gap-6 relative z-10 px-4">
        
        {/* Login Form */}
        <div className="w-full backdrop-blur-xl border p-8 rounded-3xl shadow-2xl space-y-6 card-shimmer" style={isLight ? {background:'rgba(255,255,255,0.82)', borderColor:'rgba(14,116,144,0.15)', boxShadow:'0 0 60px rgba(14,116,144,0.06), 0 25px 50px rgba(0,0,0,0.08)'} : {background:'rgba(2,20,35,0.75)', borderColor:'rgba(6,182,212,0.18)', boxShadow:'0 0 60px rgba(6,182,212,0.08), 0 25px 50px rgba(0,0,0,0.6)'}}>
            
            {/* Language & Logo Header */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 brand-logo-container">
                  <img src={isLight ? logoLight : logoDark} alt="Jeevan Roshini Logo" className="w-7 h-7 object-contain" />
                </div>
                <span className="text-[10px] font-bold border px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer hover:bg-cyan-500/20 transition-all animate-pulse" onClick={onOpenShowcase} style={{background:'rgba(6,182,212,0.08)', color:'#67e8f9', borderColor:'rgba(6,182,212,0.25)'}}>
                  <Sparkles className="w-3 h-3 animate-spin-slow" style={{color:'#06b6d4'}} /> Brand Showcase
                </span>
              </div>

              <div className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border ${isLight ? 'bg-white/60 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                <Globe className={`w-3.5 h-3.5 shrink-0 ${isLight ? 'text-slate-500' : 'text-slate-400'}`} />
                <select 
                  value={locale} 
                  onChange={(e) => setLocale(e.target.value)}
                  className={`bg-transparent border-0 text-xs font-bold focus:ring-0 cursor-pointer pr-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}
                >
                  <option value="en" className={isLight ? 'bg-white text-slate-700' : 'bg-slate-950 text-slate-300'}>English (EN)</option>
                  <option value="kn" className={isLight ? 'bg-white text-slate-700' : 'bg-slate-950 text-slate-300'}>ಕನ್ನಡ (KN)</option>
                  <option value="ml" className={isLight ? 'bg-white text-slate-700' : 'bg-slate-950 text-slate-300'}>മലയാളം (ML)</option>
                  <option value="hi" className={isLight ? 'bg-white text-slate-700' : 'bg-slate-950 text-slate-300'}>हिन्दी (HI)</option>
                  <option value="te" className={isLight ? 'bg-white text-slate-700' : 'bg-slate-950 text-slate-300'}>తెలుగు (TE)</option>
                  <option value="ta" className={isLight ? 'bg-white text-slate-700' : 'bg-slate-950 text-slate-300'}>தமிழ் (TA)</option>
                  <option value="mr" className={isLight ? 'bg-white text-slate-700' : 'bg-slate-950 text-slate-300'}>मराठी (MR)</option>
                  <option value="bn" className={isLight ? 'bg-white text-slate-700' : 'bg-slate-950 text-slate-300'}>বাংলা (BN)</option>
                  <option value="gu" className={isLight ? 'bg-white text-slate-700' : 'bg-slate-950 text-slate-300'}>ગુજરાતી (GU)</option>
                </select>
              </div>
            </div>

            {/* Title */}
            <div className="text-center space-y-1">
              <h1 className={`text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r ${isLight ? 'from-cyan-700 to-emerald-600' : 'from-cyan-300 to-emerald-400'}`}>{getT('welcome')}</h1>
              <p className="text-xs leading-normal" style={{color: isLight ? '#64748b' : '#94a3b8'}}>{getT('tagline')}</p>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs p-3 rounded-xl flex items-center gap-2">
                <Lock className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            {show2FA ? (
              <form onSubmit={handleVerify2FA} className="space-y-4">
                <div className="text-center space-y-2">
                  <Lock className="w-8 h-8 text-cyan-400 mx-auto animate-pulse" />
                  <h3 className={`text-sm font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>Enter 6-Digit 2FA Code</h3>
                  <p className={`text-[10px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Two-Factor Authentication is required for administrative roles.</p>
                </div>
                
                {notif2FA && (
                  <div className={`border text-[10.5px] p-3 rounded-xl leading-relaxed ${isLight ? 'bg-cyan-50 border-cyan-200 text-cyan-800' : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'}`}>
                    {notif2FA}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className={`text-[10px] font-extrabold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Security Verification Code</label>
                  <input 
                    type="text" 
                    value={userInputCode}
                    onChange={(e) => {
                      const val = e.target.value;
                      const match = val.match(/\d{6}/);
                      if (match) {
                        setUserInputCode(match[0]);
                      } else {
                        const digitsOnly = val.replace(/\D/g, '');
                        setUserInputCode(digitsOnly.slice(0, 6));
                      }
                    }}
                    placeholder="e.g. 582910"
                    required
                    className={`w-full border rounded-xl px-4 py-2.5 text-center text-lg font-mono tracking-widest focus:outline-none transition-all ${isLight ? 'bg-slate-50 border-slate-200 text-slate-800 focus:border-teal-500' : 'bg-slate-950 border-slate-800 text-white focus:border-indigo-500'}`}
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full text-white font-bold py-3 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 active:scale-[0.99] hover:shadow-xl bg-gradient-to-r from-cyan-600 to-indigo-600"
                >
                  Verify & Sign In
                  <ArrowRight className="w-4 h-4" />
                </button>
                
                <button 
                  type="button"
                  onClick={() => { setShow2FA(false); setError(''); }}
                  className={`w-full text-xs font-bold py-1.5 transition-all text-center ${isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-white'}`}
                >
                  Back to Login
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className={`text-[10px] font-extrabold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{getT('emailLabel')}</label>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@ayathanatrust.org"
                      required
                      className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none transition-all ${isLight ? 'bg-slate-50 border-slate-200 text-slate-800 focus:border-teal-500 placeholder:text-slate-400' : 'bg-slate-950 border-slate-800 text-white focus:border-indigo-500'}`}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className={`text-[10px] font-extrabold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{getT('passwordLabel')}</label>
                  <div className="relative">
                    <Key className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none transition-all ${isLight ? 'bg-slate-50 border-slate-200 text-slate-800 focus:border-teal-500 placeholder:text-slate-400' : 'bg-slate-950 border-slate-800 text-white focus:border-indigo-500'}`}
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full text-white font-bold py-3 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 active:scale-[0.99] hover:shadow-xl"
                  style={{background:'linear-gradient(135deg,#0e7490,#059669)', boxShadow: isLight ? '0 4px 20px rgba(14,116,144,0.25)' : '0 4px 20px rgba(6,182,212,0.3)'}}
                  onMouseOver={e=>e.currentTarget.style.opacity='0.88'}
                  onMouseOut={e=>e.currentTarget.style.opacity='1'}
                >
                  {getT('signIn')}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Demo Logins */}
            <div className={`border-t pt-5 space-y-3 ${isLight ? 'border-slate-200' : 'border-slate-800/80'}`}>
              <div className="text-center">
                <p className={`text-xs font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{getT('demoTitle')}</p>
                <p className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>{getT('demoSubtitle')}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <button 
                  type="button"
                  onClick={() => handleQuickLogin('admin@ayathanatrust.org', 'admin123')}
                  className={`rounded-xl p-2.5 text-left transition-all flex flex-col justify-between hover-lift border ${isLight ? 'bg-white/60 hover:bg-white border-slate-200 text-slate-700' : 'bg-slate-950 hover:bg-slate-800/50 border-slate-800 text-slate-300'}`}
                >
                  <span className={`font-extrabold ${isLight ? 'text-indigo-600' : 'text-indigo-400'}`}>{getT('superAdmin')}</span>
                  <span className={`text-[8px] mt-1 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>admin@ayathanatrust.org</span>
                </button>

                <button 
                  type="button"
                  onClick={() => handleQuickLogin('director@ayathanatrust.org', 'director123')}
                  className={`rounded-xl p-2.5 text-left transition-all flex flex-col justify-between hover-lift border ${isLight ? 'bg-white/60 hover:bg-white border-slate-200 text-slate-700' : 'bg-slate-950 hover:bg-slate-800/50 border-slate-800 text-slate-300'}`}
                >
                  <span className={`font-extrabold ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`}>{getT('director')}</span>
                  <span className={`text-[8px] mt-1 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>director@ayathanatrust.org</span>
                </button>

                <button 
                  type="button"
                  onClick={() => handleQuickLogin('preema@ayathanatrust.org', 'vhw123')}
                  className={`rounded-xl p-2.5 text-left transition-all flex flex-col justify-between hover-lift border ${isLight ? 'bg-white/60 hover:bg-white border-slate-200 text-slate-700' : 'bg-slate-950 hover:bg-slate-800/50 border-slate-800 text-slate-300'}`}
                >
                  <span className={`font-extrabold ${isLight ? 'text-blue-600' : 'text-blue-400'}`}>{getT('vhw1')}</span>
                  <span className={`text-[8px] mt-1 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>preema@ayathanatrust.org</span>
                </button>

                <button 
                  type="button"
                  onClick={() => handleQuickLogin('shobha@ayathanatrust.org', 'vhw123')}
                  className={`rounded-xl p-2.5 text-left transition-all flex flex-col justify-between hover-lift border ${isLight ? 'bg-white/60 hover:bg-white border-slate-200 text-slate-700' : 'bg-slate-950 hover:bg-slate-800/50 border-slate-800 text-slate-300'}`}
                >
                  <span className={`font-extrabold ${isLight ? 'text-purple-600' : 'text-purple-400'}`}>{getT('vhw2')}</span>
                  <span className={`text-[8px] mt-1 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>shobha@ayathanatrust.org</span>
                </button>
              </div>
            </div>

        </div>

      </div>

      {/* Centered Pulsing Heart and Overlaid ECG pulse line below the login card, spanning full screen width */}
      <div className="w-screen h-[180px] flex justify-center items-center relative z-10 mt-4 overflow-hidden pointer-events-none">
        <CommunityHealthIllustration theme={theme} />
      </div>

    </div>
  );
}

function DashboardShell({ currentUser, onLogout, state, setState, theme, setTheme, onOpenShowcase, env, setEnv }) {
  const { t, locale, setLocale } = useTranslation();
  const [isOnline, setIsOnline] = useState(true);
  const [offlineQueue, setOfflineQueue] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const isLight = theme === 'light';

  // Offline Synchronization Trigger
  const triggerSync = () => {
    if (!isOnline || offlineQueue.length === 0) return;
    setIsSyncing(true);

    setTimeout(() => {
      setState(prev => {
        let updatedVillages = [...prev.villages];
        let updatedFamilies = [...prev.families];
        let updatedIndividuals = [...prev.individuals];
        let updatedAlerts = [...prev.alerts];
        let updatedVisits = [...prev.visits];
        let updatedPrograms = [...prev.programs];

        offlineQueue.forEach(item => {
          if (item.type === 'village') {
            updatedVillages.push(item.data);
          } else if (item.type === 'family') {
            updatedFamilies.push(item.data);
          } else if (item.type === 'individual') {
            updatedIndividuals.push(item.data);
            // Append generated alerts
            item.data.alerts?.forEach(al => {
              updatedAlerts.push({
                id: 'ALT-' + Math.floor(1000 + Math.random() * 9000),
                patientId: item.data.id,
                patientName: item.data.name,
                type: al.type,
                severity: al.severity,
                reason: al.reason,
                date: new Date().toLocaleDateString(),
                resolved: false
              });
            });
          } else if (item.type === 'visit') {
            updatedVisits.unshift(item.data);
          } else if (item.type === 'program') {
            updatedPrograms.unshift(item.data);
          }
        });

        return {
          ...prev,
          villages: updatedVillages,
          families: updatedFamilies,
          individuals: updatedIndividuals,
          alerts: updatedAlerts,
          visits: updatedVisits,
          programs: updatedPrograms
        };
      });

      setIsSyncing(false);
      setOfflineQueue([]);
    }, 2000); // 2-second simulation delay
  };

  const getPortalRole = (user) => {
    if (!user) return null;
    if (user.role === 'Super Admin (Trust)') return 'admin';
    if (user.role === 'Project Director') return 'director';
    if (user.role === 'Village Health Worker') return 'vhw';
    return null;
  };

  const activeRole = getPortalRole(currentUser);

  return (
    <div 
      className={`min-h-screen flex flex-col font-sans theme-transition ${isLight ? 'bg-[#eef6fa] text-slate-800' : 'bg-[#070b15] text-slate-100'}`}
      style={activeRole ? {
        backgroundImage: activeRole === 'admin'
          ? (theme === 'dark' 
              ? 'linear-gradient(rgba(7, 11, 21, 0.91), rgba(7, 11, 21, 0.91)), url(/admin-portal-bg.png)'
              : 'linear-gradient(rgba(238, 246, 250, 0.55), rgba(238, 246, 250, 0.55)), url(/admin-portal-bg.png)')
          : (theme === 'dark'
              ? 'linear-gradient(rgba(7, 11, 21, 0.91), rgba(7, 11, 21, 0.91)), url(/other-portal-bg.png)'
              : 'linear-gradient(rgba(238, 246, 250, 0.55), rgba(238, 246, 250, 0.55)), url(/other-portal-bg.png)'),
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat'
      } : {}}
    >

      {/* Interactive Background */}
      <InteractiveBackground theme={theme} />

      {/* Top Header */}
      <header className={`backdrop-blur border-b sticky top-0 z-50 px-3 py-2.5 md:px-8 ${isLight ? 'bg-white/90 border-slate-200' : 'bg-slate-900/95 border-slate-800/80'}`}>
        <div className="max-w-7xl mx-auto flex flex-row justify-between items-center gap-2">
          
          {/* Platform Title */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 md:w-9 md:h-9 shrink-0 brand-logo-container">
              <img src={isLight ? logoLight : logoDark} alt="Jeevan Roshini Logo" className="w-6 h-6 md:w-7 md:h-7 object-contain" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className={`text-xs md:text-sm font-black uppercase tracking-wider truncate ${isLight ? 'text-slate-800' : 'text-white'}`}>Jeevan Roshini Portal</h1>
                <span className={`hidden sm:flex text-[9px] font-bold border px-1.5 py-0.5 rounded items-center gap-1 shrink-0 ${isLight ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-slate-800 text-indigo-300 border-indigo-500/20'}`}>
                  <Sparkles className={`w-2.5 h-2.5 ${isLight ? 'text-indigo-500' : 'text-indigo-400'}`} /> Active Session
                </span>
              </div>
              <p className={`hidden md:block text-[10px] font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Ayathana Trust Community Health Governance &amp; Field PWA</p>
            </div>
          </div>

          {/* Controls */}
          <div className={`flex items-center gap-1.5 md:gap-3 px-1.5 py-1 rounded-xl md:rounded-2xl border shrink-0 ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
            
            {/* Environment Badge */}
            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
              env === 'Production' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
              env === 'Staging' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
              'bg-purple-500/10 text-purple-400 border border-purple-500/20'
            }`}>
              {env}
            </span>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] md:text-[10px] font-extrabold transition-all duration-300 border ${isLight ? 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25 hover:bg-cyan-500/20'}`}
              title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {isLight ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
              <span className="hidden sm:inline">{isLight ? 'Dark' : 'Light'}</span>
            </button>

            {/* Brand Showcase Toggle */}
            <button
              onClick={onOpenShowcase}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] md:text-[10px] font-extrabold transition-all duration-300 border ${isLight ? 'bg-teal-50 text-teal-600 border-teal-200 hover:bg-teal-100' : 'bg-teal-500/10 text-teal-400 border-teal-500/25 hover:bg-teal-500/20'}`}
              title="View Brand Logos & Background Colors"
            >
              <Paintbrush className="w-3 h-3" />
              <span className="hidden sm:inline">Branding</span>
            </button>

            {/* Language */}
            <div className={`hidden sm:flex items-center gap-1 border-r pr-2 ${isLight ? 'border-slate-300' : 'border-slate-800'}`}>
              <Globe className={`w-3 h-3 md:w-3.5 md:h-3.5 shrink-0 ${isLight ? 'text-slate-500' : 'text-slate-400'}`} />
              <select 
                value={locale} 
                onChange={(e) => setLocale(e.target.value)}
                className={`bg-transparent border-0 text-[10px] md:text-xs font-bold focus:ring-0 cursor-pointer pr-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}
              >
                <option value="en" className={isLight ? 'bg-white text-slate-700' : 'bg-slate-950 text-slate-300'}>EN</option>
                <option value="kn" className={isLight ? 'bg-white text-slate-700' : 'bg-slate-950 text-slate-300'}>KN</option>
                <option value="ml" className={isLight ? 'bg-white text-slate-700' : 'bg-slate-950 text-slate-300'}>ML</option>
                <option value="hi" className={isLight ? 'bg-white text-slate-700' : 'bg-slate-950 text-slate-300'}>HI</option>
                <option value="te" className={isLight ? 'bg-white text-slate-700' : 'bg-slate-950 text-slate-300'}>TE</option>
                <option value="ta" className={isLight ? 'bg-white text-slate-700' : 'bg-slate-950 text-slate-300'}>TA</option>
                <option value="mr" className={isLight ? 'bg-white text-slate-700' : 'bg-slate-950 text-slate-300'}>MR</option>
                <option value="bn" className={isLight ? 'bg-white text-slate-700' : 'bg-slate-950 text-slate-300'}>BN</option>
                <option value="gu" className={isLight ? 'bg-white text-slate-700' : 'bg-slate-950 text-slate-300'}>GU</option>
              </select>
            </div>

            {/* Network Toggle */}
            <div className={`flex items-center border-r pr-1.5 md:pr-2 ${isLight ? 'border-slate-300' : 'border-slate-800'}`}>
              <button 
                onClick={() => {
                  const targetState = !isOnline;
                  setIsOnline(targetState);
                  if (targetState) triggerSync();
                }}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] md:text-[10px] font-extrabold transition-all duration-300 ${
                  isOnline 
                    ? (isLight ? 'bg-emerald-50 text-emerald-600 border border-emerald-300' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/35')
                    : (isLight ? 'bg-rose-50 text-rose-600 border border-rose-300' : 'bg-rose-500/10 text-rose-400 border border-rose-500/35')
                }`}
              >
                {isOnline ? <Wifi className={`w-3 h-3 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} /> : <WifiOff className={`w-3 h-3 ${isLight ? 'text-rose-600' : 'text-rose-400'}`} />}
                <span className="hidden sm:inline">{isOnline ? 'Online' : 'Offline'}</span>
              </button>
            </div>

            {/* User & Logout */}
            <div className="flex items-center gap-1.5 md:gap-3 pl-0.5 md:pl-1 pr-0.5 md:pr-1.5">
              <div className="hidden sm:flex flex-col text-left">
                <span className={`text-[9px] md:text-[10px] font-extrabold leading-tight ${isLight ? 'text-slate-800' : 'text-white'}`}>{currentUser?.name}</span>
                <span className={`text-[8px] font-medium hidden md:block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{currentUser?.role}</span>
              </div>
              <button 
                onClick={onLogout}
                className={`p-1.5 border rounded-lg md:rounded-xl transition-all duration-200 active:scale-95 flex items-center gap-1 text-[9px] md:text-[10px] font-bold ${isLight ? 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-600' : 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/20 text-rose-400'}`}
                title="Logout"
              >
                <LogOut className="w-3 h-3 md:w-3.5 md:h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>

          </div>

        </div>
      </header>

      {/* Syncing Overlay Loader */}
      {isSyncing && (
        <div className={`fixed inset-0 z-55 flex items-center justify-center p-4 ${isLight ? 'bg-white/80' : 'bg-slate-950/85'}`}>
          <div className={`border p-6 rounded-2xl max-w-xs w-full text-center space-y-4 shadow-2xl ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
            <RefreshCw className="w-10 h-10 text-indigo-400 animate-spin mx-auto" />
            <h4 className={`font-bold text-sm ${isLight ? 'text-slate-800' : 'text-white'}`}>Syncing Local Queue...</h4>
            <p className={`text-xs leading-normal ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Uploading VHW offline registrations, clinical risk histories, and field activity logs to the central MySQL registry.</p>
          </div>
        </div>
      )}

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 md:p-6 lg:p-8 relative z-10">
        
        {/* VIEW 1: SUPER ADMIN (AYATHANA TRUST) */}
        {activeRole === 'admin' && (
          <div className="animate-fadeIn">
            <AdminPortal state={state} setState={setState} env={env} setEnv={setEnv} />
          </div>
        )}

        {/* VIEW 2: PROJECT DIRECTOR */}
        {activeRole === 'director' && (
          <div className="animate-fadeIn">
            <DirectorPortal state={state} setState={setState} env={env} />
          </div>
        )}

        {/* VIEW 3: VILLAGE HEALTH WORKER (MOBILE SIMULATION) */}
        {activeRole === 'vhw' && (
          <div className="flex flex-col xl:flex-row items-start gap-6 py-2 w-full">
            
            {/* ── PHONE MOCKUP (shows first on mobile, right side on desktop) ── */}
            <div className="w-full xl:order-2 xl:shrink-0 flex justify-center">
              {/* Phone frame using outline + shadow — no background overlay that hides content */}
              <div
                className="relative"
                style={{
                  borderRadius: '40px',
                  boxShadow: '0 0 0 12px #0f172a, 0 0 0 14px #1e293b, 0 30px 80px rgba(59,130,246,0.18), 0 0 0 14px #334155'
                }}
              >
                {/* Notch */}
                <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-24 h-5 bg-slate-950 rounded-full border border-slate-800 flex items-center justify-center gap-1.5 z-20">
                  <div className="w-1.5 h-1.5 bg-slate-800 rounded-full"></div>
                  <div className="w-10 h-1 bg-slate-900 rounded-full"></div>
                </div>
                {/* Side volume buttons */}
                <div className="absolute top-24 -left-[14px] w-[4px] h-10 bg-slate-700 rounded-l-md"></div>
                <div className="absolute top-36 -left-[14px] w-[4px] h-10 bg-slate-700 rounded-l-md"></div>
                {/* Power button */}
                <div className="absolute top-28 -right-[14px] w-[4px] h-14 bg-slate-700 rounded-r-md"></div>

                {/* VHW Phone content */}
                <VhwPortal 
                  state={state} 
                  setState={setState} 
                  isOnline={isOnline}
                  setIsOnline={setIsOnline}
                  offlineQueue={offlineQueue}
                  setOfflineQueue={setOfflineQueue}
                  triggerSync={triggerSync}
                  currentUser={currentUser}
                  env={env}
                />
              </div>
            </div>

            {/* ── RIGHT/BOTTOM PANEL: VHW Live Dashboard ── */}
            <div className="flex flex-col gap-4 w-full xl:max-w-md flex-1 self-start xl:order-1">

              {/* Worker Identity Card */}
              <div className="rounded-2xl p-5 border relative overflow-hidden card-shimmer" style={{
                backgroundImage: `linear-gradient(to right, rgba(14, 116, 144, 0.95) 20%, rgba(15, 23, 42, 0.5)), url(/vhw-banner.jpg)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderColor:'rgba(6,182,212,0.3)'
              }}>
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10" style={{background:'white', transform:'translate(30%,-30%)'}} />
                <div className="relative z-10">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-100 mb-1">Field Health Worker — Active Session</p>
                  <h2 className="text-2xl font-black text-white">{currentUser?.name || 'VHW Worker'}</h2>
                  <p className="text-sm text-cyan-100 mt-0.5">{currentUser?.role} · ID {currentUser?.id}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="flex items-center gap-1 text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-bold">
                      <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse inline-block" /> {isOnline ? 'Online' : 'Offline'}
                    </span>
                    <span className="text-[10px] bg-white/15 text-white px-2 py-0.5 rounded-full">{offlineQueue.length} pending sync</span>
                  </div>
                </div>
              </div>

              {/* Live KPI Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-2 gap-3">
                {[
                  { label: 'Families Registered', value: state.families?.length ?? 0, color: '#38bdf8', icon: '👨‍👩‍👧', sub: 'Total households' },
                  { label: 'Individuals Screened', value: state.individuals?.length ?? 0, color: '#a78bfa', icon: '🧑', sub: 'Health records' },
                  { label: 'Risk Alerts', value: state.alerts?.filter(a => !a.resolved).length ?? 0, color: '#f87171', icon: '⚠️', sub: 'Unresolved cases' },
                  { label: 'Field Visits', value: state.visits?.length ?? 0, color: '#34d399', icon: '🗺️', sub: 'This month' },
                ].map(({ label, value, color, icon, sub }) => (
                  <div key={label} className={`rounded-2xl p-4 hover-lift card-shimmer border ${isLight ? 'bg-white/70 border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-base">{icon}</span>
                      <span className="text-2xl font-black" style={{color}}>{value}</span>
                    </div>
                    <p className={`text-[10px] font-bold leading-tight ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{label}</p>
                    <p className={`text-[9px] mt-0.5 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>{sub}</p>
                  </div>
                ))}
              </div>

              {/* Assigned Families List */}
              <div className={`rounded-2xl p-4 border card-shimmer ${isLight ? 'bg-white/70 border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className={`text-xs font-bold flex items-center gap-1.5 ${isLight ? 'text-slate-800' : 'text-white'}`}>
                    <span className="text-sm">🏠</span> Assigned Families
                  </h4>
                  <span className="text-[9px] text-slate-500">{state.families?.length ?? 0} total</span>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {(state.families?.length > 0) ? state.families.slice(0, 6).map((fam) => (
                    <div key={fam.id} className={`flex items-center justify-between rounded-xl px-3 py-2 ${isLight ? 'bg-slate-50' : 'bg-slate-800/60'}`}>
                      <div>
                        <p className={`text-xs font-semibold ${isLight ? 'text-slate-800' : 'text-white'}`}>{fam.headName || fam.name || 'Family'}</p>
                        <p className={`text-[9px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{fam.village || fam.villageName || '—'} · {fam.members || '—'} members</p>
                      </div>
                      <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold ${
                        fam.riskLevel === 'High' ? 'bg-rose-500/20 text-rose-400' :
                        fam.riskLevel === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-emerald-500/20 text-emerald-400'
                      }`}>{fam.riskLevel || 'Low'}</span>
                    </div>
                  )) : (
                    <p className="text-xs text-slate-500 text-center py-4">No families registered yet.<br/>Use the phone to add families.</p>
                  )}
                </div>
              </div>

              {/* Active Risk Alerts */}
              <div className={`rounded-2xl p-4 border card-shimmer ${isLight ? 'bg-white/70 border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
                <h4 className={`text-xs font-bold flex items-center gap-1.5 mb-3 ${isLight ? 'text-slate-800' : 'text-white'}`}>
                  <span className="text-sm">🚨</span> Active Risk Alerts
                  {(state.alerts?.filter(a => !a.resolved).length ?? 0) > 0 && (
                    <span className="ml-auto text-[9px] bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                      {state.alerts.filter(a => !a.resolved).length} active
                    </span>
                  )}
                </h4>
                <div className="space-y-2 max-h-36 overflow-y-auto">
                  {(state.alerts?.filter(a => !a.resolved).length > 0) ? (
                    state.alerts.filter(a => !a.resolved).slice(0, 4).map((al) => (
                      <div key={al.id} className="flex items-start gap-2 border-l-2 border-rose-500 pl-2.5 py-1 bg-rose-500/5 rounded-r-xl">
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold text-rose-300 truncate">{al.patientName}</p>
                          <p className="text-[9px] text-slate-400 truncate">{al.type} · {al.reason}</p>
                        </div>
                        <span className={`shrink-0 text-[8px] px-1.5 py-0.5 rounded font-bold uppercase ${
                          al.severity === 'critical' ? 'bg-rose-600 text-white animate-pulse' : 'bg-amber-600 text-white'
                        }`}>{al.severity}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-emerald-400 text-center py-3 flex items-center justify-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" /> No active alerts — all clear!
                    </p>
                  )}
                </div>
              </div>

              {/* Recent Activity Timeline */}
              <div className={`rounded-2xl p-4 border card-shimmer ${isLight ? 'bg-white/70 border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
                <h4 className={`text-xs font-bold mb-3 ${isLight ? 'text-slate-800' : 'text-white'}`}>📋 Recent Activity</h4>
                <div className="space-y-2.5">
                  {[
                    ...(state.visits?.slice(-3).reverse().map(v => ({ type: 'visit', text: `Visit: ${v.villageName || 'Village'}`, time: v.date || 'Today', color: '#34d399' })) || []),
                    ...(state.families?.slice(-2).reverse().map(f => ({ type: 'family', text: `Family: ${f.headName || f.name || 'Registered'}`, time: 'Recent', color: '#38bdf8' })) || []),
                    ...(state.individuals?.slice(-2).reverse().map(i => ({ type: 'individual', text: `Screened: ${i.name || 'Individual'}`, time: 'Recent', color: '#a78bfa' })) || []),
                  ].slice(0, 5).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{background: item.color}} />
                      <p className={`text-[10px] flex-1 truncate ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>{item.text}</p>
                      <span className={`text-[9px] shrink-0 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>{item.time}</span>
                    </div>
                  ))}
                  {(!state.visits?.length && !state.families?.length && !state.individuals?.length) && (
                    <p className="text-xs text-slate-500 text-center py-2">No recent activity.</p>
                  )}
                </div>
              </div>

              {/* Training & Skills Progress */}
              <div className={`rounded-2xl p-4 border card-shimmer ${isLight ? 'bg-white/70 border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
                <h4 className={`text-xs font-bold mb-3 ${isLight ? 'text-slate-800' : 'text-white'}`}>🎓 Training Progress</h4>
                <div className="space-y-2.5">
                  {[
                    { label: 'Basic Health Screening', pct: 100, color: '#34d399' },
                    { label: 'Maternal & Child Health', pct: 85, color: '#38bdf8' },
                    { label: 'Disease Surveillance', pct: 70, color: '#a78bfa' },
                    { label: 'Community Mobilisation', pct: 90, color: '#fb923c' },
                  ].map(({ label, pct, color }) => (
                    <div key={label}>
                      <div className="flex justify-between mb-0.5">
                        <span className={`text-[9px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{label}</span>
                        <span className="text-[9px] font-bold" style={{color}}>{pct}%</span>
                      </div>
                      <div className={`h-1.5 rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`}>
                        <div className="h-full rounded-full transition-all duration-700" style={{width:`${pct}%`, background:color}} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* Footer Branding */}
      <footer className={`border-t py-6 text-center text-xs relative z-10 ${isLight ? 'bg-white/60 border-slate-200 text-slate-500' : 'bg-slate-950 border-slate-900/60 text-slate-500'}`}>
        <p>© 2026 Ayathana Trust | Jeevan Roshini Community Health Programme Web Portal</p>
        <p className={`text-[10px] mt-1 ${isLight ? 'text-slate-400' : 'text-slate-600'}`}>Built with Laravel + Blade + Livewire + Tailwind CSS + ApexCharts Architecture | Powered by Infowin Digicare Pvt. Ltd.</p>
      </footer>

    </div>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [isShowcaseOpen, setIsShowcaseOpen] = useState(false);
  const [env, setEnv] = useState('Production'); // 'Development', 'Staging', 'Production'

  // Sync theme class to body element
  useEffect(() => {
    document.body.classList.toggle('theme-light', theme === 'light');
    return () => document.body.classList.remove('theme-light');
  }, [theme]);

  // Pre-populated Global Database State with Structured Geography & Credentials
  const [state, setState] = useState({
    states: [
      { id: 'ST-001', name: 'Andhra Pradesh',          code: 'AP', status: 'Active' },
      { id: 'ST-002', name: 'Arunachal Pradesh',        code: 'AR', status: 'Active' },
      { id: 'ST-003', name: 'Assam',                    code: 'AS', status: 'Active' },
      { id: 'ST-004', name: 'Bihar',                    code: 'BR', status: 'Active' },
      { id: 'ST-005', name: 'Chhattisgarh',             code: 'CG', status: 'Active' },
      { id: 'ST-006', name: 'Goa',                      code: 'GA', status: 'Active' },
      { id: 'ST-007', name: 'Gujarat',                  code: 'GJ', status: 'Active' },
      { id: 'ST-008', name: 'Haryana',                  code: 'HR', status: 'Active' },
      { id: 'ST-009', name: 'Himachal Pradesh',         code: 'HP', status: 'Active' },
      { id: 'ST-010', name: 'Jharkhand',                code: 'JH', status: 'Active' },
      { id: 'ST-011', name: 'Karnataka',                code: 'KA', status: 'Active' },
      { id: 'ST-012', name: 'Kerala',                   code: 'KL', status: 'Active' },
      { id: 'ST-013', name: 'Madhya Pradesh',           code: 'MP', status: 'Active' },
      { id: 'ST-014', name: 'Maharashtra',              code: 'MH', status: 'Active' },
      { id: 'ST-015', name: 'Manipur',                  code: 'MN', status: 'Active' },
      { id: 'ST-016', name: 'Meghalaya',                code: 'ML', status: 'Active' },
      { id: 'ST-017', name: 'Mizoram',                  code: 'MZ', status: 'Active' },
      { id: 'ST-018', name: 'Nagaland',                 code: 'NL', status: 'Active' },
      { id: 'ST-019', name: 'Odisha',                   code: 'OD', status: 'Active' },
      { id: 'ST-020', name: 'Punjab',                   code: 'PB', status: 'Active' },
      { id: 'ST-021', name: 'Rajasthan',                code: 'RJ', status: 'Active' },
      { id: 'ST-022', name: 'Sikkim',                   code: 'SK', status: 'Active' },
      { id: 'ST-023', name: 'Tamil Nadu',               code: 'TN', status: 'Active' },
      { id: 'ST-024', name: 'Telangana',                code: 'TS', status: 'Active' },
      { id: 'ST-025', name: 'Tripura',                  code: 'TR', status: 'Active' },
      { id: 'ST-026', name: 'Uttar Pradesh',            code: 'UP', status: 'Active' },
      { id: 'ST-027', name: 'Uttarakhand',              code: 'UK', status: 'Active' },
      { id: 'ST-028', name: 'West Bengal',              code: 'WB', status: 'Active' },
      { id: 'ST-029', name: 'Andaman & Nicobar Islands',code: 'AN', status: 'Active' },
      { id: 'ST-030', name: 'Chandigarh',               code: 'CH', status: 'Active' },
      { id: 'ST-031', name: 'Dadra & Nagar Haveli and Daman & Diu', code: 'DH', status: 'Active' },
      { id: 'ST-032', name: 'Delhi',                    code: 'DL', status: 'Active' },
      { id: 'ST-033', name: 'Jammu & Kashmir',          code: 'JK', status: 'Active' },
      { id: 'ST-034', name: 'Ladakh',                   code: 'LA', status: 'Active' },
      { id: 'ST-035', name: 'Lakshadweep',              code: 'LD', status: 'Active' },
      { id: 'ST-036', name: 'Puducherry',               code: 'PY', status: 'Active' },
    ],
    districts: [
      // Andhra Pradesh
      { id: 'DST-AP-01', stateId: 'ST-001', name: 'Anantapur' },
      { id: 'DST-AP-02', stateId: 'ST-001', name: 'Chittoor' },
      { id: 'DST-AP-03', stateId: 'ST-001', name: 'East Godavari' },
      { id: 'DST-AP-04', stateId: 'ST-001', name: 'Guntur' },
      { id: 'DST-AP-05', stateId: 'ST-001', name: 'Krishna' },
      { id: 'DST-AP-06', stateId: 'ST-001', name: 'Kurnool' },
      { id: 'DST-AP-07', stateId: 'ST-001', name: 'Nellore' },
      { id: 'DST-AP-08', stateId: 'ST-001', name: 'Prakasam' },
      { id: 'DST-AP-09', stateId: 'ST-001', name: 'Srikakulam' },
      { id: 'DST-AP-10', stateId: 'ST-001', name: 'Visakhapatnam' },
      { id: 'DST-AP-11', stateId: 'ST-001', name: 'Vizianagaram' },
      { id: 'DST-AP-12', stateId: 'ST-001', name: 'West Godavari' },
      { id: 'DST-AP-13', stateId: 'ST-001', name: 'YSR Kadapa' },
      // Arunachal Pradesh
      { id: 'DST-AR-01', stateId: 'ST-002', name: 'Anjaw' },
      { id: 'DST-AR-02', stateId: 'ST-002', name: 'Changlang' },
      { id: 'DST-AR-03', stateId: 'ST-002', name: 'East Kameng' },
      { id: 'DST-AR-04', stateId: 'ST-002', name: 'East Siang' },
      { id: 'DST-AR-05', stateId: 'ST-002', name: 'Itanagar (Capital Complex)' },
      { id: 'DST-AR-06', stateId: 'ST-002', name: 'Kurung Kumey' },
      { id: 'DST-AR-07', stateId: 'ST-002', name: 'Lohit' },
      { id: 'DST-AR-08', stateId: 'ST-002', name: 'Longding' },
      { id: 'DST-AR-09', stateId: 'ST-002', name: 'Lower Dibang Valley' },
      { id: 'DST-AR-10', stateId: 'ST-002', name: 'Lower Siang' },
      { id: 'DST-AR-11', stateId: 'ST-002', name: 'Lower Subansiri' },
      { id: 'DST-AR-12', stateId: 'ST-002', name: 'Namsai' },
      { id: 'DST-AR-13', stateId: 'ST-002', name: 'Papum Pare' },
      { id: 'DST-AR-14', stateId: 'ST-002', name: 'Siang' },
      { id: 'DST-AR-15', stateId: 'ST-002', name: 'Tawang' },
      { id: 'DST-AR-16', stateId: 'ST-002', name: 'Tirap' },
      { id: 'DST-AR-17', stateId: 'ST-002', name: 'Upper Dibang Valley' },
      { id: 'DST-AR-18', stateId: 'ST-002', name: 'Upper Siang' },
      { id: 'DST-AR-19', stateId: 'ST-002', name: 'Upper Subansiri' },
      { id: 'DST-AR-20', stateId: 'ST-002', name: 'West Kameng' },
      { id: 'DST-AR-21', stateId: 'ST-002', name: 'West Siang' },
      // Assam
      { id: 'DST-AS-01', stateId: 'ST-003', name: 'Baksa' },
      { id: 'DST-AS-02', stateId: 'ST-003', name: 'Barpeta' },
      { id: 'DST-AS-03', stateId: 'ST-003', name: 'Biswanath' },
      { id: 'DST-AS-04', stateId: 'ST-003', name: 'Bongaigaon' },
      { id: 'DST-AS-05', stateId: 'ST-003', name: 'Cachar' },
      { id: 'DST-AS-06', stateId: 'ST-003', name: 'Charaideo' },
      { id: 'DST-AS-07', stateId: 'ST-003', name: 'Chirang' },
      { id: 'DST-AS-08', stateId: 'ST-003', name: 'Darrang' },
      { id: 'DST-AS-09', stateId: 'ST-003', name: 'Dhemaji' },
      { id: 'DST-AS-10', stateId: 'ST-003', name: 'Dhubri' },
      { id: 'DST-AS-11', stateId: 'ST-003', name: 'Dibrugarh' },
      { id: 'DST-AS-12', stateId: 'ST-003', name: 'Dima Hasao' },
      { id: 'DST-AS-13', stateId: 'ST-003', name: 'Goalpara' },
      { id: 'DST-AS-14', stateId: 'ST-003', name: 'Golaghat' },
      { id: 'DST-AS-15', stateId: 'ST-003', name: 'Hailakandi' },
      { id: 'DST-AS-16', stateId: 'ST-003', name: 'Hojai' },
      { id: 'DST-AS-17', stateId: 'ST-003', name: 'Jorhat' },
      { id: 'DST-AS-18', stateId: 'ST-003', name: 'Kamrup' },
      { id: 'DST-AS-19', stateId: 'ST-003', name: 'Kamrup Metropolitan' },
      { id: 'DST-AS-20', stateId: 'ST-003', name: 'Karbi Anglong' },
      { id: 'DST-AS-21', stateId: 'ST-003', name: 'Karimganj' },
      { id: 'DST-AS-22', stateId: 'ST-003', name: 'Kokrajhar' },
      { id: 'DST-AS-23', stateId: 'ST-003', name: 'Lakhimpur' },
      { id: 'DST-AS-24', stateId: 'ST-003', name: 'Majuli' },
      { id: 'DST-AS-25', stateId: 'ST-003', name: 'Morigaon' },
      { id: 'DST-AS-26', stateId: 'ST-003', name: 'Nagaon' },
      { id: 'DST-AS-27', stateId: 'ST-003', name: 'Nalbari' },
      { id: 'DST-AS-28', stateId: 'ST-003', name: 'Sivasagar' },
      { id: 'DST-AS-29', stateId: 'ST-003', name: 'Sonitpur' },
      { id: 'DST-AS-30', stateId: 'ST-003', name: 'South Salmara-Mankachar' },
      { id: 'DST-AS-31', stateId: 'ST-003', name: 'Tinsukia' },
      { id: 'DST-AS-32', stateId: 'ST-003', name: 'Udalguri' },
      { id: 'DST-AS-33', stateId: 'ST-003', name: 'West Karbi Anglong' },
      // Bihar
      { id: 'DST-BR-01', stateId: 'ST-004', name: 'Araria' },
      { id: 'DST-BR-02', stateId: 'ST-004', name: 'Arwal' },
      { id: 'DST-BR-03', stateId: 'ST-004', name: 'Aurangabad' },
      { id: 'DST-BR-04', stateId: 'ST-004', name: 'Banka' },
      { id: 'DST-BR-05', stateId: 'ST-004', name: 'Begusarai' },
      { id: 'DST-BR-06', stateId: 'ST-004', name: 'Bhagalpur' },
      { id: 'DST-BR-07', stateId: 'ST-004', name: 'Bhojpur' },
      { id: 'DST-BR-08', stateId: 'ST-004', name: 'Buxar' },
      { id: 'DST-BR-09', stateId: 'ST-004', name: 'Darbhanga' },
      { id: 'DST-BR-10', stateId: 'ST-004', name: 'East Champaran' },
      { id: 'DST-BR-11', stateId: 'ST-004', name: 'Gaya' },
      { id: 'DST-BR-12', stateId: 'ST-004', name: 'Gopalganj' },
      { id: 'DST-BR-13', stateId: 'ST-004', name: 'Jamui' },
      { id: 'DST-BR-14', stateId: 'ST-004', name: 'Jehanabad' },
      { id: 'DST-BR-15', stateId: 'ST-004', name: 'Kaimur' },
      { id: 'DST-BR-16', stateId: 'ST-004', name: 'Katihar' },
      { id: 'DST-BR-17', stateId: 'ST-004', name: 'Khagaria' },
      { id: 'DST-BR-18', stateId: 'ST-004', name: 'Kishanganj' },
      { id: 'DST-BR-19', stateId: 'ST-004', name: 'Lakhisarai' },
      { id: 'DST-BR-20', stateId: 'ST-004', name: 'Madhepura' },
      { id: 'DST-BR-21', stateId: 'ST-004', name: 'Madhubani' },
      { id: 'DST-BR-22', stateId: 'ST-004', name: 'Munger' },
      { id: 'DST-BR-23', stateId: 'ST-004', name: 'Muzaffarpur' },
      { id: 'DST-BR-24', stateId: 'ST-004', name: 'Nalanda' },
      { id: 'DST-BR-25', stateId: 'ST-004', name: 'Nawada' },
      { id: 'DST-BR-26', stateId: 'ST-004', name: 'Patna' },
      { id: 'DST-BR-27', stateId: 'ST-004', name: 'Purnia' },
      { id: 'DST-BR-28', stateId: 'ST-004', name: 'Rohtas' },
      { id: 'DST-BR-29', stateId: 'ST-004', name: 'Saharsa' },
      { id: 'DST-BR-30', stateId: 'ST-004', name: 'Samastipur' },
      { id: 'DST-BR-31', stateId: 'ST-004', name: 'Saran' },
      { id: 'DST-BR-32', stateId: 'ST-004', name: 'Sheikhpura' },
      { id: 'DST-BR-33', stateId: 'ST-004', name: 'Sheohar' },
      { id: 'DST-BR-34', stateId: 'ST-004', name: 'Sitamarhi' },
      { id: 'DST-BR-35', stateId: 'ST-004', name: 'Siwan' },
      { id: 'DST-BR-36', stateId: 'ST-004', name: 'Supaul' },
      { id: 'DST-BR-37', stateId: 'ST-004', name: 'Vaishali' },
      { id: 'DST-BR-38', stateId: 'ST-004', name: 'West Champaran' },
      // Chhattisgarh
      { id: 'DST-CG-01', stateId: 'ST-005', name: 'Balod' },
      { id: 'DST-CG-02', stateId: 'ST-005', name: 'Baloda Bazar' },
      { id: 'DST-CG-03', stateId: 'ST-005', name: 'Balrampur' },
      { id: 'DST-CG-04', stateId: 'ST-005', name: 'Bastar' },
      { id: 'DST-CG-05', stateId: 'ST-005', name: 'Bemetara' },
      { id: 'DST-CG-06', stateId: 'ST-005', name: 'Bijapur' },
      { id: 'DST-CG-07', stateId: 'ST-005', name: 'Bilaspur' },
      { id: 'DST-CG-08', stateId: 'ST-005', name: 'Dantewada' },
      { id: 'DST-CG-09', stateId: 'ST-005', name: 'Dhamtari' },
      { id: 'DST-CG-10', stateId: 'ST-005', name: 'Durg' },
      { id: 'DST-CG-11', stateId: 'ST-005', name: 'Gariaband' },
      { id: 'DST-CG-12', stateId: 'ST-005', name: 'Gaurela-Pendra-Marwahi' },
      { id: 'DST-CG-13', stateId: 'ST-005', name: 'Janjgir-Champa' },
      { id: 'DST-CG-14', stateId: 'ST-005', name: 'Jashpur' },
      { id: 'DST-CG-15', stateId: 'ST-005', name: 'Kabirdham' },
      { id: 'DST-CG-16', stateId: 'ST-005', name: 'Kanker' },
      { id: 'DST-CG-17', stateId: 'ST-005', name: 'Kondagaon' },
      { id: 'DST-CG-18', stateId: 'ST-005', name: 'Korba' },
      { id: 'DST-CG-19', stateId: 'ST-005', name: 'Koriya' },
      { id: 'DST-CG-20', stateId: 'ST-005', name: 'Mahasamund' },
      { id: 'DST-CG-21', stateId: 'ST-005', name: 'Mungeli' },
      { id: 'DST-CG-22', stateId: 'ST-005', name: 'Narayanpur' },
      { id: 'DST-CG-23', stateId: 'ST-005', name: 'Raigarh' },
      { id: 'DST-CG-24', stateId: 'ST-005', name: 'Raipur' },
      { id: 'DST-CG-25', stateId: 'ST-005', name: 'Rajnandgaon' },
      { id: 'DST-CG-26', stateId: 'ST-005', name: 'Sukma' },
      { id: 'DST-CG-27', stateId: 'ST-005', name: 'Surajpur' },
      { id: 'DST-CG-28', stateId: 'ST-005', name: 'Surguja' },
      // Goa
      { id: 'DST-GA-01', stateId: 'ST-006', name: 'North Goa' },
      { id: 'DST-GA-02', stateId: 'ST-006', name: 'South Goa' },
      // Gujarat
      { id: 'DST-GJ-01', stateId: 'ST-007', name: 'Ahmedabad' },
      { id: 'DST-GJ-02', stateId: 'ST-007', name: 'Amreli' },
      { id: 'DST-GJ-03', stateId: 'ST-007', name: 'Anand' },
      { id: 'DST-GJ-04', stateId: 'ST-007', name: 'Aravalli' },
      { id: 'DST-GJ-05', stateId: 'ST-007', name: 'Banaskantha' },
      { id: 'DST-GJ-06', stateId: 'ST-007', name: 'Bharuch' },
      { id: 'DST-GJ-07', stateId: 'ST-007', name: 'Bhavnagar' },
      { id: 'DST-GJ-08', stateId: 'ST-007', name: 'Botad' },
      { id: 'DST-GJ-09', stateId: 'ST-007', name: 'Chhota Udaipur' },
      { id: 'DST-GJ-10', stateId: 'ST-007', name: 'Dahod' },
      { id: 'DST-GJ-11', stateId: 'ST-007', name: 'Dang' },
      { id: 'DST-GJ-12', stateId: 'ST-007', name: 'Devbhumi Dwarka' },
      { id: 'DST-GJ-13', stateId: 'ST-007', name: 'Gandhinagar' },
      { id: 'DST-GJ-14', stateId: 'ST-007', name: 'Gir Somnath' },
      { id: 'DST-GJ-15', stateId: 'ST-007', name: 'Jamnagar' },
      { id: 'DST-GJ-16', stateId: 'ST-007', name: 'Junagadh' },
      { id: 'DST-GJ-17', stateId: 'ST-007', name: 'Kheda' },
      { id: 'DST-GJ-18', stateId: 'ST-007', name: 'Kutch' },
      { id: 'DST-GJ-19', stateId: 'ST-007', name: 'Mahesana' },
      { id: 'DST-GJ-20', stateId: 'ST-007', name: 'Mahisagar' },
      { id: 'DST-GJ-21', stateId: 'ST-007', name: 'Morbi' },
      { id: 'DST-GJ-22', stateId: 'ST-007', name: 'Narmada' },
      { id: 'DST-GJ-23', stateId: 'ST-007', name: 'Navsari' },
      { id: 'DST-GJ-24', stateId: 'ST-007', name: 'Panchmahal' },
      { id: 'DST-GJ-25', stateId: 'ST-007', name: 'Patan' },
      { id: 'DST-GJ-26', stateId: 'ST-007', name: 'Porbandar' },
      { id: 'DST-GJ-27', stateId: 'ST-007', name: 'Rajkot' },
      { id: 'DST-GJ-28', stateId: 'ST-007', name: 'Sabarkantha' },
      { id: 'DST-GJ-29', stateId: 'ST-007', name: 'Surat' },
      { id: 'DST-GJ-30', stateId: 'ST-007', name: 'Surendranagar' },
      { id: 'DST-GJ-31', stateId: 'ST-007', name: 'Tapi' },
      { id: 'DST-GJ-32', stateId: 'ST-007', name: 'Vadodara' },
      { id: 'DST-GJ-33', stateId: 'ST-007', name: 'Valsad' },
      // Haryana
      { id: 'DST-HR-01', stateId: 'ST-008', name: 'Ambala' },
      { id: 'DST-HR-02', stateId: 'ST-008', name: 'Bhiwani' },
      { id: 'DST-HR-03', stateId: 'ST-008', name: 'Charkhi Dadri' },
      { id: 'DST-HR-04', stateId: 'ST-008', name: 'Faridabad' },
      { id: 'DST-HR-05', stateId: 'ST-008', name: 'Fatehabad' },
      { id: 'DST-HR-06', stateId: 'ST-008', name: 'Gurugram' },
      { id: 'DST-HR-07', stateId: 'ST-008', name: 'Hisar' },
      { id: 'DST-HR-08', stateId: 'ST-008', name: 'Jhajjar' },
      { id: 'DST-HR-09', stateId: 'ST-008', name: 'Jind' },
      { id: 'DST-HR-10', stateId: 'ST-008', name: 'Kaithal' },
      { id: 'DST-HR-11', stateId: 'ST-008', name: 'Karnal' },
      { id: 'DST-HR-12', stateId: 'ST-008', name: 'Kurukshetra' },
      { id: 'DST-HR-13', stateId: 'ST-008', name: 'Mahendragarh' },
      { id: 'DST-HR-14', stateId: 'ST-008', name: 'Nuh' },
      { id: 'DST-HR-15', stateId: 'ST-008', name: 'Palwal' },
      { id: 'DST-HR-16', stateId: 'ST-008', name: 'Panchkula' },
      { id: 'DST-HR-17', stateId: 'ST-008', name: 'Panipat' },
      { id: 'DST-HR-18', stateId: 'ST-008', name: 'Rewari' },
      { id: 'DST-HR-19', stateId: 'ST-008', name: 'Rohtak' },
      { id: 'DST-HR-20', stateId: 'ST-008', name: 'Sirsa' },
      { id: 'DST-HR-21', stateId: 'ST-008', name: 'Sonipat' },
      { id: 'DST-HR-22', stateId: 'ST-008', name: 'Yamunanagar' },
      // Himachal Pradesh
      { id: 'DST-HP-01', stateId: 'ST-009', name: 'Bilaspur' },
      { id: 'DST-HP-02', stateId: 'ST-009', name: 'Chamba' },
      { id: 'DST-HP-03', stateId: 'ST-009', name: 'Hamirpur' },
      { id: 'DST-HP-04', stateId: 'ST-009', name: 'Kangra' },
      { id: 'DST-HP-05', stateId: 'ST-009', name: 'Kinnaur' },
      { id: 'DST-HP-06', stateId: 'ST-009', name: 'Kullu' },
      { id: 'DST-HP-07', stateId: 'ST-009', name: 'Lahaul and Spiti' },
      { id: 'DST-HP-08', stateId: 'ST-009', name: 'Mandi' },
      { id: 'DST-HP-09', stateId: 'ST-009', name: 'Shimla' },
      { id: 'DST-HP-10', stateId: 'ST-009', name: 'Sirmaur' },
      { id: 'DST-HP-11', stateId: 'ST-009', name: 'Solan' },
      { id: 'DST-HP-12', stateId: 'ST-009', name: 'Una' },
      // Jharkhand
      { id: 'DST-JH-01', stateId: 'ST-010', name: 'Bokaro' },
      { id: 'DST-JH-02', stateId: 'ST-010', name: 'Chatra' },
      { id: 'DST-JH-03', stateId: 'ST-010', name: 'Deoghar' },
      { id: 'DST-JH-04', stateId: 'ST-010', name: 'Dhanbad' },
      { id: 'DST-JH-05', stateId: 'ST-010', name: 'Dumka' },
      { id: 'DST-JH-06', stateId: 'ST-010', name: 'East Singhbhum' },
      { id: 'DST-JH-07', stateId: 'ST-010', name: 'Garhwa' },
      { id: 'DST-JH-08', stateId: 'ST-010', name: 'Giridih' },
      { id: 'DST-JH-09', stateId: 'ST-010', name: 'Godda' },
      { id: 'DST-JH-10', stateId: 'ST-010', name: 'Gumla' },
      { id: 'DST-JH-11', stateId: 'ST-010', name: 'Hazaribagh' },
      { id: 'DST-JH-12', stateId: 'ST-010', name: 'Jamtara' },
      { id: 'DST-JH-13', stateId: 'ST-010', name: 'Khunti' },
      { id: 'DST-JH-14', stateId: 'ST-010', name: 'Koderma' },
      { id: 'DST-JH-15', stateId: 'ST-010', name: 'Latehar' },
      { id: 'DST-JH-16', stateId: 'ST-010', name: 'Lohardaga' },
      { id: 'DST-JH-17', stateId: 'ST-010', name: 'Pakur' },
      { id: 'DST-JH-18', stateId: 'ST-010', name: 'Palamu' },
      { id: 'DST-JH-19', stateId: 'ST-010', name: 'Ramgarh' },
      { id: 'DST-JH-20', stateId: 'ST-010', name: 'Ranchi' },
      { id: 'DST-JH-21', stateId: 'ST-010', name: 'Sahebganj' },
      { id: 'DST-JH-22', stateId: 'ST-010', name: 'Seraikela Kharsawan' },
      { id: 'DST-JH-23', stateId: 'ST-010', name: 'Simdega' },
      { id: 'DST-JH-24', stateId: 'ST-010', name: 'West Singhbhum' },
      // Karnataka
      { id: 'DST-KA-01', stateId: 'ST-011', name: 'Bagalkote' },
      { id: 'DST-KA-02', stateId: 'ST-011', name: 'Bangalore Rural' },
      { id: 'DST-KA-03', stateId: 'ST-011', name: 'Bangalore Urban' },
      { id: 'DST-KA-04', stateId: 'ST-011', name: 'Belagavi' },
      { id: 'DST-KA-05', stateId: 'ST-011', name: 'Bellary' },
      { id: 'DST-KA-06', stateId: 'ST-011', name: 'Bidar' },
      { id: 'DST-KA-07', stateId: 'ST-011', name: 'Chamarajanagara' },
      { id: 'DST-KA-08', stateId: 'ST-011', name: 'Chikkamagaluru' },
      { id: 'DST-KA-09', stateId: 'ST-011', name: 'Chikkaballapura' },
      { id: 'DST-KA-10', stateId: 'ST-011', name: 'Chitradurga' },
      { id: 'DST-KA-11', stateId: 'ST-011', name: 'Dakshina Kannada' },
      { id: 'DST-KA-12', stateId: 'ST-011', name: 'Davanagere' },
      { id: 'DST-KA-13', stateId: 'ST-011', name: 'Dharwad' },
      { id: 'DST-KA-14', stateId: 'ST-011', name: 'Gadag' },
      { id: 'DST-KA-15', stateId: 'ST-011', name: 'Hassan' },
      { id: 'DST-KA-16', stateId: 'ST-011', name: 'Haveri' },
      { id: 'DST-KA-17', stateId: 'ST-011', name: 'Kalaburagi' },
      { id: 'DST-KA-18', stateId: 'ST-011', name: 'Kodagu' },
      { id: 'DST-KA-19', stateId: 'ST-011', name: 'Kolar' },
      { id: 'DST-KA-20', stateId: 'ST-011', name: 'Koppal' },
      { id: 'DST-KA-21', stateId: 'ST-011', name: 'Mandya' },
      { id: 'DST-KA-22', stateId: 'ST-011', name: 'Mysuru' },
      { id: 'DST-KA-23', stateId: 'ST-011', name: 'Raichur' },
      { id: 'DST-KA-24', stateId: 'ST-011', name: 'Ramanagara' },
      { id: 'DST-KA-25', stateId: 'ST-011', name: 'Shivamogga' },
      { id: 'DST-KA-26', stateId: 'ST-011', name: 'Tumakuru' },
      { id: 'DST-KA-27', stateId: 'ST-011', name: 'Udupi' },
      { id: 'DST-KA-28', stateId: 'ST-011', name: 'Uttara Kannada' },
      { id: 'DST-KA-29', stateId: 'ST-011', name: 'Vijayapura' },
      { id: 'DST-KA-30', stateId: 'ST-011', name: 'Yadgir' },
      // Kerala
      { id: 'DST-KL-01', stateId: 'ST-012', name: 'Alappuzha' },
      { id: 'DST-KL-02', stateId: 'ST-012', name: 'Ernakulam' },
      { id: 'DST-KL-03', stateId: 'ST-012', name: 'Idukki' },
      { id: 'DST-KL-04', stateId: 'ST-012', name: 'Kannur' },
      { id: 'DST-KL-05', stateId: 'ST-012', name: 'Kasaragod' },
      { id: 'DST-KL-06', stateId: 'ST-012', name: 'Kollam' },
      { id: 'DST-KL-07', stateId: 'ST-012', name: 'Kottayam' },
      { id: 'DST-KL-08', stateId: 'ST-012', name: 'Kozhikode' },
      { id: 'DST-KL-09', stateId: 'ST-012', name: 'Malappuram' },
      { id: 'DST-KL-10', stateId: 'ST-012', name: 'Palakkad' },
      { id: 'DST-KL-11', stateId: 'ST-012', name: 'Pathanamthitta' },
      { id: 'DST-KL-12', stateId: 'ST-012', name: 'Thiruvananthapuram' },
      { id: 'DST-KL-13', stateId: 'ST-012', name: 'Thrissur' },
      { id: 'DST-KL-14', stateId: 'ST-012', name: 'Wayanad' },
      // Madhya Pradesh
      { id: 'DST-MP-01', stateId: 'ST-013', name: 'Agar Malwa' },
      { id: 'DST-MP-02', stateId: 'ST-013', name: 'Alirajpur' },
      { id: 'DST-MP-03', stateId: 'ST-013', name: 'Anuppur' },
      { id: 'DST-MP-04', stateId: 'ST-013', name: 'Ashoknagar' },
      { id: 'DST-MP-05', stateId: 'ST-013', name: 'Balaghat' },
      { id: 'DST-MP-06', stateId: 'ST-013', name: 'Barwani' },
      { id: 'DST-MP-07', stateId: 'ST-013', name: 'Betul' },
      { id: 'DST-MP-08', stateId: 'ST-013', name: 'Bhind' },
      { id: 'DST-MP-09', stateId: 'ST-013', name: 'Bhopal' },
      { id: 'DST-MP-10', stateId: 'ST-013', name: 'Burhanpur' },
      { id: 'DST-MP-11', stateId: 'ST-013', name: 'Chhatarpur' },
      { id: 'DST-MP-12', stateId: 'ST-013', name: 'Chhindwara' },
      { id: 'DST-MP-13', stateId: 'ST-013', name: 'Damoh' },
      { id: 'DST-MP-14', stateId: 'ST-013', name: 'Datia' },
      { id: 'DST-MP-15', stateId: 'ST-013', name: 'Dewas' },
      { id: 'DST-MP-16', stateId: 'ST-013', name: 'Dhar' },
      { id: 'DST-MP-17', stateId: 'ST-013', name: 'Dindori' },
      { id: 'DST-MP-18', stateId: 'ST-013', name: 'Guna' },
      { id: 'DST-MP-19', stateId: 'ST-013', name: 'Gwalior' },
      { id: 'DST-MP-20', stateId: 'ST-013', name: 'Harda' },
      { id: 'DST-MP-21', stateId: 'ST-013', name: 'Hoshangabad' },
      { id: 'DST-MP-22', stateId: 'ST-013', name: 'Indore' },
      { id: 'DST-MP-23', stateId: 'ST-013', name: 'Jabalpur' },
      { id: 'DST-MP-24', stateId: 'ST-013', name: 'Jhabua' },
      { id: 'DST-MP-25', stateId: 'ST-013', name: 'Katni' },
      { id: 'DST-MP-26', stateId: 'ST-013', name: 'Khandwa' },
      { id: 'DST-MP-27', stateId: 'ST-013', name: 'Khargone' },
      { id: 'DST-MP-28', stateId: 'ST-013', name: 'Mandla' },
      { id: 'DST-MP-29', stateId: 'ST-013', name: 'Mandsaur' },
      { id: 'DST-MP-30', stateId: 'ST-013', name: 'Morena' },
      { id: 'DST-MP-31', stateId: 'ST-013', name: 'Narsinghpur' },
      { id: 'DST-MP-32', stateId: 'ST-013', name: 'Neemuch' },
      { id: 'DST-MP-33', stateId: 'ST-013', name: 'Niwari' },
      { id: 'DST-MP-34', stateId: 'ST-013', name: 'Panna' },
      { id: 'DST-MP-35', stateId: 'ST-013', name: 'Raisen' },
      { id: 'DST-MP-36', stateId: 'ST-013', name: 'Rajgarh' },
      { id: 'DST-MP-37', stateId: 'ST-013', name: 'Ratlam' },
      { id: 'DST-MP-38', stateId: 'ST-013', name: 'Rewa' },
      { id: 'DST-MP-39', stateId: 'ST-013', name: 'Sagar' },
      { id: 'DST-MP-40', stateId: 'ST-013', name: 'Satna' },
      { id: 'DST-MP-41', stateId: 'ST-013', name: 'Sehore' },
      { id: 'DST-MP-42', stateId: 'ST-013', name: 'Seoni' },
      { id: 'DST-MP-43', stateId: 'ST-013', name: 'Shahdol' },
      { id: 'DST-MP-44', stateId: 'ST-013', name: 'Shajapur' },
      { id: 'DST-MP-45', stateId: 'ST-013', name: 'Sheopur' },
      { id: 'DST-MP-46', stateId: 'ST-013', name: 'Shivpuri' },
      { id: 'DST-MP-47', stateId: 'ST-013', name: 'Sidhi' },
      { id: 'DST-MP-48', stateId: 'ST-013', name: 'Singrauli' },
      { id: 'DST-MP-49', stateId: 'ST-013', name: 'Tikamgarh' },
      { id: 'DST-MP-50', stateId: 'ST-013', name: 'Ujjain' },
      { id: 'DST-MP-51', stateId: 'ST-013', name: 'Umaria' },
      { id: 'DST-MP-52', stateId: 'ST-013', name: 'Vidisha' },
      // Maharashtra
      { id: 'DST-MH-01', stateId: 'ST-014', name: 'Ahmednagar' },
      { id: 'DST-MH-02', stateId: 'ST-014', name: 'Akola' },
      { id: 'DST-MH-03', stateId: 'ST-014', name: 'Amravati' },
      { id: 'DST-MH-04', stateId: 'ST-014', name: 'Aurangabad' },
      { id: 'DST-MH-05', stateId: 'ST-014', name: 'Beed' },
      { id: 'DST-MH-06', stateId: 'ST-014', name: 'Bhandara' },
      { id: 'DST-MH-07', stateId: 'ST-014', name: 'Buldhana' },
      { id: 'DST-MH-08', stateId: 'ST-014', name: 'Chandrapur' },
      { id: 'DST-MH-09', stateId: 'ST-014', name: 'Dhule' },
      { id: 'DST-MH-10', stateId: 'ST-014', name: 'Gadchiroli' },
      { id: 'DST-MH-11', stateId: 'ST-014', name: 'Gondia' },
      { id: 'DST-MH-12', stateId: 'ST-014', name: 'Hingoli' },
      { id: 'DST-MH-13', stateId: 'ST-014', name: 'Jalgaon' },
      { id: 'DST-MH-14', stateId: 'ST-014', name: 'Jalna' },
      { id: 'DST-MH-15', stateId: 'ST-014', name: 'Kolhapur' },
      { id: 'DST-MH-16', stateId: 'ST-014', name: 'Latur' },
      { id: 'DST-MH-17', stateId: 'ST-014', name: 'Mumbai City' },
      { id: 'DST-MH-18', stateId: 'ST-014', name: 'Mumbai Suburban' },
      { id: 'DST-MH-19', stateId: 'ST-014', name: 'Nagpur' },
      { id: 'DST-MH-20', stateId: 'ST-014', name: 'Nanded' },
      { id: 'DST-MH-21', stateId: 'ST-014', name: 'Nandurbar' },
      { id: 'DST-MH-22', stateId: 'ST-014', name: 'Nashik' },
      { id: 'DST-MH-23', stateId: 'ST-014', name: 'Osmanabad' },
      { id: 'DST-MH-24', stateId: 'ST-014', name: 'Palghar' },
      { id: 'DST-MH-25', stateId: 'ST-014', name: 'Parbhani' },
      { id: 'DST-MH-26', stateId: 'ST-014', name: 'Pune' },
      { id: 'DST-MH-27', stateId: 'ST-014', name: 'Raigad' },
      { id: 'DST-MH-28', stateId: 'ST-014', name: 'Ratnagiri' },
      { id: 'DST-MH-29', stateId: 'ST-014', name: 'Sangli' },
      { id: 'DST-MH-30', stateId: 'ST-014', name: 'Satara' },
      { id: 'DST-MH-31', stateId: 'ST-014', name: 'Sindhudurg' },
      { id: 'DST-MH-32', stateId: 'ST-014', name: 'Solapur' },
      { id: 'DST-MH-33', stateId: 'ST-014', name: 'Thane' },
      { id: 'DST-MH-34', stateId: 'ST-014', name: 'Wardha' },
      { id: 'DST-MH-35', stateId: 'ST-014', name: 'Washim' },
      { id: 'DST-MH-36', stateId: 'ST-014', name: 'Yavatmal' },
      // Manipur
      { id: 'DST-MN-01', stateId: 'ST-015', name: 'Bishnupur' },
      { id: 'DST-MN-02', stateId: 'ST-015', name: 'Chandel' },
      { id: 'DST-MN-03', stateId: 'ST-015', name: 'Churachandpur' },
      { id: 'DST-MN-04', stateId: 'ST-015', name: 'Imphal East' },
      { id: 'DST-MN-05', stateId: 'ST-015', name: 'Imphal West' },
      { id: 'DST-MN-06', stateId: 'ST-015', name: 'Jiribam' },
      { id: 'DST-MN-07', stateId: 'ST-015', name: 'Kakching' },
      { id: 'DST-MN-08', stateId: 'ST-015', name: 'Kamjong' },
      { id: 'DST-MN-09', stateId: 'ST-015', name: 'Kangpokpi' },
      { id: 'DST-MN-10', stateId: 'ST-015', name: 'Noney' },
      { id: 'DST-MN-11', stateId: 'ST-015', name: 'Pherzawl' },
      { id: 'DST-MN-12', stateId: 'ST-015', name: 'Senapati' },
      { id: 'DST-MN-13', stateId: 'ST-015', name: 'Tamenglong' },
      { id: 'DST-MN-14', stateId: 'ST-015', name: 'Tengnoupal' },
      { id: 'DST-MN-15', stateId: 'ST-015', name: 'Thoubal' },
      { id: 'DST-MN-16', stateId: 'ST-015', name: 'Ukhrul' },
      // Meghalaya
      { id: 'DST-ML-01', stateId: 'ST-016', name: 'East Garo Hills' },
      { id: 'DST-ML-02', stateId: 'ST-016', name: 'East Jaintia Hills' },
      { id: 'DST-ML-03', stateId: 'ST-016', name: 'East Khasi Hills' },
      { id: 'DST-ML-04', stateId: 'ST-016', name: 'North Garo Hills' },
      { id: 'DST-ML-05', stateId: 'ST-016', name: 'Ri Bhoi' },
      { id: 'DST-ML-06', stateId: 'ST-016', name: 'South Garo Hills' },
      { id: 'DST-ML-07', stateId: 'ST-016', name: 'South West Garo Hills' },
      { id: 'DST-ML-08', stateId: 'ST-016', name: 'South West Khasi Hills' },
      { id: 'DST-ML-09', stateId: 'ST-016', name: 'West Garo Hills' },
      { id: 'DST-ML-10', stateId: 'ST-016', name: 'West Jaintia Hills' },
      { id: 'DST-ML-11', stateId: 'ST-016', name: 'West Khasi Hills' },
      // Mizoram
      { id: 'DST-MZ-01', stateId: 'ST-017', name: 'Aizawl' },
      { id: 'DST-MZ-02', stateId: 'ST-017', name: 'Champhai' },
      { id: 'DST-MZ-03', stateId: 'ST-017', name: 'Hnahthial' },
      { id: 'DST-MZ-04', stateId: 'ST-017', name: 'Khawzawl' },
      { id: 'DST-MZ-05', stateId: 'ST-017', name: 'Kolasib' },
      { id: 'DST-MZ-06', stateId: 'ST-017', name: 'Lawngtlai' },
      { id: 'DST-MZ-07', stateId: 'ST-017', name: 'Lunglei' },
      { id: 'DST-MZ-08', stateId: 'ST-017', name: 'Mamit' },
      { id: 'DST-MZ-09', stateId: 'ST-017', name: 'Saiha' },
      { id: 'DST-MZ-10', stateId: 'ST-017', name: 'Saitual' },
      { id: 'DST-MZ-11', stateId: 'ST-017', name: 'Serchhip' },
      // Nagaland
      { id: 'DST-NL-01', stateId: 'ST-018', name: 'Dimapur' },
      { id: 'DST-NL-02', stateId: 'ST-018', name: 'Kiphire' },
      { id: 'DST-NL-03', stateId: 'ST-018', name: 'Kohima' },
      { id: 'DST-NL-04', stateId: 'ST-018', name: 'Longleng' },
      { id: 'DST-NL-05', stateId: 'ST-018', name: 'Mokokchung' },
      { id: 'DST-NL-06', stateId: 'ST-018', name: 'Mon' },
      { id: 'DST-NL-07', stateId: 'ST-018', name: 'Noklak' },
      { id: 'DST-NL-08', stateId: 'ST-018', name: 'Peren' },
      { id: 'DST-NL-09', stateId: 'ST-018', name: 'Phek' },
      { id: 'DST-NL-10', stateId: 'ST-018', name: 'Tuensang' },
      { id: 'DST-NL-11', stateId: 'ST-018', name: 'Wokha' },
      { id: 'DST-NL-12', stateId: 'ST-018', name: 'Zunheboto' },
      // Odisha
      { id: 'DST-OD-01', stateId: 'ST-019', name: 'Angul' },
      { id: 'DST-OD-02', stateId: 'ST-019', name: 'Balangir' },
      { id: 'DST-OD-03', stateId: 'ST-019', name: 'Balasore' },
      { id: 'DST-OD-04', stateId: 'ST-019', name: 'Bargarh' },
      { id: 'DST-OD-05', stateId: 'ST-019', name: 'Bhadrak' },
      { id: 'DST-OD-06', stateId: 'ST-019', name: 'Boudh' },
      { id: 'DST-OD-07', stateId: 'ST-019', name: 'Cuttack' },
      { id: 'DST-OD-08', stateId: 'ST-019', name: 'Deogarh' },
      { id: 'DST-OD-09', stateId: 'ST-019', name: 'Dhenkanal' },
      { id: 'DST-OD-10', stateId: 'ST-019', name: 'Gajapati' },
      { id: 'DST-OD-11', stateId: 'ST-019', name: 'Ganjam' },
      { id: 'DST-OD-12', stateId: 'ST-019', name: 'Jagatsinghpur' },
      { id: 'DST-OD-13', stateId: 'ST-019', name: 'Jajpur' },
      { id: 'DST-OD-14', stateId: 'ST-019', name: 'Jharsuguda' },
      { id: 'DST-OD-15', stateId: 'ST-019', name: 'Kalahandi' },
      { id: 'DST-OD-16', stateId: 'ST-019', name: 'Kandhamal' },
      { id: 'DST-OD-17', stateId: 'ST-019', name: 'Kendrapara' },
      { id: 'DST-OD-18', stateId: 'ST-019', name: 'Kendujhar' },
      { id: 'DST-OD-19', stateId: 'ST-019', name: 'Khordha' },
      { id: 'DST-OD-20', stateId: 'ST-019', name: 'Koraput' },
      { id: 'DST-OD-21', stateId: 'ST-019', name: 'Malkangiri' },
      { id: 'DST-OD-22', stateId: 'ST-019', name: 'Mayurbhanj' },
      { id: 'DST-OD-23', stateId: 'ST-019', name: 'Nabarangpur' },
      { id: 'DST-OD-24', stateId: 'ST-019', name: 'Nayagarh' },
      { id: 'DST-OD-25', stateId: 'ST-019', name: 'Nuapada' },
      { id: 'DST-OD-26', stateId: 'ST-019', name: 'Puri' },
      { id: 'DST-OD-27', stateId: 'ST-019', name: 'Rayagada' },
      { id: 'DST-OD-28', stateId: 'ST-019', name: 'Sambalpur' },
      { id: 'DST-OD-29', stateId: 'ST-019', name: 'Subarnapur' },
      { id: 'DST-OD-30', stateId: 'ST-019', name: 'Sundargarh' },
      // Punjab
      { id: 'DST-PB-01', stateId: 'ST-020', name: 'Amritsar' },
      { id: 'DST-PB-02', stateId: 'ST-020', name: 'Barnala' },
      { id: 'DST-PB-03', stateId: 'ST-020', name: 'Bathinda' },
      { id: 'DST-PB-04', stateId: 'ST-020', name: 'Faridkot' },
      { id: 'DST-PB-05', stateId: 'ST-020', name: 'Fatehgarh Sahib' },
      { id: 'DST-PB-06', stateId: 'ST-020', name: 'Fazilka' },
      { id: 'DST-PB-07', stateId: 'ST-020', name: 'Ferozepur' },
      { id: 'DST-PB-08', stateId: 'ST-020', name: 'Gurdaspur' },
      { id: 'DST-PB-09', stateId: 'ST-020', name: 'Hoshiarpur' },
      { id: 'DST-PB-10', stateId: 'ST-020', name: 'Jalandhar' },
      { id: 'DST-PB-11', stateId: 'ST-020', name: 'Kapurthala' },
      { id: 'DST-PB-12', stateId: 'ST-020', name: 'Ludhiana' },
      { id: 'DST-PB-13', stateId: 'ST-020', name: 'Malerkotla' },
      { id: 'DST-PB-14', stateId: 'ST-020', name: 'Mansa' },
      { id: 'DST-PB-15', stateId: 'ST-020', name: 'Moga' },
      { id: 'DST-PB-16', stateId: 'ST-020', name: 'Mohali' },
      { id: 'DST-PB-17', stateId: 'ST-020', name: 'Muktsar' },
      { id: 'DST-PB-18', stateId: 'ST-020', name: 'Pathankot' },
      { id: 'DST-PB-19', stateId: 'ST-020', name: 'Patiala' },
      { id: 'DST-PB-20', stateId: 'ST-020', name: 'Rupnagar' },
      { id: 'DST-PB-21', stateId: 'ST-020', name: 'Sangrur' },
      { id: 'DST-PB-22', stateId: 'ST-020', name: 'Shaheed Bhagat Singh Nagar' },
      { id: 'DST-PB-23', stateId: 'ST-020', name: 'Tarn Taran' },
      // Rajasthan
      { id: 'DST-RJ-01', stateId: 'ST-021', name: 'Ajmer' },
      { id: 'DST-RJ-02', stateId: 'ST-021', name: 'Alwar' },
      { id: 'DST-RJ-03', stateId: 'ST-021', name: 'Banswara' },
      { id: 'DST-RJ-04', stateId: 'ST-021', name: 'Baran' },
      { id: 'DST-RJ-05', stateId: 'ST-021', name: 'Barmer' },
      { id: 'DST-RJ-06', stateId: 'ST-021', name: 'Bharatpur' },
      { id: 'DST-RJ-07', stateId: 'ST-021', name: 'Bhilwara' },
      { id: 'DST-RJ-08', stateId: 'ST-021', name: 'Bikaner' },
      { id: 'DST-RJ-09', stateId: 'ST-021', name: 'Bundi' },
      { id: 'DST-RJ-10', stateId: 'ST-021', name: 'Chittorgarh' },
      { id: 'DST-RJ-11', stateId: 'ST-021', name: 'Churu' },
      { id: 'DST-RJ-12', stateId: 'ST-021', name: 'Dausa' },
      { id: 'DST-RJ-13', stateId: 'ST-021', name: 'Dholpur' },
      { id: 'DST-RJ-14', stateId: 'ST-021', name: 'Dungarpur' },
      { id: 'DST-RJ-15', stateId: 'ST-021', name: 'Hanumangarh' },
      { id: 'DST-RJ-16', stateId: 'ST-021', name: 'Jaipur' },
      { id: 'DST-RJ-17', stateId: 'ST-021', name: 'Jaisalmer' },
      { id: 'DST-RJ-18', stateId: 'ST-021', name: 'Jalore' },
      { id: 'DST-RJ-19', stateId: 'ST-021', name: 'Jhalawar' },
      { id: 'DST-RJ-20', stateId: 'ST-021', name: 'Jhunjhunu' },
      { id: 'DST-RJ-21', stateId: 'ST-021', name: 'Jodhpur' },
      { id: 'DST-RJ-22', stateId: 'ST-021', name: 'Karauli' },
      { id: 'DST-RJ-23', stateId: 'ST-021', name: 'Kota' },
      { id: 'DST-RJ-24', stateId: 'ST-021', name: 'Nagaur' },
      { id: 'DST-RJ-25', stateId: 'ST-021', name: 'Pali' },
      { id: 'DST-RJ-26', stateId: 'ST-021', name: 'Pratapgarh' },
      { id: 'DST-RJ-27', stateId: 'ST-021', name: 'Rajsamand' },
      { id: 'DST-RJ-28', stateId: 'ST-021', name: 'Sawai Madhopur' },
      { id: 'DST-RJ-29', stateId: 'ST-021', name: 'Sikar' },
      { id: 'DST-RJ-30', stateId: 'ST-021', name: 'Sirohi' },
      { id: 'DST-RJ-31', stateId: 'ST-021', name: 'Sri Ganganagar' },
      { id: 'DST-RJ-32', stateId: 'ST-021', name: 'Tonk' },
      { id: 'DST-RJ-33', stateId: 'ST-021', name: 'Udaipur' },
      // Sikkim
      { id: 'DST-SK-01', stateId: 'ST-022', name: 'East Sikkim' },
      { id: 'DST-SK-02', stateId: 'ST-022', name: 'North Sikkim' },
      { id: 'DST-SK-03', stateId: 'ST-022', name: 'Pakyong' },
      { id: 'DST-SK-04', stateId: 'ST-022', name: 'Soreng' },
      { id: 'DST-SK-05', stateId: 'ST-022', name: 'South Sikkim' },
      { id: 'DST-SK-06', stateId: 'ST-022', name: 'West Sikkim' },
      // Tamil Nadu
      { id: 'DST-TN-01', stateId: 'ST-023', name: 'Ariyalur' },
      { id: 'DST-TN-02', stateId: 'ST-023', name: 'Chengalpattu' },
      { id: 'DST-TN-03', stateId: 'ST-023', name: 'Chennai' },
      { id: 'DST-TN-04', stateId: 'ST-023', name: 'Coimbatore' },
      { id: 'DST-TN-05', stateId: 'ST-023', name: 'Cuddalore' },
      { id: 'DST-TN-06', stateId: 'ST-023', name: 'Dharmapuri' },
      { id: 'DST-TN-07', stateId: 'ST-023', name: 'Dindigul' },
      { id: 'DST-TN-08', stateId: 'ST-023', name: 'Erode' },
      { id: 'DST-TN-09', stateId: 'ST-023', name: 'Kallakurichi' },
      { id: 'DST-TN-10', stateId: 'ST-023', name: 'Kanchipuram' },
      { id: 'DST-TN-11', stateId: 'ST-023', name: 'Kanyakumari' },
      { id: 'DST-TN-12', stateId: 'ST-023', name: 'Karur' },
      { id: 'DST-TN-13', stateId: 'ST-023', name: 'Krishnagiri' },
      { id: 'DST-TN-14', stateId: 'ST-023', name: 'Madurai' },
      { id: 'DST-TN-15', stateId: 'ST-023', name: 'Mayiladuthurai' },
      { id: 'DST-TN-16', stateId: 'ST-023', name: 'Nagapattinam' },
      { id: 'DST-TN-17', stateId: 'ST-023', name: 'Namakkal' },
      { id: 'DST-TN-18', stateId: 'ST-023', name: 'Nilgiris' },
      { id: 'DST-TN-19', stateId: 'ST-023', name: 'Perambalur' },
      { id: 'DST-TN-20', stateId: 'ST-023', name: 'Pudukkottai' },
      { id: 'DST-TN-21', stateId: 'ST-023', name: 'Ramanathapuram' },
      { id: 'DST-TN-22', stateId: 'ST-023', name: 'Ranipet' },
      { id: 'DST-TN-23', stateId: 'ST-023', name: 'Salem' },
      { id: 'DST-TN-24', stateId: 'ST-023', name: 'Sivagangai' },
      { id: 'DST-TN-25', stateId: 'ST-023', name: 'Tenkasi' },
      { id: 'DST-TN-26', stateId: 'ST-023', name: 'Thanjavur' },
      { id: 'DST-TN-27', stateId: 'ST-023', name: 'Theni' },
      { id: 'DST-TN-28', stateId: 'ST-023', name: 'Thoothukudi' },
      { id: 'DST-TN-29', stateId: 'ST-023', name: 'Tiruchirappalli' },
      { id: 'DST-TN-30', stateId: 'ST-023', name: 'Tirunelveli' },
      { id: 'DST-TN-31', stateId: 'ST-023', name: 'Tirupathur' },
      { id: 'DST-TN-32', stateId: 'ST-023', name: 'Tiruppur' },
      { id: 'DST-TN-33', stateId: 'ST-023', name: 'Tiruvallur' },
      { id: 'DST-TN-34', stateId: 'ST-023', name: 'Tiruvannamalai' },
      { id: 'DST-TN-35', stateId: 'ST-023', name: 'Tiruvarur' },
      { id: 'DST-TN-36', stateId: 'ST-023', name: 'Vellore' },
      { id: 'DST-TN-37', stateId: 'ST-023', name: 'Viluppuram' },
      { id: 'DST-TN-38', stateId: 'ST-023', name: 'Virudhunagar' },
      // Telangana
      { id: 'DST-TS-01', stateId: 'ST-024', name: 'Adilabad' },
      { id: 'DST-TS-02', stateId: 'ST-024', name: 'Bhadradri Kothagudem' },
      { id: 'DST-TS-03', stateId: 'ST-024', name: 'Hanamkonda' },
      { id: 'DST-TS-04', stateId: 'ST-024', name: 'Hyderabad' },
      { id: 'DST-TS-05', stateId: 'ST-024', name: 'Jagtial' },
      { id: 'DST-TS-06', stateId: 'ST-024', name: 'Jangaon' },
      { id: 'DST-TS-07', stateId: 'ST-024', name: 'Jayashankar Bhupalpally' },
      { id: 'DST-TS-08', stateId: 'ST-024', name: 'Jogulamba Gadwal' },
      { id: 'DST-TS-09', stateId: 'ST-024', name: 'Kamareddy' },
      { id: 'DST-TS-10', stateId: 'ST-024', name: 'Karimnagar' },
      { id: 'DST-TS-11', stateId: 'ST-024', name: 'Khammam' },
      { id: 'DST-TS-12', stateId: 'ST-024', name: 'Komaram Bheem' },
      { id: 'DST-TS-13', stateId: 'ST-024', name: 'Mahabubabad' },
      { id: 'DST-TS-14', stateId: 'ST-024', name: 'Mahabubnagar' },
      { id: 'DST-TS-15', stateId: 'ST-024', name: 'Mancherial' },
      { id: 'DST-TS-16', stateId: 'ST-024', name: 'Medak' },
      { id: 'DST-TS-17', stateId: 'ST-024', name: 'Medchal Malkajgiri' },
      { id: 'DST-TS-18', stateId: 'ST-024', name: 'Mulugu' },
      { id: 'DST-TS-19', stateId: 'ST-024', name: 'Nagarkurnool' },
      { id: 'DST-TS-20', stateId: 'ST-024', name: 'Nalgonda' },
      { id: 'DST-TS-21', stateId: 'ST-024', name: 'Narayanpet' },
      { id: 'DST-TS-22', stateId: 'ST-024', name: 'Nirmal' },
      { id: 'DST-TS-23', stateId: 'ST-024', name: 'Nizamabad' },
      { id: 'DST-TS-24', stateId: 'ST-024', name: 'Peddapalli' },
      { id: 'DST-TS-25', stateId: 'ST-024', name: 'Rajanna Sircilla' },
      { id: 'DST-TS-26', stateId: 'ST-024', name: 'Rangareddy' },
      { id: 'DST-TS-27', stateId: 'ST-024', name: 'Sangareddy' },
      { id: 'DST-TS-28', stateId: 'ST-024', name: 'Siddipet' },
      { id: 'DST-TS-29', stateId: 'ST-024', name: 'Suryapet' },
      { id: 'DST-TS-30', stateId: 'ST-024', name: 'Vikarabad' },
      { id: 'DST-TS-31', stateId: 'ST-024', name: 'Wanaparthy' },
      { id: 'DST-TS-32', stateId: 'ST-024', name: 'Warangal' },
      { id: 'DST-TS-33', stateId: 'ST-024', name: 'Yadadri Bhuvanagiri' },
      // Tripura
      { id: 'DST-TR-01', stateId: 'ST-025', name: 'Dhalai' },
      { id: 'DST-TR-02', stateId: 'ST-025', name: 'Gomati' },
      { id: 'DST-TR-03', stateId: 'ST-025', name: 'Khowai' },
      { id: 'DST-TR-04', stateId: 'ST-025', name: 'North Tripura' },
      { id: 'DST-TR-05', stateId: 'ST-025', name: 'Sepahijala' },
      { id: 'DST-TR-06', stateId: 'ST-025', name: 'South Tripura' },
      { id: 'DST-TR-07', stateId: 'ST-025', name: 'Unakoti' },
      { id: 'DST-TR-08', stateId: 'ST-025', name: 'West Tripura' },
      // Uttar Pradesh
      { id: 'DST-UP-01', stateId: 'ST-026', name: 'Agra' },
      { id: 'DST-UP-02', stateId: 'ST-026', name: 'Aligarh' },
      { id: 'DST-UP-03', stateId: 'ST-026', name: 'Ambedkar Nagar' },
      { id: 'DST-UP-04', stateId: 'ST-026', name: 'Amethi' },
      { id: 'DST-UP-05', stateId: 'ST-026', name: 'Amroha' },
      { id: 'DST-UP-06', stateId: 'ST-026', name: 'Auraiya' },
      { id: 'DST-UP-07', stateId: 'ST-026', name: 'Ayodhya' },
      { id: 'DST-UP-08', stateId: 'ST-026', name: 'Azamgarh' },
      { id: 'DST-UP-09', stateId: 'ST-026', name: 'Baghpat' },
      { id: 'DST-UP-10', stateId: 'ST-026', name: 'Bahraich' },
      { id: 'DST-UP-11', stateId: 'ST-026', name: 'Ballia' },
      { id: 'DST-UP-12', stateId: 'ST-026', name: 'Balrampur' },
      { id: 'DST-UP-13', stateId: 'ST-026', name: 'Banda' },
      { id: 'DST-UP-14', stateId: 'ST-026', name: 'Barabanki' },
      { id: 'DST-UP-15', stateId: 'ST-026', name: 'Bareilly' },
      { id: 'DST-UP-16', stateId: 'ST-026', name: 'Basti' },
      { id: 'DST-UP-17', stateId: 'ST-026', name: 'Bhadohi' },
      { id: 'DST-UP-18', stateId: 'ST-026', name: 'Bijnor' },
      { id: 'DST-UP-19', stateId: 'ST-026', name: 'Budaun' },
      { id: 'DST-UP-20', stateId: 'ST-026', name: 'Bulandshahr' },
      { id: 'DST-UP-21', stateId: 'ST-026', name: 'Chandauli' },
      { id: 'DST-UP-22', stateId: 'ST-026', name: 'Chitrakoot' },
      { id: 'DST-UP-23', stateId: 'ST-026', name: 'Deoria' },
      { id: 'DST-UP-24', stateId: 'ST-026', name: 'Etah' },
      { id: 'DST-UP-25', stateId: 'ST-026', name: 'Etawah' },
      { id: 'DST-UP-26', stateId: 'ST-026', name: 'Farrukhabad' },
      { id: 'DST-UP-27', stateId: 'ST-026', name: 'Fatehpur' },
      { id: 'DST-UP-28', stateId: 'ST-026', name: 'Firozabad' },
      { id: 'DST-UP-29', stateId: 'ST-026', name: 'Gautam Buddh Nagar' },
      { id: 'DST-UP-30', stateId: 'ST-026', name: 'Ghaziabad' },
      { id: 'DST-UP-31', stateId: 'ST-026', name: 'Ghazipur' },
      { id: 'DST-UP-32', stateId: 'ST-026', name: 'Gonda' },
      { id: 'DST-UP-33', stateId: 'ST-026', name: 'Gorakhpur' },
      { id: 'DST-UP-34', stateId: 'ST-026', name: 'Hamirpur' },
      { id: 'DST-UP-35', stateId: 'ST-026', name: 'Hapur' },
      { id: 'DST-UP-36', stateId: 'ST-026', name: 'Hardoi' },
      { id: 'DST-UP-37', stateId: 'ST-026', name: 'Hathras' },
      { id: 'DST-UP-38', stateId: 'ST-026', name: 'Jalaun' },
      { id: 'DST-UP-39', stateId: 'ST-026', name: 'Jaunpur' },
      { id: 'DST-UP-40', stateId: 'ST-026', name: 'Jhansi' },
      { id: 'DST-UP-41', stateId: 'ST-026', name: 'Kannauj' },
      { id: 'DST-UP-42', stateId: 'ST-026', name: 'Kanpur Dehat' },
      { id: 'DST-UP-43', stateId: 'ST-026', name: 'Kanpur Nagar' },
      { id: 'DST-UP-44', stateId: 'ST-026', name: 'Kasganj' },
      { id: 'DST-UP-45', stateId: 'ST-026', name: 'Kaushambi' },
      { id: 'DST-UP-46', stateId: 'ST-026', name: 'Kheri' },
      { id: 'DST-UP-47', stateId: 'ST-026', name: 'Kushinagar' },
      { id: 'DST-UP-48', stateId: 'ST-026', name: 'Lalitpur' },
      { id: 'DST-UP-49', stateId: 'ST-026', name: 'Lucknow' },
      { id: 'DST-UP-50', stateId: 'ST-026', name: 'Maharajganj' },
      { id: 'DST-UP-51', stateId: 'ST-026', name: 'Mahoba' },
      { id: 'DST-UP-52', stateId: 'ST-026', name: 'Mainpuri' },
      { id: 'DST-UP-53', stateId: 'ST-026', name: 'Mathura' },
      { id: 'DST-UP-54', stateId: 'ST-026', name: 'Mau' },
      { id: 'DST-UP-55', stateId: 'ST-026', name: 'Meerut' },
      { id: 'DST-UP-56', stateId: 'ST-026', name: 'Mirzapur' },
      { id: 'DST-UP-57', stateId: 'ST-026', name: 'Moradabad' },
      { id: 'DST-UP-58', stateId: 'ST-026', name: 'Muzaffarnagar' },
      { id: 'DST-UP-59', stateId: 'ST-026', name: 'Pilibhit' },
      { id: 'DST-UP-60', stateId: 'ST-026', name: 'Pratapgarh' },
      { id: 'DST-UP-61', stateId: 'ST-026', name: 'Prayagraj' },
      { id: 'DST-UP-62', stateId: 'ST-026', name: 'Raebareli' },
      { id: 'DST-UP-63', stateId: 'ST-026', name: 'Rampur' },
      { id: 'DST-UP-64', stateId: 'ST-026', name: 'Saharanpur' },
      { id: 'DST-UP-65', stateId: 'ST-026', name: 'Sambhal' },
      { id: 'DST-UP-66', stateId: 'ST-026', name: 'Sant Kabir Nagar' },
      { id: 'DST-UP-67', stateId: 'ST-026', name: 'Shahjahanpur' },
      { id: 'DST-UP-68', stateId: 'ST-026', name: 'Shamli' },
      { id: 'DST-UP-69', stateId: 'ST-026', name: 'Shravasti' },
      { id: 'DST-UP-70', stateId: 'ST-026', name: 'Siddharthnagar' },
      { id: 'DST-UP-71', stateId: 'ST-026', name: 'Sitapur' },
      { id: 'DST-UP-72', stateId: 'ST-026', name: 'Sonbhadra' },
      { id: 'DST-UP-73', stateId: 'ST-026', name: 'Sultanpur' },
      { id: 'DST-UP-74', stateId: 'ST-026', name: 'Unnao' },
      { id: 'DST-UP-75', stateId: 'ST-026', name: 'Varanasi' },
      // Uttarakhand
      { id: 'DST-UK-01', stateId: 'ST-027', name: 'Almora' },
      { id: 'DST-UK-02', stateId: 'ST-027', name: 'Bageshwar' },
      { id: 'DST-UK-03', stateId: 'ST-027', name: 'Chamoli' },
      { id: 'DST-UK-04', stateId: 'ST-027', name: 'Champawat' },
      { id: 'DST-UK-05', stateId: 'ST-027', name: 'Dehradun' },
      { id: 'DST-UK-06', stateId: 'ST-027', name: 'Haridwar' },
      { id: 'DST-UK-07', stateId: 'ST-027', name: 'Nainital' },
      { id: 'DST-UK-08', stateId: 'ST-027', name: 'Pauri Garhwal' },
      { id: 'DST-UK-09', stateId: 'ST-027', name: 'Pithoragarh' },
      { id: 'DST-UK-10', stateId: 'ST-027', name: 'Rudraprayag' },
      { id: 'DST-UK-11', stateId: 'ST-027', name: 'Tehri Garhwal' },
      { id: 'DST-UK-12', stateId: 'ST-027', name: 'Udham Singh Nagar' },
      { id: 'DST-UK-13', stateId: 'ST-027', name: 'Uttarkashi' },
      // West Bengal
      { id: 'DST-WB-01', stateId: 'ST-028', name: 'Alipurduar' },
      { id: 'DST-WB-02', stateId: 'ST-028', name: 'Bankura' },
      { id: 'DST-WB-03', stateId: 'ST-028', name: 'Birbhum' },
      { id: 'DST-WB-04', stateId: 'ST-028', name: 'Cooch Behar' },
      { id: 'DST-WB-05', stateId: 'ST-028', name: 'Dakshin Dinajpur' },
      { id: 'DST-WB-06', stateId: 'ST-028', name: 'Darjeeling' },
      { id: 'DST-WB-07', stateId: 'ST-028', name: 'Hooghly' },
      { id: 'DST-WB-08', stateId: 'ST-028', name: 'Howrah' },
      { id: 'DST-WB-09', stateId: 'ST-028', name: 'Jalpaiguri' },
      { id: 'DST-WB-10', stateId: 'ST-028', name: 'Jhargram' },
      { id: 'DST-WB-11', stateId: 'ST-028', name: 'Kalimpong' },
      { id: 'DST-WB-12', stateId: 'ST-028', name: 'Kolkata' },
      { id: 'DST-WB-13', stateId: 'ST-028', name: 'Malda' },
      { id: 'DST-WB-14', stateId: 'ST-028', name: 'Murshidabad' },
      { id: 'DST-WB-15', stateId: 'ST-028', name: 'Nadia' },
      { id: 'DST-WB-16', stateId: 'ST-028', name: 'North 24 Parganas' },
      { id: 'DST-WB-17', stateId: 'ST-028', name: 'Paschim Bardhaman' },
      { id: 'DST-WB-18', stateId: 'ST-028', name: 'Paschim Medinipur' },
      { id: 'DST-WB-19', stateId: 'ST-028', name: 'Purba Bardhaman' },
      { id: 'DST-WB-20', stateId: 'ST-028', name: 'Purba Medinipur' },
      { id: 'DST-WB-21', stateId: 'ST-028', name: 'Purulia' },
      { id: 'DST-WB-22', stateId: 'ST-028', name: 'South 24 Parganas' },
      { id: 'DST-WB-23', stateId: 'ST-028', name: 'Uttar Dinajpur' },
      // Union Territories
      { id: 'DST-AN-01', stateId: 'ST-029', name: 'Nicobar' },
      { id: 'DST-AN-02', stateId: 'ST-029', name: 'North & Middle Andaman' },
      { id: 'DST-AN-03', stateId: 'ST-029', name: 'South Andaman' },
      { id: 'DST-CH-01', stateId: 'ST-030', name: 'Chandigarh' },
      { id: 'DST-DH-01', stateId: 'ST-031', name: 'Dadra & Nagar Haveli' },
      { id: 'DST-DH-02', stateId: 'ST-031', name: 'Daman' },
      { id: 'DST-DH-03', stateId: 'ST-031', name: 'Diu' },
      { id: 'DST-DL-01', stateId: 'ST-032', name: 'Central Delhi' },
      { id: 'DST-DL-02', stateId: 'ST-032', name: 'East Delhi' },
      { id: 'DST-DL-03', stateId: 'ST-032', name: 'New Delhi' },
      { id: 'DST-DL-04', stateId: 'ST-032', name: 'North Delhi' },
      { id: 'DST-DL-05', stateId: 'ST-032', name: 'North East Delhi' },
      { id: 'DST-DL-06', stateId: 'ST-032', name: 'North West Delhi' },
      { id: 'DST-DL-07', stateId: 'ST-032', name: 'Shahdara' },
      { id: 'DST-DL-08', stateId: 'ST-032', name: 'South Delhi' },
      { id: 'DST-DL-09', stateId: 'ST-032', name: 'South East Delhi' },
      { id: 'DST-DL-10', stateId: 'ST-032', name: 'South West Delhi' },
      { id: 'DST-DL-11', stateId: 'ST-032', name: 'West Delhi' },
      { id: 'DST-JK-01', stateId: 'ST-033', name: 'Anantnag' },
      { id: 'DST-JK-02', stateId: 'ST-033', name: 'Bandipora' },
      { id: 'DST-JK-03', stateId: 'ST-033', name: 'Baramulla' },
      { id: 'DST-JK-04', stateId: 'ST-033', name: 'Budgam' },
      { id: 'DST-JK-05', stateId: 'ST-033', name: 'Doda' },
      { id: 'DST-JK-06', stateId: 'ST-033', name: 'Ganderbal' },
      { id: 'DST-JK-07', stateId: 'ST-033', name: 'Jammu' },
      { id: 'DST-JK-08', stateId: 'ST-033', name: 'Kathua' },
      { id: 'DST-JK-09', stateId: 'ST-033', name: 'Kishtwar' },
      { id: 'DST-JK-10', stateId: 'ST-033', name: 'Kulgam' },
      { id: 'DST-JK-11', stateId: 'ST-033', name: 'Kupwara' },
      { id: 'DST-JK-12', stateId: 'ST-033', name: 'Poonch' },
      { id: 'DST-JK-13', stateId: 'ST-033', name: 'Pulwama' },
      { id: 'DST-JK-14', stateId: 'ST-033', name: 'Rajouri' },
      { id: 'DST-JK-15', stateId: 'ST-033', name: 'Ramban' },
      { id: 'DST-JK-16', stateId: 'ST-033', name: 'Reasi' },
      { id: 'DST-JK-17', stateId: 'ST-033', name: 'Samba' },
      { id: 'DST-JK-18', stateId: 'ST-033', name: 'Shopian' },
      { id: 'DST-JK-19', stateId: 'ST-033', name: 'Srinagar' },
      { id: 'DST-JK-20', stateId: 'ST-033', name: 'Udhampur' },
      { id: 'DST-LA-01', stateId: 'ST-034', name: 'Kargil' },
      { id: 'DST-LA-02', stateId: 'ST-034', name: 'Leh' },
      { id: 'DST-LD-01', stateId: 'ST-035', name: 'Lakshadweep' },
      { id: 'DST-PY-01', stateId: 'ST-036', name: 'Karaikal' },
      { id: 'DST-PY-02', stateId: 'ST-036', name: 'Mahe' },
      { id: 'DST-PY-03', stateId: 'ST-036', name: 'Puducherry' },
      { id: 'DST-PY-04', stateId: 'ST-036', name: 'Yanam' },
    ],
    blocks: [
      { id: 'BLK-001', districtId: 'DST-KA-08', name: 'Chikkamagaluru' },
      { id: 'BLK-002', districtId: 'DST-KA-08', name: 'Mudigere' },
      { id: 'BLK-003', districtId: 'DST-KA-15', name: 'Belur' },
    ],
    villages: [
      { id: 'VLG-4829', name: 'Gundya Village', population: '850', sanitationStatus: 'Moderate', waterStatus: 'Scarcity', riskStatus: 'Medium' },
      { id: 'VLG-7281', name: 'Belur Sector', population: '1200', sanitationStatus: 'Good', waterStatus: 'Adequate', riskStatus: 'Low' },
      { id: 'VLG-1029', name: 'Mudigere Road', population: '600', sanitationStatus: 'Poor', waterStatus: 'Contaminated', riskStatus: 'High' },
      { id: 'VLG-5521', name: 'Kavalande Hadi', population: '420', sanitationStatus: 'Good', waterStatus: 'Adequate', riskStatus: 'Low' },
      { id: 'VLG-3318', name: 'Bettadapura', population: '780', sanitationStatus: 'Moderate', waterStatus: 'Scarcity', riskStatus: 'Medium' },
    ],
    families: [
      { id: 'FAM-4829-102', villageName: 'Gundya Village', villageId: 'VLG-4829', houseNo: '102', economicStatus: 'BPL', occupation: 'Agriculture Labourer', drinkingWater: 'Tap', toilet: 'Yes' },
      { id: 'FAM-7281-54', villageName: 'Belur Sector', villageId: 'VLG-7281', houseNo: '54', economicStatus: 'APL', occupation: 'Carpenter', drinkingWater: 'Tap', toilet: 'Yes' },
      { id: 'FAM-1029-12', villageName: 'Mudigere Road', villageId: 'VLG-1029', houseNo: '12', economicStatus: 'Antyodaya', occupation: 'Sweeper', drinkingWater: 'River', toilet: 'No' },
      { id: 'FAM-5521-08', villageName: 'Kavalande Hadi', villageId: 'VLG-5521', houseNo: '8', economicStatus: 'BPL', occupation: 'Daily Wage Worker', drinkingWater: 'Well', toilet: 'Yes' },
      { id: 'FAM-3318-21', villageName: 'Bettadapura', villageId: 'VLG-3318', houseNo: '21', economicStatus: 'APL', occupation: 'Small Trader', drinkingWater: 'Tap', toilet: 'Yes' },
    ],
    individuals: [
      { id: 'JR-4829-01', familyId: 'FAM-4829-102', name: 'Radha Gowda', age: '26', gender: 'Female', phone: '9880192840', bloodGroup: 'O+', chronicDiseases: ['Hypertension'], pregnancyStatus: 'Yes', vaccinationStatus: 'Partial', disabilityStatus: 'No', malnutritionStatus: 'none', livingAlone: 'no', alerts: [{ type: 'High-Risk Pregnancy', severity: 'critical', reason: 'Gestational Hypertension / Preeclampsia risk' }] },
      { id: 'JR-4829-02', familyId: 'FAM-4829-102', name: 'Satish Gowda', age: '32', gender: 'Male', phone: '9880192841', bloodGroup: 'A+', chronicDiseases: ['Diabetes'], pregnancyStatus: 'No', vaccinationStatus: 'Full', disabilityStatus: 'No', malnutritionStatus: 'none', livingAlone: 'no', alerts: [{ type: 'Chronic Disease Monitoring', severity: 'medium', reason: 'Active Diabetes: Requires monthly sugar tests & dietary follow-up' }] },
      { id: 'JR-1029-01', familyId: 'FAM-1029-12', name: 'Manju Devadiga', age: '4', gender: 'Male', phone: 'N/A', bloodGroup: 'B+', chronicDiseases: [], pregnancyStatus: 'No', vaccinationStatus: 'Partial', disabilityStatus: 'No', malnutritionStatus: 'severe', livingAlone: 'no', alerts: [{ type: 'Severe Malnutrition', severity: 'critical', reason: 'Under-5 child marked as Severely Acutely Malnourished (SAM)' }] },
      { id: 'JR-1029-02', familyId: 'FAM-1029-12', name: 'Chinnamma Devadiga', age: '72', gender: 'Female', phone: 'N/A', bloodGroup: 'O+', chronicDiseases: ['Hypertension', 'Diabetes'], pregnancyStatus: 'No', vaccinationStatus: 'Full', disabilityStatus: 'No', malnutritionStatus: 'none', livingAlone: 'yes', alerts: [{ type: 'Elderly Living Alone', severity: 'high', reason: 'Geriatric vulnerable group: Requires weekly social support check' }, { type: 'Hypertension Risk', severity: 'medium', reason: 'Active Hypertension: Requires regular BP check-ups' }] },
      { id: 'JR-7281-01', familyId: 'FAM-7281-54', name: 'Suresh Poojary', age: '45', gender: 'Male', phone: '9448102948', bloodGroup: 'AB+', chronicDiseases: ['Tuberculosis'], pregnancyStatus: 'No', vaccinationStatus: 'Full', disabilityStatus: 'No', malnutritionStatus: 'none', livingAlone: 'no', alerts: [{ type: 'Tuberculosis DOTS Monitoring', severity: 'high', reason: 'Active TB: Needs daily DOTS treatment tracking and contact tracing' }] },
      { id: 'JR-4829-03', familyId: 'FAM-4829-102', name: 'Lakshmi Gowda', age: '58', gender: 'Female', phone: 'N/A', bloodGroup: 'A+', chronicDiseases: ['Hypertension', 'Asthma'], pregnancyStatus: 'No', vaccinationStatus: 'Partial', disabilityStatus: 'No', malnutritionStatus: 'none', livingAlone: 'no', alerts: [{ type: 'Chronic Disease Monitoring', severity: 'medium', reason: 'Hypertension + Asthma: Requires bi-monthly medication review' }] },
      { id: 'JR-1029-03', familyId: 'FAM-1029-12', name: 'Rajan Devadiga', age: '38', gender: 'Male', phone: 'N/A', bloodGroup: 'B+', chronicDiseases: ['Cancer Risk'], pregnancyStatus: 'No', vaccinationStatus: 'Full', disabilityStatus: 'Yes', malnutritionStatus: 'moderate', livingAlone: 'no', alerts: [{ type: 'Cancer Risk Monitoring', severity: 'high', reason: 'Flagged for Cancer Risk: Referral to District Hospital required' }] },
      { id: 'JR-5521-01', familyId: 'FAM-5521-08', name: 'Kavitha Naik', age: '22', gender: 'Female', phone: '9449201884', bloodGroup: 'B+', chronicDiseases: [], pregnancyStatus: 'Yes', vaccinationStatus: 'Full', disabilityStatus: 'No', malnutritionStatus: 'none', livingAlone: 'no', alerts: [] },
      { id: 'JR-3318-01', familyId: 'FAM-3318-21', name: 'Arun Kumar S', age: '7', gender: 'Male', phone: 'N/A', bloodGroup: 'O+', chronicDiseases: [], pregnancyStatus: 'No', vaccinationStatus: 'Partial', disabilityStatus: 'No', malnutritionStatus: 'moderate', livingAlone: 'no', alerts: [{ type: 'Child Malnutrition', severity: 'medium', reason: 'MAM: Child requires ICDS supplementation and monthly growth monitoring' }] },
    ],
    alerts: [
      { id: 'ALT-101', patientId: 'JR-4829-01', patientName: 'Radha Gowda', type: 'High-Risk Pregnancy', severity: 'critical', reason: 'Gestational Hypertension / Preeclampsia risk', date: '25/05/2026', resolved: false },
      { id: 'ALT-102', patientId: 'JR-1029-01', patientName: 'Manju Devadiga', type: 'Severe Malnutrition', severity: 'critical', reason: 'Under-5 child marked as SAM', date: '24/05/2026', resolved: false },
      { id: 'ALT-103', patientId: 'JR-1029-02', patientName: 'Chinnamma Devadiga', type: 'Elderly Living Alone', severity: 'high', reason: 'Geriatric vulnerable group: Requires weekly check-in', date: '24/05/2026', resolved: false },
      { id: 'ALT-104', patientId: 'JR-7281-01', patientName: 'Suresh Poojary', type: 'Tuberculosis DOTS Monitoring', severity: 'high', reason: 'Active TB: Needs daily DOTS treatment tracking', date: '23/05/2026', resolved: false },
      { id: 'ALT-105', patientId: 'JR-1029-03', patientName: 'Rajan Devadiga', type: 'Cancer Risk Monitoring', severity: 'high', reason: 'Cancer Risk flag: Referral to District Hospital pending', date: '22/05/2026', resolved: true },
      { id: 'ALT-106', patientId: 'JR-3318-01', patientName: 'Arun Kumar S', type: 'Child Malnutrition', severity: 'medium', reason: 'MAM — child requires ICDS supplementation', date: '26/05/2026', resolved: false },
    ],
    visits: [
      { id: 'VST-2983', vhwName: 'Preema D\'Souza (VHW)', date: '26/05/2026', familyId: 'FAM-4829-102', notes: 'Radha (pregnant) complained of slight dizziness. Took BP: 142/88. Advised reduction in salt and scheduled doctor visit.', tempDeg: '98.4', bpSys: '142', bpDia: '88', gps: '12.9712, 77.5941', followUpDate: '2026-06-02' },
      { id: 'VST-1928', vhwName: 'Preema D\'Souza (VHW)', date: '25/05/2026', familyId: 'FAM-1029-12', notes: 'Delivered nutrition kit to Chinnamma (Elderly). Family sanitation is poor, open drain right in front of door.', tempDeg: '98.6', bpSys: '130', bpDia: '82', gps: '12.9720, 77.5950', followUpDate: '' },
      { id: 'VST-3041', vhwName: 'Shobha Nayak (VHW)', date: '24/05/2026', familyId: 'FAM-7281-54', notes: 'Verified DOTS compliance for Suresh. No missed doses this week. Wife reports slight weight loss. Advised diet supplementation.', tempDeg: '98.2', bpSys: '118', bpDia: '76', gps: '12.9708, 77.5930', followUpDate: '2026-05-31' },
    ],
    programs: [
      { id: 'PRG-8829', villageName: 'Gundya Village', date: '24/05/2026', topic: 'Menstrual Hygiene', participants: '14', outcome: 'Distributed sanitary pads to 14 adolescent girls. Discussed disposal methods and period health.' },
      { id: 'PRG-7741', villageName: 'Mudigere Road', date: '21/05/2026', topic: 'Tobacco Prevention', participants: '22', outcome: 'Tobacco de-addiction awareness session. 3 adults agreed to enroll in NCD clinic follow-up.' },
      { id: 'PRG-6521', villageName: 'Belur Sector', date: '18/05/2026', topic: 'Child Nutrition under-5', participants: '18', outcome: 'Growth monitoring of 18 children under-5. 2 identified for MAM supplementation referral.' },
    ],
    attendance: [
      { id: 'ATT-302', staffName: 'Preema D\'Souza (VHW)', date: '26/05/2026', checkIn: '08:45 AM', checkOut: '04:30 PM', status: 'Present', gps: '12.9715, 77.5945' },
      { id: 'ATT-201', staffName: 'Preema D\'Souza (VHW)', date: '25/05/2026', checkIn: '08:30 AM', checkOut: '05:00 PM', status: 'Present', gps: '12.9714, 77.5948' },
      { id: 'ATT-198', staffName: 'Shobha Nayak (VHW)', date: '26/05/2026', checkIn: '09:00 AM', checkOut: '04:45 PM', status: 'Present', gps: '12.9708, 77.5930' },
      { id: 'ATT-195', staffName: 'Shobha Nayak (VHW)', date: '25/05/2026', checkIn: '08:50 AM', checkOut: '04:30 PM', status: 'Present', gps: '12.9710, 77.5935' },
    ],
    leaveRequests: [
      { id: 'LEV-551', staffName: 'Shobha Nayak (VHW)', startDate: '29/05/2026', days: '2', reason: 'Family wedding attendance', status: 'Pending' },
      { id: 'LEV-512', staffName: 'Preema D\'Souza (VHW)', startDate: '15/05/2026', days: '1', reason: 'Medical check-up', status: 'Approved' },
    ],
    staff: [
      { id: 'STF-001', name: 'Ayathana Trust Admin', role: 'Super Admin (Trust)', email: 'admin@ayathanatrust.org', password: 'admin123', village: 'All Districts', status: 'Active', contacts: 'Central Office' },
      { id: 'STF-002', name: 'Dr. Ramesh Kumar', role: 'Project Director', email: 'director@ayathanatrust.org', password: 'director123', village: 'Chikkamagaluru Block', status: 'Active', contacts: '+91 94481 02930' },
      { id: 'STF-104', name: 'Preema D\'Souza', role: 'Village Health Worker', email: 'preema@ayathanatrust.org', password: 'vhw123', village: 'Gundya & Mudigere', status: 'Active', contacts: '+91 98860 12948' },
      { id: 'STF-105', name: 'Shobha Nayak', role: 'Village Health Worker', email: 'shobha@ayathanatrust.org', password: 'vhw123', village: 'Belur Sector', status: 'Active', contacts: '+91 98860 77481' },
    ],
    notifications: [
      { id: 'NOT-001', type: 'SMS', recipient: '+91 9880192840', title: 'Follow-up Reminder', message: 'Dear Radha, your next antenatal check is on 28/05. Please visit PHC Mudigere.', status: 'Sent', sentAt: '25/05/2026 08:00 AM' },
      { id: 'NOT-002', type: 'WhatsApp', recipient: '+91 9448102948', title: 'DOTS Reminder', message: 'Suresh, take your TB medicine today. Contact VHW Preema if any issues: 9880 12948.', status: 'Sent', sentAt: '26/05/2026 07:30 AM' },
      { id: 'NOT-003', type: 'Email', recipient: 'admin@ayathanatrust.org', title: 'Monthly Summary Report', message: 'Chikkamagaluru block May 2026 summary is ready for review. 7 new individuals screened.', status: 'Sent', sentAt: '01/06/2026 09:00 AM' },
      { id: 'NOT-004', type: 'SMS', recipient: '+91 9880192841', title: 'Diabetes Follow-up Due', message: 'Satish, your HbA1c test is due this week. Please visit PHC or contact VHW.', status: 'Pending', sentAt: '-' },
    ],
    auditLogs: [
      { id: 'AUD-001', user: 'Preema D\'Souza', action: 'INSERT_INDIVIDUAL', desc: 'Registered Radha Gowda (JR-4829-01)', ip: '192.168.1.42', time: '26/05/2026 09:12 AM' },
      { id: 'AUD-002', user: 'Dr. Ramesh Kumar', action: 'APPROVE_LEAVE', desc: 'Approved leave request LEV-512 for Preema D\'Souza', ip: '192.168.1.10', time: '14/05/2026 10:30 AM' },
      { id: 'AUD-003', user: 'Preema D\'Souza', action: 'GPS_CHECKIN', desc: 'GPS Check-in at 12.9712, 77.5941 — Gundya Village sector', ip: '192.168.1.42', time: '26/05/2026 08:45 AM' },
      { id: 'AUD-004', user: 'Admin', action: 'CREATE_VILLAGE', desc: 'Mapped new village: Gundya Village (VLG-4829)', ip: '192.168.1.1', time: '20/05/2026 11:00 AM' },
      { id: 'AUD-005', user: 'Shobha Nayak', action: 'SUBMIT_PROGRAM', desc: 'Submitted Community Activity PRG-7741 Tobacco Prevention', ip: '192.168.1.55', time: '21/05/2026 04:15 PM' },
      { id: 'AUD-006', user: 'SYSTEM', action: 'RISK_ALERT_AUTO', desc: 'Auto-flagged Radha Gowda as High-Risk Pregnancy (ALT-101)', ip: 'SYSTEM', time: '25/05/2026 12:01 AM' },
      { id: 'AUD-007', user: 'Preema D\'Souza', action: 'LOG_VISIT', desc: 'Field visit VST-2983 logged for FAM-4829-102 with vitals: BP 142/88', ip: '192.168.1.42', time: '26/05/2026 11:30 AM' },
    ],
    supportRecords: [
      { id: 'SUP-101', beneficiary: 'Sharadamma Gowda (68Y)', category: 'Elderly Living Alone', support: 'Weekly Nutrition Kit + Free Medication', scheme: 'Sandhya Suraksha Scheme', date: '22/05/2026' },
      { id: 'SUP-102', beneficiary: 'Laxmi Poojary (42Y)', category: 'Widow', support: 'Financial Aid (Rs 1,500/mo)', scheme: 'Widows Pension Scheme', date: '18/05/2026' },
      { id: 'SUP-103', beneficiary: 'Kiran Devadiga (14Y)', category: 'Orphan', support: 'School Scholarship', scheme: 'Pending Approval', date: '10/05/2026' },
      { id: 'SUP-104', beneficiary: 'Manju Devadiga (4Y)', category: 'Child Malnutrition (SAM)', support: 'NRC Referral + POSHAN Supplementation', scheme: 'POSHAN Abhiyaan', date: '24/05/2026' },
      { id: 'SUP-105', beneficiary: 'Chinnamma Devadiga (72Y)', category: 'Elderly — Palliative', support: 'Monthly Medicine Kit + Home Care Visit', scheme: 'Rashtriya Arogya Nidhi', date: '25/05/2026' },
    ],
    trainings: [
      { id: 'TRN-001', title: 'Maternal Risk Screening & ANC Protocol', instructor: 'Dr. Ramesh Kumar', date: '2026-05-28', type: 'Online', enrolledCount: 2 },
      { id: 'TRN-002', title: 'PWA Offline Sync & Mobile Data Safeguarding', instructor: 'Infowin Digicare Team', date: '2026-06-05', type: 'On-Site Workshop', enrolledCount: 4 },
      { id: 'TRN-003', title: 'TB-DOTS Field Protocol and Contact Tracing', instructor: 'RNTCP State Trainer', date: '2026-06-12', type: 'Field Training', enrolledCount: 2 },
      { id: 'TRN-004', title: 'Child Nutrition SAM/MAM — ICDS Integration', instructor: 'Dr. Priya Shetty', date: '2026-06-20', type: 'Online', enrolledCount: 4 },
    ],
    evaluations: [
      { id: 'EVL-101', worker: 'VHW-104 — Preema D\'Souza', score: '5', feedback: 'Exceptional field performance. High risk case identification excellent. Radha Gowda referral was timely and correct.', date: '01/05/2026' },
      { id: 'EVL-102', worker: 'VHW-105 — Shobha Nayak', score: '4', feedback: 'Good overall work. Needs to improve sync frequency. Encourage more training module participation.', date: '01/05/2026' },
    ],
    referrals: [
      { id: 'REF-101', patientId: 'JR-4829-01', patientName: 'Radha Gowda', reason: 'Severe Preeclampsia Risk / High BP', referredTo: 'District Hospital Chikkamagaluru', referredBy: 'Preema D\'Souza (VHW)', date: '26/05/2026', status: 'Submitted' },
      { id: 'REF-102', patientId: 'JR-1029-03', patientName: 'Rajan Devadiga', reason: 'Suspected Oral Lesion / Cancer Risk screening', referredTo: 'Oncology PHC Sector', referredBy: 'Preema D\'Souza (VHW)', date: '24/05/2026', status: 'Approved' }
    ],
    villageReports: [
      { id: 'REP-001', villageName: 'Gundya Village', reportedBy: 'Preema D\'Souza (VHW)', date: '26/05/2026', population: '850', waterStatus: 'Scarcity', sanitationStatus: 'Moderate', status: 'Approved' },
      { id: 'REP-002', villageName: 'Mudigere Road', reportedBy: 'Preema D\'Souza (VHW)', date: '25/05/2026', population: '600', waterStatus: 'Contaminated', sanitationStatus: 'Poor', status: 'Submitted' }
    ]
  });

  return (
    <LanguageProvider>
      {currentUser ? (
        <DashboardShell 
          currentUser={currentUser} 
          onLogout={() => setCurrentUser(null)} 
          state={state}
          setState={setState}
          theme={theme}
          setTheme={setTheme}
          onOpenShowcase={() => setIsShowcaseOpen(true)}
          env={env}
          setEnv={setEnv}
        />
      ) : (
        <LoginScreen 
          onLogin={(user) => setCurrentUser(user)} 
          staffList={state.staff}
          theme={theme}
          setTheme={setTheme}
          onOpenShowcase={() => setIsShowcaseOpen(true)}
        />
      )}
      <LogoShowcase isOpen={isShowcaseOpen} onClose={() => setIsShowcaseOpen(false)} />
    </LanguageProvider>
  );
}
