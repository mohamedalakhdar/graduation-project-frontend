'use client';

import { useEffect, useState } from 'react';
import { AvailableCourse } from '@/types';
import { getAvailableCourses } from '@/server/Registrations';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Users, CheckCircle, XCircle } from 'lucide-react';
import { useTranslations } from '@/i18n/IntlProvider';

interface AvailableCoursesPageProps {
    studentId: string;
}

export default function AvailableCoursesPage({ studentId }: AvailableCoursesPageProps) {
    const t = useTranslations('Registrations');
    const tc = useTranslations('Common');

    const [availableCourses, setAvailableCourses] = useState<AvailableCourse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filters
    const [term, setTerm] = useState('');
    const [year, setYear] = useState<number | ''>('');

    const fetchCourses = async () => {
        try {
            setIsLoading(true);
            const data = await getAvailableCourses({
                studentId,
                term: term || undefined,
                year: year ? Number(year) : undefined,
            });

            if (data) {
                setAvailableCourses(Array.isArray(data) ? data : data.items || []);
            } else {
                setAvailableCourses([]);
            }
        } catch (error) {
            console.error(error);
            toast.error(tc('error'));
            setAvailableCourses([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (studentId) fetchCourses();
    }, [studentId, term, year]);

    // Derived stats
    const openCount = availableCourses.filter((c) => !c.isFull).length;
    const fullCount = availableCourses.filter((c) => c.isFull).length;
    const totalCount = availableCourses.length;

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
                    <h2 className="text-3xl font-bold text-gray-900 text-start">{t('availableTitle')}</h2>
                    <p className="mt-1 text-gray-600 text-start">
                        {t('availableSubtitle', { studentId })}
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            {!isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg shadow p-5 flex items-center gap-4 text-start">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <BookOpen size={22} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">{t('totalCourses')}</p>
                            <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-5 flex items-center gap-4 text-start">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <CheckCircle size={22} className="text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">{t('openCourses')}</p>
                            <p className="text-2xl font-bold text-gray-900">{openCount}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-5 flex items-center gap-4 text-start">
                        <div className="p-3 bg-red-100 rounded-lg">
                            <XCircle size={22} className="text-red-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">{t('fullCourses')}</p>
                            <p className="text-2xl font-bold text-gray-900">{fullCount}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-gray-900 mb-4 text-start">{t('filters')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Term Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 text-start">
                            {t('labelTerm')}
                        </label>
                        <select
                            value={term}
                            onChange={(e) => setTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition text-start"
                        >
                            <option value="">{t('allTerms')}</option>
                            <option value="Fall">{t('termFall')}</option>
                            <option value="Spring">{t('termSpring')}</option>
                            <option value="Summer">{t('termSummer')}</option>
                        </select>
                    </div>

                    {/* Year Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 text-start">
                            {t('labelYear')}
                        </label>
                        <input
                            type="number"
                            value={year}
                            onChange={(e) => setYear(e.target.value ? parseInt(e.target.value) : '')}
                            min="1900"
                            max="2100"
                            placeholder={t('allYears')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition text-start"
                        />
                    </div>
                </div>
            </div>

            {/* Available Courses Table */}
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
                                    {t('colCapacity')}
                                </th>
                                <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">
                                    {t('colAvailability')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, index) => (
                                    <tr key={index} className="animate-pulse">
                                        {Array.from({ length: 7 }).map((__, cellIndex) => (
                                            <td key={cellIndex} className="px-6 py-4">
                                                <div className="h-4 w-20 bg-gray-200 rounded" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : availableCourses.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-6 py-8 text-center text-gray-500"
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <BookOpen size={36} className="text-gray-300" />
                                            <p className="font-medium">{t('noAvailableCourses')}</p>
                                            <p className="text-sm">{t('noAvailableCoursesHint')}</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                availableCourses.map((course) => {
                                    const fillPercent = course.capacity > 0
                                        ? Math.round((course.enrolled / course.capacity) * 100)
                                        : 0;

                                    return (
                                        <tr
                                            key={course.offeringId}
                                            className="hover:bg-gray-50 transition"
                                        >
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900 text-start">
                                                {course.courseTitle}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 text-start">
                                                <span className="inline-block px-2 py-0.5 bg-gray-100 rounded font-mono text-xs">
                                                    {course.courseCode}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 text-start">
                                                {course.instructorName || (
                                                    <span className="text-gray-400 italic">{tc('na')}</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 text-start">
                                                {getTermTranslation(course.term)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 text-start">
                                                {course.year}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-start">
                                                <div className="flex items-center gap-2 min-w-[120px]">
                                                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full transition-all ${
                                                                fillPercent >= 100
                                                                    ? 'bg-red-500'
                                                                    : fillPercent >= 75
                                                                    ? 'bg-amber-500'
                                                                    : 'bg-green-500'
                                                            }`}
                                                            style={{ width: `${Math.min(fillPercent, 100)}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-gray-500 whitespace-nowrap">
                                                        <Users size={12} className="inline me-0.5" />
                                                        {course.enrolled}/{course.capacity}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-start">
                                                <span
                                                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                                        course.isFull
                                                            ? 'bg-red-100 text-red-700'
                                                            : 'bg-green-100 text-green-700'
                                                    }`}
                                                >
                                                    {course.isFull ? t('statusFull') : t('statusOpen')}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
