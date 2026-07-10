import { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { ProfessorLayout } from '@/components/professor/ProfessorLayout';
import { verifyToken } from '@/utils/verifyToken';

export default async function ProfessorGroupLayout({
    children,
}: {
    children: ReactNode;
}) {
    const cookieStore = await cookies();
    const token = cookieStore.get('jwt')?.value || '';
    const decoded = verifyToken(token);

    return <ProfessorLayout decoded={decoded}>{children}</ProfessorLayout>;
}
