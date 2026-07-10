/**
 * Admin Layout
 * Wraps all admin routes with the AdminLayout component
 */

import { ReactNode } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { verifyToken } from '@/utils/verifyToken';
import { cookies } from 'next/headers';

export default async function AdminGroupLayout({
  children,
}: {
  children: ReactNode;
}) {
  // get token from cookies
  const cookieStore = await cookies()
  const token = cookieStore.get('jwt')?.value || "";

  const decoded = verifyToken(token);

  return <AdminLayout decoded={decoded}>{children}</AdminLayout>;
}
