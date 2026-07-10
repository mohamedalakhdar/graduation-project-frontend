'use client';

import { useCallback, useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllAdvisors, getAllFacultyMember } from '@/server/FacultyAction';
import { getAllDepartment } from '@/server/DepartmentActions';
import { Advisor, Department } from '@/types';
import Pagination from '@/components/ui/Pagination';
import { ProfessorsTable } from '@/components/admin/table/ProfessorsTable';
import { FacultyModal } from '@/components/admin/modals/FacultyModal';
import { useTranslations } from '@/i18n/IntlProvider';
import { Roles } from '@/enums';

type ProfessorSource = 'facultyMembers' | 'advisors';

export default function ProfessorsPage() {
    const t = useTranslations('Professors');
    const tc = useTranslations('Common');
    const [professorsData, setProfessorsData] = useState<Advisor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const [departments, setDepartments] = useState<Department[]>([]);
    const [selectedDepartmentId, setSelectedDepartmentId] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSource, setSelectedSource] = useState<ProfessorSource>('facultyMembers');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch data
    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const getProfessors = selectedSource === 'advisors'
                ? getAllAdvisors
                : getAllFacultyMember;

            const data = await getProfessors({
                search: searchQuery || undefined,
                departmentId: selectedDepartmentId || undefined,
                page,
                pageSize,
            });

            if (data && Array.isArray(data.items)) {
                const items = selectedSource === 'advisors'
                    ? data.items.map((professor: Advisor) => ({
                        ...professor,
                        roles: professor.roles || [Roles.Advisor],
                    }))
                    : data.items;

                setProfessorsData(items);
                setTotalPages(data.totalPages || 1);
                setTotalCount(data.totalCount || 0);
            } else {
                setProfessorsData([]);
                setTotalCount(0);
                setTotalPages(1);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch professors');
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery, selectedDepartmentId, selectedSource, page, pageSize]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const data = await getAllDepartment({});
                setDepartments(data.items || []);
            } catch (error) {
                console.error(error);
                toast.error('Failed to load departments');
            }
        };

        fetchDepartments();
    }, []);

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">{t('title')}</h2>
                    <p className="mt-1 text-gray-600">{t('subtitle')}</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#00284d] text-white rounded-lg hover:bg-[#003465] transition font-medium"
                >
                    <Plus size={20} />
                    {t('addBtn')}
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
                <h3 className="font-semibold text-gray-900">{tc('filters')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('labelView')}
                        </label>
                        <select
                            value={selectedSource}
                            onChange={(e) => {
                                setSelectedSource(e.target.value as ProfessorSource);
                                setPage(1);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition text-black bg-white"
                        >
                            <option value="facultyMembers">{t('allFacultyMembers')}</option>
                            <option value="advisors">{t('allAdvisors')}</option>
                        </select>
                    </div>

                    {/* Search query */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {tc('search')}
                        </label>
                        <input
                            type="text"
                            placeholder={t('searchPlaceholder')}
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setPage(1);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition placeholder:text-gray-400 text-black bg-white"
                        />
                    </div>

                    {/* Department Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {tc('department')}
                        </label>
                        <select
                            value={selectedDepartmentId}
                            onChange={(e) => {
                                setSelectedDepartmentId(e.target.value);
                                setPage(1);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition text-black bg-white"
                        >
                            <option value="">{t('allDepartments')}</option>
                            {departments.map((dept) => (
                                <option key={dept.id} value={dept.id}>
                                    {dept.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <ProfessorsTable
                data={professorsData}
                isLoading={isLoading}
            />

            {/* Pagination */}
            {!isLoading && professorsData.length > 0 && (
                <Pagination
                    totalCount={totalCount}
                    currentPage={page}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    onPageChange={setPage}
                    onPageSizeChange={setPageSize}
                />
            )}

            {/* Faculty Modal */}
            <FacultyModal
                isOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                isEditing={false}
                onClose={() => setIsModalOpen(false)}
                defaultValuesForEdit={null}
            />
        </div>
    );
}
