import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Copy, Download, Share2, Heart, Star, Zap, Gift, Calendar, MapPin, Clock } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  sponsorType: z.enum(["returning", "new"]),
  plan: z.enum(["comunidad", "inclusion", "impacto", "especie"]),
  inKindType: z.string().optional(),
  companyName: z.string().optional(),
  contactName: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const plans = [
  {
    id: "comunidad",
    name: "Plan Comunidad",
    amount: "RD$ 20,000",
    color: "#00B5CC",
    bgClass: "bg-[#00B5CC]",
    textClass: "text-[#00B5CC]",
    borderClass: "border-[#00B5CC]",
    phrase: "Sumando oportunidades",
    icon: Heart,
    benefits: ["Logo en pantalla de patrocinadores", "Mención en redes sociales", "Logo en brochure digital", "Certificado de patrocinio", "Presencia en agradecimiento oficial"]
  },
  {
    id: "inclusion",
    name: "Plan Inclusión",
    amount: "RD$ 50,000",
    color: "#F47B20",
    bgClass: "bg-[#F47B20]",
    textClass: "text-[#F47B20]",
    borderClass: "border-[#F47B20]",
    phrase: "Haciendo visible el cambio",
    icon: Zap,
    benefits: ["Beneficios Plan Comunidad", "Logo en materiales impresos", "Presencia en backdrop oficial", "Espacio para stand promocional", "Mención durante el evento", "Inclusión en campaña digital del festival"]
  },
  {
    id: "impacto",
    name: "Plan Impacto",
    amount: "RD$ 100,000",
    color: "#F5C400",
    bgClass: "bg-[#F5C400]",
    textClass: "text-[#F5C400]",
    borderClass: "border-[#F5C400]",
    phrase: "Transformando vidas juntos",
    icon: Star,
    benefits: ["Beneficios Plan Inclusión", "Logo destacado como patrocinador principal", "Presencia preferencial en vallas y piezas visuales", "Branding en área estratégica del festival", "Participación destacada en publicaciones", "Entrevistas o menciones especiales", "Inclusión destacada en media/reel recap", "Reconocimiento especial durante apertura"]
  },
  {
    id: "especie",
    name: "Aliado en Especie",
    amount: "Aporte en servicios o productos",
    color: "#64748b",
    bgClass: "bg-slate-500",
    textClass: "text-slate-500",
    borderClass: "border-slate-500",
    phrase: "Apoyo fundamental para el evento",
    icon: Gift,
    benefits: ["Acuerdo personalizado según el aporte", "Agua, alimentos, impresión, sonido, mobiliario, transporte, regalos, terapias o fotografía", "Mención especial como Aliado"]
  }
];

export default function Invitations() {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sponsorType: "new",
      plan: "inclusion",
      companyName: "",
      contactName: "",
      inKindType: "",
    },
  });

  const currentValues = form.watch();
  const selectedPlan = plans.find(p => p.id === currentValues.plan);

  const handleCopy = () => {
    const letterElement = document.getElementById("letter-content");
    if (letterElement) {
      navigator.clipboard.writeText(letterElement.innerText)
        .then(() => {
          toast({
            title: "Carta copiada",
            description: "El contenido ha sido copiado al portapapeles.",
          });
        })
        .catch(() => {
          toast({
            title: "Error",
            description: "No se pudo copiar el texto.",
            variant: "destructive",
          });
        });
    }
  };

  const handleDownload = () => {
    window.print();
  };

  const handleShare = async () => {
    const shareData = {
      title: "Invitación · Festival de la Inclusión 2026",
      text: "Te invitamos a ser parte del Festival de la Inclusión 2026 — Alive Foundation",
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Enlace copiado",
          description: "El enlace de la invitación se copió al portapapeles.",
        });
      }
    } catch {
      // user cancelled share
    }
  };

  const currentDate = format(new Date(), "d 'de' MMMM 'de' yyyy", { locale: es });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-heading font-black text-brand-navy mb-4">Generador de Invitaciones</h1>
        <p className="text-brand-blue-text text-lg">
          Personaliza y genera una carta formal para invitar a empresas y organizaciones a ser parte del cambio en el Festival de la Inclusión 2026.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Configurator Sidebar */}
        <div className="lg:col-span-4 space-y-8 bg-white p-6 rounded-3xl border border-border/60 shadow-sm print:hidden">
          <div>
            <h2 className="text-xl font-heading font-bold text-brand-navy mb-6 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange text-sm">1</span>
              Opciones de la Carta
            </h2>
            
            <Form {...form}>
              <form className="space-y-6">
                <FormField
                  control={form.control}
                  name="sponsorType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-brand-navy font-bold">Tipo de Patrocinador</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="new" id="type-new" />
                            <Label htmlFor="type-new" className="font-normal text-brand-blue-text cursor-pointer">
                              Nuevo patrocinador
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="returning" id="type-returning" />
                            <Label htmlFor="type-returning" className="font-normal text-brand-blue-text cursor-pointer">
                              Patrocinador anterior (Renovación)
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="space-y-4 pt-4 border-t border-border">
                  <Label className="text-brand-navy font-bold block">Datos de Personalización (Opcional)</Label>
                  
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Nombre de la empresa" {...field} className="bg-gray-50 border-transparent focus-visible:ring-brand-aqua" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Atención a (Nombre del contacto)" {...field} className="bg-gray-50 border-transparent focus-visible:ring-brand-aqua" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4 pt-4 border-t border-border">
                  <Label className="text-brand-navy font-bold block">Selección de Plan</Label>
                  <p className="text-xs text-brand-blue-text mb-4">El plan seleccionado aparecerá destacado en la carta.</p>
                  
                  <FormField
                    control={form.control}
                    name="plan"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-1 gap-3"
                          >
                            {plans.map((p) => (
                              <FormItem key={p.id} className="relative">
                                <FormControl>
                                  <RadioGroupItem value={p.id} className="peer sr-only" />
                                </FormControl>
                                <Label
                                  htmlFor={p.id}
                                  className="flex flex-col items-start gap-1 rounded-xl border-2 border-transparent bg-gray-50 p-4 hover:bg-gray-100 peer-data-[state=checked]:border-brand-aqua peer-data-[state=checked]:bg-white cursor-pointer transition-all"
                                  style={{
                                    borderColor: field.value === p.id ? p.color : 'transparent'
                                  }}
                                >
                                  <div className="flex items-center justify-between w-full">
                                    <span className="font-bold flex items-center gap-2" style={{ color: p.color }}>
                                      <p.icon className="h-4 w-4" />
                                      {p.name}
                                    </span>
                                  </div>
                                  <span className="text-sm font-medium text-brand-navy">{p.amount}</span>
                                </Label>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {currentValues.plan === "especie" && (
                    <FormField
                      control={form.control}
                      name="inKindType"
                      render={({ field }) => (
                        <FormItem className="animate-in fade-in slide-in-from-top-2">
                          <FormControl>
                            <Input placeholder="Ej: Agua, Fotografía, Impresión..." {...field} className="bg-gray-50 border-transparent focus-visible:ring-slate-500" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </form>
            </Form>
          </div>
        </div>

        {/* Letter Preview */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="flex items-center justify-between mb-4 print:hidden">
            <h2 className="text-xl font-heading font-bold text-brand-navy flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-aqua/10 text-brand-aqua text-sm">2</span>
              Vista Previa Digital
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
                <Copy className="h-4 w-4" /> Copiar
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
                <Share2 className="h-4 w-4" /> Compartir
              </Button>
              <Button onClick={handleDownload} size="sm" className="gap-2 bg-brand-navy hover:bg-brand-navy/90 text-white">
                <Download className="h-4 w-4" /> Descargar PDF
              </Button>
            </div>
          </div>

          {/* Digital Invitation Card */}
          <div className="bg-white rounded-3xl shadow-2xl shadow-brand-navy/10 border border-gray-100 w-full max-w-[760px] mx-auto overflow-hidden print:shadow-none print:border-none print:max-w-none print:w-full print:m-0 print:rounded-none">
            {/* Colorful gradient header band */}
            <div className="relative bg-brand-navy px-8 sm:px-12 pt-10 pb-12 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange rounded-full blur-[100px] opacity-30 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-56 h-56 bg-brand-aqua rounded-full blur-[100px] opacity-25 pointer-events-none" />
              <div className="relative z-10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shrink-0">
                    <Heart className="h-7 w-7 text-brand-orange fill-current" />
                  </div>
                  <div>
                    <h1 className="font-heading font-black text-xl text-white tracking-tight leading-tight">Alive Foundation</h1>
                    <p className="text-xs font-bold text-brand-aqua uppercase tracking-wider">República Dominicana</p>
                  </div>
                </div>
                <div className="text-right text-[11px] text-white/70 hidden sm:block">
                  <p>{currentDate}</p>
                  <p>hola@alivefoundation.org</p>
                </div>
              </div>
              <div className="relative z-10 mt-8">
                <span className="inline-block px-3 py-1 rounded-full bg-brand-orange/20 text-brand-orange text-[11px] font-bold uppercase tracking-wider mb-3">
                  Invitación oficial
                </span>
                <h2 className="font-heading font-black text-3xl sm:text-4xl text-white leading-tight">
                  Festival de la <span className="text-brand-yellow">Inclusión 2026</span>
                </h2>
                <p className="text-brand-aqua font-medium mt-2 italic">"Haciendo de la inclusión una realidad"</p>
              </div>
            </div>

            <div id="letter-content" className="p-8 sm:p-12 font-sans text-brand-navy text-[15px] leading-relaxed">
              {/* Salutation */}
              <div className="mb-6">
                <p className="font-bold text-xl text-brand-navy">
                  {currentValues.companyName ? `Hola, ${currentValues.companyName}` : "Hola,"}
                </p>
                {currentValues.contactName && (
                  <p className="text-brand-blue-text mt-1">Atención: {currentValues.contactName}</p>
                )}
              </div>

              {/* Body Content based on type */}
              {currentValues.sponsorType === "returning" ? (
                <div className="space-y-4 text-justify">
                  <p>En Alive Foundation creemos que la inclusión debe sentirse, vivirse y convertirse en una realidad para cada familia.</p>
                  
                  <p>Gracias a su apoyo, durante estos años hemos logrado impactar aproximadamente a 500 familias, acompañando procesos terapéuticos de miembros con trastornos del neurodesarrollo y creando espacios donde la inclusión sea visible, humana y posible.</p>
                  
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 my-6 text-center">
                    <p className="font-bold text-brand-navy mb-1 text-sm uppercase tracking-wider">Por tercera vez consecutiva realizaremos el:</p>
                    <h3 className="text-2xl font-heading font-black text-brand-orange mb-4">FESTIVAL DE LA INCLUSIÓN 2026</h3>
                    <div className="inline-flex flex-col items-center justify-center text-sm font-medium gap-1 text-brand-blue-text">
                      <span>📍 Parque Infantil del Jardín Botánico Profesor Eugenio de Jesús Marcano</span>
                      <span>📅 11 de octubre de 2026 | ⏰ 10:00 a.m. – 2:00 p.m.</span>
                    </div>
                  </div>

                  <p>Este festival es un espacio diseñado para toda la familia, donde promovemos inclusión, comunidad, educación, recreación y apoyo integral a familias que viven diariamente los retos del neurodesarrollo.</p>
                  
                  <p className="font-medium text-brand-aqua">Queremos agradecerles por haber sido parte de este camino y extenderles nuevamente la invitación a unirse a esta nueva edición como aliados de impacto.</p>
                  
                  <p>Su respaldo no solo hace posible un evento; hace posible experiencias, oportunidades y esperanza para cientos de familias.</p>
                </div>
              ) : (
                <div className="space-y-4 text-justify">
                  <p>Reciban un cordial saludo de parte de Alive Foundation. Somos una organización comprometida con apoyar procesos terapéuticos de miembros con trastornos del neurodesarrollo y con promover una sociedad más inclusiva para todas las familias.</p>
                  
                  <p>Con nuestro lema: <strong>"Haciendo de la inclusión una realidad"</strong>, hemos impactado aproximadamente a 500 familias mediante actividades de apoyo, orientación, inclusión y acompañamiento comunitario.</p>
                  
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 my-6 text-center">
                    <p className="font-bold text-brand-navy mb-1 text-sm uppercase tracking-wider">Este 2026 celebraremos la tercera edición del:</p>
                    <h3 className="text-2xl font-heading font-black text-brand-orange mb-4">FESTIVAL DE LA INCLUSIÓN 2026</h3>
                    <div className="inline-flex flex-col items-center justify-center text-sm font-medium gap-1 text-brand-blue-text">
                      <span>📍 Parque Infantil del Jardín Botánico Profesor Eugenio de Jesús Marcano</span>
                      <span>📅 11 de octubre de 2026 | ⏰ 10:00 a.m. – 2:00 p.m.</span>
                    </div>
                  </div>

                  <p>El festival es un espacio familiar que reúne actividades recreativas, educativas e inclusivas, creando oportunidades de conexión y sensibilización para toda la comunidad.</p>
                  
                  <p className="font-medium text-brand-aqua">Nos encantaría invitarles a formar parte de esta iniciativa como patrocinadores y aliados estratégicos de impacto social.</p>
                  
                  <p>Creemos profundamente que las marcas también pueden convertirse en agentes de inclusión, generando cambios reales y visibles dentro de nuestra sociedad.</p>
                </div>
              )}

              {/* Plan Highlight Box */}
              {selectedPlan && (
                <div 
                  className="my-8 p-6 rounded-2xl border-2 flex flex-col md:flex-row gap-6 items-center md:items-start page-break-inside-avoid"
                  style={{ borderColor: selectedPlan.color, backgroundColor: `${selectedPlan.color}08` }}
                >
                  <div 
                    className="h-16 w-16 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: selectedPlan.color, color: 'white' }}
                  >
                    <selectedPlan.icon className="h-8 w-8" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h4 className="font-heading font-black text-xl mb-1" style={{ color: selectedPlan.color }}>
                      {selectedPlan.name}
                    </h4>
                    <p className="font-bold text-lg text-brand-navy mb-3">
                      {currentValues.plan === "especie" && currentValues.inKindType 
                        ? `Aporte en: ${currentValues.inKindType}` 
                        : selectedPlan.amount}
                    </p>
                    <p className="text-sm font-medium italic mb-4" style={{ color: selectedPlan.color }}>
                      "{selectedPlan.phrase}"
                    </p>
                    <ul className="text-sm text-brand-navy space-y-1.5 text-left list-disc list-inside pl-4">
                      {selectedPlan.benefits.slice(0, 4).map((benefit, idx) => (
                        <li key={idx}>{benefit}</li>
                      ))}
                      {selectedPlan.benefits.length > 4 && (
                        <li>...y más beneficios incluidos en el brochure.</li>
                      )}
                    </ul>
                  </div>
                </div>
              )}

              {/* Closing */}
              <div className="mt-8 space-y-6">
                {currentValues.sponsorType === "returning" ? (
                  <p className="font-medium">Gracias por seguir creyendo junto a nosotros que todos merecen pertenecer.</p>
                ) : (
                  <p className="font-medium">Agradecemos de antemano su atención y esperamos poder construir juntos esta experiencia transformadora.</p>
                )}

                <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-brand-orange to-brand-yellow flex items-center justify-center text-white font-heading font-black text-lg shrink-0">
                    EA
                  </div>
                  <div>
                    <p className="text-xs text-brand-blue-text mb-0.5">Con gratitud,</p>
                    <p className="font-heading font-black text-lg text-brand-navy leading-tight">Elsy Acosta</p>
                    <p className="text-brand-blue-text text-sm">Presidenta · Alive Foundation</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer with event quick info */}
            <div className="bg-gray-50 border-t border-gray-100 px-8 sm:px-12 py-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2 text-brand-navy">
                <Calendar className="h-4 w-4 text-brand-orange shrink-0" />
                <span className="font-medium">11 de octubre, 2026</span>
              </div>
              <div className="flex items-center gap-2 text-brand-navy">
                <Clock className="h-4 w-4 text-brand-aqua shrink-0" />
                <span className="font-medium">10:00 a.m. – 2:00 p.m.</span>
              </div>
              <div className="flex items-center gap-2 text-brand-navy">
                <MapPin className="h-4 w-4 text-brand-yellow shrink-0" />
                <span className="font-medium">Jardín Botánico, Santiago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Cards Display below */}
      <div className="mt-24 pt-16 border-t border-border print:hidden">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-black text-brand-navy mb-4">Planes de Patrocinio Disponibles</h2>
          <p className="text-brand-blue-text text-lg max-w-2xl mx-auto">Selecciona el plan que mejor se adapte a los objetivos de tu empresa y sé parte de este gran impacto.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`rounded-3xl border-2 bg-white flex flex-col overflow-hidden transition-all duration-300 ${form.watch("plan") === plan.id ? 'ring-4 ring-offset-2 ring-brand-navy scale-105 shadow-xl z-10' : 'hover:shadow-lg hover:-translate-y-1'}`}
              style={{ borderColor: plan.color }}
            >
              <div className="p-6 text-center text-white" style={{ backgroundColor: plan.color }}>
                <plan.icon className="h-10 w-10 mx-auto mb-4" />
                <h3 className="font-heading font-black text-2xl mb-1">{plan.name}</h3>
                <p className="text-white/90 text-sm font-medium italic">"{plan.phrase}"</p>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="text-center mb-6 pb-6 border-b border-border">
                  <span className="text-2xl font-black text-brand-navy">{plan.amount}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1 text-sm text-brand-blue-text">
                  {plan.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="mt-1 h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: plan.color }} />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full text-white font-bold"
                  style={{ backgroundColor: plan.color }}
                  onClick={() => {
                    form.setValue("plan", plan.id as any);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  {form.watch("plan") === plan.id ? "Seleccionado" : "Seleccionar Plan"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
