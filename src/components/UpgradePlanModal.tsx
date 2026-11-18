import { Check, Crown, ShieldCheck, Sparkles, X } from 'lucide-react';
import { useCommunity } from '../context/CommunityContext';
import type { MembershipTier } from '../types/community';

interface TierSpec {
  id: MembershipTier;
  name: string;
  priceLabel: string;
  tagline: string;
  features: string[];
  ctaLabel: string;
}

const TIERS: TierSpec[] = [
  {
    id: 'Free',
    name: 'Free Tier',
    priceLabel: '$0',
    tagline: 'Read & explore the neighborhood hub',
    features: [
      'Read all community gist news & articles',
      'Browse local food joints & resource directory',
      'Access Chapters 1–6 of all mentorship trainings',
    ],
    ctaLabel: 'Use Free Tier',
  },
  {
    id: 'Creator',
    name: 'Creator Tier',
    priceLabel: '$9/mo',
    tagline: 'Publish listings, articles & send DMs',
    features: [
      'Everything in Free Tier',
      'Self-publish products, services & food joint updates',
      'Write & publish your own community articles',
      'Comment on articles & send Direct Messages (DMs)',
    ],
    ctaLabel: 'Switch to Creator',
  },
  {
    id: 'Premium',
    name: 'Premium Tier',
    priceLabel: '$19/mo',
    tagline: 'Full 12-chapter mastery & Verified badge',
    features: [
      'Everything in Creator Tier',
      'Unlock all 12 chapters of every mentorship course',
      'Verified Premium badge on profile, articles & comments',
    ],
    ctaLabel: 'Upgrade to Premium',
  },
];

export function UpgradePlanModal() {
  const {
    upgradeModalOpen,
    upgradeHighlightTier,
    upgradeReason,
    activeTier,
    setMembershipTier,
    closeUpgradeModal,
  } = useCommunity();

  if (!upgradeModalOpen) return null;

  const handleSelectTier = (tier: MembershipTier) => {
    setMembershipTier(tier);
    closeUpgradeModal();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upgrade-plan-title"
    >
      <div className="w-full sm:max-w-4xl bg-white rounded-t-3xl sm:rounded-2xl border border-[#E4E6E0] shadow-xl max-h-[92vh] overflow-y-auto">
        <div className="lg:hidden w-10 h-1.5 bg-[#D4D8D1] rounded-full mx-auto mt-3" />

        <div className="px-6 pt-5 pb-4 border-b border-[#ECEEE9] flex items-start justify-between gap-4">
          <div>
            <h2 id="upgrade-plan-title" className="font-display text-xl sm:text-2xl font-bold text-[#181D1A]">
              Hood Link Membership Plans
            </h2>
            <p className="text-sm text-[#5A635D] mt-0.5">
              Compare Free, Creator, and Verified Premium access across the neighborhood hub.
            </p>
          </div>
          <button
            type="button"
            onClick={closeUpgradeModal}
            aria-label="Close upgrade plan dialog"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#5A635D] hover:bg-[#F1F3EF] cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {upgradeReason && (
            <div className="bg-[#ECF4EF] border border-[#CFE3D6] rounded-xl px-4 py-3 text-sm font-medium text-[#14472F]">
              {upgradeReason}
            </div>
          )}

          {/* 3-Tier Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
            {TIERS.map((tier) => {
              const isCurrent = activeTier === tier.id;
              const isHighlighted = upgradeHighlightTier === tier.id;

              return (
                <div
                  key={tier.id}
                  className={`rounded-2xl p-5 flex flex-col justify-between gap-5 border ${
                    isHighlighted
                      ? 'border-[#1B5E3F] bg-[#FAFDFB]'
                      : 'border-[#E4E6E0] bg-white'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#181D1A]">
                        {tier.id === 'Premium' && (
                          <Crown className="w-4 h-4 text-[#1B5E3F]" aria-hidden="true" />
                        )}
                        {tier.id === 'Creator' && (
                          <Sparkles className="w-4 h-4 text-[#1B5E3F]" aria-hidden="true" />
                        )}
                        {tier.name}
                      </span>
                      {isCurrent && (
                        <span className="text-xs font-semibold text-[#14472F] bg-[#ECF4EF] px-2.5 py-0.5 rounded-md">
                          Current
                        </span>
                      )}
                    </div>

                    <div>
                      <p className="font-mono-num text-2xl font-bold text-[#181D1A]">
                        {tier.priceLabel}
                        {tier.id === 'Free' && (
                          <span className="text-xs font-sans font-normal text-[#5A635D] ml-1.5">
                            forever
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-[#5A635D] mt-1">{tier.tagline}</p>
                    </div>

                    <ul className="space-y-2.5 pt-2 border-t border-[#F0F2ED]">
                      {tier.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2 text-sm text-[#2A332E]">
                          <Check
                            className="w-4 h-4 text-[#1B5E3F] shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelectTier(tier.id)}
                    className={`w-full min-h-[46px] px-4 py-2.5 inline-flex items-center justify-center gap-1.5 text-sm font-semibold rounded-xl transition-colors cursor-pointer ${
                      isCurrent
                        ? 'bg-[#F3F4F0] text-[#415047] hover:bg-[#E7EAE3]'
                        : tier.id === 'Premium' || isHighlighted
                        ? 'bg-[#1B5E3F] text-white hover:bg-[#14472F]'
                        : 'bg-[#181D1A] text-white hover:bg-[#2E3631]'
                    }`}
                  >
                    {tier.id === 'Premium' && (
                      <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                    )}
                    {isCurrent ? `Active (${tier.id})` : tier.ctaLabel}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
