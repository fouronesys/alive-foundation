import { motion } from "framer-motion";
import { Sparkles, Mic, Trophy } from "lucide-react";

const BASE = import.meta.env.BASE_URL;

const CHARLAS = [
  { src: "activities/charla-1.jpg", alt: "Charla de Alive Foundation en Gidex" },
  { src: "activities/charla-2.jpg", alt: "Asistentes participando en la charla" },
  { src: "activities/charla-3.jpg", alt: "Equipo de Alive Foundation con asistente" },
];

const FUTBOL = [
  { src: "activities/futbol-1.jpg", alt: "Jugador del Cibao FC con niño" },
  { src: "activities/futbol-2.jpg", alt: "Niña con balón junto a jugadores del Cibao FC" },
  { src: "activities/futbol-3.jpg", alt: "Equipo Cibao FC con niños de Alive Foundation" },
  { src: "activities/futbol-4.jpg", alt: "Familias Alive con jugadores del Cibao FC" },
];

export default function ActivitiesSection() {
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
            <span className="text-sm font-bold tracking-wide uppercase">Nuestras Actividades</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-heading font-black text-brand-navy mb-4">
            Llevando inclusión a <span className="text-brand-orange">cada espacio</span>
          </h2>
          <p className="text-brand-blue-text text-lg leading-relaxed">
            Charlas, alianzas y visitas que conectan a nuestras familias con la comunidad. Así sembramos inclusión durante todo el año.
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
              <h3 className="font-heading font-black text-xl md:text-2xl text-brand-navy leading-tight">Charlas y formación</h3>
              <p className="text-brand-blue-text text-sm">Compartiendo nuestra misión con instituciones aliadas</p>
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
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Visita al equipo Cibao FC */}
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="h-10 w-10 rounded-xl bg-brand-orange/15 flex items-center justify-center">
              <Trophy className="h-5 w-5 text-brand-orange" />
            </div>
            <div>
              <h3 className="font-heading font-black text-xl md:text-2xl text-brand-navy leading-tight">Visita al Cibao FC</h3>
              <p className="text-brand-blue-text text-sm">Una jornada inolvidable junto a nuestros niños y el equipo profesional</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {FUTBOL.map((photo, idx) => (
              <motion.div
                key={photo.src}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className={`group ${idx === 1 ? "md:translate-y-6" : ""} ${idx === 3 ? "md:translate-y-6" : ""}`}
              >
                <div className="relative rounded-2xl overflow-hidden border-4 border-white shadow-md group-hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-1 bg-brand-orange/10 aspect-[4/5]">
                  <img
                    src={BASE + photo.src}
                    alt={photo.alt}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16 font-heading italic text-brand-navy text-lg md:text-xl max-w-2xl mx-auto"
        >
          "Cada alianza, cada visita, cada charla es <span className="text-brand-orange font-bold">un paso más hacia la inclusión</span>."
        </motion.p>
      </div>
    </section>
  );
}
