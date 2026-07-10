// Central form hook. Owns all 11 form fields, the pdfUrl state, and the
// persistence effect. Returns a flat object (with the two list operations
// grouped under sub-objects) so App.tsx can destructure once and pass
// the slices it needs to each form sub-component.
//
// Behaviour parity with the previous monolithic App.tsx is intentional:
//   - localStorage key is STORAGE_KEY ("coverPageDesigner:v1")
//   - persistence effect dep array is the 11 fields in declaration order
//   - pdfUrl lifecycle: revoke old URL, build blob, create new URL,
//     window.open, setState — no intermediate setPdfUrl(null)
//   - parseStudent is called with the App (raw, isProject) signature

import { useEffect, useMemo, useState } from "react";

import {
  DEFAULT_TYPE,
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  NAME_LABEL_FOR_TYPE,
  REPORT_PLACEHOLDERS,
  STORAGE_KEY,
} from "@/constants";
import type {
  NameLabel,
  ParsedStudent,
  PersistedState,
  ReportType,
  Student,
  Teacher,
} from "@/types";
import { buildCoverPageBlob } from "@/utils/pdf";
import { parseStudent } from "@/utils/parseStudent";
import { loadFromStorage, saveToStorage } from "@/utils/storage";

// Validator for the persisted shape. Verbatim from App.tsx:63 — only
// checks the two array fields exist; the rest is trusted to round-trip.
function isPersistedState(value: unknown): value is PersistedState {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return Array.isArray(v.students) && Array.isArray(v.teachers);
}

function loadInitialState(): PersistedState {
  return (
    (loadFromStorage(STORAGE_KEY, isPersistedState) as PersistedState | null) ?? {
      type: DEFAULT_TYPE,
      reportName: "",
      reportNo: "",
      courseCode: "",
      courseTitle: "",
      submissionDate: "",
      students: INITIAL_STUDENTS,
      section: "",
      semester: "",
      batch: "",
      teachers: INITIAL_TEACHERS,
    }
  );
}

export interface UseCoverPageForm {
  // scalar fields
  type: ReportType;
  reportName: string;
  reportNo: string;
  courseCode: string;
  courseTitle: string;
  submissionDate: string;
  section: string;
  semester: string;
  batch: string;
  // list sub-objects
  students: {
    items: Student[];
    addStudent: () => void;
    updateStudent: (index: number, value: string) => void;
    removeStudent: (index: number) => void;
  };
  teachers: {
    items: Teacher[];
    addTeacher: () => void;
    updateTeacher: (index: number, field: keyof Teacher, value: string) => void;
    removeTeacher: (index: number) => void;
  };
  // setters exposed for CourseFields / StudentsSection to bind inputs
  setType: (next: ReportType) => void;
  setReportName: (next: string) => void;
  setReportNo: (next: string) => void;
  setCourseCode: (next: string) => void;
  setCourseTitle: (next: string) => void;
  setSubmissionDate: (next: string) => void;
  setSection: (next: string) => void;
  setSemester: (next: string) => void;
  setBatch: (next: string) => void;
  // derived
  isProject: boolean;
  nameLabel: NameLabel;
  reportPlaceholder: string;
  parsedStudents: ParsedStudent[];
  // actions
  handleReset: () => void;
  generatePdf: () => Promise<void>;
  downloadPdf: () => void;
  pdfUrl: string | null;
}

export function useCoverPageForm(): UseCoverPageForm {
  const [type, setType] = useState<ReportType>(DEFAULT_TYPE);
  const [reportName, setReportName] = useState("");
  const [reportNo, setReportNo] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [submissionDate, setSubmissionDate] = useState("");
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [section, setSection] = useState("");
  const [semester, setSemester] = useState("");
  const [batch, setBatch] = useState("");
  const [teachers, setTeachers] = useState<Teacher[]>(INITIAL_TEACHERS);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // Hydrate from localStorage on the first render only. The lazy
  // initializer keeps this single-read under React 19 StrictMode.
  // The initial-render values above are placeholders — the effect
  // below replaces them with the persisted snapshot.
  const [hydrated, setHydrated] = useState(false);
  if (!hydrated) {
    const persisted = loadInitialState();
    setType(persisted.type);
    setReportName(persisted.reportName);
    setReportNo(persisted.reportNo);
    setCourseCode(persisted.courseCode);
    setCourseTitle(persisted.courseTitle);
    setSubmissionDate(persisted.submissionDate);
    setStudents(persisted.students);
    setSection(persisted.section);
    setSemester(persisted.semester);
    setBatch(persisted.batch);
    setTeachers(persisted.teachers);
    setHydrated(true);
  }

  // Persist on any change. Dep array must match App.tsx:113-125 in
  // order — `students` and `teachers` are fresh array refs every
  // render so this effect fires on every keystroke (intentional).
  useEffect(() => {
    const state: PersistedState = {
      type,
      reportName,
      reportNo,
      courseCode,
      courseTitle,
      submissionDate,
      students,
      section,
      semester,
      batch,
      teachers,
    };
    saveToStorage(STORAGE_KEY, state);
  }, [
    type,
    reportName,
    reportNo,
    courseCode,
    courseTitle,
    submissionDate,
    students,
    section,
    semester,
    batch,
    teachers,
  ]);

  // Derived values. Memoised only where the consumers are sub-objects
  // (parsedStudents); nameLabel / reportPlaceholder / isProject are
  // trivial and don't need useMemo.
  const isProject = type === "Project";
  const nameLabel: NameLabel = NAME_LABEL_FOR_TYPE[type];
  const reportPlaceholder: string = REPORT_PLACEHOLDERS[type];
  const parsedStudents = useMemo<ParsedStudent[]>(
    () => students.map((s) => parseStudent(s.raw, isProject)),
    [students, isProject],
  );

  // Student handlers — verbatim from App.tsx:132-146
  const addStudent = () => setStudents((prev) => [...prev, { raw: "" }]);
  const updateStudent = (index: number, value: string) => {
    setStudents((prev) => {
      const next = [...prev];
      next[index] = { raw: value };
      return next;
    });
  };
  const removeStudent = (index: number) => {
    setStudents((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  };

  // Teacher handlers — verbatim from App.tsx:148-162
  const addTeacher = () =>
    setTeachers((prev) => [...prev, { name: "", designation: "" }]);
  const updateTeacher = (index: number, field: keyof Teacher, value: string) => {
    setTeachers((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };
  const removeTeacher = (index: number) => {
    setTeachers((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  };

  // Reset — verbatim from App.tsx:164-178. Explicitly removes the
  // localStorage key after clearing state so a tab-close after reset
  // doesn't leave stale data behind.
  const handleReset = () => {
    if (!confirm("Clear all form data?")) return;
    localStorage.removeItem(STORAGE_KEY);
    setType(DEFAULT_TYPE);
    setReportName("");
    setReportNo("");
    setCourseCode("");
    setCourseTitle("");
    setSubmissionDate("");
    setStudents(INITIAL_STUDENTS);
    setSection("");
    setSemester("");
    setBatch("");
    setTeachers(INITIAL_TEACHERS);
    // Note: pdfUrl is intentionally NOT reset (matches App.tsx:164-178
    // behaviour). The previous blob URL stays available for download
    // until the next generatePdf call revokes it.
  };

  // PDF generation — App.tsx:180-213 lifecycle preserved:
  //   1. revoke old blob URL
  //   2. build new blob (uses the memoised parsed list)
  //   3. create new URL
  //   4. window.open in a new tab
  //   5. setState
  // No intermediate setPdfUrl(null) — the new URL replaces the old.
  const generatePdf = async () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);

    const blob = await buildCoverPageBlob({
      type,
      nameLabel,
      reportName,
      reportNo,
      courseCode,
      courseTitle,
      submissionDate,
      parsedStudents,
      section,
      semester,
      batch,
      teachers,
    });
    const url = URL.createObjectURL(blob);

    window.open(url, "_blank");
    setPdfUrl(url);
  };

  // Download — App.tsx:215-225, unchanged except for the rename
  // from downloadPDF → downloadPdf. Calls parseStudent directly to
  // derive a filename from the first student; this is a second
  // parseStudent call (the memoised list has the same value), which
  // matches the original behaviour.
  const downloadPdf = () => {
    if (!pdfUrl) return;
    const firstName =
      parseStudent(students[0]?.raw ?? "", type === "Project").name || "CoverPage";
    const safeName = firstName.replace(/\s+/g, "_");
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = `${type.replace(/\s+/g, "_")}_${safeName}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return {
    type,
    reportName,
    reportNo,
    courseCode,
    courseTitle,
    submissionDate,
    section,
    semester,
    batch,
    students: {
      items: students,
      addStudent,
      updateStudent,
      removeStudent,
    },
    teachers: {
      items: teachers,
      addTeacher,
      updateTeacher,
      removeTeacher,
    },
    setType,
    setReportName,
    setReportNo,
    setCourseCode,
    setCourseTitle,
    setSubmissionDate,
    setSection,
    setSemester,
    setBatch,
    isProject,
    nameLabel,
    reportPlaceholder,
    parsedStudents,
    handleReset,
    generatePdf,
    downloadPdf,
    pdfUrl,
  };
}
