"use client"

import * as React from "react"
import { Calendar, ChartColumn, LayoutDashboard, LifeBuoyIcon, ListTodo, SendIcon, GraduationCap, UserPlus2 } from "lucide-react"
import { useTranslations } from "@/i18n/IntlProvider"

import { SidebarFooter } from "@/components/student/sidebar-footer"
import { SidebarMain } from "./sidebar-main"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  sidebarMain: [
    {
      title: "Dashboard",
      url: "/student/dashboard",
      icon: <LayoutDashboard />,
    },
    {
      title: "Courses Registration",
      url: "/student/courses-registration",
      icon: <ListTodo />,
    },
    {
      title: "Assign Advisor",
      url: "/student/assign-advisor",
      icon: <UserPlus2 />,
    },
    {
      title: "Study Schedule",
      url: "/student/study-schedule",
      icon: <Calendar />,
    },
    {
      title: "Grades",
      url: "/student/grades",
      icon: <ChartColumn />,
    },
  ],
  sidebarFooter: [
    {
      title: "Support",
      url: "#",
      icon: <LifeBuoyIcon />,
    },
    {
      title: "Feedback",
      url: "#",
      icon: <SendIcon />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations("Student")
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/student/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GraduationCap className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold">{t("controlSystem")}</span>
                  <span className="truncate text-xs text-muted-foreground">{t("facultyOfEngineering")}</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMain
          items={data.sidebarMain.map((item) => ({
            ...item,
            title:
              item.title === "Dashboard"
                ? t("dashboard")
                : item.title === "Courses Registration"
                  ? t("coursesRegistration")
                  : item.title === "Assign Advisor"
                    ? t("assignAdvisor")
                    : item.title === "Study Schedule"
                      ? t("studySchedule")
                      : item.title === "Grades"
                        ? t("grades")
                        : item.title,
          }))}
        />
        <SidebarFooter
          items={data.sidebarFooter.map((item) => ({
            ...item,
            title: item.title === "Support" ? t("support") : t("feedback"),
          }))}
          className="mt-auto"
        />
      </SidebarContent>
    </Sidebar>
  )
}
