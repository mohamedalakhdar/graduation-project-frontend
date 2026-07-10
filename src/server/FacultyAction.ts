"use server";

import getTokenFromCookie from "@/utils/getCookie";
import type { JwtPayload } from "@/types";
import { facultyMemberSchema, updateDegreeFacultyMemberSchema, updateDepartmentFacultyMemberSchema, updateStatusFacultyMemberSchema } from "@/validation/faculty";
import { revalidatePath } from "next/cache";

interface facultyError {
    [key: string]: string;
}

export interface facultyStates {
    success: boolean;
    message: string;
    formData: FormData;
    error: facultyError | null
}

/**
 * @desc     get All advisor
 * @access   admin
*/
interface IGetAllAdvisors {
    search?: string;
    departmentId?: string;
    page?: number;
    pageSize?: number;
}
export async function getAllAdvisors({ departmentId, search, page, pageSize }: IGetAllAdvisors) {
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

        if (departmentId) {
            params.append("departmentId", departmentId);
        }

        // final url
        let url;
        if (page || pageSize || search || departmentId || status !== undefined) {
            url = `${process.env.ENDPOINTS_URL}/api/Faculty/advisors?${params.toString()}`;
        } else {
            url = `${process.env.ENDPOINTS_URL}/api/Faculty/advisors`;
        }

        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            next: { tags: ['facultyMember'] }
        })

        if (!res.ok) {
            return {
                success: false,
                message: "Failed to load faculty member",
                formData: null,
                error: null
            }
        }

        const data = await res.json();
        return data;

    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Internal server error",
            formData: null,
            error: null
        }
    }
}

/**
 * @desc     get All faculty member
 * @access   admin
*/
interface IGetAllFacultyMember {
    departmentId?: string,
    status?: string,
    search?: string,
    page?: number,
    pageSize?: number
}
export async function getAllFacultyMember({ departmentId, status, search, page, pageSize }: IGetAllFacultyMember) {
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

        if (departmentId) {
            params.append("departmentId", departmentId);
        }

        if (status !== undefined) {
            params.append("status", status.toString());
        }

        // final url
        let url;
        if (page || pageSize || search || departmentId || status !== undefined) {
            url = `${process.env.ENDPOINTS_URL}/api/Faculty?${params.toString()}`;
        } else {
            url = `${process.env.ENDPOINTS_URL}/api/Faculty`;
        }

        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            next: { tags: ['facultyMember'] }
        })

        if (!res.ok) {
            return {
                success: false,
                message: "Failed to load faculty member",
                formData: null,
                error: null
            }
        }

        const data = await res.json();
        return data;

    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Internal server error",
            formData: null,
            error: null
        }
    }
}

/**
 * @desc     create new student
 * @access   admin
*/
export async function createNewFacultyMember(prevState: unknown, formData: FormData): Promise<facultyStates> {
    // get raw data
    const userName = formData.get("userName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const fullName = formData.get("fullName") as string;
    const departmentId = formData.get("departmentId") as string;
    const degree = Number(formData.get("degree"))
    const isAdvisor = formData.get("isAdvisor") === "on";

    // validation with zod
    const result = facultyMemberSchema.safeParse({ userName, email, password, phoneNumber, fullName, departmentId, degree, isAdvisor });
    if (!result.success) {
        return {
            success: false,
            message: "Invalid faculty member format",
            formData: formData,
            error: result.error.flatten().fieldErrors as facultyError,
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

        const res = await fetch(`${process.env.ENDPOINTS_URL}/api/Faculty`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ userName, email, password, phoneNumber, fullName, departmentId, degree, isAdvisor }),
        });

        let data;
        try {
            data = await res.json();
        } catch {
            data = null;
        }

        if (!res.ok) {
            return {
                success: false,
                message: data?.message || data?.title || data?.name || "Failed to create new faculty member",
                formData: formData,
                error: null,
            }
        }

        // revalidate path after create new department
        revalidatePath('/admin/faculty', 'page')

        return {
            success: true,
            message: "Faculty Member created successfully",
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
 * @desc     get Single Faculty Member
 * @access   admin
*/
export async function getAdvisorOrProfData(id: string) {
    try {
        // get token form cookies
        const token = await getTokenFromCookie();

        const res = await fetch(`${process.env.ENDPOINTS_URL}/api/Faculty/by-user/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            next: { tags: ['singleFacultyMember'] }
        })

        if (!res.ok) {
            return null;
        }

        const data = await res.json();
        return data;

    } catch (error) {
        console.log(error);
        return { message: "Internal Server Error" }
    }
}

/**
 * @desc     get Single Faculty Member
 * @access   admin
*/
export async function getSingleFacultyMember(id: string) {
    try {
        // get token form cookies
        const token = await getTokenFromCookie();

        const res = await fetch(`${process.env.ENDPOINTS_URL}/api/Faculty/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            next: { tags: ['singleFacultyMember'] }
        })

        if (!res.ok) {
            return null;
        }

        const data = await res.json();
        return data;

    } catch (error) {
        console.log(error);
        return { message: "Internal Server Error" }
    }
}

/**
 * @desc     get faculty courses
 * @access   admin
*/
export async function getFacultyCourses(id: string) {
    try {
        // get token form cookies
        const token = await getTokenFromCookie();

        // get advisor or prof data
        const dataAdvisorOrProf = await getAdvisorOrProfData(id);

        const res = await fetch(`${process.env.ENDPOINTS_URL}/api/Faculty/${dataAdvisorOrProf.id}/courses`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            next: { tags: ['facultyCourses'] }
        })

        if (!res.ok) {
            return {
                success: false,
                message: "Failed to load faculty courses",
                formData: null,
                error: null
            }
        }

        const data = await res.json();
        return data;

    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Internal server error",
            formData: null,
            error: null
        }
    }
}

/**
 * @desc     get advisor students
 * @access   admin
*/
export async function getAdvisorStudents(id: string) {
    try {
        // get token form cookies
        const token = await getTokenFromCookie();

        // get advisor or prof data
        const dataAdvisorOrProf = await getAdvisorOrProfData(id);

        const res = await fetch(`${process.env.ENDPOINTS_URL}/api/Faculty/${dataAdvisorOrProf.id}/advisees`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            next: { tags: ['advisorStudents'] }
        })

        if (!res.ok) {
            return {
                success: false,
                message: "Failed to load advisor students",
                formData: null,
                error: null
            }
        }

        const data = await res.json();
        return data;

    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Internal server error",
            formData: null,
            error: null
        }
    }
}

/**
 * @desc     update degree for Single faculty member
 * @access   admin
*/
export async function updateDegreeFacultyMember({ facultyMemberId, newDegree }: { facultyMemberId: string, newDegree: number }) {
    // validation with zod
    console.log("first")
    console.log(newDegree)
    const result = updateDegreeFacultyMemberSchema.safeParse({ newDegree });
    console.log(result)
    if (!result.success) {
        return {
            success: false,
            message: "Invalid program format",
            newDegree: newDegree,
            error: result.error.flatten().fieldErrors as facultyError,
        };
    }

    try {
        // get token form cookies
        const token = await getTokenFromCookie();

        const res = await fetch(`${process.env.ENDPOINTS_URL}/api/Faculty/${facultyMemberId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ newDegree: Number(newDegree) })
        })


        if (!res.ok) {
            return {
                success: false,
                message: "An Error Occurred, Please Try Again!",
                newDegree: newDegree,
                error: null
            }
        }

        return {
            success: true,
            message: "Degree Updated Successfully",
            formData: new FormData(),
            error: null
        }

    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Internal Server Error!",
            newDegree: newDegree,
            error: null
        }
    }
}

/**
 * @desc     update department for Single faculty member
 * @access   admin
*/
export async function updateDepartmentFacultyMember({ facultyMemberId, newDepartmentId }: { facultyMemberId: string, newDepartmentId: string }) {
    // validation with zod
    const result = updateDepartmentFacultyMemberSchema.safeParse({ newDepartmentId });
    if (!result.success) {
        return {
            success: false,
            message: "Invalid program format",
            newDepartmentId: newDepartmentId,
            error: result.error.flatten().fieldErrors as facultyError,
        };
    }

    try {
        // get token form cookies
        const token = await getTokenFromCookie();

        const res = await fetch(`${process.env.ENDPOINTS_URL}/api/Faculty/${facultyMemberId}/transfer`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ newDepartmentId })
        })

        if (!res.ok) {
            return {
                success: false,
                message: "An Error Occurred, Please Try Again!",
                newDepartmentId: newDepartmentId,
                error: null
            }
        }

        return {
            success: true,
            message: "Department Updated Successfully",
            formData: new FormData(),
            error: null
        }

    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Internal Server Error!",
            newDepartmentId: newDepartmentId,
            error: null
        }
    }
}

/**
 * @desc     update department for Single faculty member
 * @access   admin
*/
export async function updateStatusFacultyMember({ facultyMemberId, newStatus }: { facultyMemberId: string, newStatus: number }) {
    // validation with zod
    const result = updateStatusFacultyMemberSchema.safeParse({ newStatus });
    if (!result.success) {
        return {
            success: false,
            message: "Invalid program format",
            newStatus: newStatus,
            error: result.error.flatten().fieldErrors as facultyError,
        };
    }

    try {
        // get token form cookies
        const token = await getTokenFromCookie();

        const res = await fetch(`${process.env.ENDPOINTS_URL}/api/Faculty/${facultyMemberId}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ newStatus: Number(newStatus) })
        })

        if (!res.ok) {
            return {
                success: false,
                message: "An Error Occurred, Please Try Again!",
                newStatus: newStatus,
                error: null
            }
        }

        return {
            success: true,
            message: "Status Updated Successfully",
            formData: new FormData(),
            error: null
        }

    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Internal Server Error!",
            newStatus: newStatus,
            error: null
        }
    }
}
