'use client';

import { useEffect, useState } from 'react';
import { RegistrationGrade } from '@/types';
import { getRegistrationGrade } from '@/server/Registrations';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from '@/i18n/IntlProvider';

interface GradeDetailsPageProps {
    id: string;
}

export default function GradeDetailsPage({ id }: GradeDetailsPageProps) {
    const t = useTranslations('Registrations');
    const tc = useTranslations('Common');

    const [grade, setGrade] = useState<RegistrationGrade | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchGrade = async () => {
            try {
                setIsLoading(true);
                const data = await getRegistrationGrade(id);
                setGrade(data || null);
            } catch (error) {
                console.error(error);
                toast.error(tc('error'));
                setGrade(null);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchGrade();
    }, [id, tc]);

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
                <h2 className="text-3xl font-bold text-gray-900 text-start">{t('gradeTitle')}</h2>
                <p className="mt-1 text-gray-600 text-start">
                    {t('gradeSubtitle', { id })}
                </p>
            </div>

            {/* Grade Card */}
            <div className="bg-white rounded-lg shadow p-6">
                {isLoading ? (
                    <div className="space-y-4 animate-pulse">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="h-4 w-28 bg-gray-200 rounded" />
                                <div className="h-4 w-40 bg-gray-200 rounded" />
                            </div>
                        ))}
                    </div>
                ) : !grade ? (
                    <p className="text-gray-500 text-center py-8">
                        {t('gradeNotFound')}
                    </p>
                ) : (
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        <div className="text-start">
                            <dt className="text-sm font-medium text-gray-500">{t('fieldStudent')}</dt>
                            <dd className="mt-1 text-sm text-gray-900 font-semibold">
                                {grade.studentName}
                            </dd>
                        </div>
                        <div className="text-start">
                            <dt className="text-sm font-medium text-gray-500">{t('fieldCourse')}</dt>
                            <dd className="mt-1 text-sm text-gray-900 font-semibold">
                                {grade.courseTitle}{' '}
                                {grade.courseCode ? `(${grade.courseCode})` : ''}
                            </dd>
                        </div>
                        <div className="text-start">
                            <dt className="text-sm font-medium text-gray-500">{t('fieldSemesterWork')}</dt>
                            <dd className="mt-1 text-sm text-gray-900">{grade.semesterWork}</dd>
                        </div>
                        <div className="text-start">
                            <dt className="text-sm font-medium text-gray-500">{t('fieldFinalExam')}</dt>
                            <dd className="mt-1 text-sm text-gray-900">{grade.finalExam}</dd>
                        </div>
                        <div className="text-start">
                            <dt className="text-sm font-medium text-gray-500">{t('fieldTotalGrade')}</dt>
                            <dd className="mt-1 text-sm text-gray-900 font-semibold">
                                {grade.totalGrade}
                            </dd>
                        </div>
                        <div className="text-start">
                            <dt className="text-sm font-medium text-gray-500">{t('fieldLetterGrade')}</dt>
                            <dd className="mt-1">
                                <span className="px-3 py-1 rounded-full text-sm font-bold bg-[#00284d] text-white">
                                    {grade.letterGrade}
                                </span>
                            </dd>
                        </div>
                    </dl>
                )}
            </div>
        </div>
    );
}
