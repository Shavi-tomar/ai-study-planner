/**
 * useSchedule hook — manages the study schedule state.
 *
 * Handles:
 * - schedule generation via the backend canister (subjects passed at call time)
 * - loading and error state
 */

import { useActor } from "@caffeineai/core-infrastructure";
import { useCallback, useState } from "react";
import { createActor } from "../backend";
import type { backendInterface } from "../backend";
import type { ScheduleItem, SubjectInput } from "../types";

interface UseScheduleReturn {
  /** Generated schedule items after a successful call */
  schedule: ScheduleItem[];
  /** True while the backend call is in flight */
  loading: boolean;
  /** Error message if the backend call failed */
  error: string | null;
  /**
   * Generate a new schedule.
   * Subjects come from the caller (React Hook Form) so the hook stays stateless.
   */
  generateSchedule: (
    subjects: SubjectInput[],
    hoursPerDay: number,
  ) => Promise<void>;
  /** Same as generateSchedule — triggers a fresh generation */
  regenerateSchedule: (
    subjects: SubjectInput[],
    hoursPerDay: number,
  ) => Promise<void>;
}

export function useSchedule(): UseScheduleReturn {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get the live backend actor for canister calls
  const { actor, isFetching } = useActor<backendInterface>(createActor);

  /** Core generation logic — calls the backend canister */
  const runGenerate = useCallback(
    async (subjects: SubjectInput[], hoursPerDay: number) => {
      if (!actor || isFetching) {
        setError("Backend is not ready yet. Please wait a moment.");
        return;
      }
      if (subjects.length === 0) {
        setError("Please add at least one subject before generating.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // The backend expects difficulty as bigint
        const payload = subjects.map((s) => ({
          name: s.name,
          difficulty: BigInt(Math.round(s.difficulty)),
          examDate: s.examDate,
        }));

        // Call the backend generateSchedule method
        const result = await actor.generateSchedule(payload, hoursPerDay);

        // Normalize the result to our local ScheduleItem type
        const normalized: ScheduleItem[] = result.map((item) => ({
          subject: item.subject,
          hours: Number(item.hours),
          priority: item.priority,
        }));

        setSchedule(normalized);
      } catch (err) {
        console.error("generateSchedule error:", err);
        setError("Failed to generate schedule. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [actor, isFetching],
  );

  return {
    schedule,
    loading,
    error,
    generateSchedule: runGenerate,
    regenerateSchedule: runGenerate,
  };
}
