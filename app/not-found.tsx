"use client";

import { FileQuestion } from "lucide-react";
import { StatusScreen } from "@/components/shared/StatusScreen";

export default function NotFound() {
  return (
    <StatusScreen
      icon={FileQuestion}
      code="404"
      primaryHref="/"
      secondaryHref="/dashboard"
      ru={{ title: "Страница не найдена", body: "Возможно, ссылка устарела или документ был удалён.", primary: "На главную", secondary: "В кабинет" }}
      en={{ title: "Page not found", body: "The link may be outdated or the document was deleted.", primary: "Go home", secondary: "Open workspace" }}
    />
  );
}
