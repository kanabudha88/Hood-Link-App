import type {
  CommunityPost,
  CurriculumChapter,
  FoodJoint,
  FoodJointStatus,
  LocalResource,
  MarketItem,
  MembershipTier,
  MentorProfile,
  MentorSkillCategory,
  NeighborhoodZone,
  PostCategory,
  ResourceCategory,
} from '../types/community';

export interface PostFilterState {
  category: 'All' | PostCategory;
  zone: 'All Zones' | NeighborhoodZone;
}

// --- Membership Tier & Role Permission Helpers ---

export function canPublishCreatorContent(tier: MembershipTier): boolean {
  return tier === 'Creator' || tier === 'Premium';
}

export function canCommentOnArticles(tier: MembershipTier): boolean {
  return tier === 'Creator' || tier === 'Premium';
}

export function canSendDirectMessages(tier: MembershipTier): boolean {
  return tier === 'Creator' || tier === 'Premium';
}

export function isCurriculumChapterUnlocked(
  chapterNumber: number,
  tier: MembershipTier
): boolean {
  if (tier === 'Premium') return true;
  return chapterNumber >= 1 && chapterNumber <= 6;
}

export function hasVerifiedPremiumBadge(tier?: MembershipTier): boolean {
  return tier === 'Premium';
}

export function buildDefaultCurriculum(specialty: string): CurriculumChapter[] {
  const topic = specialty.trim() || 'Core Practice';
  const titles = [
    `Foundations of ${topic}`,
    'Neighborhood Context & Goal Setting',
    'Essential Tools, Setup & Safety',
    'First Hands-On Walkthrough',
    'Common Mistakes & Quick Fixes',
    'Mini-Project Milestone (Free Preview Finale)',
    'Intermediate Workflows & Time Savers',
    'Budgeting, Sourcing & Local Suppliers',
    'Troubleshooting Real-World Edge Cases',
    'Quality Checks & Peer Review Rubric',
    'Scaling Up for Community Impact',
    'Capstone Review & Next Steps Roadmap',
  ];

  return titles.map((title, index) => {
    const number = index + 1;
    return {
      number,
      title,
      durationLabel: `${15 + (index % 4) * 5} min`,
      summary: `Practical step-by-step lesson covering ${title.toLowerCase()} tailored for Oakwood neighbors.`,
      takeaway: `Checklist item ${number}: Apply today's concept in a 20-minute local exercise.`,
    };
  });
}

// --- Filtering & Search Helpers ---

export function filterCommunityPosts(
  posts: CommunityPost[],
  filters: PostFilterState
): CommunityPost[] {
  return posts.filter((post) => {
    const matchesCategory =
      filters.category === 'All' || post.category === filters.category;
    const matchesZone =
      filters.zone === 'All Zones' || post.zone === filters.zone;
    return matchesCategory && matchesZone;
  });
}

export function filterFoodJoints(
  joints: FoodJoint[],
  statusFilter: 'All' | FoodJointStatus,
  query: string
): FoodJoint[] {
  const normalized = query.trim().toLowerCase();
  return joints.filter((joint) => {
    const matchesStatus =
      statusFilter === 'All' || joint.status === statusFilter;
    if (!matchesStatus) return false;
    if (!normalized) return true;
    const inName = joint.name.toLowerCase().includes(normalized);
    const inCuisine = joint.cuisine.toLowerCase().includes(normalized);
    const inZone = joint.zone.toLowerCase().includes(normalized);
    const inMenu = joint.popularItems.some((item) =>
      item.name.toLowerCase().includes(normalized)
    );
    return inName || inCuisine || inZone || inMenu;
  });
}

export function filterMarketItems(
  items: MarketItem[],
  zoneFilter: 'All Zones' | NeighborhoodZone,
  query: string
): MarketItem[] {
  const normalized = query.trim().toLowerCase();
  return items.filter((item) => {
    const matchesZone =
      zoneFilter === 'All Zones' || item.zone === zoneFilter;
    if (!matchesZone) return false;
    if (!normalized) return true;
    return (
      item.title.toLowerCase().includes(normalized) ||
      item.description.toLowerCase().includes(normalized) ||
      item.sellerName.toLowerCase().includes(normalized)
    );
  });
}

export function filterMentors(
  mentors: MentorProfile[],
  skillFilter: 'All' | MentorSkillCategory,
  query: string
): MentorProfile[] {
  const normalized = query.trim().toLowerCase();
  return mentors.filter((mentor) => {
    const matchesSkill =
      skillFilter === 'All' || mentor.skills.includes(skillFilter);
    if (!matchesSkill) return false;
    if (!normalized) return true;
    return (
      mentor.name.toLowerCase().includes(normalized) ||
      mentor.specialty.toLowerCase().includes(normalized) ||
      mentor.bio.toLowerCase().includes(normalized) ||
      mentor.skills.some((s) => s.toLowerCase().includes(normalized))
    );
  });
}

export function filterResources(
  resources: LocalResource[],
  categoryFilter: 'All' | ResourceCategory,
  query: string
): LocalResource[] {
  const normalized = query.trim().toLowerCase();
  return resources.filter((resource) => {
    const matchesCategory =
      categoryFilter === 'All' || resource.category === categoryFilter;
    if (!matchesCategory) return false;
    if (!normalized) return true;
    return (
      resource.name.toLowerCase().includes(normalized) ||
      resource.description.toLowerCase().includes(normalized) ||
      resource.address.toLowerCase().includes(normalized) ||
      resource.category.toLowerCase().includes(normalized) ||
      resource.zone.toLowerCase().includes(normalized)
    );
  });
}

// --- Validation Helpers ---

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validatePostInput(input: {
  title: string;
  body: string;
  category: PostCategory;
  eventDateLabel?: string;
}): ValidationResult {
  if (input.title.trim().length < 4) {
    return { valid: false, error: 'Please add a headline of at least 4 characters.' };
  }
  if (input.body.trim().length < 10) {
    return { valid: false, error: 'Please write at least 10 characters for your article.' };
  }
  if (input.category === 'Events' && !input.eventDateLabel?.trim()) {
    return { valid: false, error: 'Please enter a date and time for your event.' };
  }
  return { valid: true };
}

export function validateMarketItemInput(input: {
  title: string;
  price: string;
  description: string;
}): ValidationResult {
  if (input.title.trim().length < 3) {
    return { valid: false, error: 'Listing title must be at least 3 characters.' };
  }
  const parsedPrice = Number(input.price);
  if (Number.isNaN(parsedPrice) || parsedPrice < 0 || input.price.trim() === '') {
    return { valid: false, error: 'Please enter a valid non-negative price (0 for free).' };
  }
  if (input.description.trim().length < 10) {
    return { valid: false, error: 'Please add a short description (10+ characters).' };
  }
  return { valid: true };
}

export function validateFoodJointListingInput(input: {
  name: string;
  cuisine: string;
  address: string;
  signatureItem: string;
  signaturePrice: string;
}): ValidationResult {
  if (input.name.trim().length < 3) {
    return { valid: false, error: 'Please enter the food spot or kitchen name.' };
  }
  if (input.cuisine.trim().length < 3) {
    return { valid: false, error: 'Please describe the cuisine or food style.' };
  }
  if (input.address.trim().length < 5) {
    return { valid: false, error: 'Please enter a street address or pickup spot.' };
  }
  if (input.signatureItem.trim().length < 3) {
    return { valid: false, error: 'Please add at least one menu item or special.' };
  }
  const parsed = Number(input.signaturePrice);
  if (Number.isNaN(parsed) || parsed < 0 || input.signaturePrice.trim() === '') {
    return { valid: false, error: 'Please enter a valid menu item price.' };
  }
  return { valid: true };
}

export function validateMentorInput(input: {
  specialty: string;
  bio: string;
  availability: string;
  skills: MentorSkillCategory[];
}): ValidationResult {
  if (input.skills.length === 0) {
    return { valid: false, error: 'Select at least one skill category.' };
  }
  if (input.specialty.trim().length < 4) {
    return { valid: false, error: 'Enter a clear mentoring headline or specialty.' };
  }
  if (input.bio.trim().length < 15) {
    return { valid: false, error: 'Please share a brief bio (at least 15 characters).' };
  }
  if (input.availability.trim().length < 4) {
    return { valid: false, error: 'Specify when you are typically available.' };
  }
  return { valid: true };
}

export function validateBookingInput(input: {
  preferredSlot: string;
  topic: string;
}): ValidationResult {
  if (input.preferredSlot.trim().length < 3) {
    return { valid: false, error: 'Please enter a preferred day or time.' };
  }
  if (input.topic.trim().length < 8) {
    return { valid: false, error: 'Please add a brief note on what you would like help with.' };
  }
  return { valid: true };
}

export function validateAuthInput(input: {
  mode: 'login' | 'register';
  name?: string;
  email: string;
  password: string;
}): ValidationResult {
  if (input.mode === 'register' && (!input.name || input.name.trim().length < 2)) {
    return { valid: false, error: 'Please enter your full name.' };
  }
  const emailTrimmed = input.email.trim();
  if (!emailTrimmed.includes('@') || !emailTrimmed.includes('.')) {
    return { valid: false, error: 'Please enter a valid email address.' };
  }
  if (input.password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters.' };
  }
  return { valid: true };
}

export function validateCommentInput(body: string): ValidationResult {
  if (body.trim().length < 2) {
    return { valid: false, error: 'Please write a comment before posting.' };
  }
  return { valid: true };
}

export function validateDmInput(text: string): ValidationResult {
  if (text.trim().length < 2) {
    return { valid: false, error: 'Please enter a message to send.' };
  }
  return { valid: true };
}

export function formatCurrency(amount: number): string {
  if (amount === 0) return 'Free';
  return `$${amount.toFixed(amount % 1 === 0 ? 0 : 2)}`;
}
