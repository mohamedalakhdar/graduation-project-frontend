"use client";

import { ChartRadialText } from "@/components/student/radial-chart";
import { StudentInfoCard } from "@/components/student/student-info-card";
import { AcademicPerformanceCard } from "@/components/student/academic-performance-card";
import { CurrentSemesterCourses } from "@/components/student/current-semester";
import {
  getStudentCourses,
  getStudentInformation,
} from "@/server/studentServer/studentActions";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { StudentCurrentSemesterResponse, StudentProfileData } from "@/types";
import { useTranslations } from "@/i18n/IntlProvider";

export default function StudentDashboard() {
  const [studentData, setStudentData] = useState<StudentProfileData | null>(null);
  const [courses, setCourses] = useState<StudentCurrentSemesterResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const t = useTranslations("Student");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const studentInfo = await getStudentInformation();

        if (!studentInfo || studentInfo.success === false) {
          setError(studentInfo?.message || "Failed to load student data");
          setIsLoading(false);
          return;
        }

        const response = await getStudentCourses(studentInfo.id);

        setStudentData(studentInfo);
        setCourses(response);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load data";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllData();
  }, []);

  const progressPercentage = studentData?.totalProgramCredits
    ? (studentData?.completedCredits || 0 / studentData.totalProgramCredits) * 100
    : 0;

  return (
    <section id="student-home" className="p-4 animate-in fade-in duration-500">
      {/* 1. Skeleton Loading State */}
      {isLoading && (
        <div className="flex flex-col w-full">
          {/* Skeleton for Welcome Text */}
          <div className="w-fit mb-4 space-y-2 mt-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-64 md:w-96" />
          </div>

          {/* Skeleton for the 3 Top Cards */}
          <div className="flex flex-1 flex-col gap-4 py-4">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              <Skeleton className="h-[200px] w-full rounded-xl" />
              <Skeleton className="h-[200px] w-full rounded-xl" />
              <Skeleton className="h-[200px] w-full rounded-xl" />
            </div>
          </div>

          {/* Skeleton for Current Semester Courses */}
          <div className="w-full py-4 mt-4 space-y-4">
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Skeleton className="h-[140px] w-full rounded-xl" />
              <Skeleton className="h-[140px] w-full rounded-xl" />
              <Skeleton className="h-[140px] w-full rounded-xl" />
            </div>
          </div>
        </div>
      )}

      {/* 2. Error State */}
      {error && !isLoading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800 font-medium">Error</p>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* 3. Main Content */}
      {!isLoading && !error && studentData && (
        <>
          <div className="w-fit mb-4 animate-in slide-in-from-bottom-2 duration-500">
            <span className="text-primary font-medium text-lg tracking-tight">
              {t("welcomeBack")}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-1 capitalize">
              {studentData.fullName}
            </h1>
          </div>

          <div className="flex flex-1 flex-col gap-4 py-4 animate-in slide-in-from-bottom-4 duration-700">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              <StudentInfoCard studentData={studentData} />
              <AcademicPerformanceCard studentData={studentData} />
              <ChartRadialText
                studentData={studentData}
                progressPercentage={progressPercentage}
              />
            </div>
          </div>

          <div className="animate-in slide-in-from-bottom-6 duration-1000">
            <CurrentSemesterCourses courses={courses} />
          </div>
        </>
      )}
    </section>
  );
}
