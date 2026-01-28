"use client";

import { cn } from "@/lib/utils";
import { useTeacherMode } from "@/lib/stores/teacher-mode";

export function TeacherHighlight({
  children,
  active,
  className,
}: {
  children: React.ReactNode;
  active: boolean;
  className?: string;
}) {
  const { enabled } = useTeacherMode();
  return (
    <div
      className={cn(
        className,
        enabled && active
          ? "rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4"
          : ""
      )}
    >
      {children}
    </div>
  );
}
