'use client';

import { useEffect, useState } from 'react';
import { Registration } from '@/types';
import { getSingleRegistration } from '@/server/Registrations';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from '@/i18n/IntlProvider';

interface RegistrationDetailsPageProps {
    id: string;
}

export default function RegistrationDetailsPage({ id }: RegistrationDetailsPageProps) {
    const t = useTranslations('Registrations');
    const tc = useTranslations('Common');

    const [registration, setRegistration] = useState<Registration | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRegistration = async () => {
            try {
                setIsLoading(true);
                const data = await getSingleRegistration(id);
                setRegistration(data || null);
            } catch (error) {
                console.error(error);
                toast.error(tc('error'));
                setRegistration(null);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchRegistration();
    }, [id, tc]);

    const getSemesterTranslation = (semesterVal: string) => {
        switch (semesterVal) {
            case 'Fall':
                return t('semesterFall');
            case 'Spring':
                return t('semesterSpring');
            case 'Summer':
                return t('semesterSummer');
            default:
                return semesterVal;
        }
    };

    const getStatusTranslation = (statusVal: string) => {
        switch (statusVal) {
            case 'Pending':
                return t('statusPending');
            case 'Approved':
                return t('statusApproved');
            case 'Dropped':
                return t('statusDropped');
            case 'Withdrawn':
                return t('statusWithdrawn');
            default:
                return statusVal;
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <Link
                    href="/admin/registration"
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#00284d] transition mb-2 text-start"
                >
                    <ArrowLeft size={16} />
                    {t('backToRegistrations')}
                </Link>
                <h2 className="text-3xl font-bold text-gray-900 text-start">{t('detailsTitle')}</h2>
                <p className="mt-1 text-gray-600 text-start">{t('detailsSubtitle', { id })}</p>
            </div>

            {/* Details Card */}
            <div className="bg-white rounded-lg shadow p-6">
                {isLoading ? (
                    <div className="space-y-4 animate-pulse">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="h-4 w-28 bg-gray-200 rounded" />
                                <div className="h-4 w-48 bg-gray-200 rounded" />
                            </div>
                        ))}
                    </div>
                ) : !registration ? (
                    <p className="text-gray-500 text-center py-8">
                        {t('notFound')}
                    </p>
                ) : (
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        <div className="text-start">
                            <dt className="text-sm font-medium text-gray-500">{t('fieldStudent')}</dt>
                            <dd className="mt-1 text-sm text-gray-900 font-semibold">
                                {registration.studentName}
                            </dd>
                        </div>
                        <div className="text-start">
                            <dt className="text-sm font-medium text-gray-500">{t('fieldCourse')}</dt>
                            <dd className="mt-1 text-sm text-gray-900 font-semibold">
                                {registration.courseTitle}{' '}
                                {registration.courseCode ? `(${registration.courseCode})` : ''}
                            </dd>
                        </div>
                        <div className="text-start">
                            <dt className="text-sm font-medium text-gray-500">{t('colStatus')}</dt>
                            <dd className="mt-1">
                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                    {getStatusTranslation(registration.status)}
                                </span>
                            </dd>
                        </div>
                        <div className="text-start">
                            <dt className="text-sm font-medium text-gray-500">{t('fieldSemester')}</dt>
                            <dd className="mt-1 text-sm text-gray-900">{getSemesterTranslation(registration.semester)}</dd>
                        </div>
                        <div className="text-start">
                            <dt className="text-sm font-medium text-gray-500">{t('fieldYear')}</dt>
                            <dd className="mt-1 text-sm text-gray-900">{registration.year}</dd>
                        </div>
                        {registration.advisorName && (
                            <div className="text-start">
                                <dt className="text-sm font-medium text-gray-500">{t('fieldAdvisor')}</dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {registration.advisorName}
                                </dd>
                            </div>
                        )}
                    </dl>
                )}
            </div>
        </div>
    );
}
