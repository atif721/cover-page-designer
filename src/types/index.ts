// Shared type definitions for the cover-page-designer app.
// Verbatim moves from the previous monolithic App.tsx (lines 8, 10-17, 31-43)
// and CoverPagePDF.tsx (line 104: NameLabel). The local declarations still
// living in CoverPagePDF.tsx and PDFPreview.tsx are intentionally left in
// place for now; new code should import from here.

export type ReportType = "Lab Report" | "Assignment" | "Project" | "Experiment";

// Per-type label for the shared "name" box (hidden for Assignment and Project).
// Project gets an empty label here because each student supplies a per-student
// project title in their own input row.
export type NameLabel = "Experiment Name" | "Report Title" | "Project Title" | "";

export interface Teacher {
  name: string;
  designation: string;
}

export interface Student {
  raw: string;
}

export interface ParsedStudent {
  name: string;
  id: string;
  projectTitle: string;
}

export interface PersistedState {
  type: ReportType;
  reportName: string;
  reportNo: string;
  courseCode: string;
  courseTitle: string;
  submissionDate: string;
  students: Student[];
  section: string;
  semester: string;
  batch: string;
  teachers: Teacher[];
}
