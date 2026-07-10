"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Plus,
  Lock,
  CheckCircle2,
  Users,
  Loader2,
  Clock,
  CircleAlert,
  CalendarDays,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AvailableCourse,
  RegistrationPeriod,
  StudentRegistrationStatus,
} from "@/types";
import { useTranslations } from "@/i18n/IntlProvider";

type RegistrationCourse = AvailableCourse & {
  credits: number;
};

interface CourseCatalogProps {
  catalog: RegistrationCourse[];
  registeredStatuses: Record<string, StudentRegistrationStatus["status"]>;
  onAddCourse: (course: RegistrationCourse) => Promise<boolean>;
  periodInfo?: RegistrationPeriod | null;
}

export function CourseCatalog({
  catalog,
  registeredStatuses,
  onAddCourse,
  periodInfo,
}: CourseCatalogProps) {
  const t = useTranslations("Student");
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingCourseId, setLoadingCourseId] = useState<string | null>(null);

  const filteredCourses = catalog.filter(
    (course) =>
      course.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleRegisterClick = async (course: RegistrationCourse) => {
    setLoadingCourseId(course.offeringId);
    await onAddCourse(course);
    setLoadingCourseId(null);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return t("na");

    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6 items-start">
      <div className="w-full lg:w-2/3 flex flex-col order-2 lg:order-1 gap-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder={t("searchPlaceholder")}
            className="pl-9 pr-4 py-4.5 text-base bg-muted/50 border-primary/5 rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {filteredCourses.map((course) => {
            const rawStatus = registeredStatuses[course.offeringId];
            const status = rawStatus ? rawStatus.toLowerCase() : null;
            const isSelected = !!status;
            const isCurrentlyLoading = loadingCourseId === course.offeringId;

            return (
              <Card
                key={course.offeringId}
                className="relative transition-all duration-300"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge
                      variant="secondary"
                      className="text-[10px] capitalize tracking-wider"
                    >
                      {t("instructorLabel")} {course.instructorName}
                    </Badge>

                    {course.isFull && !isSelected ? (
                      <div className="group relative">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="w-8 h-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center cursor-not-allowed">
                              <Lock size={16} />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{t("courseFullTooltip")}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    ) : status === "justadded" ? (
                      <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center animate-in zoom-in duration-300">
                        <CheckCircle2 size={18} />
                      </div>
                    ) : status === "pending" ? (
                      <Badge
                        variant="outline"
                        className="bg-orange-500/10 text-orange-600 border-orange-500/20 flex items-center gap-1"
                      >
                        <Clock size={12} /> {t("statusPending")}
                      </Badge>
                    ) : status === "approved" ? (
                      <Badge
                        variant="outline"
                        className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 flex items-center gap-1"
                      >
                        <CheckCircle2 size={12} /> {t("statusApproved")}
                      </Badge>
                    ) : (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={() => handleRegisterClick(course)}
                        disabled={isCurrentlyLoading}
                      >
                        {isCurrentlyLoading ? (
                          <Loader2
                            size={18}
                            className="animate-spin text-primary"
                          />
                        ) : (
                          <Plus size={18} />
                        )}
                      </Button>
                    )}
                  </div>
                  <CardTitle className="text-lg leading-tight capitalize">
                    {course.courseTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between font-mono text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span>{course.courseCode}</span>
                      <span>â€¢</span>
                      <span>{course.credits} {t("creditsLabel")}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs bg-muted/50 px-2 py-1 rounded-md">
                      <Users size={14} className="opacity-70" />
                      <span>
                        {Math.max(course.capacity - course.enrolled, 0)}{" "}
                        {t("seatsLabel")}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Card className="w-full lg:w-1/3 order-1 lg:order-2 sticky top-4 shrink-0 pt-0">
        <CardHeader className="flex flex-row items-center gap-2 text-primary bg-primary/5 py-3">
          <CircleAlert className="w-6 h-6 font-semibold" />
          <h3 className="text-lg font-semibold text-foreground">
            {t("registrationInfoTitle")}
          </h3>
        </CardHeader>
        {periodInfo ? (
          <CardContent className="p-4 space-y-4">
            <div className="flex items-start gap-3">
              <CalendarDays className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">{t("academicTerm")}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {periodInfo.term} {periodInfo.year}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="flex flex-row justify-between items-center text-xs">
                  <span className="text-muted-foreground pr-4">
                    {t("startsOn")}:
                  </span>
                  <span className="font-medium text-foreground">
                    {formatDate(periodInfo.startDateUtc)}
                  </span>
                </div>
                <div className="flex flex-row justify-between items-center text-xs">
                  <span className="text-muted-foreground pr-4">
                    {t("endsOn")}:
                  </span>
                  <span className="font-medium text-foreground">
                    {formatDate(periodInfo.endDateUtc)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        ) : (
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("courseRegistrationUpdates")}
            </p>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
