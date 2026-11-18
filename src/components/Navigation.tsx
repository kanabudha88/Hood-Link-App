import { useState } from 'react';
import {
  ChevronDown,
  Compass,
  Crown,
  LogOut,
  MessageCircle,
  Radio,
  ShieldCheck,
  Sparkles,
  Store,
  UserPlus,
  Users,
} from 'lucide-react';
import { useCommunity } from '../context/CommunityContext';
import type { MainTab, MembershipTier } from '../types/community';

interface NavigationProps {
  activeTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
}

const NAV_ITEMS: {
  id: MainTab;
  desktopLabel: string;
  mobileLabel: string;
  icon: typeof Radio;
}[] = [
  {
    id: 'pulse',
    desktopLabel: 'Community Gist',
    mobileLabel: 'Gist',
    icon: Radio,
  },
  {
    id: 'eats-market',
    desktopLabel: 'Market and Deals',
    mobileLabel: 'Market',
    icon: Store,
  },
  {
    id: 'mentoring',
    desktopLabel: 'Creative Skills and Mentorship',
    mobileLabel: 'Skills',
    icon: Users,
  },
  {
    id: 'directory',
    desktopLabel: 'Resource Directory',
    mobileLabel: 'Directory',
    icon: Compass,
  },
];

const TIER_OPTIONS: MembershipTier[] = ['Free', 'Creator', 'Premium'];

function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg
        width={compact ? 26 : 30}
        height={compact ? 26 : 30}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect width="32" height="32" rx="8" fill="#1B5E3F" />
        <path
          d="M8.5 22V14.2C8.5 10.7758 11.2758 8 14.7 8H17.3C20.7242 8 23.5 10.7758 23.5 14.2V22"
          stroke="#FFFFFF"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M13 22V16.2C13 14.5431 14.3431 13.2 16 13.2C17.6569 13.2 19 14.5431 19 16.2V22"
          stroke="#B8E0C8"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
      <span
        className={`font-display font-bold tracking-tight text-[#181D1A] ${
          compact ? 'text-lg' : 'text-xl'
        }`}
      >
        Hood Link
      </span>
    </span>
  );
}

export function Navigation({ activeTab, onSelectTab }: NavigationProps) {
  const {
    currentUser,
    activeTier,
    setMembershipTier,
    openAuthModal,
    openUpgradeModal,
    openDmDrawer,
    dmThreads,
    logout,
  } = useCommunity();

  const [tierMenuOpen, setTierMenuOpen] = useState(false);

  const handleSelectTier = (tier: MembershipTier) => {
    setMembershipTier(tier);
    setTierMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Top Navigation Bar */}
      <header className="hidden lg:block sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E4E6E0]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          {/* Zone 1: Brand logo button */}
          <button
            type="button"
            onClick={() => onSelectTab('pulse')}
            aria-label="Hood Link Home"
            className="inline-flex items-center whitespace-nowrap shrink-0 cursor-pointer rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B5E3F]"
          >
            <BrandLogo />
          </button>

          {/* Zone 2: 4 single-line nav links */}
          <nav aria-label="Primary navigation" className="flex items-center gap-5 xl:gap-6">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative py-2 text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B5E3F] ${
                    isActive
                      ? 'text-[#1B5E3F] font-semibold'
                      : 'text-[#5A635D] hover:text-[#181D1A]'
                  }`}
                >
                  {item.desktopLabel}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1B5E3F] rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Current Tier Switcher Menu & Account/Inbox */}
          <div className="flex items-center gap-2.5 shrink-0 relative">
            <button
              type="button"
              onClick={() => openDmDrawer()}
              aria-label={`Open Direct Messages (${dmThreads.length} threads)`}
              className="inline-flex items-center gap-1.5 min-h-[40px] px-3 py-2 text-xs font-semibold text-[#415047] bg-[#F3F4F0] hover:bg-[#E7EAE3] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              <span>Inbox</span>
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setTierMenuOpen((prev) => !prev)}
                aria-expanded={tierMenuOpen}
                aria-haspopup="menu"
                className={`inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTier === 'Premium'
                    ? 'bg-[#ECF4EF] border-[#1B5E3F]/40 text-[#14472F]'
                    : activeTier === 'Creator'
                    ? 'bg-[#181D1A] border-[#181D1A] text-white'
                    : 'bg-white border-[#D3D7CF] text-[#181D1A] hover:bg-[#F6F7F4]'
                }`}
              >
                {activeTier === 'Premium' && (
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1B5E3F]" aria-hidden="true" />
                )}
                {activeTier === 'Creator' && (
                  <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                )}
                <span>Current Tier: {activeTier}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-80" aria-hidden="true" />
              </button>

              {tierMenuOpen && (
                <div
                  role="menu"
                  aria-label="Account and tier switcher"
                  className="absolute right-0 mt-2 w-72 bg-white border border-[#E4E6E0] rounded-2xl shadow-xl p-3 space-y-2.5 z-50"
                >
                  <div className="px-2 py-1 border-b border-[#F0F2ED]">
                    <p className="text-xs font-medium text-[#5A635D]">
                      {currentUser ? currentUser.name : 'Guest Preview'}
                    </p>
                    <p className="text-xs font-semibold text-[#181D1A] flex items-center gap-1.5 mt-0.5">
                      <span>{activeTier} Member</span>
                      {activeTier === 'Premium' && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-[#14472F] bg-[#ECF4EF] px-1.5 py-0.5 rounded">
                          <ShieldCheck className="w-3 h-3" aria-hidden="true" />
                          Verified Premium
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="px-2 text-[11px] font-semibold text-[#5A635D]">
                      Switch Role to Test Permissions
                    </p>
                    <div className="grid grid-cols-3 gap-1.5">
                      {TIER_OPTIONS.map((t) => (
                        <button
                          key={t}
                          type="button"
                          role="menuitemradio"
                          aria-checked={activeTier === t}
                          onClick={() => handleSelectTier(t)}
                          className={`min-h-[38px] px-2 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                            activeTier === t
                              ? 'bg-[#1B5E3F] border-[#1B5E3F] text-white'
                              : 'bg-[#F6F7F4] border-[#E4E6E0] text-[#415047] hover:bg-[#ECEEE9]'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-1 border-t border-[#F0F2ED] space-y-1">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setTierMenuOpen(false);
                        openUpgradeModal(activeTier === 'Free' ? 'Creator' : 'Premium');
                      }}
                      className="w-full min-h-[40px] px-3 py-2 text-left text-xs font-semibold text-[#14472F] bg-[#ECF4EF] hover:bg-[#DCECE2] rounded-xl flex items-center justify-between cursor-pointer"
                    >
                      <span>Compare & Upgrade Plan</span>
                      <Crown className="w-4 h-4" aria-hidden="true" />
                    </button>

                    {currentUser ? (
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setTierMenuOpen(false);
                          logout();
                        }}
                        className="w-full min-h-[40px] px-3 py-2 text-left text-xs font-semibold text-[#415047] hover:bg-[#F3F4F0] rounded-xl flex items-center justify-between cursor-pointer"
                      >
                        <span>Sign Out ({currentUser.name})</span>
                        <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setTierMenuOpen(false);
                          openAuthModal('register');
                        }}
                        className="w-full min-h-[40px] px-3 py-2 text-left text-xs font-semibold text-[#181D1A] hover:bg-[#F3F4F0] rounded-xl flex items-center justify-between cursor-pointer"
                      >
                        <span>Free Sign-Up / Sign In</span>
                        <UserPlus className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {!currentUser && (
              <button
                type="button"
                onClick={() => openAuthModal('register')}
                className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-2 text-xs font-semibold text-white bg-[#1B5E3F] hover:bg-[#14472F] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" aria-hidden="true" />
                Sign Up Free
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Top App Bar (48px) */}
      <header className="lg:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E4E6E0] h-12 px-3.5 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onSelectTab('pulse')}
          aria-label="Hood Link Home"
          className="inline-flex items-center whitespace-nowrap shrink-0 cursor-pointer"
        >
          <BrandLogo compact />
        </button>

        <div className="flex items-center gap-1.5 relative">
          <button
            type="button"
            onClick={() => openDmDrawer()}
            aria-label="Open Direct Messages"
            className="min-h-[36px] min-w-[36px] px-2 flex items-center justify-center rounded-lg bg-[#F3F4F0] text-[#415047] cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => setTierMenuOpen((prev) => !prev)}
            aria-expanded={tierMenuOpen}
            className={`inline-flex items-center gap-1 min-h-[36px] px-2.5 py-1 text-xs font-semibold rounded-lg border whitespace-nowrap shrink-0 cursor-pointer ${
              activeTier === 'Premium'
                ? 'bg-[#ECF4EF] border-[#1B5E3F]/40 text-[#14472F]'
                : activeTier === 'Creator'
                ? 'bg-[#181D1A] border-[#181D1A] text-white'
                : 'bg-white border-[#D3D7CF] text-[#181D1A]'
            }`}
          >
            <span>Tier: {activeTier}</span>
            <ChevronDown className="w-3 h-3" aria-hidden="true" />
          </button>

          {!currentUser && (
            <button
              type="button"
              onClick={() => openAuthModal('register')}
              className="inline-flex items-center min-h-[36px] px-2.5 py-1 text-xs font-semibold text-white bg-[#1B5E3F] rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
            >
              Join
            </button>
          )}

          {tierMenuOpen && (
            <div
              role="menu"
              aria-label="Mobile account and tier switcher"
              className="absolute right-0 top-11 w-68 bg-white border border-[#E4E6E0] rounded-2xl shadow-xl p-3 space-y-2.5 z-50"
            >
              <div className="px-1.5 pb-1.5 border-b border-[#F0F2ED]">
                <p className="text-xs font-semibold text-[#181D1A]">
                  {currentUser ? currentUser.name : 'Guest Preview'} · {activeTier} Tier
                </p>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {TIER_OPTIONS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleSelectTier(t)}
                    className={`min-h-[40px] px-2 py-1.5 text-xs font-semibold rounded-lg border cursor-pointer ${
                      activeTier === t
                        ? 'bg-[#1B5E3F] border-[#1B5E3F] text-white'
                        : 'bg-[#F6F7F4] border-[#E4E6E0] text-[#415047]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  setTierMenuOpen(false);
                  openUpgradeModal(activeTier === 'Free' ? 'Creator' : 'Premium');
                }}
                className="w-full min-h-[40px] px-3 py-2 text-xs font-semibold text-[#14472F] bg-[#ECF4EF] rounded-xl flex items-center justify-between cursor-pointer"
              >
                <span>Upgrade Plan</span>
                <Crown className="w-4 h-4" aria-hidden="true" />
              </button>
              {currentUser ? (
                <button
                  type="button"
                  onClick={() => {
                    setTierMenuOpen(false);
                    logout();
                  }}
                  className="w-full min-h-[40px] px-3 py-2 text-xs font-semibold text-[#415047] bg-[#F3F4F0] rounded-xl flex items-center justify-between cursor-pointer"
                >
                  <span>Sign Out</span>
                  <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setTierMenuOpen(false);
                    openAuthModal('register');
                  }}
                  className="w-full min-h-[40px] px-3 py-2 text-xs font-semibold text-white bg-[#1B5E3F] rounded-xl cursor-pointer"
                >
                  Free Sign-Up / Sign In
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Mobile Fixed Bottom Tab Bar */}
      <nav
        aria-label="Mobile navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E4E6E0] pb-safe"
      >
        <div className="grid grid-cols-4 h-14 items-center px-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`min-h-[44px] flex flex-col items-center justify-center gap-0.5 rounded-xl transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1B5E3F] ${
                  isActive
                    ? 'text-[#1B5E3F] bg-[#ECF4EF]/80 font-semibold'
                    : 'text-[#5A635D] hover:text-[#181D1A]'
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.25 : 1.75} aria-hidden="true" />
                <span className="text-[11px] leading-none whitespace-nowrap">
                  {item.mobileLabel}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
