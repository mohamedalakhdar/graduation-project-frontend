"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  MapPin,
  CalendarDays,
  Hourglass,
  CircleAlert,
} from "lucide-react";
import { useTranslations } from "@/i18n/IntlProvider";
type BadgeVariant = "default" | "secondary" | "destructive" | "outline" | "ghost" | "link";

export interface Exam {
  id: number;
  date: string;
  time: string;
  code: string;
  title: string;
  location: string;
  duration: string;
  type: string;
}

const getExamTypeColor = (type: string) => {
  switch (type) {
    case "Midterm":
      return "secondary";
    case "Final":
      return "destructive";
    case "Practical":
      return "outline";
    default:
      return "default";
  }
};

export function ExamTimeline({ exams }: { exams: Exam[] }) {
  const t = useTranslations("Student");
  if (exams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground border-2 border-dashed border-muted rounded-xl bg-muted/10 animate-in fade-in duration-500">
        <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
          <CircleAlert className="w-8 h-8 opacity-50" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-1">
          {t("notScheduledYet")}
        </h3>
        <p className="text-sm text-center max-w-sm">
          {t("examSchedulePending")}
        </p>
      </div>
    );
  }

  return (
    <div className="relative border-l-2 border-muted ml-3 pl-6 md:ml-4 space-y-6 animate-in fade-in duration-500">
      {exams.map((exam) => (
        <div key={exam.id} className="relative">
          {/* Timeline Dot */}
          <div className="absolute -left-[32.5px] top-4 w-4 h-4 rounded-full bg-background border-2 border-primary shadow-[0_0_8px_rgba(var(--primary),0.5)] z-10" />

          <Card className="bg-card hover:border-primary/50 transition-colors border-muted/60 shadow-sm group">
            <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant={getExamTypeColor(exam.type) as BadgeVariant}
                    className="font-mono text-[10px] uppercase tracking-wider"
                  >
                    {exam.type}
                  </Badge>
                  <span className="text-sm font-mono text-muted-foreground">
                    {exam.code}
                  </span>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {exam.title}
                </CardTitle>
              </div>

              {/* Date Badge */}
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center text-sm font-medium bg-muted/50 px-3 py-1.5 rounded-md w-fit">
                  <CalendarDays className="w-4 h-4 mr-2" />
                  {exam.date}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg border border-muted/50">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary/70" />
                  <span className="font-medium text-primary/70">
                    {exam.time}
                  </span>
                </div>
                <div className="hidden sm:block text-muted-foreground/30">
                  •
                </div>
                <div className="flex items-center gap-2">
                  <Hourglass className="w-4 h-4 text-primary/70" />
                  <span>{exam.duration}</span>
                </div>
                <div className="hidden sm:block text-muted-foreground/30">
                  •
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary/70" />
                  <span>{exam.location}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
