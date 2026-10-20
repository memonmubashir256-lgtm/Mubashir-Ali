import React, { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onExplore: () => void;
  onDiscover: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExplore, onDiscover }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <section className="relative overflow-hidden bg-[#08090B] border-b border-[#1A1D23] pt-12 pb-20 lg:pt-20 lg:pb-32">
      {/* Background subtle radial gradient */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#1A1D23]/40 to-transparent blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Hero Text Column */}
          <div className="lg:col-span-7 space-y-8">
            {/* Clean unboxed text metadata (No pill badges) */}
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#9298A2]">
              <span>Series 01 Release</span>
              <span aria-hidden="true">·</span>
              <span>Aerospace Aluminum</span>
              <span aria-hidden="true">·</span>
              <span>Ceramic Core</span>
            </div>

            {/* Display Headline with text-wrap: balance */}
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F5F5F3] leading-[1.08] font-display"
              style={{ textWrap: 'balance' }}
            >
              DESIGNED FOR YOUR OWN WAY.
            </h1>

            {/* Supporting Brand Statement */}
            <p className="text-base sm:text-lg text-[#9298A2] max-w-xl leading-relaxed">
              Monolithic form sculpted from solid aerospace billet. Intelligently calibrated draw dynamics and pure porous ceramic atomization. A bespoke ritual, refined for the modern purist.
            </p>

            {/* Action Buttons (1 Primary + 1 Secondary) */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExplore}
                className="px-7 py-3.5 bg-[#F5F5F3] hover:bg-[#C5CBD3] text-[#08090B] font-semibold text-sm rounded-lg flex items-center gap-2.5 transition-all shadow-lg hover:shadow-white/10 active:scale-[0.98] whitespace-nowrap shrink-0"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onDiscover}
                className="px-7 py-3.5 bg-transparent hover:bg-[#1A1D23] text-[#F5F5F3] border border-[#262A33] hover:border-[#C5CBD3] font-medium text-sm rounded-lg transition-all whitespace-nowrap shrink-0"
              >
                Discover VYRO
              </button>
            </div>

            {/* Hero Proof & Technical Points */}
            <div className="pt-8 border-t border-[#1A1D23] grid grid-cols-3 gap-6 text-left">
              <div>
                <p className="text-xl sm:text-2xl font-bold text-[#F5F5F3] font-mono tabular-nums">
                  0.02s
                </p>
                <p className="text-xs text-[#9298A2] mt-1">Instant Draw Latency</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-[#F5F5F3] font-mono tabular-nums">
                  6061-T6
                </p>
                <p className="text-xs text-[#9298A2] mt-1">Aircraft Monolith</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-[#F5F5F3] font-mono tabular-nums">
                  10,000+
                </p>
                <p className="text-xs text-[#9298A2] mt-1">Duty Cycles Tested</p>
              </div>
            </div>
          </div>

          {/* Right Hero Image Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-[4/5] rounded-xl overflow-hidden border border-[#262A33] bg-[#121419] shadow-2xl group">
              {!imageError ? (
                <img
                  src="/src/assets/images/hero_vyro_device_1792505074590.jpg"
                  alt="VYRO Onyx Pro luxury pod device standing on dark obsidian stone"
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#1A1D23] to-[#08090B] p-8 text-center">
                  <Sparkles className="w-8 h-8 text-[#C5CBD3] mb-3" />
                  <p className="text-lg font-bold text-[#F5F5F3]">VYRO Onyx Pro</p>
                  <p className="text-xs text-[#9298A2] mt-1">Flagship Monolithic System</p>
                </div>
              )}

              {/* Scrim Overlay at base */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#08090B] via-transparent to-transparent opacity-60 pointer-events-none"
                aria-hidden="true"
              />

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-[#C5CBD3] bg-[#08090B]/80 backdrop-blur-md px-3 py-2 rounded border border-[#262A33]">
                <span className="font-medium text-[#F5F5F3]">VYRO Onyx Pro System</span>
                <span className="font-mono tabular-nums text-white">$129.00 USD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
