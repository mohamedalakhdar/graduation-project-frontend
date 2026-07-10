'use client';

import { useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/admin/header/Header';
import { MainContent } from '@/components/admin/MainContent';
import { useDir, useTranslations } from '@/i18n/IntlProvider';
import { JwtPayload } from '@/types';
import { ProfessorSidebar } from './sidebar/ProfessorSidebar';

interface ProfessorLayoutProps {
    children: React.ReactNode;
    decoded: JwtPayload | null;
}

export function ProfessorLayout({ children, decoded }: ProfessorLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const pathname = usePathname();
    const dir = useDir();
    const t = useTranslations('Sidebar');

    const pageTitle = useMemo(() => {
        if (pathname.includes('/courses')) return t('Courses');
        if (pathname.includes('/students')) return t('Students');
        if (pathname.includes('/pending')) return t('PendingRequests');
        return t('Dashboard');
    }, [pathname, t]);

    return (
        <div className="flex min-h-screen" dir={dir}>
            <ProfessorSidebar
                decoded={decoded}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className={`flex grow flex-col overflow-x-auto ${sidebarOpen ? 'ms-20 lg:ms-0' : ''}`}>
                <Header
                    decoded={decoded}
                    title={pageTitle}
                    onMenuClick={() => setSidebarOpen(!sidebarOpen)}
                />
                <MainContent>{children}</MainContent>
            </div>
        </div>
    );
}
