"use server";

import getTokenFromCookie from "@/utils/getCookie";
import { CreateDepartmentSchema } from "@/validation/department";
import { revalidatePath } from 'next/cache'

interface departmentError {
    name?: string;
    description?: string;
}

export interface departmentStates {
    success: boolean;
    message: string;
    formData: FormData;
    error: departmentError | null
}

/**
 * @desc     create new department
 * @access   admin
*/
export async function createNewDepartment(prevState: unknown, formData: FormData): Promise<departmentStates> {
    // get raw data
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    // validation with zod
    const result = CreateDepartmentSchema.safeParse({ name, description });
    if (!result.success) {
        return {
            success: false,
            message: "Invalid department format",
            formData: formData,
            error: result.error.flatten().fieldErrors as departmentError,
        };
    }

    // integrate with DB
    try {
        // get token from cookies
        const token = await getTokenFromCookie();

        if (!token) {
            return {
                success: false,
                message: "Unauthorized, Please Login First!",
                formData: formData,
                error: null,
            }
        }

        const res = await fetch(`${process.env.ENDPOINTS_URL}/api/departments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ name, description })
        });

        if (!res.ok) {
            return {
                success: false,
                message: "Failed to create new department",
                formData: formData,
                error: null,
            }
        }

        // revalidate path after create new department
        revalidatePath('/admin/departments', 'page')

        return {
            success: true,
            message: "Department created successfully",
            formData: new FormData(), // Clear form data on success
            error: null,
        }

    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: "internal server error",
            formData: formData,
            error: null,
        }
    }
}

/**
 * @desc     get All department
 * @access   admin
*/
export async function getAllDepartment({ page, pageSize, search }: { page?: number, pageSize?: number, search?: string }) {
    try {
        // get token form cookies
        const token = await getTokenFromCookie();

        // create params
        const params = new URLSearchParams();

        if (page) {
            params.append("page", String(page));
        }

        if (pageSize) {
            params.append("pageSize", String(pageSize));
        }

        if (search) {
            params.append("search", search);
        }

        // final url
        let url;
        if (page || pageSize || search) {
            url = `${process.env.ENDPOINTS_URL}/api/departments?${params.toString()}`;
        } else {
            url = `${process.env.ENDPOINTS_URL}/api/departments`;
        }

        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            next: { tags: ['departments'] }
        })

        if (!res.ok) {
            return null;
        }

        const data = await res.json();
        return data;

    } catch (error) {
        console.log(error);
        return null;
    }
}

/**
 * @desc     delete specific department
 * @access   admin
*/
export async function deleteDepartment(id: string) {
    try {
        // get token from cookies
        const token = await getTokenFromCookie();

        const res = await fetch(`${process.env.ENDPOINTS_URL}/api/departments/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        if (!res.ok) {
            return {
                message: "deleted department is not completed, please try again!"
            }
        }

        // revalidate path after create new department
        revalidatePath('/admin/departments', 'page')

        return { message: "department is deleted successfully!" }


    } catch (error) {
        console.log(error);
        return {
            message: "internal server error, deleted department is not completed!"
        }
    }
}

/**
 * @desc     update specific department
 * @access   admin
*/
export async function updateDepartment(prevState: unknown, formData: FormData): Promise<departmentStates> {
    // get raw data
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const id = formData.get("id") as string;
    console.log("ID FOR TEST", id)

    // validation with zod
    const result = CreateDepartmentSchema.safeParse({ name, description });
    if (!result.success) {
        return {
            success: false,
            message: "Invalid department format",
            formData: formData,
            error: result.error.flatten().fieldErrors as departmentError,
        };
    }

    // integrate with DB
    try {
        // get token from cookies
        const token = await getTokenFromCookie();

        if (!token) {
            return {
                success: false,
                message: "Unauthorized, Please Login First!",
                formData: formData,
                error: null,
            }
        }

        const res = await fetch(`${process.env.ENDPOINTS_URL}/api/departments/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ name, description })
        });

        if (!res.ok) {
            return {
                success: false,
                message: "Failed to create new department",
                formData: formData,
                error: null,
            }
        }

        // revalidate path after create new department
        revalidatePath('/admin/departments', 'page')

        return {
            success: true,
            message: "Department created successfully",
            formData: new FormData(), // Clear form data on success
            error: null,
        }

    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: "internal server error",
            formData: formData,
            error: null,
        }
    }
}