import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, ChevronRight, MapPin, Users, Heart, Activity,
  CheckCircle, Star, Shield, Leaf, Home, Baby, UserCheck,
  TrendingUp, Smartphone, BarChart3
} from 'lucide-react';
import './HomePage.css';

import heroCommunity  from '../assets/hero_community.png';
import maternalHealth from '../assets/maternal_health.png';
import villageProgram from '../assets/village_program.png';
import logoNew from '../assets/logo_new.jpg';

/**
 * CountUp — Animated number counter that runs once when element is visible.
 */
function CountUp({ end, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = null;
          const endNum = typeof end === 'number' ? end : parseInt(end, 10);
          const step = (ts) => {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            const ease = progress < 0.5
              ? 2 * progress * progress
              : -1 + (4 - 2 * progress) * progress;
            setCount(Math.floor(ease * endNum));
            if (progress < 1) requestAnimationFrame(step);
            else setCount(endNum);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count.toLocaleString('en-IN')}{suffix}</span>;
}

/**
 * FadeUp — Animates children into view on scroll.
 */
function FadeUp({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`hp-fade-up ${visible ? 'visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ─── Data ─── */
const FEATURES = [
  {
    emoji: '❤️',
    title: 'Family Health Registry',
    desc: 'Register and monitor families, maintain comprehensive household health profiles, track health history, and identify vulnerable populations needing priority care.',
    link: 'Family Registry'
  },
  {
    emoji: '🤰',
    title: 'Maternal & Child Health',
    desc: 'Track pregnancies, monitor antenatal visits, record immunizations, assess nutrition indicators, and track child developmental milestones from birth.',
    link: 'MCH Program'
  },
  {
    emoji: '👵',
    title: 'Elderly & Vulnerable Care',
    desc: 'Monitor elderly individuals, persons with disabilities, widows, and palliative care beneficiaries with dedicated care plans and follow-up schedules.',
    link: 'Elderly Care'
  },
  {
    emoji: '🩺',
    title: 'Chronic Disease Monitoring',
    desc: 'Track diabetes, hypertension, tuberculosis, malnutrition (SAM/MAM), and high-risk conditions with structured screening and referral workflows.',
    link: 'NCD Monitoring'
  },
  {
    emoji: '📍',
    title: 'Field Visit Management',
    desc: 'Enable Village Health Workers to conduct structured visits, collect health data offline, complete follow-up tasks, and sync when connected.',
    link: 'Field Operations'
  },
  {
    emoji: '📊',
    title: 'Community Analytics',
    desc: 'Generate actionable insights through executive dashboards, village-level comparisons, health trend analysis, and automated risk alert systems.',
    link: 'Analytics Hub'
  }
];

const JOURNEY_STEPS = [
  { icon: '🏘️', label: 'Village Registration' },
  { icon: '👨‍👩‍👧‍👦', label: 'Family Enrollment' },
  { icon: '📋', label: 'Health Assessment' },
  { icon: '📡', label: 'Health Monitoring' },
  { icon: '🔄', label: 'Follow-up & Referrals' },
  { icon: '📢', label: 'Community Awareness' },
  { icon: '🌱', label: 'Improved Outcomes' }
];

const METRICS = [
  { emoji: '🏘️', num: 24,    suffix: '+',  label: 'Villages Covered' },
  { emoji: '🏠', num: 3812,  suffix: '+',  label: 'Families Registered' },
  { emoji: '👥', num: 18440, suffix: '+',  label: 'Individuals Monitored' },
  { emoji: '🤰', num: 284,   suffix: '',   label: 'Pregnant Mothers Supported' },
  { emoji: '👶', num: 1240,  suffix: '+',  label: 'Children Screened' },
  { emoji: '📋', num: 96,    suffix: '',   label: 'Community Programs' },
  { emoji: '⚠️', num: 247,   suffix: '',   label: 'High-Risk Cases Monitored' },
  { emoji: '🩺', num: 26,    suffix: '',   label: 'Village Health Workers Active' }
];

const VISION_PILLARS = [
  { icon: '🏡', title: 'Every Family Registered', desc: 'Complete household census and health baseline across all villages' },
  { icon: '👁️', title: 'Every Vulnerable Monitored', desc: 'Proactive identification and continuous follow-up for at-risk individuals' },
  { icon: '📶', title: 'Offline-First Field Tools', desc: 'Works without internet — field data syncs when connectivity returns' },
  { icon: '📈', title: 'Data-Driven Decisions', desc: 'Actionable dashboards so administrators can act before crises emerge' }
];

/**
 * HomePage — Public-facing marketing homepage for Jeevan Roshini.
 * Inspired by NextGen Healthcare's care journey approach,
 * adapted for a community & village health context.
 */
export default function HomePage() {
  // Sticky nav shadow on scroll
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="hp">
      {/* ══ NAVIGATION ══ */}
      <nav className="hp-nav" style={{ boxShadow: scrolled ? '0 4px 24px rgba(11,110,110,0.1)' : undefined }}>
        <div className="hp-nav-inner">
          <Link to="/" className="hp-nav-logo">
            <div className="hp-nav-gem">
              <img src={logoNew} alt="Jeevan Roshini Logo" style={{ width: '44px', height: '44px', objectFit: 'contain', borderRadius: '10px' }} />
            </div>
            <div className="hp-nav-brand">
              <span className="hp-nav-name">Jeevan Roshini</span>
              <span className="hp-nav-sub">Community Health Portal</span>
            </div>
          </Link>

          <ul className="hp-nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#journey">Care Journey</a></li>
            <li><a href="#impact">Impact</a></li>
            <li><a href="#mission">Mission</a></li>
            <li><a href="#why">Why Us</a></li>
          </ul>

          <div className="hp-nav-cta">
            <a href="#impact" className="hp-btn-outline">
              View Impact
            </a>
            <Link to="/login" className="hp-btn-primary">
              Sign In <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ══ HERO SECTION ══ */}
      <section className="hp-hero" id="home">
        {/* Decorative leaf shapes */}
        <div className="hp-leaf hp-leaf-1" />
        <div className="hp-leaf hp-leaf-2" />
        <div className="hp-leaf hp-leaf-3" />

        <div className="hp-hero-inner">
          {/* Left: Text content */}
          <div>
            <div className="hp-hero-badge">
              <div className="hp-hero-badge-dot" />
              Ayathana Trust · Jeevan Roshini
            </div>

            <h1 className="hp-hero-h1">
              Transforming Rural Communities Through{' '}
              <em>Preventive Healthcare</em>
            </h1>

            <p className="hp-hero-sub">
              Empowering Village Health Workers, Project Directors, and Community Leaders with a unified digital platform for family health management, maternal care, child wellness, disease monitoring, and community development.
            </p>

            <div className="hp-hero-actions">
              <a href="#features" className="hp-btn-hero-primary">
                Explore Platform <ArrowRight size={16} />
              </a>
              <a href="#impact" className="hp-btn-hero-secondary">
                View Community Impact <ChevronRight size={16} />
              </a>
            </div>

            <div className="hp-hero-trust">
              <div className="hp-trust-item">
                <div className="hp-trust-icon">✓</div>
                24 Villages Active
              </div>
              <div className="hp-trust-item">
                <div className="hp-trust-icon">✓</div>
                18,440+ Beneficiaries
              </div>
              <div className="hp-trust-item">
                <div className="hp-trust-icon">✓</div>
                Offline-First PWA
              </div>
              <div className="hp-trust-item">
                <div className="hp-trust-icon">✓</div>
                9 Indian Languages
              </div>
            </div>
          </div>

          {/* Right: Hero visual */}
          <div className="hp-hero-visual">
            <div className="hp-hero-img-wrap">
              <img src={heroCommunity} alt="Village Health Worker visiting a family" />
            </div>

            {/* Floating metric pill — bottom left */}
            <div className="hp-hero-pill hp-hero-pill-1">
              <div className="hp-pill-icon teal">🏘️</div>
              <div>
                <div className="hp-pill-num">3,812</div>
                <div className="hp-pill-lbl">Families Registered</div>
              </div>
            </div>

            {/* Floating metric pill — top right */}
            <div className="hp-hero-pill hp-hero-pill-2">
              <div className="hp-pill-icon saffron">🤰</div>
              <div>
                <div className="hp-pill-num">284</div>
                <div className="hp-pill-lbl">Mothers Supported</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ MISSION SECTION ══ */}
      <section className="hp-mission" id="mission">
        <div className="hp-mission-inner">
          <FadeUp>
            <div className="hp-mission-img">
              <img src={maternalHealth} alt="Maternal and child health care in a village" />
              <div className="hp-mission-img-overlay">
                <p className="hp-mission-quote">
                  "Every visit matters. Every family counts. Every life we touch is a community transformed."
                </p>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={150}>
            <div>
              <div className="hp-section-label">Our Mission</div>
              <h2 className="hp-h2">Healthcare <em>Beyond Hospitals</em></h2>
              <p className="hp-body">
                Jeevan Roshini is a community-centered health management platform designed to strengthen preventive healthcare delivery across villages. By connecting families, health workers, and program administrators through a single digital ecosystem, the platform enables timely interventions, better follow-up care, improved maternal and child health outcomes, and stronger community wellbeing.
              </p>
              <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  'Community-first design — built for NGOs & Trusts',
                  'Preventive care over reactive treatment',
                  'Data ownership remains with communities',
                  'Multilingual support for 9 Indian languages',
                ].map((point, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: 'var(--text-2)', fontWeight: 500 }}>
                    <CheckCircle size={18} style={{ color: 'var(--teal)', flexShrink: 0 }} />
                    {point}
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ══ VISION SECTION ══ */}
      <section className="hp-vision">
        <div className="hp-vision-inner">
          <FadeUp>
            <div>
              <div className="hp-section-label">Our Vision</div>
              <h2 className="hp-h2">Building <em style={{ color: 'rgba(255,255,255,0.9)' }}>Healthier Villages</em>, One Family at a Time</h2>
              <p className="hp-body">
                Our vision is to create a sustainable healthcare ecosystem where every family is registered, every vulnerable individual is monitored, and every community has access to continuous health support. Through data-driven decision-making and field-level engagement, we aim to improve quality of life across rural communities.
              </p>
              <Link to="/login" className="hp-btn-primary" style={{ marginTop: 32, display: 'inline-flex', background: 'rgba(255,255,255,0.15)', backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,0.25)', boxShadow:'none' }}>
                Access the Platform <ArrowRight size={15} />
              </Link>
            </div>
          </FadeUp>

          <FadeUp delay={150}>
            <div className="hp-vision-pillars">
              {VISION_PILLARS.map((p, i) => (
                <div key={i} className="hp-pillar">
                  <span className="hp-pillar-icon">{p.icon}</span>
                  <div className="hp-pillar-title">{p.title}</div>
                  <div className="hp-pillar-desc">{p.desc}</div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ══ FEATURES SECTION ══ */}
      <section className="hp-features-bg" id="features">
        <div className="hp-section">
          <div style={{ textAlign: 'center' }}>
            <FadeUp>
              <div className="hp-section-label" style={{ justifyContent: 'center' }}>Platform Capabilities</div>
              <h2 className="hp-h2">Comprehensive Community Health Management</h2>
              <p className="hp-body hp-body-center" style={{ marginBottom: 0 }}>
                Every module is purpose-built for community health workers operating in rural areas — from family enrollment to chronic disease tracking.
              </p>
            </FadeUp>
          </div>

          <div className="hp-features-grid">
            {FEATURES.map((f, i) => (
              <FadeUp key={i} delay={i * 80}>
                <div className="hp-feature-card">
                  <span className="hp-feature-emoji">{f.emoji}</span>
                  <div className="hp-feature-title">{f.title}</div>
                  <p className="hp-feature-desc">{f.desc}</p>
                  <Link to="/login" className="hp-feature-link">
                    {f.link} <ChevronRight size={13} />
                  </Link>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CARE JOURNEY SECTION ══ */}
      <section className="hp-journey-bg" id="journey">
        <div className="hp-journey-inner">
          <div style={{ textAlign: 'center' }}>
            <FadeUp>
              <h2 className="hp-h2">The Community Health Journey</h2>
              <p className="hp-body hp-body-center">
                From the first village census to long-term health outcomes — a connected workflow that ensures no family is missed and no case is forgotten.
              </p>
            </FadeUp>
          </div>

          <FadeUp delay={200}>
            <div className="hp-journey-flow">
              {JOURNEY_STEPS.map((step, i) => (
                <div key={i} className="hp-journey-step">
                  <div className="hp-journey-node">{step.icon}</div>
                  <div className="hp-journey-label">{step.label}</div>
                </div>
              ))}
            </div>
          </FadeUp>

          {/* Journey context cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginTop: 56 }}>
            {[
              { icon: <MapPin size={20} />, color: '#0B6E6E', title: 'Village-Level Coverage', desc: 'Every village mapped, every household identified. Geographic coverage ensures universal reach.' },
              { icon: <Users size={20} />, color: '#3D7A5E', title: 'Family-Centred Records', desc: 'Health data organized by family units, making follow-ups and household interventions seamless.' },
              { icon: <Heart size={20} />, color: '#E8830A', title: 'Preventive First', desc: 'Early detection, vaccination tracking, and nutritional assessments prevent crises before they occur.' },
              { icon: <TrendingUp size={20} />, color: '#1B2B5B', title: 'Measured Outcomes', desc: 'Track health improvements over time with data that proves program effectiveness to stakeholders.' }
            ].map((card, i) => (
              <FadeUp key={i} delay={i * 100}>
                <div style={{
                  background: 'white',
                  border: '1px solid var(--border)',
                  borderRadius: 16,
                  padding: '24px 20px',
                  boxShadow: '0 2px 12px rgba(11,110,110,0.06)',
                  display: 'flex',
                  gap: 16,
                  alignItems: 'flex-start'
                }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `${card.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color, flexShrink: 0 }}>
                    {card.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)', marginBottom: 6 }}>{card.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>{card.desc}</div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══ IMPACT METRICS ══ */}
      <section className="hp-impact-bg" id="impact">
        <div className="hp-section">
          <div style={{ textAlign: 'center' }}>
            <FadeUp>
              <div className="hp-section-label" style={{ justifyContent: 'center' }}>Real Community Impact</div>
              <h2 className="hp-h2">Measuring <em>Community Impact</em></h2>
              <p className="hp-body hp-body-center">
                Every number represents a real family, a real village, a real life touched by preventive care and community health programs.
              </p>
            </FadeUp>
          </div>

          <div className="hp-metrics-grid">
            {METRICS.map((m, i) => (
              <FadeUp key={i} delay={i * 70}>
                <div className="hp-metric-card">
                  <span className="hp-metric-emoji">{m.emoji}</span>
                  <div className="hp-metric-num">
                    <CountUp end={m.num} suffix={m.suffix} />
                  </div>
                  <div className="hp-metric-label">{m.label}</div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WHY JEEVAN ROSHINI ══ */}
      <section className="hp-why-bg" id="why">
        <div className="hp-why-inner">
          <FadeUp>
            <div className="hp-why-img">
              <img src={villageProgram} alt="Community health program in a village" />
            </div>
          </FadeUp>

          <FadeUp delay={150}>
            <div>
              <div className="hp-section-label">Why Jeevan Roshini</div>
              <h2 className="hp-h2">Designed for <em>Community Health Programs</em></h2>
              <p className="hp-body">
                Unlike traditional hospital systems, Jeevan Roshini focuses on preventive healthcare, community outreach, family wellness, and rural health development. The platform is designed specifically for NGOs, Trusts, Public Health Initiatives, and Community Development Programs.
              </p>

              <div className="hp-compare">
                <div className="hp-compare-col hospital">
                  <div className="hp-compare-title">Hospital Systems</div>
                  {['Reactive care', 'In-facility only', 'Individual patient focus', 'Requires strong internet', 'Expensive infrastructure'].map((t, i) => (
                    <div key={i} className="hp-compare-item">{t}</div>
                  ))}
                </div>
                <div className="hp-compare-col community">
                  <div className="hp-compare-title">Jeevan Roshini</div>
                  {['Preventive & proactive', 'Field + village level', 'Family & community focus', 'Offline-first PWA', 'Affordable & scalable'].map((t, i) => (
                    <div key={i} className="hp-compare-item">{t}</div>
                  ))}
                </div>
              </div>

              <Link to="/login" className="hp-btn-primary" style={{ marginTop: 28, display: 'inline-flex' }}>
                Access the Portal <ArrowRight size={15} />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ══ QUOTE STRIP ══ */}
      <section className="hp-quote-strip">
        <p className="hp-quote-text">
          "Transforming Community Health Through Compassion and Technology."
        </p>
        <div className="hp-quote-attr">— Ayathana Trust · Jeevan Roshini Programme</div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="hp-footer">
        <div className="hp-footer-inner">
          <div className="hp-footer-top">
            <div>
              <div className="hp-footer-brand-name">
                <div className="hp-nav-gem" style={{ width: 32, height: 32, borderRadius: 8 }}>
                  <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 18, height: 18 }}>
                    <path d="M22 8C22 8 12 14 12 22a10 10 0 0020 0C32 14 22 8 22 8z" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M22 14v10M16 19h12" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                Jeevan Roshini
              </div>
              <p className="hp-footer-brand-desc">
                A community health management platform connecting families, health workers, and administrators for better health outcomes in rural India.
              </p>
              <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
                <Link to="/login" className="hp-footer-login-btn">
                  Staff Login <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            <div>
              <div className="hp-footer-col-title">Platform</div>
              <ul className="hp-footer-links">
                {['Family Registry', 'Maternal Health', 'Child Wellness', 'Field Visits', 'Analytics Dashboard'].map(l => (
                  <li key={l}><Link to="/login">{l}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <div className="hp-footer-col-title">Programs</div>
              <ul className="hp-footer-links">
                {['NCD Screening', 'Malnutrition (SAM)', 'Elderly Care', 'Social Support', 'Community Awareness'].map(l => (
                  <li key={l}><Link to="/login">{l}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <div className="hp-footer-col-title">Organisation</div>
              <ul className="hp-footer-links">
                {['Ayathana Trust', 'About the Programme', 'Contact Admin'].map(l => (
                  <li key={l}><a href="#">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="hp-footer-bottom">
            <span>© 2026 Ayathana Trust · Jeevan Roshini Community Health Programme · All Rights Reserved</span>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>
              Healthy Families Create Strong Communities.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
