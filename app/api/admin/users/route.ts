import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getProfile } from '@/lib/data/profiles';
import { hasAdminRole } from '@/lib/auth/roles';
import { getAdminUsers } from '@/lib/data/dashboard';

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const profile = await getProfile(userId);
  if (!hasAdminRole(profile?.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const users = await getAdminUsers();
  return NextResponse.json({ users });
}