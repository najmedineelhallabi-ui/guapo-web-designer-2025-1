"use client";

import Image from "next/image";
import {
  ArrowRight, Palette, Mail, Zap, Monitor, Tablet,
  Smartphone, Instagram, Menu, X, ShoppingCart, MessageCircle,
  Briefcase, FileText, UtensilsCrossed, ChevronDown, Layers
} from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/contexts/language-context";
import { useState, useEffect } from "react";

export default function Home() {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* ============================================================
          NAV
          ============================================================ */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/95 backdrop-blur-xl border-b border-border"
          : "bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex items-center justify-between">
          <a href="#accueil">
            <Image
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Logo-de-Guapo-Designer-Web-1762372330786.png?width=8000&height=8000&resize=contain"
              alt="GUAPO"
              width={110}
              height={55}
              className="h-10 w-auto object-contain"
              priority
            />
          </a>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { href: "#about", label: t("nav.about") },
              { href: "#portfolio", label: t("nav.portfolio") },
              { href: "#services", label: t("nav.services") },
              { href: "#contact", label: t("nav.contact") },
            ].map(({ href, label }) => (
              <a key={href} href={href} className="hover-line text-sm text-foreground/60 hover:text-foreground transition-colors duration-200 font-medium">
                {label}
              </a>
            ))}
            <div className="w-px h-4 bg-border" />
            <a href="/devis" className="btn-logo inline-flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-semibold">
              <FileText className="w-3.5 h-3.5" />
              {t("nav.quote")}
            </a>
            <LanguageSwitcher />
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-sm border border-border"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-border">
            <div className="flex flex-col px-6 py-6 gap-1">
              {[
                { href: "#about", label: t("nav.about") },
                { href: "#portfolio", label: t("nav.portfolio") },
                { href: "#services", label: t("nav.services") },
                { href: "#contact", label: t("nav.contact") },
              ].map(({ href, label }) => (
                <a key={href} href={href} className="py-3 text-sm text-foreground/70 border-b border-border/50 last:border-0" onClick={() => setMobileMenuOpen(false)}>
                  {label}
                </a>
              ))}
              <div className="pt-4 flex flex-col gap-3">
                <a href="/devis" className="btn-logo inline-flex items-center justify-center gap-2 px-5 py-3 rounded-sm text-sm font-semibold" onClick={() => setMobileMenuOpen(false)}>
                  <FileText className="w-4 h-4" />{t("nav.quote")}
                </a>
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ============================================================
          HERO
          ============================================================ */}
      <section id="accueil" className="relative min-h-screen flex items-center overflow-hidden bg-background">
        {/* Subtle grid */}
        <div className="absolute inset-0 hero-grid" />
        {/* Soft gradient orbs */}
        <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full opacity-[0.12] blur-[130px]" style={{ background: "linear-gradient(135deg,#3D2CC7,#4BBFE8)" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-[0.08] blur-[100px]" style={{ background: "#4BBFE8" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-32 pb-24 w-full">
          <div className="max-w-4xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-10">
              <span className="accent-line" />
              <span className="section-number">Web Designer — Bruxelles</span>
            </div>

            {/* Heading */}
            <h1 className="text-[clamp(2.8rem,8vw,6.5rem)] font-black leading-[0.95] tracking-tight mb-8">
              <span className="block text-foreground">{t("hero.title")}</span>
              <span className="block logo-gradient-text italic">{t("hero.title.highlight")}</span>
            </h1>

            {/* Sub */}
            <p className="text-lg text-foreground/55 max-w-xl leading-relaxed mb-12">
              {t("hero.subtitle")}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#portfolio" className="btn-logo group inline-flex items-center gap-3 px-8 py-4 rounded-sm font-semibold">
                {t("hero.cta.projects")}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-3 px-8 py-4 border border-border text-foreground/60 font-semibold rounded-sm hover:border-primary/40 hover:text-foreground transition-all"
              >
                {t("hero.cta.contact")}
              </a>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <a href="#about" className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-foreground/30 hover:text-foreground/50 transition-colors">
          <span className="text-[10px] uppercase tracking-[0.25em] font-medium">Scroll</span>
          <ChevronDown className="w-4 h-4 scroll-indicator" />
        </a>
      </section>

      {/* ============================================================
          MARQUEE BAND
          ============================================================ */}
      <div className="border-y border-border py-5 bg-white overflow-hidden">
        <div className="marquee-track">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-14 px-8 whitespace-nowrap">
              {["Web Design", "E-commerce", "Branding", "Performance", "Responsive", "UI / UX", "SEO", "Mobile First", "Multilingue"].map((item) => (
                <span key={item} className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/30">
                  <span className="w-1 h-1 rounded-full" style={{ background: "linear-gradient(135deg,#3D2CC7,#4BBFE8)" }} />
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================
          ABOUT
          ============================================================ */}
      <section id="about" className="py-32 px-6 lg:px-10 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Left */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <span className="accent-line" />
                <span className="section-number">01 — À Propos</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-8">
                {t("about.title")}
              </h2>
              <p className="text-foreground/60 leading-relaxed mb-6 text-base">
                {t("about.intro")}
              </p>
              <p className="text-foreground/45 leading-relaxed text-sm mb-10">
                {t("about.p1")}
              </p>
              {/* Values */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { title: t("about.values.passion"), desc: t("about.values.passion.desc") },
                  { title: t("about.values.innovation"), desc: t("about.values.innovation.desc") },
                  { title: t("about.values.performance"), desc: t("about.values.performance.desc") },
                  { title: t("about.values.creativity"), desc: t("about.values.creativity.desc") },
                ].map(({ title, desc }) => (
                  <div
                    key={title}
                    className="border-l-2 border-primary/25 pl-4 hover:border-primary transition-colors group cursor-default"
                  >
                    <div className="text-sm font-bold text-foreground group-hover:logo-gradient-text transition-colors mb-1">{title}</div>
                    <div className="text-xs text-foreground/40 leading-relaxed">{desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — logo framed */}
            <div className="relative flex items-center justify-center">
              <div className="relative">
                <div className="absolute -top-6 -right-6 w-full h-full rounded-sm opacity-40" style={{ border: "1px solid #4BBFE8" }} />
                <div className="absolute -top-3 -right-3 w-full h-full rounded-sm" style={{ border: "1px solid rgba(61,44,199,0.3)" }} />
                <div className="relative w-[320px] h-[320px] bg-white border border-border rounded-sm flex items-center justify-center p-12">
                  <Image
                    src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Logo-de-Guapo-Designer-Web-1762372330786.png?width=8000&height=8000&resize=contain"
                    alt="GUAPO Web Designer"
                    width={260}
                    height={260}
                    className="w-full h-full object-contain animate-float"
                  />
                </div>
                <div className="absolute -bottom-4 -left-4 px-4 py-2 text-white text-xs font-bold uppercase tracking-wider rounded-sm shadow-lg" style={{ background: "linear-gradient(135deg,#3D2CC7,#4BBFE8)" }}>
                  Bruxelles, Belgique
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          PORTFOLIO
          ============================================================ */}
      <section id="portfolio" className="py-32 px-6 lg:px-10 border-t border-border" style={{ background: "#f8f7ff" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="accent-line" />
                <span className="section-number">02 — Portfolio</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                {t("portfolio.title.prefix")}
                <span className="logo-gradient-text italic"> {t("portfolio.title.highlight")}</span>
              </h2>
            </div>
            <p className="text-foreground/50 text-sm max-w-xs leading-relaxed md:text-right">{t("portfolio.subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { href: "https://www.guapomenu.com", img: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/ChatGPT-Image-21-dec.-2025-16_40_56-1766457790930.png?width=8000&height=8000&resize=contain", name: "Guapo Menu", url: "guapomenu.com", tag: "App SaaS" },
              { href: "https://www.fiscand.business", img: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Capture-d-ecran-2025-10-24-124300-1762369451856.png?width=8000&height=8000&resize=contain", name: "Fisc & Business", url: "fiscand.business", tag: "Site Vitrine" },
              { href: "https://salarybusiness.be/", img: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/LOGO-SALARYBUSINESS-1762369466889.jpg?width=8000&height=8000&resize=contain", name: "Salary Business", url: "salarybusiness.be", tag: "Site Vitrine" },
            ].map(({ href, img, name, url, tag }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="card-shine group block border border-border rounded-sm overflow-hidden hover:border-primary/40 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="bg-white aspect-video flex items-center justify-center p-10 overflow-hidden">
                  <Image src={img} alt={name} width={400} height={225} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="bg-white p-5 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-foreground text-sm">{name}</p>
                    <p className="text-xs text-foreground/40 mt-0.5">{url}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-sm" style={{ color: "#4BBFE8", border: "1px solid rgba(75,191,232,0.3)" }}>{tag}</span>
                    <div className="w-7 h-7 border border-border rounded-sm flex items-center justify-center group-hover:border-primary/40 transition-all" style={{}}>
                      <ArrowRight className="w-3.5 h-3.5 text-foreground/40 group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          SERVICES
          ============================================================ */}
      <section id="services" className="py-32 px-6 lg:px-10 bg-white border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <span className="accent-line" />
            <span className="section-number">03 — Services</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start mb-24">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              {t("services.title")} <span className="logo-gradient-text italic">{t("services.title.highlight")}</span>
            </h2>
            <p className="text-foreground/50 leading-relaxed text-base pt-2">{t("services.subtitle")}</p>
          </div>

          {/* Capabilities list */}
          <div className="border-t border-border mb-24">
            {[
              { number: "01", icon: <Monitor className="w-4 h-4" />, title: t("services.desktop.title"), desc: t("services.desktop.desc") },
              { number: "02", icon: <Smartphone className="w-4 h-4" />, title: t("services.mobile.title"), desc: t("services.mobile.desc") },
              { number: "03", icon: <Layers className="w-4 h-4" />, title: t("services.responsive.title"), desc: t("services.responsive.desc") },
              { number: "04", icon: <Palette className="w-4 h-4" />, title: t("services.branding.title"), desc: t("services.branding.desc") },
              { number: "05", icon: <Zap className="w-4 h-4" />, title: t("services.performance.title"), desc: t("services.performance.desc") },
              { number: "06", icon: <Tablet className="w-4 h-4" />, title: t("services.tablet.title"), desc: t("services.tablet.desc") },
            ].map(({ number, icon, title, desc }) => (
              <div
                key={title}
                className="group grid grid-cols-[2.5rem_1fr_auto] md:grid-cols-[3rem_1fr_2fr_auto] gap-6 items-center border-b border-border py-6 hover:border-primary/30 transition-colors cursor-default"
              >
                <span className="text-xs font-bold font-mono" style={{ color: "#4BBFE8", opacity: 0.7 }}>{number}</span>
                <div className="flex items-center gap-3">
                  <span className="text-foreground/30 group-hover:text-primary transition-colors">{icon}</span>
                  <span className="font-bold text-foreground group-hover:text-primary transition-colors text-sm">{title}</span>
                </div>
                <p className="hidden md:block text-sm text-foreground/40 leading-relaxed">{desc}</p>
                <ArrowRight className="w-4 h-4 text-foreground/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            ))}
          </div>

          {/* Votre projet */}
          <div className="flex items-center gap-3 mb-12">
            <span className="accent-line" />
            <span className="section-number">04 — Votre projet</span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { href: "/devis", icon: <Briefcase className="w-5 h-5" />, title: t("services.website.showcase.title"), desc: t("services.website.showcase.desc"), cta: t("services.website.cta") },
              { href: "/devis", icon: <ShoppingCart className="w-5 h-5" />, title: t("services.website.ecommerce.title"), desc: t("services.website.ecommerce.desc"), cta: t("services.website.cta") },
              { href: "#contact", icon: <MessageCircle className="w-5 h-5" />, title: t("services.website.discuss.title"), desc: t("services.website.discuss.desc"), cta: t("services.website.discuss.cta") },
            ].map(({ href, icon, title, desc, cta }) => (
              <a key={title} href={href} className="card-shine group flex flex-col p-7 border border-border hover:border-primary/40 rounded-sm bg-white transition-all hover:-translate-y-1">
                <div className="w-10 h-10 border border-border rounded-sm flex items-center justify-center text-foreground/40 group-hover:text-white transition-all mb-6 group-hover:border-transparent" style={{}}>
                  <span className="group-hover:hidden">{icon}</span>
                  <span className="hidden group-hover:flex items-center justify-center w-full h-full rounded-sm" style={{ background: "linear-gradient(135deg,#3D2CC7,#4BBFE8)" }}>{icon}</span>
                </div>
                <h3 className="font-bold text-foreground text-base mb-2">{title}</h3>
                <p className="text-xs text-foreground/45 leading-relaxed mb-6 flex-grow">{desc}</p>
                <span className="text-xs font-semibold flex items-center gap-1.5 group-hover:gap-2.5 transition-all logo-gradient-text">
                  {cta} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </a>
            ))}

            {/* Guapo Menu special card */}
            <a
              href="https://www.guapomenu.com"
              target="_blank"
              rel="noopener noreferrer"
              className="card-shine group flex flex-col p-7 border border-border hover:border-primary/40 rounded-sm bg-white transition-all hover:-translate-y-1"
            >
              <div className="w-10 h-10 bg-white border border-gray-100 rounded-sm flex items-center justify-center mb-6">
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/ChatGPT-Image-21-dec.-2025-16_40_56-1766457790930.png?width=8000&height=8000&resize=contain"
                  alt="Guapo Menu"
                  width={40}
                  height={40}
                  className="w-7 h-7 object-contain"
                />
              </div>
              <h3 className="font-bold text-foreground text-base mb-2">Guapo Menu</h3>
              <p className="text-xs text-foreground/45 leading-relaxed mb-6 flex-grow">
                Menus digitaux, QR codes et gestion des commandes pour restaurants.
              </p>
              <span className="text-xs font-semibold flex items-center gap-1.5 group-hover:gap-2.5 transition-all logo-gradient-text">
                Découvrir <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================
          CONTACT
          ============================================================ */}
      <section id="contact" className="py-32 px-6 lg:px-10 relative overflow-hidden">
        {/* BG — light violet tint */}
        <div className="absolute inset-0" style={{ background: "#f8f7ff" }} />
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(61,44,199,0.2), rgba(75,191,232,0.2), transparent)" }} />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-[0.12] blur-[80px]" style={{ background: "linear-gradient(135deg,#3D2CC7,#4BBFE8)" }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <span className="accent-line" />
            <span className="section-number">05 — Contact</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-20 items-start">
            <div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-6">
                {t("contact.section.title")}
              </h2>
              <p className="text-foreground/50 leading-relaxed mb-12 max-w-md text-base">{t("contact.section.desc")}</p>
              <a href="/devis" className="btn-logo group inline-flex items-center gap-3 px-8 py-4 rounded-sm font-semibold">
                {t("nav.quote")}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            <div className="space-y-4">
              {[
                { href: "mailto:info@guapowebdesigner.com", icon: <Mail className="w-5 h-5" />, label: t("contact.email.title"), value: "info@guapowebdesigner.com" },
                { href: "https://www.instagram.com/guapo_webdesigner/", icon: <Instagram className="w-5 h-5" />, label: t("contact.instagram.title"), value: "@guapo_webdesigner", external: true },
              ].map(({ href, icon, label, value, external }) => (
                <a
                  key={label}
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="card-shine group flex items-center gap-5 p-6 border border-border hover:border-primary/40 rounded-sm transition-all bg-white"
                >
                  <div className="w-11 h-11 border border-border rounded-sm flex items-center justify-center text-foreground/40 group-hover:text-white group-hover:border-transparent transition-all shrink-0 relative">
                    <span className="group-hover:hidden">{icon}</span>
                    <span className="hidden group-hover:flex absolute inset-0 items-center justify-center rounded-sm" style={{ background: "linear-gradient(135deg,#3D2CC7,#4BBFE8)" }}>{icon}</span>
                  </div>
                  <div>
                    <div className="text-xs text-foreground/40 uppercase tracking-wider mb-0.5">{label}</div>
                    <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{value}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-foreground/20 group-hover:text-primary ml-auto group-hover:translate-x-1 transition-all" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          FOOTER
          ============================================================ */}
      <footer className="py-12 px-6 lg:px-10 border-t border-border bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Image
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Logo-de-Guapo-Designer-Web-1762372330786.png?width=8000&height=8000&resize=contain"
            alt="GUAPO"
            width={100}
            height={45}
            className="h-8 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity"
          />

          <div className="flex items-center gap-8">
            {[
              { href: "/politique-confidentialite", label: t("footer.privacy") },
              { href: "/mentions-legales", label: t("footer.legal.terms") },
              { href: "https://www.instagram.com/guapo_webdesigner/", label: "Instagram", external: true },
            ].map(({ href, label, external }) => (
              <a
                key={label}
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="text-xs text-foreground/35 hover:text-foreground/70 transition-colors uppercase tracking-wider"
              >
                {label}
              </a>
            ))}
          </div>

          <p className="text-xs text-foreground/30 uppercase tracking-wider">
            © 2025 GUAPO — {t("footer.rights")}
          </p>
        </div>
      </footer>
    </div>
  );
}
