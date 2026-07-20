export interface AboutTimelineStep {
  step: number;
  title: string;
  description: string;
  icon: 'file-text' | 'bell' | 'phone-call' | 'check-circle';
}

export interface AboutCoreValue {
  id: string;
  title: string;
  description: string;
  icon: 'heart' | 'shield-check' | 'zap' | 'users' | 'award';
}

export interface AboutWhyChooseItem {
  id: string;
  title: string;
  description: string;
}

export interface AboutImpactMetric {
  id: string;
  label: string;
  value: string;
  description: string;
  isDemo?: boolean;
}

export const STORY_HIGHLIGHTS = [
  {
    title: 'Emergency Delays Cost Lives',
    description:
      'During medical emergencies, families often waste crucial hours calling distant contacts, posting unverified messages on social media, or visiting blood banks one by one.',
  },
  {
    title: 'Difficulty Finding Matching Donors',
    description:
      'Locating compatible donors in specific geographic locations under strict time constraints is difficult without a structured, verified network.',
  },
  {
    title: 'Technology-Driven Coordination',
    description:
      'LifeLink bridges this gap by providing an instant, automated alert and donor-matching framework that connects blood seekers with available local donors in real time.',
  },
];

export const MISSION_HIGHLIGHTS = [
  'Reduce response times for urgent blood and replacement donor needs.',
  'Empower communities through voluntary, non-remunerated blood donation.',
  'Ensure donor privacy and transparent request fulfillment tracking.',
  'Standardize emergency coordination across local healthcare networks.',
];

export const HOW_LIFELINK_WORKS: AboutTimelineStep[] = [
  {
    step: 1,
    title: 'Create Emergency Request',
    description:
      'Seekers specify required blood type, hospital location, required units or replacement count, and urgency.',
    icon: 'file-text',
  },
  {
    step: 2,
    title: 'Notify Compatible Donors',
    description:
      'LifeLink automatically identifies eligible local donors with compatible blood types and sends instant request alerts.',
    icon: 'bell',
  },
  {
    step: 3,
    title: 'Coordinate Donation',
    description:
      'When a donor accepts, the requester receives direct contact details to coordinate hospital arrival and donation.',
    icon: 'phone-call',
  },
  {
    step: 4,
    title: 'Confirm & Impact Lives',
    description:
      'After donation is completed at the blood bank, the requester confirms it, updating donor stats and eligibility.',
    icon: 'check-circle',
  },
];

export const CORE_VALUES: AboutCoreValue[] = [
  {
    id: 'compassion',
    title: 'Compassion',
    description:
      'Every donation has the potential to save a human life and support a family in their moment of greatest need.',
    icon: 'heart',
  },
  {
    id: 'trust',
    title: 'Trust',
    description:
      'Secure coordination, verified request tracking, and responsible handling of sensitive contact information.',
    icon: 'shield-check',
  },
  {
    id: 'accessibility',
    title: 'Accessibility',
    description:
      'Helping communities access life-saving blood donors quickly and effortlessly during critical emergencies.',
    icon: 'zap',
  },
  {
    id: 'community',
    title: 'Community',
    description:
      'Encouraging voluntary blood donation, mutual civic support, and a culture of social responsibility.',
    icon: 'users',
  },
  {
    id: 'reliability',
    title: 'Reliability',
    description:
      'Providing a dependable, high-availability platform for emergency coordination whenever crisis strikes.',
    icon: 'award',
  },
];

export const WHY_CHOOSE_ITEMS: AboutWhyChooseItem[] = [
  {
    id: 'fast-coord',
    title: 'Fast Emergency Coordination',
    description: 'Instant notification dispatch to nearby registered donors.',
  },
  {
    id: 'donor-matching',
    title: 'Compatible Donor Matching',
    description: 'Algorithmic filtering based on biological blood group compatibility.',
  },
  {
    id: 'eligibility-mgmt',
    title: 'Donation Eligibility Management',
    description: 'Automated 3-month deferral tracking to protect donor health.',
  },
  {
    id: 'verified-workflows',
    title: 'Verified Workflows',
    description: 'Requester confirmation flow ensuring completed donation accountability.',
  },
  {
    id: 'privacy-first',
    title: 'Privacy-First Approach',
    description: 'Contact phone numbers remain private until a donor accepts a request.',
  },
  {
    id: 'responsive-design',
    title: 'Responsive Across Devices',
    description: 'Seamless experience on mobile phones, tablets, and desktop computers.',
  },
  {
    id: 'secure-auth',
    title: 'Secure Authentication',
    description: 'Robust user account management and data protection.',
  },
  {
    id: 'modern-ux',
    title: 'Modern User Experience',
    description: 'Intuitive, accessible, and fast interface built for high-stress situations.',
  },
];

export const IMPACT_METRICS: AboutImpactMetric[] = [
  {
    id: 'requests',
    label: 'Emergency Requests Coordinated',
    value: '500+',
    description: 'Urgent requests broadcasted across local donor networks.',
    isDemo: true,
  },
  {
    id: 'donors',
    label: 'Registered Volunteer Donors',
    value: '1,200+',
    description: 'Active donors ready to respond in emergency situations.',
    isDemo: true,
  },
  {
    id: 'communities',
    label: 'Communities Supported',
    value: '50+',
    description: 'Districts and regions connected through voluntary donation.',
    isDemo: true,
  },
  {
    id: 'donations',
    label: 'Successful Confirmed Donations',
    value: '450+',
    description: 'Completed donations logged and verified on LifeLink.',
    isDemo: true,
  },
];
