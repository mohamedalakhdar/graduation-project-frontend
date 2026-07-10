"use client";

import { useEffect, useState } from "react";
import { getStudentInformation } from "@/server/studentServer/studentActions";
import {
  getAllAdvisors,
  assignAdvisorToStudent,
} from "@/server/studentServer/studentActions";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Mail, UserPlus, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { Advisor } from "@/types";
import { useTranslations } from "@/i18n/IntlProvider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function AdvisorsPage() {
  const t = useTranslations("Student");
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const [studentRes, advisorsRes] = await Promise.all([
          getStudentInformation(),
          getAllAdvisors(),
        ]);

        if (advisorsRes && advisorsRes.items) {
          setAdvisors(advisorsRes.items);
        } else if (advisorsRes && advisorsRes.success === false) {
          setError(advisorsRes.message);
        }

        if (studentRes && studentRes.id) {
          setStudentId(studentRes.id);
        }
      } catch {
        setError("Failed to load necessary data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleAssignAdvisor = async (
    advisorId: string,
    advisorName: string,
  ) => {
    if (!studentId) {
      toast.error(t("studentInfoMissing"));
      return;
    }

    setAssigningId(advisorId);

    const res = await assignAdvisorToStudent(studentId, advisorId);

    if (res.success) {
      setSuccessId(advisorId);
      toast.success(
        t("advisorAssignedSuccess", { advisorName }),
      );

      setTimeout(() => {
        setSuccessId(null);
      }, 3000);
    } else {
      toast.error(res.message || t("advisorAssignedFailed"));
    }

    setAssigningId(null);
  };

  const filteredAdvisors = advisors.filter(
    (advisor) =>
      advisor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      advisor.departmentName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="p-4 mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {t("academicAdvisors")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("assignAdvisorDesc")}
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t("searchByNameOrDept")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-card"
          />
        </div>
      </div>

      {/* Page Level Errors */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden bg-card/50">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4 mx-auto" />
              </CardHeader>
              <CardContent className="flex items-center justify-center text-center w-full pb-6">
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter className="flex w-full gap-2 bg-muted/20 pt-4">
                <Skeleton className="h-10 flex-1 rounded-md" />
                <Skeleton className="h-10 w-10 shrink-0 rounded-md" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        /* Advisors Grid */
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-in slide-in-from-bottom-4 duration-700">
          {filteredAdvisors.length > 0 ? (
            filteredAdvisors.map((advisor) => {
              const isAssigning = assigningId === advisor.id;
              const isSuccess = successId === advisor.id;

              return (
                <Card key={advisor.id} className="overflow-hidden bg-card/50">
                  <CardHeader>
                    <h3 className="font-semibold text-xl text-foreground capitalize text-center">
                      Dr. {advisor.name}
                    </h3>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center text-center w-full">
                    <div className="flex items-center justify-between text-muted-foreground text-sm">
                      <div className="flex items-center gap-2">
                        <span className="truncate">{advisor.degree}</span>
                        <span>•</span>
                        <span className="truncate">
                          {advisor.departmentName}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex w-full gap-2 bg-muted/20">
                    <Button
                      className="w-full flex-1 gap-2 transition-all"
                      variant={isSuccess ? "secondary" : "default"}
                      onClick={() =>
                        handleAssignAdvisor(advisor.id, advisor.name)
                      }
                      disabled={isAssigning || isSuccess}
                    >
                      {isAssigning ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {t("assigning")}
                        </>
                      ) : isSuccess ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          {t("assigned")}
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          {t("assign")}
                        </>
                      )}
                    </Button>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="shrink-0 text-muted-foreground hover:text-foreground"
                          onClick={() =>
                            (window.location.href = `mailto:${advisor.email}`)
                          }
                          disabled={isAssigning}
                        >
                          <Mail className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p className="text-xs">Send Email</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardFooter>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-xl">
              <UserPlus className="w-12 h-12 mx-auto opacity-20 mb-3" />
              <p>{t("noAdvisorsFound")}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
