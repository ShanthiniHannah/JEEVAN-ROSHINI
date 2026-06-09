import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../layouts/AuthLayout';
import { useTheme } from '../hooks/useTheme';
import {
  Mail, Key, Eye, EyeOff, Globe, Moon, Sun, ArrowRight, Check, Sparkles
} from 'lucide-react';
import './LoginPage.css';
import doctorPointing from '../assets/doctor_pointing.png';
import logoNew from '../assets/logo_new.jpg';

/**
 * LoginPage — Premium Centered Editorial Health Portal Layout
 * Uses AuthContext.login() which calls the live Laravel API.
 * Integrates daily rotating health tips, live clinical work metrics, language cycling, 
 * theme toggling, and self-contained JSDOM-safe canvas particle systems.
 */
export default function LoginPage() {
  const { login, changePassword } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme, isLight } = useTheme();
  const { locale, setLocale, t } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  const canvasRef = useRef(null);

  // Clinical work stats animation state
  const [villagesCount, setVillagesCount] = useState(0);
  const [individualsCount, setIndividualsCount] = useState(0);
  const [staffCount, setStaffCount] = useState(0);

  // 9 Supported Indian Languages
  const LOCALES = [
    { value: 'en', label: 'English' }, { value: 'kn', label: 'ಕನ್ನಡ' },
    { value: 'ml', label: 'മലയാളം' }, { value: 'hi', label: 'हिन्दी' },
    { value: 'te', label: 'తెలుగు' }, { value: 'ta', label: 'தமிழ்' },
    { value: 'mr', label: 'मराठी' }, { value: 'bn', label: 'বাংলা' },
    { value: 'gu', label: 'ગુજરાતી' },
  ];

  // Daily Rotating Health Tips
  const HEALTH_TIPS = [
    "Drink at least 8-10 glasses of water daily to maintain optimal hydration.",
    "Walk for 30 minutes daily to significantly boost cardiovascular health.",
    "Include high-fiber foods like whole grains, vegetables, and fruits in your diet.",
    "Maintain a consistent sleep schedule and aim for 7-8 hours of sleep per night.",
    "Practice deep breathing or mindfulness for 5-10 minutes to reduce daily stress.",
    "Limit processed sugar intake to lower risk of diabetes and chronic illness.",
    "Eat a colorful variety of fruits and vegetables daily for diverse micronutrients.",
    "Regular health checkups help in early detection and prevention of chronic diseases.",
    "Wash your hands frequently with soap and water to prevent infections.",
    "Limit screen time before bed to improve your sleep quality.",
    "Incorporate strength training exercises at least twice a week.",
    "Prioritize dental hygiene: brush twice a day and floss regularly.",
    "Active stretch breaks every hour help counter prolonged sitting.",
    "Choose whole foods over highly processed snacks to keep energy levels stable.",
    "Protect your skin by wearing sunscreen when outdoors.",
    "Practice portion control to maintain a healthy body weight.",
    "Reduce salt intake to maintain healthy blood pressure levels.",
    "Maintain good posture while sitting and working to protect your spine.",
    "A positive mind fosters physical well-being. Practice gratitude daily."
  ];

  const getDailyTip = () => {
    const today = new Date();
    // Get day of the year (1-366)
    const start = new Date(today.getFullYear(), 0, 0);
    const diff = today - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    // Select tip based on day of the year to ensure a new one daily and no repetitions
    return HEALTH_TIPS[dayOfYear % HEALTH_TIPS.length];
  };

  const getRoleRoute = (user) => {
    const role = user?.role || '';
    if (role === 'super-admin' || role === 'Super Admin (Trust)') return '/admin';
    if (role === 'project-director' || role === 'Project Director') return '/director';
    if (role === 'vhw' || role === 'Village Health Worker') return '/vhw';
    return '/vhw';
  };

  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  // Canvas particle logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H;
    let particles = [];
    let animationFrameId;

    const resize = () => {
      if (!canvas) return;
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.size = Math.random() * 1.5 + 0.3;
        this.speedX = (Math.random() - 0.5) * 0.25;
        this.speedY = -Math.random() * 0.4 - 0.1;
        this.life = 0;
        this.maxLife = Math.random() * 300 + 200;
        if (isLight) {
          this.color = Math.random() > 0.6 ? '0,87,184' : Math.random() > 0.5 ? '0,149,168' : '26,111,204';
        } else {
          this.color = Math.random() > 0.6 ? '59,130,246' : Math.random() > 0.5 ? '20,184,166' : '96,165,250';
        }
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life++;
        if (this.life > this.maxLife || this.y < -10) this.reset();
      }
      draw() {
        const alpha = this.life < 60
          ? (this.life / 60) * 0.5
          : this.life > this.maxLife - 60
            ? ((this.maxLife - this.life) / 60) * 0.5
            : 0.5;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color},${alpha})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < 80; i++) {
      const p = new Particle();
      p.life = Math.random() * p.maxLife;
      particles.push(p);
    }

    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isLight]);

  // Stats number count-up animation
  useEffect(() => {
    const dur = 2000;
    const step = 16;
    const steps = dur / step;

    let vCurrent = 0;
    let iCurrent = 0;
    let sCurrent = 0;

    const vInc = 24 / steps;
    const iInc = 18440 / steps;
    const sInc = 26 / steps;

    const timer = setInterval(() => {
      vCurrent = Math.min(vCurrent + vInc, 24);
      iCurrent = Math.min(iCurrent + iInc, 18440);
      sCurrent = Math.min(sCurrent + sInc, 26);

      setVillagesCount(Math.floor(vCurrent));
      setIndividualsCount(Math.floor(iCurrent));
      setStaffCount(Math.floor(sCurrent));

      if (vCurrent >= 24 && iCurrent >= 18440 && sCurrent >= 26) {
        clearInterval(timer);
      }
    }, step);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);
    if (result.success) {
      showToast(`Welcome back! Redirecting...`);
      setTimeout(() => {
        navigate(getRoleRoute(result.user));
      }, 1000);
    } else if (result.requires_password_change) {
      setShowChangePassword(true);
      setError('');
      showToast('Please set a new permanent password.');
    } else {
      setError(result.message);
    }
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    setError('');
    setIsLoading(true);
    const result = await changePassword(email, password, newPassword);
    setIsLoading(false);
    if (result.success) {
      showToast(`Password updated! Redirecting...`);
      setTimeout(() => {
        navigate(getRoleRoute(result.user));
      }, 1000);
    } else {
      setError(result.message);
    }
  };

  const cycleLang = () => {
    const localeValues = LOCALES.map(l => l.value);
    const currentIdx = localeValues.indexOf(locale);
    const nextIdx = (currentIdx + 1) % localeValues.length;
    setLocale(localeValues[nextIdx]);
  };

  // Keyboard navigation for accessibility
  const handleKeyDown = (e, emailVal, passVal) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleQuickLogin(emailVal, passVal);
    }
  };

  const handleQuickLogin = (emailVal, passVal) => {
    setError('');
    
    // Animate typing email
    let currentEmail = '';
    let emailIdx = 0;
    const emailInterval = setInterval(() => {
      if (emailIdx < emailVal.length) {
        currentEmail += emailVal[emailIdx];
        setEmail(currentEmail);
        emailIdx++;
      } else {
        clearInterval(emailInterval);
        
        // Animate typing password
        let currentPass = '';
        let passIdx = 0;
        const passInterval = setInterval(() => {
          if (passIdx < passVal.length) {
            currentPass += passVal[passIdx];
            setPassword(currentPass);
            passIdx++;
          } else {
            clearInterval(passInterval);
            
            // Auto submit after short delay
            setTimeout(async () => {
              setIsLoading(true);
              const result = await login(emailVal, passVal);
              setIsLoading(false);
              if (result.success) {
                showToast(`Welcome back! Redirecting...`);
                setTimeout(() => {
                  navigate(getRoleRoute(result.user));
                }, 1000);
              } else {
                setError(result.message);
              }
            }, 300);
          }
        }, 30);
      }
    }, 20);
  };

  return (
    <AuthLayout theme={theme}>
      <div className={`login-page-wrapper ${!isLight ? 'dark-theme' : ''}`}>
        <canvas ref={canvasRef} id="canvas"></canvas>
        
        <div className="atmosphere">
          <div className="atm-radial-1"></div>
          <div className="atm-radial-2"></div>
          <div className="atm-radial-3"></div>
        </div>
        
        <div className="noise"></div>

        <div className="page">
          {/* ══ RIGHT AUTH PANEL (NOW CENTRED FULL SCREEN) ══ */}
          <div className="top-controls">
            <div className="ctrl-btn" style={{ display: 'flex', alignItems: 'center', gap: '4px', paddingRight: '8px' }}>
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: 'inherit',
                  fontFamily: 'inherit',
                  fontWeight: 'inherit',
                  color: 'inherit',
                  cursor: 'pointer',
                  padding: '2px 0',
                }}
              >
                {LOCALES.map(l => (
                  <option key={l.value} value={l.value} style={{ background: 'var(--ng-card)', color: 'var(--ng-text-1)' }}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
            <button className="ctrl-btn" onClick={toggleTheme} title="Toggle theme">
              {isLight ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-brand-500" />}
            </button>
          </div>

          <div className="card-container">
            <div className="card">
              {/* Left Panel: Welcome details & 3D Doctor illustration */}
              <div className="card-left">
                <div className="left-graphics">
                  <svg className="wave-svg" viewBox="0 0 500 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
                    <path d="M0,220 C180,300 280,180 500,260 L500,500 L0,500 Z" fill="url(#mintGrad)" />
                    <defs>
                      <linearGradient id="mintGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#d2f1ec" stopOpacity="1" />
                        <stop offset="100%" stopColor="#a3e3d9" stopOpacity="1" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="left-content">
                  <h1 className="hello-title">{t('hello')}</h1>
                  <p className="hello-desc">{t('pleaseEnterDetails')}</p>
                </div>
                <div className="doctor-container">
                  <img src={doctorPointing} alt="Doctor" className="doctor-img" />
                </div>
              </div>

              {/* Right Panel: Clean form layout */}
              <div className="card-right">
                <div className="right-graphics">
                  <div className="circle-graphic dot-2"></div>
                </div>

                <div className="card-head">
                  <div className="logo flex items-center justify-center gap-3">
                    <div className="logo-gem">
                      <img src={logoNew} alt="Jeevan Roshini Logo" style={{ width: '48px', height: '48px', objectFit: 'contain', borderRadius: '12px' }} />
                    </div>
                    <div className="logo-wordmark">
                      <span className="logo-wordmark-main">Jeevan Roshini</span>
                      <span className="logo-wordmark-sub">Hospital Portal</span>
                    </div>
                  </div>
                  <div className="portal-badge">
                    <div className="portal-badge-dot"></div>
                    <span className="portal-badge-text">Ayathana Trust · Secure Portal</span>
                  </div>
                </div>

                {!showChangePassword ? (
                  <form id="loginForm" onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                      <label className="form-label" htmlFor="email">{t('emailAddress')}</label>
                      <div className="input-field" id="emailField">
                        <input 
                          type="email" 
                          id="email" 
                          placeholder="me@ayathanatrust.org" 
                          autoComplete="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          style={{ paddingLeft: '16px', paddingRight: '16px' }}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="password">{t('passwordLabel')}</label>
                      <div className="input-field" id="passField">
                        <input 
                          type={showPassword ? 'text' : 'password'} 
                          id="password" 
                          placeholder="••••••••" 
                          autoComplete="current-password"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          style={{ paddingLeft: '16px', paddingRight: '44px' }}
                        />
                        <button 
                          type="button" 
                          className="eye-toggle" 
                          id="eyeBtn" 
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {error && (
                      <div className="error-text" style={{ color: 'var(--ng-danger)', fontSize: '13px', marginTop: '-8px', marginBottom: '16px', textAlign: 'left', fontWeight: '500' }}>
                        {error}
                      </div>
                    )}

                    <div className="form-row">
                      <label className="check-group">
                        <input type="checkbox" id="remember" />
                        <span className="check-box">
                          <svg viewBox="0 0 9 9"><path d="M2 4.5l2 2 3.5-3.5"/></svg>
                        </span>
                        <span className="check-label">{t('keepMeSignedIn')}</span>
                      </label>
                    </div>

                    <button type="submit" className={`cta-btn ${isLoading ? 'loading' : ''}`} id="ctaBtn" disabled={isLoading}>
                      <div className="cta-inner">
                        <span className="btn-text">{isLoading ? t('signingIn') : t('accessPortal')}</span>
                        {!isLoading && <ArrowRight className="cta-arrow" />}
                        <div className="btn-spinner"></div>
                      </div>
                    </button>

                    <div className="form-links-row" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px', alignItems: 'center' }}>
                      <a href="#" className="forgot-link" style={{ fontSize: '13px', fontWeight: '500' }}>{t('forgotPassword')}</a>
                      <span style={{ fontSize: '13px', color: 'var(--ng-text-2)' }}>
                        Do Not Have Account? <a href="#" style={{ color: 'var(--ng-teal)', fontWeight: '600' }}>Sign Up</a>
                      </span>
                    </div>
                  </form>
                ) : (
                  <form id="changePasswordForm" onSubmit={handleChangePasswordSubmit} noValidate>
                    <div style={{ marginBottom: '20px', padding: '12px', background: 'rgba(225, 29, 72, 0.1)', border: '1px solid rgba(225, 29, 72, 0.3)', borderRadius: '8px' }}>
                      <p style={{ margin: 0, color: '#e11d48', fontSize: '13px', fontWeight: '600' }}>
                        For security reasons, you must change your temporary password before proceeding.
                      </p>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="newPassword">New Password</label>
                      <div className="input-field">
                        <input 
                          type="password" 
                          id="newPassword" 
                          placeholder="At least 8 characters" 
                          value={newPassword}
                          onChange={e => setNewPassword(e.target.value)}
                          style={{ paddingLeft: '16px', paddingRight: '16px' }}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                      <div className="input-field">
                        <input 
                          type="password" 
                          id="confirmPassword" 
                          placeholder="Repeat new password" 
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                          style={{ paddingLeft: '16px', paddingRight: '16px' }}
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="error-text" style={{ color: 'var(--ng-danger)', fontSize: '13px', marginTop: '-8px', marginBottom: '16px', textAlign: 'left', fontWeight: '500' }}>
                        {error}
                      </div>
                    )}

                    <button type="submit" className={`cta-btn ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
                      <div className="cta-inner">
                        <span className="btn-text">{isLoading ? 'Updating...' : 'Set Password & Login'}</span>
                        {!isLoading && <Check className="cta-arrow" />}
                        <div className="btn-spinner"></div>
                      </div>
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Demo Access & Live Metrics placed in a matching secondary container beneath the main Dribbble card */}
            <div className="secondary-card">
              <div className="separator">
                <div className="sep-line"></div>
                <span className="sep-label">{t('quickDemoAccess')}</span>
                <div className="sep-line"></div>
              </div>

              <div className="demo-grid">
                <div 
                  className="demo-item d-admin" 
                  onClick={() => handleQuickLogin('admin@ayathanatrust.org', 'admin123')} 
                  tabIndex="0" 
                  role="button"
                  onKeyDown={e => handleKeyDown(e, 'admin@ayathanatrust.org', 'admin123')}
                >
                  <div className="demo-badge">Super Admin</div>
                  <div className="demo-role">Ayathana Trust</div>
                  <div className="demo-email">admin@ayathanatrust.org</div>
                </div>
                <div 
                  className="demo-item d-dir" 
                  onClick={() => handleQuickLogin('director@ayathanatrust.org', 'director123')} 
                  tabIndex="0" 
                  role="button"
                  onKeyDown={e => handleKeyDown(e, 'director@ayathanatrust.org', 'director123')}
                >
                  <div className="demo-badge">Project Director</div>
                  <div className="demo-role">Ayathana Trust</div>
                  <div className="demo-email">director@ayathanatrust.org</div>
                </div>
                <div 
                  className="demo-item d-vhw1" 
                  onClick={() => handleQuickLogin('preema@ayathanatrust.org', 'vhw123')} 
                  tabIndex="0" 
                  role="button"
                  onKeyDown={e => handleKeyDown(e, 'preema@ayathanatrust.org', 'vhw123')}
                >
                  <div className="demo-badge">VHW</div>
                  <div className="demo-role">Preema D'Souza</div>
                  <div className="demo-email">preema@ayathanatrust.org</div>
                </div>
                <div 
                  className="demo-item d-vhw2" 
                  onClick={() => handleQuickLogin('shobha@ayathanatrust.org', 'vhw123')} 
                  tabIndex="0" 
                  role="button"
                  onKeyDown={e => handleKeyDown(e, 'shobha@ayathanatrust.org', 'vhw123')}
                >
                  <div className="demo-badge">VHW</div>
                  <div className="demo-role">Shobha Nayak</div>
                  <div className="demo-email">shobha@ayathanatrust.org</div>
                </div>
              </div>

              <div className="clinical-stats-header">{t('liveClinicalMetrics')}</div>
              <div className="stats-row">
                <div className="stat">
                  <div className="stat-val">{villagesCount}</div>
                  <div className="stat-label">Villages</div>
                </div>
                <div className="stat">
                  <div className="stat-val">{individualsCount.toLocaleString()}</div>
                  <div className="stat-label">Patients</div>
                </div>
                <div className="stat">
                  <div className="stat-val">{staffCount}</div>
                  <div className="stat-label">VHW Staff</div>
                </div>
              </div>

              <div className="card-foot">
                {t('needHelp')} <a href="#">{t('contactAdmin')}</a> &nbsp;·&nbsp; <a href="#">{t('privacyPolicy')}</a> &nbsp;·&nbsp; v2.4.1
              </div>

            </div>
          </div>

        </div>

        {/* Ticker at the absolute bottom of viewport */}
        <div className="ticker-wrap">
          <div className="ticker-inner" id="ticker">
            <span className="ticker-item"><span>3,812</span> Families registered <div className="ticker-dot"></div></span>
            <span className="ticker-item"><span>247</span> High-risk cases monitored <div className="ticker-dot"></div></span>
            <span className="ticker-item"><span>42</span> VHW visits today <div className="ticker-dot"></div></span>
            <span className="ticker-item"><span>Module 4</span> Training live <div className="ticker-dot"></div></span>
            <span className="ticker-item"><span>Ayathana</span> Trust · 24 villages active <div className="ticker-dot"></div></span>
            <span className="ticker-item"><span>3,812</span> Families registered <div className="ticker-dot"></div></span>
            <span className="ticker-item"><span>247</span> High-risk cases monitored <div className="ticker-dot"></div></span>
            <span className="ticker-item"><span>42</span> VHW visits today <div className="ticker-dot"></div></span>
            <span className="ticker-item"><span>Module 4</span> Training live <div className="ticker-dot"></div></span>
            <span className="ticker-item"><span>Ayathana</span> Trust · 24 villages active <div className="ticker-dot"></div></span>
          </div>
        </div>
      </div>

      <div className={`toast ${toast.show ? 'show' : ''}`} id="toast">
        <div className="toast-pulse"></div>
        <span className="toast-text" id="toastText">{toast.message}</span>
      </div>

    </AuthLayout>
  );
}
