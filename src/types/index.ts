export type ReportType = "Lab Report" | "Assignment" | "Project" | "Experiment";

export type NameLabel =
  | "Experiment Name"
  | "Report Title"
  | "Project Title"
  | "Assignment Title"
  | "";

export interface Teacher {
  name: string;
  designation: string;
}

export interface Student {
  raw: string;
  hidden?: boolean;
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
  showTitleBox: boolean;
}
