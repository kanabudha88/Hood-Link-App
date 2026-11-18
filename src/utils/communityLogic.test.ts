import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildDefaultCurriculum,
  canCommentOnArticles,
  canPublishCreatorContent,
  canSendDirectMessages,
  filterCommunityPosts,
  filterFoodJoints,
  filterMarketItems,
  filterMentors,
  filterResources,
  formatCurrency,
  hasVerifiedPremiumBadge,
  isCurriculumChapterUnlocked,
  validateAuthInput,
  validateBookingInput,
  validateCommentInput,
  validateDmInput,
  validateFoodJointListingInput,
  validateMarketItemInput,
  validateMentorInput,
  validatePostInput,
} from './communityLogic';
import {
  INITIAL_FOOD_JOINTS,
  INITIAL_MARKET_ITEMS,
  INITIAL_MENTORS,
  INITIAL_POSTS,
  INITIAL_RESOURCES,
} from '../data/seedData';

test('tier permission helpers enforce Free vs Creator vs Premium access', () => {
  assert.equal(canPublishCreatorContent('Free'), false);
  assert.equal(canPublishCreatorContent('Creator'), true);
  assert.equal(canPublishCreatorContent('Premium'), true);

  assert.equal(canCommentOnArticles('Free'), false);
  assert.equal(canCommentOnArticles('Creator'), true);
  assert.equal(canCommentOnArticles('Premium'), true);

  assert.equal(canSendDirectMessages('Free'), false);
  assert.equal(canSendDirectMessages('Creator'), true);
  assert.equal(canSendDirectMessages('Premium'), true);

  assert.equal(hasVerifiedPremiumBadge('Free'), false);
  assert.equal(hasVerifiedPremiumBadge('Creator'), false);
  assert.equal(hasVerifiedPremiumBadge('Premium'), true);
});

test('12-chapter mentorship curriculum locks chapters 7-12 for Free & Creator and unlocks all 12 for Premium', () => {
  const chapters = buildDefaultCurriculum('Woodworking');
  assert.equal(chapters.length, 12);

  for (let ch = 1; ch <= 6; ch++) {
    assert.equal(isCurriculumChapterUnlocked(ch, 'Free'), true);
    assert.equal(isCurriculumChapterUnlocked(ch, 'Creator'), true);
    assert.equal(isCurriculumChapterUnlocked(ch, 'Premium'), true);
  }

  for (let ch = 7; ch <= 12; ch++) {
    assert.equal(isCurriculumChapterUnlocked(ch, 'Free'), false);
    assert.equal(isCurriculumChapterUnlocked(ch, 'Creator'), false);
    assert.equal(isCurriculumChapterUnlocked(ch, 'Premium'), true);
  }
});

test('filterCommunityPosts filters by category and zone accurately', () => {
  const all = filterCommunityPosts(INITIAL_POSTS, {
    category: 'All',
    zone: 'All Zones',
  });
  assert.equal(all.length, INITIAL_POSTS.length);

  const eastsideEvents = filterCommunityPosts(INITIAL_POSTS, {
    category: 'Events',
    zone: 'Eastside',
  });
  assert.equal(eastsideEvents.length, 1);
  assert.equal(eastsideEvents[0].zone, 'Eastside');
  assert.equal(eastsideEvents[0].category, 'Events');

  const westsideNews = filterCommunityPosts(INITIAL_POSTS, {
    category: 'News',
    zone: 'Westside',
  });
  assert.equal(westsideNews.length, 1);
  assert.equal(westsideNews[0].id, 'post-5');
});

test('filterFoodJoints filters by status and menu search query', () => {
  const openJoints = filterFoodJoints(
    INITIAL_FOOD_JOINTS,
    'Open - Fresh Food Ready',
    ''
  );
  assert.equal(openJoints.length, 2);

  const sourdoughResults = filterFoodJoints(
    INITIAL_FOOD_JOINTS,
    'All',
    'sourdough'
  );
  assert.equal(sourdoughResults.length, 1);
  assert.equal(sourdoughResults[0].name, 'Flour & Stone Bakery');
});

test('filterMarketItems filters by zone and keyword', () => {
  const centralBike = filterMarketItems(
    INITIAL_MARKET_ITEMS,
    'Central',
    'bicycle'
  );
  assert.equal(centralBike.length, 1);
  assert.equal(centralBike[0].id, 'mkt-1');

  const wrongZone = filterMarketItems(
    INITIAL_MARKET_ITEMS,
    'Westside',
    'bicycle'
  );
  assert.equal(wrongZone.length, 0);
});

test('filterMentors filters by skill category and text query', () => {
  const techMentors = filterMentors(INITIAL_MENTORS, 'Tech', '');
  assert.equal(techMentors.length, 1);
  assert.equal(techMentors[0].name, 'Rachel Chen');

  const grantSearch = filterMentors(INITIAL_MENTORS, 'All', 'grant');
  assert.equal(grantSearch.length, 1);
  assert.equal(grantSearch[0].name, 'Dr. Samuel Osei');
});

test('filterResources filters by category and address/keyword search', () => {
  const healthResources = filterResources(INITIAL_RESOURCES, 'Health', '');
  assert.equal(healthResources.length, 2);

  const plumbingSearch = filterResources(INITIAL_RESOURCES, 'All', 'Linden');
  assert.equal(plumbingSearch.length, 1);
  assert.equal(plumbingSearch[0].name, 'Vela Plumbing & Pipe Repair');
});

test('validation helpers reject invalid/empty fields and accept valid inputs', () => {
  assert.equal(
    validatePostInput({
      title: 'Hi',
      body: 'Short',
      category: 'News',
    }).valid,
    false
  );
  assert.equal(
    validatePostInput({
      title: 'Block Party',
      body: 'Join us on Maple Street for dinner.',
      category: 'Events',
      eventDateLabel: 'Sunday 5 PM',
    }).valid,
    true
  );

  assert.equal(
    validateMarketItemInput({
      title: 'Lamp',
      price: '-5',
      description: 'Warm bedside reading lamp in brass.',
    }).valid,
    false
  );
  assert.equal(
    validateMarketItemInput({
      title: 'Lamp',
      price: '0',
      description: 'Warm bedside reading lamp in brass.',
    }).valid,
    true
  );

  assert.equal(
    validateFoodJointListingInput({
      name: 'Ab',
      cuisine: 'Grill',
      address: '123 Main',
      signatureItem: 'Burger',
      signaturePrice: '9',
    }).valid,
    false
  );
  assert.equal(
    validateFoodJointListingInput({
      name: 'Oak Grill',
      cuisine: 'Wood-Fired Sandwiches',
      address: '210 Main St',
      signatureItem: 'Smoked Brisket Melt',
      signaturePrice: '13',
    }).valid,
    true
  );

  assert.equal(validateCommentInput(' ').valid, false);
  assert.equal(validateCommentInput('Great tip!').valid, true);
  assert.equal(validateDmInput('').valid, false);
  assert.equal(validateDmInput('Hi, is this still available?').valid, true);

  assert.equal(
    validateMentorInput({
      skills: [],
      specialty: 'Resume Help',
      bio: 'Ten years in recruiting.',
      availability: 'Weekends',
    }).valid,
    false
  );
  assert.equal(
    validateBookingInput({ preferredSlot: 'Fri', topic: 'Help' }).valid,
    false
  );
  assert.equal(
    validateAuthInput({
      mode: 'register',
      name: 'A',
      email: 'bad-email',
      password: '123',
    }).valid,
    false
  );
});

test('formatCurrency formats free and numeric amounts cleanly', () => {
  assert.equal(formatCurrency(0), 'Free');
  assert.equal(formatCurrency(7), '$7');
  assert.equal(formatCurrency(9.5), '$9.50');
});
