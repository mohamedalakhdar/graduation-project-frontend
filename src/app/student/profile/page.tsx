"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ProfileHeader } from "@/components/student/profile-header";
import { PersonalInfo } from "@/components/student/personal-info";
import { AcademicInfo } from "@/components/student/academic-info";
import { ProfileActions } from "@/components/student/profile-actions";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getStudentInformation,
  updateStudentInformation,
} from "@/server/studentServer/studentActions";
import { StudentProfileData } from "@/types";
import { useTranslations } from "@/i18n/IntlProvider";

export default function Profile() {
  const t = useTranslations("Student");
  const [isEditing, setIsEditing] = useState(false);
  const [studentData, setStudentData] = useState<StudentProfileData | null>(null);
  const [formData, setFormData] = useState<StudentProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getStudentInformation();

        if (data) {
          setStudentData(data);
          setFormData(data);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load student data";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadStudentData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      if (!formData || !studentData) return;
      const response = await updateStudentInformation(
        formData.fullName,
        formData.nationalId as string,
        studentData.id,
      );

      if (!response.success) {
        setError(response.message || "Failed to update student information.");
        return;
      }
      setStudentData(formData);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError("Error saving student data: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(studentData);
    setIsEditing(false);
    setError(null);
  };

  return (
    <div className="p-4 bg-muted-50 animate-in fade-in duration-500">
      {/* 1. Skeleton Loading State */}
      {isLoading && (
        <div className="w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full shrink-0" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-48 md:w-64" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="h-10 w-28 rounded-md" />
          </div>

          <Card className="mt-8">
            <CardContent className="pt-8 space-y-8">
              {/* Personal Info Mock */}
              <div>
                <Skeleton className="h-6 w-40 mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={`personal-${i}`} className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-10 w-full rounded-md" />{" "}
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-px w-full bg-muted/50 my-6" />

              {/* Academic Info Mock */}
              <div>
                <Skeleton className="h-6 w-48 mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={`academic-${i}`} className="space-y-2">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-10 w-full rounded-md" />{" "}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
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
      {!isLoading && !error && studentData && formData && (
        <div className="animate-in slide-in-from-bottom-4 duration-700">
          <ProfileHeader
            isEditing={isEditing}
            onEdit={() => setIsEditing(true)}
          />

          <Card className="mt-8">
            <CardContent className="pt-4 space-y-4">
              <PersonalInfo
                isEditing={isEditing}
                studentData={studentData}
                formData={formData}
                onChange={handleInputChange}
              />

              <AcademicInfo studentData={studentData} />
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2 mt-6">
            <ProfileActions
              isEditing={isEditing}
              isSaving={isSaving}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
}
