export type ContractTypeDefinition = {
  id: string;
  name: string;
  name_ru: string;
  description: string;
  description_ru: string;
  available_for: Array<"lawyer" | "individual">;
  complexity: "simple" | "medium" | "complex";
  icon: string;
  category: "business" | "employment" | "personal" | "real_estate";
  sort_order: number;
};

export const CONTRACT_TYPES: ContractTypeDefinition[] = [
  { id: "nda", name: "NDA / Non-Disclosure Agreement", name_ru: "Соглашение о неразглашении", description: "Protect confidential information shared between parties.", description_ru: "Защитите конфиденциальную информацию сторон.", available_for: ["lawyer", "individual"], complexity: "simple", icon: "🤐", category: "business", sort_order: 1 },
  { id: "freelance_agreement", name: "Freelance / Service Agreement", name_ru: "Договор оказания услуг", description: "Define scope, payment, deadlines, and ownership.", description_ru: "Зафиксируйте объём работ, оплату, сроки и права.", available_for: ["lawyer", "individual"], complexity: "simple", icon: "💼", category: "business", sort_order: 2 },
  { id: "rental_agreement", name: "Rental / Lease Agreement", name_ru: "Договор аренды", description: "Set terms between a landlord and tenant.", description_ru: "Определите условия между арендодателем и арендатором.", available_for: ["lawyer", "individual"], complexity: "medium", icon: "🏠", category: "real_estate", sort_order: 3 },
  { id: "employment_contract", name: "Employment Contract", name_ru: "Трудовой договор", description: "Draft a formal employer-employee agreement.", description_ru: "Подготовьте трудовой договор работодателя и работника.", available_for: ["lawyer"], complexity: "complex", icon: "👔", category: "employment", sort_order: 4 },
  { id: "partnership_agreement", name: "Partnership / Co-Founder Agreement", name_ru: "Партнёрское соглашение", description: "Define roles, equity, decisions, and exits.", description_ru: "Определите роли, доли, решения и выход партнёров.", available_for: ["lawyer"], complexity: "complex", icon: "🤝", category: "business", sort_order: 5 },
  { id: "saas_terms", name: "SaaS Terms of Service", name_ru: "Условия использования SaaS", description: "Create terms governing a software service.", description_ru: "Создайте условия использования программного сервиса.", available_for: ["lawyer"], complexity: "complex", icon: "☁️", category: "business", sort_order: 6 },
  { id: "loan_agreement", name: "Simple Loan Agreement", name_ru: "Договор займа", description: "Document a loan between people or businesses.", description_ru: "Оформите передачу денег в долг.", available_for: ["lawyer", "individual"], complexity: "simple", icon: "💵", category: "personal", sort_order: 7 },
  { id: "roommate_agreement", name: "Roommate Agreement", name_ru: "Соглашение о совместном проживании", description: "Agree on rent, bills, responsibilities, and house rules.", description_ru: "Зафиксируйте аренду, счета, обязанности и бытовые правила.", available_for: ["individual"], complexity: "simple", icon: "🏡", category: "personal", sort_order: 8 },
  { id: "sale_of_goods", name: "Sale of Goods Agreement", name_ru: "Договор купли-продажи", description: "Document the sale of a car, equipment, or other property.", description_ru: "Оформите продажу автомобиля, оборудования или другого имущества.", available_for: ["lawyer", "individual"], complexity: "simple", icon: "📦", category: "personal", sort_order: 9 },
  { id: "demand_letter", name: "Demand Letter", name_ru: "Претензионное письмо", description: "Demand payment or action before escalation.", description_ru: "Потребуйте оплату или действие до дальнейшего спора.", available_for: ["lawyer", "individual"], complexity: "medium", icon: "📨", category: "business", sort_order: 10 }
];

export function getContractType(id: string) {
  return CONTRACT_TYPES.find((item) => item.id === id);
}
