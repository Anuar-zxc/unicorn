"use client";

import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";
import { StatusScreen } from "@/components/shared/StatusScreen";

export default function RootError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <StatusScreen
      icon={TriangleAlert}
      onPrimary={reset}
      secondaryHref="/"
      ru={{ title: "Что-то пошло не так", body: "Мы уже знаем об ошибке. Попробуйте обновить страницу.", primary: "Попробовать снова", secondary: "На главную" }}
      en={{ title: "Something went wrong", body: "We have logged the error. Please try reloading the page.", primary: "Try again", secondary: "Go home" }}
    />
  );
}
