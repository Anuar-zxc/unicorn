import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="container-shell py-32">
        <h1 className="text-h1">Privacy Policy</h1>
        <div className="mt-8 max-w-3xl space-y-5 text-[#4A4A48]">
          <p>
            Lexo stores uploaded documents securely and uses them only to
            provide contract analysis, report history, and account functionality.
          </p>
          <p>
            We do not sell personal data. AI analysis is informational only and
            does not create an attorney-client relationship.
          </p>
          <p>
            Production deployments should configure Supabase row-level security,
            private storage, Stripe billing, and retention controls before launch.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
