'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { RegistrationPeriod } from '@/types';
import { getAllRegistrationPeriods, getCurrentRegistrationPeriod } from '@/server/RegistrationPeriods';
import { useTranslations } from '@/i18n/IntlProvider';

interface RegistrationPeriodsTableProps {
    refreshKey: number;
    onDelete: (period: RegistrationPeriod) => void;
}

type RegistrationPeriodsResponse =
    | RegistrationPeriod
    | RegistrationPeriod[]
    | { items?: RegistrationPeriod[]; data?: RegistrationPeriod | RegistrationPeriod[] }
    | null;

function normalizePeriods(response: RegistrationPeriodsResponse): RegistrationPeriod[] {
    if (!response) return [];
    if (Array.isArray(response)) return response;
    if ('items' in response || 'data' in response) {
        if (Array.isArray(response.items)) return response.items;
        if (Array.isArray(response.data)) return response.data;
        if (response.data) return [response.data];
    }
    return 'id' in response ? [response] : [];
}

export function RegistrationPeriodsTable({ refreshKey, onDelete }: RegistrationPeriodsTableProps) {
    const [periods, setPeriods] = useState<RegistrationPeriod[]>([]);
    const [view, setView] = useState<'all' | 'current'>('all');
    const [isLoading, setIsLoading] = useState(true);

    const t = useTranslations('RegistrationPeriods');
    const tc = useTranslations('Common');

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = view === 'current'
                ? await getCurrentRegistrationPeriod()
                : await getAllRegistrationPeriods();
            setPeriods(normalizePeriods(response));
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch registration periods');
            setPeriods([]);
        } finally {
            setIsLoading(false);
        }
    }, [view]);

    useEffect(() => {
        fetchData();
    }, [fetchData, refreshKey]);

    const formatDate = (value: string) => {
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? '-' : date.toLocaleDateString();
    };

    return (
        <div className="space-y-6">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
                <label className="mb-3 block text-sm font-semibold text-gray-700">{t('labelView')}</label>
                <select
                    value={view}
                    onChange={(event) => setView(event.target.value as 'all' | 'current')}
                    disabled={isLoading}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#00284d] disabled:opacity-50"
                >
                    <option value="all">{t('optionAll')}</option>
                    <option value="current">{t('optionCurrent')}</option>
                </select>
            </div>

            <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b border-gray-200 bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">{t('colName')}</th>
                                <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">{t('colTerm')}</th>
                                <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">{t('colYear')}</th>
                                <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">{t('colActive')}</th>
                                <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">{t('colStart')}</th>
                                <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">{t('colEnd')}</th>
                                <th className="px-6 py-3 text-start text-sm font-semibold text-gray-900">{t('colActions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, index) => (
                                    <tr key={index} className="animate-pulse">
                                        {Array.from({ length: 7 }).map((__, cellIndex) => (
                                            <td key={cellIndex} className="px-6 py-4">
                                                <div className="h-4 w-20 rounded bg-gray-200" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : periods.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">{t('noPeriods')}</td>
                                </tr>
                            ) : periods.map((period) => (
                                <tr key={period.id} className="transition hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{period.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{period.term}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{period.year}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${period.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {period.isActive ? t('active') : t('inactive')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(period.startDateUtc)}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(period.endDateUtc)}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Link href={`/admin/registration-periods/${period.id}`} className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50" aria-label={`Edit ${period.name}`}>
                                                <Edit2 size={16} />
                                            </Link>
                                            <button onClick={() => onDelete(period)} className="rounded-lg p-2 text-red-600 transition hover:bg-red-50" aria-label={`Delete ${period.name}`}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
