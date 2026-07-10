/**
 * Header Component
 * Top navigation bar for admin dashboard
 */

'use client';

import { useState } from 'react';
import { LogOut, User, Globe } from 'lucide-react';
import Link from 'next/link';
import { useLocale, useTranslations } from '@/i18n/IntlProvider';
import { handleLogout } from '@/utils/handleLogout';
import { useRouter } from 'next/navigation';
import { JwtPayload } from '@/types';

interface HeaderProps {
    title?: string;
    onMenuClick?: () => void;
    decoded: JwtPayload | null;
}

export function Header({ title = 'Dashboard', decoded }: HeaderProps) {
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const locale = useLocale();
    const router = useRouter();
    const t = useTranslations('Header');
    const isAdmin = decoded?.roles
        ?.split(',')
        .map((role) => role.trim())
        .includes('Admin');
    const isStudent = decoded?.roles
        ?.split(',')
        .map((role) => role.trim())
        .includes('Student');
    const displayName = isAdmin ? t('adminUser') : decoded?.email?.split('@')[0] || t('adminUser');
    const displayRole = isAdmin ? t('administrator') : decoded?.roles || t('administrator');


    const handleLocaleChange = (newLocale: string) => {
        document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
        window.location.reload();
    };

    return (
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                {/* Page Title */}
                <h1 className="text-xl font-bold text-gray-800">{title}</h1>

                {/* Right Side — Language + Profile */}
                <div className="flex items-center gap-3">

                    {/* Language Switcher */}
                    <div className="flex items-center gap-1.5">
                        <Globe size={16} className="text-gray-500" />
                        <select
                            value={locale}
                            onChange={(e) => handleLocaleChange(e.target.value)}
                            className="bg-white border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-[#00284d] py-1 px-2 transition cursor-pointer"
                            aria-label="Select language"
                        >
                            <option value="en">English</option>
                            <option value="ar">العربية</option>
                        </select>
                    </div>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                            <div className="w-8 h-8 bg-gradient-to-br from-[#00284d] to-[#003465] rounded-full flex items-center justify-center">
                                <User size={16} className="text-white" />
                            </div>
                            <span className="hidden sm:block text-sm font-medium text-gray-700">
                                {displayName}
                            </span>
                        </button>

                        {/* Dropdown Menu */}
                        {isProfileDropdownOpen && (
                            <div className="absolute end-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                <div className="p-3 border-b border-gray-200">
                                    <p className="text-sm font-semibold text-gray-800">{displayRole}</p>
                                    <p className="text-xs text-gray-500">{decoded?.email}</p>
                                </div>

                                {isStudent && (
                                    <Link
                                        href="/student/profile"
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                                        onClick={() => setIsProfileDropdownOpen(false)}
                                    >
                                        <User size={16} />
                                        {t('profile')}
                                    </Link>
                                )}

                                <button
                                    onClick={() => handleLogout(router)}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                                >
                                    <LogOut size={16} />
                                    {t('logout')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
