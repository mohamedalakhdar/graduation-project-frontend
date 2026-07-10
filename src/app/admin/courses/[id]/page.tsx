import EditCoursePage from '@/components/admin/courses/EditCoursePage';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return <EditCoursePage courseId={id} />;
}
