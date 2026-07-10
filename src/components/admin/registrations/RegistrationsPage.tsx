'use client';

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Pagination from '@/components/ui/Pagination';
import { RegistrationsTable } from '@/components/admin/table/RegistrationsTable';
import { useLocale, useTranslations } from '@/i18n/IntlProvider';
import { getAllRegistrations } from '@/server/Registrations';
import { useSearchParams } from 'next/navigation';

export default function RegistrationsPage({ id }: { id: string }) {
    const t = useTranslations('Registrations');
    const tc = useTranslations('Common');
    const locale = useLocale();
    const searchParams = useSearchParams();

    const [registrationsData, setRegistrationsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [status, setStatus] = useState('');
    const [semester, setSemester] = useState('');
    const [year, setYear] = useState<number | ''>('');
    void id;

    useEffect(() => {
        setStatus(searchParams.get('status') || '');
        setSemester(searchParams.get('semester') || '');
        const yearParam = searchParams.get('year') || '';
        setYear(yearParam ? parseInt(yearParam) : '');
    }, [searchParams]);

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await getAllRegistrations({
                status: status || undefined,
                semester: semester || undefined,
                year: year ? Number(year) : undefined,
                page,
                pageSize,
            });
            setRegistrationsData(data?.items || []);
            setTotalPages(data?.totalPages || 1);
            setTotalCount(data?.totalCount || 0);
        } catch (error) {
            console.error(error);
            toast.error(tc('error'));
        } finally {
            setIsLoading(false);
        }
    }, [status, semester, year, page, pageSize, tc]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-start">
                    <h2 className="text-3xl font-bold text-gray-900">{t('title')}</h2>
                    <p className="mt-1 text-gray-600">{t('subtitle')}</p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 space-y-4">
                <h3 className="font-semibold text-gray-900 text-start">{t('filters')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 text-start">{t('labelStatus')}</label>
                        <select
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value);
                                setPage(1);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition text-start"
                        >
                            <option value="">{t('allStatuses')}</option>
                            <option value="Pending">{t('statusPending')}</option>
                            <option value="Approved">{t('statusApproved')}</option>
                            <option value="Rejected">{t('statusRejected')}</option>
                            <option value="Dropped">{t('statusDropped')}</option>
                            <option value="Withdrawn">{t('statusWithdrawn')}</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 text-start">{t('labelSemester')}</label>
                        <select
                            value={semester}
                            onChange={(e) => {
                                setSemester(e.target.value);
                                setPage(1);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition text-start"
                        >
                            <option value="">{t('allSemesters')}</option>
                            <option value="Fall">{t('semesterFall')}</option>
                            <option value="Spring">{t('semesterSpring')}</option>
                            <option value="Summer">{t('semesterSummer')}</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 text-start">{t('labelYear')}</label>
                        <input
                            type="number"
                            value={year}
                            onChange={(e) => {
                                setYear(e.target.value ? parseInt(e.target.value) : '');
                                setPage(1);
                            }}
                            min="1900"
                            max="2100"
                            placeholder={t('allYears')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition text-start"
                        />
                    </div>
                </div>
            </div>

            <RegistrationsTable data={registrationsData} isLoading={isLoading} locale={locale} />

            {!isLoading && registrationsData.length > 0 && (
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
            )}
        </div>
    );
}
