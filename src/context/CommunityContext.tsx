import React, { createContext, useContext, useState } from 'react';
import {
  DEMO_MEMBER,
  INITIAL_DM_THREADS,
  INITIAL_FOOD_JOINTS,
  INITIAL_MARKET_ITEMS,
  INITIAL_MENTORS,
  INITIAL_POSTS,
  INITIAL_RESOURCES,
} from '../data/seedData';
import type {
  CommunityPost,
  DmThread,
  FoodJoint,
  FoodJointStatus,
  LocalResource,
  MarketInquiry,
  MarketItem,
  MemberProfile,
  MembershipTier,
  MentorBooking,
  MentorProfile,
  MentorSkillCategory,
  NeighborhoodZone,
  PostCategory,
} from '../types/community';
import { buildDefaultCurriculum } from '../utils/communityLogic';

interface CommunityContextValue {
  currentUser: MemberProfile | null;
  activeTier: MembershipTier;
  setMembershipTier: (tier: MembershipTier) => void;

  authModalOpen: boolean;
  authModalMode: 'login' | 'register';
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  login: (email: string) => void;
  register: (name: string, email: string, zone: NeighborhoodZone) => void;
  loginAsDemoMember: (tier?: MembershipTier) => void;
  logout: () => void;

  upgradeModalOpen: boolean;
  upgradeHighlightTier: MembershipTier;
  upgradeReason: string | null;
  openUpgradeModal: (highlightTier?: MembershipTier, reason?: string) => void;
  closeUpgradeModal: () => void;

  posts: CommunityPost[];
  likedPostIds: string[];
  rsvpedPostIds: string[];
  createPost: (input: {
    category: PostCategory;
    zone: NeighborhoodZone;
    title: string;
    body: string;
    isCreatorArticle?: boolean;
    eventDateLabel?: string;
    eventLocation?: string;
  }) => void;
  addPostComment: (postId: string, body: string) => void;
  toggleLikePost: (postId: string) => void;
  toggleRsvpEvent: (postId: string) => void;

  foodJoints: FoodJoint[];
  addFoodTip: (jointId: string, text: string) => void;
  createFoodJoint: (input: {
    name: string;
    cuisine: string;
    zone: NeighborhoodZone;
    address: string;
    hours: string;
    status: FoodJointStatus;
    signatureItem: string;
    signaturePrice: number;
  }) => void;

  marketItems: MarketItem[];
  inquiries: MarketInquiry[];
  createMarketItem: (input: {
    title: string;
    price: number;
    condition: string;
    listingKind: 'Product' | 'Service';
    zone: NeighborhoodZone;
    description: string;
  }) => void;
  sendMarketInquiry: (itemId: string, message: string) => void;

  mentors: MentorProfile[];
  bookings: MentorBooking[];
  createMentorProfile: (input: {
    skills: MentorSkillCategory[];
    specialty: string;
    bio: string;
    availability: string;
    sessionFormat: MentorProfile['sessionFormat'];
    zone: NeighborhoodZone;
  }) => void;
  requestMentorSession: (input: {
    mentorId: string;
    preferredSlot: string;
    topic: string;
  }) => void;

  dmThreads: DmThread[];
  dmDrawerOpen: boolean;
  activeDmThreadId: string | null;
  openDmDrawer: (threadId?: string) => void;
  openDmWithRecipient: (input: {
    recipientId: string;
    recipientName: string;
    recipientRole: string;
    recipientTier?: MembershipTier;
    contextLabel: string;
  }) => void;
  closeDmDrawer: () => void;
  selectDmThread: (threadId: string) => void;
  sendDirectMessage: (threadId: string, text: string) => void;

  resources: LocalResource[];
}

const CommunityContext = createContext<CommunityContextValue | null>(null);

export function CommunityProvider({ children }: { children: React.ReactNode }) {
  // Auth & Tier state — swap with Firebase Auth + Firestore user profile listener later.
  const [currentUser, setCurrentUser] = useState<MemberProfile | null>(null);
  const [activeTier, setActiveTier] = useState<MembershipTier>('Free');

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('register');

  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [upgradeHighlightTier, setUpgradeHighlightTier] = useState<MembershipTier>('Creator');
  const [upgradeReason, setUpgradeReason] = useState<string | null>(null);

  // Domain collections
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);
  const [likedPostIds, setLikedPostIds] = useState<string[]>([]);
  const [rsvpedPostIds, setRsvpedPostIds] = useState<string[]>([]);

  const [foodJoints, setFoodJoints] = useState<FoodJoint[]>(INITIAL_FOOD_JOINTS);
  const [marketItems, setMarketItems] = useState<MarketItem[]>(INITIAL_MARKET_ITEMS);
  const [inquiries, setInquiries] = useState<MarketInquiry[]>([]);

  const [mentors, setMentors] = useState<MentorProfile[]>(INITIAL_MENTORS);
  const [bookings, setBookings] = useState<MentorBooking[]>([]);

  const [dmThreads, setDmThreads] = useState<DmThread[]>(INITIAL_DM_THREADS);
  const [dmDrawerOpen, setDmDrawerOpen] = useState(false);
  const [activeDmThreadId, setActiveDmThreadId] = useState<string | null>(
    INITIAL_DM_THREADS[0]?.id ?? null
  );

  const [resources] = useState<LocalResource[]>(INITIAL_RESOURCES);

  const openAuthModal = (mode: 'login' | 'register' = 'register') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const openUpgradeModal = (highlightTier: MembershipTier = 'Creator', reason?: string) => {
    setUpgradeHighlightTier(highlightTier);
    setUpgradeReason(reason ?? null);
    setUpgradeModalOpen(true);
  };

  const closeUpgradeModal = () => {
    setUpgradeModalOpen(false);
    setUpgradeReason(null);
  };

  const setMembershipTier = (tier: MembershipTier) => {
    setActiveTier(tier);
    setCurrentUser((prev) => {
      if (prev) {
        return { ...prev, tier };
      }
      return { ...DEMO_MEMBER, tier };
    });
  };

  const login = (email: string) => {
    const cleanEmail = email.trim();
    const derivedName = cleanEmail
      .split('@')[0]
      .replace(/[._-]+/g, ' ')
      .replace(/\b\w/g, (ch) => ch.toUpperCase());

    setCurrentUser({
      id: `member-${Date.now()}`,
      name: derivedName || 'Neighbor Member',
      email: cleanEmail,
      zone: 'Central',
      role: 'Registered Member',
      tier: activeTier,
      joinedAt: new Date().toISOString(),
    });
    setAuthModalOpen(false);
  };

  // New users register for free as a Free Member by default.
  const register = (name: string, email: string, zone: NeighborhoodZone) => {
    setActiveTier('Free');
    setCurrentUser({
      id: `member-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      zone,
      role: 'Free Member',
      tier: 'Free',
      joinedAt: new Date().toISOString(),
    });
    setAuthModalOpen(false);
  };

  const loginAsDemoMember = (tier: MembershipTier = 'Free') => {
    setActiveTier(tier);
    setCurrentUser({ ...DEMO_MEMBER, tier });
    setAuthModalOpen(false);
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveTier('Free');
  };

  const createPost: CommunityContextValue['createPost'] = (input) => {
    const author = currentUser ?? { ...DEMO_MEMBER, tier: activeTier };
    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      authorId: author.id,
      authorName: author.name,
      authorRole:
        activeTier === 'Premium'
          ? 'Verified Premium Creator'
          : activeTier === 'Creator'
          ? 'Community Creator'
          : author.role,
      authorTier: activeTier,
      isCreatorArticle: input.isCreatorArticle ?? true,
      category: input.category,
      zone: input.zone,
      title: input.title.trim(),
      body: input.body.trim(),
      createdAt: new Date().toISOString(),
      timeLabel: 'Just now',
      likesCount: 0,
      rsvpCount: input.category === 'Events' ? 1 : undefined,
      eventDateLabel: input.eventDateLabel?.trim() || undefined,
      eventLocation: input.eventLocation?.trim() || undefined,
      comments: [],
    };
    setPosts((prev) => [newPost, ...prev]);
  };

  const addPostComment = (postId: string, body: string) => {
    const cleanBody = body.trim();
    if (!cleanBody) return;
    const author = currentUser ?? { ...DEMO_MEMBER, tier: activeTier };
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                {
                  id: `cmt-${Date.now()}`,
                  postId,
                  authorId: author.id,
                  authorName: author.name,
                  authorTier: activeTier,
                  body: cleanBody,
                  createdAt: new Date().toISOString(),
                  timeLabel: 'Just now',
                },
              ],
            }
          : post
      )
    );
  };

  const toggleLikePost = (postId: string) => {
    const alreadyLiked = likedPostIds.includes(postId);
    setLikedPostIds((prev) =>
      alreadyLiked ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              likesCount: Math.max(0, post.likesCount + (alreadyLiked ? -1 : 1)),
            }
          : post
      )
    );
  };

  const toggleRsvpEvent = (postId: string) => {
    const alreadyGoing = rsvpedPostIds.includes(postId);
    setRsvpedPostIds((prev) =>
      alreadyGoing ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              rsvpCount: Math.max(0, (post.rsvpCount ?? 0) + (alreadyGoing ? -1 : 1)),
            }
          : post
      )
    );
  };

  const addFoodTip = (jointId: string, text: string) => {
    const author = currentUser ?? { ...DEMO_MEMBER, tier: activeTier };
    const tipText = text.trim();
    if (!tipText) return;
    setFoodJoints((prev) =>
      prev.map((joint) =>
        joint.id === jointId
          ? {
              ...joint,
              tips: [
                {
                  id: `tip-${Date.now()}`,
                  authorName: author.name,
                  text: tipText,
                  timeLabel: 'Just now',
                },
                ...joint.tips,
              ],
            }
          : joint
      )
    );
  };

  const createFoodJoint: CommunityContextValue['createFoodJoint'] = (input) => {
    const owner = currentUser ?? { ...DEMO_MEMBER, tier: activeTier };
    const newJoint: FoodJoint = {
      id: `joint-${Date.now()}`,
      ownerId: owner.id,
      ownerName: owner.name,
      name: input.name.trim(),
      cuisine: input.cuisine.trim(),
      zone: input.zone,
      address: input.address.trim(),
      hours: input.hours.trim() || '11:00 AM – 8:00 PM',
      status: input.status,
      imageAlt: `${input.name.trim()} — ${input.cuisine.trim()}`,
      popularItems: [
        {
          id: `menu-${Date.now()}`,
          name: input.signatureItem.trim(),
          price: input.signaturePrice,
          note: 'Creator featured special',
        },
      ],
      tips: [
        {
          id: `tip-${Date.now()}`,
          authorName: owner.name,
          text: 'Fresh kitchen listing posted directly by neighborhood creator.',
          timeLabel: 'Just now',
        },
      ],
    };
    setFoodJoints((prev) => [newJoint, ...prev]);
  };

  const createMarketItem: CommunityContextValue['createMarketItem'] = (input) => {
    const seller = currentUser ?? { ...DEMO_MEMBER, tier: activeTier };
    const newItem: MarketItem = {
      id: `mkt-${Date.now()}`,
      sellerId: seller.id,
      sellerName: seller.name,
      sellerTier: activeTier,
      listingKind: input.listingKind,
      zone: input.zone,
      title: input.title.trim(),
      price: input.price,
      condition: input.condition.trim() || (input.listingKind === 'Service' ? 'Local Service' : 'Good condition'),
      description: input.description.trim(),
      createdAt: new Date().toISOString(),
      timeLabel: 'Just now',
      imageAlt: input.title.trim(),
    };
    setMarketItems((prev) => [newItem, ...prev]);
  };

  const sendMarketInquiry = (itemId: string, message: string) => {
    const item = marketItems.find((m) => m.id === itemId);
    if (!item) return;
    const sender = currentUser ?? { ...DEMO_MEMBER, tier: activeTier };
    const inquiry: MarketInquiry = {
      id: `inq-${Date.now()}`,
      itemId,
      itemTitle: item.title,
      senderName: sender.name,
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };
    setInquiries((prev) => [inquiry, ...prev]);
  };

  const createMentorProfile: CommunityContextValue['createMentorProfile'] = (input) => {
    const member = currentUser ?? { ...DEMO_MEMBER, tier: activeTier };
    const newMentor: MentorProfile = {
      id: `mentor-${Date.now()}`,
      userId: member.id,
      name: member.name,
      tier: activeTier,
      zone: input.zone,
      skills: input.skills,
      specialty: input.specialty.trim(),
      bio: input.bio.trim(),
      availability: input.availability.trim(),
      sessionFormat: input.sessionFormat,
      createdAt: new Date().toISOString(),
      chapters: buildDefaultCurriculum(input.specialty),
    };
    setMentors((prev) => [newMentor, ...prev]);
  };

  const requestMentorSession: CommunityContextValue['requestMentorSession'] = (input) => {
    const mentor = mentors.find((m) => m.id === input.mentorId);
    if (!mentor) return;
    const requester = currentUser ?? { ...DEMO_MEMBER, tier: activeTier };
    const newBooking: MentorBooking = {
      id: `book-${Date.now()}`,
      mentorId: mentor.id,
      mentorName: mentor.name,
      requesterId: requester.id,
      requesterName: requester.name,
      preferredSlot: input.preferredSlot.trim(),
      topic: input.topic.trim(),
      createdAt: new Date().toISOString(),
    };
    setBookings((prev) => [newBooking, ...prev]);
  };

  const openDmDrawer = (threadId?: string) => {
    if (threadId) {
      setActiveDmThreadId(threadId);
    } else if (!activeDmThreadId && dmThreads.length > 0) {
      setActiveDmThreadId(dmThreads[0].id);
    }
    setDmDrawerOpen(true);
  };

  const openDmWithRecipient: CommunityContextValue['openDmWithRecipient'] = (input) => {
    const existing = dmThreads.find(
      (t) =>
        t.recipientId === input.recipientId ||
        t.recipientName.toLowerCase() === input.recipientName.toLowerCase()
    );
    if (existing) {
      setActiveDmThreadId(existing.id);
      setDmDrawerOpen(true);
      return;
    }

    const newThread: DmThread = {
      id: `dm-${Date.now()}`,
      recipientId: input.recipientId,
      recipientName: input.recipientName,
      recipientRole: input.recipientRole,
      recipientTier: input.recipientTier,
      contextLabel: input.contextLabel,
      updatedAt: new Date().toISOString(),
      messages: [],
    };
    setDmThreads((prev) => [newThread, ...prev]);
    setActiveDmThreadId(newThread.id);
    setDmDrawerOpen(true);
  };

  const closeDmDrawer = () => {
    setDmDrawerOpen(false);
  };

  const selectDmThread = (threadId: string) => {
    setActiveDmThreadId(threadId);
  };

  const sendDirectMessage = (threadId: string, text: string) => {
    const cleanText = text.trim();
    if (!cleanText) return;
    const sender = currentUser ?? { ...DEMO_MEMBER, tier: activeTier };
    setDmThreads((prev) =>
      prev.map((thread) =>
        thread.id === threadId
          ? {
              ...thread,
              updatedAt: new Date().toISOString(),
              messages: [
                ...thread.messages,
                {
                  id: `msg-${Date.now()}`,
                  senderName: sender.name,
                  isSelf: true,
                  text: cleanText,
                  timeLabel: 'Just now',
                },
              ],
            }
          : thread
      )
    );
  };

  return (
    <CommunityContext.Provider
      value={{
        currentUser,
        activeTier,
        setMembershipTier,
        authModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        loginAsDemoMember,
        logout,
        upgradeModalOpen,
        upgradeHighlightTier,
        upgradeReason,
        openUpgradeModal,
        closeUpgradeModal,
        posts,
        likedPostIds,
        rsvpedPostIds,
        createPost,
        addPostComment,
        toggleLikePost,
        toggleRsvpEvent,
        foodJoints,
        addFoodTip,
        createFoodJoint,
        marketItems,
        inquiries,
        createMarketItem,
        sendMarketInquiry,
        mentors,
        bookings,
        createMentorProfile,
        requestMentorSession,
        dmThreads,
        dmDrawerOpen,
        activeDmThreadId,
        openDmDrawer,
        openDmWithRecipient,
        closeDmDrawer,
        selectDmThread,
        sendDirectMessage,
        resources,
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
}

export function useCommunity() {
  const ctx = useContext(CommunityContext);
  if (!ctx) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return ctx;
}
