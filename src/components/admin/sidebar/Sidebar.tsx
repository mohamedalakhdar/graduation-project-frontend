/**
 * Sidebar Component
 * Collapsible sidebar with navigation and RTL/LTR support
 */

'use client';

import { useState } from 'react';
import {
    ChevronDown,
    BarChart3,
    Users,
    BookOpen,
    Menu,
    X,
    BellElectric,
    HousePlus,
    MonitorCog,
    Warehouse,
    Book,
    List,
    CalendarRange,
    ClipboardList,
} from 'lucide-react';
import { SidebarItem } from './SidebarItem';
import { useDir, useTranslations } from '@/i18n/IntlProvider';

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
    const [isExpanded, setIsExpanded] = useState(isOpen);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const dir = useDir();
    const t = useTranslations('Sidebar');

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    const handleUserDropdownClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsUserDropdownOpen(!isUserDropdownOpen);
    };

    // RTL: sidebar anchors to the right; LTR: anchors to the left
    const sideAnchor = dir === 'rtl' ? 'right-0' : 'left-0';

    return (
        <>
            {/* Mobile Overlay */}
            {isExpanded && (
                <div
                    className="fixed inset-0 bg-black/50 lg:hidden z-40"
                    onClick={() => {
                        setIsExpanded(false);
                        onClose?.();
                    }}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed ${sideAnchor} top-0 h-screen overflow-y-scroll bg-linear-to-b from-[#00284d] to-[#003465] text-white shadow-xl transition-all duration-300 z-50 ${
                    isExpanded ? 'w-64 lg:w-64' : 'w-fit'
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/20">
                    {isExpanded && (
                        <h1 className="text-lg font-bold text-white">{t('adminPanel')}</h1>
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

                {/* Navigation Items */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                    {/* Dashboard */}
                    <SidebarItem
                        label={t('Dashboard')}
                        href="/admin"
                        icon={BarChart3}
                        isExpanded={isExpanded}
                    />

                    {/* Users dropdown */}
                    <div>
                        <button
                            onClick={handleUserDropdownClick}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                                isUserDropdownOpen
                                    ? 'bg-white/20 text-white'
                                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            <Users size={20} />
                            {isExpanded && (
                                <>
                                    <span className="text-sm flex-1 text-start">{t('users')}</span>
                                    <ChevronDown
                                        size={16}
                                        className={`transition-transform duration-200 ${
                                            isUserDropdownOpen ? 'rotate-180' : ''
                                        }`}
                                    />
                                </>
                            )}
                        </button>

                        {/* Dropdown (expanded) */}
                        {isUserDropdownOpen && isExpanded && (
                            <div className="ms-4 mt-2 space-y-1 border-s-2 border-white/20 ps-2">
                                <SidebarItem
                                    label={t('Students')}
                                    href="/admin/students"
                                    icon={BookOpen}
                                    isExpanded={isExpanded}
                                    onClick={() => setIsUserDropdownOpen(false)}
                                />
                                <SidebarItem
                                    label={t('Professors')}
                                    href="/admin/professors"
                                    icon={BookOpen}
                                    isExpanded={isExpanded}
                                    onClick={() => setIsUserDropdownOpen(false)}
                                />
                            </div>
                        )}

                        {/* Collapsed direct links */}
                        {!isExpanded && isUserDropdownOpen && (
                            <div className="mt-2 space-y-1">
                                <SidebarItem
                                    label={t('Students')}
                                    href="/admin/students"
                                    icon={BookOpen}
                                    isExpanded={false}
                                />
                                <SidebarItem
                                    label={t('Professors')}
                                    href="/admin/professors"
                                    icon={BookOpen}
                                    isExpanded={false}
                                />
                            </div>
                        )}
                    </div>

                    {/* Departments */}
                    <SidebarItem
                        label={t('Departments')}
                        href="/admin/departments"
                        icon={BellElectric}
                        isExpanded={isExpanded}
                    />

                    {/* Programs */}
                    <SidebarItem
                        label={t('Programs')}
                        href="/admin/programs"
                        icon={HousePlus}
                        isExpanded={isExpanded}
                    />

                    {/* Courses */}
                    <SidebarItem
                        label={t('Courses')}
                        href="/admin/courses"
                        icon={Book}
                        isExpanded={isExpanded}
                    />

                    {/* Course Offerings */}
                    <SidebarItem
                        label={t('CourseOfferings')}
                        href="/admin/course-offering"
                        icon={List}
                        isExpanded={isExpanded}
                    />

                    {/* Registration Periods */}
                    <SidebarItem
                        label={t('RegistrationPeriods')}
                        href="/admin/registration-periods"
                        icon={CalendarRange}
                        isExpanded={isExpanded}
                    />

                    {/* Registrations */}
                    <SidebarItem
                        label={t('Registrations')}
                        href="/admin/registration"
                        icon={ClipboardList}
                        isExpanded={isExpanded}
                    />

                    {/* Control Engine */}
                    <SidebarItem
                        label={t('ControlEngine')}
                        href="/admin/control-engine"
                        icon={MonitorCog}
                        isExpanded={isExpanded}
                    />

                    {/* Faculty */}
                    <SidebarItem
                        label={t('Faculty')}
                        href="/admin/faculty"
                        icon={Warehouse}
                        isExpanded={isExpanded}
                    />
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-white/20 text-center">
                    {isExpanded && <p className="text-xs text-white/50">{t('Copyright')}</p>}
                </div>
            </aside>

            {/* Spacer for main content */}
            <div className={`transition-all duration-300 ${isExpanded ? 'lg:ms-64' : 'lg:ms-20'}`} />
        </>
    );
}
