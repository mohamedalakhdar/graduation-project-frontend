/**
 * @desc    faculty status enums 
 * @details send status in params as number like this --> status ==> 1 --> status ==> active
 */
export enum FacultyStatus {
    Active = "Active",        // 1 
    Resined = "Resined",      // 2
    Retired = "Retired",      // 3
    Dismissed = "Dismissed"   // 4
}

/**
 * @desc    faculty degree enums
 */
export enum FacultyDegree {
    TeachingAssistant = "Teaching Assistant",
    AssistantLecturer = "Assistant Lecturer",
    Lecturer = "Lecturer",
    AssociateProfessor = "Associate Professor",
    Professor = "Professor"
}

/**
 * @desc    students status start from one
*/
export enum StudentsStatus {
    GoodStanding = "Good Standing",
    AcademicWarning = "Academic Warning",
    Dismissed = "Dismissed",
    Graduated = "Graduated"
}

/**
 * @desc    roles enums
*/
export enum Roles {
    Admin = "Admin",
    Student = "Student",
    Professor = "Professor",
    Teacher = "Teacher",
    Advisor = "Advisor"
}

/**
 * @desc    semester enums
*/
export enum Semester {
    Fall = "Fall",
    Spring = "Spring",
    Summer = "Summer"
}