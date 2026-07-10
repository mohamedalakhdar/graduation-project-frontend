'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAdvisorStudents } from '@/server/FacultyAction';
import { useLocale, useTranslations } from '@/i18n/IntlProvider';
import { getStatusBadgeClass } from '@/utils/statusBadgeColor';

type AdvisorStudentResponse = {
    studentId: string;
    name: string;
    academicNumber: string;
    programName: string;
    cgpa: number;
    academicStatus: string;
};

interface ProfessorStudentsPageProps {
    professorId: string;
    professorName?: string;
    backHref?: string;
    backLabel?: string;
}

export default function ProfessorStudentsPage({ professorId, professorName, backHref = '/admin/professors', backLabel }: ProfessorStudentsPageProps) {
    const t = useTranslations('Professor');
    const tp = useTranslations('Professors');
    const tc = useTranslations('Common');
    const locale = useLocale();
    const [students, setStudents] = useState<AdvisorStudentResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setIsLoading(true);
                setHasError(false);
                const data = await getAdvisorStudents(professorId);
                if (data && typeof data === 'object' && 'success' in data && data.success === false) {
                    throw new Error((data as { message?: string }).message || t('errorLoadStudents'));
                }
                setStudents(data?.advisorStudentResponses || []);
            } catch (error) {
                console.error(error);
                setHasError(true);
                setStudents([]);
                toast.error(t('errorLoadStudents'));
            } finally {
                setIsLoading(false);
            }
        };

        if (professorId) fetchStudents();
    }, [professorId, t]);

    const translateStatus = (status: string) => {
        switch (status) {
            case 'GoodStanding':
                return t('academicStatusGoodStanding');
            case 'Dismissed':
                return t('academicStatusDismissed');
            case 'Probation':
                return t('academicStatusProbation');
            case 'Graduated':
                return t('academicStatusGraduated');
            default:
                return status;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    {backHref && (
                        <Link
                            href={backHref}
                            className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#00284d] transition mb-2 text-start"
                        >
                            <ArrowLeft size={16} />
                            {backLabel || tp('backToProfessors')}
                        </Link>
                    )}
                    <h2 className="text-3xl font-bold text-gray-900 text-start">{tp('studentsTitle')}</h2>
                    <p className="mt-1 text-gray-600 text-start">
                        {tp('studentsSubtitle', { professorName: professorName || tc('na') })}
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">{t('studentName')}</th>
                                <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">{t('academicNumber')}</th>
                                <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">{t('program')}</th>
                                <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">{t('cgpa')}</th>
                                <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">{t('academicStatus')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                Array.from({ length: 6 }).map((_, index) => (
                                    <tr key={index} className="animate-pulse">
                                        {Array.from({ length: 5 }).map((__, cellIndex) => (
                                            <td key={cellIndex} className="px-6 py-4">
                                                <div className="h-4 w-24 bg-gray-200 rounded" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : hasError ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-red-500">
                                        {t('errorLoadStudents')}
                                    </td>
                                </tr>
                            ) : students.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <Users size={36} className="text-gray-300" />
                                            <p className="font-medium">{tp('noStudents')}</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                students.map((student) => (
                                    <tr key={student.studentId} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 text-start">
                                            {student.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 text-start">
                                            {student.academicNumber}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 text-start">
                                            {student.programName}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 text-start">
                                            {new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(student.cgpa)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-start">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(student.academicStatus)}`}>
                                                {translateStatus(student.academicStatus)}
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
