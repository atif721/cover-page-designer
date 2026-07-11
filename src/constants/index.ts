import type { NameLabel, ReportType, Student, Teacher } from "@/types";

export const STORAGE_KEY = "coverPageDesigner:v1";

export const REPORT_TYPES: readonly ReportType[] = [
  "Lab Report",
  "Experiment",
  "Assignment",
  "Project",
];

export const DEFAULT_TYPE: ReportType = "Lab Report";

export const INITIAL_STUDENTS: Student[] = [{ raw: "" }];
export const INITIAL_TEACHERS: Teacher[] = [{ name: "", designation: "" }];

export const NAME_LABEL_FOR_TYPE: Record<ReportType, NameLabel> = {
  Experiment: "Experiment Name",
  "Lab Report": "Report Title",
  Project: "Project Title",
  Assignment: "",
};

export const REPORT_PLACEHOLDERS: Record<ReportType, string> = {
  Project: "e.g. (leave empty — set per student)",
  Experiment: "e.g. Study of Sorting Algorithms",
  "Lab Report": "e.g. Mid-term Performance Analysis",
  Assignment: "e.g. (not used for Assignment)",
};
