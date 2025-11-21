"use client";

import { Monitor, Tablet, Smartphone, Palette, Zap, Sparkles, ShoppingCart, MessageCircle, Briefcase, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ServicesPage() {
  const { t } = useLanguage();

  const services = [
    {
      icon: Monitor,
      titleKey: "services.desktop.title",
      descKey: "services.desktop.desc",
      gradient: "from-[#6C63FF] to-[#5A3BEF]",
      rotation: 2
    },
    {
      icon: Tablet,
      titleKey: "services.tablet.title",
      descKey: "services.tablet.desc",
      gradient: "from-[#5A3BEF] to-[#4B2FD9]",
      rotation: -2
    },
    {
      icon: Smartphone,
      titleKey: "services.mobile.title",
      descKey: "services.mobile.desc",
      gradient: "from-[#4BE3C1] to-[#00D1FF]",
      rotation: 2
    },
    {
      icon: Monitor,
      titleKey: "services.responsive.title",
      descKey: "services.responsive.desc",
      gradient: "from-[#00D1FF] to-[#4BE3C1]",
      rotation: -2
    },
    {
      icon: Palette,
      titleKey: "services.branding.title",
      descKey: "services.branding.desc",
      gradient: "from-[#6C63FF] to-[#4BE3C1]",
      rotation: 2
    },
    {
      icon: Zap,
      titleKey: "services.performance.title",
      descKey: "services.performance.desc",
      gradient: "from-[#4B2FD9] to-[#00D1FF]",
      rotation: -2
    }
  ];

  const siteTypes = [
    {
      icon: Briefcase,
      title: "Site Vitrine",
      description: "Un site élégant pour présenter votre entreprise, vos services et votre expertise professionnelle.",
      gradient: "from-[#6C63FF] to-[#5A3BEF]",
      href: "/devis"
    },
    {
      icon: ShoppingCart,
      title: "Site E-commerce",
      description: "Une boutique en ligne complète pour vendre vos produits avec paiement sécurisé et gestion des commandes.",
      gradient: "from-[#4BE3C1] to-[#00D1FF]",
      href: "/devis"
    },
    {
      icon: MessageCircle,
      title: "Discutons Ensemble",
      description: "Vous avez un projet spécifique ? Parlons-en et créons ensemble la solution parfaite pour vos besoins.",
      gradient: "from-[#5A3BEF] to-[#4BE3C1]",
      href: "/devis"
    }
  ];

  const handleScrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/#contact";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-[#6C63FF]/20 via-[#4BE3C1]/15 to-[#00D1FF]/20 relative overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Mobile circles */}
          <div className="md:hidden absolute top-20 left-5 w-56 h-56 bg-[#6C63FF]/40 rounded-full blur-md"></div>
          <div className="md:hidden absolute bottom-10 right-5 w-64 h-64 bg-[#4BE3C1]/40 rounded-full blur-md"></div>
          <div className="md:hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-[#00D1FF]/30 rounded-full blur-md"></div>
          
          {/* Tablet circles */}
          <div className="hidden md:block lg:hidden absolute top-20 left-10 w-64 h-64 bg-[#6C63FF]/30 rounded-full blur-2xl"></div>
          <div className="hidden md:block lg:hidden absolute bottom-10 right-10 w-80 h-80 bg-[#4BE3C1]/30 rounded-full blur-2xl"></div>
          <div className="hidden md:block lg:hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#00D1FF]/20 rounded-full blur-2xl"></div>
          
          {/* Desktop circles */}
          <div className="hidden lg:block absolute top-20 left-10 w-72 h-72 bg-[#6C63FF]/30 rounded-full blur-2xl"></div>
          <div className="hidden lg:block absolute bottom-10 right-10 w-96 h-96 bg-[#4BE3C1]/30 rounded-full blur-2xl"></div>
          <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#00D1FF]/20 rounded-full blur-2xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-8">
              <Sparkles className="w-10 h-10 text-[#4BE3C1] animate-pulse" />
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#6C63FF] via-[#4BE3C1] to-[#00D1FF] bg-clip-text text-transparent">
                {t("services.page.title")}
              </h1>
              <Sparkles className="w-10 h-10 text-[#00D1FF] animate-pulse" style={{ animationDelay: "0.5s" }} />
            </div>
          </div>
        </div>
      </section>

      {/* Site Types Section */}
      <section className="py-20 px-6 bg-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          {/* Mobile circles */}
          <div className="md:hidden absolute top-20 left-5 w-64 h-64 bg-[#6C63FF]/30 rounded-full blur-md"></div>
          <div className="md:hidden absolute bottom-10 right-5 w-56 h-56 bg-[#4BE3C1]/30 rounded-full blur-md"></div>
          
          {/* Tablet circles */}
          <div className="hidden md:block lg:hidden absolute top-20 left-10 w-80 h-80 bg-[#6C63FF]/20 rounded-full blur-2xl"></div>
          <div className="hidden md:block lg:hidden absolute bottom-10 right-10 w-72 h-72 bg-[#4BE3C1]/20 rounded-full blur-2xl"></div>
          
          {/* Desktop circles */}
          <div className="hidden lg:block absolute top-20 left-20 w-96 h-96 bg-[#6C63FF]/20 rounded-full blur-2xl"></div>
          <div className="hidden lg:block absolute bottom-20 right-20 w-80 h-80 bg-[#4BE3C1]/20 rounded-full blur-2xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Besoin d'un <span className="bg-gradient-to-r from-[#6C63FF] to-[#00D1FF] bg-clip-text text-transparent">Site Web ?</span>
            </h2>
            <p className="text-gray-700 text-lg max-w-2xl mx-auto">
              Choisissez le type de site qui correspond à vos besoins et obtenez un devis personnalisé gratuit
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {siteTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative"
                >
                  <Link href={type.href}>
                    <div className="h-full p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white backdrop-blur-sm border-2 border-[#00D1FF]/30 shadow-lg hover:shadow-2xl hover:shadow-[#00D1FF]/30 hover:scale-105 hover:-translate-y-2 transition-all duration-300">
                      {/* Icon */}
                      <div className={`w-16 h-16 rounded-xl mb-6 flex items-center justify-center shadow-lg bg-gradient-to-br ${type.gradient}`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>

                      {/* Title */}
                      <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-[#6C63FF] transition-colors">
                        {type.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-700 leading-relaxed mb-6">
                        {type.description}
                      </p>

                      {/* CTA */}
                      <div className="flex items-center gap-2 text-[#00D1FF] font-semibold group-hover:gap-4 transition-all">
                        <span>Obtenir un devis</span>
                        <ArrowRight className="w-5 h-5" />
                      </div>

                      {/* Glow effect */}
                      <div className="absolute inset-0 rounded-2xl border-2 border-[#6C63FF]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-6 relative overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Mobile circles */}
          <div className="md:hidden absolute top-10 right-5 w-48 h-48 bg-[#5A3BEF]/30 rounded-full blur-md"></div>
          <div className="md:hidden absolute bottom-10 left-5 w-56 h-56 bg-[#4BE3C1]/30 rounded-full blur-md"></div>
          
          {/* Tablet circles */}
          <div className="hidden md:block lg:hidden absolute top-10 right-10 w-56 h-56 bg-[#5A3BEF]/20 rounded-full blur-2xl"></div>
          <div className="hidden md:block lg:hidden absolute bottom-10 left-10 w-72 h-72 bg-[#4BE3C1]/20 rounded-full blur-2xl"></div>
          
          {/* Desktop circles */}
          <div className="hidden lg:block absolute top-10 right-20 w-64 h-64 bg-[#5A3BEF]/20 rounded-full blur-2xl"></div>
          <div className="hidden lg:block absolute bottom-20 left-10 w-80 h-80 bg-[#4BE3C1]/20 rounded-full blur-2xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -10,
                    rotate: service.rotation
                  }}
                  className="group relative p-8 rounded-2xl bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm border-2 border-[#00D1FF]/40 shadow-lg hover:shadow-2xl hover:shadow-[#00D1FF]/30 transition-all duration-300"
                >
                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#6C63FF]/20 to-[#4BE3C1]/20 rounded-bl-full blur-xl"></div>
                  
                  {/* Icon container */}
                  <div className={`relative w-16 h-16 rounded-xl mb-6 flex items-center justify-center shadow-lg bg-gradient-to-br ${service.gradient} group-hover:rotate-6 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-[#6C63FF] to-[#00D1FF] bg-clip-text text-transparent">
                    {t(service.titleKey)}
                  </h3>
                  <p className="text-foreground/70 leading-relaxed">
                    {t(service.descKey)}
                  </p>

                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#6C63FF]/20 via-[#5A3BEF]/15 to-[#4BE3C1]/20 relative overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Mobile circles */}
          <div className="md:hidden absolute top-10 left-5 w-56 h-56 bg-[#6C63FF]/40 rounded-full blur-md"></div>
          <div className="md:hidden absolute bottom-10 right-5 w-64 h-64 bg-[#00D1FF]/40 rounded-full blur-md"></div>
          
          {/* Tablet circles */}
          <div className="hidden md:block lg:hidden absolute top-10 left-10 w-64 h-64 bg-[#6C63FF]/30 rounded-full blur-2xl"></div>
          <div className="hidden md:block lg:hidden absolute bottom-10 right-10 w-72 h-72 bg-[#00D1FF]/30 rounded-full blur-2xl"></div>
          
          {/* Desktop circles */}
          <div className="hidden lg:block absolute top-10 left-1/4 w-72 h-72 bg-[#6C63FF]/30 rounded-full blur-2xl"></div>
          <div className="hidden lg:block absolute bottom-10 right-1/4 w-80 h-80 bg-[#00D1FF]/30 rounded-full blur-2xl"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="p-12 rounded-3xl bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm border-2 border-[#00D1FF]/40 shadow-2xl shadow-[#00D1FF]/20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#6C63FF] via-[#4BE3C1] to-[#00D1FF] bg-clip-text text-transparent">
              {t("services.cta.title")}
            </h2>
            <p className="text-xl text-foreground/80 mb-8 leading-relaxed">
              {t("services.cta.desc")}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleScrollToContact}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#6C63FF] to-[#00D1FF] text-white rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-[#6C63FF]/30 text-lg font-semibold"
            >
              {t("services.cta.button")}
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}