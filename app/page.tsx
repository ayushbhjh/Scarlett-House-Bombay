"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

type MenuItem = {
  name: string;
  desc: string;
  image: string;
};

const menuItems: MenuItem[] = [
  {
    name: "Dal Khichdi",
    desc: "Velvety lentils, clarified butter drizzle, toasted spices.",
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Korean Mushroom Wings",
    desc: "Crisp oyster mushrooms, gochujang glaze, sesame crunch.",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Thai Chilli Salad",
    desc: "Citrus-herb greens with chilli-lime dressing and crunch.",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Pappardelle Pasta",
    desc: "Slow-cooked sauce, ribbons of pasta, aged parmesan.",
    image:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Malabar Prawn Curry",
    desc: "Coastal coconut curry, tiger prawns, fragrant curry leaves.",
    image:
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Gluten Free Chocolate Cake",
    desc: "Dark chocolate ganache, sea salt caramel, berries.",
    image:
      "https://images.unsplash.com/photo-1602351447937-745cb720612f?auto=format&fit=crop&w=1200&q=80"
  }
];

const instaShots = [
  "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1551024709-8f23befc6cf7?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1559305616-3f99cd43e353?auto=format&fit=crop&w=900&q=80"
];

const reviews = [
  "Perfect ambience for a romantic dinner.",
  "Loved the gnocchi pasta and Korean mushroom wings.",
  "Wine selection is excellent."
];

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 }
};

export default function Home() {
  const [exitOpen, setExitOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitInfo, setSubmitInfo] = useState<string | null>(null);
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 900], [0, -90]);

  useEffect(() => {
    const onMouseOut = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setExitOpen(true);
      }
    };

    window.addEventListener("mouseout", onMouseOut);
    return () => window.removeEventListener("mouseout", onMouseOut);
  }, []);

  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "Restaurant",
      name: "Scarlett House Bombay",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Red Bungalow, 3 Pali Rd Bandra West",
        addressLocality: "Mumbai",
        addressCountry: "IN"
      },
      telephone: "+91 7400099990",
      servesCuisine: ["European", "Contemporary Indian"],
      url: "https://scarletthousebombay.com",
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.3",
        reviewCount: "600"
      }
    }),
    []
  );

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitInfo(null);
    setSubmitted(false);
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      guests: Number(formData.get("guests")),
      date: String(formData.get("date") ?? ""),
      time: String(formData.get("time") ?? "")
    };

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = (await response.json().catch(() => null)) as
        | { error?: string; sheetSaved?: boolean }
        | null;

      if (!response.ok) {
        throw new Error(data?.error ?? "Failed to save reservation");
      }

      setSubmitted(true);
      if (data?.sheetSaved === false) {
        setSubmitInfo("Saved in backend. Google Sheet is not connected yet.");
      }
      form.reset();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not save your reservation right now.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative overflow-x-clip">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href="#reservation"
        className="fixed bottom-5 right-5 z-50 rounded-full bg-scarlett-gold px-5 py-3 text-sm font-semibold text-scarlett-black shadow-glow transition hover:scale-105"
      >
        Reserve Table
      </Link>

      <a
        href="https://wa.me/917400099990"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-20 right-5 z-50 rounded-full border border-emerald-300/50 bg-emerald-500/90 px-4 py-3 text-xs font-semibold text-black transition hover:scale-105"
      >
        WhatsApp Booking
      </a>

      <section className="relative min-h-screen">
        <Image
          src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=2000&q=80"
          alt="Scarlett House luxury dining ambience"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/55 to-scarlett-black" />

        <div className="section-shell relative flex min-h-screen flex-col justify-center">
          <motion.p
            variants={fadeIn}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.6 }}
            className="mb-5 w-fit rounded-full border border-scarlett-gold/60 bg-black/40 px-4 py-2 text-xs tracking-[0.3em] text-scarlett-gold"
          >
            SCARLETT HOUSE BOMBAY
          </motion.p>
          <motion.h1
            variants={fadeIn}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.1, duration: 0.7 }}
            className="max-w-3xl font-display text-4xl leading-tight md:text-6xl"
          >
            Mumbai&apos;s Most Artistic Dining Experience
          </motion.h1>
          <motion.p
            variants={fadeIn}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.2, duration: 0.7 }}
            className="mt-5 max-w-xl text-sm text-scarlett-cream/85 md:text-lg"
          >
            Comfort food • Wine & Cheese • Artisanal Cocktails
          </motion.p>
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Link
              href="#reservation"
              className="rounded-full bg-scarlett-gold px-7 py-3 text-sm font-semibold text-scarlett-black transition hover:scale-105"
            >
              Reserve a Table
            </Link>
            <Link
              href="#menu"
              className="rounded-full border border-scarlett-cream/55 bg-black/40 px-7 py-3 text-sm font-semibold transition hover:border-scarlett-gold hover:text-scarlett-gold"
            >
              View Menu
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="mt-10 w-fit rounded-2xl border border-white/20 bg-black/40 px-5 py-3 backdrop-blur"
          >
            <p className="text-sm">⭐ 4.3 Rating from 600+ Guests</p>
          </motion.div>
        </div>
      </section>

      <section id="about" className="section-shell grid gap-8 md:grid-cols-2 md:items-center">
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-3 text-xs tracking-[0.28em] text-scarlett-gold">ABOUT</p>
          <h2 className="font-display text-3xl md:text-5xl">A Boutique Dining Story in Bandra</h2>
          <p className="mt-5 text-scarlett-cream/85">
            Scarlett House is a boutique dining experience in Bandra blending European comfort food,
            handcrafted cocktails, and artistic ambience. Founded by Malaika Arora, the space was conceived
            as a lifestyle destination where warm lighting, a wine-bar aesthetic, and expressive interiors create
            unforgettable nights.
          </p>
        </motion.div>
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="glass-card gold-ring relative h-[380px] overflow-hidden rounded-3xl"
        >
          <Image
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80"
            alt="Scarlett House artistic interiors"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        </motion.div>
      </section>

      <section id="menu" className="section-shell">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-3 text-xs tracking-[0.28em] text-scarlett-gold">SIGNATURE MENU</p>
            <h2 className="font-display text-3xl md:text-5xl">Curated Highlights</h2>
          </div>
          <Link
            href="#"
            className="rounded-full border border-scarlett-gold/70 px-5 py-2 text-sm text-scarlett-gold transition hover:bg-scarlett-gold hover:text-scarlett-black"
          >
            View Full Menu
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((item, index) => (
            <motion.article
              key={item.name}
              variants={fadeIn}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.06, duration: 0.6 }}
              className="group glass-card overflow-hidden rounded-3xl"
            >
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-5">
                <h3 className="font-display text-2xl">{item.name}</h3>
                <p className="mt-2 text-sm text-scarlett-cream/80">{item.desc}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="section-shell">
        <motion.div style={{ y: yParallax }} className="grid gap-6 md:grid-cols-2">
          <div className="glass-card rounded-3xl p-7">
            <p className="mb-3 text-xs tracking-[0.28em] text-scarlett-gold">EXPERIENCE</p>
            <h2 className="font-display text-3xl md:text-5xl">Nights Designed to Linger</h2>
            <div className="mt-6 space-y-3 text-scarlett-cream/90">
              <p>🍷 Wine & Cheese Nights</p>
              <p>🍸 Artisanal Cocktail Bar</p>
              <p>🎶 Live Music Evenings</p>
              <p>✨ Elegant Dining Ambience</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {["photo-1466978913421-dad2ebd01d17", "photo-1559329007-40df8a9345d8"].map((id) => (
              <div key={id} className="glass-card relative min-h-52 overflow-hidden rounded-3xl">
                <Image
                  src={`https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`}
                  alt="Scarlett House experience"
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="section-shell">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-3 text-xs tracking-[0.28em] text-scarlett-gold">INSTAGRAM</p>
            <h2 className="font-display text-3xl md:text-5xl">@scarletthousebombay</h2>
          </div>
          <a
            href="https://instagram.com/scarletthousebombay"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-scarlett-gold/70 px-5 py-2 text-sm text-scarlett-gold transition hover:bg-scarlett-gold hover:text-scarlett-black"
          >
            Follow on Instagram
          </a>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {instaShots.map((shot, idx) => (
            <motion.div
              key={shot}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: idx * 0.05, duration: 0.45 }}
              className="group relative aspect-square overflow-hidden rounded-2xl"
            >
              <Image
                src={shot}
                alt="Scarlett House Instagram gallery"
                fill
                className="object-cover transition duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/30" />
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section-shell grid gap-5 md:grid-cols-3">
        {reviews.map((quote, idx) => (
          <motion.blockquote
            key={quote}
            variants={fadeIn}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: idx * 0.08, duration: 0.6 }}
            className="glass-card rounded-3xl p-6"
          >
            <p className="text-scarlett-gold">★★★★★</p>
            <p className="mt-3 text-lg">“{quote}”</p>
          </motion.blockquote>
        ))}
        <div className="glass-card flex items-center justify-center rounded-3xl p-8 text-center md:col-span-3">
          <p className="text-xl">Google Rating: 4.3 ⭐ with 600+ reviews</p>
        </div>
      </section>

      <section id="reservation" className="section-shell grid gap-8 md:grid-cols-2">
        <div>
          <p className="mb-3 text-xs tracking-[0.28em] text-scarlett-gold">RESERVATION</p>
          <h2 className="font-display text-3xl md:text-5xl">Book Your Table</h2>
          <p className="mt-4 text-scarlett-cream/85">
            Reserve instantly for a date night, celebration, or elevated evening out.
          </p>
          <div className="mt-7 space-y-3 text-sm">
            <p>📍 Bandra Reservation: +91 7400099990</p>
            <p>📍 Juhu Reservation: +91 7900099997</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="glass-card rounded-3xl p-6 md:p-8">
          <div className="grid gap-4">
            <input className="rounded-xl border border-white/15 bg-black/30 px-4 py-3" placeholder="Name" name="name" required />
            <input className="rounded-xl border border-white/15 bg-black/30 px-4 py-3" placeholder="Phone" name="phone" required />
            <input className="rounded-xl border border-white/15 bg-black/30 px-4 py-3" placeholder="Guests" name="guests" type="number" min={1} required />
            <input className="rounded-xl border border-white/15 bg-black/30 px-4 py-3" name="date" type="date" required />
            <input className="rounded-xl border border-white/15 bg-black/30 px-4 py-3" name="time" type="time" required />
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 rounded-xl bg-scarlett-gold px-5 py-3 font-semibold text-scarlett-black transition hover:opacity-90"
            >
              {isSubmitting ? "Saving..." : "Reserve Now"}
            </button>
            {submitted && <p className="text-sm text-emerald-300">Your reservation request has been recorded.</p>}
            {submitInfo && <p className="text-sm text-amber-200">{submitInfo}</p>}
            {submitError && <p className="text-sm text-red-300">{submitError}</p>}
          </div>
        </form>
      </section>

      <section className="section-shell">
        <p className="mb-3 text-xs tracking-[0.28em] text-scarlett-gold">LOCATION</p>
        <h2 className="font-display text-3xl md:text-5xl">Red Bungalow, 3 Pali Rd Bandra West, Mumbai</h2>
        <div className="glass-card mt-6 overflow-hidden rounded-3xl">
          <iframe
            title="Scarlett House Bombay Location"
            src="https://www.google.com/maps?q=Red+Bungalow,+3+Pali+Rd+Bandra+West,+Mumbai&output=embed"
            className="h-[380px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <a
          href="https://maps.google.com/?q=Red+Bungalow,+3+Pali+Rd+Bandra+West,+Mumbai"
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-block rounded-full border border-scarlett-gold/70 px-5 py-2 text-sm text-scarlett-gold transition hover:bg-scarlett-gold hover:text-scarlett-black"
        >
          Get Directions
        </a>
      </section>

      <footer className="border-t border-white/10 py-8 text-sm text-scarlett-cream/80">
        <div className="mx-auto flex w-[min(1150px,92%)] flex-wrap items-center justify-between gap-3">
          <p>Scarlett House Bombay • Open until 12 AM</p>
          <p>Reservations: +91 7400099990 • +91 7900099997</p>
          <div className="flex items-center gap-4">
            <Link href="/admin/reservations" className="text-scarlett-gold hover:underline">
              Admin
            </Link>
            <a href="https://instagram.com/scarletthousebombay" target="_blank" rel="noreferrer">
              Instagram
            </a>
          </div>
        </div>
      </footer>

      {exitOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card gold-ring max-w-md rounded-3xl p-7 text-center"
          >
            <p className="text-xs tracking-[0.25em] text-scarlett-gold">LIMITED OFFER</p>
            <h3 className="mt-3 font-display text-3xl">Get 10% Off Your First Visit</h3>
            <p className="mt-3 text-scarlett-cream/80">Reserve now and unlock a welcome offer at Scarlett House Bombay.</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link
                href="#reservation"
                onClick={() => setExitOpen(false)}
                className="rounded-full bg-scarlett-gold px-5 py-2 text-sm font-semibold text-scarlett-black"
              >
                Claim Offer
              </Link>
              <button
                type="button"
                onClick={() => setExitOpen(false)}
                className="rounded-full border border-white/30 px-5 py-2 text-sm"
              >
                Maybe Later
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
}
