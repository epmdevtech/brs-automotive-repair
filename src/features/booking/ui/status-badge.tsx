import React from "react";
import { CheckCircle2, Clock, PlayCircle, Slash, XCircle } from "lucide-react";
import type { AppointmentStatus } from "../domain/types";
import { getStatusBadgeClass, getStatusLabel } from "../domain/status";

export interface StatusBadgeProps {
  status: AppointmentStatus;
  size?: "xs" | "sm" | "md";
  showIcon?: boolean;
  className?: string;
}

export function StatusBadge({
  status,
  size = "sm",
  showIcon = true,
  className = "",
}: StatusBadgeProps) {
  const label = getStatusLabel(status);
  const badgeClass = getStatusBadgeClass(status);

  const iconSize = size === "xs" ? 10 : size === "sm" ? 12 : 14;

  const renderIcon = () => {
    switch (status) {
      case "PENDING":
        return <Clock size={iconSize} className="shrink-0 text-sky-700" />;
      case "CONFIRMED":
        return <PlayCircle size={iconSize} className="shrink-0 text-violet-700" />;
      case "COMPLETED":
        return <CheckCircle2 size={iconSize} className="shrink-0 text-emerald-700" />;
      case "CANCELLED":
        return <XCircle size={iconSize} className="shrink-0 text-red-700" />;
      case "NO_SHOW":
        return <Slash size={iconSize} className="shrink-0 text-neutral-600" />;
    }
  };

  const sizeClasses =
    size === "xs"
      ? "text-[9px] px-1.5 py-0.5 gap-1"
      : size === "sm"
        ? "text-[11px] px-2 py-0.5 gap-1.5"
        : "text-xs px-2.5 py-1 gap-1.5";

  return (
    <span
      role="status"
      aria-label={`Situação do atendimento: ${label}`}
      className={`inline-flex items-center font-semibold rounded-full uppercase tracking-wider shadow-2xs whitespace-nowrap transition-colors ${badgeClass} ${sizeClasses} ${className}`}
    >
      {showIcon && renderIcon()}
      <span>{label}</span>
    </span>
  );
}
