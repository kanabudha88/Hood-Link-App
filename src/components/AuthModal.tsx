import React, { useEffect, useState } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { useCommunity } from '../context/CommunityContext';
import type { NeighborhoodZone } from '../types/community';
import { validateAuthInput } from '../utils/communityLogic';

const ZONES: NeighborhoodZone[] = ['Central', 'Eastside', 'Westside'];

export function AuthModal() {
  const {
    authModalOpen,
    authModalMode,
    closeAuthModal,
    login,
    register,
    loginAsDemoMember,
  } = useCommunity();

  const [mode, setMode] = useState<'login' | 'register'>(authModalMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [zone, setZone] = useState<NeighborhoodZone>('Eastside');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authModalOpen) {
      setMode(authModalMode);
      setError(null);
    }
  }, [authModalOpen, authModalMode]);

  if (!authModalOpen) return null;

  const handleSwitchMode = (nextMode: 'login' | 'register') => {
    setMode(nextMode);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateAuthInput({ mode, name, email, password });
    if (!check.valid) {
      setError(check.error ?? 'Please check your details.');
      return;
    }

    if (mode === 'login') {
      login(email);
    } else {
      register(name, email, zone);
    }
    setName('');
    setEmail('');
    setPassword('');
    setError(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl border border-[#E4E6E0] shadow-xl overflow-hidden max-h-[92vh] overflow-y-auto">
        <div className="lg:hidden w-10 h-1.5 bg-[#D4D8D1] rounded-full mx-auto mt-3" />

        <div className="px-6 pt-5 pb-4 border-b border-[#ECEEE9] flex items-center justify-between gap-4">
          <div>
            <h2 id="auth-modal-title" className="font-display text-xl font-bold text-[#181D1A]">
              {mode === 'login' ? 'Sign in to Hood Link' : 'Free Sign-Up · Join Hood Link'}
            </h2>
            <p className="text-xs text-[#5A635D] mt-0.5">
              {mode === 'register'
                ? 'Starts on the Free Member tier — upgrade anytime for Creator or Premium tools.'
                : 'Access your neighborhood profile, saved DMs, and mentorship tracks.'}
            </p>
          </div>
          <button
            type="button"
            onClick={closeAuthModal}
            aria-label="Close sign in dialog"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#5A635D] hover:bg-[#F1F3EF] hover:text-[#181D1A] cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Login / Register Toggle */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-[#F1F3EF] rounded-xl" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'register'}
              onClick={() => handleSwitchMode('register')}
              className={`min-h-[44px] text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                mode === 'register'
                  ? 'bg-white text-[#181D1A] shadow-xs'
                  : 'text-[#5A635D] hover:text-[#181D1A]'
              }`}
            >
              Sign Up Free
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'login'}
              onClick={() => handleSwitchMode('login')}
              className={`min-h-[44px] text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-[#181D1A] shadow-xs'
                  : 'text-[#5A635D] hover:text-[#181D1A]'
              }`}
            >
              Sign In
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {mode === 'register' && (
              <div>
                <label htmlFor="auth-name" className="block text-sm font-medium text-[#181D1A] mb-1.5">
                  Full Name
                </label>
                <input
                  id="auth-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jordan Alvarez"
                  className="w-full min-h-[46px] px-3.5 py-2.5 bg-white border border-[#D3D7CF] rounded-xl text-sm text-[#181D1A] placeholder:text-[#8A948D] focus:outline-none focus:border-[#1B5E3F] focus:ring-2 focus:ring-[#1B5E3F]/15"
                />
              </div>
            )}

            <div>
              <label htmlFor="auth-email" className="block text-sm font-medium text-[#181D1A] mb-1.5">
                Email Address
              </label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="neighbor@oakwood.local"
                className="w-full min-h-[46px] px-3.5 py-2.5 bg-white border border-[#D3D7CF] rounded-xl text-sm text-[#181D1A] placeholder:text-[#8A948D] focus:outline-none focus:border-[#1B5E3F] focus:ring-2 focus:ring-[#1B5E3F]/15"
              />
            </div>

            <div>
              <label htmlFor="auth-password" className="block text-sm font-medium text-[#181D1A] mb-1.5">
                Password
              </label>
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full min-h-[46px] px-3.5 py-2.5 bg-white border border-[#D3D7CF] rounded-xl text-sm text-[#181D1A] placeholder:text-[#8A948D] focus:outline-none focus:border-[#1B5E3F] focus:ring-2 focus:ring-[#1B5E3F]/15"
              />
            </div>

            {mode === 'register' && (
              <div>
                <span className="block text-sm font-medium text-[#181D1A] mb-1.5">
                  Neighborhood Zone
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {ZONES.map((z) => (
                    <button
                      key={z}
                      type="button"
                      onClick={() => setZone(z)}
                      className={`min-h-[44px] px-3 py-2 text-sm font-medium rounded-xl border transition-colors cursor-pointer ${
                        zone === z
                          ? 'bg-[#ECF4EF] border-[#1B5E3F] text-[#14472F] font-semibold'
                          : 'bg-white border-[#D3D7CF] text-[#415047] hover:bg-[#F6F7F4]'
                      }`}
                    >
                      {z}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <p className="text-sm font-medium text-[#B91C1C] bg-[#FEF2F2] border border-[#FECACA] rounded-xl px-3.5 py-2.5" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full min-h-[48px] px-5 py-3 text-sm font-semibold text-white bg-[#1B5E3F] hover:bg-[#14472F] rounded-xl transition-colors cursor-pointer"
            >
              {mode === 'login' ? 'Sign In' : 'Create Free Member Account'}
            </button>
          </form>

          <div className="pt-4 border-t border-[#ECEEE9]">
            <button
              type="button"
              onClick={() => loginAsDemoMember('Free')}
              className="w-full min-h-[46px] px-4 py-2.5 inline-flex items-center justify-center gap-2 text-sm font-semibold text-[#14472F] bg-[#ECF4EF] hover:bg-[#DCECE2] rounded-xl transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              Continue as Demo Free Member (Maya Lin)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
