'use client';

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations, useDir } from "@/i18n/IntlProvider";

interface PaginationProps {
    totalCount: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
}

export default function Pagination({
    totalCount,
    currentPage,
    totalPages,
    pageSize,
    onPageChange,
    onPageSizeChange,
}: PaginationProps) {
    const t = useTranslations('Pagination');
    const dir = useDir();

    const generatePages = () => {
        const pages: (number | string)[] = [];

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);

            if (currentPage > 3) {
                pages.push("...");
            }

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push("...");
            }

            pages.push(totalPages);
        }

        return pages;
    };

    // ChevronLeft/Right direction depends on text direction
    const PrevIcon = dir === 'rtl' ? ChevronRight : ChevronLeft;
    const NextIcon = dir === 'rtl' ? ChevronLeft : ChevronRight;

    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">

            {/* Page Size */}
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{t('rowsPerPage')}:</span>

                <select
                    value={pageSize}
                    onChange={(e) => onPageSizeChange(Number(e.target.value))}
                    className="px-3 py-2 border border-gray-300 rounded-xl bg-white text-sm outline-none focus:ring-2 focus:ring-[#00284d]"
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>

                {totalCount !== 0 && (
                    <span className="flex items-center gap-2 text-sm text-gray-600">
                        {t('showing', {
                            from: String(((currentPage - 1) * pageSize) + 1),
                            to: String(Math.min(currentPage * pageSize, totalCount)),
                            total: String(totalCount),
                        })}
                    </span>
                )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 flex-wrap">

                {/* Previous */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label={t('previous')}
                    className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-300 bg-white shadow-sm hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <PrevIcon size={18} />
                </button>

                {/* Pages */}
                {generatePages().map((page, index) =>
                    page === "..." ? (
                        <span
                            key={index}
                            className="w-10 h-10 flex items-center justify-center text-gray-500"
                        >
                            ...
                        </span>
                    ) : (
                        <button
                            key={index}
                            onClick={() => onPageChange(Number(page))}
                            className={`w-10 h-10 rounded-xl text-sm font-medium transition shadow-sm
                ${currentPage === page
                                    ? "bg-[#00284d] text-white"
                                    : "bg-white border border-gray-300 hover:bg-gray-100"
                                }`}
                        >
                            {page}
                        </button>
                    )
                )}

                {/* Next */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label={t('next')}
                    className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-300 bg-white shadow-sm hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <NextIcon size={18} />
                </button>
            </div>
        </div>
    );
}