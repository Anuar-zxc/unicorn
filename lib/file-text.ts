export type ExtractedDocument =
  | {
      kind: "text";
      fileName: string;
      mimeType: string;
      text: string;
    }
  | {
      kind: "image";
      fileName: string;
      mimeType: string;
      dataUrl: string;
    };

const imageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]);

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

/** Errors safe to show to the user (bad file, too large, unreadable). */
export class DocumentInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DocumentInputError";
  }
}

export async function extractDocumentForAnalysis(file: File): Promise<ExtractedDocument> {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new DocumentInputError(`"${file.name}" is larger than 10 MB.`);
  }
  const bytes = Buffer.from(await file.arrayBuffer());
  const name = file.name.toLowerCase();
  const mimeType = file.type || "application/octet-stream";

  if (file.type === "application/pdf" || name.endsWith(".pdf")) {
    const pdfParse = (await import("pdf-parse")).default;
    let text = "";
    try {
      text = (await pdfParse(bytes)).text;
    } catch {
      throw new DocumentInputError(`Could not read "${file.name}". The PDF may be damaged or password-protected.`);
    }
    return { kind: "text", fileName: file.name, mimeType, text: normalizeExtractedText(text) };
  }

  if (
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    name.endsWith(".docx")
  ) {
    const mammoth = await import("mammoth");
    let text = "";
    try {
      text = (await mammoth.extractRawText({ buffer: bytes })).value;
    } catch {
      throw new DocumentInputError(`Could not read "${file.name}". Save it again as .docx and retry.`);
    }
    return { kind: "text", fileName: file.name, mimeType, text: normalizeExtractedText(text) };
  }

  if (
    imageTypes.has(file.type) ||
    /\.(jpe?g|png|webp|heic|heif)$/i.test(file.name)
  ) {
    const imageMimeType =
      file.type ||
      (name.endsWith(".png")
        ? "image/png"
        : name.endsWith(".webp")
          ? "image/webp"
          : name.endsWith(".heic")
            ? "image/heic"
            : name.endsWith(".heif")
              ? "image/heif"
              : "image/jpeg");
    return {
      kind: "image",
      fileName: file.name,
      mimeType: imageMimeType,
      dataUrl: `data:${imageMimeType};base64,${bytes.toString("base64")}`
    };
  }

  throw new DocumentInputError("Unsupported file type. Upload a PDF, DOCX, JPG, PNG, WEBP, HEIC, or HEIF file.");
}

/** Collapses the whitespace noise PDF extraction produces, saving model context. */
function normalizeExtractedText(text: string) {
  return text
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t\u00a0]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function extractContractText(file: File) {
  const document = await extractDocumentForAnalysis(file);
  if (document.kind !== "text") {
    throw new Error("Image files require vision analysis.");
  }
  return document.text;
}
