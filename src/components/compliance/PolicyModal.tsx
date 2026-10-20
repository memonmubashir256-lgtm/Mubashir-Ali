import React from 'react';
import { useCompliance } from '../../context/ComplianceContext';
import { X, ShieldCheck, FileText, Lock, Globe } from 'lucide-react';

export const PolicyModal: React.FC = () => {
  const { activePolicyModal, setActivePolicyModal, settings } = useCompliance();

  if (!activePolicyModal) return null;

  const getTitleAndContent = () => {
    switch (activePolicyModal) {
      case 'compliance':
        return {
          title: 'Age Verification & Legal Compliance Protocol',
          icon: ShieldCheck,
          content: (
            <div className="space-y-4 text-xs text-[#9298A2] leading-relaxed">
              <p>
                <strong className="text-[#F5F5F3]">1. Statutory Age Mandate:</strong> In accordance with federal legislation (Tobacco 21) and relevant international directives (e.g. EU Tobacco Products Directive 2014/40/EU), VYRO pod systems, ceramic atomizers, and related vapor hardware are offered exclusively to individuals who have achieved the legal age of majority ({settings.minimumAge}+).
              </p>
              <p>
                <strong className="text-[#F5F5F3]">2. Independent Verification Pipeline:</strong> Transactions and dispatch initiation are contingent on independent third-party age verification. Customers will not be permitted to complete checkout without providing authoritative date-of-birth and matching government credential assertions.
              </p>
              <p>
                <strong className="text-[#F5F5F3]">3. Informational Demo Safeguards:</strong> In compliance mode <code className="text-[#C5CBD3] bg-[#121419] px-1 py-0.5 rounded font-mono">DEMO_INFORMATIONAL</code>, the platform disables e-commerce payment collection entirely until an authorized business operator presents verified licensing documentation.
              </p>
              <p>
                <strong className="text-[#F5F5F3]">4. Health Disclosures:</strong> Vapor products may contain nicotine, an addictive substance. These devices are not smoking cessation aids and have not been evaluated as medical therapies.
              </p>
            </div>
          ),
        };
      case 'terms':
        return {
          title: 'Terms of Service',
          icon: FileText,
          content: (
            <div className="space-y-4 text-xs text-[#9298A2] leading-relaxed">
              <p>
                <strong className="text-[#F5F5F3]">1. Agreement to Terms:</strong> By entering and browsing the VYRO digital platform, you affirm under penalty of perjury that you are at least {settings.minimumAge} years of age and comply with all applicable local, regional, and national statutes.
              </p>
              <p>
                <strong className="text-[#F5F5F3]">2. Intellectual Property:</strong> All hardware schematics, CNC form profiles, industrial photographs, and registered hallmarks are the exclusive property of VYRO Technologies GmbH.
              </p>
              <p>
                <strong className="text-[#F5F5F3]">3. Warranty &amp; Hardware Support:</strong> Authentic VYRO Onyx Pro and Onyx Slim hardware includes a 24-month limited manufacturer warranty covering metallurgical defects, solder joints, and battery power cells under ordinary usage conditions.
              </p>
            </div>
          ),
        };
      case 'privacy':
        return {
          title: 'Privacy Policy & Data Security',
          icon: Lock,
          content: (
            <div className="space-y-4 text-xs text-[#9298A2] leading-relaxed">
              <p>
                <strong className="text-[#F5F5F3]">1. Minimalist Data Collection:</strong> VYRO strictly adheres to GDPR and CCPA standards. We only process customer delivery addresses, email addresses, and anonymized cryptographic tokens necessary to verify adult status.
              </p>
              <p>
                <strong className="text-[#F5F5F3]">2. Zero Card Storage:</strong> Payment card numbers, CVVs, and raw financial secrets are never stored on VYRO web application servers. All processing is tokenized through PCI-DSS Level 1 certified gateways.
              </p>
              <p>
                <strong className="text-[#F5F5F3]">3. Right to Erasure:</strong> Customers may submit an automated data erasure request directly through their user account dashboard at any time.
              </p>
            </div>
          ),
        };
      case 'shipping':
        return {
          title: 'Restricted Jurisdictions & Shipping Policy',
          icon: Globe,
          content: (
            <div className="space-y-4 text-xs text-[#9298A2] leading-relaxed">
              <p>
                <strong className="text-[#F5F5F3]">1. Delivery Restrictions:</strong> In compliance with the PACT Act and local flavor/hardware bans, VYRO does not dispatch hardware to prohibited jurisdictions (including UT, MA, and select municipal zones).
              </p>
              <p>
                <strong className="text-[#F5F5F3]">2. Adult Signature Requirement:</strong> All shipments containing pod systems require an adult signature ({settings.minimumAge}+) with photographic ID inspection upon postal carrier delivery.
              </p>
              <p>
                <strong className="text-[#F5F5F3]">3. Dispatch Timelines:</strong> Verified orders are dispatched from our bonded climate-controlled warehouse within 24 business hours.
              </p>
            </div>
          ),
        };
    }
  };

  const { title, icon: Icon, content } = getTitleAndContent();

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-[#08090B] border border-[#262A33] rounded-2xl overflow-hidden shadow-2xl my-8">
        <div className="p-6 border-b border-[#262A33] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Icon className="w-5 h-5 text-[#C5CBD3]" />
            <h2 className="text-base font-bold text-[#F5F5F3]">{title}</h2>
          </div>
          <button
            onClick={() => setActivePolicyModal(null)}
            className="p-1.5 text-[#9298A2] hover:text-[#F5F5F3] rounded-lg hover:bg-[#1A1D23]"
            aria-label="Close policy modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto">{content}</div>

        <div className="p-4 border-t border-[#262A33] bg-[#121419] flex justify-end">
          <button
            onClick={() => setActivePolicyModal(null)}
            className="px-5 py-2 bg-[#F5F5F3] hover:bg-[#C5CBD3] text-[#08090B] text-xs font-semibold rounded-lg transition-colors"
          >
            Close Notice
          </button>
        </div>
      </div>
    </div>
  );
};
