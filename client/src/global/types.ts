export interface UserType {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatarUrl?: string;
  location?: string;
  website?: string;
  bio?: string;
}

export interface AnnotationType {
  orderNumber: number;
  text: string;
}

export interface GuideStepType {
  code: string;
  annotations: string[];
}

export interface GuideType {
  _id: string;
  owner: string;
  title: string;
  description: string;
  steps: GuideStepType[];
  language: string;
  concepts: string[];
  createdAt: string;
  updatedAt: string;
}
