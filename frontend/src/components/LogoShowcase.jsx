import React, { useState } from 'react';
import { 
  Paintbrush, Check, Copy, Sliders, X, Sparkles, Layers, Info
} from 'lucide-react';
import logoDark from '../assets/logo_dark.png';
import logoLight from '../assets/logo_light.png';
import logoBrand from '../assets/logo_brand.png';

export default function LogoShowcase({ isOpen, onClose }) {
  const [logoType, setLogoType] = useState('brand'); // 'dark' | 'light' | 'brand'
  const [bgColor, setBgColor] = useState('#0d9488'); // Brand teal default
  const [customBg, setCustomBg] = useState('#0d9488');

  // Customization states
  const [glowIntensity, setGlowIntensity] = useState('medium'); // 'none' | 'low' | 'medium' | 'high'
  const [shadowDepth, setShadowDepth] = useState('lg'); // 'none' | 'md' | 'lg' | '2xl'
  const [shape, setShape] = useState('rounded-3xl'); // 'rounded-none' | 'rounded-2xl' | 'rounded-3xl' | 'rounded-full'
  const [showPattern, setShowPattern] = useState(true);
  const [copied, setCopied] = useState(false);

  // Early return AFTER all hooks (Rules of Hooks requirement)
  if (!isOpen) return null;

  // Background presets
  const presets = [
    { name: 'Dark Portal', value: '#020c14', text: 'text-slate-100', logo: 'dark' },
    { name: 'Light Portal', value: '#eef6fa', text: 'text-slate-800', logo: 'light' },
    { name: 'Teal Brand', value: '#0d9488', text: 'text-white', logo: 'brand' },
    { name: 'Emerald Care', value: '#059669', text: 'text-white', logo: 'brand' },
    { name: 'Royal Indigo', value: '#4f46e5', text: 'text-white', logo: 'brand' },
    { name: 'Luxury Gold', value: '#b45309', text: 'text-white', logo: 'brand' },
    { name: 'Rose Healing', value: '#e11d48', text: 'text-white', logo: 'brand' },
    { name: 'Charcoal Black', value: '#18181b', text: 'text-white', logo: 'dark' },
    { name: 'Transparent Grid', value: 'transparent', text: 'text-slate-800', logo: 'brand' }
  ];

  const getLogoImage = () => {
    if (logoType === 'dark') return logoDark;
    if (logoType === 'light') return logoLight;
    return logoBrand;
  };

  const getGlowStyle = () => {
    if (bgColor === 'transparent') return 'none';
    const intensityMap = {
      none: 'none',
      low: `0 10px 25px -5px ${bgColor}40`,
      medium: `0 20px 40px -10px ${bgColor}70, 0 4px 15px -3px ${bgColor}50`,
      high: `0 25px 50px -5px ${bgColor}90, 0 10px 25px -3px ${bgColor}70, 0 0 30px ${bgColor}40`
    };
    return intensityMap[glowIntensity];
  };

  const getShadowClass = () => {
    const shadowMap = {
      none: 'shadow-none',
      md: 'shadow-md',
      lg: 'shadow-lg',
      '2xl': 'shadow-2xl'
    };
    return shadowMap[shadowDepth];
  };

  const handlePresetSelect = (preset) => {
    setBgColor(preset.value);
    setLogoType(preset.logo);
  };

  const handleCustomColorChange = (e) => {
    const val = e.target.value;
    setCustomBg(val);
    setBgColor(val);
  };

  const handleCopyCSS = () => {
    const glowValue = getGlowStyle();
    const cssCode = `.brand-logo-container {
  background-color: ${bgColor};
  border-radius: ${shape === 'rounded-full' ? '50%' : shape === 'rounded-3xl' ? '24px' : shape === 'rounded-2xl' ? '16px' : '0px'};
  box-shadow: ${glowValue !== 'none' ? glowValue : '0 10px 15px -3px rgba(0, 0, 0, 0.1)'};
}`;
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-slate-950/70 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-auto max-h-[90vh] text-slate-100 relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Dynamic Preview Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-950 border-r border-slate-800/60 relative overflow-hidden">
          {/* Subtle medical grid background in preview area */}
          <div className="absolute inset-0 med-grid opacity-30 pointer-events-none" />
          
          <div className="mb-6 text-center z-10">
            <span className="text-[10px] font-bold tracking-widest text-teal-400 uppercase bg-teal-500/10 px-2.5 py-1 rounded-full flex items-center gap-1.5 justify-center mb-2">
              <Sparkles className="w-3 h-3 animate-spin-slow" /> Brand Showcase Playground
            </span>
            <h3 className="text-xl font-black text-white">Jeevan Roshini Logo</h3>
            <p className="text-xs text-slate-400 mt-1">Preview how our logo renders on different branding backgrounds</p>
          </div>

          {/* Logo Canvas Container */}
          <div className="flex-1 flex items-center justify-center w-full z-10 py-6">
            <div 
              className={`w-64 h-64 flex items-center justify-center transition-all duration-300 relative ${shape} ${getShadowClass()}`}
              style={{
                backgroundColor: bgColor === 'transparent' ? 'transparent' : bgColor,
                boxShadow: getGlowStyle(),
                backgroundImage: bgColor === 'transparent' ? 'radial-gradient(#475569 20%, transparent 20%), radial-gradient(#475569 20%, #1e293b 20%)' : 'none',
                backgroundSize: bgColor === 'transparent' ? '20px 20px' : 'auto',
                backgroundPosition: bgColor === 'transparent' ? '0 0, 10px 10px' : 'auto'
              }}
            >
              {showPattern && bgColor !== 'transparent' && (
                <div className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none rounded-[inherit]" style={{
                  backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
                  backgroundSize: '16px 16px'
                }} />
              )}
              
              <img 
                src={getLogoImage()} 
                alt="Jeevan Roshini Logo" 
                className="w-48 h-48 object-contain transition-all duration-300 hover:scale-105"
              />
            </div>
          </div>

          {/* Color Coordinates Overlay */}
          <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 flex justify-between items-center text-xs mt-4 z-10">
            <div className="space-y-0.5">
              <span className="text-slate-500 block text-[9px] uppercase font-bold">Selected Background Color</span>
              <span className="font-mono text-teal-300 font-semibold">{bgColor.toUpperCase()}</span>
            </div>
            <button 
              onClick={handleCopyCSS}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-[10px] uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-teal-700/20"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy CSS'}
            </button>
          </div>
        </div>

        {/* Right Side: Customization Sidebar */}
        <div className="w-full md:w-80 p-6 flex flex-col bg-slate-900 justify-between overflow-y-auto max-h-[50vh] md:max-h-none">
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-teal-400" /> Logo Variant
              </h4>
              <div className="grid grid-cols-3 gap-2 mt-2.5">
                {[
                  { id: 'brand', label: 'Gradient' },
                  { id: 'dark', label: 'Dark' },
                  { id: 'light', label: 'Light' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setLogoType(opt.id)}
                    className={`text-center py-2 rounded-xl text-xs font-bold border transition-all ${
                      logoType === opt.id 
                        ? 'bg-teal-500/10 border-teal-500 text-teal-400' 
                        : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Paintbrush className="w-3.5 h-3.5 text-teal-400" /> Background Presets
              </h4>
              <div className="grid grid-cols-3 gap-2 mt-2.5">
                {presets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePresetSelect(preset)}
                    className={`flex flex-col items-center p-2 rounded-xl border text-[9px] font-bold transition-all relative ${
                      bgColor === preset.value 
                        ? 'border-teal-500 bg-slate-800/80 scale-105' 
                        : 'border-slate-800 bg-slate-800/20 hover:bg-slate-800/40'
                    }`}
                  >
                    <div 
                      className="w-6 h-6 rounded-md border border-white/10 mb-1" 
                      style={{
                        backgroundColor: preset.value === 'transparent' ? 'transparent' : preset.value,
                        backgroundImage: preset.value === 'transparent' ? 'radial-gradient(#475569 20%, transparent 20%), radial-gradient(#475569 20%, #1e293b 20%)' : 'none',
                        backgroundSize: preset.value === 'transparent' ? '4px 4px' : 'auto'
                      }}
                    />
                    <span className="truncate w-full text-center text-[8px] text-slate-300">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-teal-400" /> Custom Background Color
              </h4>
              <div className="flex gap-3 items-center mt-2.5">
                <input 
                  type="color" 
                  value={customBg.startsWith('#') ? customBg : '#0d9488'}
                  onChange={handleCustomColorChange}
                  className="w-12 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
                />
                <input 
                  type="text" 
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  placeholder="#000000"
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono w-full text-slate-300 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-teal-400" /> Customization
              </h4>
              <div className="space-y-3 mt-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Container Glow</span>
                  <select 
                    value={glowIntensity} 
                    onChange={e => setGlowIntensity(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-2 py-1 text-xs text-slate-300 focus:outline-none"
                  >
                    <option value="none">None</option>
                    <option value="low">Subtle</option>
                    <option value="medium">Default</option>
                    <option value="high">Intense</option>
                  </select>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Box Shadow</span>
                  <select 
                    value={shadowDepth} 
                    onChange={e => setShadowDepth(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-2 py-1 text-xs text-slate-300 focus:outline-none"
                  >
                    <option value="none">Flat</option>
                    <option value="md">Medium</option>
                    <option value="lg">Large</option>
                    <option value="2xl">Extra Large</option>
                  </select>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Container Shape</span>
                  <select 
                    value={shape} 
                    onChange={e => setShape(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-2 py-1 text-xs text-slate-300 focus:outline-none"
                  >
                    <option value="rounded-none">Square</option>
                    <option value="rounded-2xl">Soft Rounded</option>
                    <option value="rounded-3xl">Pillowy Card</option>
                    <option value="rounded-full">Circular App Icon</option>
                  </select>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Subtle Dot Grid</span>
                  <input 
                    type="checkbox" 
                    checked={showPattern} 
                    onChange={e => setShowPattern(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-0 w-4 h-4 bg-slate-950 border-slate-800 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 mt-6 md:mt-0 flex gap-2 items-center text-[10px] text-slate-400 leading-normal">
            <Info className="w-4 h-4 text-teal-400 shrink-0" />
            <p>Exported logos can be saved and integrated as standard asset files in your web or mobile projects.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
