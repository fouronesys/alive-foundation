import { motion } from "framer-motion";
import { ArrowRight, Heart, Users, HandHeart, Calendar, MapPin, Clock, Sparkles, Instagram, Gift, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import LocalVideoEmbed from "@/components/LocalVideoEmbed";
import TeamSection from "@/components/TeamSection";
import TherapyGallery from "@/components/TherapyGallery";
import ActivitiesSection from "@/components/ActivitiesSection";
import AnimatedLogo from "@/components/AnimatedLogo";
import festivalImage from "@assets/IMG-20260521-WA0017_1779575433983.jpg";

const BASE = import.meta.env.BASE_URL;

const videoReels = [
  {
    src: BASE + "videos/basketball.mp4",
    caption: "La inclusión se vivió en cada instante. Abrazos sinceros, sonrisas y momentos que se quedan.",
  },
  {
    src: BASE + "videos/dia-sindrome-down.mp4",
    caption: "En conmemoración del Día Mundial del Síndrome de Down, celebramos a cada persona y familia.",
  },
  {
    src: BASE + "videos/intencion-genuina.mp4",
    caption: "Cuando la intención es genuina y se le suma conocimiento, el impacto se multiplica.",
  },
];

const plans = [
  {
    name: "Plan Comunidad",
    price: "RD$ 20,000",
    tagline: "Sumando oportunidades",
    highlights: [
      "Logo en pantalla de patrocinadores",
      "Mención en redes sociales",
      "Logo en brochure digital",
      "Certificado de patrocinio",
      "Presencia en agradecimiento oficial",
    ],
    icon: Heart,
    accent: "bg-brand-aqua",
    accentText: "text-white",
    border: "border-brand-aqua",
  },
  {
    name: "Plan Inclusión",
    price: "RD$ 50,000",
    tagline: "Haciendo visible el cambio",
    inheritsFrom: "Plan Comunidad",
    highlights: [
      "Logo en materiales impresos",
      "Presencia en backdrop oficial",
      "Espacio para stand promocional",
      "Mención durante el evento",
      "Inclusión en campaña digital del festival",
    ],
    icon: Users,
    accent: "bg-brand-orange",
    accentText: "text-white",
    border: "border-brand-orange",
  },
  {
    name: "Plan Impacto",
    price: "RD$ 100,000",
    tagline: "Transformando vidas juntos",
    inheritsFrom: "Plan Inclusión",
    highlights: [
      "Logo destacado como patrocinador principal",
      "Presencia preferencial en vallas y piezas visuales",
      "Branding en área estratégica del festival",
      "Participación destacada en publicaciones",
      "Entrevistas o menciones especiales",
      "Inclusión destacada en media/reel recap",
      "Reconocimiento especial durante apertura",
    ],
    icon: Sparkles,
    accent: "bg-brand-yellow",
    accentText: "text-brand-navy",
    border: "border-brand-yellow",
  },
  {
    name: "Aliado en Especie",
    price: "Aporte en especie",
    tagline: "Aporta lo que tu marca hace mejor",
    highlights: [
      "Alimentos y bebidas",
      "Impresiones",
      "Pantalla, sonido, truss, etc.",
      "Fotografía y video",
      "Regalos y certificados",
      "Mención en el evento",
      "Colocación de logo, según el valor de la contribución",
    ],
    icon: Gift,
    accent: "bg-brand-navy",
    accentText: "text-white",
    border: "border-brand-navy",
  },
];

const stats = [
  { value: "+300", label: "Familias impactadas", icon: Heart, color: "text-brand-orange", bg: "bg-brand-orange/10" },
  { value: "+120", label: "Voluntarios involucrados", icon: Users, color: "text-brand-aqua", bg: "bg-brand-aqua/10" },
  { value: "+20", label: "Aliados y patrocinadores", icon: HandHeart, color: "text-brand-yellow", bg: "bg-brand-yellow/10" },
  { value: "+1,500", label: "Asistentes al festival", icon: Sparkles, color: "text-brand-navy", bg: "bg-brand-navy/10" },
];

export default function Home() {
  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-32 overflow-hidden bg-brand-navy">
        <div className="absolute inset-0 z-0 opacity-20 mix-blend-overlay">
          <img 
            src={festivalImage} 
            alt="Festival de la Inclusión Background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/80 to-transparent z-10" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center mb-8"
            >
              <AnimatedLogo size={110} />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black text-white font-heading tracking-tight mb-6 leading-tight"
            >
              Festival de la <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-yellow">
                Inclusión 2026
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-3xl font-medium text-brand-aqua mb-12 font-heading"
            >
              "Haciendo de la inclusión una realidad"
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 text-white/90 mb-12"
            >
              <div className="flex items-center gap-3">
                <Calendar className="h-6 w-6 text-brand-orange" />
                <span className="text-lg">11 de Octubre, 2026</span>
              </div>
              <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-white/30" />
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-brand-yellow" />
                <span className="text-lg">9:00 a.m. – 12:00 p.m.</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center justify-center gap-3 text-white/90 mb-12"
            >
              <MapPin className="h-6 w-6 text-brand-aqua shrink-0" />
              <span className="text-lg text-left">
                Parque Infantil del Jardín Botánico Profesor Eugenio de Jesús Marcano<br/>
                <span className="text-white/60 text-sm">Santiago, República Dominicana</span>
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <a href="#planes">
                <Button size="lg" className="bg-brand-orange hover:bg-brand-orange/90 text-white rounded-full px-8 py-6 text-lg font-bold shadow-lg shadow-brand-orange/20 h-auto group">
                  Convertirse en Patrocinador
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-white relative z-20 -mt-8 rounded-t-[3rem] border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-brand-orange font-bold tracking-widest uppercase text-sm mb-4">Nuestra Misión</h2>
            <p className="text-3xl md:text-5xl font-heading font-bold text-brand-navy leading-tight text-balance">
              El Festival de la Inclusión es <span className="text-brand-aqua">mucho más que un evento</span>: es una experiencia que transforma vidas, conecta comunidades y crea oportunidades reales para niños, jóvenes y familias.
            </p>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-black text-brand-navy">
              Inclusión que Transforma
            </h2>
            <p className="text-brand-blue-text mt-4 text-lg">El impacto de nuestras pasadas ediciones</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white rounded-3xl p-8 text-center shadow-sm border border-border/50 hover:shadow-md transition-shadow"
              >
                <div className={`w-16 h-16 mx-auto rounded-2xl ${stat.bg} flex items-center justify-center mb-6`}>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <h3 className="text-4xl font-black font-heading text-brand-navy mb-2">{stat.value}</h3>
                <p className="text-brand-blue-text font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Graphic / Quote Section */}
      <section className="py-32 bg-brand-aqua relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Heart className="h-16 w-16 text-white/20 fill-current mx-auto mb-8" />
            <h2 className="text-4xl md:text-6xl font-heading font-black text-white leading-tight">
              "Un espacio donde la inclusión se vive, se siente y se celebra."
            </h2>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <TeamSection />

      {/* Therapy Gallery */}
      <TherapyGallery />

      {/* Activities Section */}
      <ActivitiesSection />

      {/* Plans Section */}
      <section id="planes" className="py-24 bg-white scroll-mt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-orange/10 text-brand-orange mb-4">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-bold tracking-wide uppercase">Patrocinios</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-black text-brand-navy mb-4">
              Planes de Patrocinio
            </h2>
            <p className="text-brand-blue-text text-lg max-w-2xl mx-auto">
              Elige el nivel que mejor refleje el compromiso de tu marca con la inclusión. Te enviaremos una invitación personalizada para confirmar tu participación.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {plans.map((plan, idx) => {
              const Icon = plan.icon;
              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`flex flex-col rounded-3xl border-2 ${plan.border} bg-white p-6 shadow-sm hover:shadow-xl transition-shadow`}
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl ${plan.accent} ${plan.accentText} mb-4`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-heading font-black text-brand-navy mb-1">{plan.name}</h3>
                  <div className="text-2xl font-black text-brand-navy mb-2">{plan.price}</div>
                  <p className="text-sm italic text-brand-blue-text mb-5 leading-relaxed">"{plan.tagline}"</p>
                  {plan.inheritsFrom && (
                    <p className="text-xs font-bold uppercase tracking-wide text-brand-orange mb-2">
                      Todo lo del {plan.inheritsFrom} +
                    </p>
                  )}
                  <ul className="space-y-2 mb-6 flex-1">
                    {plan.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-sm text-brand-navy/80">
                        <Check className="h-4 w-4 text-brand-aqua shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <p className="text-brand-blue-text mb-4">
              ¿Listo para sumarte? Contáctanos y te enviaremos tu invitación personalizada.
            </p>
            <a
              href="mailto:contributions@alivefoundationrd.com?subject=Quiero%20ser%20patrocinador%20del%20Festival%20de%20la%20Inclusi%C3%B3n%202026"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-orange text-white font-bold hover:bg-brand-orange/90 transition-colors"
            >
              Solicitar mi invitación
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-orange/10 text-brand-orange mb-4">
              <Instagram className="h-4 w-4" />
              <span className="text-sm font-bold tracking-wide uppercase">@alivefoundationrd</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-black text-brand-navy mb-4">
              Nuestro impacto en redes
            </h2>
            <p className="text-brand-blue-text text-lg max-w-2xl mx-auto">
              Historias reales de familias, voluntarios y aliados que viven la inclusión cada día. Síguenos para no perderte ningún momento.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto items-start justify-items-center">
            {videoReels.map((reel, idx) => (
              <motion.div
                key={reel.src}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex justify-center w-full"
              >
                <LocalVideoEmbed src={reel.src} caption={reel.caption} />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="https://www.instagram.com/alivefoundationrd/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-navy text-white font-bold hover:bg-brand-navy/90 transition-colors"
            >
              <Instagram className="h-5 w-5" />
              Síguenos en Instagram
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-brand-navy relative overflow-hidden mt-16 md:mt-24">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] bg-brand-orange rounded-full blur-[120px] opacity-20 mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-[600px] h-[600px] bg-brand-aqua rounded-full blur-[100px] opacity-20 mix-blend-screen pointer-events-none" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-heading font-black text-white mb-6">
              Te invitamos a ser parte del cambio en 2026
            </h2>
            <p className="text-xl text-white/80 mb-12 font-medium">
              Tu apoyo hace posible historias como estas. Sé parte del Festival de la Inclusión 2026 y ayúdanos a seguir transformando realidades.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="#planes">
                <Button size="lg" className="w-full sm:w-auto bg-brand-yellow hover:bg-brand-yellow/90 text-brand-navy rounded-full px-8 py-6 text-lg font-bold shadow-xl shadow-brand-yellow/20">
                  Ver Planes de Patrocinio
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
