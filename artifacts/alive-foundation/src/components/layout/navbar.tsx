import { Link, useLocation } from "wouter";
import logo from "@/assets/logo.jpg";
import { useLanguage } from "@/i18n/LanguageContext";

export default function Navbar() {
  const [location] = useLocation();
  const { lang, setLang, t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src={logo}
            alt="Alive Foundation — Festival de la Inclusión"
            className="h-14 w-14 rounded-full object-cover border-2 border-brand-orange shadow-sm"
          />
          <div className="flex flex-col">
            <span className="font-heading font-black text-lg md:text-xl leading-none text-brand-navy tracking-tight">
              Alive Foundation
            </span>
            <span className="text-[0.65rem] font-bold text-brand-aqua uppercase tracking-wider mt-1">
              {t.nav.festivalSubtitle}
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-brand-orange ${
                location === "/" ? "text-brand-orange" : "text-brand-navy"
              }`}
            >
              {t.nav.home}
            </Link>
          </nav>

          {/* Language toggle */}
          <button
            onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-brand-orange text-brand-orange font-bold text-sm hover:bg-brand-orange hover:text-white transition-colors"
            aria-label={lang === 'es' ? 'Switch to English' : 'Cambiar a Español'}
          >
            {lang === 'es' ? 'EN' : 'ES'}
          </button>
        </div>
      </div>
    </header>
  );
}
