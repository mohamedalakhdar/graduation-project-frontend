import ProfessorStudentsPage from '@/components/admin/professors/ProfessorStudentsPage';
import { getSingleFacultyMember } from '@/server/FacultyAction';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const professor = await getSingleFacultyMember(id);

    return <ProfessorStudentsPage professorId={id} professorName={professor?.name} />;
}
