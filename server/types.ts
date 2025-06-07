// One step can have multiple annotations.
// This is because the presenter might want to emphesize different points for each step

interface Annotation {
  orderNumber: number;
  text: string;
}

// I am using MongoDB, so GuideStep documents will be nested inside Guide Document, no uuid needed.
interface GuideStep {
  code: string;
  annotations: string[];
}

interface Guide {
  id: string;
  owner: string; // user's id
  title: string;
  description: string;
  steps: GuideStep[];
  language: string;
  concepts: string[];
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  location?: string;
  website?: string;
  bio?: string;
}
