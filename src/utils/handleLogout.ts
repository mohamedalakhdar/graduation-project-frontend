"use client";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";

export const handleLogout = (router: AppRouterInstance) => {
    document.cookie = 'jwt=; path=/; max-age=0; SameSite=Lax';
    document.cookie = 'refreshToken=; path=/; max-age=0; SameSite=Lax';
    document.cookie = 'refreshTokenExpiresOn=; path=/; max-age=0; SameSite=Lax';
    localStorage.removeItem('auth_token');
    localStorage.removeItem('jwt');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('refreshTokenExpiresOn');
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('jwt');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('refreshTokenExpiresOn');
    router.replace('/login');
    router.refresh();
};