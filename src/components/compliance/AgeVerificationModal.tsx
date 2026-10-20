import React, { useState } from 'react';
import { useCompliance } from '../../context/ComplianceContext';
import { useToast } from '../../context/ToastContext';
import { ShieldCheck, AlertCircle } from 'lucide-react';

export const AgeVerificationModal: React.FC = () => {
  const { showAgeGate, verifyAge, settings } = useCompliance();
  const { addToast } = useToast();
  const [underageWarning, setUnderageWarning] = useState(false);

  if (!showAgeGate) return null;

  const handleConfirm = () => {
    verifyAge();
    addToast('success', 'Age Verified', `Access granted under ${settings.minimumAge}+ compliance policy.`);
  };

  const handleDecline = () => {
    setUnderageWarning(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300"
    >
      <div className="relative w-full max-w-lg bg-[#08090B] border border-[#262A33] rounded-2xl p-8 sm:p-10 shadow-2xl text-center space-y-6">
        {/* Brand Lockup */}
        <div className="space-y-2">
          <p className="text-2xl font-bold tracking-[0.25em] text-[#F5F5F3] font-display">
            VYRO
          </p>
          <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-[#9298A2] uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Statutory Age Verification Required</span>
          </div>
        </div>

        {/* Notice text */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-[#F5F5F3] font-display">
            Are you of legal age to view vapor hardware?
          </h2>
          <p className="text-xs text-[#9298A2] leading-relaxed max-w-sm mx-auto">
            This platform contains precision pod hardware and vaporization accessories. In compliance with applicable regulations, access is strictly limited to verified adults age {settings.minimumAge} and older.
          </p>
        </div>

        {underageWarning && (
          <div className="p-4 bg-rose-950/30 border border-rose-800/40 rounded-xl text-xs text-rose-300 flex items-start gap-2.5 text-left">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <p>
              Access restricted. Under federal and international law, visitors below age {settings.minimumAge} cannot browse or purchase regulated vapor devices.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleConfirm}
            className="w-full py-3.5 px-6 bg-[#F5F5F3] hover:bg-[#C5CBD3] text-[#08090B] font-semibold text-xs rounded-lg transition-all shadow-lg active:scale-[0.98]"
          >
            I am {settings.minimumAge} or Older — Enter Platform
          </button>

          <button
            onClick={handleDecline}
            className="w-full py-3 px-6 bg-transparent hover:bg-[#121419] text-[#9298A2] hover:text-[#F5F5F3] text-xs font-medium rounded-lg border border-[#262A33] transition-colors"
          >
            I am under {settings.minimumAge} — Exit
          </button>
        </div>

        <p className="text-[10px] text-[#9298A2]/60 font-mono">
          CALIBRATED UNDER FDA 21 CFR &amp; EU TPD DIRECTIVES · AUDIT VERIFIED
        </p>
      </div>
    </div>
  );
};
