import AvailableCoursesPage from '@/components/admin/registrations/AvailableCoursesPage';

export default async function Page({ params }: { params: Promise<{ studentId: string }> }) {
    const { studentId } = await params;
    return <AvailableCoursesPage studentId={studentId} />;
}
