"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/admin/header/Header";
import { MainContent } from "@/components/admin/MainContent";
import { useDir, useTranslations } from "@/i18n/IntlProvider";
import { JwtPayload } from "@/types";
import { StudentSidebar } from "./sidebar/StudentSidebar";

interface StudentLayoutProps {
  children: React.ReactNode;
  decoded: JwtPayload | null;
}

export function StudentLayout({ children, decoded }: StudentLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const dir = useDir();
  const t = useTranslations("Student");

  const pageTitle = useMemo(() => {
    if (pathname.includes("/courses-registration")) return t("coursesRegistration");
    if (pathname.includes("/assign-advisor")) return t("assignAdvisor");
    if (pathname.includes("/study-schedule")) return t("studySchedule");
    if (pathname.includes("/grades")) return t("grades");
    if (pathname.includes("/profile")) return t("profile");
    return t("dashboard");
  }, [pathname, t]);

  return (
    <div className="flex min-h-screen" dir={dir}>
      <StudentSidebar
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
