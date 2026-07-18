import type { Teacher } from "@/types";

export interface UrlCourseParams {
  courseCode?: string;
  courseTitle?: string;
  teacher?: string;
  designation?: string;
  section?: string;
  semester?: string;
}

export function getUrlParams(): UrlCourseParams {
  const params = new URLSearchParams(window.location.search);
  const result: UrlCourseParams = {};

  const courseCode = params.get("courseCode");
  const courseTitle = params.get("courseTitle");
  const teacher = params.get("teacher");
  const designation = params.get("designation");
  const section = params.get("section");
  const semester = params.get("semester");

  if (courseCode) result.courseCode = courseCode;
  if (courseTitle) result.courseTitle = courseTitle;
  if (teacher) result.teacher = teacher;
  if (designation) result.designation = designation;
  if (section) result.section = section;
  if (semester) result.semester = semester;

  return result;
}

export function parseTeachersFromUrl(
  teacherParam: string,
  designationParam?: string,
): Teacher[] {
  const names = teacherParam
    .split(",")
    .map((name) => name.trim())
    .filter((name) => name.length > 0);

  const designations = (designationParam ?? "")
    .split(",")
    .map((d) => d.trim());

  return names.map((name, i) => ({
    name,
    designation: designations[i] ?? "",
  }));
}