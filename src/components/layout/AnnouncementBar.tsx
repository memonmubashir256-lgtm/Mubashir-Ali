import React, { useState } from 'react';
import { useCompliance } from '../../context/ComplianceContext';
import { X, ShieldAlert, CheckCircle } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const { settings, setActivePolicyModal } = useCompliance();

  if (dismissed) return null;

  return (
    <aside
      aria-label="Compliance Announcement"
      className="bg-[#121419] border-b border-[#262A33] px-4 py-2 text-xs text-[#9298A2] transition-colors"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 overflow-hidden">
          {settings.commerceMode === 'DEMO_INFORMATIONAL' ? (
            <ShieldAlert className="w-3.5 h-3.5 text-[#C5CBD3] shrink-0" aria-hidden="true" />
          ) : (
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
          )}
          <p className="truncate font-medium text-[#F5F5F3] tracking-wide">
            {settings.announcementText}
          </p>
          <span className="hidden md:inline text-[#9298A2]" aria-hidden="true">·</span>
          <button
            onClick={() => setActivePolicyModal('compliance')}
            className="hidden md:inline text-[#C5CBD3] underline hover:text-white transition-colors shrink-0"
          >
            Review Legal Notice
          </button>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[11px] text-[#9298A2] font-mono uppercase tracking-wider hidden sm:inline">
            AGE {settings.minimumAge}+ RESTRICTED
          </span>
          <button
            onClick={() => setDismissed(true)}
            className="text-[#9298A2] hover:text-[#F5F5F3] p-0.5 rounded transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
