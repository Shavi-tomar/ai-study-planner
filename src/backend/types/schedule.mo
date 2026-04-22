// types/schedule.mo
// Types for the AI Study Planner schedule domain

module {
  // A single subject the user wants to study
  // - name: the subject label (e.g. "Math")
  // - difficulty: how hard the subject is, from 1 (easy) to 10 (hard)
  // - examDate: the exam date as a text string in "YYYY-MM-DD" format
  public type SubjectInput = {
    name       : Text;
    difficulty : Nat;   // 1–10
    examDate   : Text;  // "YYYY-MM-DD"
  };

  // Priority level assigned to each subject
  public type Priority = { #High; #Medium; #Low };

  // One item in the generated daily schedule
  // - subject: the subject name
  // - hours: allocated study hours (Float)
  // - priority: urgency label based on exam proximity
  public type ScheduleItem = {
    subject  : Text;
    hours    : Float;
    priority : Text;   // "High" | "Medium" | "Low"
  };
};
