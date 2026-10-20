import React from 'react';
import { Layers, ShieldCheck, Cpu } from 'lucide-react';

export const BrandPhilosophy: React.FC = () => {
  return (
    <section id="philosophy-section" className="py-24 bg-[#08090B] border-b border-[#1A1D23]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#9298A2]">
            Engineering Philosophy
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#F5F5F3] tracking-tight font-display">
            Form follows ritual. Materials honed without compromise.
          </h2>
          <p className="text-base text-[#9298A2] leading-relaxed">
            Disposable culture has saturated the market with fleeting plastics. VYRO was founded on the opposite conviction: vapor hardware should possess the permanence, tactile density, and refined tolerance of high horology and precision aerospace tooling.
          </p>
        </div>

        {/* 3 Editorial Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pillar 01 */}
          <div className="p-8 bg-[#121419] rounded-xl border border-[#262A33] space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#9298A2] uppercase tracking-wider">
                01. Material Rigor
              </span>
              <Layers className="w-5 h-5 text-[#C5CBD3]" />
            </div>
            <h3 className="text-lg font-semibold text-[#F5F5F3]">
              Monolithic Aircraft Alloy
            </h3>
            <p className="text-sm text-[#9298A2] leading-relaxed">
              Every chassis begins as a solid billet of 6000-series alloy, CNC-machined to within 10-micron tolerances and bead-blasted to achieve an enduring, fingerprint-resistant tactile handfeel.
            </p>
          </div>

          {/* Pillar 02 */}
          <div className="p-8 bg-[#121419] rounded-xl border border-[#262A33] space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#9298A2] uppercase tracking-wider">
                02. Thermal Stability
              </span>
              <Cpu className="w-5 h-5 text-[#C5CBD3]" />
            </div>
            <h3 className="text-lg font-semibold text-[#F5F5F3]">
              Microporous Dual Ceramic
            </h3>
            <p className="text-sm text-[#9298A2] leading-relaxed">
              Traditional organic wicks degrade and scorch over repeated heating. VYRO proprietary C-Cell ceramic cores withstand over 10,000 thermal duty cycles with total flavor neutrality.
            </p>
          </div>

          {/* Pillar 03 */}
          <div className="p-8 bg-[#121419] rounded-xl border border-[#262A33] space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#9298A2] uppercase tracking-wider">
                03. Fluidic Precision
              </span>
              <ShieldCheck className="w-5 h-5 text-[#C5CBD3]" />
            </div>
            <h3 className="text-lg font-semibold text-[#F5F5F3]">
              Hermetic Labyrinth Seals
            </h3>
            <p className="text-sm text-[#9298A2] leading-relaxed">
              Dual-stage condensation traps and medical-grade fluorosilicone seals guarantee zero leakage, safeguarding device electronics whether stored in your tailored pocket or flight luggage.
            </p>
          </div>
        </div>

        {/* Editorial Showcase Strip */}
        <div className="mt-16 bg-[#121419] rounded-xl border border-[#262A33] p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#9298A2]">
              Craftsmanship Narrative
            </span>
            <h3 className="text-2xl font-bold text-[#F5F5F3] font-display">
              Designed in Berlin. Calibrated in Tokyo.
            </h3>
            <p className="text-sm text-[#9298A2] leading-relaxed">
              From our minimal chamfer profiles to our bespoke magnetic click-lock resistance, every interaction is engineered to reward the senses. No flashing gimmicks. No loud branding. Just pure functional quietude.
            </p>
            <div className="flex items-center gap-6 pt-4 text-xs font-mono text-[#9298A2]">
              <div>
                <p className="text-base font-bold text-[#F5F5F3] tabular-nums">0.01mm</p>
                <p>Milling Tolerance</p>
              </div>
              <div className="h-8 w-px bg-[#262A33]" />
              <div>
                <p className="text-base font-bold text-[#F5F5F3] tabular-nums">100%</p>
                <p>PVD Scratch Sealed</p>
              </div>
              <div className="h-8 w-px bg-[#262A33]" />
              <div>
                <p className="text-base font-bold text-[#F5F5F3] tabular-nums">2-Year</p>
                <p>Limited Warranty</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-[#262A33] bg-[#1A1D23]">
              <img
                src="/src/assets/images/product_vyro_dock_1792505077372.jpg"
                alt="VYRO Titan Magnetic Dock and pod system on desk"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
