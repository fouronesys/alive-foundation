import { motion } from "framer-motion";

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

const TEAM: TeamMember[] = [
  {
    name: "Elsy S. Acosta Ureña, M.A.",
    role: "Presidenta",
    bio: "Abogada con formación en Alta Dirección Pública, Diplomacia Comercial y Negocios Corporativos. Impulsa iniciativas inclusivas para fortalecer comunidades.",
    image: "team/elsy-presidenta.jpg",
  },
  {
    name: "Dra. Shakira Vásquez",
    role: "Vice Presidenta",
    bio: "Pediatra especialista en neurodesarrollo, con más de 10 años en inclusión y abordaje familiar. Fundadora de Alive.",
    image: "team/shakira-vicepresidenta.jpg",
  },
  {
    name: "Lic. Ángela López",
    role: "Secretaria",
    bio: "Mujer, madre, bioanalista de profesión. Coordina y hace posible que los procesos sigan su curso con empatía, amor y alegría.",
    image: "team/angela-secretaria.jpg",
  },
  {
    name: "Lic. Harolyn Díaz",
    role: "Tesorera",
    bio: "Crea estrategias junto al equipo para construir una sociedad más justa e inclusiva. Cree en la igualdad de género como tarea diaria.",
    image: "team/harolyn-tesorera.jpg",
  },
  {
    name: "Dra. Yamell Camilo",
    role: "Relaciones Interinstitucionales y Voluntariado",
    bio: "Médica y madre sensibilizada con la inclusión. Aporta empatía y formación a familias con miembros con necesidades en su neurodesarrollo.",
    image: "team/yamell-relaciones.jpg",
  },
  {
    name: "Lissette Fermín Genao",
    role: "Relaciones Públicas y Eventos",
    bio: "Event Planner y especialista en organización de eventos. Aporta planificación estratégica, comunicación y una visión enfocada en crear experiencias memorables.",
    image: "team/lissette-relaciones.jpg",
  },
];

const BASE = import.meta.env.BASE_URL;

export default function TeamSection() {
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
            <span className="text-sm font-bold tracking-wide uppercase">Nuestro Equipo</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-heading font-black text-brand-navy mb-4">
            Conoce el corazón detrás de <span className="text-brand-orange">Alive Foundation</span>
          </h2>
          <p className="text-brand-blue-text text-lg leading-relaxed">
            Seis mujeres, seis historias, un mismo propósito. Madres, profesionales y amigas que comparten un sueño: <strong className="text-brand-navy">servir y transformar vidas</strong>.
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
              <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-1 bg-brand-aqua/10 aspect-[3/4]">
                <img
                  src={BASE + member.image}
                  alt={member.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/40 to-transparent opacity-90" />
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                  <p className="font-heading font-bold text-sm leading-tight drop-shadow">
                    {member.name}
                  </p>
                  <p className="text-brand-yellow text-xs font-semibold mt-0.5">
                    {member.role}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs text-brand-blue-text leading-snug px-1 hidden md:block">
                {member.bio}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Group photo banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-16 md:mt-24 max-w-5xl mx-auto"
        >
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white bg-white">
            <img
              src={BASE + "team/equipo-completo.webp"}
              alt="El equipo detrás de Alive Foundation"
              loading="lazy"
              className="w-full h-auto"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
