"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, GraduationCap } from "lucide-react";
import { StudentProfileData } from "@/types";
import { useTranslations } from "@/i18n/IntlProvider";

export function AcademicPerformanceCard({ studentData }: { studentData: StudentProfileData }) {
  const t = useTranslations("Student");
  const isDismissed = studentData.status === "dismissed";

  return (
    <Card className="bg-card border-muted shadow-sm relative overflow-hidden h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg text-foreground">
          <GraduationCap className="w-5 h-5 text-primary" />
          {t("academicPerformance")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 mt-2">
          <div>
            <p className="text-sm text-foreground/70 mb-1">{t("cumulativeGpa")}</p>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-mono font-bold tracking-tighter text-primary">
                {(studentData.cgpa ?? 0).toFixed(2)}
              </span>
              <span className="text-foreground/70 font-mono mb-1">/ 4.00</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-foreground/70">{t("status")}</span>
              <Badge
                variant={isDismissed ? "destructive" : "default"}
                className="flex gap-1"
              >
                {isDismissed ? (
                  <AlertCircle className="w-3 h-3" />
                ) : (
                  <CheckCircle2 className="w-3 h-3" />
                )}
                {studentData.status}
              </Badge>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-foreground/70">{t("allowedLoad")}</span>
              <span className="font-mono font-medium text-foreground">
                {studentData.maxCreditsAllowed} {t("credits")}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
