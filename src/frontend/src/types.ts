/**
 * TypeScript types for the AI Study Planner app.
 * These types define the shape of data flowing between
 * the frontend form, hooks, and backend canister.
 */

/** A single subject the user wants to study */
export interface SubjectInput {
  /** Subject name, e.g. "Mathematics" */
  name: string;
  /** Difficulty rating from 1 (easy) to 10 (very hard) */
  difficulty: number;
  /** Exam date in ISO format: "YYYY-MM-DD" */
  examDate: string;
}

/** A generated schedule item returned by the backend */
export interface ScheduleItem {
  /** Subject name */
  subject: string;
  /** Allocated study hours for this subject */
  hours: number;
  /** Priority level: "High" | "Medium" | "Low" */
  priority: string;
}

/** The full form data submitted to generate a schedule */
export interface FormData {
  /** List of subjects with difficulty and exam dates */
  subjects: SubjectInput[];
  /** How many hours the student can study per day */
  hoursPerDay: number;
}

/** Priority levels as a union type for type safety */
export type PriorityLevel = "High" | "Medium" | "Low";
