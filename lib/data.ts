import {
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  FileLock2,
  FileSignature,
  Files,
  Gavel,
  Globe2,
  Handshake,
  MessageSquareText,
  Scale,
  ShieldCheck,
  UserRoundCheck
} from "lucide-react";

export const features = [
  {
    title: "AI Contract Generator",
    description: "NDA, SLA, employment, partnership, freelance and policy documents drafted in minutes.",
    icon: FileSignature
  },
  {
    title: "Legal Chat Assistant",
    description: "Ask business law questions and get clear, practical guidance with visible disclaimers.",
    icon: MessageSquareText
  },
  {
    title: "Jurisdiction Awareness",
    description: "US federal and state law, EU GDPR, UK law, and local governing-law clauses.",
    icon: Globe2
  },
  {
    title: "Lawyer Marketplace",
    description: "Book 30-minute reviews with 200+ verified lawyers at predictable flat fees.",
    icon: UserRoundCheck
  },
  {
    title: "Document Vault",
    description: "Store contracts, organize status, and share secure links with your team.",
    icon: Files
  },
  {
    title: "Dispute Preparation",
    description: "Turn facts, documents, and timelines into concise summaries for counsel.",
    icon: ShieldCheck
  }
];

export const lawyers = [
  {
    name: "Maya Chen",
    initials: "MC",
    specialty: "US Business Law",
    tags: ["Employment Law", "SaaS", "Delaware"],
    rating: "4.9",
    reviews: 42,
    price: 79,
    bio: "Former startup counsel helping SMBs review contracts, hiring docs, and vendor disputes.",
    tone: "blue" as const
  },
  {
    name: "Elena Kovacs",
    initials: "EK",
    specialty: "EU Contract Law",
    tags: ["GDPR", "Cross-border", "B2B"],
    rating: "4.8",
    reviews: 37,
    price: 89,
    bio: "EU commercial lawyer focused on GDPR-ready service agreements and data processing terms.",
    tone: "green" as const
  },
  {
    name: "Jonas Reed",
    initials: "JR",
    specialty: "IP & Copyright",
    tags: ["Copyright", "Trademarks", "Licensing"],
    rating: "5.0",
    reviews: 29,
    price: 99,
    bio: "IP specialist for agencies, software teams, creators, and productized service firms.",
    tone: "violet" as const
  }
];

export const pricing = [
  {
    name: "Starter",
    monthly: 29,
    description: "For founders who need core documents handled safely.",
    features: ["5 contracts / month", "50 AI chat queries", "US jurisdiction", "1 team member", "Pay per lawyer session"]
  },
  {
    name: "Pro",
    monthly: 79,
    popular: true,
    description: "For growing teams with regular legal workflows.",
    features: ["Unlimited contracts", "Unlimited AI chat", "US + EU jurisdictions", "5 team members", "2 lawyer sessions / month"]
  },
  {
    name: "Enterprise",
    monthly: 199,
    description: "For multi-entity teams that need deeper coverage.",
    features: ["Unlimited contracts", "Unlimited AI chat", "Custom jurisdictions", "Unlimited team members", "Dedicated lawyer"]
  }
];

export const testimonials = [
  {
    quote: "Lexo turned our vendor contract backlog from a two-week headache into an afternoon workflow.",
    name: "Nora Patel",
    company: "Northstar Ops",
    initials: "NP"
  },
  {
    quote: "The lawyer review handoff is the killer feature. We get AI speed and human confidence when it matters.",
    name: "Felix Brandt",
    company: "Kepler Studio",
    initials: "FB"
  },
  {
    quote: "Our team finally has a place to ask basic legal questions without burning counsel budget every week.",
    name: "Amara Lewis",
    company: "BrightLedger",
    initials: "AL"
  }
];

export const faq = [
  {
    q: "Is this real legal advice?",
    a: "No. Lexo provides informational guidance and AI-generated drafts. You can route any document or question to a licensed lawyer for review."
  },
  {
    q: "What jurisdictions do you cover?",
    a: "Starter supports US workflows. Pro adds EU and UK coverage. Enterprise can configure custom jurisdictions and templates."
  },
  {
    q: "How do lawyers get verified?",
    a: "We verify identity, bar admission or registration, practice focus, and client ratings before a lawyer can accept bookings."
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Subscriptions can be cancelled anytime from billing settings, and your vault remains exportable."
  },
  {
    q: "Is my data secure?",
    a: "Documents are encrypted in transit and at rest, access is role-based, and enterprise plans include custom retention settings."
  },
  {
    q: "What happens after my trial?",
    a: "Your workspace remains available, and you can choose Starter, Pro, or Enterprise before paid usage begins."
  }
];

export const contractTypes = [
  { name: "NDA", detail: "Non-Disclosure Agreement", icon: FileLock2, popular: true },
  { name: "Service Agreement", detail: "Client and vendor terms", icon: Handshake, popular: true },
  { name: "Employment Contract", detail: "Hiring and role terms", icon: BriefcaseBusiness },
  { name: "Freelancer Agreement", detail: "Scope, IP, and payment", icon: FileSignature },
  { name: "Partnership Agreement", detail: "Founder and partner rules", icon: Building2 },
  { name: "Terms of Service", detail: "SaaS product terms", icon: Scale },
  { name: "Privacy Policy", detail: "GDPR and privacy basics", icon: ShieldCheck },
  { name: "Lease Agreement", detail: "Office lease terms", icon: Gavel }
];

export const recentDocuments = [
  { name: "Vendor NDA - Acme Cloud", type: "NDA", status: "Draft", date: "Jun 12, 2026" },
  { name: "SaaS Service Agreement", type: "Service", status: "Active", date: "Jun 9, 2026" },
  { name: "Contractor IP Assignment", type: "Freelancer", status: "Active", date: "May 28, 2026" },
  { name: "Old Office Lease", type: "Lease", status: "Expired", date: "Apr 16, 2026" }
];

export const dashboardStats = [
  { label: "Contracts Created", value: "18", detail: "4 of 5 used this month" },
  { label: "AI Queries Used", value: "34", detail: "50 included on Starter" },
  { label: "Lawyer Sessions", value: "2", detail: "1 upcoming review" },
  { label: "Documents Saved", value: "47", detail: "Encrypted vault" }
];

export const chatPrompts = [
  "What do I need in an NDA to make it enforceable in New York?",
  "Can I terminate an employee for performance in the EU?",
  "What's the difference between an LLC and a Corporation?",
  "My contractor missed a deadline. What are my options?"
];

export const integrations = [
  BadgeCheck,
  ShieldCheck,
  Globe2
];
