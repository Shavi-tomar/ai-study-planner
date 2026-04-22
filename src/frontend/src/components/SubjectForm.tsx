/**
 * SubjectForm component — handles all study plan inputs.
 *
 * Uses React Hook Form for:
 * - Dynamic subject list (name, difficulty 1-10, exam date)
 * - Global hoursPerDay field
 * - Validation with inline error messages
 */

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BookOpen,
  CalendarCheck2,
  ChevronRight,
  Clock,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import {
  type Control,
  type FieldErrors,
  type UseFormRegister,
  useFieldArray,
} from "react-hook-form";
import type { FormData } from "../types";

// ─────────────────────────────────────────────
// Single subject row inside the dynamic list
// ─────────────────────────────────────────────
function SubjectRow({
  index,
  onRemove,
  register,
  errors,
}: {
  index: number;
  onRemove: () => void;
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
}) {
  // Today's date string used as minimum for exam date validation
  const today = new Date().toISOString().split("T")[0];

  return (
    <div
      className="bg-muted/40 rounded-lg p-3 space-y-3 border border-border"
      data-ocid={`form.subject_row.${index + 1}`}
    >
      {/* Row header: "Subject N" label + remove button */}
      <div className="flex items-center justify-between">
        <span className="font-display text-sm font-semibold text-foreground">
          Subject {index + 1}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="text-muted-foreground hover:text-destructive transition-smooth p-1 rounded"
          aria-label={`Remove subject ${index + 1}`}
          data-ocid={`form.remove_subject_button.${index + 1}`}
        >
          <Trash2 size={15} />
        </button>
      </div>

      {/* Subject name */}
      <div>
        <Label className="text-xs text-muted-foreground mb-1 block">
          Subject Name
        </Label>
        <Input
          {...register(`subjects.${index}.name`, {
            required: "Name is required",
            minLength: { value: 1, message: "Name cannot be empty" },
          })}
          placeholder="e.g. Mathematics"
          className="h-8 text-sm"
          data-ocid={`form.subject_name_input.${index + 1}`}
        />
        {errors?.subjects?.[index]?.name && (
          <p
            className="text-destructive text-xs mt-1"
            data-ocid={`form.subject_name_error.${index + 1}`}
          >
            {errors.subjects[index]?.name?.message}
          </p>
        )}
      </div>

      {/* Difficulty + Exam date side by side */}
      <div className="grid grid-cols-2 gap-2">
        {/* Difficulty: number 1–10 */}
        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">
            Difficulty (1–10)
          </Label>
          <Input
            {...register(`subjects.${index}.difficulty`, {
              required: "Required",
              valueAsNumber: true,
              min: { value: 1, message: "Min 1" },
              max: { value: 10, message: "Max 10" },
            })}
            type="number"
            min={1}
            max={10}
            placeholder="1–10"
            className="h-8 text-sm"
            data-ocid={`form.difficulty_input.${index + 1}`}
          />
          {errors?.subjects?.[index]?.difficulty && (
            <p
              className="text-destructive text-xs mt-1"
              data-ocid={`form.difficulty_error.${index + 1}`}
            >
              {errors.subjects[index]?.difficulty?.message}
            </p>
          )}
        </div>

        {/* Exam date: must be today or later */}
        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">
            Exam Date
          </Label>
          <Input
            {...register(`subjects.${index}.examDate`, {
              required: "Required",
              validate: (val) => val >= today || "Date must be today or later",
            })}
            type="date"
            min={today}
            className="h-8 text-sm"
            data-ocid={`form.exam_date_input.${index + 1}`}
          />
          {errors?.subjects?.[index]?.examDate && (
            <p
              className="text-destructive text-xs mt-1"
              data-ocid={`form.exam_date_error.${index + 1}`}
            >
              {errors.subjects[index]?.examDate?.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SubjectForm props
// ─────────────────────────────────────────────
interface SubjectFormProps {
  /** React Hook Form register function */
  register: UseFormRegister<FormData>;
  /** React Hook Form control (for useFieldArray) */
  control: Control<FormData>;
  /** Validation errors from React Hook Form */
  errors: FieldErrors<FormData>;
  /** Called when the form is submitted */
  onSubmit: (e: React.FormEvent) => void;
  /** True while schedule is being generated */
  loading: boolean;
  /** Backend / generation error message, if any */
  error: string | null;
}

// ─────────────────────────────────────────────
// Main SubjectForm component
// ─────────────────────────────────────────────
export function SubjectForm({
  register,
  control,
  errors,
  onSubmit,
  loading,
  error,
}: SubjectFormProps) {
  // Dynamic subject list managed by React Hook Form
  const { fields, append, remove } = useFieldArray({
    control,
    name: "subjects",
  });

  /** Append a new blank subject row */
  const handleAddSubject = () => {
    append({ name: "", difficulty: 5, examDate: "" });
  };

  return (
    <section
      className="bg-card rounded-xl card-elevated overflow-hidden"
      data-ocid="form.section"
    >
      {/* Form header */}
      <div className="bg-primary/8 border-b border-border px-5 py-4">
        <h2 className="font-display font-bold text-foreground text-base flex items-center gap-2">
          <BookOpen size={16} className="text-primary" />
          Define Your Study Plan
        </h2>
        <p className="text-muted-foreground text-xs mt-0.5">
          Add subjects, set difficulty, pick exam dates
        </p>
      </div>

      <form onSubmit={onSubmit} className="p-5 space-y-5">
        {/* ── Subjects list ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="font-display font-semibold text-foreground text-sm">
              Subjects
            </Label>
            <button
              type="button"
              onClick={handleAddSubject}
              className="flex items-center gap-1 text-primary hover:text-primary/80 text-xs font-semibold transition-smooth"
              data-ocid="form.add_subject_button"
            >
              <Plus size={13} />
              Add Subject
            </button>
          </div>

          {/* Scrollable subject rows */}
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {fields.map((field, index) => (
              <SubjectRow
                key={field.id}
                index={index}
                onRemove={() => remove(index)}
                register={register}
                errors={errors}
              />
            ))}
          </div>

          {/* Empty list prompt */}
          {fields.length === 0 && (
            <p
              className="text-muted-foreground text-sm text-center py-4"
              data-ocid="form.subjects_empty_state"
            >
              No subjects added yet.{" "}
              <button
                type="button"
                onClick={handleAddSubject}
                className="text-primary underline"
              >
                Add one
              </button>
            </p>
          )}
        </div>

        {/* ── Study hours per day ── */}
        <div>
          <Label
            htmlFor="hoursPerDay"
            className="font-display font-semibold text-foreground text-sm mb-1.5 block"
          >
            Study Hours per Day
          </Label>
          <div className="relative">
            <Input
              id="hoursPerDay"
              {...register("hoursPerDay", {
                required: "Required",
                valueAsNumber: true,
                min: { value: 0.5, message: "At least 0.5 hours" },
                max: { value: 24, message: "Max 24 hours" },
              })}
              type="number"
              step="0.5"
              min={0.5}
              max={24}
              placeholder="e.g. 5"
              className="pr-10"
              data-ocid="form.hours_per_day_input"
            />
            <Clock
              size={15}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
          </div>
          {errors.hoursPerDay && (
            <p
              className="text-destructive text-xs mt-1"
              data-ocid="form.hours_per_day_error"
            >
              {errors.hoursPerDay.message}
            </p>
          )}
        </div>

        {/* ── Backend/generation error ── */}
        {error && (
          <div
            className="priority-high border rounded-lg p-3 text-sm"
            data-ocid="form.error_state"
          >
            {error}
          </div>
        )}

        {/* ── Generate Schedule button ── */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full btn-primary font-display font-semibold gap-2 h-11"
          data-ocid="form.generate_button"
        >
          {loading ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              Generating…
            </>
          ) : (
            <>
              <CalendarCheck2 size={16} />
              Generate Schedule
              <ChevronRight size={14} />
            </>
          )}
        </Button>
      </form>
    </section>
  );
}
