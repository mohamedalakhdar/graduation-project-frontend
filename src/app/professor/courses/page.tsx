import { cookies } from 'next/headers';
import ProfessorCoursesPage from '@/components/admin/professors/ProfessorCoursesPage';
import { verifyToken } from '@/utils/verifyToken';

export default async function Page() {
    const cookieStore = await cookies();
    const token = cookieStore.get('jwt')?.value || '';
    const decoded = verifyToken(token);
    const professorId = decoded?.uid || "";

    return (
        <ProfessorCoursesPage
            professorId={professorId}
            professorName={decoded?.email || ''}
            backHref="/professor/dashboard"
        />
    );
}
