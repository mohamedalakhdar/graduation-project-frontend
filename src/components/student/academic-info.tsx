"use client";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { GraduationCap } from "lucide-react";
import { StudentProfileData } from "@/types";
import { useTranslations } from "@/i18n/IntlProvider";

export function AcademicInfo({ studentData }: { studentData: StudentProfileData }) {
  const t = useTranslations("Student");
  return (
    <div className="space-y-4 py-4">
      <h3 className="font-semibold flex items-center gap-2 text-lg">
        <GraduationCap className="h-4 w-4" />
        {t("academicInformation")}
      </h3>
      <Separator />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">{t("level")}</Label>
          <div className="p-2.5 bg-muted border rounded-md text-sm text-muted-foreground cursor-not-allowed">
            {studentData.level}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">{t("program")}</Label>
          <div className="p-2.5 bg-muted border rounded-md text-sm text-muted-foreground cursor-not-allowed">
            {studentData.programName}
          </div>
        </div>

       
      </div>
    </div>
  );
}
