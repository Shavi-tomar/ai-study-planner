// lib/schedule.mo
// Domain logic for generating a personalized daily study schedule.
// This module is stateless — it only contains pure functions.

import Types "../types/schedule";
import Array "mo:core/Array";
import Float "mo:core/Float";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";

module {

  // ─── Date Parsing ──────────────────────────────────────────────────────────

  // parseDate
  // Converts a "YYYY-MM-DD" text string into individual year, month, day Nats.
  // Returns null if the format is wrong or numbers can't be parsed.
  func parseDate(dateText : Text) : ?(Nat, Nat, Nat) {
    // Split "2026-05-10" into ["2026", "05", "10"]
    let parts = dateText.split(#char '-').toArray();
    if (parts.size() != 3) return null;

    // Parse each part as a Nat (returns ?Nat, so we unwrap carefully)
    switch (Nat.fromText(parts[0]), Nat.fromText(parts[1]), Nat.fromText(parts[2])) {
      case (?y, ?m, ?d) ?(y, m, d);
      case _ null;
    };
  };

  // isLeapYear
  // Returns true if the given year is a leap year.
  func isLeapYear(year : Nat) : Bool {
    (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0);
  };

  // daysInMonth
  // Returns how many days are in a given month of a given year.
  func daysInMonth(month : Nat, year : Nat) : Nat {
    switch (month) {
      case 1  31;
      case 2  { if (isLeapYear(year)) 29 else 28 };
      case 3  31;
      case 4  30;
      case 5  31;
      case 6  30;
      case 7  31;
      case 8  31;
      case 9  30;
      case 10 31;
      case 11 30;
      case 12 31;
      case _  30; // fallback — won't happen with valid input
    };
  };

  // dateToDays
  // Converts (year, month, day) to a total day count from year 0.
  // Used to compute the difference between two dates.
  func dateToDays(year : Nat, month : Nat, day : Nat) : Int {
    // Count full years (each year ≈ 365 days, leap years add 1)
    var totalDays : Int = year.toInt() * 365;

    // Add leap days for all previous years
    let y = year.toInt() - 1;
    if (y >= 0) {
      totalDays := totalDays + y / 4 - y / 100 + y / 400;
    };

    // Add days for full months elapsed this year
    var m : Nat = 1;
    while (m < month) {
      totalDays := totalDays + daysInMonth(m, year).toInt();
      m += 1;
    };

    // Add days elapsed this month
    totalDays := totalDays + day.toInt();
    totalDays;
  };

  // daysUntilExam
  // Given an examDate string "YYYY-MM-DD" and today's date (also as a string),
  // returns how many days remain until the exam.
  // Returns 0 if the date is invalid or in the past.
  func daysUntilExam(examDateText : Text, todayYear : Nat, todayMonth : Nat, todayDay : Nat) : Nat {
    switch (parseDate(examDateText)) {
      case (?(ey, em, ed)) {
        let examDays  = dateToDays(ey, em, ed);
        let todayDays = dateToDays(todayYear, todayMonth, todayDay);
        let diff = examDays - todayDays;
        if (diff < 0) 0 else Int.abs(diff);
      };
      case null 0; // invalid date → treat as past/today
    };
  };

  // ─── Priority Logic ─────────────────────────────────────────────────────────

  // basePriority
  // Assigns an initial priority based only on days until the exam:
  //   <= 7 days  → High
  //   8–21 days  → Medium
  //   > 21 days  → Low
  func basePriority(days : Nat) : Types.Priority {
    if (days <= 7)       #High
    else if (days <= 21) #Medium
    else                 #Low;
  };

  // bumpPriority
  // If a subject's difficulty is >= 8, move the priority one level up
  // (Low → Medium, Medium → High, High stays High).
  func bumpPriority(p : Types.Priority) : Types.Priority {
    switch (p) {
      case (#Low)    #Medium;
      case (#Medium) #High;
      case (#High)   #High;
    };
  };

  // priorityText
  // Converts the internal Priority variant to the Text string the frontend expects.
  func priorityText(p : Types.Priority) : Text {
    switch (p) {
      case (#High)   "High";
      case (#Medium) "Medium";
      case (#Low)    "Low";
    };
  };

  // ─── Hour Allocation ────────────────────────────────────────────────────────

  // roundToOneDecimal
  // Rounds a Float to one decimal place (e.g. 2.666 → 2.7).
  func roundToOneDecimal(x : Float) : Float {
    Float.nearest(x * 10.0) / 10.0;
  };

  // ─── Main Algorithm ─────────────────────────────────────────────────────────

  // generateSchedule
  // Given a list of subjects and the number of available hours per day,
  // returns a daily schedule with allocated hours and priority per subject.
  //
  // Rules:
  //   - Higher difficulty → more allocated hours (proportional to difficulty weight)
  //   - Nearer exam date  → higher priority label
  //   - If difficulty >= 8, bump priority up one level
  //   - Total hours across all items sums to hoursPerDay
  //   - Edge case: no subjects → return empty array
  //   - Edge case: single subject → gets all hours
  public func generateSchedule(
    subjects    : [Types.SubjectInput],
    hoursPerDay : Float,
  ) : [Types.ScheduleItem] {

    // ── Edge case: no subjects ──────────────────────────────────────────────
    if (subjects.size() == 0) return [];

    // ── Get today's date from the IC clock ──────────────────────────────────
    // Time.now() returns nanoseconds since Unix epoch (Jan 1, 1970).
    // We convert to days and work out the calendar date.
    let nowNanos : Int = Time.now();
    let nowSeconds : Int = nowNanos / 1_000_000_000;

    // Calculate today's date from Unix epoch using integer arithmetic.
    // We use a well-known algorithm to convert a Unix timestamp to Y/M/D.
    // Ref: https://en.wikipedia.org/wiki/Julian_day#Julian_day_number_from_date
    let z : Int   = nowSeconds / 86400 + 719468;
    let era : Int = (if (z >= 0) z else z - 146096) / 146097;
    let doe : Int = z - era * 146097;                          // day of era
    let yoe : Int = (doe - doe / 1460 + doe / 36524 - doe / 146096) / 365; // year of era
    let y   : Int = yoe + era * 400;
    let doy : Int = doe - (365 * yoe + yoe / 4 - yoe / 100);  // day of year
    let mp  : Int = (5 * doy + 2) / 153;                       // month period
    let d   : Int = doy - (153 * mp + 2) / 5 + 1;             // day
    let m   : Int = if (mp < 10) mp + 3 else mp - 9;          // month
    let yr  : Int = if (m <= 2) y + 1 else y;                 // year

    // Convert computed Int values to Nat for the daysUntilExam helper.
    let todayYear  : Nat = Int.abs(yr);
    let todayMonth : Nat = Int.abs(m);
    let todayDay   : Nat = Int.abs(d);

    // ── Step 1: compute the total difficulty weight ─────────────────────────
    // Sum up all subject difficulties so we can calculate proportional hours.
    let totalDifficulty : Nat = subjects.foldLeft<Types.SubjectInput, Nat>(
      0,
      func(acc, s) { acc + s.difficulty },
    );

    // ── Edge case: all subjects have difficulty 0 ──────────────────────────
    // Treat each subject equally to avoid division by zero.
    let effectiveTotal : Float = if (totalDifficulty == 0) {
      subjects.size().toFloat();
    } else {
      totalDifficulty.toFloat();
    };

    // ── Step 2: map each subject to a ScheduleItem ─────────────────────────
    subjects.map<Types.SubjectInput, Types.ScheduleItem>(
      func(s) {
        // --- Compute allocated hours for this subject ---
        // Each subject gets a share proportional to its difficulty.
        // Formula: (difficulty / totalDifficulty) * hoursPerDay
        let weight : Float = if (totalDifficulty == 0) {
          1.0 / subjects.size().toFloat();
        } else {
          s.difficulty.toFloat() / effectiveTotal;
        };
        let rawHours  = weight * hoursPerDay;
        let allocatedHours = roundToOneDecimal(rawHours);

        // --- Compute priority for this subject ---
        // First, determine base priority from days until exam.
        let days = daysUntilExam(s.examDate, todayYear, todayMonth, todayDay);
        let base = basePriority(days);

        // Then bump priority up if difficulty is very high (>= 8).
        let finalPriority = if (s.difficulty >= 8) bumpPriority(base) else base;

        // --- Build the ScheduleItem record ---
        {
          subject  = s.name;
          hours    = allocatedHours;
          priority = priorityText(finalPriority);
        };
      }
    );
  };
};
