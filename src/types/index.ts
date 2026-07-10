import { CourseGrade } from "@/components/student/grades-table";
import { FacultyStatus } from "@/enums";

/**
 * @desc    jwt payload type definition
 */
export interface JwtPayload {
    sub: string;
    jti: string;
    email: string;
    uid: string;
    roles: string;
    exp: number;
    iss: string;
    aud: string;
}

/**
 * Core Type Definitions for Admin Dashboard
 */

export type StudentStatus = 'GoodStanding' | 'Dismissed' | string;
export type UserRole = 'Admin' | 'Student' | 'Professor';

/**
 * Program interface
 */
// export interface Program {
//     id: string;
//     name: string;
//     code: string;
// }

/**
 * Student interface
 */
export interface Student {
    id: string;
    userName?: string;
    email?: string;
    password?: string;
    phoneNumber?: string;
    fullName: string;
    academicNumber?: string;
    academicStatus?: StudentStatus;
    academicLevel?: string;
    nationalId?: string;
    programId?: string;
    programName?: string;
    gpa?: number;
    cgpa?: number;
    status?: StudentStatus;
    createdAt?: Date;
    updatedAt?: Date;
}


/**
 * @desc    advisor interface
 */
export interface Advisor {
    id: string,
    name: string,
    degree: string,
    departmentName: string,
    email: string,
    isAdvisor?: boolean,
    role?: string,
    roles?: string | string[],
}

/**
 * Department interface
 */
export interface Department {
    id?: string;
    name: string;
    description: string;
    programs?: Program[];
}

/**
 * Program interface
 */
export interface Program {
    id: string;
    name: string;
    requiredCredits: number;
    departmentName?: string;
}

/**
 * Professor interface
 */
export interface Professor {
    id: string;
    userName: string;
    email: string;
    password: string;
    phoneNumber: string;
    fullName: string;
    nationalId: string;
    departmentId: string;
    specialization: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * @desc    faculty interface
 */
export interface Faculty {
    id: string;
    name: string;
    degree: string;
    departmentName: string;
    status: FacultyStatus;
}
/**
 * @desc    single faculty member interface
 */
export interface SingleFacultyMember {
    id: string;
    name: string;
    degree: string;
    departmentName: string;
    email: string;
    appUserId: string;
    status: FacultyStatus;
}

/**
 * Student Create/Update Payload
 */
export interface StudentFormData {
    userName: string;
    email: string;
    password: string;
    phoneNumber: string;
    fullName: string;
    academicNumber: string;
    nationalId: string;
    programId: string;
}

/**
 * Department Create/Update Payload
 */
export interface DepartmentFormData {
    name: string;
    description: string;
}

/**
 * Student Filters
 */
export interface StudentFilters {
    status?: StudentStatus;
    search?: string;
    page?: number;
    limit?: number;
}

/**
 * Statistics DTO
 */
export interface StudentStatistics {
    totalStudents: number;
    activeStudents: number;
    warningStudents: number;
    dismissedStudents: number;
    averageGPA: number;
}

/**
 * Pagination Info
 */
export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}

/**
 * Table state for filtering
 */
export interface TableState {
    sortBy?: keyof Student;
    sortOrder?: 'asc' | 'desc';
    page: number;
    limit: number;
    search?: string;
    filters?: StudentFilters;
}

/**
 * Control Engine - Warning Student DTO
 */
export interface WarningStudent {
    studentId: string;
    academicNumber: string;
    studentName: string;
    programName: string;
    cgpa: number;
    consecutiveWarnings: number;
    academicStatus: 'Warning' | 'Dismissed' | string;
}

/**
 * Control Engine - Graduation Candidate DTO
 */
export interface GraduationCandidate {
    studentId: string;
    academicNumber: string;
    studentName: string;
    programName: string;
    cgpa: number;
    earnedCredits: number;
    requiredCredits: number;
    isEligible: boolean;
    missingRequirements: string[];
}

/**
 * Control Engine - Statistics DTO
 */
export interface ControlStatistics {
    totalStudents: number;
    activeStudents: number;
    warningStudents: number;
    dismissedStudents: number;
    graduatedStudents: number;
    totalDepartments: number;
    totalPrograms: number;
    totalFaculties: number;
    totalCourseOfferings: number;
    averageCGPA: number;
    activeRegistrations: number;
}

/**
 * Control Engine - Run Engine Request
 */
export interface RunControlEngineRequest {
    term: 'Fall' | 'Spring' | 'Summer';
    year: number;
}

/**
 * Course interface
 */
export interface Course {
    id: string;
    departmentId: string;
    departmentName?: string;
    code: string;
    title: string;
    description: string;
    credits: number;
    lectureHours: number;
    labHours: number;
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * Course Prerequisites
 */
export interface CoursePrerequisite {
    id: string;
    courseId: string;
    prerequisiteCourseId: string;
    prerequisiteCourseName?: string;
    prerequisiteCourseCode?: string;
    code?: string;
    title?: string;
}

/**
 * Course Offering interface
 */
export interface CourseOffering {
    offeringId: string;
    courseId: string;
    courseCode: string;
    courseTitle: string;
    instructorId: string;
    instructorName: string;
    term: 'Fall' | 'Spring' | 'Summer';
    year: number;
    capacity: number;
    enrolled: number;
    isFull: boolean;
}

/**
 * Course Create/Update Payload
 */
export interface CourseFormData {
    departmentId: string;
    code: string;
    title: string;
    description: string;
    credits: number;
    lectureHours: number;
    labHours: number;
}

/**
 * Course Offering Create Payload
 */
export interface CourseOfferingFormData {
    courseId: string;
    instructorId: string;
    term: 'Fall' | 'Spring' | 'Summer';
    year: number;
    capacity: number;
}

/**
 * Registration Period interface
 */
export interface RegistrationPeriod {
    id: string;
    name: string;
    startDateUtc: string;
    endDateUtc: string;
    isActive: boolean;
    term: string;
    year: number;
}

/**
 * Registration Period Create/Update Payload
 */
export interface RegistrationPeriodFormData {
    name: string;
    startDateUtc: string;
    endDateUtc: string;
    isActive: boolean;
    term: string;
    year: number;
}

/**
 * Registration interface
 */
export interface Registration {
    id: string;
    studentId: string;
    studentName: string;
    courseOfferingId: string;
    courseTitle: string;
    courseCode: string;
    status: string;
    semester: string;
    year: number;
    advisorId?: string;
    advisorName?: string;
}

/**
 * Student Schedule Item
 */
export interface RegistrationScheduleItem {
    courseTitle: string;
    courseCode: string;
    instructorName: string;
    term: string;
    year: number;
    status: string;
}

/**
 * Available Course for registration
 */
export interface AvailableCourse {
    offeringId: string;
    courseTitle: string;
    courseCode: string;
    instructorName: string;
    term: string;
    year: number;
    capacity: number;
    enrolled: number;
    isFull: boolean;
}

/**
 * Grade Submission payload item
 */
export interface GradeSubmission {
    registrationId: string;
    semesterWork: number;
    finalExam: number;
}

/**
 * Registration Grade details
 */
export interface RegistrationGrade {
    studentName: string;
    courseTitle: string;
    courseCode: string;
    semesterWork: number;
    finalExam: number;
    totalGrade: number;
    letterGrade: string;
    semester: string;
    sgpa: number;
    termCredits: number;
    courses: CourseGrade[];
}

export interface StudentCurrentCourseSession {
    id: number;
    time: string;
    code: string;
    title: string;
    type: string;
    location: string;
    instructor: string;
    status?: string;
    courseTitle?: string;
    courseCode?: string;
    instructorName?: string;
    credits?: number;
}

export interface CurrentUser {
    id?: string;
    userName?: string;
    name?: string;
    email?: string;
    role?: string;
}


export interface StudentCurrentSemesterResponse {
    term?: string;
    year?: number;
    classes?: StudentCurrentCourseSession[];
    Sunday?: StudentCurrentCourseSession[];
    Monday?: StudentCurrentCourseSession[];
    Tuesday?: StudentCurrentCourseSession[];
    Wednesday?: StudentCurrentCourseSession[];
    Thursday?: StudentCurrentCourseSession[];
    Friday?: StudentCurrentCourseSession[];
    Saturday?: StudentCurrentCourseSession[];
}

export interface StudentProfileData extends Student {
    maxCreditsAllowed?: number;
    level?: string;
    totalProgramCredits?: number;
    completedCredits?: number;
}

export interface StudentAdvisor {
    id: string;
    name: string;
    degree?: string;
    departmentName?: string;
    email?: string;
}

export interface StudentRegistrationStatus {
    courseOfferingId: string;
    status: string;
}
