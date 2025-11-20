'use client';

import { QuoteForm } from '@/components/quote-form';
import { Sparkles, FileText, Menu, X, Instagram } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useLanguage } from '@/contexts/language-context';
import { useState } from 'react';

export default function DevisPage() {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image 
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Logo-de-Guapo-Designer-Web-1762372330786.png?width=8000&height=8000&resize=contain"
              alt="GUAPO Web Designer Logo"
              width={120}
              height={60}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8 items-center">
            <Link href="/#accueil" className="hover:text-primary transition-colors">{t("nav.home")}</Link>
            <Link href="/#about" className="hover:text-secondary transition-colors">{t("nav.about")}</Link>
            <Link href="/#portfolio" className="hover:text-accent transition-colors">{t("nav.portfolio")}</Link>
            <Link href="/#services" className="hover:text-secondary transition-colors">{t("nav.services")}</Link>
            <Link href="/devis" className="hover:text-accent transition-colors font-semibold text-accent">{t("nav.quote")}</Link>
            <Link href="/#contact" className="hover:text-primary transition-colors">{t("nav.contact")}</Link>
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-primary/10 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-primary" />
            ) : (
              <Menu className="w-6 h-6 text-primary" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-md border-b border-border shadow-lg">
            <div className="flex flex-col gap-4 px-6 py-6">
              <Link 
                href="/#accueil" 
                className="hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.home")}
              </Link>
              <Link 
                href="/#about" 
                className="hover:text-secondary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.about")}
              </Link>
              <Link 
                href="/#portfolio" 
                className="hover:text-accent transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.portfolio")}
              </Link>
              <Link 
                href="/#services" 
                className="hover:text-secondary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.services")}
              </Link>
              <Link 
                href="/devis" 
                className="hover:text-accent transition-colors py-2 font-semibold text-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.quote")}
              </Link>
              <Link 
                href="/#contact" 
                className="hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.contact")}
              </Link>
              <div className="pt-2 border-t border-border">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Laser Lines Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="laser-line" style={{ left: '10%', animationDelay: '0s' }}></div>
        <div className="laser-line laser-line-secondary" style={{ left: '25%', animationDelay: '2s' }}></div>
        <div className="laser-line laser-line-accent" style={{ left: '40%', animationDelay: '4s' }}></div>
        <div className="laser-line" style={{ left: '55%', animationDelay: '1s' }}></div>
        <div className="laser-line laser-line-secondary" style={{ left: '70%', animationDelay: '3s' }}></div>
        <div className="laser-line laser-line-accent" style={{ left: '85%', animationDelay: '5s' }}></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 bg-gradient-to-br from-background via-primary/20 to-secondary/20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/40 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/40 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent/30 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/30 text-sm border border-primary/50 backdrop-blur-sm mb-6">
            <FileText className="w-4 h-4 text-primary" />
            <span>{t("quote.page.badge")}</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            {t("quote.page.title")} <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">{t("quote.page.title.highlight")}</span>
          </h1>
          
          <p className="text-xl text-foreground/90 max-w-2xl mx-auto leading-relaxed">
            {t("quote.page.subtitle")}
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="bg-card/50 backdrop-blur-sm border-2 border-primary/30 rounded-xl p-6 text-center hover:scale-105 transition-transform">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">{t("quote.page.card1.title")}</h3>
              <p className="text-sm text-foreground/70">{t("quote.page.card1.desc")}</p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border-2 border-secondary/30 rounded-xl p-6 text-center hover:scale-105 transition-transform">
              <div className="w-12 h-12 bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">{t("quote.page.card2.title")}</h3>
              <p className="text-sm text-foreground/70">{t("quote.page.card2.desc")}</p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border-2 border-accent/30 rounded-xl p-6 text-center hover:scale-105 transition-transform">
              <div className="w-12 h-12 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">{t("quote.page.card3.title")}</h3>
              <p className="text-sm text-foreground/70">{t("quote.page.card3.desc")}</p>
            </div>
          </div>

          {/* Special Offer Banner */}
          <div className="mb-12 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-2xl blur-xl"></div>
            <div className="relative bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-2 border-primary/40 rounded-2xl p-8 text-center backdrop-blur-sm">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/30 text-sm border border-primary/50 backdrop-blur-sm mb-4">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <span className="font-semibold">Offre Spéciale</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                🎁 1 Mois de Maintenance Offert
              </h3>
              <p className="text-foreground/80 text-lg">
                Profitez d'un mois de maintenance gratuite pour assurer le bon fonctionnement de votre site web après sa mise en ligne.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-card/30 backdrop-blur-sm border-2 border-border rounded-2xl p-8 md:p-12 shadow-2xl">
            <QuoteForm />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-background via-accent/20 to-primary/20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-1/4 w-72 h-72 bg-primary/50 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-secondary/50 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t("quote.page.cta.title")}
          </h2>
          <p className="text-lg text-foreground/80 mb-8">
            {t("quote.page.cta.desc")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:info@guapowebdesigner.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              info@guapowebdesigner.com
            </a>
            <a
              href="https://www.instagram.com/guapo_webdesigner/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary/40 bg-card/50 backdrop-blur-sm rounded-lg hover:bg-primary/20 transition-colors"
            >
              @guapo_webdesigner
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Column 1: Brand */}
            <div>
              <h3 className="font-bold text-lg mb-3 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Guapo Web Designer
              </h3>
              <p className="text-foreground/80 text-sm leading-relaxed">
                {t("footer.description")}
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h3 className="font-semibold text-base mb-3">{t("footer.links")}</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/#portfolio" className="text-foreground/80 hover:text-primary transition-colors text-sm flex items-center gap-2">
                    <span>→</span> {t("nav.portfolio")}
                  </Link>
                </li>
                <li>
                  <Link href="/#services" className="text-foreground/80 hover:text-primary transition-colors text-sm flex items-center gap-2">
                    <span>→</span> {t("nav.services")}
                  </Link>
                </li>
                <li>
                  <Link href="/#contact" className="text-foreground/80 hover:text-primary transition-colors text-sm flex items-center gap-2">
                    <span>→</span> {t("nav.contact")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Legal */}
            <div>
              <h3 className="font-semibold text-base mb-3">Informations légales</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/politique-confidentialite" className="text-foreground/80 hover:text-primary transition-colors text-sm flex items-center gap-2">
                    <span>→</span> Politique de confidentialité
                  </Link>
                </li>
                <li>
                  <Link href="/mentions-legales" className="text-foreground/80 hover:text-primary transition-colors text-sm flex items-center gap-2">
                    <span>→</span> Mentions légales
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Social */}
            <div>
              <h3 className="font-semibold text-base mb-3">{t("footer.social")}</h3>
              <a 
                href="https://www.instagram.com/guapo_webdesigner/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-foreground/80 hover:text-primary transition-colors text-sm flex items-center gap-2"
              >
                <Instagram className="w-4 h-4" />
                <span>Instagram</span>
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-border text-center">
            <p className="text-foreground/80 text-sm">
              © 2025 <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-semibold">GUAPO</span> Web Designer. {t("footer.rights")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}