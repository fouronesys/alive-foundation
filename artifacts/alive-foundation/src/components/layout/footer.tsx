import { Heart, Mail, Instagram, MapPin, Phone } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/i18n/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-brand-navy text-white pt-16 pb-8 border-t-4 border-brand-orange">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-orange text-white">
                <Heart className="h-6 w-6 fill-current" />
              </div>
              <span className="font-heading font-black text-2xl tracking-tight">Alive Foundation</span>
            </div>
            <p className="text-white/80 text-sm max-w-sm mt-4">
              {t.footer.description}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-heading font-bold text-lg text-brand-aqua">{t.footer.contact}</h3>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-brand-orange shrink-0" />
                <a href="mailto:info@alivefoundationrd.com" className="hover:text-brand-orange transition-colors">info@alivefoundationrd.com</a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-brand-orange shrink-0" />
                <a href="tel:+18495398669" className="hover:text-brand-orange transition-colors">+1 (849) 539-8669</a>
              </li>
              <li className="flex items-start gap-3">
                <Instagram className="h-5 w-5 text-brand-orange shrink-0" />
                <a href="https://instagram.com/alivefoundationrd" target="_blank" rel="noreferrer" className="hover:text-brand-orange transition-colors">@alivefoundationrd</a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-brand-orange shrink-0" />
                <span>Santiago,<br/>República Dominicana</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-heading font-bold text-lg text-brand-aqua">{t.footer.links}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-white/80 hover:text-brand-orange transition-colors">
                  {t.footer.home}
                </Link>
              </li>
            </ul>
          </div>
          
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/60 text-xs text-center md:text-left">
            &copy; {new Date().getFullYear()} Alive Foundation RD. {t.footer.tagline}
          </p>
          <div className="flex items-center gap-2 text-white/60 text-xs">
            {t.footer.madeWith} <Heart className="h-3 w-3 text-brand-orange fill-current" /> {t.footer.forInclusion}
          </div>
        </div>
      </div>
    </footer>
  );
}
