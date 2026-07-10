"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Award, AlertCircle, CircleAlert, Printer } from "lucide-react";
import { SemesterGradesTable } from "@/components/student/grades-table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getStudentGrades, getStudentInformation } from "@/server/studentServer/studentActions";
import { RegistrationGrade } from "@/types";
import { useTranslations } from "@/i18n/IntlProvider";

export default function Grades() {
  const t = useTranslations("Student");
  const [summary, setSummary] = useState({ cgpa: 0 });
  const [academicHistory, setAcademicHistory] = useState<RegistrationGrade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGradesData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const studentInfo = await getStudentInformation();
        if (!studentInfo || studentInfo.success === false) {
          setError(studentInfo?.message || "Failed to load student identity");
          return;
        }
        const gradesResponse = await getStudentGrades(studentInfo.id);
        if (gradesResponse && gradesResponse.success === false) {
          setError(gradesResponse.message || "Failed to load grades");
          return;
        }
        const historyArray = Array.isArray(gradesResponse)
          ? gradesResponse
          : gradesResponse?.data || gradesResponse?.academicHistory || [];
        setAcademicHistory(historyArray);
        setSummary({ cgpa: gradesResponse?.cgpa || studentInfo?.cgpa || 0 });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load grades");
      } finally {
        setIsLoading(false);
      }
    };
    loadGradesData();
  }, []);

  return (
    <div className="p-4 md:p-6 print:p-0 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            {t("grades")}
          </h1>
          <p className="text-muted-foreground print:hidden">{t("viewSemesterGrades")}</p>
        </div>
        {!isLoading && !error && academicHistory.length > 0 && (
          <Button
            onClick={() => window.print()}
            variant="outline"
            className="print:hidden flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            {t("printTranscript")}
          </Button>
        )}
      </div>
      {isLoading && (
        <div className="w-full print:hidden">
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Skeleton className="w-full sm:w-1/2 lg:w-1/3 h-[100px] rounded-xl" />
          </div>
          <div className="space-y-8">
            {[1, 2].map((i) => (
              <div key={i} className="w-full rounded-xl border border-muted bg-card">
                <div className="p-4 border-b border-muted flex items-center justify-between bg-muted/20">
                  <div className="flex items-center gap-2"><Skeleton className="w-5 h-5 rounded-md" /><Skeleton className="h-6 w-32" /></div>
                  <div className="flex gap-2"><Skeleton className="h-6 w-20 rounded-full" /><Skeleton className="h-6 w-24 rounded-full" /></div>
                </div>
                <div className="h-10 bg-muted/10 border-b border-muted" />
              </div>
            ))}
          </div>
        </div>
      )}
      {error && !isLoading && <div className="flex items-center gap-2 p-4 mb-8 text-destructive bg-destructive/10 rounded-lg border border-destructive/20 print:hidden mt-8"><AlertCircle className="h-5 w-5" /><p>{error}</p></div>}
      {!isLoading && !error && (
        <div className="animate-in slide-in-from-bottom-4 duration-700">
          <div className="flex flex-col sm:flex-row gap-4 mb-8 print:mb-6">
            <Card className="bg-card border-muted shadow-sm w-full sm:w-1/2 lg:w-1/3 print:shadow-none print:border-2 print:border-gray-200">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary print:bg-transparent print:border print:border-gray-300"><Award className="w-6 h-6 print:text-black" /></div>
                <div>
                  <p className="text-sm text-foreground/80 mb-1 print:text-black">{t("cumulativeGPA")}</p>
                  <div className="flex items-end gap-2"><span className="text-4xl font-mono font-bold tracking-tighter text-primary print:text-black">{Number(summary.cgpa).toFixed(2)}</span><span className="text-foreground/70 font-mono mb-1 print:text-gray-600">/ 4.00</span></div>
                </div>
              </CardContent>
            </Card>
          </div>
          {academicHistory.length > 0 ? <div className="space-y-8 print:space-y-6">{academicHistory.map((term, index) => <div key={index} className="print:break-inside-avoid"><SemesterGradesTable term={term} /></div>)}</div> : <div className="flex flex-col items-center justify-center py-16 text-foreground/70 border-2 border-dashed border-muted rounded-xl bg-muted/10 print:hidden"><div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-4"><CircleAlert className="w-8 h-8 opacity-50" /></div><h3 className="text-lg font-medium text-foreground mb-1">{t("noGradesAvailable")}</h3><p className="text-sm text-center max-w-sm text-foreground/70">{t("gradesHint")}</p></div>}
        </div>
      )}
    </div>
  );
}
