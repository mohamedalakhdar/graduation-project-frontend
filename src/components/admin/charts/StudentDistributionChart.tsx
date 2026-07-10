'use client';

import { ControlStatistics } from '@/types';
import { useTranslations } from '@/i18n/IntlProvider';

interface StudentDistributionChartProps {
    statistics: ControlStatistics | null;
    isLoading: boolean;
}

export function StudentDistributionChart({ statistics, isLoading }: StudentDistributionChartProps) {
    const t = useTranslations('Dashboard');

    if (isLoading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">{t('studentDistribution')}</h3>
                <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg animate-pulse" />
            </div>
        );
    }

    const total = statistics?.totalStudents || 1;
    const activeStudents = statistics?.activeStudents ?? 0;
    const warningStudents = statistics?.warningStudents ?? 0;
    const dismissedStudents = statistics?.dismissedStudents ?? 0;

    const activePercent = ((activeStudents / total) * 100).toFixed(1);
    const warningPercent = ((warningStudents / total) * 100).toFixed(1);
    const dismissedPercent = ((dismissedStudents / total) * 100).toFixed(1);

    const activeAngle = (activeStudents / total) * 360;
    const warningAngle = (warningStudents / total) * 360;
    const dismissedAngle = (dismissedStudents / total) * 360;

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">{t('studentDistribution')}</h3>

            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                {/* Pie Chart SVG */}
                <div className="flex-1 flex justify-center">
                    <svg width="200" height="200" viewBox="0 0 200 200" className="drop-shadow">
                        {/* Active Segment */}
                        <circle
                            cx="100"
                            cy="100"
                            r="80"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="40"
                            strokeDasharray={`${(activeAngle / 360) * 502.4} 502.4`}
                            transform="rotate(-90 100 100)"
                        />
                        {/* Warning Segment */}
                        <circle
                            cx="100"
                            cy="100"
                            r="80"
                            fill="none"
                            stroke="#f59e0b"
                            strokeWidth="40"
                            strokeDasharray={`${(warningAngle / 360) * 502.4} 502.4`}
                            strokeDashoffset={`-${(activeAngle / 360) * 502.4}`}
                            transform="rotate(-90 100 100)"
                        />
                        {/* Dismissed Segment */}
                        <circle
                            cx="100"
                            cy="100"
                            r="80"
                            fill="none"
                            stroke="#ef4444"
                            strokeWidth="40"
                            strokeDasharray={`${(dismissedAngle / 360) * 502.4} 502.4`}
                            strokeDashoffset={`-${((activeAngle + warningAngle) / 360) * 502.4}`}
                            transform="rotate(-90 100 100)"
                        />
                        {/* Center Text */}
                        <text
                            x="100"
                            y="100"
                            textAnchor="middle"
                            dy="0.3em"
                            className="text-2xl font-bold"
                            fill="#1f2937"
                        >
                            {statistics?.totalStudents ?? 0}
                        </text>
                    </svg>
                </div>

                {/* Legend and Stats */}
                <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-green-500 rounded-full" />
                        <div>
                            <p className="text-sm font-medium text-gray-900">{t('active')}</p>
                            <p className="text-lg font-bold text-gray-900">
                                {activeStudents} ({activePercent}%)
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-yellow-500 rounded-full" />
                        <div>
                            <p className="text-sm font-medium text-gray-900">{t('warning')}</p>
                            <p className="text-lg font-bold text-gray-900">
                                {warningStudents} ({warningPercent}%)
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-red-500 rounded-full" />
                        <div>
                            <p className="text-sm font-medium text-gray-900">{t('dismissed')}</p>
                            <p className="text-lg font-bold text-gray-900">
                                {dismissedStudents} ({dismissedPercent}%)
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
