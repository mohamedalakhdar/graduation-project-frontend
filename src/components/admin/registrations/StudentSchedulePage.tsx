'use client';

import { useEffect, useState } from 'react';
import { RegistrationScheduleItem } from '@/types';
import { getStudentSchedule } from '@/server/Registrations';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from '@/i18n/IntlProvider';

interface StudentSchedulePageProps {
    studentId: string;
}

export default function StudentSchedulePage({ studentId }: StudentSchedulePageProps) {
    const t = useTranslations('Registrations');
    const tc = useTranslations('Common');

    const [schedule, setSchedule] = useState<RegistrationScheduleItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                setIsLoading(true);
                const data = await getStudentSchedule(studentId);

                if (data) {
                    setSchedule(Array.isArray(data) ? data : data.items || []);
                } else {
                    setSchedule([]);
                }
            } catch (error) {
                console.error(error);
                toast.error(tc('error'));
                setSchedule([]);
            } finally {
                setIsLoading(false);
            }
        };

        if (studentId) fetchSchedule();
    }, [studentId, tc]);

    const getTermTranslation = (termVal: string) => {
        switch (termVal) {
            case 'Fall':
                return t('termFall');
            case 'Spring':
                return t('termSpring');
            case 'Summer':
                return t('termSummer');
            default:
                return termVal;
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <Link
                        href="/admin/students"
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#00284d] transition mb-2 text-start"
                    >
                        <ArrowLeft size={16} />
                        {t('backToStudents')}
                    </Link>
                    <h2 className="text-3xl font-bold text-gray-900 text-start">{t('scheduleTitle')}</h2>
                    <p className="mt-1 text-gray-600 text-start">
                        {t('scheduleSubtitle', { studentId })}
                    </p>
                </div>
            </div>

            {/* Schedule Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">
                                    {t('colCourseTitle')}
                                </th>
                                <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">
                                    {t('colCode')}
                                </th>
                                <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">
                                    {t('colInstructor')}
                                </th>
                                <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">
                                    {t('colTerm')}
                                </th>
                                <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">
                                    {t('colYear')}
                                </th>
                                <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">
                                    {t('colStatus')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, index) => (
                                    <tr key={index} className="animate-pulse">
                                        {Array.from({ length: 6 }).map((__, cellIndex) => (
                                            <td key={cellIndex} className="px-6 py-4">
                                                <div className="h-4 w-24 bg-gray-200 rounded" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : schedule.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-6 py-8 text-center text-gray-500"
                                    >
                                        {t('noSchedule')}
                                    </td>
                                </tr>
                            ) : (
                                schedule.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 text-start">
                                            {item.courseTitle}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 text-start">
                                            <span className="inline-block px-2 py-0.5 bg-gray-100 rounded font-mono text-xs">
                                                {item.courseCode}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 text-start">
                                            {item.instructorName || (
                                                <span className="text-gray-400 italic">{tc('na')}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 text-start">
                                            {getTermTranslation(item.term)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 text-start">
                                            {item.year}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-start">
                                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                                {getStatusTranslation(item.status)}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
