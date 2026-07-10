/**
 * Sidebar Item Component
 * Individual navigation item in the sidebar
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LucideIcon } from 'lucide-react';

interface SidebarItemProps {
    label: string;
    href: string;
    icon: LucideIcon;
    isActive?: boolean;
    onClick?: () => void;
    isExpanded?: boolean;
}

export function SidebarItem({
    label,
    href,
    icon: Icon,
    isActive,
    onClick,
    isExpanded,
}: SidebarItemProps) {
    const pathname = usePathname();
    const active = isActive || pathname === href;

    return (
        <Link href={href}>
            <div
                onClick={onClick}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${active
                        ? 'bg-white/20 text-white font-semibold border-s-4 border-white'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
            >
                <Icon size={20} />
                {isExpanded && <span className="text-sm">{label}</span>}
            </div>
        </Link>
    );
}
