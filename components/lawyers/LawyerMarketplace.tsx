"use client";

import { useMemo, useState } from "react";
import { BadgeCheck, CalendarDays, CheckCircle2, Search, SlidersHorizontal, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export type Lawyer = {
  id: string;
  name: string;
  email?: string | null;
  bio: string;
  specialties: string[];
  jurisdictions: string[];
  price_per_session: number;
  rating: number;
  review_count: number;
  avatar_color: string;
  verified: boolean;
};

const specialties = ["All", "Employment", "Business Contracts", "IP & Copyright", "Real Estate", "GDPR", "Disputes"];
const jurisdictions = ["All", "California", "New York", "EU", "UK", "Texas", "Federal"];
const prices = ["All", "Under $70", "$70-$90", "$90+"];
const ratings = ["All", "4.5+", "4.8+", "5.0 only"];
const slots = ["Mon 9:00", "Mon 14:00", "Tue 10:30", "Wed 15:00", "Thu 11:00", "Fri 16:00"];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function money(cents: number) {
  return `$${Math.round(cents / 100)}`;
}

export function LawyerMarketplace({ lawyers }: { lawyers: Lawyer[] }) {
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("All");
  const [jurisdiction, setJurisdiction] = useState("All");
  const [price, setPrice] = useState("All");
  const [rating, setRating] = useState("All");
  const [profile, setProfile] = useState<Lawyer | null>(null);
  const [booking, setBooking] = useState<Lawyer | null>(null);

  const filtered = useMemo(() => {
    return lawyers.filter((lawyer) => {
      const haystack = `${lawyer.name} ${lawyer.bio} ${lawyer.specialties.join(" ")} ${lawyer.jurisdictions.join(" ")}`.toLowerCase();
      const matchesQuery = !query || haystack.includes(query.toLowerCase());
      const matchesSpecialty = specialty === "All" || lawyer.specialties.some((item) => item.toLowerCase().includes(specialty.toLowerCase().replace("contracts", "contract")));
      const matchesJurisdiction = jurisdiction === "All" || lawyer.jurisdictions.includes(jurisdiction);
      const dollars = lawyer.price_per_session / 100;
      const matchesPrice =
        price === "All" ||
        (price === "Under $70" && dollars < 70) ||
        (price === "$70-$90" && dollars >= 70 && dollars <= 90) ||
        (price === "$90+" && dollars > 90);
      const matchesRating =
        rating === "All" ||
        (rating === "4.5+" && lawyer.rating >= 4.5) ||
        (rating === "4.8+" && lawyer.rating >= 4.8) ||
        (rating === "5.0 only" && lawyer.rating >= 5);

      return matchesQuery && matchesSpecialty && matchesJurisdiction && matchesPrice && matchesRating;
    });
  }, [jurisdiction, lawyers, price, query, rating, specialty]);

  return (
    <>
      <div className="sticky top-16 z-20 mb-6 rounded-2xl border border-[#252528] bg-[#0C0C0E]/95 p-4 backdrop-blur-xl">
        <div className="grid gap-3 xl:grid-cols-[1.2fr_repeat(4,180px)]">
          <label className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name or specialty..."
              className="h-11 w-full rounded-xl border border-[#252528] bg-[#141418] pl-10 pr-3 text-sm outline-none focus:border-[#4D7EF5]"
            />
          </label>
          <Filter value={specialty} onChange={setSpecialty} options={specialties} />
          <Filter value={jurisdiction} onChange={setJurisdiction} options={jurisdictions} />
          <Filter value={price} onChange={setPrice} options={prices} />
          <Filter value={rating} onChange={setRating} options={ratings} />
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2 text-sm text-white/42">
        <SlidersHorizontal className="h-4 w-4" />
        {filtered.length} verified lawyers available
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((lawyer) => (
          <LawyerCard key={lawyer.id} lawyer={lawyer} onProfile={setProfile} onBook={setBooking} />
        ))}
      </div>

      {profile && <ProfileModal lawyer={profile} onClose={() => setProfile(null)} onBook={(lawyer) => { setProfile(null); setBooking(lawyer); }} />}
      {booking && <BookingModal lawyer={booking} onClose={() => setBooking(null)} />}
    </>
  );
}

function Filter({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-11 rounded-xl border border-[#252528] bg-[#141418] px-3 text-sm text-white outline-none focus:border-[#4D7EF5]"
    >
      {options.map((option) => <option key={option}>{option}</option>)}
    </select>
  );
}

function LawyerCard({ lawyer, onProfile, onBook }: { lawyer: Lawyer; onProfile: (lawyer: Lawyer) => void; onBook: (lawyer: Lawyer) => void }) {
  return (
    <article className="card rounded-2xl border border-[#252528] bg-[#141418] p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-bold text-white" style={{ background: lawyer.avatar_color }}>
            {initials(lawyer.name)}
          </div>
          <div>
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
              {lawyer.name}
              {lawyer.verified && <BadgeCheck className="h-4 w-4 text-emerald-300" />}
            </h2>
            <p className="mt-1 text-sm text-white/50">{lawyer.jurisdictions.join(" · ")}</p>
          </div>
        </div>
        <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-bold text-emerald-200">Verified</span>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {lawyer.specialties.slice(0, 3).map((item) => (
          <span key={item} className="rounded-full border border-[#252528] bg-[#0C0C0E] px-2.5 py-1 text-xs text-white/62">{item}</span>
        ))}
      </div>

      <p className="mt-5 min-h-16 text-sm leading-6 text-white/62">{lawyer.bio.slice(0, 150)}...</p>

      <div className="mt-5 flex items-center justify-between">
        <p className="flex items-center gap-1 text-sm text-amber-200">
          <Star className="h-4 w-4 fill-amber-200" />
          {lawyer.rating.toFixed(1)} <span className="text-white/35">({lawyer.review_count} reviews)</span>
        </p>
        <p className="font-semibold">{money(lawyer.price_per_session)} <span className="text-sm font-normal text-white/42">/30-min</span></p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={() => onProfile(lawyer)}>View profile</Button>
        <Button onClick={() => onBook(lawyer)}>Book now</Button>
      </div>
    </article>
  );
}

function ProfileModal({ lawyer, onClose, onBook }: { lawyer: Lawyer; onClose: () => void; onBook: (lawyer: Lawyer) => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm">
      <aside className="ml-auto flex h-full w-full max-w-xl flex-col border-l border-[#252528] bg-[#0C0C0E] p-6 shadow-2xl">
        <button aria-label="Close profile" className="ml-auto rounded-full p-2 text-white/50 hover:bg-white/5 hover:text-white" onClick={onClose}>
          <X className="h-5 w-5" />
        </button>
        <div className="mt-4 flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white" style={{ background: lawyer.avatar_color }}>{initials(lawyer.name)}</div>
          <div>
            <h2 className="font-display text-3xl font-semibold">{lawyer.name}</h2>
            <p className="mt-2 flex items-center gap-2 text-sm text-emerald-200"><BadgeCheck className="h-4 w-4" />Verified attorney · Usually responds within 2 hours</p>
          </div>
        </div>
        <p className="mt-6 text-sm leading-7 text-white/68">{lawyer.bio}</p>
        <div className="mt-6 grid gap-4 rounded-2xl border border-[#252528] bg-[#141418] p-4">
          <Info label="Specialties" value={lawyer.specialties.join(" · ")} />
          <Info label="Jurisdictions" value={lawyer.jurisdictions.join(" · ")} />
          <Info label="Consultation" value={`${money(lawyer.price_per_session)} / 30-min session`} />
          <Info label="Included" value="Video call · Review of your documents · Written summary after" />
        </div>
        <div className="mt-auto pt-6">
          <Button className="w-full" onClick={() => onBook(lawyer)}>Book a 30-min session</Button>
        </div>
      </aside>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-white/35">{label}</p>
      <p className="mt-1 text-sm text-white/72">{value}</p>
    </div>
  );
}

function BookingModal({ lawyer, onClose }: { lawyer: Lawyer; onClose: () => void }) {
  const [duration, setDuration] = useState(30);
  const [slot, setSlot] = useState(slots[0]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  async function checkout() {
    setLoading(true);
    const response = await fetch("/api/bookings/create-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lawyer, duration, slot, notes })
    });
    const data = await response.json();
    window.location.href = data.url ?? "/dashboard/lawyers/booking-confirmed";
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
      <section className="w-full max-w-2xl rounded-2xl border border-[#252528] bg-[#0C0C0E] p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-white/45">Book consultation</p>
            <h2 className="font-display text-2xl font-semibold">{lawyer.name}</h2>
          </div>
          <button aria-label="Close booking" className="rounded-full p-2 text-white/50 hover:bg-white/5 hover:text-white" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold">Session length</p>
            <div className="mt-3 grid gap-2">
              {[30, 60].map((minutes) => (
                <button key={minutes} className={`rounded-xl border p-4 text-left ${duration === minutes ? "border-[#4D7EF5] bg-[#4D7EF5]/15" : "border-[#252528] bg-[#141418]"}`} onClick={() => setDuration(minutes)}>
                  <span className="font-semibold">{minutes} min</span>
                  <span className="float-right">{money(lawyer.price_per_session * (minutes / 30))}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold">Available time</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {slots.map((item) => (
                <button key={item} className={`rounded-xl border px-3 py-3 text-sm ${slot === item ? "border-[#4D7EF5] bg-[#4D7EF5]/15" : "border-[#252528] bg-[#141418]"}`} onClick={() => setSlot(item)}>
                  <CalendarDays className="mx-auto mb-1 h-4 w-4" />
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <label className="mt-5 block">
          <span className="text-sm font-semibold">Context for the lawyer</span>
          <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Briefly describe your situation or mention the Lexo brief you want to attach." className="mt-2 min-h-24 w-full rounded-xl border border-[#252528] bg-[#141418] p-3 text-sm outline-none focus:border-[#4D7EF5]" />
        </label>

        <div className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-100">
          <p className="flex items-center gap-2 font-semibold"><CheckCircle2 className="h-4 w-4" />Included</p>
          <p className="mt-1 text-emerald-100/75">Video call, document review, and written summary after the session.</p>
        </div>

        <Button className="mt-5 w-full" onClick={checkout} disabled={loading}>{loading ? "Opening checkout..." : "Continue to payment"}</Button>
      </section>
    </div>
  );
}
