
export enum FeedbackRating {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  AVERAGE = 'average',
  POOR = 'poor'
}

export interface Customer {
  name: string;
  cardNumber: string;
}

export interface Feedback {
  id: string;
  rating: FeedbackRating;
  npsScore: number;
  comment?: string;
  timestamp: Date;
  storeLocation: string;
  customer?: Customer;
}

export interface StoreStats {
  location: string;
  totalCustomers: number;
  averageSatisfaction: number;
  peakHour: string;
}

export type ViewType = 'welcome' | 'kiosk' | 'dashboard';
