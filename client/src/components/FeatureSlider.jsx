"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Dumbbell, Flame, LayoutDashboard, Ruler, ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    icon: Dumbbell,
    title: "Egzersiz Kütüphanesi",
    description: "30'dan fazla egzersiz, gerçek gösterim görselleriyle. Kas grubuna göre filtrele.",
    href: "/exercises",
    cta: "Egzersizleri Gör",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    icon: Flame,
    title: "Antrenman Takibi",
    description: "Setlerini, ağırlığını ve tekrarlarını kaydet; dinlenme kronometresi otomatik başlasın.",
    href: "/workout",
    cta: "Antrenman Başlat",
    gradient: "from-teal-500 to-cyan-600",
  },
  {
    icon: LayoutDashboard,
    title: "İlerleme Analizi",
    description: "Haftalık kaldırdığın toplam ağırlığı ve kas grubu dağılımını grafiklerle gör.",
    href: "/dashboard",
    cta: "Dashboard'a Git",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    icon: Ruler,
    title: "Vücut Ölçülerin",
    description: "Kilonu ve vücut ölçülerini zaman içinde grafiklerle takip et.",
    href: "/body-stats",
    cta: "Ölçülerimi Gör",
    gradient: "from-blue-500 to-emerald-600",
  },
];

export default function FeatureSlider({ className = "" }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(timer);
  }, [paused]);

  function goTo(i) {
    setIndex(((i % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }

  const slide = SLIDES[index];
  const Icon = slide.icon;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-slate-800 ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className={`bg-gradient-to-br ${slide.gradient} px-6 py-10 transition-colors duration-500 sm:px-12 sm:py-14`}>
        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15">
            <Icon className="h-8 w-8 text-white" strokeWidth={2} />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white">{slide.title}</h3>
            <p className="mt-1.5 text-white/85">{slide.description}</p>
          </div>
          <Link
            href={slide.href}
            className="shrink-0 rounded-lg bg-white px-5 py-2.5 font-semibold text-slate-900 transition-transform hover:scale-105"
          >
            {slide.cta}
          </Link>
        </div>
      </div>

      <button
        type="button"
        onClick={() => goTo(index - 1)}
        aria-label="Önceki"
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/20 p-1.5 text-white transition-colors hover:bg-black/40"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => goTo(index + 1)}
        aria-label="Sonraki"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/20 p-1.5 text-white transition-colors hover:bg-black/40"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
        {SLIDES.map((s, i) => (
          <button
            key={s.href}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Slayt ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-6 bg-white" : "w-1.5 bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
