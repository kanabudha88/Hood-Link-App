import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Crown,
  Lock,
  MessageCircle,
  Plus,
  Search,
  ShieldCheck,
  UserPlus,
  X,
} from 'lucide-react';
import { useCommunity } from '../context/CommunityContext';
import type {
  MentorProfile,
  MentorSkillCategory,
  NeighborhoodZone,
} from '../types/community';
import {
  canSendDirectMessages,
  filterMentors,
  hasVerifiedPremiumBadge,
  isCurriculumChapterUnlocked,
  validateBookingInput,
  validateMentorInput,
} from '../utils/communityLogic';

const SKILL_FILTERS: ('All' | MentorSkillCategory)[] = [
  'All',
  'Business',
  'Tech',
  'Trades',
  'Academics',
];

export function PeerMentoringTab() {
  const {
    currentUser,
    activeTier,
    openAuthModal,
    openUpgradeModal,
    openDmWithRecipient,
    mentors,
    bookings,
    createMentorProfile,
    requestMentorSession,
  } = useCommunity();

  const [skillFilter, setSkillFilter] = useState<'All' | MentorSkillCategory>('All');
  const [query, setQuery] = useState('');
  const [bookingTarget, setBookingTarget] = useState<MentorProfile | null>(null);
  const [curriculumTarget, setCurriculumTarget] = useState<MentorProfile | null>(null);
  const [offerModalOpen, setOfferModalOpen] = useState(false);

  const canDm = canSendDirectMessages(activeTier);

  const filteredMentors = useMemo(
    () => filterMentors(mentors, skillFilter, query),
    [mentors, skillFilter, query]
  );

  const handleOpenOffer = () => {
    if (!currentUser && activeTier === 'Free') {
      openAuthModal('login');
      return;
    }
    setOfferModalOpen(true);
  };

  const handleOpenBook = (mentor: MentorProfile) => {
    if (!currentUser && activeTier === 'Free') {
      openAuthModal('login');
      return;
    }
    setBookingTarget(mentor);
  };

  return (
    <section aria-labelledby="mentoring-heading" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1
            id="mentoring-heading"
            className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#181D1A] text-balance"
          >
            Creative Skills and Mentorship
          </h1>
          <p className="text-sm sm:text-base text-[#5A635D] mt-1">
            Structured 12-chapter training tracks and 1-on-1 skill sharing across Oakwood.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenOffer}
          className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-3 text-sm font-semibold text-white bg-[#1B5E3F] hover:bg-[#14472F] rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" aria-hidden="true" />
          Offer Your Skills
        </button>
      </div>

      {/* Tier Access Banner */}
      <div className="bg-white border border-[#E4E6E0] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#ECF4EF] text-[#1B5E3F] flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#181D1A]">
              {activeTier === 'Premium'
                ? 'Premium Access: All 12 Chapters Unlocked'
                : `${activeTier} Access: Chapters 1–6 Unlocked (Chapters 7–12 require Premium)`}
            </p>
            <p className="text-xs text-[#5A635D]">
              Open any mentor’s curriculum below to read lessons or upgrade for full access.
            </p>
          </div>
        </div>
        {activeTier !== 'Premium' && (
          <button
            type="button"
            onClick={() =>
              openUpgradeModal(
                'Premium',
                'Upgrade to Premium to unlock all 12 chapters of every mentorship training course and earn the Verified Premium badge.'
              )
            }
            className="min-h-[42px] px-4 py-2 inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold text-white bg-[#1B5E3F] hover:bg-[#14472F] rounded-xl whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Crown className="w-4 h-4" aria-hidden="true" />
            Unlock Full 12 Chapters
          </button>
        )}
      </div>

      {/* Filters & Search */}
      <div className="bg-white border border-[#E4E6E0] rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div
          className="flex flex-wrap items-center gap-2"
          role="group"
          aria-label="Filter mentors by skill area"
        >
          {SKILL_FILTERS.map((skill) => {
            const active = skillFilter === skill;
            return (
              <button
                key={skill}
                type="button"
                onClick={() => setSkillFilter(skill)}
                className={`min-h-[42px] px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-xl whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#181D1A] text-white'
                    : 'bg-[#F3F4F0] text-[#415047] hover:bg-[#E7EAE3]'
                }`}
              >
                {skill}
              </button>
            );
          })}
        </div>

        <div className="relative flex-1 sm:max-w-xs">
          <label htmlFor="mentor-search" className="sr-only">
            Search mentors by name or topic
          </label>
          <Search
            className="w-4 h-4 text-[#5A635D] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            id="mentor-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search skills, topics, mentors..."
            className="w-full min-h-[44px] pl-10 pr-4 py-2 bg-[#F6F7F4] border border-[#DDE0D9] rounded-xl text-sm text-[#181D1A] placeholder:text-[#7A847D] focus:outline-none focus:bg-white focus:border-[#1B5E3F]"
          />
        </div>
      </div>

      {/* Requested Sessions Summary Strip */}
      {bookings.length > 0 && (
        <div className="bg-[#ECF4EF] border border-[#CFE3D6] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <CalendarCheck className="w-5 h-5 text-[#1B5E3F] shrink-0" aria-hidden="true" />
            <p className="text-sm font-medium text-[#14472F]">
              You have{' '}
              <span className="font-mono-num font-bold">{bookings.length}</span>{' '}
              mentoring {bookings.length === 1 ? 'request' : 'requests'} sent (latest:{' '}
              {bookings[0].mentorName} · {bookings[0].preferredSlot}).
            </p>
          </div>
        </div>
      )}

      {/* Mentor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredMentors.length === 0 ? (
          <div className="md:col-span-2 bg-white border border-[#E4E6E0] rounded-2xl p-8 text-center space-y-3">
            <p className="font-display text-lg font-semibold text-[#181D1A]">
              No mentors match your search
            </p>
            <button
              type="button"
              onClick={() => {
                setSkillFilter('All');
                setQuery('');
              }}
              className="min-h-[44px] px-4 py-2 text-sm font-semibold text-[#1B5E3F] bg-[#ECF4EF] rounded-xl cursor-pointer"
            >
              Show All Mentors
            </button>
          </div>
        ) : (
          filteredMentors.map((mentor) => {
            const existingBooking = bookings.find((b) => b.mentorId === mentor.id);
            const unlockedCount = mentor.chapters.filter((ch) =>
              isCurriculumChapterUnlocked(ch.number, activeTier)
            ).length;

            return (
              <article
                key={mentor.id}
                className="bg-white border border-[#E4E6E0] rounded-2xl p-5 sm:p-6 flex flex-col justify-between gap-5"
              >
                <div className="space-y-3.5">
                  {/* Unboxed skill metadata */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-[#1B5E3F]">
                      {mentor.skills.join(' · ')}
                    </p>
                    <p className="text-xs text-[#5A635D]">
                      {mentor.zone} · {mentor.sessionFormat}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      aria-hidden="true"
                      className="w-11 h-11 rounded-full bg-[#181D1A] text-white font-display font-bold text-sm flex items-center justify-center shrink-0"
                    >
                      {mentor.name
                        .split(' ')
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join('')}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <h2 className="font-display text-lg font-bold text-[#181D1A]">
                          {mentor.name}
                        </h2>
                        {hasVerifiedPremiumBadge(mentor.tier) && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#14472F] bg-[#ECF4EF] px-1.5 py-0.5 rounded">
                            <ShieldCheck className="w-3 h-3" aria-hidden="true" />
                            Verified Premium
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-[#415047]">{mentor.specialty}</p>
                    </div>
                  </div>

                  <p className="text-sm text-[#37403B] leading-relaxed">{mentor.bio}</p>

                  <div className="bg-[#F6F7F4] rounded-xl px-3.5 py-2.5 flex items-center gap-2 text-xs sm:text-sm text-[#2A332E]">
                    <Clock className="w-4 h-4 text-[#1B5E3F] shrink-0" aria-hidden="true" />
                    <span className="font-medium">Availability:</span>
                    <span>{mentor.availability}</span>
                  </div>

                  {/* 12-Chapter Curriculum Summary Row */}
                  <div className="border border-[#E4E6E0] rounded-xl p-3.5 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-[#181D1A]">
                        12-Chapter Training Curriculum
                      </p>
                      <p className="text-xs text-[#5A635D] mt-0.5 font-mono-num">
                        {unlockedCount} of {mentor.chapters.length} chapters unlocked ({activeTier})
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurriculumTarget(mentor)}
                      className="min-h-[40px] px-3.5 py-2 text-xs font-semibold text-[#14472F] bg-[#ECF4EF] hover:bg-[#DCECE2] rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      View Curriculum
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleOpenBook(mentor)}
                    className={`w-full min-h-[46px] px-4 py-2.5 inline-flex items-center justify-center gap-2 text-sm font-semibold rounded-xl transition-colors cursor-pointer ${
                      existingBooking
                        ? 'bg-[#ECF4EF] text-[#14472F] border border-[#1B5E3F]/30'
                        : 'bg-[#1B5E3F] text-white hover:bg-[#14472F]'
                    }`}
                  >
                    <CalendarCheck className="w-4 h-4" aria-hidden="true" />
                    {existingBooking
                      ? `Requested (${existingBooking.preferredSlot})`
                      : 'Book / Request Session'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!canDm) {
                        openUpgradeModal(
                          'Creator',
                          'Upgrade to Creator or Premium to send Direct Messages to mentors.'
                        );
                        return;
                      }
                      openDmWithRecipient({
                        recipientId: mentor.userId,
                        recipientName: mentor.name,
                        recipientRole: mentor.specialty,
                        recipientTier: mentor.tier,
                        contextLabel: mentor.specialty,
                      });
                    }}
                    className="w-full min-h-[46px] px-4 py-2.5 inline-flex items-center justify-center gap-2 text-sm font-semibold text-[#181D1A] bg-[#F3F4F0] hover:bg-[#E7EAE3] rounded-xl transition-colors cursor-pointer"
                  >
                    {!canDm ? (
                      <Lock className="w-4 h-4" aria-hidden="true" />
                    ) : (
                      <MessageCircle className="w-4 h-4" aria-hidden="true" />
                    )}
                    <span>Message Mentor</span>
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>

      {curriculumTarget && (
        <CurriculumModal
          mentor={curriculumTarget}
          onClose={() => setCurriculumTarget(null)}
        />
      )}

      {bookingTarget && (
        <BookMentorModal
          mentor={bookingTarget}
          onClose={() => setBookingTarget(null)}
          onSubmit={(payload) => {
            requestMentorSession({
              mentorId: bookingTarget.id,
              ...payload,
            });
            setBookingTarget(null);
          }}
        />
      )}

      {offerModalOpen && (
        <OfferSkillsModal
          defaultZone={currentUser?.zone ?? 'Central'}
          onClose={() => setOfferModalOpen(false)}
          onSubmit={(payload) => {
            createMentorProfile(payload);
            setOfferModalOpen(false);
          }}
        />
      )}
    </section>
  );
}

function CurriculumModal({
  mentor,
  onClose,
}: {
  mentor: MentorProfile;
  onClose: () => void;
}) {
  const { activeTier, openUpgradeModal } = useCommunity();
  const [selectedChapterNum, setSelectedChapterNum] = useState<number>(1);

  const selectedChapter =
    mentor.chapters.find((c) => c.number === selectedChapterNum) ?? mentor.chapters[0];
  const isSelectedUnlocked = selectedChapter
    ? isCurriculumChapterUnlocked(selectedChapter.number, activeTier)
    : false;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="curriculum-modal-title"
    >
      <div className="w-full sm:max-w-3xl bg-white rounded-t-3xl sm:rounded-2xl border border-[#E4E6E0] shadow-xl max-h-[92vh] flex flex-col overflow-hidden">
        <div className="lg:hidden w-10 h-1.5 bg-[#D4D8D1] rounded-full mx-auto mt-3 shrink-0" />

        <div className="px-6 pt-5 pb-4 border-b border-[#ECEEE9] flex items-start justify-between gap-4 shrink-0">
          <div>
            <p className="text-xs font-semibold text-[#1B5E3F]">
              {mentor.name} · 12-Chapter Curriculum
            </p>
            <h2 id="curriculum-modal-title" className="font-display text-xl font-bold text-[#181D1A] mt-0.5">
              {mentor.specialty}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close curriculum dialog"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#5A635D] hover:bg-[#F1F3EF] cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Active Lesson Reader */}
          {selectedChapter && (
            <div className="bg-[#F6F7F4] border border-[#E4E6E0] rounded-2xl p-4 sm:p-5 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-mono-num font-semibold text-[#1B5E3F]">
                  Chapter {selectedChapter.number} of 12 · {selectedChapter.durationLabel}
                </span>
                {isSelectedUnlocked ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#14472F]">
                    <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                    Unlocked
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#92400E]">
                    <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                    Premium Chapter
                  </span>
                )}
              </div>

              <h3 className="font-display text-lg font-bold text-[#181D1A]">
                {selectedChapter.title}
              </h3>

              {isSelectedUnlocked ? (
                <>
                  <p className="text-sm text-[#2A332E] leading-relaxed">
                    {selectedChapter.summary}
                  </p>
                  <p className="text-xs font-medium text-[#14472F] bg-[#ECF4EF] rounded-xl px-3.5 py-2.5">
                    {selectedChapter.takeaway}
                  </p>
                </>
              ) : (
                <div className="bg-white border border-[#E4E6E0] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="text-sm text-[#415047]">
                    Chapters 7–12 include intermediate workshops, sourcing checklists, and capstone reviews.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      openUpgradeModal(
                        'Premium',
                        'Unlock all 12 chapters of every mentorship training course with Premium.'
                      );
                    }}
                    className="min-h-[44px] px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#1B5E3F] hover:bg-[#14472F] rounded-xl whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Unlock Full 12 Chapters with Premium
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Full 12-Chapter List */}
          <div className="space-y-2">
            {mentor.chapters.map((chapter) => {
              const unlocked = isCurriculumChapterUnlocked(chapter.number, activeTier);
              const isSelected = selectedChapterNum === chapter.number;

              return (
                <div
                  key={chapter.number}
                  className={`rounded-xl border transition-colors ${
                    isSelected
                      ? 'border-[#1B5E3F] bg-[#FAFDFB]'
                      : unlocked
                      ? 'border-[#E4E6E0] bg-white'
                      : 'border-[#ECEEE9] bg-[#FAFBF9]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedChapterNum(chapter.number)}
                    className="w-full min-h-[52px] px-4 py-3 flex items-center justify-between gap-3 text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-7 h-7 rounded-lg font-mono-num text-xs font-bold flex items-center justify-center shrink-0 ${
                          unlocked
                            ? 'bg-[#ECF4EF] text-[#14472F]'
                            : 'bg-[#ECEEE9] text-[#5A635D]'
                        }`}
                      >
                        {chapter.number}
                      </span>
                      <div className="min-w-0">
                        <p
                          className={`text-sm font-semibold truncate ${
                            unlocked ? 'text-[#181D1A]' : 'text-[#5A635D]'
                          }`}
                        >
                          {chapter.title}
                        </p>
                        <p className="text-xs text-[#5A635D]">{chapter.durationLabel}</p>
                      </div>
                    </div>

                    {unlocked ? (
                      <span className="text-xs font-semibold text-[#1B5E3F] shrink-0">
                        Read
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#5A635D] shrink-0">
                        <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                        Locked
                      </span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {activeTier !== 'Premium' && (
            <div className="bg-[#ECF4EF] border border-[#CFE3D6] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-[#14472F]">
                  Unlock Full 12 Chapters with Premium
                </p>
                <p className="text-xs text-[#2D4A3A]">
                  Get Chapters 7–12 across every mentor track plus a Verified Premium badge.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openUpgradeModal(
                    'Premium',
                    'Upgrade to Premium to unlock Chapters 7–12 across all mentorship courses.'
                  );
                }}
                className="min-h-[44px] px-4 py-2 text-sm font-semibold text-white bg-[#1B5E3F] hover:bg-[#14472F] rounded-xl whitespace-nowrap shrink-0 cursor-pointer"
              >
                Unlock Full 12 Chapters with Premium
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BookMentorModal({
  mentor,
  onClose,
  onSubmit,
}: {
  mentor: MentorProfile;
  onClose: () => void;
  onSubmit: (input: { preferredSlot: string; topic: string }) => void;
}) {
  const [preferredSlot, setPreferredSlot] = useState('');
  const [topic, setTopic] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateBookingInput({ preferredSlot, topic });
    if (!check.valid) {
      setError(check.error ?? 'Please fill in your preferred time and topic.');
      return;
    }
    onSubmit({ preferredSlot, topic });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-mentor-title"
    >
      <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl border border-[#E4E6E0] shadow-xl max-h-[92vh] overflow-y-auto">
        <div className="lg:hidden w-10 h-1.5 bg-[#D4D8D1] rounded-full mx-auto mt-3" />

        <div className="px-6 pt-5 pb-4 border-b border-[#ECEEE9] flex items-center justify-between">
          <div>
            <h2 id="book-mentor-title" className="font-display text-xl font-bold text-[#181D1A]">
              Request Session with {mentor.name}
            </h2>
            <p className="text-xs text-[#5A635D] mt-0.5">
              Typical hours: {mentor.availability}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close session request dialog"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#5A635D] hover:bg-[#F1F3EF] cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
          <div>
            <label htmlFor="book-slot" className="block text-sm font-medium text-[#181D1A] mb-1.5">
              Preferred Day & Time
            </label>
            <input
              id="book-slot"
              type="text"
              value={preferredSlot}
              onChange={(e) => setPreferredSlot(e.target.value)}
              placeholder="e.g. Thursday at 6:00 PM"
              className="w-full min-h-[46px] px-3.5 py-2.5 bg-white border border-[#D3D7CF] rounded-xl text-sm text-[#181D1A] focus:outline-none focus:border-[#1B5E3F]"
            />
          </div>

          <div>
            <label htmlFor="book-topic" className="block text-sm font-medium text-[#181D1A] mb-1.5">
              What would you like to cover?
            </label>
            <textarea
              id="book-topic"
              rows={3}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Share a quick summary of your question or project..."
              className="w-full p-3.5 bg-white border border-[#D3D7CF] rounded-xl text-sm text-[#181D1A] focus:outline-none focus:border-[#1B5E3F]"
            />
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
              Send Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function OfferSkillsModal({
  defaultZone,
  onClose,
  onSubmit,
}: {
  defaultZone: NeighborhoodZone;
  onClose: () => void;
  onSubmit: (input: {
    skills: MentorSkillCategory[];
    specialty: string;
    bio: string;
    availability: string;
    sessionFormat: MentorProfile['sessionFormat'];
    zone: NeighborhoodZone;
  }) => void;
}) {
  const [skills, setSkills] = useState<MentorSkillCategory[]>(['Tech']);
  const [specialty, setSpecialty] = useState('');
  const [bio, setBio] = useState('');
  const [availability, setAvailability] = useState('');
  const [sessionFormat, setSessionFormat] =
    useState<MentorProfile['sessionFormat']>('In-person or Video');
  const [zone, setZone] = useState<NeighborhoodZone>(defaultZone);
  const [error, setError] = useState<string | null>(null);

  const toggleSkill = (skill: MentorSkillCategory) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateMentorInput({ skills, specialty, bio, availability });
    if (!check.valid) {
      setError(check.error ?? 'Please complete all mentor fields.');
      return;
    }
    onSubmit({
      skills,
      specialty,
      bio,
      availability,
      sessionFormat,
      zone,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="offer-skills-title"
    >
      <div className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl border border-[#E4E6E0] shadow-xl max-h-[92vh] overflow-y-auto">
        <div className="lg:hidden w-10 h-1.5 bg-[#D4D8D1] rounded-full mx-auto mt-3" />

        <div className="px-6 pt-5 pb-4 border-b border-[#ECEEE9] flex items-center justify-between">
          <h2 id="offer-skills-title" className="font-display text-xl font-bold text-[#181D1A]">
            Offer Your Skills as a Mentor
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close offer skills dialog"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#5A635D] hover:bg-[#F1F3EF] cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
          <div>
            <span className="block text-sm font-medium text-[#181D1A] mb-1.5">
              Skill Categories (select one or more)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Business', 'Tech', 'Trades', 'Academics'] as MentorSkillCategory[]).map(
                (skill) => {
                  const selected = skills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      aria-pressed={selected}
                      className={`min-h-[44px] px-3 py-2 text-sm font-medium rounded-xl border transition-colors cursor-pointer ${
                        selected
                          ? 'bg-[#ECF4EF] border-[#1B5E3F] text-[#14472F] font-semibold'
                          : 'bg-white border-[#D3D7CF] text-[#415047]'
                      }`}
                    >
                      {skill}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          <div>
            <label htmlFor="mentor-specialty" className="block text-sm font-medium text-[#181D1A] mb-1.5">
              Specialty Headline
            </label>
            <input
              id="mentor-specialty"
              type="text"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              placeholder="e.g. Neighborhood Podcasting & Audio Editing"
              className="w-full min-h-[46px] px-3.5 py-2.5 bg-white border border-[#D3D7CF] rounded-xl text-sm text-[#181D1A] focus:outline-none focus:border-[#1B5E3F]"
            />
          </div>

          <div>
            <label htmlFor="mentor-bio" className="block text-sm font-medium text-[#181D1A] mb-1.5">
              Short Bio & How You Can Help
            </label>
            <textarea
              id="mentor-bio"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Briefly describe your background and what neighbors can ask you about..."
              className="w-full p-3.5 bg-white border border-[#D3D7CF] rounded-xl text-sm text-[#181D1A] focus:outline-none focus:border-[#1B5E3F]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="mentor-availability" className="block text-sm font-medium text-[#181D1A] mb-1.5">
                Availability
              </label>
              <input
                id="mentor-availability"
                type="text"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                placeholder="e.g. Sat · 10 AM – 1 PM"
                className="w-full min-h-[46px] px-3.5 py-2.5 bg-white border border-[#D3D7CF] rounded-xl text-sm text-[#181D1A] focus:outline-none focus:border-[#1B5E3F]"
              />
            </div>

            <div>
              <label htmlFor="mentor-format" className="block text-sm font-medium text-[#181D1A] mb-1.5">
                Session Format
              </label>
              <select
                id="mentor-format"
                value={sessionFormat}
                onChange={(e) =>
                  setSessionFormat(e.target.value as MentorProfile['sessionFormat'])
                }
                className="w-full min-h-[46px] px-3.5 py-2.5 bg-white border border-[#D3D7CF] rounded-xl text-sm text-[#181D1A] focus:outline-none focus:border-[#1B5E3F]"
              >
                <option value="In-person or Video">In-person or Video</option>
                <option value="In-person">In-person</option>
                <option value="Video Call">Video Call</option>
              </select>
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
              className="min-h-[46px] px-6 py-2.5 inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-[#1B5E3F] hover:bg-[#14472F] rounded-xl cursor-pointer"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              Publish Mentor Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
