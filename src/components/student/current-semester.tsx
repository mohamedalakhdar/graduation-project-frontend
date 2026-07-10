"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { StudentCurrentSemesterResponse } from "@/types";
import { useTranslations } from "@/i18n/IntlProvider";

export function CurrentSemesterCourses({
  courses,
}: {
  courses: StudentCurrentSemesterResponse | null;
}) {
  const t = useTranslations("Student");
  const term = courses?.term;
  const year = courses?.year;

  const coursesArray =
    courses?.classes && Array.isArray(courses.classes)
      ? courses.classes.filter(
          (course) => course.status?.toLowerCase() === "approved",
        )
      : [];

  return (
    <div className="w-full py-4 mt-4">
      <h2 className="text-2xl font-bold mb-4 tracking-tight text-foreground">
        {term} {t("semester")} {year}
      </h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {coursesArray.map((course, index: number) => (
          <Card
            key={index}
            className="relative transition-all duration-300 shadow-sm"
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-2">
                <Badge
                  variant="secondary"
                  className="text-[10px] capitalize tracking-wider"
                >
                  Dr {course.instructorName}
                </Badge>
              </div>
              <CardTitle className="text-lg leading-tight capitalize text-foreground">
                {course.courseTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between font-mono text-sm text-foreground/70">
                <div className="flex items-center gap-2">
                  <span>{course.courseCode}</span>
                  <span>•</span>
                  <span>
                    {course.credits} {t("credits")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Link href={"/student/courses-registration"}>
          <Card className="bg-muted/10 border-dashed border-2 flex flex-col items-center justify-center p-6 text-foreground/70 hover:bg-muted/30 hover:text-foreground transition-colors cursor-pointer min-h-[140px] h-full shadow-sm">
            <BookOpen className="w-8 h-8 mb-2 opacity-50" />
            <span className="font-medium">{t("registerNewCourse")}</span>
          </Card>
        </Link>
      </div>
    </div>
  );
}
