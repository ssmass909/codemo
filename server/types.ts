// This types might be more useful on the client-side. but for now, i will leave it here.

// One step can have multiple annotations.
// This is because the presenter might want to emphesize different points for each step

export interface AnnotationType {
  orderNumber: number;
  text: string;
}

// I am using MongoDB, so GuideStep documents will be nested inside Guide Document, no uuid needed.
export interface GuideStepType {
  code: string;
  annotations: string[];
}

export interface GuideType {
  id: string;
  owner: string; // user's id
  title: string;
  description: string;
  steps: GuideStepType[];
  language: string;
  concepts: string[];
}

export interface UserType {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  location?: string;
  website?: string;
  bio?: string;
}
