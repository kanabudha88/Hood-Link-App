import React, { useMemo, useState } from 'react';
import {
  Calendar,
  Heart,
  Lock,
  MapPin,
  MessageCircle,
  MessageSquare,
  Plus,
  Send,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react';
import { useCommunity } from '../context/CommunityContext';
import type { NeighborhoodZone, PostCategory } from '../types/community';
import {
  canCommentOnArticles,
  canPublishCreatorContent,
  canSendDirectMessages,
  filterCommunityPosts,
  hasVerifiedPremiumBadge,
  validateCommentInput,
  validatePostInput,
} from '../utils/communityLogic';
import { SafeImage } from './SafeImage';

const CATEGORY_FILTERS: ('All' | PostCategory)[] = [
  'All',
  'News',
  'General Info',
  'Events',
];

const ZONE_FILTERS: ('All Zones' | NeighborhoodZone)[] = [
  'All Zones',
  'Central',
  'Eastside',
  'Westside',
];

export function CommunityPulseTab() {
  const {
    currentUser,
    activeTier,
    openUpgradeModal,
    openDmWithRecipient,
    posts,
    likedPostIds,
    rsvpedPostIds,
    createPost,
    addPostComment,
    toggleLikePost,
    toggleRsvpEvent,
  } = useCommunity();

  const [categoryFilter, setCategoryFilter] = useState<'All' | PostCategory>('All');
  const [zoneFilter, setZoneFilter] = useState<'All Zones' | NeighborhoodZone>('All Zones');
  const [createOpen, setCreateOpen] = useState(false);

  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [commentErrors, setCommentErrors] = useState<Record<string, string | null>>({});

  const canPublish = canPublishCreatorContent(activeTier);
  const canComment = canCommentOnArticles(activeTier);
  const canDm = canSendDirectMessages(activeTier);

  const filteredPosts = useMemo(
    () =>
      filterCommunityPosts(posts, {
        category: categoryFilter,
        zone: zoneFilter,
      }),
    [posts, categoryFilter, zoneFilter]
  );

  const upcomingEvents = useMemo(
    () => posts.filter((p) => p.category === 'Events').slice(0, 3),
    [posts]
  );

  const handleOpenCreate = () => {
    if (!canPublish) {
      openUpgradeModal(
        'Creator',
        'Upgrade to the Creator or Premium tier to write and publish your own community articles.'
      );
      return;
    }
    setCreateOpen(true);
  };

  const handleCommentSubmit = (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    if (!canComment) {
      openUpgradeModal(
        'Creator',
        'Upgrade to Creator or Premium to comment on community articles.'
      );
      return;
    }
    const draft = commentDrafts[postId] ?? '';
    const check = validateCommentInput(draft);
    if (!check.valid) {
      setCommentErrors((prev) => ({
        ...prev,
        [postId]: check.error ?? 'Please write a comment.',
      }));
      return;
    }
    addPostComment(postId, draft);
    setCommentDrafts((prev) => ({ ...prev, [postId]: '' }));
    setCommentErrors((prev) => ({ ...prev, [postId]: null }));
  };

  return (
    <section aria-labelledby="pulse-heading" className="space-y-6">
      {/* Page Header & Primary CTA */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1
            id="pulse-heading"
            className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#181D1A] text-balance"
          >
            Community Gist
          </h1>
          <p className="text-sm sm:text-base text-[#5A635D] mt-1">
            Neighborhood updates, civic notices, creator articles, and local events across Oakwood.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-3 text-sm font-semibold text-white bg-[#1B5E3F] hover:bg-[#14472F] rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B5E3F]"
        >
          {!canPublish && <Lock className="w-4 h-4" aria-hidden="true" />}
          {canPublish && <Plus className="w-4 h-4" aria-hidden="true" />}
          <span>{canPublish ? 'Publish Article' : 'Write Article (Creator)'}</span>
        </button>
      </div>

      {/* Filter Controls */}
      <div className="bg-white border border-[#E4E6E0] rounded-2xl p-3 sm:p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter posts by category">
          {CATEGORY_FILTERS.map((cat) => {
            const active = categoryFilter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`min-h-[42px] px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-xl whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#181D1A] text-white'
                    : 'bg-[#F3F4F0] text-[#415047] hover:bg-[#E7EAE3]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-2.5 border-t border-[#F0F2ED]" role="group" aria-label="Filter posts by neighborhood zone">
          <span className="text-xs font-medium text-[#5A635D] shrink-0 pr-1">
            Neighborhood Zone:
          </span>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {ZONE_FILTERS.map((zone) => {
              const active = zoneFilter === zone;
              return (
                <button
                  key={zone}
                  type="button"
                  onClick={() => setZoneFilter(zone)}
                  className={`min-h-[40px] px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#ECF4EF] text-[#14472F] border border-[#1B5E3F]/30 font-semibold'
                      : 'text-[#5A635D] hover:bg-[#F3F4F0] hover:text-[#181D1A]'
                  }`}
                >
                  {zone}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Feed Column */}
        <div className="lg:col-span-8 space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="bg-white border border-[#E4E6E0] rounded-2xl p-8 text-center space-y-3">
              <p className="font-display text-lg font-semibold text-[#181D1A]">
                No updates match these filters
              </p>
              <p className="text-sm text-[#5A635D]">
                Try switching back to All categories or another neighborhood zone.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCategoryFilter('All');
                  setZoneFilter('All Zones');
                }}
                className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 text-sm font-semibold text-[#1B5E3F] bg-[#ECF4EF] hover:bg-[#DCECE2] rounded-xl cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredPosts.map((post) => {
              const isLiked = likedPostIds.includes(post.id);
              const isGoing = rsvpedPostIds.includes(post.id);
              const commentCount = post.comments.length;

              return (
                <article
                  key={post.id}
                  className="bg-white border border-[#E4E6E0] rounded-2xl overflow-hidden"
                >
                  {post.imageUrl && (
                    <SafeImage
                      src={post.imageUrl}
                      alt={post.imageAlt || post.title}
                      aspectClassName="aspect-[16/9]"
                    />
                  )}

                  <div className="p-5 sm:p-6 space-y-4">
                    {/* Clean Unboxed Metadata */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-[#5A635D]">
                      <span
                        className={
                          post.category === 'Events'
                            ? 'text-[#1B5E3F] font-semibold'
                            : post.category === 'News'
                            ? 'text-[#9A3412] font-semibold'
                            : 'text-[#334155] font-semibold'
                        }
                      >
                        {post.category}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{post.zone}</span>
                      <span aria-hidden="true">·</span>
                      <span>{post.timeLabel}</span>
                      {post.isCreatorArticle && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#14472F] font-semibold">Creator Article</span>
                        </>
                      )}
                    </div>

                    <h2 className="font-display text-lg sm:text-xl font-bold text-[#181D1A] leading-snug">
                      {post.title}
                    </h2>

                    <p className="text-sm sm:text-[15px] text-[#37403B] leading-relaxed">
                      {post.body}
                    </p>

                    {post.category === 'Events' && (post.eventDateLabel || post.eventLocation) && (
                      <div className="bg-[#F6F7F4] rounded-xl p-3.5 space-y-1.5 text-sm text-[#2A332E]">
                        {post.eventDateLabel && (
                          <div className="flex items-center gap-2 font-medium">
                            <Calendar className="w-4 h-4 text-[#1B5E3F] shrink-0" aria-hidden="true" />
                            <span>{post.eventDateLabel}</span>
                          </div>
                        )}
                        {post.eventLocation && (
                          <div className="flex items-center gap-2 text-[#5A635D]">
                            <MapPin className="w-4 h-4 text-[#1B5E3F] shrink-0" aria-hidden="true" />
                            <span>{post.eventLocation}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Author & Actions Row */}
                    <div className="pt-3 border-t border-[#F0F2ED] flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          aria-hidden="true"
                          className="w-9 h-9 rounded-full bg-[#ECF4EF] text-[#14472F] font-semibold text-xs flex items-center justify-center shrink-0"
                        >
                          {post.authorName
                            .split(' ')
                            .map((part) => part[0])
                            .slice(0, 2)
                            .join('')}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-semibold text-[#181D1A] truncate">
                              {post.authorName}
                            </p>
                            {hasVerifiedPremiumBadge(post.authorTier) && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#14472F] bg-[#ECF4EF] px-1.5 py-0.5 rounded shrink-0">
                                <ShieldCheck className="w-3 h-3" aria-hidden="true" />
                                Verified Premium
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#5A635D] truncate">{post.authorRole}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleLikePost(post.id)}
                          aria-pressed={isLiked}
                          aria-label={`Thank ${post.authorName} for "${post.title}"`}
                          className={`inline-flex items-center gap-1.5 min-h-[44px] px-3.5 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                            isLiked
                              ? 'bg-[#FEF2F2] text-[#B91C1C]'
                              : 'bg-[#F3F4F0] text-[#415047] hover:bg-[#E7EAE3]'
                          }`}
                        >
                          <Heart
                            className="w-4 h-4"
                            fill={isLiked ? 'currentColor' : 'none'}
                            aria-hidden="true"
                          />
                          <span className="tabular-nums">{post.likesCount}</span>
                        </button>

                        {post.category === 'Events' && (
                          <button
                            type="button"
                            onClick={() => toggleRsvpEvent(post.id)}
                            aria-pressed={isGoing}
                            className={`inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                              isGoing
                                ? 'bg-[#1B5E3F] text-white'
                                : 'bg-[#ECF4EF] text-[#14472F] hover:bg-[#DCECE2]'
                            }`}
                          >
                            <Users className="w-4 h-4" aria-hidden="true" />
                            <span>
                              {isGoing ? 'Going' : 'RSVP'} ·{' '}
                              <span className="tabular-nums">{post.rsvpCount ?? 0}</span>
                            </span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            if (!canDm) {
                              openUpgradeModal(
                                'Creator',
                                'Direct Messaging is available on Creator and Premium tiers.'
                              );
                              return;
                            }
                            openDmWithRecipient({
                              recipientId: post.authorId,
                              recipientName: post.authorName,
                              recipientRole: post.authorRole,
                              recipientTier: post.authorTier,
                              contextLabel: post.title,
                            });
                          }}
                          className="inline-flex items-center gap-1.5 min-h-[44px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#14472F] bg-[#ECF4EF] hover:bg-[#DCECE2] transition-colors cursor-pointer"
                        >
                          <MessageCircle className="w-4 h-4" aria-hidden="true" />
                          <span>Message Author</span>
                        </button>
                      </div>
                    </div>

                    {/* Article Comments Section */}
                    <div className="pt-3 border-t border-[#F0F2ED] space-y-3">
                      <div className="flex items-center justify-between text-xs font-semibold text-[#415047]">
                        <span className="inline-flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-[#1B5E3F]" aria-hidden="true" />
                          Comments ({commentCount})
                        </span>
                      </div>

                      {post.comments.length > 0 && (
                        <div className="space-y-2">
                          {post.comments.map((cmt) => (
                            <div
                              key={cmt.id}
                              className="bg-[#F6F7F4] rounded-xl px-3.5 py-2.5 text-sm space-y-1"
                            >
                              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                                <span className="font-semibold text-[#181D1A]">
                                  {cmt.authorName}
                                </span>
                                {hasVerifiedPremiumBadge(cmt.authorTier) && (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#14472F] bg-[#ECF4EF] px-1.5 py-0.5 rounded">
                                    <ShieldCheck className="w-3 h-3" aria-hidden="true" />
                                    Verified Premium
                                  </span>
                                )}
                                <span aria-hidden="true" className="text-[#5A635D]">·</span>
                                <span className="text-[#5A635D]">{cmt.timeLabel}</span>
                              </div>
                              <p className="text-[#2A332E] leading-relaxed">{cmt.body}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {canComment ? (
                        <form
                          onSubmit={(e) => handleCommentSubmit(e, post.id)}
                          className="space-y-1.5"
                        >
                          <div className="flex items-center gap-2">
                            <label htmlFor={`comment-${post.id}`} className="sr-only">
                              Write a comment on {post.title}
                            </label>
                            <input
                              id={`comment-${post.id}`}
                              type="text"
                              value={commentDrafts[post.id] ?? ''}
                              onChange={(e) =>
                                setCommentDrafts((prev) => ({
                                  ...prev,
                                  [post.id]: e.target.value,
                                }))
                              }
                              placeholder="Write a helpful neighbor comment..."
                              className="flex-1 min-h-[44px] px-3.5 py-2 bg-[#F6F7F4] border border-[#DDE0D9] rounded-xl text-sm text-[#181D1A] placeholder:text-[#7A847D] focus:outline-none focus:bg-white focus:border-[#1B5E3F]"
                            />
                            <button
                              type="submit"
                              aria-label={`Submit comment on ${post.title}`}
                              className="min-h-[44px] px-4 py-2 inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-[#1B5E3F] hover:bg-[#14472F] rounded-xl cursor-pointer shrink-0"
                            >
                              <Send className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Post</span>
                            </button>
                          </div>
                          {commentErrors[post.id] && (
                            <p className="text-xs font-medium text-[#B91C1C]" role="alert">
                              {commentErrors[post.id]}
                            </p>
                          )}
                        </form>
                      ) : (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-[#FAFBF9] border border-[#E4E6E0] rounded-xl px-3.5 py-2.5">
                          <div className="flex items-center gap-2 text-xs text-[#415047]">
                            <Lock className="w-3.5 h-3.5 text-[#1B5E3F] shrink-0" aria-hidden="true" />
                            <span>
                              Upgrade to <strong>Creator</strong> or <strong>Premium</strong> to comment on articles.
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              openUpgradeModal(
                                'Creator',
                                'Upgrade to Creator or Premium to join article discussions and comment.'
                              )
                            }
                            className="min-h-[38px] px-3 py-1.5 text-xs font-semibold text-[#14472F] bg-[#ECF4EF] hover:bg-[#DCECE2] rounded-lg whitespace-nowrap cursor-pointer shrink-0"
                          >
                            Upgrade to Comment
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* Desktop Neighborhood Summary Sidebar */}
        <aside className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-[#E4E6E0] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display text-lg font-bold text-[#181D1A]">
                Upcoming Events
              </h2>
              <span className="text-xs font-mono-num text-[#5A635D]">
                {upcomingEvents.length} scheduled
              </span>
            </div>

            <div className="divide-y divide-[#F0F2ED]">
              {upcomingEvents.map((ev) => (
                <div key={ev.id} className="py-3 first:pt-0 last:pb-0 space-y-1">
                  <p className="text-xs font-medium text-[#1B5E3F]">
                    {ev.zone} · {ev.eventDateLabel || ev.timeLabel}
                  </p>
                  <p className="text-sm font-semibold text-[#181D1A] leading-snug">
                    {ev.title}
                  </p>
                  {ev.eventLocation && (
                    <p className="text-xs text-[#5A635D]">{ev.eventLocation}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#ECF4EF] border border-[#CFE3D6] rounded-2xl p-5 space-y-2">
            <h3 className="font-display text-base font-bold text-[#14472F]">
              {canPublish ? 'Publish a Community Article' : 'Become a Community Creator'}
            </h3>
            <p className="text-sm text-[#2D4A3A] leading-relaxed">
              {canPublish
                ? 'Write local stories, neighborhood guides, event announcements, or news updates for Oakwood.'
                : 'Free members can read all articles. Upgrade to Creator or Premium to publish your own articles and comment.'}
            </p>
            <button
              type="button"
              onClick={handleOpenCreate}
              className="w-full min-h-[44px] mt-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#1B5E3F] hover:bg-[#14472F] rounded-xl transition-colors cursor-pointer"
            >
              {canPublish ? 'Write an Article' : 'Unlock Creator Publishing'}
            </button>
          </div>
        </aside>
      </div>

      {createOpen && (
        <CreatePostModal
          defaultZone={currentUser?.zone ?? 'Central'}
          onClose={() => setCreateOpen(false)}
          onSubmit={(payload) => {
            createPost({ ...payload, isCreatorArticle: true });
            setCreateOpen(false);
          }}
        />
      )}
    </section>
  );
}

interface CreatePostModalProps {
  defaultZone: NeighborhoodZone;
  onClose: () => void;
  onSubmit: (input: {
    category: PostCategory;
    zone: NeighborhoodZone;
    title: string;
    body: string;
    eventDateLabel?: string;
    eventLocation?: string;
  }) => void;
}

function CreatePostModal({ defaultZone, onClose, onSubmit }: CreatePostModalProps) {
  const [category, setCategory] = useState<PostCategory>('News');
  const [zone, setZone] = useState<NeighborhoodZone>(defaultZone);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [eventDateLabel, setEventDateLabel] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const check = validatePostInput({ title, body, category, eventDateLabel });
    if (!check.valid) {
      setError(check.error ?? 'Please complete all required fields.');
      return;
    }
    onSubmit({
      category,
      zone,
      title,
      body,
      eventDateLabel: category === 'Events' ? eventDateLabel : undefined,
      eventLocation: category === 'Events' ? eventLocation : undefined,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-post-title"
    >
      <div className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl border border-[#E4E6E0] shadow-xl max-h-[92vh] overflow-y-auto">
        <div className="lg:hidden w-10 h-1.5 bg-[#D4D8D1] rounded-full mx-auto mt-3" />

        <div className="px-6 pt-5 pb-4 border-b border-[#ECEEE9] flex items-center justify-between">
          <h2 id="create-post-title" className="font-display text-xl font-bold text-[#181D1A]">
            Publish Community Article
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close publish article dialog"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#5A635D] hover:bg-[#F1F3EF] cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
          <div>
            <span className="block text-sm font-medium text-[#181D1A] mb-1.5">
              Category
            </span>
            <div className="grid grid-cols-3 gap-2">
              {(['News', 'General Info', 'Events'] as PostCategory[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`min-h-[44px] px-3 py-2 text-sm font-medium rounded-xl border transition-colors cursor-pointer ${
                    category === cat
                      ? 'bg-[#181D1A] border-[#181D1A] text-white'
                      : 'bg-white border-[#D3D7CF] text-[#415047] hover:bg-[#F6F7F4]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

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

          <div>
            <label htmlFor="post-title" className="block text-sm font-medium text-[#181D1A] mb-1.5">
              Article Headline
            </label>
            <input
              id="post-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Clear headline for your article or event"
              className="w-full min-h-[46px] px-3.5 py-2.5 bg-white border border-[#D3D7CF] rounded-xl text-sm text-[#181D1A] focus:outline-none focus:border-[#1B5E3F] focus:ring-2 focus:ring-[#1B5E3F]/15"
            />
          </div>

          {category === 'Events' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="event-date" className="block text-sm font-medium text-[#181D1A] mb-1.5">
                  Date & Time
                </label>
                <input
                  id="event-date"
                  type="text"
                  value={eventDateLabel}
                  onChange={(e) => setEventDateLabel(e.target.value)}
                  placeholder="e.g. Sun, Nov 22 · 10:00 AM"
                  className="w-full min-h-[46px] px-3.5 py-2.5 bg-white border border-[#D3D7CF] rounded-xl text-sm text-[#181D1A] focus:outline-none focus:border-[#1B5E3F] focus:ring-2 focus:ring-[#1B5E3F]/15"
                />
              </div>
              <div>
                <label htmlFor="event-location" className="block text-sm font-medium text-[#181D1A] mb-1.5">
                  Location
                </label>
                <input
                  id="event-location"
                  type="text"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  placeholder="e.g. Maple Ave Park"
                  className="w-full min-h-[46px] px-3.5 py-2.5 bg-white border border-[#D3D7CF] rounded-xl text-sm text-[#181D1A] focus:outline-none focus:border-[#1B5E3F] focus:ring-2 focus:ring-[#1B5E3F]/15"
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="post-body" className="block text-sm font-medium text-[#181D1A] mb-1.5">
              Article Body
            </label>
            <textarea
              id="post-body"
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your article, story, or neighborhood update..."
              className="w-full p-3.5 bg-white border border-[#D3D7CF] rounded-xl text-sm text-[#181D1A] focus:outline-none focus:border-[#1B5E3F] focus:ring-2 focus:ring-[#1B5E3F]/15"
            />
          </div>

          {error && (
            <p className="text-sm font-medium text-[#B91C1C] bg-[#FEF2F2] border border-[#FECACA] rounded-xl px-3.5 py-2.5" role="alert">
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[46px] px-4 py-2.5 text-sm font-medium text-[#415047] bg-[#F3F4F0] hover:bg-[#E7EAE3] rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-[46px] px-6 py-2.5 text-sm font-semibold text-white bg-[#1B5E3F] hover:bg-[#14472F] rounded-xl cursor-pointer"
            >
              Publish Article
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
