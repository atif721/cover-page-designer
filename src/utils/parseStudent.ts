// Parses a single student raw input string of the form
//   "Name, ID[, Project is about...]"
// into structured fields. A project title may itself contain commas —
// we only split into at most 3 parts and join the rest verbatim.
//
// Verbatim move from the previous App.tsx (lines 45-55). The
// PDFPreview component has a similar but not-identical version; that
// variant is intentionally out of scope for this refactor.

import type { ParsedStudent } from "@/types";

export function parseStudent(raw: string, isProject: boolean): ParsedStudent {
  // Format: "Name, ID[, Project is about...]"
  // Split into at most 3 parts so a project title with commas survives intact.
  const parts = raw.split(",").map((s) => s.trim());
  const [namePart = "", idPart = "", ...rest] = parts;
  return {
    name: namePart,
    id: idPart,
    projectTitle: isProject ? rest.join(", ") : "",
  };
}
