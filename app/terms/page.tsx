import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Terms of Service — Lexo",
  description: "Lexo terms of service and usage policies."
};

export default function TermsPage() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      body: "By accessing or using Lexo, you agree to be bound by these Terms of Service. If you do not agree, do not use the service."
    },
    {
      title: "2. Service Description",
      body: "Lexo provides an AI-powered professional workspace for contract review, legal research, drafting, case preparation, redline comparison, and client communication."
    },
    {
      title: "3. Professional Review",
      body: "Lexo produces AI-assisted work product for legal professionals. Attorneys remain responsible for reviewing, validating, and approving all output before relying on it or delivering it to a client."
    },
    {
      title: "4. Eligibility",
      body: "You must be at least 18 years old and have the authority to enter into this agreement to use the service."
    },
    {
      title: "5. Account Responsibilities",
      body: "You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. Notify us immediately of any unauthorised use."
    },
    {
      title: "6. Acceptable Use",
      body: "You agree not to upload contracts containing information that violates third-party rights, use the service to reverse-engineer our AI system, or attempt to circumvent usage limits or billing controls."
    },
    {
      title: "7. Subscriptions and Billing",
      body: "Solo, Firm, and Enterprise subscriptions are billed according to the selected monthly or annual plan and renew automatically. You may cancel at any time; cancellations take effect at the end of the current billing period."
    },
    {
      title: "8. Data and Privacy",
      body: "Documents you upload are stored securely in private storage and used solely to provide the analysis service. We do not sell your data. See our Privacy Policy for full details."
    },
    {
      title: "9. Disclaimer of Warranties",
      body: "The service is provided \"as is\" without warranties of any kind. We do not guarantee that AI analysis is accurate, complete, or suitable for any particular purpose."
    },
    {
      title: "10. Limitation of Liability",
      body: "To the maximum extent permitted by law, Lexo shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service."
    },
    {
      title: "11. Changes to Terms",
      body: "We may update these terms at any time. Continued use of the service after changes constitutes acceptance. We will notify registered users of material changes via email."
    },
    {
      title: "12. Contact",
      body: "Questions about these terms? Email us at legal@lexo.ai."
    }
  ];

  return (
    <>
      <Navbar />
      <main className="container-shell py-32">
        <h1 className="text-h1">Terms of Service</h1>
        <p className="mt-4 text-[#4A4A48]">Last updated: June 2026</p>
        <div className="mt-10 max-w-3xl space-y-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="font-display text-xl font-semibold text-[#0A0A0A]">
                {section.title}
              </h2>
              <p className="mt-3 leading-7 text-[#4A4A48]">{section.body}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
