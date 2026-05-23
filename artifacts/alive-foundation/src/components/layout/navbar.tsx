import { Link, useLocation } from "wouter";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-orange text-white group-hover:bg-brand-aqua transition-colors">
            <Heart className="h-6 w-6 fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-black text-xl leading-none text-brand-navy tracking-tight">Alive Foundation</span>
            <span className="text-[0.65rem] font-bold text-brand-aqua uppercase tracking-wider">República Dominicana</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className={`text-sm font-medium transition-colors hover:text-brand-orange ${location === "/" ? "text-brand-orange" : "text-brand-navy"}`}>
            Inicio
          </Link>
          <Link href="/invitaciones" className={`text-sm font-medium transition-colors hover:text-brand-orange ${location === "/invitaciones" ? "text-brand-orange" : "text-brand-navy"}`}>
            Generador de Invitaciones
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/invitaciones" className="hidden sm:inline-flex">
            <Button className="bg-brand-orange hover:bg-brand-orange/90 text-white rounded-full px-6 font-bold">
              Ser Patrocinador
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
