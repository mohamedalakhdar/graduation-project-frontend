"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText } from "lucide-react";

export interface CourseGrade {
  id: string;
  name: string;
  credits: number;
  work: number;
  final: number;
  total: number;
  grade: string;
  points: number;
}

export interface SemesterRecord {
  semester: string;
  sgpa: number;
  termCredits: number;
  courses: CourseGrade[];
}

import { useTranslations } from "@/i18n/IntlProvider";

export function SemesterGradesTable({ term }: { term: SemesterRecord }) {
  const t = useTranslations("Student");
  const getGradeBadgeColor = (grade: string) => {
    if (grade.startsWith("A"))
      return "bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 border-emerald-500/20";
    if (grade.startsWith("B"))
      return "bg-blue-500/15 text-blue-600 hover:bg-blue-500/25 border-blue-500/20";
    if (grade.startsWith("C"))
      return "bg-yellow-500/15 text-yellow-600 hover:bg-yellow-500/25 border-yellow-500/20";
    if (grade.startsWith("D"))
      return "bg-orange-500/15 text-orange-600 hover:bg-orange-500/25 border-orange-500/20";
    if (grade === "F")
      return "bg-destructive/15 text-destructive hover:bg-destructive/25 border-destructive/20";
    return "default";
  };

  return (
    <Card className="border-muted shadow-sm overflow-hidden print:shadow-none print:border-none">
      {/* Semester Header */}
      <CardHeader className="bg-muted/20 border-b border-muted pb-4 print:bg-transparent print:border-b-2 print:border-gray-800 print:p-0 print:mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary print:hidden" />
            <CardTitle className="text-xl text-foreground print:text-black print:text-2xl">
              {term.semester}
            </CardTitle>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="text-sm font-normal print:border-none print:text-black print:p-0"
            >
              {term.termCredits} {t("credits")}
            </Badge>
            <Badge
              variant="secondary"
              className="text-sm font-mono font-medium print:bg-transparent print:border print:border-gray-400 print:text-black"
            >
              SGPA: {term.sgpa.toFixed(2)}
            </Badge>
          </div>
        </div>
      </CardHeader>

      {/* Grades Table */}
      <CardContent className="p-0">
        <div className="overflow-x-auto print:overflow-visible">
          <Table className="print:w-full">
            <TableHeader className="bg-muted/10 print:bg-gray-100">
              <TableRow className="hover:bg-transparent print:border-b-2 print:border-gray-300">
                <TableHead className="w-25 pl-6 font-mono text-xs text-foreground print:text-black print:font-bold">
                  {t("academicId")}
                </TableHead>
                <TableHead className="min-w-50 text-foreground print:text-black print:font-bold">
                  {t("courseName")}
                </TableHead>
                <TableHead className="text-center text-xs text-foreground print:text-black print:font-bold">
                  Cr.
                </TableHead>
                <TableHead className="text-center text-xs hidden sm:table-cell text-foreground print:table-cell print:text-black print:font-bold">
                  Work (40)
                </TableHead>
                <TableHead className="text-center text-xs hidden sm:table-cell text-foreground print:table-cell print:text-black print:font-bold">
                  Final (60)
                </TableHead>
                <TableHead className="text-center text-xs text-foreground print:text-black print:font-bold">
                  Total
                </TableHead>
                <TableHead className="text-center text-xs text-foreground print:text-black print:font-bold">
                  Points
                </TableHead>
                <TableHead className="text-right pr-6 text-foreground print:text-black print:font-bold">
                  {t("grade")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {term.courses.map((course) => (
                <TableRow
                  key={course.id}
                  className="hover:bg-muted/30 transition-colors print:border-b print:border-gray-200"
                >
                  <TableCell className="pl-6 font-mono text-sm text-foreground/70 print:text-black">
                    {course.id}
                  </TableCell>
                  <TableCell className="font-medium text-foreground print:text-black">
                    {course.name}
                  </TableCell>
                  <TableCell className="text-center text-foreground/70 print:text-black">
                    {course.credits}
                  </TableCell>
                  <TableCell className="text-center hidden sm:table-cell text-foreground/70 print:table-cell print:text-black">
                    {course.work}
                  </TableCell>
                  <TableCell className="text-center hidden sm:table-cell text-foreground/70 print:table-cell print:text-black">
                    {course.final}
                  </TableCell>
                  <TableCell className="text-center font-mono font-medium text-foreground print:text-black">
                    {course.total}
                  </TableCell>
                  <TableCell className="text-center font-mono text-foreground/70 print:text-black">
                    {course.points.toFixed(1)}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Badge
                      variant="outline"
                      className={`font-mono font-bold w-10 text-sm print:bg-transparent print:border-gray-400 print:text-black ${getGradeBadgeColor(
                        course.grade,
                      )}`}
                    >
                      {course.grade}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
