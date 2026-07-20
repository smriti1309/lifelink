export type FAQCategoryId =
  | 'general'
  | 'donors'
  | 'requests'
  | 'process'
  | 'privacy'
  | 'technical';

export interface FAQCategory {
  id: FAQCategoryId;
  title: string;
  description: string;
}

export interface FAQItem {
  id: string;
  categoryId: FAQCategoryId;
  question: string;
  answer: string;
}

export interface FAQTopic {
  label: string;
  query: string;
  categoryId?: FAQCategoryId;
}

export const FAQ_CATEGORIES: FAQCategory[] = [
  {
    id: 'general',
    title: 'General',
    description: 'Learn about LifeLink, our mission, and basic platform features.',
  },
  {
    id: 'donors',
    title: 'Blood Donors',
    description: 'Eligibility criteria, donation availability, and donor deferral rules.',
  },
  {
    id: 'requests',
    title: 'Emergency Requests',
    description: 'Creating, managing, and fulfilling emergency and replacement blood requests.',
  },
  {
    id: 'process',
    title: 'Donation Process',
    description: 'What happens after donor acceptance, hospital coordination, and confirmation.',
  },
  {
    id: 'privacy',
    title: 'Privacy & Safety',
    description: 'How your personal data, contact information, and medical privacy are protected.',
  },
  {
    id: 'technical',
    title: 'Technical Support',
    description: 'Troubleshooting request notifications, system responses, and account eligibility.',
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  // GENERAL
  {
    id: 'gen-1',
    categoryId: 'general',
    question: 'What is LifeLink?',
    answer:
      'LifeLink is an emergency blood coordination platform that connects blood seekers with eligible blood donors during emergencies and replacement donation requests.',
  },
  {
    id: 'gen-2',
    categoryId: 'general',
    question: 'Is LifeLink free?',
    answer: 'Yes. LifeLink is completely free for donors and blood seekers.',
  },
  {
    id: 'gen-3',
    categoryId: 'general',
    question: 'Who can use LifeLink?',
    answer: 'Anyone can register as a donor or create emergency blood requests.',
  },

  // BLOOD DONORS
  {
    id: 'donor-1',
    categoryId: 'donors',
    question: 'Who can become a donor?',
    answer: 'Anyone meeting the age, health and donation eligibility requirements.',
  },
  {
    id: 'donor-2',
    categoryId: 'donors',
    question: 'Why am I temporarily unavailable?',
    answer:
      'After a successful donation, donors are temporarily deferred until they become eligible again.',
  },
  {
    id: 'donor-3',
    categoryId: 'donors',
    question: 'Can I change my availability?',
    answer: 'Yes. Donors can update their availability from their dashboard.',
  },
  {
    id: 'donor-4',
    categoryId: 'donors',
    question: 'Can I receive multiple requests?',
    answer:
      'Yes, but after a confirmed donation your remaining pending requests are automatically closed until you become eligible again.',
  },

  // EMERGENCY REQUESTS
  {
    id: 'req-1',
    categoryId: 'requests',
    question: 'How do I request blood?',
    answer:
      'Create an emergency request with blood group, hospital details, urgency and contact information.',
  },
  {
    id: 'req-2',
    categoryId: 'requests',
    question: 'What is a replacement donor?',
    answer:
      'A replacement donor donates blood to replenish blood bank inventory after someone receives blood.',
  },
  {
    id: 'req-3',
    categoryId: 'requests',
    question: 'Can I edit or cancel my request?',
    answer: 'Yes, while the request is active and not yet fulfilled.',
  },

  // DONATION PROCESS
  {
    id: 'proc-1',
    categoryId: 'process',
    question: 'What happens after a donor accepts?',
    answer:
      "The requester receives the donor's contact information to coordinate the donation.",
  },
  {
    id: 'proc-2',
    categoryId: 'process',
    question: 'How is a donation confirmed?',
    answer:
      'After the blood donation is completed, the requester confirms it through LifeLink.',
  },
  {
    id: 'proc-3',
    categoryId: 'process',
    question: 'Why is confirmation important?',
    answer:
      'It updates donor eligibility, donation history and prevents duplicate commitments.',
  },

  // PRIVACY & SAFETY
  {
    id: 'priv-1',
    categoryId: 'privacy',
    question: 'When is my phone number shared?',
    answer: 'Contact details are shared only after a donor accepts a request.',
  },
  {
    id: 'priv-2',
    categoryId: 'privacy',
    question: 'How is my personal information protected?',
    answer:
      'Personal information is securely stored and only shared when required for coordinating donations.',
  },
  {
    id: 'priv-3',
    categoryId: 'privacy',
    question: 'Are donors verified?',
    answer: 'LifeLink supports donor verification to improve trust and safety.',
  },

  // TECHNICAL SUPPORT
  {
    id: 'tech-1',
    categoryId: 'technical',
    question: "Why can't I respond to a request?",
    answer: 'You may be temporarily ineligible after recently donating blood.',
  },
  {
    id: 'tech-2',
    categoryId: 'technical',
    question: 'What does "Donation Window Closed" mean?',
    answer:
      'This means the request is no longer actionable because you recently completed a donation or the request is no longer active.',
  },
  {
    id: 'tech-3',
    categoryId: 'technical',
    question: 'I accidentally declined a request.',
    answer:
      'Declined requests cannot be restored, but you will continue receiving future requests when eligible.',
  },
];

export const POPULAR_FAQ_TOPICS: FAQTopic[] = [
  { label: 'Donor Eligibility', query: 'eligibility', categoryId: 'donors' },
  { label: 'Emergency Requests', query: 'request', categoryId: 'requests' },
  { label: 'Replacement Donors', query: 'replacement', categoryId: 'requests' },
  { label: 'Privacy', query: 'privacy', categoryId: 'privacy' },
  { label: 'Donation Confirmation', query: 'confirmation', categoryId: 'process' },
];

export const FAQ_SEARCH_SUGGESTIONS: string[] = [
  'donor',
  'blood request',
  'eligibility',
  'privacy',
];
