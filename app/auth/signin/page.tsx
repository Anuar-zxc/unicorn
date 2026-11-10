import { AuthCard } from "@/components/auth/AuthCard";
import { safeRedirectPath } from "@/lib/safe-redirect";

export default async function SignInPage({
  searchParams
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  return (
    <AuthCard
      mode="signin"
      next={safeRedirectPath(params.next)}
      error={params.error}
    />
  );
}
