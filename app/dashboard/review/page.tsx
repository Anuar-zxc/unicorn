import { ContractCheckIntro } from "@/components/analysis/ContractCheckIntro";
import { UploadContractForm } from "@/components/analysis/UploadContractForm";
import { getFeatureUsage } from "@/lib/usage-server";

export const maxDuration = 60;

export default async function ContractReviewPage() {
  const usage = await getFeatureUsage("analyses");

  return (
    <main className="p-4 md:p-6">
      <ContractCheckIntro
        variant="professional"
        used={usage.used}
        limit={usage.limit}
        allowed={usage.allowed}
      />
      <UploadContractForm disabled={!usage.allowed} />
    </main>
  );
}
