/**
 * Domain types structured to align 1:1 with future Firebase Firestore collections.
 * Every entity carries a stable string `id` and ISO `createdAt` timestamp.
 */

export type MainTab = 'pulse' | 'eats-market' | 'mentoring' | 'directory';

export type EatsSubTab = 'food-joints' | 'market';

export type NeighborhoodZone = 'Central' | 'Eastside' | 'Westside';

export type PostCategory = 'News' | 'General Info' | 'Events';

export type FoodJointStatus = 'Open - Fresh Food Ready' | 'Busy' | 'Closed';

export type MentorSkillCategory = 'Business' | 'Tech' | 'Trades' | 'Academics';

export type ResourceCategory =
  | 'Health'
  | 'Utilities'
  | 'Artisans'
  | 'Community Centers'
  | 'Emergency';

export type MembershipTier = 'Free' | 'Creator' | 'Premium';

export interface MemberProfile {
  id: string;
  name: string;
  email: string;
  zone: NeighborhoodZone;
  role: string;
  tier: MembershipTier;
  joinedAt: string;
}

export interface PostComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorTier: MembershipTier;
  body: string;
  createdAt: string;
  timeLabel: string;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  authorTier?: MembershipTier;
  isCreatorArticle?: boolean;
  category: PostCategory;
  zone: NeighborhoodZone;
  title: string;
  body: string;
  createdAt: string;
  timeLabel: string;
  likesCount: number;
  rsvpCount?: number;
  eventDateLabel?: string;
  eventLocation?: string;
  imageUrl?: string;
  imageAlt?: string;
  comments: PostComment[];
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  note?: string;
}

export interface FoodTip {
  id: string;
  authorName: string;
  text: string;
  timeLabel: string;
}

export interface FoodJoint {
  id: string;
  ownerId?: string;
  ownerName?: string;
  name: string;
  cuisine: string;
  zone: NeighborhoodZone;
  address: string;
  hours: string;
  status: FoodJointStatus;
  imageUrl?: string;
  imageAlt: string;
  popularItems: MenuItem[];
  tips: FoodTip[];
}

export interface MarketItem {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerTier?: MembershipTier;
  listingKind?: 'Product' | 'Service';
  zone: NeighborhoodZone;
  title: string;
  price: number;
  condition: string;
  description: string;
  createdAt: string;
  timeLabel: string;
  imageUrl?: string;
  imageAlt: string;
}

export interface CurriculumChapter {
  number: number;
  title: string;
  durationLabel: string;
  summary: string;
  takeaway: string;
}

export interface MentorProfile {
  id: string;
  userId: string;
  name: string;
  tier?: MembershipTier;
  zone: NeighborhoodZone;
  skills: MentorSkillCategory[];
  specialty: string;
  bio: string;
  availability: string;
  sessionFormat: 'In-person or Video' | 'In-person' | 'Video Call';
  createdAt: string;
  chapters: CurriculumChapter[];
}

export interface MentorBooking {
  id: string;
  mentorId: string;
  mentorName: string;
  requesterId: string;
  requesterName: string;
  preferredSlot: string;
  topic: string;
  createdAt: string;
}

export interface MarketInquiry {
  id: string;
  itemId: string;
  itemTitle: string;
  senderName: string;
  message: string;
  createdAt: string;
}

export interface DirectMessageEntry {
  id: string;
  senderName: string;
  isSelf: boolean;
  text: string;
  timeLabel: string;
}

export interface DmThread {
  id: string;
  recipientId: string;
  recipientName: string;
  recipientRole: string;
  recipientTier?: MembershipTier;
  contextLabel: string;
  messages: DirectMessageEntry[];
  updatedAt: string;
}

export interface LocalResource {
  id: string;
  name: string;
  category: ResourceCategory;
  zone: NeighborhoodZone;
  description: string;
  phone: string;
  emailOrHandle: string;
  address: string;
  hours: string;
  coordinatesLabel: string;
}
