'use client';

import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { BookOpen, ClipboardList, Users } from 'lucide-react';
import { StatisticCard } from '@/components/admin/cards/StatisticCard';
import { getAdvisorStudents, getFacultyCourses } from '@/server/FacultyAction';
import { getPendingRegistrations } from '@/server/Registrations';
import { useLocale, useTranslations } from '@/i18n/IntlProvider';

interface ProfessorDashboardPageProps {
    facultyId: string;
    isAdvisor: boolean;
}

type CourseItem = {
    offeringId: string;
    courseCode: string;
    courseTitle: string;
    semester: 'Fall' | 'Spring' | 'Summer' | string;
    year: number;
    enrolledCount: number;
    capacity: number;
};

type StudentItem = {
    studentId: string;
    name: string;
    academicNumber: string;
    programName: string;
    cgpa: number;
    academicStatus: string;
};

type PendingItem = {
    registrationId: string;
    status: string;
    studentName: string;
    courseCode: string;
    courseTitle: string;
    term: 'Fall' | 'Spring' | 'Summer' | string;
    year: number;
};

export default function ProfessorDashboardPage({ facultyId, isAdvisor }: ProfessorDashboardPageProps) {
    const t = useTranslations('Professor');
    const tc = useTranslations('Common');
    const locale = useLocale();
    const [courses, setCourses] = useState<CourseItem[]>([]);
    const [students, setStudents] = useState<StudentItem[]>([]);
    const [pending, setPending] = useState<PendingItem[]>([]);
    const [approved, setApproved] = useState<PendingItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setIsLoading(true);
                const [coursesData, studentsData, pendingData] = await Promise.all([
                    getFacultyCourses(facultyId),
                    isAdvisor ? getAdvisorStudents(facultyId) : Promise.resolve(null),
                    isAdvisor ? getPendingRegistrations(facultyId) : Promise.resolve(null),
                ]);

                if (coursesData && typeof coursesData === 'object' && 'success' in coursesData && coursesData.success === false) {
                    throw new Error((coursesData as { message?: string }).message || t('errorLoadCourses'));
                }
                if (studentsData && typeof studentsData === 'object' && 'success' in studentsData && studentsData.success === false) {
                    throw new Error((studentsData as { message?: string }).message || t('errorLoadStudents'));
                }
                if (pendingData && typeof pendingData === 'object' && 'success' in pendingData && pendingData.success === false) {
                    throw new Error((pendingData as { message?: string }).message || t('noPendingRequests'));
                }

                const courseItems = Array.isArray(coursesData) ? coursesData : coursesData?.items || coursesData?.data || coursesData?.courses || [];
                const registrationItems = Array.isArray(pendingData) ? pendingData : pendingData?.items || pendingData?.data || [];

                setCourses(courseItems);
                setStudents(studentsData?.advisorStudentResponses || []);
                setPending(registrationItems.filter((item: PendingItem) => item.status === 'Pending'));
                setApproved(registrationItems.filter((item: PendingItem) => item.status === 'Approved'));
            } catch (error) {
                console.error(error);
                toast.error(tc('error'));
            } finally {
                setIsLoading(false);
            }
        };

        if (facultyId) fetchStats();
    }, [facultyId, isAdvisor, tc, t]);

    const semesterStats = useMemo(() => {
        const counts = { Fall: 0, Spring: 0, Summer: 0 };
        for (const course of courses) {
            if (course.semester in counts) counts[course.semester as keyof typeof counts] += 1;
        }
        return counts;
    }, [courses]);

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
        <div className="space-y-8">
            <div className="text-start">
                <h2 className="text-3xl font-bold text-gray-900">{t('dashboardTitle')}</h2>
                <p className="mt-2 text-gray-600">{t('dashboardSubtitle')}</p>
            </div>

            <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-start">{t('quickStats')}</h3>
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[0, 1, 2].slice(0, isAdvisor ? 3 : 1).map((item) => (
                            <div key={item} className="bg-white p-6 rounded-lg shadow animate-pulse">
                                <div className="h-4 w-24 bg-gray-200 rounded mb-3" />
                                <div className="h-8 w-20 bg-gray-200 rounded" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <StatisticCard
                            title={t('totalCourses')}
                            value={courses.length}
                            icon={BookOpen}
                            iconBgColor="bg-blue-500"
                            description={t('totalCoursesDesc')}
                        />
                        {isAdvisor && (
                            <>
                                <StatisticCard
                                    title={t('totalStudents')}
                                    value={students.length}
                                    icon={Users}
                                    iconBgColor="bg-green-500"
                                    description={t('totalStudentsDesc')}
                                />
                                <StatisticCard
                                    title={t('pendingRequests')}
                                    value={pending.length}
                                    icon={ClipboardList}
                                    iconBgColor="bg-yellow-500"
                                    description={t('pendingRequestsDesc')}
                                />
                            </>
                        )}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('semesterLoadTitle')}</h3>
                    <div className="space-y-4">
                        {(['Fall', 'Spring', 'Summer'] as const).map((semester) => (
                            <div key={semester} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">{translateSemester(semester)}</span>
                                    <span className="font-medium text-gray-900">{semesterStats[semester]}</span>
                                </div>
                                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-[#00284d]"
                                        style={{ width: `${courses.length ? (semesterStats[semester] / courses.length) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboardCoursesTitle')}</h3>
                    {courses.length === 0 ? (
                        <p className="text-sm text-gray-500">{t('noCourses')}</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-start text-sm font-semibold text-gray-900">{t('courseCode')}</th>
                                        <th className="px-4 py-3 text-start text-sm font-semibold text-gray-900">{t('courseTitle')}</th>
                                        <th className="px-4 py-3 text-start text-sm font-semibold text-gray-900">{t('semester')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {courses.slice(0, 5).map((course) => (
                                        <tr key={course.offeringId} className="hover:bg-gray-50 transition">
                                            <td className="px-4 py-3 text-sm text-gray-600">{course.courseCode}</td>
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{course.courseTitle}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{translateSemester(course.semester)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {isAdvisor && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboardStudentsTitle')}</h3>
                        {students.length === 0 ? (
                            <p className="text-sm text-gray-500">{t('noStudents')}</p>
                        ) : (
                            <div className="space-y-3">
                                {students.slice(0, 5).map((student) => (
                                    <div key={student.studentId} className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                                        <div>
                                            <p className="font-medium text-gray-900">{student.name}</p>
                                            <p className="text-sm text-gray-500">{student.academicNumber}</p>
                                        </div>
                                        <span className="text-sm text-gray-600">{new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(student.cgpa)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboardPendingTitle')}</h3>
                        {pending.length === 0 ? (
                            <p className="text-sm text-gray-500">{t('noPendingRequests')}</p>
                        ) : (
                            <div className="space-y-3">
                                {pending.slice(0, 5).map((item) => (
                                    <div key={item.registrationId} className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                                        <div>
                                            <p className="font-medium text-gray-900">{item.studentName}</p>
                                            <p className="text-sm text-gray-500">{item.courseTitle}</p>
                                        </div>
                                        <span className="text-sm text-gray-600">{translateSemester(item.term)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
