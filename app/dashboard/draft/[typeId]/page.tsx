import { notFound } from "next/navigation";
import { ContractWizard } from "@/components/contracts/ContractWizard";
import { getContractType } from "@/lib/contract-types";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { normalizeAILanguage } from "@/lib/ai-language";

export default async function LawyerDraftWizardPage({
  params
}: {
  params: Promise<{ typeId: string }>;
}) {
  const { typeId } = await params;
  const contractType = getContractType(typeId);
  if (!contractType?.available_for.includes("lawyer")) notFound();
  const supabase = await createSupabaseServerClient();
  const { data: profile } = await supabase.from("profiles").select("ai_language").maybeSingle();
  return <ContractWizard contractType={contractType} accountType="lawyer" initialLanguage={normalizeAILanguage(profile?.ai_language)} />;
}
