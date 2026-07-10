"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, User, BookOpen } from "lucide-react";
import { useTranslations } from "@/i18n/IntlProvider";
type BadgeVariant = "default" | "secondary" | "destructive" | "outline" | "ghost" | "link";

export interface Session {
  id: number;
  time: string;
  code: string;
  title: string;
  type: string;
  location: string;
  instructor: string;
}
const getTypeColor = (type: string) => {
  switch (type) {
    case "Lecture":
      return "default";
    case "Lab":
      return "secondary";
    case "Section":
      return "outline";
    case "Project":
      return "destructive";
    default:
      return "default";
  }
};

export function ScheduleTimeline({
  sessions,
  day,
}: {
  sessions: Session[];
  day: string;
}) {
  const t = useTranslations("Student");

  if (sessions.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border-2 border-dashed rounded-xl bg-muted/20">
        <BookOpen className="w-12 h-12 mb-4 opacity-20" />
        <p>{t("noClassesScheduled", { day })}</p>
      </div>
    );
  }

  return (
    <div className="relative border-l-2 border-muted ml-3 pl-6 md:ml-4 space-y-6">
      {sessions.map((session) => (
        <div key={session.id} className="relative">
          {/* Timeline Dot */}
          <div className="absolute -left-[32.5px] top-4 w-4 h-4 rounded-full bg-background border-2 border-primary shadow-[0_0_8px_rgba(var(--primary),0.5)] z-10" />

          <Card className="bg-card hover:bg-muted/40 transition-colors border-muted/60 shadow-sm group">
            <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant={getTypeColor(session.type) as BadgeVariant}
                    className="font-mono text-[10px] uppercase tracking-wider"
                  >
                    {session.type}
                  </Badge>
                  <span className="text-sm font-mono text-muted-foreground">
                    {session.code}
                  </span>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {session.title}
                </CardTitle>
              </div>
              <div className="flex items-center text-sm font-medium bg-muted/50 px-3 py-1.5 rounded-md w-fit">
                <Clock className="w-4 h-4 mr-2 text-primary" />
                {session.time}
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 opacity-70" />
                  <span>{session.location}</span>
                </div>
                <div className="hidden sm:block text-muted-foreground/30">
                  •
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 opacity-70" />
                  <span>{session.instructor}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
