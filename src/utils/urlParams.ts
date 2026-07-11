import type { Teacher } from "@/types";

export interface UrlCourseParams {
  courseCode?: string;
  courseTitle?: string;
  teacher?: string;
  section?: string;
  semester?: string;
}

export function getUrlParams(): UrlCourseParams {
  const params = new URLSearchParams(window.location.search);
  const result: UrlCourseParams = {};

  const courseCode = params.get("courseCode");
  const courseTitle = params.get("courseTitle");
  const teacher = params.get("teacher");
  const section = params.get("section");
  const semester = params.get("semester");

  if (courseCode) result.courseCode = courseCode;
  if (courseTitle) result.courseTitle = courseTitle;
  if (teacher) result.teacher = teacher;
  if (section) result.section = section;
  if (semester) result.semester = semester;

  return result;
}

export function parseTeachersFromUrl(teacherParam: string): Teacher[] {
  return teacherParam
    .split(",")
    .map((name) => name.trim())
    .filter((name) => name.length > 0)
    .map((name) => ({ name, designation: "" }));
}