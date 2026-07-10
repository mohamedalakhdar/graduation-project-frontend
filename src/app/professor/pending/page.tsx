import { cookies } from 'next/headers';
import ProfessorPendingPage from '@/components/professor/ProfessorPendingPage';
// import { getFacultyIdentityFromToken } from '@/server/FacultyAction';
import { verifyToken } from '@/utils/verifyToken';

export default async function Page() {
    const cookieStore = await cookies();
    const token = cookieStore.get('jwt')?.value || '';
    const decoded = verifyToken(token);
    // const faculty = await getFacultyIdentityFromToken(decoded);

    return <ProfessorPendingPage advisorId={decoded?.uid || ''} />;
}
