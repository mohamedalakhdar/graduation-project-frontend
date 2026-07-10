"use client";

import { BarChart3, ListTodo, UserPlus2, Calendar, ChartColumn, Menu, X } from "lucide-react";
import { useState } from "react";
import { SidebarItem } from "@/components/admin/sidebar/SidebarItem";
import { useDir, useTranslations } from "@/i18n/IntlProvider";
import { JwtPayload } from "@/types";

interface StudentSidebarProps {
  decoded: JwtPayload | null;
  isOpen?: boolean;
  onClose?: () => void;
}

export function StudentSidebar({ decoded, isOpen = true, onClose }: StudentSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(isOpen);
  const dir = useDir();
  const t = useTranslations("Student");
  const sideAnchor = dir === "rtl" ? "right-0" : "left-0";

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
        className={`fixed ${sideAnchor} top-0 h-screen bg-linear-to-b from-[#00284d] to-[#003465] text-white shadow-xl transition-all duration-300 z-50 ${
          isExpanded ? "w-64 lg:w-64" : "w-20 lg:w-20"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          {isExpanded && (
            <h1 className="text-lg font-bold text-white">{t("studentPanel", { namespace: "Sidebar" }) || "Student Panel"}</h1>
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
            label={t("dashboard")}
            href="/student/dashboard"
            icon={BarChart3}
            isExpanded={isExpanded}
          />
          <SidebarItem
            label={t("coursesRegistration")}
            href="/student/courses-registration"
            icon={ListTodo}
            isExpanded={isExpanded}
          />
          <SidebarItem
            label={t("assignAdvisor")}
            href="/student/assign-advisor"
            icon={UserPlus2}
            isExpanded={isExpanded}
          />
          <SidebarItem
            label={t("studySchedule")}
            href="/student/study-schedule"
            icon={Calendar}
            isExpanded={isExpanded}
          />
          <SidebarItem
            label={t("grades")}
            href="/student/grades"
            icon={ChartColumn}
            isExpanded={isExpanded}
          />
        </nav>

        <div className="p-4 border-t border-white/20 text-center">
          {isExpanded && <p className="text-xs text-white/50">{t("Copyright", { namespace: "Sidebar" }) || "© 2026 SIS Admin"}</p>}
        </div>
      </aside>

      <div className={`transition-all duration-300 ${isExpanded ? "lg:ms-64" : "lg:ms-20"}`} />
    </>
  );
}
