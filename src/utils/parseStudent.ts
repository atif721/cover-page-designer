import type { ParsedStudent } from "@/types";

export function parseStudent(raw: string, isProject: boolean): ParsedStudent {
  const parts = raw.split(",").map((s) => s.trim());
  const [namePart = "", idPart = "", ...rest] = parts;
  return {
    name: namePart,
    id: idPart,
    projectTitle: isProject ? rest.join(", ") : "",
  };
}
