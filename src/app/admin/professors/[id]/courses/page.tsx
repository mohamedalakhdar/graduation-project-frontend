import ProfessorCoursesPage from '@/components/admin/professors/ProfessorCoursesPage';
import { getSingleFacultyMember } from '@/server/FacultyAction';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const professor = await getSingleFacultyMember(id);

    return <ProfessorCoursesPage professorId={id} professorName={professor?.name} />;
}
