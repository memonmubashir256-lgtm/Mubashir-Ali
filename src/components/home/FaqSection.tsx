import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'How is age verification executed on the VYRO platform?',
    answer:
      'In compliance with federal and international regulations governing vapor products, orders require authoritative third-party age verification before shipment. In demo compliance mode, the platform demonstrates this verification pipeline using synthetic audit assertions without collecting non-essential personal identifiers.',
  },
  {
    question: 'What distinguishes the monolithic aerospace chassis from standard pod devices?',
    answer:
      'Rather than stamped sheet metal or injected polycarbonate plastic, each VYRO chassis is carved from a solid ingot of 6061-T6 aerospace aluminum. This provides superior structural rigidity, natural heat dissipation, and an authoritative, balanced weight distribution in the hand.',
  },
  {
    question: 'How does VYRO C-Cell ceramic technology prevent dry hits?',
    answer:
      'Our patented ceramic matrix features uniform micro-capillary pores that distribute viscous fluids evenly across the heating element. Unlike cotton wicks that degrade or burn when liquid levels run low, the ceramic core remains chemically inert, maintaining pristine flavor purity across the entire lifespan of the pod.',
  },
  {
    question: 'Are VYRO accessories backward and forward compatible?',
    answer:
      'Yes. The VYRO Titan Magnetic Dock and Tuscany Leather Sleeves are engineered with universal form tolerances that support both the Onyx Pro and the Onyx Slim systems.',
  },
  {
    question: 'Why are certain transactions shown in Informational Demo Mode?',
    answer:
      'E-commerce platforms handling regulated adult hardware must observe strict licensing and payment gateway jurisdiction approvals. VYRO features a dual-mode commerce architecture: by default, transactions run in non-purchasing compliance mode until an authorized administrator verifies regional clearance in the Admin Operator Console.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-[#08090B] border-b border-[#1A1D23]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-3">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#9298A2]">
            Inquiries & Protocol
          </span>
          <h2 className="text-3xl font-bold text-[#F5F5F3] tracking-tight font-display">
            Frequently Addressed Questions
          </h2>
          <p className="text-sm text-[#9298A2] max-w-lg mx-auto">
            Essential specifications on hardware architecture, ceramic mechanics, and jurisdictional compliance.
          </p>
        </div>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-[#121419] border border-[#262A33] rounded-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 hover:bg-[#1A1D23]/50 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-semibold text-[#F5F5F3]">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#C5CBD3] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-sm text-[#9298A2] leading-relaxed border-t border-[#1A1D23] pt-4">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
