/**
 * Admin Layout Component
 * Main wrapper for all admin pages
 */

'use client';

import { useState, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './sidebar/Sidebar';
import { Header } from './header/Header';
import { MainContent } from './MainContent';
import { useDir, useTranslations } from '@/i18n/IntlProvider';
import { JwtPayload } from '@/types';

interface AdminLayoutProps {
    children: React.ReactNode;
    decoded: JwtPayload | null;
}

export function AdminLayout({ children, decoded }: AdminLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const pathname = usePathname();
    const dir = useDir();
    const t = useTranslations('Sidebar');

    // Determine page title based on current route
    const pageTitle = useMemo(() => {
        if (pathname === '/admin' || pathname === '/admin/') return t('Dashboard');
        if (pathname.includes('/students')) return t('Students');
        if (pathname.includes('/professors')) return t('Professors');
        if (pathname.includes('/faculty')) return t('Faculty');
        if (pathname.includes('/departments')) return t('Departments');
        if (pathname.includes('/programs')) return t('Programs');
        if (pathname.includes('/courses')) return t('Courses');
        if (pathname.includes('/course-offering')) return t('CourseOfferings');
        if (pathname.includes('/registration-periods')) return t('RegistrationPeriods');
        if (pathname.includes('/registration')) return t('Registrations');
        if (pathname.includes('/control-engine')) return t('ControlEngine');
        return 'Admin Dashboard';
    }, [pathname, t]);

    const handleMenuClick = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="flex min-h-screen" dir={dir}>
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content Area */}
            <div className={`flex grow flex-col overflow-x-auto ${sidebarOpen ? 'ms-20 lg:ms-0' : ''}`}>
                {/* Header */}
                <Header decoded={decoded} title={pageTitle} onMenuClick={handleMenuClick} />

                {/* Page Content */}
                <MainContent>{children}</MainContent>
            </div>
        </div>
    );
}

