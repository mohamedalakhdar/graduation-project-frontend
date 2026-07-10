'use client';

import { useEffect, useState } from 'react';
import { getControlStatistics } from '@/server/ControlEngine';
import { ControlStatistics } from '@/types';
import { DashboardStats } from '@/components/admin/dashboard/DashboardStats';
import { StudentDistributionChart } from '@/components/admin/charts/StudentDistributionChart';
import { GpaDistributionChart } from '@/components/admin/charts/GpaDistributionChart';
import { useTranslations } from '@/i18n/IntlProvider';

export default function AdminPage() {
  const t = useTranslations('Dashboard');

  const [statistics, setStatistics] = useState<ControlStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const result = await getControlStatistics();
        setStatistics(result);
      } catch (error) {
        console.error('Error fetching dashboard statistics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">{t('welcome')}</h2>
        <p className="mt-2 text-gray-600">
          {t('welcomeSubtitle')}
        </p>
      </div>

      {/* Statistics Cards */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('quickStats')}</h3>
        <DashboardStats statistics={statistics} isLoading={isLoading} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StudentDistributionChart statistics={statistics} isLoading={isLoading} />
        <GpaDistributionChart statistics={statistics} isLoading={isLoading} />
      </div>
    </div>
  );
}
