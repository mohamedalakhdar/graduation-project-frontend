'use client';

import { BarChart3, BookOpen, ClipboardList, Menu, Users, X } from 'lucide-react';
import { useState } from 'react';
import { SidebarItem } from '@/components/admin/sidebar/SidebarItem';
import { useDir, useTranslations } from '@/i18n/IntlProvider';
import { JwtPayload } from '@/types';
import { Roles } from '@/enums';

interface ProfessorSidebarProps {
    decoded: JwtPayload | null;
    isOpen?: boolean;
    onClose?: () => void;
}

function hasRole(roles: string | undefined, role: string) {
    return roles
        ?.split(',')
        .map((item) => item.trim())
        .includes(role) ?? false;
}

export function ProfessorSidebar({ decoded, isOpen = true, onClose }: ProfessorSidebarProps) {
    const [isExpanded, setIsExpanded] = useState(isOpen);
    const dir = useDir();
    const t = useTranslations('Sidebar');
    const isAdvisor = hasRole(decoded?.roles, Roles.Advisor);
    const sideAnchor = dir === 'rtl' ? 'right-0' : 'left-0';

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <>
            {isExpanded && (
                <div
                    className="fixed inset-0 bg-black/50 lg:hidden z-40"
                    onClick={() => {
                        setIsExpanded(false);
                        onClose?.();
                    }}
                />
            )}

            <aside
                className={`fixed ${sideAnchor}  h-screen overflow-y-scroll top-0 bg-linear-to-b from-[#00284d] to-[#003465] text-white shadow-xl transition-all duration-300 z-50 ${
                    isExpanded ? 'w-64 lg:w-64' : 'w-fit'
                }`}
            >
                <div className="flex items-center justify-between p-4 border-b border-white/20">
                    {isExpanded && (
                        <h1 className="text-lg font-bold text-white">{t('professorPanel')}</h1>
                    )}
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition"
                    >
                        {isExpanded ? <X size={20} /> : <Menu size={20} />}
                    </button>
                    <button
                        onClick={toggleSidebar}
                        className="hidden lg:block p-2 hover:bg-white/10 rounded-lg transition"
                    >
                        {isExpanded ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                    <SidebarItem
                        label={t('Dashboard')}
                        href="/professor/dashboard"
                        icon={BarChart3}
                        isExpanded={isExpanded}
                    />
                    <SidebarItem
                        label={t('Courses')}
                        href="/professor/courses"
                        icon={BookOpen}
                        isExpanded={isExpanded}
                    />
                    {isAdvisor && (
                        <>
                            <SidebarItem
                                label={t('Students')}
                                href="/professor/students"
                                icon={Users}
                                isExpanded={isExpanded}
                            />
                            <SidebarItem
                                label={t('PendingRequests')}
                                href="/professor/pending"
                                icon={ClipboardList}
                                isExpanded={isExpanded}
                            />
                        </>
                    )}
                </nav>

                <div className="p-4 border-t border-white/20 text-center">
                    {isExpanded && <p className="text-xs text-white/50">{t('Copyright')}</p>}
                </div>
            </aside>

            <div className={`transition-all duration-300 ${isExpanded ? 'lg:ms-64' : 'lg:ms-20'}`} />
        </>
    );
}
