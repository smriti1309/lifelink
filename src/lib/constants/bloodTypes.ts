export const BLOOD_TYPES = {
  A_PLUS: 'A_PLUS',
  A_MINUS: 'A_MINUS',
  B_PLUS: 'B_PLUS',
  B_MINUS: 'B_MINUS',
  AB_PLUS: 'AB_PLUS',
  AB_MINUS: 'AB_MINUS',
  O_PLUS: 'O_PLUS',
  O_MINUS: 'O_MINUS',
} as const;

export type BloodType = typeof BLOOD_TYPES[keyof typeof BLOOD_TYPES];

export const BLOOD_TYPE_LABELS: Record<BloodType, string> = {
  A_PLUS: 'A+',
  A_MINUS: 'A-',
  B_PLUS: 'B+',
  B_MINUS: 'B-',
  AB_PLUS: 'AB+',
  AB_MINUS: 'AB-',
  O_PLUS: 'O+',
  O_MINUS: 'O-',
};

export const BLOOD_TYPES_LIST = Object.values(BLOOD_TYPES);

// Compatible donor groups: Who can give blood to a patient of this blood type
export const COMPATIBLE_DONORS: Record<BloodType, BloodType[]> = {
  A_PLUS: ['A_PLUS', 'A_MINUS', 'O_PLUS', 'O_MINUS'],
  A_MINUS: ['A_MINUS', 'O_MINUS'],
  B_PLUS: ['B_PLUS', 'B_MINUS', 'O_PLUS', 'O_MINUS'],
  B_MINUS: ['B_MINUS', 'O_MINUS'],
  AB_PLUS: ['A_PLUS', 'A_MINUS', 'B_PLUS', 'B_MINUS', 'AB_PLUS', 'AB_MINUS', 'O_PLUS', 'O_MINUS'],
  AB_MINUS: ['A_MINUS', 'B_MINUS', 'AB_MINUS', 'O_MINUS'],
  O_PLUS: ['O_PLUS', 'O_MINUS'],
  O_MINUS: ['O_MINUS'],
};

// Compatible recipient groups: Who can receive blood from a donor of this blood type
export const COMPATIBLE_RECIPIENTS: Record<BloodType, BloodType[]> = {
  A_PLUS: ['A_PLUS', 'AB_PLUS'],
  A_MINUS: ['A_PLUS', 'A_MINUS', 'AB_PLUS', 'AB_MINUS'],
  B_PLUS: ['B_PLUS', 'AB_PLUS'],
  B_MINUS: ['B_PLUS', 'B_MINUS', 'AB_PLUS', 'AB_MINUS'],
  AB_PLUS: ['AB_PLUS'],
  AB_MINUS: ['AB_PLUS', 'AB_MINUS'],
  O_PLUS: ['A_PLUS', 'B_PLUS', 'AB_PLUS', 'O_PLUS'],
  O_MINUS: ['A_PLUS', 'A_MINUS', 'B_PLUS', 'B_MINUS', 'AB_PLUS', 'AB_MINUS', 'O_PLUS', 'O_MINUS'],
};
