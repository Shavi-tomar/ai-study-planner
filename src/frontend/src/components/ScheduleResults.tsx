/**
 * ScheduleResults component — shows the generated study schedule.
 *
 * Includes:
 * - Header with "Your Study Schedule" title + Regenerate button
 * - Summary stats: total hours, subject count, completion %
 * - Progress bar
 * - Grid of ScheduleCards
 * - Reset progress + loading/empty states
 */

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarCheck2, RefreshCw } from "lucide-react";
import type { ScheduleItem } from "../types";
import { ScheduleCard } from "./ScheduleCard";

// ─────────────────────────────────────────────
// Skeleton loading state (shown while generating)
// ─────────────────────────────────────────────
function ScheduleLoading() {
  return (
    <div className="space-y-3" data-ocid="schedule.loading_state">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-20 w-full rounded-lg" />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// Empty state (shown before first generation)
// ─────────────────────────────────────────────
function ScheduleEmpty() {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 text-center"
      data-ocid="schedule.empty_state"
    >
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <CalendarCheck2 className="text-primary" size={28} />
      </div>
      <h3 className="font-display font-semibold text-foreground text-lg mb-2">
        No schedule yet
      </h3>
      <p className="text-muted-foreground text-sm max-w-xs">
        Fill in your subjects and available hours, then hit{" "}
        <strong>Generate Schedule</strong> to get a personalized study plan.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────
// Summary bar: total hours / subjects / % complete
// ─────────────────────────────────────────────
function ScheduleSummary({
  schedule,
  completedCount,
  totalCount,
}: {
  schedule: ScheduleItem[];
  completedCount: number;
  totalCount: number;
}) {
  const totalHours = schedule.reduce((sum, s) => sum + s.hours, 0);
  const percent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div
      className="grid grid-cols-3 gap-3 mb-5"
      data-ocid="schedule.summary_section"
    >
      {/* Total daily hours */}
      <div className="bg-primary/8 rounded-lg p-3 text-center border border-primary/20">
        <p className="text-primary font-display font-bold text-xl">
          {totalHours.toFixed(1)}
        </p>
        <p className="text-muted-foreground text-xs mt-0.5">Total hrs/day</p>
      </div>
      {/* Number of subjects */}
      <div className="bg-accent/8 rounded-lg p-3 text-center border border-accent/20">
        <p className="text-accent font-display font-bold text-xl">
          {schedule.length}
        </p>
        <p className="text-muted-foreground text-xs mt-0.5">Subjects</p>
      </div>
      {/* Completion percentage */}
      <div className="bg-muted/60 rounded-lg p-3 text-center border border-border">
        <p className="text-foreground font-display font-bold text-xl">
          {percent}%
        </p>
        <p className="text-muted-foreground text-xs mt-0.5">Complete</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ScheduleResults props
// ─────────────────────────────────────────────
interface ScheduleResultsProps {
  /** Generated schedule items */
  schedule: ScheduleItem[];
  /** True while a generation is in progress */
  loading: boolean;
  /** Map of subject name → completed */
  completedMap: Record<string, boolean>;
  /** Number of completed subjects */
  completedCount: number;
  /** Total subjects being tracked */
  totalCount: number;
  /** Toggle a subject's completion state */
  onToggle: (subjectName: string) => void;
  /** Regenerate the schedule with the same inputs */
  onRegenerate: () => void;
  /** Reset all checkboxes */
  onResetProgress: () => void;
}

// ─────────────────────────────────────────────
// ScheduleResults component
// ─────────────────────────────────────────────
export function ScheduleResults({
  schedule,
  loading,
  completedMap,
  completedCount,
  totalCount,
  onToggle,
  onRegenerate,
  onResetProgress,
}: ScheduleResultsProps) {
  return (
    <section
      className="bg-card rounded-xl card-elevated overflow-hidden"
      data-ocid="schedule.section"
    >
      {/* ── Results header ── */}
      <div className="bg-muted/40 border-b border-border px-5 py-4 flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-foreground text-base flex items-center gap-2">
            <CalendarCheck2 size={16} className="text-primary" />
            Your Study Schedule
          </h2>
          <p className="text-muted-foreground text-xs mt-0.5">
            Prioritized by difficulty and exam proximity
          </p>
        </div>

        {/* Regenerate button — only shown when there's a schedule */}
        {schedule.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRegenerate}
            disabled={loading}
            className="gap-1.5 text-xs"
            data-ocid="schedule.regenerate_button"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Regenerate
          </Button>
        )}
      </div>

      {/* ── Content area ── */}
      <div className="p-5">
        {loading ? (
          /* Loading skeleton while waiting for backend */
          <ScheduleLoading />
        ) : schedule.length === 0 ? (
          /* Prompt user to generate their first schedule */
          <ScheduleEmpty />
        ) : (
          <>
            {/* Summary stats row */}
            <ScheduleSummary
              schedule={schedule}
              completedCount={completedCount}
              totalCount={totalCount}
            />

            {/* Progress bar */}
            <div className="mb-5">
              <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                <span>Progress</span>
                <span>
                  {completedCount} / {totalCount} completed
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500 rounded-full"
                  style={{
                    width:
                      totalCount > 0
                        ? `${(completedCount / totalCount) * 100}%`
                        : "0%",
                  }}
                  data-ocid="schedule.progress_bar"
                />
              </div>
            </div>

            {/* Schedule cards grid */}
            <div className="space-y-3" data-ocid="schedule.list">
              {schedule.map((item, index) => (
                <ScheduleCard
                  key={item.subject}
                  item={item}
                  index={index}
                  completed={!!completedMap[item.subject]}
                  onToggle={() => onToggle(item.subject)}
                />
              ))}
            </div>

            {/* Reset progress link — only shown when something is completed */}
            {completedCount > 0 && (
              <button
                type="button"
                onClick={onResetProgress}
                className="mt-4 text-xs text-muted-foreground hover:text-foreground transition-smooth underline w-full text-center"
                data-ocid="schedule.reset_progress_button"
              >
                Reset progress
              </button>
            )}
          </>
        )}
      </div>
    </section>
  );
}
