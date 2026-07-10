"use client";

import * as React from "react";
import {
  ChartColumn,
  LayoutDashboard,
  LifeBuoyIcon,
  ListTodo,
  SendIcon,
  GraduationCap,
  Users,
} from "lucide-react";

import { SidebarFooter } from "@/components/student/sidebar-footer";
import { SidebarMain } from "@/components/student/sidebar-main";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  sidebarMain: [
    {
      title: "Dashboard",
      url: "/professor/dashboard",
      icon: <LayoutDashboard />,
    },
    {
      title: "Students",
      url: "/professor/students",
      icon: <Users />,
    },
    {
      title: "Courses",
      url: "/professor/courses",
      icon: <ListTodo />,
    },
    {
      title: "Grades",
      url: "/professor/grades",
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
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/professor/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GraduationCap className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold">Control System</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Faculty of Engineering
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMain items={data.sidebarMain} />
        <SidebarFooter items={data.sidebarFooter} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  );
}