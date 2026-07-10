import GradeDetailsPage from '@/components/admin/registrations/GradeDetailsPage';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <GradeDetailsPage id={id} />;
}
