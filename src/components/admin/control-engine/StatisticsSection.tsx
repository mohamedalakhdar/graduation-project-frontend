'use client';

import {
    Users,
    CheckCircle,
    AlertCircle,
    XCircle,
    Award,
    TrendingUp,
} from 'lucide-react';
import { ControlStatistics } from '@/types';
import { StatisticCard } from '../cards/StatisticCard';
import { useTranslations } from '@/i18n/IntlProvider';

interface StatisticsSectionProps {
    statistics: ControlStatistics | null;
    isLoading: boolean;
}

export function StatisticsSection({ statistics, isLoading }: StatisticsSectionProps) {
    const t = useTranslations('ControlEngine');

    const cards = [
        {
            title: t('totalStudents'),
            value: statistics?.totalStudents ?? 0,
            icon: Users,
            iconBgColor: 'bg-blue-100',
        },
        {
            title: t('activeStudents'),
            value: statistics?.activeStudents ?? 0,
            icon: CheckCircle,
            iconBgColor: 'bg-green-100',
        },
        {
            title: t('warningStudents'),
            value: statistics?.warningStudents ?? 0,
            icon: AlertCircle,
            iconBgColor: 'bg-amber-100',
        },
        {
            title: t('dismissedStudents'),
            value: statistics?.dismissedStudents ?? 0,
            icon: XCircle,
            iconBgColor: 'bg-red-100',
        },
        {
            title: t('graduatedStudents'),
            value: statistics?.graduatedStudents ?? 0,
            icon: Award,
            iconBgColor: 'bg-indigo-100',
        },
        {
            title: t('averageCgpa'),
            value: statistics?.averageCGPA?.toFixed(2) ?? '0.00',
            icon: TrendingUp,
            iconBgColor: 'bg-purple-100',
        },
    ];

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map((_, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow animate-pulse">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <div className="h-4 w-24 bg-gray-200 rounded mb-3" />
                                <div className="h-8 w-20 bg-gray-200 rounded" />
                            </div>
                            <div className="w-12 h-12 bg-gray-200 rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card, index) => (
                <StatisticCard
                    key={index}
                    title={card.title}
                    value={card.value}
                    icon={card.icon}
                    iconBgColor={card.iconBgColor}
                />
            ))}
        </div>
    );
}
