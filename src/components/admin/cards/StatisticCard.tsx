'use client';

import { LucideIcon } from 'lucide-react';
import { useTranslations } from '@/i18n/IntlProvider';

interface StatisticCardProps {
    title: string;
    value: number | string;
    icon: LucideIcon;
    iconBgColor: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    description?: string;
}

export function StatisticCard({
    title,
    value,
    icon: Icon,
    iconBgColor,
    trend,
    description,
}: StatisticCardProps) {
    const t = useTranslations('Dashboard');

    return (
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-sm text-gray-600 font-medium">{title}</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-1">{value}</h3>
                    {description && <p className="text-xs text-gray-500 mt-2">{description}</p>}
                </div>
                <div
                    className={`${iconBgColor} p-3 rounded-full flex items-center justify-center`}
                >
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>

            {/* Trend Indicator */}
            {trend && (
                <div className="flex items-center gap-1 text-sm">
                    <span
                        className={`font-semibold ${trend.isPositive ? 'text-green-600' : 'text-red-600'
                            }`}
                    >
                        {trend.isPositive ? '+' : '-'}
                        {trend.value}%
                    </span>
                    <span className="text-gray-500">{t('fromLastMonth')}</span>
                </div>
            )}
        </div>
    );
}
