import { cookies } from 'next/headers';
import ProfessorStudentsPage from '@/components/admin/professors/ProfessorStudentsPage';
// import { getFacultyIdentityFromToken } from '@/server/FacultyAction';
import { verifyToken } from '@/utils/verifyToken';

export default async function Page() {
    const cookieStore = await cookies();
    const token = cookieStore.get('jwt')?.value || '';
    const decoded = verifyToken(token);
    // const faculty = await getFacultyIdentityFromToken(decoded);

    return (
        <ProfessorStudentsPage
            professorId={decoded?.uid || ''}
            professorName={decoded?.email}
            backHref=""
        />
    );
}
