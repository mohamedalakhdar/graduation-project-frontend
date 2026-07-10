'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { getFacultyCourses } from '@/server/FacultyAction';
import { useLocale, useTranslations } from '@/i18n/IntlProvider';

type ProfessorCourse = {
    offeringId: string;
    courseCode: string;
    courseTitle: string;
    semester: 'Fall' | 'Spring' | 'Summer' | string;
    year: number;
    enrolledCount: number;
    capacity: number;
};

interface ProfessorCoursesPageProps {
    professorId: string;
    professorName?: string;
    backHref?: string;
    backLabel?: string;
}

export default function ProfessorCoursesPage({ professorId, professorName, backHref = '/admin/professors', backLabel }: ProfessorCoursesPageProps) {
    const t = useTranslations('Professor');
    const tp = useTranslations('Professors');
    const tc = useTranslations('Common');
    const locale = useLocale();
    const [courses, setCourses] = useState<ProfessorCourse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setIsLoading(true);
                setHasError(false);
                const data = await getFacultyCourses(professorId);
                if (data && typeof data === 'object' && 'success' in data && data.success === false) {
                    throw new Error((data as { message?: string }).message || t('errorLoadCourses'));
                }
                setCourses(data?.courses);
            } catch (error) {
                console.error(error);
                setHasError(true);
                setCourses([]);
                toast.error(t('errorLoadCourses'));
            } finally {
                setIsLoading(false);
            }
        };

        if (professorId) fetchCourses();
    }, [professorId, t]);

    const translateSemester = (semester: string) => {
        switch (semester) {
            case 'Fall':
                return t('semesterFall');
            case 'Spring':
                return t('semesterSpring');
            case 'Summer':
                return t('semesterSummer');
            default:
                return semester;
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
                    <h2 className="text-3xl font-bold text-gray-900 text-start">{tp('coursesTitle')}</h2>
                    <p className="mt-1 text-gray-600 text-start">
                        {tp('coursesSubtitle', { professorName: professorName || tc('na') })}
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">{t('courseCode')}</th>
                                <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">{t('courseTitle')}</th>
                                <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">{t('semester')}</th>
                                <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">{t('year')}</th>
                                <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">{t('enrolledStudents')}</th>
                                <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">{t('capacity')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                Array.from({ length: 6 }).map((_, index) => (
                                    <tr key={index} className="animate-pulse">
                                        {Array.from({ length: 6 }).map((__, cellIndex) => (
                                            <td key={cellIndex} className="px-6 py-4">
                                                <div className="h-4 w-24 bg-gray-200 rounded" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : hasError ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-red-500">
                                        {t('errorLoadCourses')}
                                    </td>
                                </tr>
                            ) : courses.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <BookOpen size={36} className="text-gray-300" />
                                            <p className="font-medium">{tp('noCourses')}</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                courses.map((course) => (
                                    <tr key={course.offeringId} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 text-sm text-gray-600 text-start">
                                            <span className="inline-block px-2 py-0.5 bg-gray-100 rounded font-mono text-xs">
                                                {course.courseCode}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 text-start">
                                            {course.courseTitle}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 text-start">
                                            {translateSemester(course.semester)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 text-start">
                                            {course.year}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 text-start">
                                            {new Intl.NumberFormat(locale).format(course.enrolledCount)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 text-start">
                                            {new Intl.NumberFormat(locale).format(course.capacity)}
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
