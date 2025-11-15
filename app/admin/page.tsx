import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { AdminShell } from '@/components/layouts/admin-shell';
import { AdminUserTable } from '@/components/dashboard/admin-user-table';
import { getProfile } from '@/lib/data/profiles';
import { hasAdminRole } from '@/lib/auth/roles';
import { getAdminUsers } from '@/lib/data/dashboard';

export default async function AdminPage() {
  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const profile = await getProfile(user.id);
  if (!hasAdminRole(profile?.role)) {
    redirect('/dashboard');
  }

  const users = await getAdminUsers();

  return (
    <AdminShell title="Console Administrativo">
      <AdminUserTable users={users.map((row) => ({
        id: row.id,
        email: row.email,
        role: row.role,
        subscriptionStatus: row.subscription_status ?? 'unknown',
        uploadedDocuments: row.documents_uploaded ?? 0
      }))} />
    </AdminShell>
  );
}