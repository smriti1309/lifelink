export const DONOR_STATUS = {
  AVAILABLE: 'AVAILABLE',
  TEMPORARILY_UNAVAILABLE: 'TEMPORARILY_UNAVAILABLE',
} as const;

export type DonorStatus = typeof DONOR_STATUS[keyof typeof DONOR_STATUS];

export const REQUEST_STATUS = {
  ACTIVE: 'ACTIVE',
  FULFILLED: 'FULFILLED',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED',
} as const;

export type RequestStatus = typeof REQUEST_STATUS[keyof typeof REQUEST_STATUS];

export const REQUEST_URGENCY = {
  IMMEDIATE: 'IMMEDIATE',
  URGENT: 'URGENT',
  NORMAL: 'NORMAL',
} as const;

export type RequestUrgency = typeof REQUEST_URGENCY[keyof typeof REQUEST_URGENCY];

export const DONOR_STATUS_LABELS: Record<DonorStatus, string> = {
  AVAILABLE: 'Available',
  TEMPORARILY_UNAVAILABLE: 'Temporarily Unavailable',
};

export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  ACTIVE: 'Active',
  FULFILLED: 'Fulfilled',
  CANCELLED: 'Cancelled',
  EXPIRED: 'Expired',
};

export const REQUEST_URGENCY_LABELS: Record<RequestUrgency, string> = {
  IMMEDIATE: 'Immediate (Critical)',
  URGENT: 'Urgent',
  NORMAL: 'Normal',
};
