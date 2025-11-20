'use client';

import { Sparkles, Zap, Shield, Globe, Server, ShoppingCart, CheckCircle, ArrowRight, Menu, X, Instagram } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useLanguage } from '@/contexts/language-context';
import { useState } from 'react';

export default function PricingPage() {
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
            <Link href="/pricing" className="hover:text-accent transition-colors font-semibold text-accent">{t("nav.pricing")}</Link>
            <Link href="/devis" className="hover:text-primary transition-colors">{t("nav.quote")}</Link>
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
                href="/pricing" 
                className="hover:text-accent transition-colors py-2 font-semibold text-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.pricing")}
              </Link>
              <Link 
                href="/devis" 
                className="hover:text-primary transition-colors py-2"
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
            <Sparkles className="w-4 h-4 text-primary" />
            <span>{t("pricing.page.badge")}</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            {t("pricing.page.title")} <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">{t("pricing.page.title.highlight")}</span>
          </h1>
          
          <p className="text-xl text-foreground/90 max-w-2xl mx-auto leading-relaxed mb-8">
            {t("pricing.page.subtitle")}
          </p>

          <Link
            href="/devis"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            {t("pricing.page.cta")}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Website Types Pricing */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <Globe className="w-8 h-8 text-secondary" />
              {t("pricing.siteTypes.title")}
            </h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              {t("pricing.siteTypes.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Simple */}
            <div className="bg-card/50 backdrop-blur-sm border-2 border-border rounded-xl p-6 hover:border-secondary/50 transition-all">
              <h3 className="text-xl font-bold mb-2">{t("pricing.siteTypes.simple.name")}</h3>
              <p className="text-3xl font-bold text-primary mb-4">450€</p>
              <p className="text-sm text-foreground/70 mb-4">{t("pricing.siteTypes.simple.desc")}</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span>1-3 {t("pricing.pages")}</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span>{t("pricing.responsive")}</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span>{t("pricing.customDesign")}</span>
                </li>
              </ul>
            </div>

            {/* Standard */}
            <div className="bg-card/50 backdrop-blur-sm border-2 border-border rounded-xl p-6 hover:border-secondary/50 transition-all">
              <h3 className="text-xl font-bold mb-2">{t("pricing.siteTypes.standard.name")}</h3>
              <p className="text-3xl font-bold text-primary mb-4">650€</p>
              <p className="text-sm text-foreground/70 mb-4">{t("pricing.siteTypes.standard.desc")}</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span>4-5 {t("pricing.pages")}</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span>{t("pricing.responsive")}</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span>{t("pricing.customDesign")}</span>
                </li>
              </ul>
            </div>

            {/* Advanced */}
            <div className="bg-card/50 backdrop-blur-sm border-2 border-secondary/50 rounded-xl p-6 hover:border-secondary transition-all relative">
              <div className="absolute -top-3 right-4">
                <span className="px-3 py-1 bg-gradient-to-r from-secondary to-accent text-white text-xs font-bold rounded-full">
                  {t("pricing.popular")}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">{t("pricing.siteTypes.advanced.name")}</h3>
              <p className="text-3xl font-bold text-secondary mb-4">1000€</p>
              <p className="text-sm text-foreground/70 mb-4">{t("pricing.siteTypes.advanced.desc")}</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span>6-8 {t("pricing.pages")}</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span>{t("pricing.responsive")}</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span>{t("pricing.customDesign")}</span>
                </li>
              </ul>
            </div>

            {/* Premium */}
            <div className="bg-card/50 backdrop-blur-sm border-2 border-border rounded-xl p-6 hover:border-secondary/50 transition-all">
              <h3 className="text-xl font-bold mb-2">{t("pricing.siteTypes.premium.name")}</h3>
              <p className="text-3xl font-bold text-primary mb-4">1350€</p>
              <p className="text-sm text-foreground/70 mb-4">{t("pricing.siteTypes.premium.desc")}</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span>9-12 {t("pricing.pages")}</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span>{t("pricing.responsive")}</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span>{t("pricing.customDesign")}</span>
                </li>
              </ul>
            </div>

            {/* Portfolio */}
            <div className="bg-card/50 backdrop-blur-sm border-2 border-border rounded-xl p-6 hover:border-secondary/50 transition-all">
              <h3 className="text-xl font-bold mb-2">{t("pricing.siteTypes.portfolio.name")}</h3>
              <p className="text-3xl font-bold text-primary mb-4">600€ - 1200€</p>
              <p className="text-sm text-foreground/70 mb-4">{t("pricing.siteTypes.portfolio.desc")}</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span>{t("pricing.responsive")}</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span>{t("pricing.customDesign")}</span>
                </li>
              </ul>
            </div>

            {/* E-commerce */}
            <div className="bg-card/50 backdrop-blur-sm border-2 border-border rounded-xl p-6 hover:border-secondary/50 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingCart className="w-5 h-5 text-accent" />
                <h3 className="text-xl font-bold">{t("pricing.siteTypes.ecommerce.name")}</h3>
              </div>
              <p className="text-3xl font-bold text-accent mb-4">3000€ - 8000€</p>
              <p className="text-sm text-foreground/70 mb-4">{t("pricing.siteTypes.ecommerce.desc")}</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span>{t("pricing.responsive")}</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span>{t("pricing.payment")}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Pricing */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary/5 to-secondary/5 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <Zap className="w-8 h-8 text-primary" />
              {t("pricing.features.title")}
            </h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              {t("pricing.features.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-4 flex items-center justify-between">
              <span className="text-foreground">{t("pricing.features.contactForm")}</span>
              <span className="font-bold text-primary">100€</span>
            </div>
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-4 flex items-center justify-between">
              <span className="text-foreground">{t("pricing.features.quoteForm")}</span>
              <span className="font-bold text-primary">175€</span>
            </div>
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-4 flex items-center justify-between">
              <span className="text-foreground text-sm">{t("pricing.features.autoEmails")}</span>
              <span className="font-bold text-primary">300€</span>
            </div>
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-4 flex items-center justify-between">
              <span className="text-foreground">{t("pricing.features.booking")}</span>
              <span className="font-bold text-primary">800€</span>
            </div>
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-4 flex items-center justify-between">
              <span className="text-foreground">{t("pricing.features.calendar")}</span>
              <span className="font-bold text-primary">400€</span>
            </div>
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-4 flex items-center justify-between">
              <span className="text-foreground">{t("pricing.features.multilingual")}</span>
              <span className="font-bold text-primary">400€</span>
            </div>
          </div>

          {/* E-commerce Features */}
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-accent" />
              {t("pricing.features.ecommerce")}
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-4 flex items-center justify-between">
                <span className="text-foreground">{t("pricing.features.productCatalog")}</span>
                <span className="font-bold text-accent">800€</span>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-4 flex items-center justify-between">
                <span className="text-foreground">{t("pricing.features.cart")}</span>
                <span className="font-bold text-accent">500€</span>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-4 flex items-center justify-between">
                <span className="text-foreground">{t("pricing.features.paymentGateway")}</span>
                <span className="font-bold text-accent">600€</span>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-4 flex items-center justify-between">
                <span className="text-foreground">{t("pricing.features.orderManagement")}</span>
                <span className="font-bold text-accent">700€</span>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-4 flex items-center justify-between">
                <span className="text-foreground">{t("pricing.features.inventory")}</span>
                <span className="font-bold text-accent">500€</span>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-4 flex items-center justify-between">
                <span className="text-foreground">{t("pricing.features.accounts")}</span>
                <span className="font-bold text-accent">400€</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Optimization & Security */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <Shield className="w-8 h-8 text-secondary" />
              {t("pricing.optimization.title")}
            </h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              {t("pricing.optimization.subtitle")}
            </p>
          </div>

          {/* All-Inclusive Pack */}
          <div className="mb-8 max-w-3xl mx-auto">
            <div className="bg-gradient-to-r from-primary/20 to-secondary/20 border-2 border-primary/50 rounded-xl p-6 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1 bg-gradient-to-r from-primary to-secondary text-white text-sm font-bold rounded-full shadow-lg">
                  ⭐ {t("pricing.recommended")}
                </span>
              </div>
              <div className="text-center mt-2">
                <h3 className="text-2xl font-bold mb-2">{t("pricing.optimization.allInclusive")}</h3>
                <p className="text-4xl font-bold text-primary mb-4">750€</p>
                <p className="text-foreground/80 mb-4">{t("pricing.optimization.allInclusiveDesc")}</p>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-secondary" />
                    <span>{t("pricing.optimization.seo")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-secondary" />
                    <span>{t("pricing.optimization.performance")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-secondary" />
                    <span>{t("pricing.optimization.ssl")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-secondary" />
                    <span>{t("pricing.optimization.gdpr")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mb-6">
            <span className="text-foreground/60 text-sm">{t("pricing.or")}</span>
          </div>

          <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-4 flex items-center justify-between">
              <span className="text-foreground">{t("pricing.optimization.seo")}</span>
              <span className="font-bold text-secondary">300€</span>
            </div>
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-4 flex items-center justify-between">
              <span className="text-foreground">{t("pricing.optimization.performance")}</span>
              <span className="font-bold text-secondary">250€</span>
            </div>
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-4 flex items-center justify-between">
              <span className="text-foreground">{t("pricing.optimization.ssl")}</span>
              <span className="font-bold text-secondary">{t("pricing.included")}</span>
            </div>
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-4 flex items-center justify-between">
              <span className="text-foreground">{t("pricing.optimization.gdpr")}</span>
              <span className="font-bold text-secondary">200€</span>
            </div>
          </div>
        </div>
      </section>

      {/* Hosting Info */}
      <section className="py-20 px-6 bg-gradient-to-br from-accent/5 to-primary/5 relative">
        <div className="max-w-4xl mx-auto text-center">
          <Server className="w-12 h-12 text-accent mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">{t("pricing.hosting.title")}</h2>
          <div className="bg-card/50 backdrop-blur-sm border-2 border-accent/30 rounded-xl p-8">
            <p className="text-lg font-semibold text-accent mb-2">
              ✅ {t("pricing.hosting.included")}
            </p>
            <p className="text-foreground/80">
              {t("pricing.hosting.desc")}
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-1/4 w-72 h-72 bg-primary/50 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-secondary/50 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t("pricing.cta.title")}
          </h2>
          <p className="text-lg text-foreground/80 mb-8">
            {t("pricing.cta.subtitle")}
          </p>
          <Link
            href="/devis"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary via-secondary to-accent text-white rounded-xl hover:opacity-90 transition-opacity text-lg font-semibold shadow-lg"
          >
            {t("pricing.cta.button")}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-3 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Guapo Web Designer
              </h3>
              <p className="text-foreground/80 text-sm leading-relaxed">
                {t("footer.description")}
              </p>
            </div>

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
