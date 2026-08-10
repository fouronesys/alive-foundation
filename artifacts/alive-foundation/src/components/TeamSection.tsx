import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";

const IMAGES = [
  "team/elsy-presidenta.jpg",
  "team/shakira-vicepresidenta.jpg",
  "team/angela-secretaria.jpg",
  "team/harolyn-tesorera.jpg",
  "team/yamell-relaciones.jpg",
  "team/lissette-relaciones.jpg",
];

const BASE = import.meta.env.BASE_URL;

export default function TeamSection() {
  const { t } = useLanguage();
  const TEAM = t.team.members.map((m, i) => ({ ...m, image: IMAGES[i] }));

  return (
    <section className="py-24 bg-gradient-to-b from-white via-brand-aqua/5 to-white relative overflow-hidden">
      {/* Decorative blurs */}
      <div className="absolute top-20 -left-32 h-80 w-80 rounded-full bg-brand-aqua/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 -right-32 h-80 w-80 rounded-full bg-brand-orange/15 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-orange/10 text-brand-orange mb-4">
            <span className="text-sm font-bold tracking-wide uppercase">{t.team.badgeLabel}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-heading font-black text-brand-navy mb-4">
            {t.team.title} <span className="text-brand-orange">Alive Foundation</span>
          </h2>
          <p className="text-brand-blue-text text-lg leading-relaxed">
            {t.team.subtitle} <strong className="text-brand-navy">{t.team.subtitleBold}</strong>.
          </p>
        </motion.div>

        {/* Team grid - hex-inspired offset */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {TEAM.map((member, idx) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className={`group ${idx % 2 === 1 ? "md:translate-y-8" : ""}`}
            >
              <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-b from-brand-aqua/5 to-white">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={BASE + member.image}
                    alt={member.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-heading font-black text-brand-navy text-sm md:text-base leading-snug">{member.name}</h3>
                  <p className="text-brand-orange font-bold text-xs uppercase tracking-wide mt-0.5 mb-2">{member.role}</p>
                  <p className="text-brand-blue-text text-xs leading-relaxed hidden md:block">{member.bio}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Group photo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-xl">
            <img
              src={BASE + "team/equipo-completo.webp"}
              alt={t.team.groupPhotoAlt}
              className="w-full h-auto object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
