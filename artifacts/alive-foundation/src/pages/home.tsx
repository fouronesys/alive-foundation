import { motion } from "framer-motion";
import { ArrowRight, Heart, Users, HandHeart, Calendar, MapPin, Clock, Sparkles, Instagram } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import InstagramEmbed from "@/components/InstagramEmbed";
import festivalImage from "@assets/IMG-20260521-WA0017_1779575433983.jpg";

const instagramPosts = [
  "https://www.instagram.com/reel/DXxLfjgPV6W/",
  "https://www.instagram.com/reel/DWJ2BZ8kXAA/",
  "https://www.instagram.com/p/DOHWx9ZCSbe/",
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-aqua/20 border border-brand-aqua/30 text-brand-aqua mb-8 backdrop-blur-sm"
            >
              <Heart className="h-4 w-4 fill-current" />
              <span className="text-sm font-bold tracking-wide uppercase">Tercera Edición Consecutiva</span>
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
              "todos pertenecemos"
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
                <span className="text-lg">10:00 a.m. – 2:00 p.m.</span>
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
              <Link href="/invitaciones">
                <Button size="lg" className="bg-brand-orange hover:bg-brand-orange/90 text-white rounded-full px-8 py-6 text-lg font-bold shadow-lg shadow-brand-orange/20 h-auto group">
                  Convertirse en Patrocinador
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
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

      {/* Gallery Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-black text-brand-navy mb-4">
              Así vivimos el festival 2025
            </h2>
            <p className="text-brand-blue-text text-lg max-w-2xl mx-auto">
              Momentos llenos de alegría, aprendizaje y conexión real entre familias y la comunidad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Momentos que se quedan para siempre", icon: Heart, bg: "bg-brand-orange", delay: 0, offset: "" },
              { label: "Comunidad que nos inspira", icon: Users, bg: "bg-brand-aqua", delay: 0.1, offset: "md:translate-y-8" },
              { label: "Voluntarios que transforman", icon: HandHeart, bg: "bg-brand-navy", delay: 0.2, offset: "" },
              { label: "Espacios para todos", icon: Sparkles, bg: "bg-brand-yellow", delay: 0.3, offset: "md:translate-y-8" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: item.delay }}
                className={`aspect-[3/4] rounded-3xl overflow-hidden shadow-lg group relative ${item.offset}`}
              >
                <div className={`w-full h-full ${item.bg} flex flex-col items-center justify-center p-8 transition-transform duration-700 group-hover:scale-105`}>
                  <item.icon className="h-16 w-16 text-white/30 fill-current mb-6" />
                  <p className="text-white font-bold text-center text-lg leading-snug">{item.label}</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto items-start">
            {instagramPosts.map((url, idx) => (
              <motion.div
                key={url}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex justify-center"
              >
                <InstagramEmbed url={url} />
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
              <Link href="/invitaciones">
                <Button size="lg" className="w-full sm:w-auto bg-brand-yellow hover:bg-brand-yellow/90 text-brand-navy rounded-full px-8 py-6 text-lg font-bold shadow-xl shadow-brand-yellow/20">
                  Ver Planes de Patrocinio
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
