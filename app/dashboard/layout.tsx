import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (!claims?.sub) redirect("/auth/signin");

  return (
    <DashboardLayout
      userEmail={typeof claims.email === "string" ? claims.email : ""}
      userPlan="free"
    >
      {children}
    </DashboardLayout>
  );
}
