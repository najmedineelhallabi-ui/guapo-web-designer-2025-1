"use client";

import Image from "next/image";
import {
  ArrowRight, Code, Palette, Sparkles, Mail, Zap, Monitor, Tablet,
  Smartphone, Instagram, Menu, X, ShoppingCart, MessageCircle,
  Briefcase, FileText, UtensilsCrossed, Star, ChevronDown,
  Globe, MousePointer, Layers, TrendingUp, Award, Users
} from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/contexts/language-context";
import { useState, useEffect } from "react";

export default function Home() {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">

      {/* Laser Lines Background — subtle, full-page */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-40">
        <div className="laser-line" style={{ left: "8%", animationDelay: "0s" }} />
        <div className="laser-line laser-line-secondary" style={{ left: "22%", animationDelay: "2.5s" }} />
        <div className="laser-line laser-line-accent" style={{ left: "38%", animationDelay: "5s" }} />
        <div className="laser-line" style={{ left: "54%", animationDelay: "1.5s" }} />
        <div className="laser-line laser-line-secondary" style={{ left: "70%", animationDelay: "3.5s" }} />
        <div className="laser-line laser-line-accent" style={{ left: "88%", animationDelay: "7s" }} />
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ============================================================
          NAVIGATION
          ============================================================ */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-black/30"
          : "bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#accueil" className="flex items-center group">
            <Image
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Logo-de-Guapo-Designer-Web-1762372330786.png?width=8000&height=8000&resize=contain"
              alt="GUAPO Web Designer Logo"
              width={120}
              height={60}
              className="h-11 w-auto object-contain transition-all duration-300 group-hover:brightness-110"
              priority
            />
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-1 items-center">
            {[
              { href: "#accueil", label: t("nav.home") },
              { href: "#about", label: t("nav.about") },
              { href: "#portfolio", label: t("nav.portfolio") },
              { href: "#services", label: t("nav.services") },
              { href: "#contact", label: t("nav.contact") },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="relative px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors duration-200 group"
              >
                {label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-gradient-to-r from-primary to-secondary group-hover:w-3/4 transition-all duration-300" />
              </a>
            ))}
            <div className="w-px h-5 bg-border/50 mx-2" />
            <a
              href="/devis"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary via-secondary to-accent text-white rounded-full text-sm font-semibold hover:scale-105 hover:shadow-lg hover:shadow-primary/40 transition-all duration-300"
            >
              <FileText className="w-4 h-4" />
              {t("nav.quote")}
            </a>
            <LanguageSwitcher />
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl bg-card/80 border border-border hover:border-primary/50 transition-all"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen
              ? <X className="w-5 h-5 text-primary" />
              : <Menu className="w-5 h-5 text-foreground" />
            }
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-card/98 backdrop-blur-2xl border-b border-border shadow-2xl">
            <div className="flex flex-col gap-1 px-6 py-6">
              {[
                { href: "#accueil", label: t("nav.home") },
                { href: "#about", label: t("nav.about") },
                { href: "#portfolio", label: t("nav.portfolio") },
                { href: "#services", label: t("nav.services") },
                { href: "#contact", label: t("nav.contact") },
              ].map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className="py-3 px-4 rounded-lg hover:bg-primary/10 hover:text-primary transition-all text-sm font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {label}
                </a>
              ))}
              <div className="pt-3 mt-2 border-t border-border flex flex-col gap-3">
                <a
                  href="/devis"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-primary via-secondary to-accent text-white rounded-full text-sm font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FileText className="w-4 h-4" />
                  {t("nav.quote")}
                </a>
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ============================================================
          HERO SECTION
          ============================================================ */}
      <section id="accueil" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">
        {/* Background layers */}
        <div className="absolute inset-0 hero-grid opacity-100" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background" />

        {/* Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[120px] animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-accent/15 rounded-full blur-[80px]" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/25 text-sm font-medium text-primary mb-8 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {t("hero.badge")}
            <Sparkles className="w-3.5 h-3.5" />
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight leading-[1.05] mb-6">
            <span className="block text-foreground/90">{t("hero.title")}</span>
            <span className="block shimmer-text">{t("hero.title.highlight")}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto mb-12 leading-relaxed">
            {t("hero.subtitle")}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <a
              href="#portfolio"
              className="group inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-primary via-secondary to-accent text-white rounded-full font-semibold text-base hover:scale-105 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300"
            >
              {t("hero.cta.projects")}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2.5 px-8 py-4 border border-white/15 bg-white/5 backdrop-blur-sm text-foreground/80 rounded-full font-semibold text-base hover:bg-white/10 hover:border-white/30 transition-all duration-300"
            >
              {t("hero.cta.contact")}
            </a>
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {[
              { value: "15+", label: "Projets livrés" },
              { value: "100%", label: "Clients satisfaits" },
              { value: "3", label: "Langues" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold stat-number mb-1">{value}</div>
                <div className="text-xs text-foreground/50 uppercase tracking-widest">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <a href="#about" className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-foreground/30 hover:text-foreground/60 transition-colors">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ChevronDown className="w-5 h-5 scroll-indicator" />
        </a>
      </section>

      {/* ============================================================
          ABOUT SECTION
          ============================================================ */}
      <section id="about" className="py-32 px-6 relative overflow-hidden bg-background">
        {/* Subtle background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/3 to-background" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-20">
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.3em] text-primary mb-4">À Propos</span>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-foreground">{t("about.title").split(" ")[0]} </span>
              <span className="shimmer-text">{t("about.title").split(" ").slice(1).join(" ")}</span>
            </h2>
            <div className="w-16 h-px bg-gradient-to-r from-primary to-secondary mx-auto" />
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
            {[
              { icon: <Sparkles className="w-6 h-6" />, title: t("about.values.passion"), desc: t("about.values.passion.desc"), gradient: "from-primary/20 to-primary/5", border: "border-primary/20", glow: "hover:shadow-primary/20" },
              { icon: <Zap className="w-6 h-6" />, title: t("about.values.innovation"), desc: t("about.values.innovation.desc"), gradient: "from-secondary/20 to-secondary/5", border: "border-secondary/20", glow: "hover:shadow-secondary/20" },
              { icon: <TrendingUp className="w-6 h-6" />, title: t("about.values.performance"), desc: t("about.values.performance.desc"), gradient: "from-accent/20 to-accent/5", border: "border-accent/20", glow: "hover:shadow-accent/20" },
              { icon: <Palette className="w-6 h-6" />, title: t("about.values.creativity"), desc: t("about.values.creativity.desc"), gradient: "from-primary/15 to-accent/10", border: "border-primary/20", glow: "hover:shadow-primary/20" },
            ].map(({ icon, title, desc, gradient, border, glow }) => (
              <div
                key={title}
                className={`card-shine group p-8 rounded-2xl bg-gradient-to-br ${gradient} border ${border} hover:shadow-2xl ${glow} hover:-translate-y-1 transition-all duration-400`}
              >
                <div className="w-12 h-12 rounded-xl bg-background/50 border border-white/10 flex items-center justify-center text-primary mb-5 group-hover:scale-110 transition-transform">
                  {icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground">{title}</h3>
                <p className="text-sm text-foreground/60 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* About Block */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <p className="text-lg text-foreground/80 leading-relaxed">
                {t("about.intro")}
              </p>
              <p className="text-foreground/60 leading-relaxed">
                {t("about.p1")}
              </p>
              <div className="flex gap-6 pt-4">
                {[
                  { icon: <Globe className="w-4 h-4" />, text: "Belgique" },
                  { icon: <Award className="w-4 h-4" />, text: "Certifié" },
                  { icon: <Users className="w-4 h-4" />, text: "Multilingue" },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-sm text-foreground/50">
                    <span className="text-primary">{icon}</span>
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Logo Card */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-12 bg-gradient-to-br from-primary/15 via-secondary/10 to-accent/15 rounded-full blur-3xl" />
                <div className="relative gradient-border rounded-3xl p-1">
                  <div className="w-72 h-72 bg-card rounded-[22px] flex items-center justify-center p-8">
                    <Image
                      src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Logo-de-Guapo-Designer-Web-1762372330786.png?width=8000&height=8000&resize=contain"
                      alt="GUAPO Web Designer"
                      width={240}
                      height={240}
                      className="w-full h-full object-contain animate-float"
                    />
                  </div>
                </div>
                {/* Floating badges */}
                <div className="absolute -top-4 -right-4 px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-full shadow-lg shadow-primary/40">
                  ✦ Web Design
                </div>
                <div className="absolute -bottom-4 -left-4 px-3 py-1.5 bg-secondary text-white text-xs font-bold rounded-full shadow-lg shadow-secondary/40">
                  ✦ Bruxelles
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          PORTFOLIO SECTION
          ============================================================ */}
      <section id="portfolio" className="py-32 px-6 relative overflow-hidden">
        {/* Dark bg with subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-card via-background to-card" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-20">
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.3em] text-accent mb-4">Portfolio</span>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              {t("portfolio.title.prefix")}
              <span className="shimmer-text">{t("portfolio.title.highlight")}</span>
            </h2>
            <p className="text-foreground/50 text-lg max-w-xl mx-auto">{t("portfolio.subtitle")}</p>
            <div className="w-16 h-px bg-gradient-to-r from-secondary to-accent mx-auto mt-6" />
          </div>

          {/* Portfolio Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                href: "https://www.guapomenu.com",
                img: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/ChatGPT-Image-21-dec.-2025-16_40_56-1766457790930.png?width=8000&height=8000&resize=contain",
                name: "Guapo Menu",
                url: "guapomenu.com",
                tag: "App SaaS",
                tagColor: "bg-accent/20 text-accent border-accent/30",
                bg: "bg-white",
              },
              {
                href: "https://www.fiscand.business",
                img: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Capture-d-ecran-2025-10-24-124300-1762369451856.png?width=8000&height=8000&resize=contain",
                name: "Fisc & Business",
                url: "fiscand.business",
                tag: "Site Vitrine",
                tagColor: "bg-primary/20 text-primary border-primary/30",
                bg: "bg-white",
              },
              {
                href: "https://salarybusiness.be/",
                img: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/LOGO-SALARYBUSINESS-1762369466889.jpg?width=8000&height=8000&resize=contain",
                name: "Salary Business",
                url: "salarybusiness.be",
                tag: "Site Vitrine",
                tagColor: "bg-secondary/20 text-secondary border-secondary/30",
                bg: "bg-white",
              },
            ].map(({ href, img, name, url, tag, tagColor, bg }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="card-shine group block rounded-2xl overflow-hidden border border-white/8 bg-card hover:border-primary/30 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/15 transition-all duration-400"
              >
                {/* Preview */}
                <div className={`aspect-video ${bg} flex items-center justify-center p-10 relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Image
                    src={img}
                    alt={name}
                    width={400}
                    height={225}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                {/* Info */}
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-foreground mb-1">{name}</h3>
                    <p className="text-sm text-foreground/40">{url}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full border ${tagColor}`}>{tag}</span>
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          SERVICES SECTION
          ============================================================ */}
      <section id="services" className="py-32 px-6 relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/3 to-background" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-20">
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.3em] text-secondary mb-4">Services</span>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              {t("services.title")} <span className="shimmer-text">{t("services.title.highlight")}</span>
            </h2>
            <p className="text-foreground/50 text-lg max-w-xl mx-auto">{t("services.subtitle")}</p>
            <div className="w-16 h-px bg-gradient-to-r from-primary to-secondary mx-auto mt-6" />
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-24">
            {[
              { icon: <Monitor className="w-5 h-5" />, title: t("services.desktop.title"), desc: t("services.desktop.desc"), color: "primary" },
              { icon: <Tablet className="w-5 h-5" />, title: t("services.tablet.title"), desc: t("services.tablet.desc"), color: "secondary" },
              { icon: <Smartphone className="w-5 h-5" />, title: t("services.mobile.title"), desc: t("services.mobile.desc"), color: "accent" },
              { icon: <Layers className="w-5 h-5" />, title: t("services.responsive.title"), desc: t("services.responsive.desc"), color: "primary" },
              { icon: <Palette className="w-5 h-5" />, title: t("services.branding.title"), desc: t("services.branding.desc"), color: "secondary" },
              { icon: <Zap className="w-5 h-5" />, title: t("services.performance.title"), desc: t("services.performance.desc"), color: "accent" },
            ].map(({ icon, title, desc, color }) => (
              <div
                key={title}
                className={`card-shine group p-6 rounded-2xl border border-${color}/15 bg-${color}/5 hover:bg-${color}/10 hover:border-${color}/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-${color}/10 transition-all duration-300`}
              >
                <div className={`w-10 h-10 rounded-xl bg-${color}/15 text-${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {icon}
                </div>
                <h3 className="font-bold text-base text-foreground mb-2">{title}</h3>
                <p className="text-sm text-foreground/50 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* ---- Besoin d'un site web ---- */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {t("services.website.title.prefix")} <span className="shimmer-text">{t("services.website.title.highlight")}</span>
            </h2>
            <p className="text-foreground/50 text-lg">{t("services.website.subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Site Vitrine */}
            <a
              href="/devis"
              className="card-shine group relative flex flex-col p-8 rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/8 to-transparent hover:border-primary/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-400"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/15 text-primary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                <Briefcase className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{t("services.website.showcase.title")}</h3>
              <p className="text-sm text-foreground/55 leading-relaxed mb-6 flex-grow">{t("services.website.showcase.desc")}</p>
              <div className="flex items-center gap-2 text-primary text-sm font-semibold group-hover:gap-3 transition-all">
                {t("services.website.cta")} <ArrowRight className="w-4 h-4" />
              </div>
            </a>

            {/* E-commerce */}
            <a
              href="/devis"
              className="card-shine group relative flex flex-col p-8 rounded-2xl border border-secondary/20 bg-gradient-to-b from-secondary/8 to-transparent hover:border-secondary/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-secondary/20 transition-all duration-400"
            >
              <div className="w-14 h-14 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-secondary group-hover:text-white transition-all">
                <ShoppingCart className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{t("services.website.ecommerce.title")}</h3>
              <p className="text-sm text-foreground/55 leading-relaxed mb-6 flex-grow">{t("services.website.ecommerce.desc")}</p>
              <div className="flex items-center gap-2 text-secondary text-sm font-semibold group-hover:gap-3 transition-all">
                {t("services.website.cta")} <ArrowRight className="w-4 h-4" />
              </div>
            </a>

            {/* Guapo Menu */}
            <a
              href="https://www.guapomenu.com"
              target="_blank"
              rel="noopener noreferrer"
              className="card-shine group relative flex flex-col p-8 rounded-2xl border border-accent/20 bg-gradient-to-b from-accent/8 to-transparent hover:border-accent/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent/20 transition-all duration-400 overflow-hidden"
            >
              <div className="absolute top-0 right-0 opacity-5 group-hover:opacity-10 transition-opacity">
                <UtensilsCrossed className="w-32 h-32 text-accent -rotate-12 translate-x-4 -translate-y-4" />
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm border border-gray-100">
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/ChatGPT-Image-21-dec.-2025-16_40_56-1766457790930.png?width=8000&height=8000&resize=contain"
                  alt="Guapo Menu"
                  width={56}
                  height={56}
                  className="w-10 h-10 object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Guapo Menu</h3>
              <p className="text-sm text-foreground/55 leading-relaxed mb-6 flex-grow">
                L'application n°1 pour créer vos menus digitaux, QR codes et gérer vos commandes en ligne.
              </p>
              <div className="flex items-center gap-2 text-accent text-sm font-semibold group-hover:gap-3 transition-all">
                Découvrir <ArrowRight className="w-4 h-4" />
              </div>
            </a>

            {/* Contact */}
            <a
              href="#contact"
              className="card-shine group relative flex flex-col p-8 rounded-2xl border border-white/8 bg-gradient-to-b from-white/5 to-transparent hover:border-white/20 hover:-translate-y-2 hover:shadow-2xl hover:shadow-white/5 transition-all duration-400"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-white">
                <MessageCircle className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{t("services.website.discuss.title")}</h3>
              <p className="text-sm text-foreground/55 leading-relaxed mb-6 flex-grow">{t("services.website.discuss.desc")}</p>
              <div className="flex items-center gap-2 text-foreground/60 text-sm font-semibold group-hover:gap-3 group-hover:text-foreground transition-all">
                {t("services.website.discuss.cta")} <ArrowRight className="w-4 h-4" />
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================
          CONTACT SECTION
          ============================================================ */}
      <section id="contact" className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-card via-background to-card" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />
        {/* Glows */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.3em] text-secondary mb-4">Contact</span>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 shimmer-text">
              {t("contact.section.title")}
            </h2>
            <p className="text-foreground/50 text-lg max-w-2xl mx-auto">
              {t("contact.section.desc")}
            </p>
            <div className="w-16 h-px bg-gradient-to-r from-secondary to-accent mx-auto mt-6" />
          </div>

          {/* Contact Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <a
              href="mailto:info@guapowebdesigner.com"
              className="card-shine group flex flex-col items-center text-center p-10 rounded-2xl border border-primary/15 bg-primary/5 hover:border-primary/35 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-400"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/15 text-primary flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                <Mail className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{t("contact.email.title")}</h3>
              <p className="text-primary font-medium text-sm">info@guapowebdesigner.com</p>
            </a>

            <a
              href="https://www.instagram.com/guapo_webdesigner/"
              target="_blank"
              rel="noopener noreferrer"
              className="card-shine group flex flex-col items-center text-center p-10 rounded-2xl border border-accent/15 bg-accent/5 hover:border-accent/35 hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent/20 transition-all duration-400"
            >
              <div className="w-16 h-16 rounded-2xl bg-accent/15 text-accent flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-accent group-hover:text-white transition-all">
                <Instagram className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{t("contact.instagram.title")}</h3>
              <p className="text-accent font-medium text-sm">@guapo_webdesigner</p>
            </a>

            <a
              href="/devis"
              className="card-shine group flex flex-col items-center text-center p-10 rounded-2xl border border-secondary/15 bg-secondary/5 hover:border-secondary/35 hover:-translate-y-2 hover:shadow-2xl hover:shadow-secondary/20 transition-all duration-400"
            >
              <div className="w-16 h-16 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-secondary group-hover:text-white transition-all">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{t("contact.quote.title")}</h3>
              <p className="text-secondary font-medium text-sm">{t("contact.quote.desc")}</p>
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================
          FOOTER
          ============================================================ */}
      <footer className="py-16 px-6 border-t border-white/5 bg-card/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Logo-de-Guapo-Designer-Web-1762372330786.png?width=8000&height=8000&resize=contain"
                alt="GUAPO Web Designer"
                width={120}
                height={50}
                className="h-10 w-auto object-contain mb-4"
              />
              <p className="text-foreground/50 text-sm leading-relaxed max-w-xs">
                {t("footer.description")}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">{t("footer.links")}</h3>
              <ul className="space-y-2.5">
                {[
                  { href: "#portfolio", label: t("nav.portfolio") },
                  { href: "#services", label: t("nav.services") },
                  { href: "#contact", label: t("nav.contact") },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <a href={href} className="text-foreground/50 hover:text-primary transition-colors text-sm flex items-center gap-2 group">
                      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">{t("footer.legal")}</h3>
              <ul className="space-y-2.5">
                <li>
                  <a href="/politique-confidentialite" className="text-foreground/50 hover:text-primary transition-colors text-sm">{t("footer.privacy")}</a>
                </li>
                <li>
                  <a href="/mentions-legales" className="text-foreground/50 hover:text-primary transition-colors text-sm">{t("footer.legal.terms")}</a>
                </li>
              </ul>
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">{t("footer.social")}</h3>
                <a
                  href="https://www.instagram.com/guapo_webdesigner/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-foreground/50 hover:text-primary transition-colors text-sm"
                >
                  <Instagram className="w-4 h-4" /> Instagram
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-foreground/40 text-sm">
              © 2025 <span className="shimmer-text font-semibold">GUAPO</span> Web Designer. {t("footer.rights")}
            </p>
            <div className="flex items-center gap-2 text-foreground/30 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Tous systèmes opérationnels
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
