import React, { useState } from 'react';
import { Lock, MessageCircle, Send, ShieldCheck, X } from 'lucide-react';
import { useCommunity } from '../context/CommunityContext';
import {
  canSendDirectMessages,
  hasVerifiedPremiumBadge,
  validateDmInput,
} from '../utils/communityLogic';

export function DmInboxDrawer() {
  const {
    activeTier,
    dmThreads,
    dmDrawerOpen,
    activeDmThreadId,
    closeDmDrawer,
    selectDmThread,
    sendDirectMessage,
    openUpgradeModal,
  } = useCommunity();

  const [draft, setDraft] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!dmDrawerOpen) return null;

  const canMessage = canSendDirectMessages(activeTier);
  const activeThread =
    dmThreads.find((t) => t.id === activeDmThreadId) ?? dmThreads[0] ?? null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canMessage) {
      openUpgradeModal('Creator', 'Direct Messaging is available on Creator and Premium tiers.');
      return;
    }
    if (!activeThread) return;
    const check = validateDmInput(draft);
    if (!check.valid) {
      setError(check.error ?? 'Please write a message.');
      return;
    }
    sendDirectMessage(activeThread.id, draft);
    setDraft('');
    setError(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dm-inbox-title"
    >
      <div className="w-full max-w-2xl bg-white h-full flex flex-col border-l border-[#E4E6E0] shadow-2xl">
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-[#ECEEE9] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <MessageCircle className="w-5 h-5 text-[#1B5E3F]" aria-hidden="true" />
            <div>
              <h2 id="dm-inbox-title" className="font-display text-lg font-bold text-[#181D1A]">
                Neighbor Direct Messages
              </h2>
              <p className="text-xs text-[#5A635D]">
                {canMessage
                  ? `Messaging enabled (${activeTier} Tier)`
                  : 'Upgrade to Creator or Premium to send Direct Messages'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeDmDrawer}
            aria-label="Close direct messages drawer"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#5A635D] hover:bg-[#F1F3EF] cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Body: Thread Selector + Active Chat */}
        <div className="flex-1 flex flex-col sm:flex-row min-h-0">
          {/* Thread List */}
          <aside className="sm:w-60 border-b sm:border-b-0 sm:border-r border-[#ECEEE9] bg-[#FAFBF9] overflow-x-auto sm:overflow-y-auto flex sm:flex-col shrink-0">
            {dmThreads.map((thread) => {
              const selected = activeThread?.id === thread.id;
              return (
                <button
                  key={thread.id}
                  type="button"
                  onClick={() => selectDmThread(thread.id)}
                  className={`min-h-[56px] min-w-[180px] sm:min-w-0 w-full text-left px-4 py-3 border-r sm:border-r-0 sm:border-b border-[#ECEEE9] transition-colors cursor-pointer ${
                    selected ? 'bg-white border-l-0 font-semibold' : 'hover:bg-white/70'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="text-sm font-semibold text-[#181D1A] truncate">
                      {thread.recipientName}
                    </span>
                    {hasVerifiedPremiumBadge(thread.recipientTier) && (
                      <ShieldCheck
                        className="w-3.5 h-3.5 text-[#1B5E3F] shrink-0"
                        aria-label="Verified Premium"
                      />
                    )}
                  </div>
                  <p className="text-xs text-[#5A635D] truncate mt-0.5">
                    {thread.contextLabel}
                  </p>
                </button>
              );
            })}
          </aside>

          {/* Active Conversation */}
          <div className="flex-1 flex flex-col min-h-0 bg-white">
            {activeThread ? (
              <>
                <div className="px-5 py-3 border-b border-[#F0F2ED] bg-[#FAFBF9]">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-[#181D1A]">
                      {activeThread.recipientName}
                    </p>
                    {hasVerifiedPremiumBadge(activeThread.recipientTier) && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#14472F] bg-[#ECF4EF] px-2 py-0.5 rounded-md">
                        <ShieldCheck className="w-3 h-3" aria-hidden="true" />
                        Verified Premium
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#5A635D]">
                    {activeThread.recipientRole} · Re: {activeThread.contextLabel}
                  </p>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-3">
                  {activeThread.messages.length === 0 ? (
                    <div className="text-center py-8 text-sm text-[#5A635D]">
                      Start a conversation with {activeThread.recipientName} about{' '}
                      <span className="font-medium text-[#181D1A]">
                        {activeThread.contextLabel}
                      </span>
                      .
                    </div>
                  ) : (
                    activeThread.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${
                          msg.isSelf ? 'items-end' : 'items-start'
                        }`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                            msg.isSelf
                              ? 'bg-[#1B5E3F] text-white'
                              : 'bg-[#F3F4F0] text-[#181D1A]'
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[11px] text-[#5A635D] mt-1 px-1">
                          {msg.senderName} · {msg.timeLabel}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* Composer or Free-Tier Lock */}
                <div className="p-4 border-t border-[#ECEEE9] bg-[#FAFBF9]">
                  {canMessage ? (
                    <form onSubmit={handleSend} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <label htmlFor="dm-composer" className="sr-only">
                          Direct message to {activeThread.recipientName}
                        </label>
                        <input
                          id="dm-composer"
                          type="text"
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          placeholder={`Message ${activeThread.recipientName.split(' ')[0]}...`}
                          className="flex-1 min-h-[46px] px-3.5 py-2 bg-white border border-[#D3D7CF] rounded-xl text-sm text-[#181D1A] focus:outline-none focus:border-[#1B5E3F]"
                        />
                        <button
                          type="submit"
                          aria-label="Send direct message"
                          className="min-h-[46px] px-4 py-2.5 inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-[#1B5E3F] hover:bg-[#14472F] rounded-xl cursor-pointer shrink-0"
                        >
                          <Send className="w-4 h-4" aria-hidden="true" />
                          <span>Send</span>
                        </button>
                      </div>
                      {error && (
                        <p className="text-xs font-medium text-[#B91C1C]" role="alert">
                          {error}
                        </p>
                      )}
                    </form>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-[#E4E6E0] rounded-xl p-3.5">
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-[#415047]">
                        <Lock className="w-4 h-4 text-[#1B5E3F] shrink-0" aria-hidden="true" />
                        <span>Direct Messages require Creator or Premium access.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          closeDmDrawer();
                          openUpgradeModal(
                            'Creator',
                            'Upgrade to Creator or Premium to message neighbors directly.'
                          );
                        }}
                        className="min-h-[40px] px-3.5 py-2 text-xs font-semibold text-white bg-[#1B5E3F] hover:bg-[#14472F] rounded-lg whitespace-nowrap cursor-pointer"
                      >
                        Upgrade Plan
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-sm text-[#5A635D]">
                No conversations yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
