"use client";

import { Button } from "@/components/ui/button";
import { X, Loader2, Save } from "lucide-react";
import { useTranslations } from "@/i18n/IntlProvider";

interface ProfileActionsProps {
  isEditing: boolean;
  isSaving: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export function ProfileActions({
  isEditing,
  isSaving,
  onSave,
  onCancel,
}: ProfileActionsProps) {
  const t = useTranslations("Student");
  if (!isEditing) return null;

  return (
    <div className="pt-4 flex justify-end gap-2">
      <Button
        size={"lg"}
        variant="outline"
        onClick={onCancel}
        disabled={isSaving}
        className="flex items-center gap-2"
      >
        <X className="h-4 w-4" />
        {t("cancel")}
      </Button>

      <Button
        size={"lg"}
        onClick={onSave}
        disabled={isSaving}
        className="flex items-center gap-2"
      >
        {isSaving ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {t("saving")}
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            {t("saveEdit")}
          </>
        )}
      </Button>
    </div>
  );
}
