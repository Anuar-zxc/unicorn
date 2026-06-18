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

export async function extractDocumentForAnalysis(file: File): Promise<ExtractedDocument> {
  const bytes = Buffer.from(await file.arrayBuffer());
  const name = file.name.toLowerCase();
  const mimeType = file.type || "application/octet-stream";

  if (file.type === "application/pdf" || name.endsWith(".pdf")) {
    const pdfParse = (await import("pdf-parse")).default;
    const parsed = await pdfParse(bytes);
    return { kind: "text", fileName: file.name, mimeType, text: parsed.text };
  }

  if (
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    name.endsWith(".docx")
  ) {
    const mammoth = await import("mammoth");
    const parsed = await mammoth.extractRawText({ buffer: bytes });
    return { kind: "text", fileName: file.name, mimeType, text: parsed.value };
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

  throw new Error("Unsupported file type. Upload a PDF, DOCX, JPG, PNG, WEBP, HEIC, or HEIF file.");
}

export async function extractContractText(file: File) {
  const document = await extractDocumentForAnalysis(file);
  if (document.kind !== "text") {
    throw new Error("Image files require vision analysis.");
  }
  return document.text;
}
