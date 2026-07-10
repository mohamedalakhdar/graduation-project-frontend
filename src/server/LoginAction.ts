"use server";

import { LoginSchema } from "@/validation/auth/Login";
import { cookies } from "next/headers";

interface loginError {
    email?: string | null;
    password?: string | null;
}

export interface loginStates {
    success: boolean;
    message: string;
    formData: FormData;
    error: loginError | null;
    token?: string;
}

export async function loginAction(
    prevData: unknown,
    formData: FormData,
): Promise<loginStates> {

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const rawData = {
        email,
        password,
    };

    // make validation using ZOD
    const result = LoginSchema.safeParse(rawData);
    if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        return {
            success: false,
            message: "Login failed",
            formData,
            error: errors as loginError,
            token: undefined,
        };
    }

    // integrate with DB
    try {
        const res = await fetch(`${process.env.ENDPOINTS_URL}/api/accounts/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(rawData),
        });
        const data = await res.json();

        if (!res.ok) {
            return {
                success: false,
                message: data.name || "Invalid email or password",
                formData,
                error: null,
                token: undefined,
            };
        }

        // if logged in successfully, you can set cookies or do any other necessary actions here
        const cookieStore = await cookies();
        cookieStore.set("jwt", data.token);
        cookieStore.set("refreshToken", data.refreshToken);
        cookieStore.set("refreshTokenExpiresOn", data.refreshTokenExpiresOn);


        return {
            success: true,
            message: "Login successful",
            formData: new FormData(), // Clear form data on success
            error: null,
            token: data.token,
        };
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: "internal server error",
            formData,
            error: null,
            token: undefined,
        }
    }
}
