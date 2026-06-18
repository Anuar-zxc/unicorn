import { AuthCard } from "@/components/auth/AuthCard";

function safeNext(value: string | undefined) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/dashboard";
}

export default async function SignInPage({
  searchParams
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  return (
    <AuthCard
      mode="signin"
      next={safeNext(params.next)}
      error={params.error}
    />
  );
}
