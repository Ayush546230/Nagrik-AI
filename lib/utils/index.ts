import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { IncidentCategory, IncidentStatus } from "@/types";

// ── Tailwind class merger ──
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// PRIORITY SCORE

export function computePriorityScore(
  severity: number,
  upvotes: number,
  createdAt: Date
): number {
  const hoursOpen =
    (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
  return severity * 10 + upvotes * 2 - hoursOpen * 0.1;
}

// SEVERITY

export function getSeverityLabel(severity: number): string {
  if (severity <= 3) return "Low";
  if (severity <= 6) return "Medium";
  if (severity <= 8) return "High";
  return "Critical";
}

export function getSeverityBadgeClass(severity: number): string {
  if (severity <= 3) return "badge-green";
  if (severity <= 6) return "badge-amber";
  if (severity <= 8) return "badge-amber";
  return "badge-red";
}

export function getSeverityColor(severity: number): string {
  if (severity <= 3) return "#22C55E";
  if (severity <= 6) return "#F59E0B";
  if (severity <= 8) return "#F97316";
  return "#EF4444";
}

// STATUS

export const STATUS_LABELS: Record<IncidentStatus, string> = {
  reported: "Reported",
  verified: "Verified",
  assigned: "Assigned",
  in_progress: "In Progress",
  resolved: "Resolved",
  rejected: "Rejected",
  closed: "Closed",
};

export const STATUS_BADGE: Record<IncidentStatus, string> = {
  reported: "badge-cyan",
  verified: "badge-cyan",
  assigned: "badge-amber",
  in_progress: "badge-amber",
  resolved: "badge-green",
  rejected: "badge-red",
  closed: "badge-gray",
};

// CATEGORY

export const CATEGORY_LABELS: Record<IncidentCategory, string> = {
  pothole: "Pothole",
  garbage: "Garbage",
  streetlight: "Streetlight",
  road_damage: "Road Damage",
  waterlogging: "Waterlogging",
  encroachment: "Encroachment",
  other: "Other",
};

export const CATEGORY_EMOJI: Record<IncidentCategory, string> = {
  pothole: "🕳️",
  garbage: "🗑️",
  streetlight: "💡",
  road_damage: "🚧",
  waterlogging: "💧",
  encroachment: "⛔",
  other: "📍",
};

// DATE

export function timeAgo(date: Date | string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(date).getTime()) / 1000
  );
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}