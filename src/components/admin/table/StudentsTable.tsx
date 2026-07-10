/**
 * Students Table Component
 * Renders a static list of students — no fetching, search, filter, or pagination
 */

"use client";

import { Advisor, Program, Student } from "@/types";
import { getStatusBadgeClass } from "@/utils/statusBadgeColor";
import { useEffect, useState } from "react";
import { getAllStudents } from "@/server/StudentsAction";
import { Search } from "lucide-react";
import { getAllPrograms } from "@/server/ProgramsActions";
import Loader from "@/components/ui/Loader";
import Link from "next/link";
import { StudentsStatus } from "@/enums";
import Pagination from "@/components/ui/Pagination";
import { getAllAdvisors } from "@/server/FacultyAction";
import { useTranslations } from "@/i18n/IntlProvider";

interface StudentsTableProps {
    // students: Student[];
    onEdit?: (student: Student) => void;
    onDelete?: (student: Student) => void;
    setIdForDeleteItem: React.Dispatch<React.SetStateAction<string | null>>
}

export function StudentsTable({
    // students,
    onEdit,
    onDelete,
    setIdForDeleteItem
}: StudentsTableProps) {
    const t = useTranslations("Students");
    const tc = useTranslations("Common");

    const [studentsData, setStudentsData] = useState<Student[]>([]);
    const [programData, setProgramData] = useState<Program[]>([]);
    const [advisorData, setAdvisorData] = useState<Advisor[]>([]);


    // loading for program, advisor and status
    const [isLoadingProgramData, setIsLoadingProgramData] = useState<boolean>(false);
    const [isLoadingAdvisorData, setIsLoadingAdvisorData] = useState<boolean>(false);
    const [isLoadingStudentsData, setIsLoadingStudentsData] = useState(false);

    // states for pagination and filter
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    // loading for filter
    const [isLoadingFilter, setIsLoadingFilter] = useState(false);

    // get all programs to show in select
    useEffect(() => {
        const getAllProgramsData = async () => {
            try {
                setIsLoadingProgramData(true);

                const data = await getAllPrograms({
                    pageSize: 100000,
                });

                setProgramData(data.items);

            } catch (error) {
                console.error(error);

            } finally {
                setIsLoadingProgramData(false);
            }
        };

        getAllProgramsData();
    }, []);

    // get all advisor to show in select
    useEffect(() => {
        const getAllAdvisorsData = async () => {
            try {
                setIsLoadingAdvisorData(true);

                const data = await getAllAdvisors({
                    pageSize: 100000,
                });

                setAdvisorData(data.items);

            } catch (error) {
                console.error(error);

            } finally {
                setIsLoadingAdvisorData(false);
            }
        };

        getAllAdvisorsData();
    }, []);

    // get all students
    const getAllStudentsData = async () => {
        try {
            setIsLoadingStudentsData(true);
            const data = await getAllStudents({
                page,
                pageSize,
            });
            setStudentsData(data.items);

            setTotalPages(data.totalPages);
            setPage(data.page);
            setTotalCount(data.totalCount)
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingStudentsData(false);
        }
    };


    useEffect(() => {
        getAllStudentsData()
    }, [page, pageSize]);

    // handler for filter 
    const handleFilter = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const filters = {
            search: formData.get("search"),
            programId: formData.get("programId"),
            advisorId: formData.get("advisorId"),
            status: formData.get("status"),
            minCGPA: formData.get("minCGPA"),
            maxCGPA: formData.get("maxCGPA"),
        };

        try {
            setIsLoadingFilter(true)
            const data = await getAllStudents({
                search: filters.search as string,
                programId: filters.programId as string,
                advisorId: filters.advisorId as string,
                status: filters.status as string,
                minCGPA: Number(filters.minCGPA),
                maxCGPA: Number(filters.maxCGPA),
            });

            setStudentsData(data.items);

            setTotalPages(data.totalPages);
            setPage(data.page);
            setTotalCount(data.totalCount)

        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingFilter(false)
        }
    };
    return (
        <>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    {/* Filter */}

                    <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        {/* Header */}
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">
                                    {t("filtersTitle")}
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    {t("filtersSubtitle")}
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleFilter}>
                            {/* Filters Grid */}
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

                                {/* Search */}
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        {tc("search")}
                                    </label>

                                    <div className="relative">
                                        <Search
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            name="search"
                                            type="text"
                                            placeholder={t("searchPlaceholder")}
                                            className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                        />
                                    </div>
                                </div>

                                {/* Program ID */}
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        {t("colProgram")}
                                    </label>

                                    {
                                        isLoadingProgramData
                                            ? <Loader />
                                            : (
                                                programData ? (
                                                    <select
                                                        name="programId"
                                                        defaultValue=""
                                                        className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                                    >
                                                        <option value="" disabled>
                                                            {t("selectProgram")}
                                                        </option>
                                                        <option value="">
                                                            {tc("all")}
                                                        </option>

                                                        {programData.map((program: Program) => (
                                                            <option
                                                                key={program.id}
                                                                value={program.id}
                                                            >
                                                                {program.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <div>
                                                        <p className="font-bold text-sm text-red-500">
                                                            {t("noProgramsFound")}
                                                        </p>

                                                        <div className="text-black mt-3 flex flex-col sm:flex-row items-center justify-between gap-4">
                                                            <Link
                                                                href={"/admin/programs"}
                                                                className="px-4 py-2 bg-[#00284d] text-white rounded-lg hover:bg-[#003465] transition font-medium w-full whitespace-nowrap"
                                                            >
                                                                {t("createProgramBtn") || "Create Program"}
                                                            </Link>

                                                            <button
                                                                type="button"
                                                                onClick={() => window.location.reload()}
                                                                className="px-4 py-2 border text-black rounded-lg transition font-medium w-full"
                                                            >
                                                                {tc("refresh")}
                                                            </button>
                                                        </div>
                                                    </div>
                                                )
                                            )
                                    }
                                </div>

                                {/* Advisor ID */}
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        {t("allAdvisors")}
                                    </label>

                                    {
                                        isLoadingAdvisorData
                                            ? <Loader />
                                            : (
                                                advisorData ? (
                                                    <select
                                                        name="advisorId"
                                                        defaultValue=""
                                                        className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                                    >
                                                        <option value="" disabled>
                                                            {t("allAdvisors")}
                                                        </option>
                                                        <option value="">
                                                            {tc("all")}
                                                        </option>

                                                        {advisorData.map((advisor: Advisor) => (
                                                            <option
                                                                key={advisor.id}
                                                                value={advisor.id}
                                                            >
                                                                {advisor.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <div>
                                                        <p className="font-bold text-sm text-red-500">
                                                            {t("noAdvisorsFound")}
                                                        </p>

                                                        <div className="text-black mt-3 flex flex-col sm:flex-row items-center justify-between gap-4">
                                                            <Link
                                                                href={"/admin/faculty"}
                                                                className="px-4 py-2 bg-[#00284d] text-white rounded-lg hover:bg-[#003465] transition font-medium w-full whitespace-nowrap"
                                                            >
                                                                {t("createAdvisorBtn") || "Create Advisor"}
                                                            </Link>
                                                        </div>
                                                    </div>
                                                )
                                            )
                                    }
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        {t("colStatus")}
                                    </label>

                                    <select
                                        name="status"
                                        defaultValue=""
                                        className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                    >
                                        <option value="">
                                            {tc("all")}
                                        </option>

                                        {Object.values(StudentsStatus).map((status, idx) => (
                                            <option
                                                key={status}
                                                value={idx + 1}
                                            >
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Min CGPA */}
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        {t("minCgpa")}
                                    </label>

                                    <input
                                        name="minCGPA"
                                        type="number"
                                        step="0.01"
                                        placeholder={t("minCgpaPlaceholder")}
                                        className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                    />
                                </div>

                                {/* Max CGPA */}
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        {t("maxCgpa")}
                                    </label>

                                    <input
                                        name="maxCGPA"
                                        type="number"
                                        step="0.01"
                                        placeholder={t("maxCgpaPlaceholder")}
                                        className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                    />
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="mt-7 flex flex-wrap items-center justify-end gap-3">

                                <button
                                    type="reset"
                                    className="h-11 rounded-xl border border-slate-300 bg-white px-6 text-sm font-medium text-slate-700 transition-all hover:bg-slate-100"
                                    onClick={() => getAllStudentsData()}
                                >
                                    {t("clear")}
                                </button>

                                <button
                                    type="submit"
                                    className="flex h-11 items-center gap-2 rounded-xl bg-[#003465] px-6 text-sm font-medium text-white transition-all hover:bg-blue-700"
                                >
                                    {isLoadingFilter
                                        ? <Loader className="text-white" />
                                        : <>
                                            <Search size={18} />
                                            {tc("search")}
                                        </>
                                    }
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Table */}
                    <table className="w-full">
                        {/* Head */}
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">
                                    {t("colName")}
                                </th>
                                <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">
                                    {t("colAcademicNumber")}
                                </th>
                                <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">
                                    {t("colProgram")}
                                </th>
                                <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">
                                    {t("colCgpa")}
                                </th>
                                <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">
                                    {t("colStatus")}
                                </th>
                                <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">
                                    {t("colAcademicLevel")}
                                </th>
                                <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">
                                    {t("colSchedule")}
                                </th>
                                <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">
                                    {t("colAvailableCourses")}
                                </th>
                                <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">
                                    {t("colActions")}
                                </th>
                            </tr>
                        </thead>
                        {/* body */}
                        <tbody className="divide-y divide-gray-100">
                            {isLoadingStudentsData ? (
                                Array.from({ length: 6 }).map((_, index) => (
                                    <tr key={index} className="animate-pulse">
                                        {/* Full Name */}
                                        <td className="px-6 py-4">
                                            <div className="h-4 w-32 bg-gray-200 rounded"></div>
                                        </td>

                                        {/* Academic Number */}
                                        <td className="px-6 py-4">
                                            <div className="h-4 w-24 bg-gray-200 rounded"></div>
                                        </td>

                                        {/* Program Name */}
                                        <td className="px-6 py-4">
                                            <div className="h-4 w-28 bg-gray-200 rounded"></div>
                                        </td>

                                        {/* CGPA */}
                                        <td className="px-6 py-4">
                                            <div className="h-4 w-16 bg-gray-200 rounded"></div>
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4">
                                            <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                                        </td>

                                        {/* Academic Level */}
                                        <td className="px-6 py-4">
                                            <div className="h-4 w-20 bg-gray-200 rounded"></div>
                                        </td>

                                        {/* Schedule */}
                                        <td className="px-6 py-4">
                                            <div className="h-8 w-24 bg-gray-200 rounded-lg"></div>
                                        </td>

                                        {/* Available Courses */}
                                        <td className="px-6 py-4">
                                            <div className="h-8 w-32 bg-gray-200 rounded-lg"></div>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
                                                <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : studentsData.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                                        {t('noStudents')}
                                    </td>
                                </tr>
                            ) : (
                                studentsData.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {student.fullName}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {student.academicNumber}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {student.programName}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {student.cgpa?.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(student.academicStatus as string)}`}
                                            >
                                                {student.academicStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {student.academicLevel}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <Link
                                                href={`/admin/registration/schedule/${student.id}`}
                                                className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition"
                                            >
                                                {t("viewSchedule")}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <Link
                                                href={`/admin/registration/available/${student.id}`}
                                                className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-lg transition"
                                            >
                                                {t("viewCourses")}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                {
                                                    student.academicStatus !== "Dismissed"
                                                        ? (
                                                            <button
                                                                onClick={() => {
                                                                    onDelete?.(student)
                                                                    setIdForDeleteItem(student.id)
                                                                 }}
                                                                className="p-2 text-white bg-red-600 hover:bg-red-800 rounded-lg transition whitespace-nowrap"
                                                                title={t("dismissStudent")}
                                                            >
                                                                {t("dismissStudent")}
                                                            </button>
                                                        )
                                                        : (
                                                            <span className="text-red-500">{t("alreadyDismissed")}</span>
                                                        )
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                </div>
            </div>
            {/* Pagination */}
            <Pagination
                totalCount={totalCount}
                currentPage={page}
                totalPages={totalPages}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(size) => {
                    setPageSize(size);
                    setPage(1);
                }}
            />
        </>
    );
}
