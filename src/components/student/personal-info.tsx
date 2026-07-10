"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User } from "lucide-react";
import { StudentProfileData } from "@/types";
import { useTranslations } from "@/i18n/IntlProvider";

interface PersonalInfoProps {
  isEditing: boolean;
  studentData: StudentProfileData;
  formData: StudentProfileData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PersonalInfo({
  isEditing,
  studentData,
  formData,
  onChange,
}: PersonalInfoProps) {
  const t = useTranslations("Student");
  return (
    <div className="space-y-4">
      <h3 className="font-semibold flex items-center gap-2 text-lg">
        <User className="h-4 w-4 text-primary" />
        {t("personalInformation")}
      </h3>
      <Separator />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-2">
            {t("fullName")}
          </Label>
          {isEditing ? (
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={onChange}
            />
          ) : (
            <div className="p-2.5 bg-muted/50 border rounded-md text-sm">
              {studentData.fullName}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="nationalId" className="flex items-center gap-2">
            {t("nationalId")}
          </Label>
          {isEditing ? (
            <Input
              id="nationalId"
              name="nationalId"
              value={formData.nationalId}
              onChange={onChange}
              maxLength={14}
            />
          ) : (
            <div className="p-2.5 bg-muted/50 border rounded-md text-sm">
              {studentData.nationalId}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
