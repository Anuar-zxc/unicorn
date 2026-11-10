import { ContractCheckIntro } from "@/components/analysis/ContractCheckIntro";
import { UploadContractForm } from "@/components/analysis/UploadContractForm";
import { getFeatureUsage } from "@/lib/usage-server";

export const maxDuration = 60;

export default async function PersonalContractCheckPage() {
  const usage = await getFeatureUsage("analyses");

  return (
    <main className="mx-auto max-w-5xl p-4 md:p-6">
      <ContractCheckIntro
        variant="personal"
        used={usage.used}
        limit={usage.limit}
        allowed={usage.allowed}
      />
      <UploadContractForm disabled={!usage.allowed} />
    </main>
  );
}
