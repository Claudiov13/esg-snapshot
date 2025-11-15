export type UserRole = 'user' | 'admin';

export function hasAdminRole(role?: string | null) {
  return role === 'admin';
}

export function isPaidPlan(status?: string | null) {
  return status === 'active' || status === 'trialing';
}
