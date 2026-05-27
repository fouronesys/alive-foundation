import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const BASE = import.meta.env.BASE_URL;

const PHOTOS = Array.from({ length: 17 }, (_, i) => `therapy/therapy-${String(i + 1).padStart(2, "0")}.jpg`);

export default function TherapyGallery() {
  return (
    <section className="py-24 bg-gradient-to-b from-white via-brand-yellow/5 to-white relative overflow-hidden">
      <div className="absolute top-32 right-0 h-72 w-72 rounded-full bg-brand-orange/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-0 h-80 w-80 rounded-full bg-brand-aqua/10 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-yellow/20 text-brand-orange mb-4">
            <Heart className="h-4 w-4 fill-brand-orange" />
            <span className="text-sm font-bold tracking-wide uppercase">Nuestras Terapias</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-heading font-black text-brand-navy mb-4">
            Momentos que <span className="text-brand-aqua">transforman vidas</span>
          </h2>
          <p className="text-brand-blue-text text-lg leading-relaxed">
            Cada sonrisa, cada logro, cada pequeño paso adelante es la razón por la que existimos. Estos son algunos de los niños y niñas con quienes compartimos terapias y experiencias inolvidables.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto columns-2 md:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
          {PHOTOS.map((src, idx) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: (idx % 8) * 0.05 }}
              className="mb-4 break-inside-avoid group"
            >
              <div className="relative rounded-2xl overflow-hidden border-4 border-white shadow-md group-hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-1 bg-brand-aqua/10">
                <img
                  src={BASE + src}
                  alt={`Terapia con niños — Alive Foundation ${idx + 1}`}
                  loading="lazy"
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12 font-heading italic text-brand-navy text-lg md:text-xl max-w-2xl mx-auto"
        >
          "La inclusión no se enseña con palabras, <span className="text-brand-orange font-bold">se vive con el corazón</span>."
        </motion.p>
      </div>
    </section>
  );
}
