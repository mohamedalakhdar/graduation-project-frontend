'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ControlStatistics } from '@/types';
import { useTranslations } from '@/i18n/IntlProvider';

interface AcademicStructureChartProps {
    statistics: ControlStatistics | null;
    isLoading: boolean;
}

export function AcademicStructureChart({ statistics, isLoading }: AcademicStructureChartProps) {
    const t = useTranslations('ControlEngine');

    if (isLoading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow text-start">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">{t('chartAcademicStructure')}</h3>
                <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg animate-pulse" />
            </div>
        );
    }

    if (!statistics) {
        return (
            <div className="bg-white p-6 rounded-lg shadow text-start">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">{t('chartAcademicStructure')}</h3>
                <div className="flex items-center justify-center h-64 text-gray-500">
                    {t('chartNoDataAvailable')}
                </div>
            </div>
        );
    }

    const data = [
        {
            name: t('totalDepartments'),
            value: statistics.totalDepartments,
        },
        {
            name: t('totalPrograms'),
            value: statistics.totalPrograms,
        },
        {
            name: t('totalFaculties'),
            value: statistics.totalFaculties,
        },
        {
            name: t('totalCourseOfferings'),
            value: statistics.totalCourseOfferings,
        },
    ];

    return (
        <div className="bg-white p-6 rounded-lg shadow text-start">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">{t('chartAcademicStructure')}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#00284d" name={t('chartCount')} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
