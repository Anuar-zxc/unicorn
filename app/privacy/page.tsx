import type { Metadata } from "next";
import { LegalDocument, type LegalContent } from "@/components/legal/LegalDocument";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description: "Какие данные собирает Lexo, зачем, где они хранятся и как их удалить.",
  alternates: { canonical: "/privacy" }
};

const ru: LegalContent = {
  title: "Политика конфиденциальности",
  updated: "Обновлено: ноябрь 2026",
  intro:
    "Эта политика объясняет, какие данные обрабатывает Lexo, зачем и как вы можете ими управлять. Мы обрабатываем персональные данные в соответствии с Законом Республики Казахстан «О персональных данных и их защите».",
  sections: [
    {
      title: "1. Какие данные мы обрабатываем",
      body: [
        "Данные аккаунта: email, имя, название компании (если указано), тип аккаунта и языковые настройки.",
        "Ваши материалы: загруженные документы, введённые вопросы и тексты, а также результаты анализа, которые сохраняются в истории.",
        "Платёжные данные: статус подписки и идентификаторы клиента у платёжного провайдера. Данные банковских карт мы не получаем и не храним.",
        "Технические данные: обезличенная статистика посещений, необходимая для работы и улучшения сервиса."
      ]
    },
    {
      title: "2. Зачем мы их используем",
      body: [
        "Чтобы предоставлять сервис: анализировать документы, отвечать на вопросы, сохранять историю и учитывать лимиты тарифа.",
        "Чтобы обрабатывать оплату, отвечать на обращения и сообщать о существенных изменениях сервиса.",
        "Мы не продаём персональные данные и не используем ваши документы для обучения моделей."
      ]
    },
    {
      title: "3. Кто ещё участвует в обработке",
      body: [
        "Для работы сервиса мы используем проверенных поставщиков: облачную базу данных и хранилище файлов, хостинг веб-приложения, AI-провайдера для обработки запросов и платёжного провайдера. Они получают только данные, необходимые для выполнения своей функции.",
        "Данные могут обрабатываться на серверах за пределами Казахстана. Используя сервис, вы соглашаетесь на такую трансграничную передачу."
      ]
    },
    {
      title: "4. Хранение и защита",
      body: [
        "Файлы хранятся в приватном хранилище; доступ к документам и отчётам ограничен вашим аккаунтом на уровне базы данных. Данные передаются по HTTPS и шифруются при хранении у облачного провайдера.",
        "Мы храним материалы, пока у вас есть аккаунт, или до тех пор, пока вы их не удалите."
      ]
    },
    {
      title: "5. Ваши права",
      body: [
        "Вы можете в любой момент удалить отчёт вместе с файлом в разделе истории, изменить данные профиля в настройках или запросить копию и удаление всех данных аккаунта.",
        `Для запросов о персональных данных напишите на ${CONTACT_EMAIL}. Мы ответим в течение 10 рабочих дней.`
      ]
    },
    {
      title: "6. Изменения политики",
      body: [
        "Мы можем обновлять эту политику. О существенных изменениях сообщим по email или в интерфейсе сервиса."
      ]
    }
  ]
};

const en: LegalContent = {
  title: "Privacy Policy",
  updated: "Last updated: November 2026",
  intro:
    "This policy explains what data Lexo processes, why, and how you can control it. We process personal data in line with the Law of the Republic of Kazakhstan “On Personal Data and Their Protection”.",
  sections: [
    {
      title: "1. Data we process",
      body: [
        "Account data: email, name, company (if provided), account type, and language settings.",
        "Your materials: uploaded documents, questions and texts you enter, and the analysis results saved to your history.",
        "Billing data: subscription status and customer identifiers at our payment provider. We never receive or store card details.",
        "Technical data: anonymised usage statistics needed to run and improve the service."
      ]
    },
    {
      title: "2. Why we use it",
      body: [
        "To provide the service: analyse documents, answer questions, keep your history, and apply plan limits.",
        "To process payments, respond to requests, and notify you about material changes to the service.",
        "We do not sell personal data and do not use your documents to train models."
      ]
    },
    {
      title: "3. Who else is involved",
      body: [
        "We rely on vetted providers for the cloud database and file storage, web hosting, AI processing of your requests, and payments. Each receives only the data needed for its function.",
        "Data may be processed on servers outside Kazakhstan. By using the service you consent to this cross-border transfer."
      ]
    },
    {
      title: "4. Storage and security",
      body: [
        "Files are kept in private storage; access to documents and reports is restricted to your account at the database level. Data travels over HTTPS and is encrypted at rest by our cloud provider.",
        "We keep your materials while your account exists or until you delete them."
      ]
    },
    {
      title: "5. Your rights",
      body: [
        "You can delete any report together with its file from history, edit your profile in settings, or request a copy and deletion of all account data at any time.",
        `For personal data requests, email ${CONTACT_EMAIL}. We reply within 10 business days.`
      ]
    },
    {
      title: "6. Changes",
      body: ["We may update this policy and will notify you of material changes by email or in the app."]
    }
  ]
};

export default function PrivacyPage() {
  return <LegalDocument ru={ru} en={en} />;
}
