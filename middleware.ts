import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: ['/', '/pricing', '/contact', '/api/stripe/webhook']
});

export const config = {
  matcher: ['/((?!_next|.*\..*).*)']
};