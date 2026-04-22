import type { backendInterface } from "../backend";

export const mockBackend: backendInterface = {
  generateSchedule: async (subjects, hoursPerDay) => {
    // Return sample schedule items based on subjects
    const result = subjects.map((s, i) => {
      const priorities = ["High", "Medium", "Low"];
      const priority = priorities[i % 3];
      const totalHours = typeof hoursPerDay === "number" ? hoursPerDay : 5;
      const hours = Math.max(1, Math.round(totalHours / subjects.length));
      return {
        subject: s.name,
        hours,
        priority,
      };
    });
    return result;
  },
};
