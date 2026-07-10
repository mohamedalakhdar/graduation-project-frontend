'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { CheckCircle2, ClipboardList } from 'lucide-react';
import { ConfirmationDialog } from '@/components/admin/modals/ConfirmationDialog';
import { getPendingRegistrations } from '@/server/Registrations';
import { approveRegistration } from '@/server/Registrations';
import { useLocale, useTranslations } from '@/i18n/IntlProvider';

type PendingRegistration = {
    registrationId: string;
    studentId: string;
    studentName: string;
    academicNumber: string;
    courseCode: string;
    courseTitle: string;
    status: string;
    term: 'Fall' | 'Spring' | 'Summer' | string;
    year: number;
    requestDate: string;
};

interface ProfessorPendingPageProps {
    advisorId: string;
}

export default function ProfessorPendingPage({ advisorId }: ProfessorPendingPageProps) {
    const t = useTranslations('Professor');
    const tc = useTranslations('Common');
    const locale = useLocale();
    const router = useRouter();
    const [registrations, setRegistrations] = useState<PendingRegistration[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [approveConfirmation, setApproveConfirmation] = useState<{
        isOpen: boolean;
        registration: PendingRegistration | null;
    }>({ isOpen: false, registration: null });
    const [isApproving, setIsApproving] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await getPendingRegistrations(advisorId);
            if (data && typeof data === 'object' && 'success' in data && data.success === false) {
                throw new Error((data as { message?: string }).message || tc('error'));
            }
            const items = Array.isArray(data) ? data : data?.items || data?.data || [];
            setRegistrations(items.filter((registration: PendingRegistration) => registration.status === 'Pending'));
        } catch (error) {
            console.error(error);
            toast.error(tc('error'));
        } finally {
            setIsLoading(false);
        }
    }, [advisorId, tc]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const translateTerm = (term: string) => {
        switch (term) {
            case 'Fall':
                return t('termFall');
            case 'Spring':
                return t('termSpring');
            case 'Summer':
                return t('termSummer');
            default:
                return term;
        }
    };

    const formatDate = (value: string) => {
        const date = new Date(value);
        return Number.isNaN(date.getTime())
            ? tc('na')
            : new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
    };

    const handleApproveClick = (registration: PendingRegistration) => {
        setApproveConfirmation({ isOpen: true, registration });
    };

    const handleConfirmApprove = async () => {
        if (!approveConfirmation.registration) return;

        setIsApproving(true);
        try {
            const res = await approveRegistration(approveConfirmation.registration.registrationId, advisorId);
            if (res.success) {
                toast.success(res.message);
                setApproveConfirmation({ isOpen: false, registration: null });
                router.refresh();
                await fetchData();
            } else {
                toast.error(res.message || tc('error'));
            }
        } catch (error) {
            console.error(error);
            toast.error(tc('error'));
        } finally {
            setIsApproving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-start">
                    <h2 className="text-3xl font-bold text-gray-900">{t('pendingTitle')}</h2>
                    <p className="mt-1 text-gray-600">{t('pendingSubtitle')}</p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">{t('studentName')}</th>
                                <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">{t('academicNumber')}</th>
                                <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">{t('courseCode')}</th>
                                <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">{t('courseTitle')}</th>
                                <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">{t('term')}</th>
                                <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">{t('year')}</th>
                                <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">{t('requestDate')}</th>
                                <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                Array.from({ length: 6 }).map((_, index) => (
                                    <tr key={index} className="animate-pulse">
                                        {Array.from({ length: 8 }).map((__, cellIndex) => (
                                            <td key={cellIndex} className="px-6 py-4">
                                                <div className="h-4 w-24 bg-gray-200 rounded" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : registrations.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <ClipboardList size={36} className="text-gray-300" />
                                            <p className="font-medium">{t('noPendingRequests')}</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                registrations.map((registration) => (
                                    <tr key={registration.registrationId} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 text-start">{registration.studentName}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 text-start">{registration.academicNumber}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 text-start">
                                            <span className="inline-block px-2 py-0.5 bg-gray-100 rounded font-mono text-xs">
                                                {registration.courseCode}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 text-start">{registration.courseTitle}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 text-start">{translateTerm(registration.term)}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 text-start">{registration.year}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 text-start">{formatDate(registration.requestDate)}</td>
                                        <td className="px-6 py-4 text-sm text-start">
                                            {registration.status === 'Pending' ? (
                                                <button
                                                    type="button"
                                                    onClick={() => handleApproveClick(registration)}
                                                    className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-green-700"
                                                >
                                                    <CheckCircle2 size={14} />
                                                    {t('approve')}
                                                </button>
                                            ) : null}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmationDialog
                isOpen={approveConfirmation.isOpen}
                title={t('approveTitle')}
                message={t('approveConfirmMessage', { student: approveConfirmation.registration?.studentName || tc('na') })}
                confirmText={t('approve')}
                cancelText={tc('cancel')}
                onConfirm={handleConfirmApprove}
                onCancel={() => setApproveConfirmation({ isOpen: false, registration: null })}
                isLoading={isApproving}
            />
        </div>
    );
}
