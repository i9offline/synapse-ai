import pdf from "pdf-parse";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXTENSIONS = [".pdf", ".md", ".txt"];

export class FileValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FileValidationError";
  }
}

export function validateFile(file: File): void {
  if (file.size > MAX_FILE_SIZE) {
    throw new FileValidationError(
      `File "${file.name}" exceeds 10MB limit (${(file.size / 1024 / 1024).toFixed(1)}MB)`
    );
  }

  const ext = "." + file.name.split(".").pop()?.toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    throw new FileValidationError(
      `File "${file.name}" has unsupported type. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`
    );
  }
}

export async function parseFileToText(file: File): Promise<string> {
  const ext = "." + file.name.split(".").pop()?.toLowerCase();

  if (ext === ".pdf") {
    const buffer = Buffer.from(await file.arrayBuffer());
    try {
      const data = await pdf(buffer);
      return data.text;
    } catch {
      throw new FileValidationError(
        `File "${file.name}" could not be parsed. Make sure it's a valid PDF.`
      );
    }
  }

  const text = await file.text();

  // Strip YAML frontmatter from markdown
  if (ext === ".md") {
    return text.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, "").trim();
  }

  return text;
}
