'use client';

import { useTranslations } from '@/i18n/IntlProvider';

type RegistrationRow = {
    id: string;
    studentName: string;
    courseCode: string;
    courseTitle: string;
    status: string;
    isRetake: boolean;
    registrationDate: string;
    gradeLetter: string | null;
};

interface RegistrationsTableProps {
    data: RegistrationRow[] | null;
    isLoading: boolean;
    locale: string;
}

const COLUMN_COUNT = 6;

export function RegistrationsTable({ data, isLoading, locale }: RegistrationsTableProps) {
    const t = useTranslations('Registrations');
    const tc = useTranslations('Common');

    const translateStatus = (value: string) => {
        switch (value) {
            case 'Pending':
                return t('statusPending');
            case 'Approved':
                return t('statusApproved');
            case 'Rejected':
                return t('statusRejected');
            case 'Dropped':
                return t('statusDropped');
            case 'Withdrawn':
                return t('statusWithdrawn');
            default:
                return value;
        }
    };

    const translateBoolean = (value: boolean) => (value ? t('yes') : t('no'));

    const formatDate = (value: string) => {
        const date = new Date(value);
        return Number.isNaN(date.getTime())
            ? tc('na')
            : new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
    };

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">{t('colStudent')}</th>
                            <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">{t('colCourse')}</th>
                            <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">{t('colStatus')}</th>
                            <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">{t('colRegistrationDate')}</th>
                            <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">{t('colRetake')}</th>
                            <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">{t('colGrade')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            Array.from({ length: 6 }).map((_, index) => (
                                <tr key={index} className="animate-pulse">
                                    {Array.from({ length: 6 }).map((__, cellIndex) => (
                                        <td key={cellIndex} className="px-6 py-4">
                                            <div className="h-4 w-32 bg-gray-200 rounded" />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : !data || data.length === 0 ? (
                            <tr>
                                <td colSpan={COLUMN_COUNT} className="px-6 py-8 text-center text-gray-500">
                                    {t('noRegistrations')}
                                </td>
                            </tr>
                        ) : (
                            data.map((registration) => (
                                <tr key={registration.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 text-start">
                                        {registration.studentName}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 text-start">
                                        {registration.courseTitle} ({registration.courseCode})
                                    </td>
                                    <td className="px-6 py-4 text-sm text-start">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${registration.status === 'Approved' ? 'bg-green-100 text-green-700' : registration.status === 'Rejected' || registration.status === 'Dropped' ? 'bg-red-100 text-red-700' : registration.status === 'Withdrawn' ? 'bg-gray-100 text-gray-600' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {translateStatus(registration.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 text-start">
                                        {formatDate(registration.registrationDate)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 text-start">
                                        {translateBoolean(registration.isRetake)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 text-start">
                                        {registration.gradeLetter ?? tc('na')}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
