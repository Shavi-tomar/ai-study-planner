// mixins/schedule-api.mo
// Public API mixin for the schedule domain.
// Exposes canister-level query/update methods to the frontend.

import Types    "../types/schedule";
import ScheduleLib "../lib/schedule";

mixin () {
  // generateSchedule
  // Accepts an array of subjects (name, difficulty, examDate) and the
  // number of study hours available per day.
  // Returns an array of ScheduleItem records with allocated hours and priority.
  //
  // This is a `query` call — read-only, faster, and cheaper than an update.
  public query func generateSchedule(
    subjects    : [Types.SubjectInput],
    hoursPerDay : Float,
  ) : async [Types.ScheduleItem] {
    // Delegate all logic to the pure library function
    ScheduleLib.generateSchedule(subjects, hoursPerDay);
  };
};
