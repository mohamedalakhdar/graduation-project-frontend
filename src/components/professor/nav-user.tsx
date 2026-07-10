"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronsUpDown, LogOutIcon, UserIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { getCurrentUser, logout } from "@/server/studentServer/studentActions";
import toast from "react-hot-toast";
import { ModeToggle } from "../ui/mode-toggle";
import { Separator } from "../ui/separator";

export function NavUser() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const data = await getCurrentUser();
        if (data && data.success !== false) {
          setUser(data);
        }
      } catch (error) {
        console.error("Failed to fetch user in NavUser:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const res = await logout();

      if (res.success) {
        toast.success("Logged out successfully");
      } else {
        toast.error(res.message || "Failed to logout");
      }

      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("An unexpected error occurred during logout.");
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 w-full p-2">
        <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
        <div className="space-y-1.5 hidden md:block flex-1">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-2 w-28" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-sm text-muted-foreground font-medium p-2">Guest</div>
    );
  }

  const displayName = (user.userName || user.name || "Professor")
    .split(" ")
    .slice(0, 2)
    .join(" ");

  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-center gap-2">
        <div className="shrink-0">
          <ModeToggle />
        </div>
        <Separator
          orientation="vertical"
          className="data-vertical:h-4 data-vertical:self-auto"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex-1"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-full bg-primary/10 font-medium text-primary">
                  {displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight md:grid">
                <span className="truncate font-medium">{displayName}</span>
                <span className="truncate text-xs text-muted-foreground capitalize">
                  {user.role || "professor"}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-48 p-2 rounded-lg"
            side="bottom"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link
                  href="/professor/profile"
                  className="cursor-pointer flex items-center gap-2"
                >
                  <UserIcon className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="cursor-pointer flex items-center gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOutIcon className="h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}