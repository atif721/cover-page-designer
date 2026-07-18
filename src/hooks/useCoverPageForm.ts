import { useEffect, useMemo, useState } from "react";
import { getUrlParams, parseTeachersFromUrl, sortTeachersByDesignation } from "@/utils/urlParams";

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
import { getBatchForSemester } from "@/utils/batchCalculation";

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
  type: ReportType;
  reportName: string;
  reportNo: string;
  courseCode: string;
  courseTitle: string;
  submissionDate: string;
  section: string;
  semester: string;
  batch: string;
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
  setType: (next: ReportType) => void;
  setReportName: (next: string) => void;
  setReportNo: (next: string) => void;
  setCourseCode: (next: string) => void;
  setCourseTitle: (next: string) => void;
  setSubmissionDate: (next: string) => void;
  setSection: (next: string) => void;
  setSemester: (next: string) => void;
  setBatch: (next: string) => void;
  isProject: boolean;
  nameLabel: NameLabel;
  reportPlaceholder: string;
  parsedStudents: ParsedStudent[];
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

  const [hydrated, setHydrated] = useState(false);
  if (!hydrated) {
    const persisted = loadInitialState();
    const urlParams = getUrlParams();

    setType(persisted.type);
    setReportName(persisted.reportName);
    setReportNo(persisted.reportNo);

    setCourseCode(urlParams.courseCode ?? persisted.courseCode);
    setCourseTitle(urlParams.courseTitle ?? persisted.courseTitle);

    setSubmissionDate(persisted.submissionDate);
    setStudents(persisted.students);

    setSection(urlParams.section ?? persisted.section);
    const finalSemester = urlParams.semester ?? persisted.semester;
    setSemester(finalSemester);

    if (urlParams.semester) {
      setBatch(getBatchForSemester(Number(urlParams.semester)));
    } else {
      setBatch(persisted.batch);
    }

    if (urlParams.teacher) {
      const teachers = parseTeachersFromUrl(urlParams.teacher, urlParams.designation);
      setTeachers(sortTeachersByDesignation(teachers));
    } else {
      setTeachers(persisted.teachers);
    }

    setHydrated(true);
  }

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


  const isProject = type === "Project";
  const nameLabel: NameLabel = NAME_LABEL_FOR_TYPE[type];
  const reportPlaceholder: string = REPORT_PLACEHOLDERS[type];
  const parsedStudents = useMemo<ParsedStudent[]>(
    () => students.map((s) => parseStudent(s.raw, isProject)),
    [students, isProject],
  );

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
  };

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
