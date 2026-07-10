import EditRegistrationPeriodPage from '@/components/admin/registration-periods/EditRegistrationPeriodPage';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <EditRegistrationPeriodPage registrationPeriodId={id} />;
}
