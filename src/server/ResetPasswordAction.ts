"use server";

import { ResetPasswordSchema } from "@/validation/auth/ResetPassword";

interface resetPasswordError {
    password?: string | null;
}

export interface resetPasswordStates {
    success: boolean;
    message: string;
    formData: FormData;
    error: resetPasswordError | null; // No specific error structure defined for reset password
}

export async function resetPasswordAction(
    prevData: unknown,
    formData: FormData,
): Promise<resetPasswordStates> {
    const password = formData.get("password") as string;
    const userId = formData.get("userId") as string;
    const code = formData.get("code") as string;

    // validation
    const result = ResetPasswordSchema.safeParse({ password });
    if (!result.success) {
        return {
            success: false,
            message: "Invalid password format",
            formData: formData,
            error: result.error.flatten().fieldErrors as resetPasswordError,
        };
    }

    try {
        const data = await fetch(`${process.env.ENDPOINTS_URL}/api/accounts/reset-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, code, newPassword: password }),
        });
        const response = await data.json();

        if (!data.ok) {
            return {
                success: false,
                message: response.name || "Failed to reset password",
                formData: formData,
                error: null,
            };
        }
        return {
            success: true,
            message: response.name || "Password reset successfully",
            formData: formData,
            error: null,
        };
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: "Internal server error",
            formData: formData,
            error: null,
        }

    }
}