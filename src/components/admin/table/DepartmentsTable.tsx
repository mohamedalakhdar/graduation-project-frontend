'use client';

import { Edit2, Search, Trash2 } from 'lucide-react';
import { Department } from '@/types';
import { useEffect, useState } from 'react';
import { getAllDepartment } from '@/server/DepartmentActions';
import { useRouter } from 'next/navigation';
import Pagination from '@/components/ui/Pagination';
import { useTranslations } from '@/i18n/IntlProvider';

interface StudentsTableProps {
    onEdit?: (department: Department) => void;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIdForDeleteItem: React.Dispatch<React.SetStateAction<string | null>>;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
    onDelete?: (department: Department) => void;
}

export function DepartmentsTable({ onEdit, setIsModalOpen, setIdForDeleteItem, setIsEditing, onDelete }: StudentsTableProps) {
    const t = useTranslations('Departments');
    const tc = useTranslations('Common');

    const router = useRouter();
    const [departmentsData, setDepartmentData] = useState<Department[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // states for pagination and filter
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("")
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const data = await getAllDepartment({ search, page, pageSize });
                setDepartmentData(data.items);

                // for pagination
                setTotalPages(data.totalPages);
                setPage(data.page);
                setTotalCount(data.totalCount)

                router.refresh();
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [router, search, page, pageSize]);

    return (
        <>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {/* filter (search) */}
                <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    {/* Search */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            {tc('search')}
                        </label>

                        <div className="relative">
                            <Search
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                name="search"
                                type="search"
                                placeholder={t('searchPlaceholder')}
                                className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">{t('colName')}</th>
                                <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">{t('colDescription')}</th>
                                <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">{t('colPrograms')}</th>
                                <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">{t('colActions')}</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                // Skeleton
                                Array.from({ length: 6 }).map((_, index) => (
                                    <tr key={index} className="animate-pulse">
                                        <td className="px-6 py-4">
                                            <div className="h-4 w-32 bg-gray-200 rounded"></div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-4 w-56 bg-gray-200 rounded"></div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-4 w-10 bg-gray-200 rounded"></div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
                                                <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : !departmentsData || departmentsData.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        {t('noDepartments')}
                                    </td>
                                </tr>
                            ) : (
                                departmentsData.map((department) => (
                                    <tr key={department.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {department.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {department.description}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {department.programs?.map(ele => (
                                                <p key={ele.id}>👉🏻 {ele.name}</p>
                                            ))}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setIsEditing(true);
                                                        setIsModalOpen(true);
                                                        onEdit?.(department)
                                                    }}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        onDelete?.(department);
                                                        setIdForDeleteItem(department.id as string);
                                                    }}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                                                    <Trash2 size={16} />
                                                </button>
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