// App-wide constants. Pure values — no React, no side effects.
// Verbatim moves from the previous monolithic App.tsx.

import type { NameLabel, ReportType, Student, Teacher } from "@/types";

export const STORAGE_KEY = "coverPageDesigner:v1";

// The four report types the user can pick from, in the same order they
// were previously listed in the radio group (App.tsx:274).
export const REPORT_TYPES: readonly ReportType[] = [
  "Lab Report",
  "Experiment",
  "Assignment",
  "Project",
];

export const DEFAULT_TYPE: ReportType = "Lab Report";

export const INITIAL_STUDENTS: Student[] = [{ raw: "" }];
export const INITIAL_TEACHERS: Teacher[] = [{ name: "", designation: "" }];

// Per-type label for the shared "name" box. Verbatim from App.tsx:24-29.
// The "" entry for Assignment matches the existing behaviour where
// Assignment's name box is hidden entirely.
export const NAME_LABEL_FOR_TYPE: Record<ReportType, NameLabel> = {
  Experiment: "Experiment Name",
  "Lab Report": "Report Title",
  Project: "Project Title",
  Assignment: "",
};

// Placeholder shown in the shared name box per type. Verbatim from
// App.tsx:228-232. The "Assignment" entry is technically unused because
// the name box is hidden for Assignment, but it's kept for completeness
// in case the conditional rendering ever changes.
export const REPORT_PLACEHOLDERS: Record<ReportType, string> = {
  Project: "e.g. (leave empty — set per student)",
  Experiment: "e.g. Study of Sorting Algorithms",
  "Lab Report": "e.g. Mid-term Performance Analysis",
  Assignment: "e.g. (not used for Assignment)",
};
