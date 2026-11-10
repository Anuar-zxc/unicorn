import type { Metadata } from "next";
import { LegalDocument, type LegalContent } from "@/components/legal/LegalDocument";

export const metadata: Metadata = {
  title: "Политика использования AI",
  description: "Как Lexo использует искусственный интеллект, его ограничения и как проверять ответы.",
  alternates: { canonical: "/ai-policy" }
};

const ru: LegalContent = {
  title: "Политика использования AI",
  updated: "Обновлено: ноябрь 2026",
  intro:
    "Lexo использует большие языковые модели, чтобы помогать разбираться в правовых вопросах. Мы хотим, чтобы вы понимали, как это работает и где у AI есть пределы.",
  sections: [
    {
      title: "Как формируются ответы",
      body: [
        "Для вопросов по праву Казахстана Lexo сначала находит релевантные статьи в базе официальных текстов из ИПС «Әділет» (Конституция, Гражданский, Трудовой, Предпринимательский и Гражданский процессуальный кодексы, закон о персональных данных) и передаёт их модели вместе с вашим вопросом. Модель должна опираться на эти выдержки и указывать источники.",
        "Документы, которые вы загружаете, используются только для ответа на ваш запрос."
      ]
    },
    {
      title: "Ограничения",
      body: [
        "AI может ошибаться, пропускать важные детали или опираться на устаревшие редакции. База знаний не охватывает всё законодательство — например, налоговые правила меняются часто и требуют проверки на kgd.gov.kz.",
        "Lexo не знает обстоятельств, о которых вы не сообщили, и не может оценить доказательства так, как это сделает суд."
      ]
    },
    {
      title: "Как пользоваться безопасно",
      body: [
        "Проверяйте ссылки на статьи по официальным источникам. Для решений с серьёзными последствиями — суд, крупная сделка, увольнение, налоги — обращайтесь к юристу; Lexo подготовит вопросы для консультации.",
        "Не загружайте данные третьих лиц без законного основания."
      ]
    },
    {
      title: "Ваши данные и обучение моделей",
      body: [
        "Мы не используем ваши документы и запросы для обучения моделей. Подробнее о хранении и удалении — в Политике конфиденциальности."
      ]
    }
  ]
};

const en: LegalContent = {
  title: "AI Use Policy",
  updated: "Last updated: November 2026",
  intro:
    "Lexo uses large language models to help you understand legal questions. We want you to know how this works and where AI has limits.",
  sections: [
    {
      title: "How answers are produced",
      body: [
        "For questions about Kazakhstan law, Lexo first retrieves relevant articles from official texts in the Adilet database (the Constitution, the Civil, Labour, Entrepreneurial and Civil Procedure codes, and the personal data law) and passes them to the model with your question. The model is instructed to rely on these extracts and cite them.",
        "Documents you upload are used only to answer your request."
      ]
    },
    {
      title: "Limitations",
      body: [
        "AI can make mistakes, miss important details, or rely on outdated wording. The knowledge base does not cover all legislation — tax rules, for example, change often and must be checked at kgd.gov.kz.",
        "Lexo does not know facts you have not shared and cannot weigh evidence the way a court would."
      ]
    },
    {
      title: "Using it safely",
      body: [
        "Verify cited articles against official sources. For high-stakes decisions — court, large transactions, dismissal, taxes — consult a lawyer; Lexo will prepare the questions to ask.",
        "Do not upload third-party data without a lawful basis."
      ]
    },
    {
      title: "Your data and model training",
      body: ["We do not use your documents or requests to train models. See the Privacy Policy for storage and deletion."]
    }
  ]
};

export default function AIPolicyPage() {
  return <LegalDocument ru={ru} en={en} />;
}
