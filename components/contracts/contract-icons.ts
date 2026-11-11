import {
  Briefcase,
  Cloud,
  FileText,
  Handshake,
  Home,
  KeyRound,
  Landmark,
  Lock,
  Mail,
  Package,
  UserRoundCheck,
  type LucideIcon
} from "lucide-react";

/** SVG icon per contract type (replaces emoji, which render inconsistently across OSes). */
export const CONTRACT_ICONS: Record<string, LucideIcon> = {
  nda: Lock,
  freelance_agreement: Briefcase,
  rental_agreement: KeyRound,
  employment_contract: UserRoundCheck,
  partnership_agreement: Handshake,
  saas_terms: Cloud,
  loan_agreement: Landmark,
  roommate_agreement: Home,
  sale_of_goods: Package,
  demand_letter: Mail
};

export function contractIcon(id: string): LucideIcon {
  return CONTRACT_ICONS[id] ?? FileText;
}
