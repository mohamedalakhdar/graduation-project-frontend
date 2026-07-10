'use client';

import { BookOpen, Edit2, Users } from 'lucide-react';
import { Advisor } from '@/types';
import Link from 'next/link';
import { useTranslations } from '@/i18n/IntlProvider';
import { hasAdvisorRole } from '@/components/admin/professors/utils';

interface ProfessorsTableProps {
    data: Advisor[] | null;
    isLoading: boolean;
}

export function ProfessorsTable({
    data,
    isLoading,
}: ProfessorsTableProps) {
    const t = useTranslations('Professors');
    const tc = useTranslations('Common');

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">
                                {t('colName')}
                            </th>
                            <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">
                                {t('colEmail')}
                            </th>
                            <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">
                                {t('colDegree')}
                            </th>
                            <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">
                                {t('colDepartment')}
                            </th>
                            <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">
                                {t('colActions')}
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            // Skeleton Loading
                            Array.from({ length: 6 }).map((_, index) => (
                                <tr key={index} className="animate-pulse">
                                    <td className="px-6 py-4">
                                        <div className="h-4 w-32 bg-gray-200 rounded"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-4 w-48 bg-gray-200 rounded"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-4 w-28 bg-gray-200 rounded"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
                                    </td>
                                </tr>
                            ))
                        ) : !data || data.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    {t('noProfessors')}
                                </td>
                            </tr>
                        ) : (
                            data.map((advisor) => {
                                const canViewStudents = hasAdvisorRole(advisor);

                                return (
                                    <tr key={advisor.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {advisor.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {advisor.email || tc('na')}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {advisor.degree || tc('na')}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {advisor.departmentName || tc('na')}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/admin/faculty/${advisor.id}`}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    title={tc('edit')}
                                                >
                                                    <Edit2 size={16} />
                                                </Link>
                                                <Link
                                                    href={`/admin/professors/${advisor.id}/courses`}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 rounded-lg transition whitespace-nowrap"
                                                >
                                                    <BookOpen size={14} />
                                                    {t('viewCourses')}
                                                </Link>
                                                {canViewStudents && (
                                                    <Link
                                                        href={`/admin/professors/${advisor.id}/students`}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition whitespace-nowrap"
                                                    >
                                                        <Users size={14} />
                                                        {t('viewStudents')}
                                                    </Link>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
