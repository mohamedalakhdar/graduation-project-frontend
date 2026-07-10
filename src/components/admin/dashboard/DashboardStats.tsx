'use client';

import { Users, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { StatisticCard } from '../cards/StatisticCard';
import { ControlStatistics } from '@/types';
import { useTranslations } from '@/i18n/IntlProvider';

interface DashboardStatsProps {
    statistics: ControlStatistics | null;
    isLoading: boolean;
}

export function DashboardStats({ statistics, isLoading }: DashboardStatsProps) {
    const t = useTranslations('Dashboard');

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
                        <div className="h-4 w-24 bg-gray-200 rounded mb-3" />
                        <div className="h-8 w-20 bg-gray-200 rounded" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatisticCard
                title={t('totalStudents')}
                value={statistics?.totalStudents ?? 0}
                icon={Users}
                iconBgColor="bg-blue-500"
                description={t('totalStudentsDesc')}
            />

            <StatisticCard
                title={t('activeStudents')}
                value={statistics?.activeStudents ?? 0}
                icon={CheckCircle}
                iconBgColor="bg-green-500"
                description={t('activeStudentsDesc')}
            />

            <StatisticCard
                title={t('academicWarnings')}
                value={statistics?.warningStudents ?? 0}
                icon={AlertCircle}
                iconBgColor="bg-yellow-500"
                description={t('academicWarningsDesc')}
            />

            <StatisticCard
                title={t('averageGpa')}
                value={statistics?.averageCGPA?.toFixed(2) ?? '0.00'}
                icon={TrendingUp}
                iconBgColor="bg-purple-500"
                description={t('averageGpaDesc')}
            />
        </div>
    );
}
