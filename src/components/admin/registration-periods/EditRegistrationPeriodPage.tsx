'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Loader from '@/components/ui/Loader';
import { RegistrationPeriod, RegistrationPeriodFormData } from '@/types';
import { getSingleRegistrationPeriod, updateRegistrationPeriod } from '@/server/RegistrationPeriods';
import { RegistrationPeriodForm } from './RegistrationPeriodForm';

interface EditRegistrationPeriodPageProps {
    registrationPeriodId: string;
}

export default function EditRegistrationPeriodPage({ registrationPeriodId }: EditRegistrationPeriodPageProps) {
    const router = useRouter();
    const [period, setPeriod] = useState<RegistrationPeriod | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchPeriod = async () => {
            try {
                const response = await getSingleRegistrationPeriod(registrationPeriodId);
                setPeriod(response);
            } catch (error) {
                console.error(error);
                toast.error('Failed to fetch registration period details');
            } finally {
                setIsLoading(false);
            }
        };
        fetchPeriod();
    }, [registrationPeriodId]);

    const handleSubmit = async (data: RegistrationPeriodFormData) => {
        setIsSaving(true);
        try {
            const response = await updateRegistrationPeriod(registrationPeriodId, data);
            if (response.success) {
                toast.success(response.message);
                setPeriod((current) => current ? { ...current, ...data } : current);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="flex h-96 items-center justify-center"><Loader /></div>;
    }

    if (!period) {
        return (
            <div className="py-12 text-center">
                <p className="mb-4 text-gray-600">Registration period not found</p>
                <button onClick={() => router.push('/admin/registration-periods')} className="rounded-lg bg-[#00284d] px-4 py-2 text-white transition hover:bg-[#003465]">
                    Back to Registration Periods
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={() => router.push('/admin/registration-periods')} className="rounded-lg p-2 transition hover:bg-gray-100" aria-label="Back to registration periods">
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Edit Registration Period</h2>
                    <p className="text-gray-600">{period.name}</p>
                </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
                <h3 className="mb-6 text-lg font-semibold text-gray-900">Registration Period Details</h3>
                <RegistrationPeriodForm
                    key={`${period.id}-${period.startDateUtc}-${period.endDateUtc}`}
                    defaultValues={period}
                    isSaving={isSaving}
                    submitText="Save Changes"
                    onSubmit={handleSubmit}
                    onCancel={() => router.push('/admin/registration-periods')}
                />
            </div>
        </div>
    );
}
