import { ContractTypeSelectorPage } from "@/components/contracts/ContractTypeSelectorPage";
import { CONTRACT_TYPES } from "@/lib/contract-types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function BuildPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("contract_types")
    .select("*")
    .contains("available_for", ["individual"])
    .order("sort_order");
  const types = data?.length
    ? data
    : CONTRACT_TYPES.filter((type) => type.available_for.includes("individual"));
  return <ContractTypeSelectorPage accountType="individual" types={types} />;
}
