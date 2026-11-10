import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";

export const metadata: Metadata = {
  title: "Регистрация",
  robots: { index: false }
};

export default async function SignUpPage({
  searchParams
}: {
  searchParams: Promise<{ account?: string }>;
}) {
  const { account } = await searchParams;
  const initialAccountType =
    account === "lawyer" || account === "individual" ? account : undefined;
  return <AuthCard mode="signup" initialAccountType={initialAccountType} />;
}
