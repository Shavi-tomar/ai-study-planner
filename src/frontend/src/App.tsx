/**
 * AI Study Planner — Main App
 *
 * Layout: sticky header + two-column (form | results) on desktop,
 *         stacked single-column on mobile. All state lives in hooks.
 *
 * Components:
 * - SubjectForm  : inputs (subjects, difficulty, exam date, hours/day)
 * - ScheduleResults : displays the generated schedule with progress
 */

import { BarChart3, GraduationCap } from "lucide-react";
import { useForm } from "react-hook-form";
import { ScheduleResults } from "./components/ScheduleResults";
import { SubjectForm } from "./components/SubjectForm";
import { useProgress } from "./hooks/useProgress";
import { useSchedule } from "./hooks/useSchedule";
import type { FormData, SubjectInput } from "./types";

export default function App() {
  // Schedule generation state + actions
  const { schedule, loading, error, generateSchedule, regenerateSchedule } =
    useSchedule();

  // Progress tracking — tied to the current schedule's subjects
  const scheduleSubjectNames = schedule.map((s) => s.subject);
  const {
    completedMap,
    toggleComplete,
    resetProgress,
    completedCount,
    totalCount,
  } = useProgress(scheduleSubjectNames);

  // React Hook Form — pre-seeded with example subjects so the app looks
  // finished on first load
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      subjects: [
        { name: "Mathematics", difficulty: 9, examDate: "2026-05-10" },
        { name: "Science", difficulty: 7, examDate: "2026-05-15" },
        { name: "History", difficulty: 5, examDate: "2026-05-20" },
      ],
      hoursPerDay: 5,
    },
  });

  /** Called on form submit — generates a fresh schedule */
  const onSubmit = async (data: FormData) => {
    // Reset progress whenever we generate a new schedule
    resetProgress();
    const subjects: SubjectInput[] = data.subjects.map((s) => ({
      name: s.name,
      difficulty: Number(s.difficulty),
      examDate: s.examDate,
    }));
    await generateSchedule(subjects, data.hoursPerDay);
  };

  /** Regenerate using the current form values (no page reset) */
  const handleRegenerate = async () => {
    resetProgress();
    const currentSubjects = watch("subjects").map((s) => ({
      name: s.name,
      difficulty: Number(s.difficulty),
      examDate: s.examDate,
    }));
    await regenerateSchedule(currentSubjects, Number(watch("hoursPerDay")));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ── Sticky header ── */}
      <header
        className="bg-card border-b border-border shadow-sm sticky top-0 z-10"
        data-ocid="app.header"
      >
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Branding */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap size={18} className="text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-foreground text-lg">
              AI Study Planner
            </span>
          </div>
          {/* Tagline */}
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <BarChart3 size={15} />
            <span className="hidden sm:inline">Personalized schedules</span>
          </div>
        </div>
      </header>

      {/* ── Main two-column layout ── */}
      <main
        className="flex-1 max-w-6xl mx-auto w-full px-4 py-6"
        data-ocid="app.main"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 items-start">
          {/* LEFT: Subject input form */}
          <SubjectForm
            register={register}
            control={control}
            errors={errors}
            onSubmit={handleSubmit(onSubmit)}
            loading={loading}
            error={error}
          />

          {/* RIGHT: Generated schedule results */}
          <ScheduleResults
            schedule={schedule}
            loading={loading}
            completedMap={completedMap}
            completedCount={completedCount}
            totalCount={totalCount}
            onToggle={toggleComplete}
            onRegenerate={handleRegenerate}
            onResetProgress={resetProgress}
          />
        </div>
      </main>

      {/* ── Footer ── */}
      <footer
        className="bg-muted/40 border-t border-border py-4 mt-6"
        data-ocid="app.footer"
      >
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== "undefined" ? window.location.hostname : "",
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
