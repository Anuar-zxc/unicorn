"use client";

import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";
import { StatusScreen } from "@/components/shared/StatusScreen";

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <StatusScreen
      icon={TriangleAlert}
      onPrimary={reset}
      secondaryHref="/dashboard"
      ru={{ title: "Не удалось загрузить раздел", body: "Проверьте соединение и попробуйте ещё раз. Ваши документы в безопасности.", primary: "Попробовать снова", secondary: "В обзор" }}
      en={{ title: "This section could not load", body: "Check your connection and try again. Your documents are safe.", primary: "Try again", secondary: "Back to overview" }}
    />
  );
}
