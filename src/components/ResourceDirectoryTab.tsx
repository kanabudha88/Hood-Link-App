import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Building2,
  Check,
  Clock,
  Copy,
  HeartPulse,
  MapPin,
  MessageSquare,
  Phone,
  Search,
  Wrench,
  X,
  Zap,
} from 'lucide-react';
import { useCommunity } from '../context/CommunityContext';
import type { LocalResource, ResourceCategory } from '../types/community';
import { filterResources } from '../utils/communityLogic';

const RESOURCE_CATEGORIES: ('All' | ResourceCategory)[] = [
  'All',
  'Health',
  'Utilities',
  'Artisans',
  'Community Centers',
  'Emergency',
];

function CategoryIcon({ category }: { category: ResourceCategory }) {
  switch (category) {
    case 'Health':
      return <HeartPulse className="w-5 h-5 text-[#1B5E3F]" aria-hidden="true" />;
    case 'Emergency':
      return <AlertTriangle className="w-5 h-5 text-[#B91C1C]" aria-hidden="true" />;
    case 'Utilities':
      return <Zap className="w-5 h-5 text-[#B45309]" aria-hidden="true" />;
    case 'Artisans':
      return <Wrench className="w-5 h-5 text-[#334155]" aria-hidden="true" />;
    case 'Community Centers':
      return <Building2 className="w-5 h-5 text-[#1B5E3F]" aria-hidden="true" />;
  }
}

type ActionModalState =
  | { type: 'message'; resource: LocalResource }
  | { type: 'location'; resource: LocalResource }
  | { type: 'call'; resource: LocalResource }
  | null;

export function ResourceDirectoryTab() {
  const { resources } = useCommunity();
  const [categoryFilter, setCategoryFilter] = useState<'All' | ResourceCategory>('All');
  const [query, setQuery] = useState('');
  const [actionModal, setActionModal] = useState<ActionModalState>(null);

  const filteredResources = useMemo(
    () => filterResources(resources, categoryFilter, query),
    [resources, categoryFilter, query]
  );

  return (
    <section aria-labelledby="directory-heading" className="space-y-6">
      {/* Header */}
      <div>
        <h1
          id="directory-heading"
          className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#181D1A] text-balance"
        >
          Resource Directory
        </h1>
        <p className="text-sm sm:text-base text-[#5A635D] mt-1">
          Verified clinics, emergency lines, city utilities, trusted artisans, and neighborhood hubs.
        </p>
      </div>

      {/* Search & Category Filter Card */}
      <div className="bg-white border border-[#E4E6E0] rounded-2xl p-3 sm:p-4 space-y-3">
        <div className="relative">
          <label htmlFor="directory-search" className="sr-only">
            Search essential neighborhood resources
          </label>
          <Search
            className="w-5 h-5 text-[#5A635D] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            id="directory-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by service, clinic, plumber, street, or zone..."
            className="w-full min-h-[48px] pl-11 pr-4 py-2.5 bg-[#F6F7F4] border border-[#DDE0D9] rounded-xl text-sm sm:text-base text-[#181D1A] placeholder:text-[#7A847D] focus:outline-none focus:bg-white focus:border-[#1B5E3F]"
          />
        </div>

        <div
          className="flex flex-wrap items-center gap-2 pt-1"
          role="group"
          aria-label="Filter resources by category"
        >
          {RESOURCE_CATEGORIES.map((cat) => {
            const active = categoryFilter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`min-h-[42px] px-3.5 py-2 text-xs sm:text-sm font-medium rounded-xl whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  active
                    ? cat === 'Emergency'
                      ? 'bg-[#B91C1C] text-white'
                      : 'bg-[#181D1A] text-white'
                    : 'bg-[#F3F4F0] text-[#415047] hover:bg-[#E7EAE3]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Resource Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredResources.length === 0 ? (
          <div className="lg:col-span-2 bg-white border border-[#E4E6E0] rounded-2xl p-8 text-center space-y-3">
            <p className="font-display text-lg font-semibold text-[#181D1A]">
              No matching resources found
            </p>
            <button
              type="button"
              onClick={() => {
                setCategoryFilter('All');
                setQuery('');
              }}
              className="min-h-[44px] px-4 py-2 text-sm font-semibold text-[#1B5E3F] bg-[#ECF4EF] rounded-xl cursor-pointer"
            >
              Show All Resources
            </button>
          </div>
        ) : (
          filteredResources.map((resource) => {
            const isEmergency = resource.category === 'Emergency';
            return (
              <article
                key={resource.id}
                className={`bg-white border rounded-2xl p-5 sm:p-6 flex flex-col justify-between gap-5 ${
                  isEmergency ? 'border-[#FECACA]' : 'border-[#E4E6E0]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                        isEmergency ? 'bg-[#FEF2F2]' : 'bg-[#F3F4F0]'
                      }`}
                    >
                      <CategoryIcon category={resource.category} />
                    </div>
                    <div className="min-w-0">
                      <p
                        className={`text-xs font-semibold ${
                          isEmergency ? 'text-[#B91C1C]' : 'text-[#1B5E3F]'
                        }`}
                      >
                        {resource.category} · {resource.zone}
                      </p>
                      <h2 className="font-display text-lg font-bold text-[#181D1A] leading-snug mt-0.5">
                        {resource.name}
                      </h2>
                    </div>
                  </div>

                  <p className="text-sm text-[#37403B] leading-relaxed">
                    {resource.description}
                  </p>

                  <div className="bg-[#F6F7F4] rounded-xl p-3.5 space-y-1.5 text-xs sm:text-sm text-[#2A332E]">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#5A635D] shrink-0" aria-hidden="true" />
                      <span>{resource.hours}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#5A635D] shrink-0" aria-hidden="true" />
                      <span>{resource.address}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono-num">
                      <Phone className="w-4 h-4 text-[#5A635D] shrink-0" aria-hidden="true" />
                      <span>{resource.phone}</span>
                    </div>
                  </div>
                </div>

                {/* One-click Action Buttons (thumb-friendly 46px height, zero truncation) */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setActionModal({ type: 'call', resource })}
                    aria-label={`Call ${resource.name}`}
                    className={`min-h-[46px] px-2 sm:px-3 py-2.5 inline-flex items-center justify-center gap-1 sm:gap-1.5 text-[13px] sm:text-sm font-semibold rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
                      isEmergency
                        ? 'bg-[#B91C1C] text-white hover:bg-[#991B1B]'
                        : 'bg-[#1B5E3F] text-white hover:bg-[#14472F]'
                    }`}
                  >
                    <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>Call</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActionModal({ type: 'message', resource })}
                    aria-label={`Message ${resource.name}`}
                    className="min-h-[46px] px-2 sm:px-3 py-2.5 inline-flex items-center justify-center gap-1 sm:gap-1.5 text-[13px] sm:text-sm font-semibold text-[#181D1A] bg-[#F3F4F0] hover:bg-[#E7EAE3] rounded-xl transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>Message</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActionModal({ type: 'location', resource })}
                    aria-label={`View location for ${resource.name}`}
                    className="min-h-[46px] px-2 sm:px-3 py-2.5 inline-flex items-center justify-center gap-1 sm:gap-1.5 text-[13px] sm:text-sm font-semibold text-[#14472F] bg-[#ECF4EF] hover:bg-[#DCECE2] rounded-xl transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <MapPin className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>Location</span>
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>

      {actionModal && (
        <ResourceActionModal
          state={actionModal}
          onClose={() => setActionModal(null)}
        />
      )}
    </section>
  );
}

function ResourceActionModal({
  state,
  onClose,
}: {
  state: NonNullable<ActionModalState>;
  onClose: () => void;
}) {
  const [messageText, setMessageText] = useState('');
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { resource, type } = state;

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim().length < 6) {
      setError('Please enter a short message before sending.');
      return;
    }
    setError(null);
    setSent(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resource-action-title"
    >
      <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl border border-[#E4E6E0] shadow-xl overflow-hidden">
        <div className="md:hidden w-10 h-1.5 bg-[#D4D8D1] rounded-full mx-auto mt-3" />

        <div className="px-6 pt-5 pb-4 border-b border-[#ECEEE9] flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-[#1B5E3F]">
              {resource.category} · {resource.zone}
            </p>
            <h2 id="resource-action-title" className="font-display text-lg font-bold text-[#181D1A]">
              {resource.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close resource action dialog"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#5A635D] hover:bg-[#F1F3EF] cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {type === 'call' && (
            <div className="space-y-4">
              <div className="bg-[#F6F7F4] rounded-xl p-4 space-y-1">
                <p className="text-xs font-medium text-[#5A635D]">Direct Phone Line</p>
                <p className="font-mono-num text-2xl font-bold text-[#181D1A]">
                  {resource.phone}
                </p>
                <p className="text-xs text-[#5A635D]">{resource.hours}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${resource.phone.replace(/[^+\d]/g, '')}`}
                  className="min-h-[46px] px-4 py-2.5 inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-[#1B5E3F] hover:bg-[#14472F] rounded-xl"
                >
                  <Phone className="w-4 h-4" aria-hidden="true" />
                  Dial Now
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy(resource.phone)}
                  className="min-h-[46px] px-4 py-2.5 inline-flex items-center justify-center gap-2 text-sm font-semibold text-[#181D1A] bg-[#F3F4F0] hover:bg-[#E7EAE3] rounded-xl cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-[#1B5E3F]" aria-hidden="true" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" aria-hidden="true" />
                      Copy Number
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {type === 'location' && (
            <div className="space-y-4">
              <div className="bg-[#F6F7F4] rounded-xl p-4 space-y-2">
                <p className="text-xs font-medium text-[#5A635D]">Street Address</p>
                <p className="text-base font-semibold text-[#181D1A]">{resource.address}</p>
                <p className="text-sm text-[#415047]">Landmark: {resource.coordinatesLabel}</p>
                <p className="text-xs text-[#5A635D]">{resource.hours}</p>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(resource.address)}
                className="w-full min-h-[46px] px-4 py-2.5 inline-flex items-center justify-center gap-2 text-sm font-semibold text-[#14472F] bg-[#ECF4EF] hover:bg-[#DCECE2] rounded-xl cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" aria-hidden="true" />
                    Address Copied to Clipboard
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" aria-hidden="true" />
                    Copy Street Address
                  </>
                )}
              </button>
            </div>
          )}

          {type === 'message' && (
            <>
              {sent ? (
                <div className="bg-[#ECF4EF] border border-[#CFE3D6] rounded-xl p-4 space-y-2">
                  <p className="text-sm font-semibold text-[#14472F]">
                    Inquiry queued for {resource.name}
                  </p>
                  <p className="text-xs text-[#2D4A3A]">
                    Sent to {resource.emailOrHandle}. Expect a reply during posted hours ({resource.hours}).
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full min-h-[44px] mt-2 px-4 py-2 text-sm font-semibold text-white bg-[#1B5E3F] rounded-xl cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="space-y-3">
                  <p className="text-xs text-[#5A635D]">
                    Recipient: <span className="font-medium text-[#181D1A]">{resource.emailOrHandle}</span>
                  </p>
                  <div>
                    <label htmlFor="res-msg" className="block text-sm font-medium text-[#181D1A] mb-1.5">
                      Message
                    </label>
                    <textarea
                      id="res-msg"
                      rows={3}
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Ask about walk-in hours, intake requirements, or availability..."
                      className="w-full p-3.5 bg-white border border-[#D3D7CF] rounded-xl text-sm text-[#181D1A] focus:outline-none focus:border-[#1B5E3F]"
                    />
                  </div>
                  {error && (
                    <p className="text-sm font-medium text-[#B91C1C]" role="alert">
                      {error}
                    </p>
                  )}
                  <div className="flex justify-end gap-3 pt-1">
                    <button
                      type="button"
                      onClick={onClose}
                      className="min-h-[44px] px-4 py-2 text-sm font-medium text-[#415047] bg-[#F3F4F0] rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="min-h-[44px] px-5 py-2 text-sm font-semibold text-white bg-[#1B5E3F] hover:bg-[#14472F] rounded-xl cursor-pointer"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
