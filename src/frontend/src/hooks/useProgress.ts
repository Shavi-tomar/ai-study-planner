/**
 * useProgress hook — tracks which scheduled subjects have been completed.
 *
 * Manages a map of { subjectName -> boolean } so users can check off
 * subjects as they finish studying.
 */

import { useCallback, useState } from "react";

interface UseProgressReturn {
  /** Map of subject name to completion status */
  completedMap: Record<string, boolean>;
  /** Toggle a subject's completion state */
  toggleComplete: (subjectName: string) => void;
  /** Reset all subjects to incomplete */
  resetProgress: () => void;
  /** Count of completed subjects */
  completedCount: number;
  /** Total number of tracked subjects */
  totalCount: number;
}

export function useProgress(subjectNames: string[]): UseProgressReturn {
  // Initialize all subjects as not completed
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});

  /** Toggle a single subject between complete / incomplete */
  const toggleComplete = useCallback((subjectName: string) => {
    setCompletedMap((prev) => ({
      ...prev,
      [subjectName]: !prev[subjectName],
    }));
  }, []);

  /** Clear all progress — useful when regenerating the schedule */
  const resetProgress = useCallback(() => {
    setCompletedMap({});
  }, []);

  // Derive counts from the current map and subject list
  const completedCount = subjectNames.filter(
    (name) => completedMap[name],
  ).length;
  const totalCount = subjectNames.length;

  return {
    completedMap,
    toggleComplete,
    resetProgress,
    completedCount,
    totalCount,
  };
}
