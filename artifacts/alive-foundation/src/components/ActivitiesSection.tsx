import { motion } from "framer-motion";
import { Sparkles, Mic, Trophy } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const BASE = import.meta.env.BASE_URL;

const CHARLA_SRCS = [
  "activities/charla-1.jpg",
  "activities/charla-2.jpg",
  "activities/charla-3.jpg",
];

const FUTBOL_SRCS = [
  "activities/futbol-1.jpg",
  "activities/futbol-2.jpg",
  "activities/futbol-3.jpg",
  "activities/futbol-4.jpg",
];

export default function ActivitiesSection() {
  const { t } = useLanguage();

  const CHARLAS = CHARLA_SRCS.map((src, i) => ({ src, alt: t.activities.talks.photos[i] }));
  const FUTBOL = FUTBOL_SRCS.map((src, i) => ({ src, alt: t.activities.sports.photos[i] }));

  return (
    <section className="py-24 bg-gradient-to-b from-white via-brand-aqua/5 to-white relative overflow-hidden">
      <div className="absolute top-20 right-0 h-72 w-72 rounded-full bg-brand-yellow/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-32 left-0 h-80 w-80 rounded-full bg-brand-orange/10 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-aqua/10 text-brand-aqua mb-4">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-bold tracking-wide uppercase">{t.activities.badgeLabel}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-heading font-black text-brand-navy mb-4">
            {t.activities.title} <span className="text-brand-orange">{t.activities.titleHighlight}</span>
          </h2>
          <p className="text-brand-blue-text text-lg leading-relaxed">
            {t.activities.subtitle}
          </p>
        </motion.div>

        {/* Charlas y formación */}
        <div className="max-w-6xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="h-10 w-10 rounded-xl bg-brand-aqua/15 flex items-center justify-center">
              <Mic className="h-5 w-5 text-brand-aqua" />
            </div>
            <div>
              <h3 className="font-heading font-black text-xl md:text-2xl text-brand-navy leading-tight">{t.activities.talks.title}</h3>
              <p className="text-brand-blue-text text-sm">{t.activities.talks.subtitle}</p>
            </div>
          </motion.div>

          {/* 1 large + 2 stacked */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CHARLAS.map((photo, idx) => (
              <motion.div
                key={photo.src}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`group ${idx === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
              >
                <div className={`relative rounded-2xl overflow-hidden border-4 border-white shadow-md group-hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-1 bg-brand-aqua/10 ${idx === 0 ? "aspect-[16/10]" : "aspect-[4/3]"}`}>
                  <img
                    src={BASE + photo.src}
                    alt={photo.alt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Alianzas deportivas */}
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="h-10 w-10 rounded-xl bg-brand-yellow/20 flex items-center justify-center">
              <Trophy className="h-5 w-5 text-brand-orange" />
            </div>
            <div>
              <h3 className="font-heading font-black text-xl md:text-2xl text-brand-navy leading-tight">{t.activities.sports.title}</h3>
              <p className="text-brand-blue-text text-sm">{t.activities.sports.subtitle}</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {FUTBOL.map((photo, idx) => (
              <motion.div
                key={photo.src}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group"
              >
                <div className="relative rounded-2xl overflow-hidden border-4 border-white shadow-md group-hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-1 bg-brand-yellow/10 aspect-square">
                  <img
                    src={BASE + photo.src}
                    alt={photo.alt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
