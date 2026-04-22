/**
 * ScheduleCard component — displays a single generated study item.
 *
 * Features:
 * - Left border accent colored by priority (High=red, Medium=yellow, Low=green)
 * - Completion checkbox linked to useProgress
 * - Reduced opacity when completed
 * - Priority badge with matching colors
 */

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock } from "lucide-react";
import type { ScheduleItem } from "../types";

// ─────────────────────────────────────────────
// Priority badge — colored text + background
// ─────────────────────────────────────────────
function PriorityBadge({ priority }: { priority: string }) {
  if (priority === "High") {
    return (
      <Badge
        className="priority-high border text-xs font-semibold shrink-0"
        data-ocid="schedule.priority_badge.high"
      >
        🚩 High
      </Badge>
    );
  }
  if (priority === "Medium") {
    return (
      <Badge
        className="priority-medium border text-xs font-semibold shrink-0"
        data-ocid="schedule.priority_badge.medium"
      >
        🟡 Medium
      </Badge>
    );
  }
  return (
    <Badge
      className="priority-low border text-xs font-semibold shrink-0"
      data-ocid="schedule.priority_badge.low"
    >
      🟢 Low
    </Badge>
  );
}

// ─────────────────────────────────────────────
// ScheduleCard props
// ─────────────────────────────────────────────
interface ScheduleCardProps {
  /** The schedule item to display */
  item: ScheduleItem;
  /** 0-based index used for data-ocid markers */
  index: number;
  /** Whether this subject has been marked complete */
  completed: boolean;
  /** Called when the user toggles the checkbox */
  onToggle: () => void;
}

// ─────────────────────────────────────────────
// ScheduleCard component
// ─────────────────────────────────────────────
export function ScheduleCard({
  item,
  index,
  completed,
  onToggle,
}: ScheduleCardProps) {
  // Left border color based on priority level
  const borderClass =
    item.priority === "High"
      ? "border-l-destructive"
      : item.priority === "Medium"
        ? "border-priority-medium"
        : "border-priority-low";

  return (
    <div
      className={`card-elevated rounded-lg p-4 border-l-4 ${borderClass} bg-card transition-smooth hover:shadow-lg ${
        completed ? "opacity-60" : ""
      }`}
      data-ocid={`schedule.item.${index + 1}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          {/* Completion checkbox — toggled via useProgress */}
          <Checkbox
            id={`check-${item.subject}-${index}`}
            checked={completed}
            onCheckedChange={onToggle}
            className="mt-0.5 shrink-0"
            data-ocid={`schedule.checkbox.${index + 1}`}
          />
          <div className="min-w-0">
            {/* Subject name — struck through when complete */}
            <p
              className={`font-display font-semibold text-foreground text-base leading-tight truncate ${
                completed ? "line-through text-muted-foreground" : ""
              }`}
            >
              {item.subject}
            </p>
            {/* Allocated hours */}
            <div className="flex items-center gap-1.5 mt-1 text-muted-foreground text-sm">
              <Clock size={13} />
              <span>{item.hours.toFixed(1)} hrs/day</span>
            </div>
          </div>
        </div>

        {/* Priority badge */}
        <PriorityBadge priority={item.priority} />
      </div>
    </div>
  );
}
