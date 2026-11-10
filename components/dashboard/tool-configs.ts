export type ToolKey = "ask" | "research" | "caseprep" | "compare" | "client";

type ToolCopy = {
  title: string;
  eyebrow: string;
  description: string;
  inputLabel: string;
  inputPlaceholder: string;
  contextLabel?: string;
  contextPlaceholder?: string;
  secondaryLabel?: string;
  secondaryPlaceholder?: string;
  outputLabel: string;
  run: string;
  samples?: string[];
};

export type ToolConfig = {
  endpoint: string;
  icon: "research" | "caseprep" | "compare" | "client" | "ask";
  upload?: "single" | "double";
  /** Audience shapes the disclaimer wording under the result. */
  audience: "personal" | "professional";
  ru: ToolCopy;
  en: ToolCopy;
};

export const TOOL_CONFIGS: Record<ToolKey, ToolConfig> = {
  ask: {
    endpoint: "/api/ask",
    icon: "ask",
    upload: "single",
    audience: "personal",
    ru: {
      title: "Задать юридический вопрос",
      eyebrow: "Правовая информация простым языком",
      description: "Опишите, что произошло и что хотите понять. Lexo объяснит, какие нормы применимы, где есть неопределённость и что делать дальше — со ссылками на законы РК.",
      inputLabel: "Что произошло?",
      inputPlaceholder: "Опишите важные факты, даты, документы и результат, которого хотите добиться…",
      contextLabel: "Страна или город",
      contextPlaceholder: "Например: Казахстан, Алматы",
      outputLabel: "Понятное объяснение",
      run: "Получить ответ",
      samples: [
        "Арендодатель не возвращает депозит за квартиру",
        "Может ли работодатель уменьшить зарплату без моего согласия?",
        "Что проверить перед подписанием договора с заказчиком?"
      ]
    },
    en: {
      title: "Ask a Legal Question",
      eyebrow: "Plain-language legal information",
      description: "Describe what happened and what you want to understand. Lexo explains the likely rules, uncertainties, and practical next steps with references to Kazakhstan law.",
      inputLabel: "What happened?",
      inputPlaceholder: "Include the important facts, dates, documents, and what outcome you want…",
      contextLabel: "Country or city",
      contextPlaceholder: "Example: Kazakhstan, Almaty",
      outputLabel: "Clear legal explanation",
      run: "Get an answer",
      samples: [
        "My landlord won't return my apartment deposit",
        "Can my employer cut my salary without my consent?",
        "What should I check before signing a client contract?"
      ]
    }
  },
  research: {
    endpoint: "/api/research",
    icon: "research",
    audience: "professional",
    ru: {
      title: "Правовой поиск",
      eyebrow: "Исследовательский меморандум",
      description: "Сформируйте меморандум: применимые нормы с точными ссылками, анализ, противоречивые позиции и вывод со степенью уверенности. По праву РК Lexo опирается на тексты из «Әділет».",
      inputLabel: "Правовой вопрос и существенные факты",
      inputPlaceholder: "Опишите вопрос, стадию спора и факты, которые могут повлиять на анализ…",
      contextLabel: "Юрисдикция",
      contextPlaceholder: "Например: Республика Казахстан",
      outputLabel: "Исследовательский меморандум",
      run: "Подготовить меморандум",
      samples: [
        "Срок исковой давности по требованию о взыскании долга по договору займа",
        "Основания расторжения трудового договора по инициативе работодателя",
        "Ответственность поставщика за просрочку поставки товара"
      ]
    },
    en: {
      title: "Case Research",
      eyebrow: "Legal research memo",
      description: "Build a focused research memo with applicable law and exact citations, analysis, conflicting authority, and a confidence-rated conclusion. For Kazakhstan law Lexo relies on official Adilet texts.",
      inputLabel: "Legal question and material facts",
      inputPlaceholder: "Describe the question, procedural posture, and facts that may affect the analysis…",
      contextLabel: "Jurisdiction",
      contextPlaceholder: "Example: Republic of Kazakhstan",
      outputLabel: "Research memo",
      run: "Prepare memo",
      samples: [
        "Limitation period for recovering a debt under a loan agreement",
        "Grounds for an employer to terminate an employment contract",
        "Supplier liability for late delivery of goods"
      ]
    }
  },
  caseprep: {
    endpoint: "/api/caseprep",
    icon: "caseprep",
    upload: "single",
    audience: "professional",
    ru: {
      title: "Подготовка дела",
      eyebrow: "Приём дела и стратегия",
      description: "Превратите рассказ клиента и доказательства в хронологию, карту правовых вопросов, варианты стратегии, план интервью и чек-лист документов.",
      inputLabel: "Ситуация клиента и желаемый результат",
      inputPlaceholder: "Изложите существенные факты, стороны, текущую стадию, известные сроки и цель клиента…",
      contextLabel: "Отрасль права и юрисдикция",
      contextPlaceholder: "Например: трудовой спор · Казахстан",
      outputLabel: "Меморандум по делу",
      run: "Подготовить меморандум"
    },
    en: {
      title: "Case Prep",
      eyebrow: "Matter intake and strategy",
      description: "Turn a client narrative and available evidence into a timeline, issue map, strategy options, interview agenda, and document checklist.",
      inputLabel: "Client situation and desired outcome",
      inputPlaceholder: "Summarize the material facts, parties, current stage, known deadlines, and the client's objective…",
      contextLabel: "Practice area and jurisdiction",
      contextPlaceholder: "Example: Employment dispute · Kazakhstan",
      outputLabel: "Case intake memo",
      run: "Prepare memo"
    }
  },
  compare: {
    endpoint: "/api/compare",
    icon: "compare",
    upload: "double",
    audience: "professional",
    ru: {
      title: "Сравнение версий",
      eyebrow: "Анализ правок",
      description: "Найдите каждое существенное изменение, оцените его влияние для вашего клиента и подготовьте позицию для переговоров.",
      inputLabel: "Версия 1 или инструкции для сравнения",
      inputPlaceholder: "Вставьте исходную редакцию или опишите представляемую сторону и приоритеты переговоров…",
      secondaryLabel: "Версия 2",
      secondaryPlaceholder: "Вставьте новую редакцию, если не загружаете файлы…",
      contextLabel: "Представляемая сторона",
      contextPlaceholder: "Например: поставщик / арендатор / исполнитель",
      outputLabel: "Меморандум по правкам",
      run: "Сравнить версии"
    },
    en: {
      title: "Redline Compare",
      eyebrow: "Version intelligence",
      description: "Identify every material change, classify its effect for your client, and prepare recommended negotiation responses.",
      inputLabel: "Version 1 or comparison instructions",
      inputPlaceholder: "Paste the original version or explain the represented party and negotiation priorities…",
      secondaryLabel: "Version 2",
      secondaryPlaceholder: "Paste the revised version here if you are not uploading files…",
      contextLabel: "Represented party",
      contextPlaceholder: "Example: Supplier / Tenant / Contractor",
      outputLabel: "Redline negotiation memo",
      run: "Compare versions"
    }
  },
  client: {
    endpoint: "/api/client-brief",
    icon: "client",
    upload: "single",
    audience: "professional",
    ru: {
      title: "Резюме для клиента",
      eyebrow: "Общение с клиентом",
      description: "Переведите правовой анализ на понятный клиенту язык: ключевые решения, вопросы и следующие шаги — без потери смысла.",
      inputLabel: "Правовой анализ или исходный документ",
      inputPlaceholder: "Вставьте меморандум, раздел договора или анализ дела, который нужно объяснить клиенту…",
      contextLabel: "Уровень и контекст клиента",
      contextPlaceholder: "Например: простым языком · начинающий предприниматель",
      outputLabel: "Резюме для клиента",
      run: "Подготовить резюме"
    },
    en: {
      title: "Client Summary",
      eyebrow: "Client communication",
      description: "Convert legal analysis into accurate client-ready language, key decisions, questions, and practical next steps.",
      inputLabel: "Legal analysis or source material",
      inputPlaceholder: "Paste the memo, agreement section, or case analysis to translate for the client…",
      contextLabel: "Reading level and client context",
      contextPlaceholder: "Example: Simplified · first-time founder",
      outputLabel: "Client-ready brief",
      run: "Prepare brief"
    }
  }
};
