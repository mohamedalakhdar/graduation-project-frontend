import StudentSchedulePage from '@/components/admin/registrations/StudentSchedulePage';

export default async function Page({ params }: { params: Promise<{ studentId: string }> }) {
    const { studentId } = await params;
    return <StudentSchedulePage studentId={studentId} />;
}
