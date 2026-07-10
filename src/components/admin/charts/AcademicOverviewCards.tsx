'use client';

import { Users, UserCheck, TrendingUp } from 'lucide-react';
import { ControlStatistics } from '@/types';
import { useTranslations } from '@/i18n/IntlProvider';

interface AcademicOverviewCardsProps {
    statistics: ControlStatistics | null;
    isLoading: boolean;
}

export function AcademicOverviewCards({ statistics, isLoading }: AcademicOverviewCardsProps) {
    const t = useTranslations('ControlEngine');

    const cards = [
        {
            title: t('totalStudents'),
            value: statistics?.totalStudents ?? 0,
            icon: Users,
            color: 'bg-blue-50',
            iconColor: 'bg-blue-100 text-blue-600',
        },
        {
            title: t('activeRegistrations'),
            value: statistics?.activeRegistrations ?? 0,
            icon: UserCheck,
            color: 'bg-green-50',
            iconColor: 'bg-green-100 text-green-600',
        },
        {
            title: t('averageCgpa'),
            value: statistics?.averageCGPA?.toFixed(2) ?? '0.00',
            icon: TrendingUp,
            color: 'bg-purple-50',
            iconColor: 'bg-purple-100 text-purple-600',
        },
    ];

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cards.map((_, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow animate-pulse">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                                <div className="h-8 w-16 bg-gray-200 rounded" />
                            </div>
                            <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-start">
            {cards.map((card, index) => {
                const Icon = card.icon;
                return (
                    <div key={index} className={`${card.color} p-6 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-100`}>
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-2">{card.title}</p>
                                <h3 className="text-3xl font-bold text-gray-900">
                                    {card.value}
                                </h3>
                            </div>
                            <div className={`${card.iconColor} p-3 rounded-lg`}>
                                <Icon className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
