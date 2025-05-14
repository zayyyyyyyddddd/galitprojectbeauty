
export type UserRole = 'customer' | 'reseller';
export type ResellerStage = 'brown' | 'silver' | 'gold' | null;

export interface User {
  id: string;
  email: string;
  role: UserRole;
  resellerStage?: ResellerStage;
  approved: boolean;
  createdAt: string;
}
