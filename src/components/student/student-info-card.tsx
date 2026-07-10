"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IdCard } from "lucide-react";
import { StudentProfileData } from "@/types";
import { useTranslations } from "@/i18n/IntlProvider";

export function StudentInfoCard({ studentData }: { studentData: StudentProfileData }) {
  const t = useTranslations("Student");
  return (
    <Card className="bg-card border-muted shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg text-foreground">
          <IdCard className="w-5 h-5 text-primary" />
          {t("studentInformation")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mt-2">
          <div>
            <p className="text-sm text-foreground/70">{t("academicId")}</p>
            <p className="text-xl font-mono font-medium text-foreground">
              {studentData.academicNumber}
            </p>
          </div>
          <div>
            <p className="text-sm text-foreground/70">{t("program")}</p>
            <p className="font-medium text-foreground">{studentData.programName}</p>
          </div>
          <div>
            <p className="text-sm text-foreground/70">{t("level")}</p>
            <Badge variant="outline" className="mt-1">
              {studentData.level}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
