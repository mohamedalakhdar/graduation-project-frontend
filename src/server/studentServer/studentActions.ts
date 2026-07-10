"use server";

import { Locale } from "@/i18n";
import getTokenFromCookie from "@/utils/getCookie";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// ** This file contains all the server-side actions related to student operations,
// ** such as fetching student information, updating details, and handling registrations.
// ** Each function is designed to interact with the backend API securely using the JWT token stored in cookies.

// ** Fetches the student's information from the backend API.
export async function getStudentInformation() {
  const BASE_URL = process.env.ENDPOINTS_URL;
  const token = await getTokenFromCookie();

  if (!token) {
    return { success: false, message: "Unauthorized, Please Login First!" };
  }

  try {
    const res = await fetch(`${BASE_URL}/api/Students/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "force-cache",
    });

    if (!res.ok) {
      return {
        success: false,
        message: `Failed to fetch student information: ${res.status}`,
      };
    }

    const data = await res.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ** Updates the student's information (full name and national ID) in the backend API.
export async function updateStudentInformation(
  fullName: string,
  nationalId: string,
  id: string,
) {
  const BASE_URL = process.env.ENDPOINTS_URL;
  const token = await getTokenFromCookie();

  if (!token) {
    return { success: false, message: "Unauthorized, Please Login First!" };
  }

  try {
    const res = await fetch(`${BASE_URL}/api/Students/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        newFullName: fullName,
        newNationalId: nationalId,
      }),
      cache: "force-cache",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || `Failed to update student: ${res.status}`,
      };
    }

    const responseText = await res.text();
    const data = responseText ? JSON.parse(responseText) : {};

    revalidatePath("/student/profile");
    revalidatePath("/student/dashboard");

    return {
      success: true,
      message: "Student information updated successfully",
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ** Fetches the student's courses from the backend API.
export async function getStudentCourses(id: string) {
  const BASE_URL = process.env.ENDPOINTS_URL;
  const token = await getTokenFromCookie();

  if (!token) {
    return { success: false, message: "Unauthorized, Please Login First!" };
  }

  try {
    const res = await fetch(`${BASE_URL}/api/registrations/schedule/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        message:
          errorData.message || `Failed to fetch student courses: ${res.status}`,
      };
    }

    const data = await res.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ** Fetches the current user's information (username and role) from the backend API.
export async function getCurrentUser() {
  const BASE_URL = process.env.ENDPOINTS_URL;
  const token = await getTokenFromCookie();

  if (!token) {
    return { success: false, message: "Unauthorized, Please Login First!" };
  }

  try {
    const res = await fetch(`${BASE_URL}/api/accounts/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "force-cache",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        message:
          errorData.message || `Failed to fetch current user: ${res.status}`,
      };
    }

    const data = await res.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ** Logs out the current user by revoking the refresh token and clearing cookies.
export async function logout() {
  const BASE_URL = process.env.ENDPOINTS_URL;
  const token = await getTokenFromCookie();

  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!token) {
    return { success: false, message: "Unauthorized, Please Login First!" };
  }

  try {
    const res = await fetch(`${BASE_URL}/api/accounts/revoke-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || `Failed to logout: ${res.status}`,
      };
    }

    cookieStore.delete("jwt");
    cookieStore.delete("refreshToken");
    cookieStore.delete("refreshTokenExpiresOn");

    return {
      success: true,
      message: "Logged out successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ** Fetches the student's grades from the backend API.
export async function getStudentGrades(id: string) {
  const BASE_URL = process.env.ENDPOINTS_URL;
  const token = await getTokenFromCookie();

  if (!token) {
    return { success: false, message: "Unauthorized, Please Login First!" };
  }

  try {
    const res = await fetch(`${BASE_URL}/api/Students/${id}/transcript`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "force-cache",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        message:
          errorData.message || `Failed to fetch student grades: ${res.status}`,
      };
    }

    const data = await res.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ** Fetches the student's available registrations from the backend API.
export async function getAvailableRegistrations(
  id: string,
  term: string,
  year: number,
) {
  const BASE_URL = process.env.ENDPOINTS_URL;
  const token = await getTokenFromCookie();

  if (!token) {
    return { success: false, message: "Unauthorized, Please Login First!" };
  }

  try {
    const res = await fetch(
      `${BASE_URL}/api/registrations/available?studentId=${id}&term=${term}&year=${year}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "force-cache",
      },
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        message:
          errorData.message ||
          `Failed to fetch student available registraions: ${res.status}`,
      };
    }

    const data = await res.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ** Fetches the current registration period from the backend API.
export async function getRegistrationPeriod() {
  const BASE_URL = process.env.ENDPOINTS_URL;
  const token = await getTokenFromCookie();

  if (!token) {
    return { success: false, message: "Unauthorized, Please Login First!" };
  }

  try {
    const res = await fetch(`${BASE_URL}/api/registration-periods/current`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "force-cache",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        message:
          errorData.message ||
          `Failed to fetch registration period: ${res.status}`,
      };
    }

    const data = await res.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ** Fetches the list of course offerings from the backend API.
export async function getCourseOfferings() {
  const BASE_URL = process.env.ENDPOINTS_URL;
  const token = await getTokenFromCookie();

  if (!token) {
    return { success: false, message: "Unauthorized, Please Login First!" };
  }

  try {
    const res = await fetch(`${BASE_URL}/api/course-offerings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "force-cache",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        message:
          errorData.message ||
          `Failed to fetch course offerings: ${res.status}`,
      };
    }

    const data = await res.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ** Registers a student for a specific course offering in the backend API.
export async function registerCourse(
  studentId: string,
  courseOfferingId: string,
) {
  const BASE_URL = process.env.ENDPOINTS_URL;
  const token = await getTokenFromCookie();

  if (!token) {
    return { success: false, message: "Unauthorized, Please Login First!" };
  }

  try {
    const res = await fetch(`${BASE_URL}/api/registrations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        studentId: studentId,
        courseOfferingId: courseOfferingId,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        message:
          errorData.message || `Failed to register course: ${res.status}`,
      };
    }

    return { success: true, message: "Course registered successfully!" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ** Fetches the student's registrations from the backend API.
export async function getStudentRegistrations(studentId: string) {
  const BASE_URL = process.env.ENDPOINTS_URL;
  const token = await getTokenFromCookie();

  if (!token) {
    return { success: false, message: "Unauthorized, Please Login First!" };
  }

  try {
    const res = await fetch(
      `${BASE_URL}/api/registrations/student/${studentId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "force-cache",
      },
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        message:
          errorData.message ||
          `Failed to fetch student registrations: ${res.status}`,
      };
    }

    const data = await res.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ** Fetshes all advisors to student.
export async function getAllAdvisors() {
  const BASE_URL = process.env.ENDPOINTS_URL;
  const token = await getTokenFromCookie();

  if (!token) {
    return { success: false, message: "Unauthorized, Please Login First!" };
  }

  try {
    const res = await fetch(`${BASE_URL}/api/Faculty/advisors`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "force-cache",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        message:
          errorData.message ||
          `Failed to fetch student registrations: ${res.status}`,
      };
    }

    const data = await res.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function assignAdvisorToStudent(
  studentId: string,
  advisorId: string,
) {
  const BASE_URL = process.env.ENDPOINTS_URL;
  const token = await getTokenFromCookie();

  if (!token) {
    return { success: false, message: "Unauthorized, Please Login First!" };
  }

  try {
    const res = await fetch(
      `${BASE_URL}/api/Students/${studentId}/assign-advisor`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          advisorId: advisorId,
        }),
      },
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        message:
          errorData.message ||
          `Failed to assign advisor: ${res.status}`,
      };
    }

    return {
      success: true,
      message: "Advisor assigned successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}