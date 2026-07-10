/**
 * Control Engine Dashboard Page
 * Parent component that owns all state and manages data fetching
 */

'use client';

import { useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import toast from 'react-hot-toast';
import {
    getControlStatistics,
    getWarningsStudents,
    getGraduatesStudents,
} from '@/server/ControlEngine';
import {
    ControlStatistics,
    WarningStudent,
    GraduationCandidate,
} from '@/types';
import { ControlModal } from '@/components/admin/modals/ControlModal';
import { StatisticsSection } from './StatisticsSection';
import { StudentStatusChart } from '@/components/admin/charts/StudentStatusChart';
import { AcademicStructureChart } from '@/components/admin/charts/AcademicStructureChart';
import { AcademicOverviewCards } from '@/components/admin/charts/AcademicOverviewCards';
import { ViewFilterDropdown } from './ViewFilterDropdown';
import { ControlEngineTable } from '../table/ControlEngineTable';
import { useTranslations } from '@/i18n/IntlProvider';

export default function ControlEnginePage() {
    const t = useTranslations('ControlEngine');
    const tc = useTranslations('Common');

    // State Management
    const [selectedView, setSelectedView] = useState<'warnings' | 'graduates'>('warnings');
    const [statistics, setStatistics] = useState<ControlStatistics | null>(null);
    const [warningsData, setWarningsData] = useState<WarningStudent[] | null>(null);
    const [graduatesData, setGraduatesData] = useState<GraduationCandidate[] | null>(null);

    const [isLoadingStatistics, setIsLoadingStatistics] = useState(true);
    const [isLoadingTable, setIsLoadingTable] = useState(true);
    const [isLoadingCharts, setIsLoadingCharts] = useState(true);
    const [isControlModalOpen, setIsControlModalOpen] = useState(false);
    const [pageError, setPageError] = useState<string | null>(null);
    const [graduatesLoaded, setGraduatesLoaded] = useState(false);

    /**
     * Fetch statistics and warnings data on mount
     */
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setIsLoadingStatistics(true);
                setIsLoadingTable(true);

                // Fetch both statistics and warnings in parallel
                const [statsResult, warningsResult] = await Promise.all([
                    getControlStatistics(),
                    getWarningsStudents(),
                ]);

                setStatistics(statsResult);
                setWarningsData(warningsResult);
                setPageError(null);
            } catch (error) {
                console.error('Error fetching initial data:', error);
                setPageError(t('errorFailedToLoadData'));
                toast.error(t('errorFailedToLoadStatsAndWarnings'));
            } finally {
                setIsLoadingStatistics(false);
                setIsLoadingTable(false);
            }
        };

        fetchInitialData();
    }, [t]);

    /**
     * Fetch charts data (for skeleton loading purposes)
     */
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoadingCharts(false);
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    /**
     * Handle view change - fetch graduates on first switch
     */
    const handleViewChange = async (view: 'warnings' | 'graduates') => {
        setSelectedView(view);

        if (view === 'graduates' && !graduatesLoaded) {
            try {
                setIsLoadingTable(true);
                const result = await getGraduatesStudents();
                setGraduatesData(result);
                setGraduatesLoaded(true);
                setPageError(null);
            } catch (error) {
                console.error('Error fetching graduates:', error);
                setPageError(t('errorFailedToLoadGraduates'));
                toast.error(t('errorFailedToLoadGraduates'));
            } finally {
                setIsLoadingTable(false);
            }
        }
    };

    /**
     * Handle Run Control Engine success
     */
    const handleControlEngineSuccess = async () => {
        try {
            // Refresh statistics and warnings
            const [statsResult, warningsResult] = await Promise.all([
                getControlStatistics(),
                getWarningsStudents(),
            ]);

            setStatistics(statsResult);
            setWarningsData(warningsResult);

            // Refresh graduates if they were already loaded
            if (graduatesLoaded) {
                const graduatesResult = await getGraduatesStudents();
                setGraduatesData(graduatesResult);
            }

            setPageError(null);
        } catch (error) {
            console.error('Error refreshing data:', error);
            setPageError(t('errorRefreshFailed'));
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-start">
                    <h2 className="text-3xl font-bold text-gray-900">{t('title')}</h2>
                    <p className="mt-1 text-gray-600">
                        {t('subtitle')}
                    </p>
                </div>
                <button
                    onClick={() => setIsControlModalOpen(true)}
                    className="px-4 py-2 bg-[#00284d] text-white rounded-lg hover:bg-[#003465] transition font-medium flex items-center gap-2 w-fit"
                >
                    <Play size={18} />
                    {t('btnRunControlEngine')}
                </button>
            </div>

            {/* Error State */}
            {pageError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-start">
                    {pageError}
                </div>
            )}

            {/* Statistics Section */}
            <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-start">{t('systemStatistics')}</h3>
                <StatisticsSection
                    statistics={statistics}
                    isLoading={isLoadingStatistics}
                />
            </div>

            {/* Charts Section */}
            <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-start">{t('analyticsOverview')}</h3>
                <div className="space-y-6">
                    {/* Student Status & Academic Structure */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <StudentStatusChart
                            statistics={statistics}
                            isLoading={isLoadingCharts}
                        />
                        <AcademicStructureChart
                            statistics={statistics}
                            isLoading={isLoadingCharts}
                        />
                    </div>

                    {/* Academic Overview */}
                    <div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6 text-start">
                                {t('academicOverviewTitle')}
                            </h3>
                            <AcademicOverviewCards
                                statistics={statistics}
                                isLoading={isLoadingCharts}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* View Filter */}
            <ViewFilterDropdown
                selectedView={selectedView}
                onViewChange={handleViewChange}
                isLoading={isLoadingTable}
            />

            {/* Data Table */}
            <ControlEngineTable
                data={
                    selectedView === 'warnings'
                        ? warningsData
                        : graduatesData
                }
                selectedView={selectedView}
                isLoading={isLoadingTable}
            />

            {/* Control Modal */}
            <ControlModal
                isOpen={isControlModalOpen}
                onClose={() => setIsControlModalOpen(false)}
                onSuccess={handleControlEngineSuccess}
            />
        </div>
    );
}
