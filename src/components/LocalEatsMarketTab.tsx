import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Lock,
  MessageCircle,
  MessageSquare,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  Utensils,
  X,
  XCircle,
} from 'lucide-react';
import { useCommunity } from '../context/CommunityContext';
import type {
  EatsSubTab,
  FoodJoint,
  FoodJointStatus,
  NeighborhoodZone,
} from '../types/community';
import {
  canPublishCreatorContent,
  canSendDirectMessages,
  filterFoodJoints,
  filterMarketItems,
  formatCurrency,
  hasVerifiedPremiumBadge,
  validateFoodJointListingInput,
  validateMarketItemInput,
} from '../utils/communityLogic';
import { SafeImage } from './SafeImage';

const STATUS_FILTERS: ('All' | FoodJointStatus)[] = [
  'All',
  'Open - Fresh Food Ready',
  'Busy',
  'Closed',
];

const ZONE_FILTERS: ('All Zones' | NeighborhoodZone)[] = [
  'All Zones',
  'Central',
  'Eastside',
  'Westside',
];

function StatusCallout({ status }: { status: FoodJointStatus }) {
  if (status === 'Open - Fresh Food Ready') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#ECF4EF] text-[#14472F] text-xs font-semibold">
        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span>Open - Fresh Food Ready</span>
      </span>
    );
  }
  if (status === 'Busy') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FEF3C7] text-[#92400E] text-xs font-semibold">
        <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span>Busy</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FEE2E2] text-[#991B1B] text-xs font-semibold">
      <XCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span>Closed</span>
    </span>
  );
}

export function LocalEatsMarketTab() {
  const {
    currentUser,
    activeTier,
    openAuthModal,
    openUpgradeModal,
    openDmWithRecipient,
    foodJoints,
    addFoodTip,
    createFoodJoint,
    marketItems,
    createMarketItem,
  } = useCommunity();

  const [subTab, setSubTab] = useState<EatsSubTab>('food-joints');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | FoodJointStatus>('All');
  const [zoneFilter, setZoneFilter] = useState<'All Zones' | NeighborhoodZone>('All Zones');

  const [tipTargetJoint, setTipTargetJoint] = useState<FoodJoint | null>(null);
  const [postListingOpen, setPostListingOpen] = useState(false);

  const canPublish = canPublishCreatorContent(activeTier);
  const canDm = canSendDirectMessages(activeTier);

  const filteredJoints = useMemo(
    () => filterFoodJoints(foodJoints, statusFilter, query),
    [foodJoints, statusFilter, query]
  );

  const filteredMarket = useMemo(
    () => filterMarketItems(marketItems, zoneFilter, query),
    [marketItems, zoneFilter, query]
  );

  const handleOpenPostListing = () => {
    if (!canPublish) {
      openUpgradeModal(
        'Creator',
        'Upgrade to the Creator tier to self-publish products, services, or food joint updates.'
      );
      return;
    }
    setPostListingOpen(true);
  };

  const handleOpenTip = (joint: FoodJoint) => {
    if (!currentUser && activeTier === 'Free') {
      openAuthModal('login');
      return;
    }
    setTipTargetJoint(joint);
  };

  return (
    <section aria-labelledby="eats-market-heading" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1
            id="eats-market-heading"
            className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#181D1A] text-balance"
          >
            Market and Deals
          </h1>
          <p className="text-sm sm:text-base text-[#5A635D] mt-1">
            Live kitchen status, menu previews, and peer-to-peer neighborhood listings.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenPostListing}
          className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-3 text-sm font-semibold text-white bg-[#1B5E3F] hover:bg-[#14472F] rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          {!canPublish ? (
            <Lock className="w-4 h-4" aria-hidden="true" />
          ) : (
            <Plus className="w-4 h-4" aria-hidden="true" />
          )}
          <span>+ Post Listing</span>
        </button>
      </div>

      {/* Sub-Tabs + Search Bar */}
      <div className="bg-white border border-[#E4E6E0] rounded-2xl p-3 sm:p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <div
            className="grid grid-cols-2 sm:inline-flex gap-1 p-1 bg-[#F1F3EF] rounded-xl"
            role="tablist"
            aria-label="Local Eats and Community Market tabs"
          >
            <button
              type="button"
              role="tab"
              aria-selected={subTab === 'food-joints'}
              onClick={() => setSubTab('food-joints')}
              className={`min-h-[44px] px-4 py-2 inline-flex items-center justify-center gap-2 text-sm font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                subTab === 'food-joints'
                  ? 'bg-white text-[#181D1A] shadow-xs'
                  : 'text-[#5A635D] hover:text-[#181D1A]'
              }`}
            >
              <Utensils className="w-4 h-4" aria-hidden="true" />
              Food Joints
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={subTab === 'market'}
              onClick={() => setSubTab('market')}
              className={`min-h-[44px] px-4 py-2 inline-flex items-center justify-center gap-2 text-sm font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                subTab === 'market'
                  ? 'bg-white text-[#181D1A] shadow-xs'
                  : 'text-[#5A635D] hover:text-[#181D1A]'
              }`}
            >
              <ShoppingBag className="w-4 h-4" aria-hidden="true" />
              Community Market
            </button>
          </div>

          <div className="relative flex-1 sm:max-w-xs">
            <label htmlFor="eats-market-search" className="sr-only">
              Search {subTab === 'food-joints' ? 'food joints and menus' : 'marketplace listings'}
            </label>
            <Search
              className="w-4 h-4 text-[#5A635D] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="eats-market-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                subTab === 'food-joints'
                  ? 'Search spots or menu items...'
                  : 'Search products, services, tools...'
              }
              className="w-full min-h-[44px] pl-10 pr-4 py-2 bg-[#F6F7F4] border border-[#DDE0D9] rounded-xl text-sm text-[#181D1A] placeholder:text-[#7A847D] focus:outline-none focus:bg-white focus:border-[#1B5E3F]"
            />
          </div>
        </div>

        {/* Contextual Secondary Filters */}
        {subTab === 'food-joints' ? (
          <div
            className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#F0F2ED]"
            role="group"
            aria-label="Filter food joints by live status"
          >
            {STATUS_FILTERS.map((st) => {
              const active = statusFilter === st;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`min-h-[40px] px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#181D1A] text-white'
                      : 'bg-[#F3F4F0] text-[#415047] hover:bg-[#E7EAE3]'
                  }`}
                >
                  {st}
                </button>
              );
            })}
          </div>
        ) : (
          <div
            className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#F0F2ED]"
            role="group"
            aria-label="Filter market listings by neighborhood zone"
          >
            {ZONE_FILTERS.map((z) => {
              const active = zoneFilter === z;
              return (
                <button
                  key={z}
                  type="button"
                  onClick={() => setZoneFilter(z)}
                  className={`min-h-[40px] px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#ECF4EF] text-[#14472F] border border-[#1B5E3F]/30 font-semibold'
                      : 'bg-[#F3F4F0] text-[#415047] hover:bg-[#E7EAE3]'
                  }`}
                >
                  {z}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Food Joints Sub-View */}
      {subTab === 'food-joints' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredJoints.length === 0 ? (
            <div className="lg:col-span-2 bg-white border border-[#E4E6E0] rounded-2xl p-8 text-center space-y-3">
              <p className="font-display text-lg font-semibold text-[#181D1A]">
                No food joints match that search
              </p>
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('All');
                  setQuery('');
                }}
                className="min-h-[44px] px-4 py-2 text-sm font-semibold text-[#1B5E3F] bg-[#ECF4EF] rounded-xl cursor-pointer"
              >
                Show All Food Joints
              </button>
            </div>
          ) : (
            filteredJoints.map((joint) => (
              <article
                key={joint.id}
                className="bg-white border border-[#E4E6E0] rounded-2xl overflow-hidden flex flex-col"
              >
                <SafeImage
                  src={joint.imageUrl}
                  alt={joint.imageAlt}
                  fallbackLabel={`${joint.name} · ${joint.cuisine}`}
                  aspectClassName="aspect-[16/9]"
                />

                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-5">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-medium text-[#5A635D]">
                          {joint.cuisine} · {joint.zone}
                        </p>
                        <h2 className="font-display text-xl font-bold text-[#181D1A] mt-0.5">
                          {joint.name}
                        </h2>
                      </div>
                      <StatusCallout status={joint.status} />
                    </div>

                    <p className="text-xs text-[#5A635D]">
                      {joint.address} · {joint.hours}
                    </p>

                    {/* Popular Menu Items */}
                    <div className="bg-[#F6F7F4] rounded-xl p-4 space-y-2.5">
                      <h3 className="text-xs font-semibold text-[#415047]">
                        Popular Menu Items
                      </h3>
                      <ul className="divide-y divide-[#E6E9E2]">
                        {joint.popularItems.map((item) => (
                          <li
                            key={item.id}
                            className="py-2 first:pt-0 last:pb-0 flex items-baseline justify-between gap-3"
                          >
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-[#181D1A]">{item.name}</p>
                              {item.note && (
                                <p className="text-xs text-[#5A635D]">{item.note}</p>
                              )}
                            </div>
                            <span className="font-mono-num text-sm font-semibold text-[#181D1A] shrink-0">
                              {formatCurrency(item.price)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Neighbor Tips */}
                    <div className="space-y-2">
                      <h3 className="text-xs font-semibold text-[#415047]">
                        Neighbor Tips & What to Expect
                      </h3>
                      <div className="space-y-2">
                        {joint.tips.map((tip) => (
                          <div
                            key={tip.id}
                            className="text-sm text-[#37403B] bg-white border border-[#ECEEE9] rounded-xl px-3.5 py-2.5"
                          >
                            <p>“{tip.text}”</p>
                            <p className="text-xs text-[#5A635D] mt-1">
                              {tip.authorName} · {tip.timeLabel}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleOpenTip(joint)}
                      className="w-full min-h-[44px] px-4 py-2.5 inline-flex items-center justify-center gap-2 text-sm font-semibold text-[#14472F] bg-[#ECF4EF] hover:bg-[#DCECE2] rounded-xl transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" aria-hidden="true" />
                      Add Neighbor Tip
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (!canDm) {
                          openUpgradeModal(
                            'Creator',
                            'Upgrade to Creator or Premium to message food spot owners directly.'
                          );
                          return;
                        }
                        openDmWithRecipient({
                          recipientId: joint.ownerId ?? joint.id,
                          recipientName: joint.ownerName ?? joint.name,
                          recipientRole: joint.cuisine,
                          contextLabel: joint.name,
                        });
                      }}
                      className="w-full min-h-[44px] px-4 py-2.5 inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-[#1B5E3F] hover:bg-[#14472F] rounded-xl transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" aria-hidden="true" />
                      Message Owner
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      )}

      {/* Community Market Sub-View */}
      {subTab === 'market' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMarket.length === 0 ? (
            <div className="md:col-span-2 lg:col-span-3 bg-white border border-[#E4E6E0] rounded-2xl p-8 text-center space-y-3">
              <p className="font-display text-lg font-semibold text-[#181D1A]">
                No marketplace items found
              </p>
              <button
                type="button"
                onClick={() => {
                  setZoneFilter('All Zones');
                  setQuery('');
                }}
                className="min-h-[44px] px-4 py-2 text-sm font-semibold text-[#1B5E3F] bg-[#ECF4EF] rounded-xl cursor-pointer"
              >
                Reset Market Filters
              </button>
            </div>
          ) : (
            filteredMarket.map((item) => (
              <article
                key={item.id}
                className="bg-white border border-[#E4E6E0] rounded-2xl overflow-hidden flex flex-col"
              >
                <SafeImage
                  src={item.imageUrl}
                  alt={item.imageAlt}
                  fallbackLabel={item.title}
                  aspectClassName="aspect-[4/3]"
                />

                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="font-display text-lg font-bold text-[#181D1A] leading-snug">
                        {item.title}
                      </h2>
                      <span className="font-mono-num text-base font-bold text-[#1B5E3F] shrink-0">
                        {formatCurrency(item.price)}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-[#5A635D]">
                      {item.listingKind ? `${item.listingKind} · ` : ''}
                      {item.condition} · {item.zone} · {item.timeLabel}
                    </p>

                    <p className="text-sm text-[#37403B] leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#F0F2ED] space-y-3">
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#5A635D]">
                      <span>
                        Seller:{' '}
                        <span className="font-semibold text-[#181D1A]">{item.sellerName}</span>
                      </span>
                      {hasVerifiedPremiumBadge(item.sellerTier) && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#14472F] bg-[#ECF4EF] px-1.5 py-0.5 rounded">
                          <ShieldCheck className="w-3 h-3" aria-hidden="true" />
                          Verified Premium
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (!canDm) {
                          openUpgradeModal(
                            'Creator',
                            'Upgrade to Creator or Premium to send Direct Messages to sellers.'
                          );
                          return;
                        }
                        openDmWithRecipient({
                          recipientId: item.sellerId,
                          recipientName: item.sellerName,
                          recipientRole: 'Marketplace Seller',
                          recipientTier: item.sellerTier,
                          contextLabel: item.title,
                        });
                      }}
                      className="w-full min-h-[46px] px-4 py-2.5 inline-flex items-center justify-center gap-2 text-sm font-semibold rounded-xl transition-colors cursor-pointer bg-[#1B5E3F] text-white hover:bg-[#14472F]"
                    >
                      {!canDm ? (
                        <Lock className="w-4 h-4" aria-hidden="true" />
                      ) : (
                        <MessageCircle className="w-4 h-4" aria-hidden="true" />
                      )}
                      <span>Message Seller</span>
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      )}

      {/* Add Food Tip Modal */}
      {tipTargetJoint && (
        <AddTipModal
          joint={tipTargetJoint}
          onClose={() => setTipTargetJoint(null)}
          onSubmit={(text) => {
            addFoodTip(tipTargetJoint.id, text);
            setTipTargetJoint(null);
          }}
        />
      )}

      {/* Self-Service Creator Listing Modal (Product/Service OR Food Joint) */}
      {postListingOpen && (
        <CreatorPostListingModal
          defaultZone={currentUser?.zone ?? 'Central'}
          initialMode={subTab === 'food-joints' ? 'food-joint' : 'market'}
          onClose={() => setPostListingOpen(false)}
          onPublishMarket={(payload) => {
            createMarketItem(payload);
            setSubTab('market');
            setPostListingOpen(false);
          }}
          onPublishFoodJoint={(payload) => {
            createFoodJoint(payload);
            setSubTab('food-joints');
            setPostListingOpen(false);
          }}
        />
      )}
    </section>
  );
}

function AddTipModal({
  joint,
  onClose,
  onSubmit,
}: {
  joint: FoodJoint;
  onClose: () => void;
  onSubmit: (text: string) => void;
}) {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length < 8) {
      setError('Please share a helpful tip (at least 8 characters).');
      return;
    }
    onSubmit(text);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-tip-title"
    >
      <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl border border-[#E4E6E0] shadow-xl">
        <div className="px-6 pt-5 pb-4 border-b border-[#ECEEE9] flex items-center justify-between">
          <h2 id="add-tip-title" className="font-display text-lg font-bold text-[#181D1A]">
            Add Tip for {joint.name}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close add tip dialog"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#5A635D] hover:bg-[#F1F3EF] cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="tip-text" className="block text-sm font-medium text-[#181D1A] mb-1.5">
              What should neighbors know?
            </label>
            <textarea
              id="tip-text"
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. Best time to avoid a line, standout dish, parking tips..."
              className="w-full p-3.5 bg-white border border-[#D3D7CF] rounded-xl text-sm text-[#181D1A] focus:outline-none focus:border-[#1B5E3F]"
            />
          </div>

          {error && (
            <p className="text-sm font-medium text-[#B91C1C]" role="alert">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3">
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
              Post Tip
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CreatorPostListingModal({
  defaultZone,
  initialMode,
  onClose,
  onPublishMarket,
  onPublishFoodJoint,
}: {
  defaultZone: NeighborhoodZone;
  initialMode: 'market' | 'food-joint';
  onClose: () => void;
  onPublishMarket: (input: {
    title: string;
    price: number;
    condition: string;
    listingKind: 'Product' | 'Service';
    zone: NeighborhoodZone;
    description: string;
  }) => void;
  onPublishFoodJoint: (input: {
    name: string;
    cuisine: string;
    zone: NeighborhoodZone;
    address: string;
    hours: string;
    status: FoodJointStatus;
    signatureItem: string;
    signaturePrice: number;
  }) => void;
}) {
  const [listingTarget, setListingTarget] = useState<'market' | 'food-joint'>(initialMode);
  const [listingKind, setListingKind] = useState<'Product' | 'Service'>('Product');
  const [zone, setZone] = useState<NeighborhoodZone>(defaultZone);
  const [error, setError] = useState<string | null>(null);

  // Market Product/Service fields
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('Gently used');
  const [description, setDescription] = useState('');

  // Food Joint fields
  const [jointName, setJointName] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [address, setAddress] = useState('');
  const [hours, setHours] = useState('11:00 AM – 8:00 PM');
  const [status, setStatus] = useState<FoodJointStatus>('Open - Fresh Food Ready');
  const [signatureItem, setSignatureItem] = useState('');
  const [signaturePrice, setSignaturePrice] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (listingTarget === 'market') {
      const check = validateMarketItemInput({ title, price, description });
      if (!check.valid) {
        setError(check.error ?? 'Please check your listing details.');
        return;
      }
      onPublishMarket({
        title,
        price: Number(price),
        condition,
        listingKind,
        zone,
        description,
      });
    } else {
      const check = validateFoodJointListingInput({
        name: jointName,
        cuisine,
        address,
        signatureItem,
        signaturePrice,
      });
      if (!check.valid) {
        setError(check.error ?? 'Please check your food joint details.');
        return;
      }
      onPublishFoodJoint({
        name: jointName,
        cuisine,
        zone,
        address,
        hours,
        status,
        signatureItem,
        signaturePrice: Number(signaturePrice),
      });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="creator-listing-title"
    >
      <div className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl border border-[#E4E6E0] shadow-xl max-h-[92vh] overflow-y-auto">
        <div className="lg:hidden w-10 h-1.5 bg-[#D4D8D1] rounded-full mx-auto mt-3" />

        <div className="px-6 pt-5 pb-4 border-b border-[#ECEEE9] flex items-center justify-between">
          <div>
            <h2 id="creator-listing-title" className="font-display text-xl font-bold text-[#181D1A]">
              Post Creator Listing
            </h2>
            <p className="text-xs text-[#5A635D] mt-0.5">
              Self-publish a product, neighborhood service, or food joint update
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close post listing dialog"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#5A635D] hover:bg-[#F1F3EF] cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-1 p-1 bg-[#F1F3EF] rounded-xl">
            <button
              type="button"
              onClick={() => {
                setListingTarget('market');
                setError(null);
              }}
              className={`min-h-[42px] text-xs sm:text-sm font-semibold rounded-lg cursor-pointer ${
                listingTarget === 'market'
                  ? 'bg-white text-[#181D1A] shadow-xs'
                  : 'text-[#5A635D]'
              }`}
            >
              Product / Service
            </button>
            <button
              type="button"
              onClick={() => {
                setListingTarget('food-joint');
                setError(null);
              }}
              className={`min-h-[42px] text-xs sm:text-sm font-semibold rounded-lg cursor-pointer ${
                listingTarget === 'food-joint'
                  ? 'bg-white text-[#181D1A] shadow-xs'
                  : 'text-[#5A635D]'
              }`}
            >
              Food Joint / Special
            </button>
          </div>

          {listingTarget === 'market' ? (
            <>
              <div className="grid grid-cols-2 gap-2">
                {(['Product', 'Service'] as const).map((kind) => (
                  <button
                    key={kind}
                    type="button"
                    onClick={() => setListingKind(kind)}
                    className={`min-h-[40px] px-3 py-1.5 text-sm font-medium rounded-xl border cursor-pointer ${
                      listingKind === kind
                        ? 'bg-[#181D1A] border-[#181D1A] text-white'
                        : 'bg-white border-[#D3D7CF] text-[#415047]'
                    }`}
                  >
                    {kind}
                  </button>
                ))}
              </div>

              <div>
                <label htmlFor="mkt-title" className="block text-sm font-medium text-[#181D1A] mb-1.5">
                  {listingKind === 'Service' ? 'Service Title' : 'Item Title'}
                </label>
                <input
                  id="mkt-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={
                    listingKind === 'Service'
                      ? 'e.g. Same-Day Bicycle Tune-Up & Brake Check'
                      : 'e.g. Solid Oak Study Desk'
                  }
                  className="w-full min-h-[46px] px-3.5 py-2.5 bg-white border border-[#D3D7CF] rounded-xl text-sm text-[#181D1A] focus:outline-none focus:border-[#1B5E3F]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="mkt-price" className="block text-sm font-medium text-[#181D1A] mb-1.5">
                    Price (USD, 0 for Free)
                  </label>
                  <input
                    id="mkt-price"
                    type="number"
                    min="0"
                    step="0.5"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="45"
                    className="w-full min-h-[46px] px-3.5 py-2.5 bg-white border border-[#D3D7CF] rounded-xl text-sm font-mono-num text-[#181D1A] focus:outline-none focus:border-[#1B5E3F]"
                  />
                </div>

                <div>
                  <label htmlFor="mkt-condition" className="block text-sm font-medium text-[#181D1A] mb-1.5">
                    Condition / Turnaround
                  </label>
                  <input
                    id="mkt-condition"
                    type="text"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    placeholder="e.g. Gently used · Porch pickup"
                    className="w-full min-h-[46px] px-3.5 py-2.5 bg-white border border-[#D3D7CF] rounded-xl text-sm text-[#181D1A] focus:outline-none focus:border-[#1B5E3F]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="mkt-desc" className="block text-sm font-medium text-[#181D1A] mb-1.5">
                  Description
                </label>
                <textarea
                  id="mkt-desc"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Dimensions, pickup timing, or service scope..."
                  className="w-full p-3.5 bg-white border border-[#D3D7CF] rounded-xl text-sm text-[#181D1A] focus:outline-none focus:border-[#1B5E3F]"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label htmlFor="joint-name" className="block text-sm font-medium text-[#181D1A] mb-1.5">
                  Food Spot / Kitchen Name
                </label>
                <input
                  id="joint-name"
                  type="text"
                  value={jointName}
                  onChange={(e) => setJointName(e.target.value)}
                  placeholder="e.g. Linden Street Wood-Fired Pop-Up"
                  className="w-full min-h-[46px] px-3.5 py-2.5 bg-white border border-[#D3D7CF] rounded-xl text-sm text-[#181D1A] focus:outline-none focus:border-[#1B5E3F]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="joint-cuisine" className="block text-sm font-medium text-[#181D1A] mb-1.5">
                    Cuisine / Specialty
                  </label>
                  <input
                    id="joint-cuisine"
                    type="text"
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value)}
                    placeholder="e.g. Sourdough Pizza & Salads"
                    className="w-full min-h-[46px] px-3.5 py-2.5 bg-white border border-[#D3D7CF] rounded-xl text-sm text-[#181D1A] focus:outline-none focus:border-[#1B5E3F]"
                  />
                </div>
                <div>
                  <label htmlFor="joint-status" className="block text-sm font-medium text-[#181D1A] mb-1.5">
                    Kitchen Status
                  </label>
                  <select
                    id="joint-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as FoodJointStatus)}
                    className="w-full min-h-[46px] px-3.5 py-2.5 bg-white border border-[#D3D7CF] rounded-xl text-sm text-[#181D1A] focus:outline-none focus:border-[#1B5E3F]"
                  >
                    <option value="Open - Fresh Food Ready">Open - Fresh Food Ready</option>
                    <option value="Busy">Busy</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="joint-address" className="block text-sm font-medium text-[#181D1A] mb-1.5">
                    Address / Location
                  </label>
                  <input
                    id="joint-address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 610 Linden St, Eastside"
                    className="w-full min-h-[46px] px-3.5 py-2.5 bg-white border border-[#D3D7CF] rounded-xl text-sm text-[#181D1A] focus:outline-none focus:border-[#1B5E3F]"
                  />
                </div>
                <div>
                  <label htmlFor="joint-hours" className="block text-sm font-medium text-[#181D1A] mb-1.5">
                    Hours Today
                  </label>
                  <input
                    id="joint-hours"
                    type="text"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    className="w-full min-h-[46px] px-3.5 py-2.5 bg-white border border-[#D3D7CF] rounded-xl text-sm text-[#181D1A] focus:outline-none focus:border-[#1B5E3F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="joint-item" className="block text-sm font-medium text-[#181D1A] mb-1.5">
                    Featured Menu Item
                  </label>
                  <input
                    id="joint-item"
                    type="text"
                    value={signatureItem}
                    onChange={(e) => setSignatureItem(e.target.value)}
                    placeholder="e.g. Margherita Pie"
                    className="w-full min-h-[46px] px-3.5 py-2.5 bg-white border border-[#D3D7CF] rounded-xl text-sm text-[#181D1A] focus:outline-none focus:border-[#1B5E3F]"
                  />
                </div>
                <div>
                  <label htmlFor="joint-price" className="block text-sm font-medium text-[#181D1A] mb-1.5">
                    Item Price (USD)
                  </label>
                  <input
                    id="joint-price"
                    type="number"
                    min="0"
                    step="0.5"
                    value={signaturePrice}
                    onChange={(e) => setSignaturePrice(e.target.value)}
                    placeholder="14"
                    className="w-full min-h-[46px] px-3.5 py-2.5 bg-white border border-[#D3D7CF] rounded-xl text-sm font-mono-num text-[#181D1A] focus:outline-none focus:border-[#1B5E3F]"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <span className="block text-sm font-medium text-[#181D1A] mb-1.5">
              Neighborhood Zone
            </span>
            <div className="grid grid-cols-3 gap-2">
              {(['Central', 'Eastside', 'Westside'] as NeighborhoodZone[]).map((z) => (
                <button
                  key={z}
                  type="button"
                  onClick={() => setZone(z)}
                  className={`min-h-[44px] px-3 py-2 text-sm font-medium rounded-xl border cursor-pointer ${
                    zone === z
                      ? 'bg-[#ECF4EF] border-[#1B5E3F] text-[#14472F] font-semibold'
                      : 'bg-white border-[#D3D7CF] text-[#415047]'
                  }`}
                >
                  {z}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-sm font-medium text-[#B91C1C] bg-[#FEF2F2] border border-[#FECACA] rounded-xl px-3.5 py-2.5" role="alert">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[46px] px-4 py-2.5 text-sm font-medium text-[#415047] bg-[#F3F4F0] rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-[46px] px-6 py-2.5 text-sm font-semibold text-white bg-[#1B5E3F] hover:bg-[#14472F] rounded-xl cursor-pointer"
            >
              Publish Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
