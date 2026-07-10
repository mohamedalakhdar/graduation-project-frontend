import EditCourseOfferingPage from '@/components/admin/course-offering/EditCourseOfferingPage';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <EditCourseOfferingPage courseOfferingId={id} />;
}
