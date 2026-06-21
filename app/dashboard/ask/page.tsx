import { ToolWorkspace } from "@/components/dashboard/ToolWorkspace";

export default function PersonalQuestionPage() {
  return (
    <ToolWorkspace
      title="Ask a Legal Question"
      eyebrow="Plain-language legal information"
      description="Describe what happened and what you want to understand. Lexo will explain the likely rules, uncertainties, and practical next steps."
      endpoint="/api/ask"
      icon="research"
      inputLabel="What happened?"
      inputPlaceholder="Include the important facts, dates, documents, and what outcome you want…"
      contextLabel="Country, city, or jurisdiction"
      contextPlaceholder="Example: Kazakhstan · Almaty"
      outputLabel="Clear legal explanation"
      samples={[
        "Can my landlord keep my entire deposit?",
        "Can an employer change my salary without a new agreement?",
        "What should I check before signing a freelance contract?"
      ]}
    />
  );
}
