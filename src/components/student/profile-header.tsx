"use client";

import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useTranslations } from "@/i18n/IntlProvider";

interface ProfileHeaderProps {
  isEditing: boolean;
  onEdit: () => void;
}

export function ProfileHeader({ isEditing, onEdit }: ProfileHeaderProps) {
  const t = useTranslations("Student");
  return (
    <div>
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            {t("studentProfile")}
          </h2>
          <p className="text-base text-muted-foreground">
            {t("studentProfileSubtitle")}
          </p>
        </div>
        {!isEditing && (
          <Button
            onClick={onEdit}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Pencil className="h-4 w-4" />
            {t("editProfile")}
          </Button>
        )}
      </div>
    </div>
  );
}
