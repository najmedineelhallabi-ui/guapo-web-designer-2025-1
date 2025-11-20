'use client';

import { useActionState, useEffect, useState } from 'react';
import { sendQuoteAction, QuoteFormState } from '@/app/actions/sendQuote';
import { Mail, User, Briefcase, Calendar, MessageSquare, Send, CheckCircle, AlertCircle, Globe, Server, CheckSquare, Shield, Palette, Zap, Lock, Wrench, Building, ShoppingCart, Edit2 } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import Link from 'next/link';

export function QuoteForm() {
  const { t } = useLanguage();
  const [state, formAction, isPending] = useActionState<QuoteFormState, FormData>(
    sendQuoteAction,
    {}
  );
  const [isEcommerce, setIsEcommerce] = useState(false);
  const [isQuoteFormSelected, setIsQuoteFormSelected] = useState(false);
  const [isMultilingualSelected, setIsMultilingualSelected] = useState(false);
  const [selectedSiteType, setSelectedSiteType] = useState<string>('');
  const [allInclusiveOptimization, setAllInclusiveOptimization] = useState(false);

  useEffect(() => {
    if (state.success) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [state.success]);

  const handleSiteTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIsEcommerce(value === "Site e-commerce");
    setSelectedSiteType(value);
  };

  const handleResetSiteType = () => {
    setSelectedSiteType('');
    setIsEcommerce(false);
  };

  const handleQuoteFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsQuoteFormSelected(e.target.checked);
  };

  const handleMultilingualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsMultilingualSelected(e.target.checked);
  };

  const handleAllInclusiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAllInclusiveOptimization(e.target.checked);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form action={formAction} className="space-y-8">
        {/* Success message */}
        {state.success && (
          <div className="bg-gradient-to-r from-primary/20 to-secondary/20 border-2 border-primary/50 text-foreground px-6 py-4 rounded-xl flex items-start gap-3 animate-fade-in shadow-lg">
            <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-lg">{t('quote.success.title')}</p>
              <p className="text-sm text-foreground/80 mt-1">{state.message}</p>
            </div>
          </div>
        )}

        {/* Error message */}
        {state.success === false && !state.errors && (
          <div className="bg-red-50 border-2 border-red-200 text-red-800 px-6 py-4 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
            <p>{state.message}</p>
          </div>
        )}

        {/* Informations */}
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/30 rounded-xl p-6">
          <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
            <User className="w-6 h-6 text-primary" />
            {t('quote.info.title')}
          </h3>
          
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                  {t('quote.info.firstName')} *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  defaultValue={state.formData?.firstName || ''}
                  className="w-full px-4 py-3 bg-card/50 backdrop-blur-sm border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder={t('quote.info.firstNamePlaceholder')}
                  disabled={isPending}
                />
                {state.errors?.firstName && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {state.errors.firstName[0]}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                  {t('quote.info.lastName')} *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  defaultValue={state.formData?.lastName || ''}
                  className="w-full px-4 py-3 bg-card/50 backdrop-blur-sm border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder={t('quote.info.lastNamePlaceholder')}
                  disabled={isPending}
                />
                {state.errors?.lastName && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {state.errors.lastName[0]}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                <Mail className="w-4 h-4 text-primary" />
                {t('quote.info.email')} *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                defaultValue={state.formData?.email || ''}
                className="w-full px-4 py-3 bg-card/50 backdrop-blur-sm border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                placeholder={t('quote.info.emailPlaceholder')}
                disabled={isPending}
              />
              {state.errors?.email && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {state.errors.email[0]}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="company" className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                <Building className="w-4 h-4 text-primary" />
                {t('quote.info.company')} *
              </label>
              <input
                type="text"
                id="company"
                name="company"
                required
                defaultValue={state.formData?.company || ''}
                className="w-full px-4 py-3 bg-card/50 backdrop-blur-sm border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                placeholder={t('quote.info.companyPlaceholder')}
                disabled={isPending}
              />
              {state.errors?.company && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {state.errors.company[0]}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="sector" className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                <Briefcase className="w-4 h-4 text-primary" />
                {t('quote.info.sector')}
              </label>
              <input
                type="text"
                id="sector"
                name="sector"
                defaultValue={state.formData?.sector || ''}
                className="w-full px-4 py-3 bg-card/50 backdrop-blur-sm border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                placeholder={t('quote.info.sectorPlaceholder')}
                disabled={isPending}
              />
            </div>
          </div>
        </div>

        {/* Type de Site */}
        <div className="bg-gradient-to-br from-secondary/10 to-accent/10 border-2 border-secondary/30 rounded-xl p-6">
          <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Globe className="w-6 h-6 text-secondary" />
            {t('quote.siteType.title')}
          </h3>
          
          {!selectedSiteType ? (
            // Show all options when nothing is selected
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-4 border-2 border-border rounded-lg hover:border-secondary/50 hover:bg-secondary/5 cursor-pointer transition-all group">
                <input
                  type="radio"
                  name="siteType"
                  value="Site vitrine simple (1 à 3 pages)"
                  required
                  onChange={handleSiteTypeChange}
                  className="w-5 h-5 mt-0.5 text-secondary focus:ring-2 focus:ring-secondary cursor-pointer"
                  disabled={isPending}
                />
                <div>
                  <span className="font-semibold text-foreground group-hover:text-secondary transition-colors">{t('quote.siteType.simple')}</span>
                  <p className="text-sm text-foreground/70 mt-1">{t('quote.siteType.simpleDesc')}</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border-2 border-border rounded-lg hover:border-secondary/50 hover:bg-secondary/5 cursor-pointer transition-all group">
                <input
                  type="radio"
                  name="siteType"
                  value="Site vitrine standard (4 à 5 pages)"
                  onChange={handleSiteTypeChange}
                  className="w-5 h-5 mt-0.5 text-secondary focus:ring-2 focus:ring-secondary cursor-pointer"
                  disabled={isPending}
                />
                <div>
                  <span className="font-semibold text-foreground group-hover:text-secondary transition-colors">{t('quote.siteType.standard')}</span>
                  <p className="text-sm text-foreground/70 mt-1">{t('quote.siteType.standardDesc')}</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border-2 border-border rounded-lg hover:border-secondary/50 hover:bg-secondary/5 cursor-pointer transition-all group">
                <input
                  type="radio"
                  name="siteType"
                  value="Site vitrine avancé (6 à 8 pages)"
                  onChange={handleSiteTypeChange}
                  className="w-5 h-5 mt-0.5 text-secondary focus:ring-2 focus:ring-secondary cursor-pointer"
                  disabled={isPending}
                />
                <div>
                  <span className="font-semibold text-foreground group-hover:text-secondary transition-colors">{t('quote.siteType.advanced')}</span>
                  <p className="text-sm text-foreground/70 mt-1">{t('quote.siteType.advancedDesc')}</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border-2 border-border rounded-lg hover:border-secondary/50 hover:bg-secondary/5 cursor-pointer transition-all group">
                <input
                  type="radio"
                  name="siteType"
                  value="Site vitrine premium (9 à 12 pages)"
                  onChange={handleSiteTypeChange}
                  className="w-5 h-5 mt-0.5 text-secondary focus:ring-2 focus:ring-secondary cursor-pointer"
                  disabled={isPending}
                />
                <div>
                  <span className="font-semibold text-foreground group-hover:text-secondary transition-colors">{t('quote.siteType.premium')}</span>
                  <p className="text-sm text-foreground/70 mt-1">{t('quote.siteType.premiumDesc')}</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border-2 border-border rounded-lg hover:border-secondary/50 hover:bg-secondary/5 cursor-pointer transition-all group">
                <input
                  type="radio"
                  name="siteType"
                  value="Portfolio / site personnel"
                  onChange={handleSiteTypeChange}
                  className="w-5 h-5 mt-0.5 text-secondary focus:ring-2 focus:ring-secondary cursor-pointer"
                  disabled={isPending}
                />
                <div>
                  <span className="font-semibold text-foreground group-hover:text-secondary transition-colors">{t('quote.siteType.portfolio')}</span>
                  <p className="text-sm text-foreground/70 mt-1">{t('quote.siteType.portfolioDesc')}</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border-2 border-border rounded-lg hover:border-secondary/50 hover:bg-secondary/5 cursor-pointer transition-all group">
                <input
                  type="radio"
                  name="siteType"
                  value="Site e-commerce"
                  onChange={handleSiteTypeChange}
                  className="w-5 h-5 mt-0.5 text-secondary focus:ring-2 focus:ring-secondary cursor-pointer"
                  disabled={isPending}
                />
                <div className="flex items-start gap-2">
                  <ShoppingCart className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-foreground group-hover:text-secondary transition-colors">{t('quote.siteType.ecommerce')}</span>
                    <p className="text-sm text-foreground/70 mt-1">{t('quote.siteType.ecommerceDesc')}</p>
                  </div>
                </div>
              </label>
            </div>
          ) : (
            // Show only selected option with change button
            <div className="space-y-4 animate-fade-in">
              <div className="p-5 bg-gradient-to-r from-secondary/20 to-accent/20 border-2 border-secondary/50 rounded-xl">
                <input type="hidden" name="siteType" value={selectedSiteType} />
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-foreground/70">Type sélectionné :</span>
                  <button
                    type="button"
                    onClick={handleResetSiteType}
                    disabled={isPending}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-card/50 hover:bg-card border border-border rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Modifier
                  </button>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-secondary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-lg text-foreground">{selectedSiteType}</p>
                    {selectedSiteType === "Site vitrine simple (1 à 3 pages)" && (
                      <p className="text-sm text-foreground/70 mt-1">{t('quote.siteType.simpleDesc')}</p>
                    )}
                    {selectedSiteType === "Site vitrine standard (4 à 5 pages)" && (
                      <p className="text-sm text-foreground/70 mt-1">{t('quote.siteType.standardDesc')}</p>
                    )}
                    {selectedSiteType === "Site vitrine avancé (6 à 8 pages)" && (
                      <p className="text-sm text-foreground/70 mt-1">{t('quote.siteType.advancedDesc')}</p>
                    )}
                    {selectedSiteType === "Site vitrine premium (9 à 12 pages)" && (
                      <p className="text-sm text-foreground/70 mt-1">{t('quote.siteType.premiumDesc')}</p>
                    )}
                    {selectedSiteType === "Portfolio / site personnel" && (
                      <p className="text-sm text-foreground/70 mt-1">{t('quote.siteType.portfolioDesc')}</p>
                    )}
                    {selectedSiteType === "Site e-commerce" && (
                      <p className="text-sm text-foreground/70 mt-1 flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4" />
                        {t('quote.siteType.ecommerceDesc')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {state.errors?.siteType && (
            <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {state.errors.siteType[0]}
            </p>
          )}
        </div>

        {/* Design & Contenu */}
        <div className="bg-gradient-to-br from-accent/10 to-primary/10 border-2 border-accent/30 rounded-xl p-6">
          <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Palette className="w-6 h-6 text-accent" />
            {t('quote.design.title')}
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-accent/5 border border-accent/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
              <span className="text-foreground/90">{t('quote.design.custom')}</span>
            </div>

            <div className="flex items-center gap-3 p-4 bg-accent/5 border border-accent/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
              <span className="text-foreground/90">{t('quote.design.responsive')}</span>
            </div>
          </div>
        </div>

        {/* Fonctionnalités / Modules */}
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/30 rounded-xl p-6">
          <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Zap className="w-6 h-6 text-primary" />
            {t('quote.features.title')}
          </h3>
          
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-primary/5 transition-colors">
              <input
                type="checkbox"
                name="features"
                value="Formulaire de contact simple"
                defaultChecked={state.formData?.features?.includes("Formulaire de contact simple")}
                className="w-5 h-5 rounded border-2 border-border text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                disabled={isPending}
              />
              <span className="text-foreground/90 group-hover:text-foreground transition-colors">
                {t('quote.features.contactForm')}
              </span>
            </label>

            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-primary/5 transition-colors">
                <input
                  type="checkbox"
                  name="features"
                  value="Formulaire de demande de devis"
                  defaultChecked={state.formData?.features?.includes("Formulaire de demande de devis")}
                  onChange={handleQuoteFormChange}
                  className="w-5 h-5 rounded border-2 border-border text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                  disabled={isPending}
                />
                <span className="text-foreground/90 group-hover:text-foreground transition-colors">
                  {t('quote.features.quoteForm')}
                </span>
              </label>

              {/* Sub-option: Auto emails for quote form */}
              {isQuoteFormSelected && (
                <div className="ml-11 animate-fade-in">
                  <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-primary/5 transition-colors bg-primary/5 border border-primary/20">
                    <input
                      type="checkbox"
                      name="features"
                      value="Envoi automatique d'emails de confirmation (pour devis)"
                      defaultChecked={state.formData?.features?.includes("Envoi automatique d'emails de confirmation (pour devis)")}
                      className="w-5 h-5 rounded border-2 border-border text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                      disabled={isPending}
                    />
                    <span className="text-foreground/90 group-hover:text-foreground transition-colors text-sm">
                      {t('quote.features.autoEmailsQuote')}
                    </span>
                  </label>
                </div>
              )}
            </div>

            <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-primary/5 transition-colors">
              <input
                type="checkbox"
                name="features"
                value="Système de prise de rendez-vous en ligne (avec emails automatiques)"
                defaultChecked={state.formData?.features?.includes("Système de prise de rendez-vous en ligne (avec emails automatiques)")}
                className="w-5 h-5 rounded border-2 border-border text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                disabled={isPending}
              />
              <span className="text-foreground/90 group-hover:text-foreground transition-colors">
                {t('quote.features.booking')}
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-primary/5 transition-colors">
              <input
                type="checkbox"
                name="features"
                value="Intégration calendrier (Google Calendar, etc.)"
                defaultChecked={state.formData?.features?.includes("Intégration calendrier (Google Calendar, etc.)")}
                className="w-5 h-5 rounded border-2 border-border text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                disabled={isPending}
              />
              <span className="text-foreground/90 group-hover:text-foreground transition-colors">
                {t('quote.features.calendar')}
              </span>
            </label>

            {/* Multilingue with language selection */}
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-primary/5 transition-colors">
                <input
                  type="checkbox"
                  name="features"
                  value="Multilingue"
                  defaultChecked={state.formData?.features?.includes("Multilingue")}
                  onChange={handleMultilingualChange}
                  className="w-5 h-5 rounded border-2 border-border text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                  disabled={isPending}
                />
                <span className="text-foreground/90 group-hover:text-foreground transition-colors">
                  {t('quote.features.multilingual')}
                </span>
              </label>

              {/* Language selection - appears when Multilingue is checked */}
              {isMultilingualSelected && (
                <div className="ml-11 animate-fade-in space-y-2">
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <p className="text-sm font-semibold text-foreground/80 mb-3 flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      {t('quote.features.selectLanguages')}
                    </p>
                    
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 cursor-pointer group p-2 rounded hover:bg-primary/5 transition-colors">
                        <input
                          type="checkbox"
                          name="languages"
                          value="Français (FR)"
                          defaultChecked={state.formData?.languages?.includes("Français (FR)")}
                          className="w-4 h-4 rounded border-2 border-border text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                          disabled={isPending}
                        />
                        <span className="text-sm text-foreground/90">Français (FR)</span>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer group p-2 rounded hover:bg-primary/5 transition-colors">
                        <input
                          type="checkbox"
                          name="languages"
                          value="Nederlands (NL)"
                          defaultChecked={state.formData?.languages?.includes("Nederlands (NL)")}
                          className="w-4 h-4 rounded border-2 border-border text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                          disabled={isPending}
                        />
                        <span className="text-sm text-foreground/90">Nederlands (NL)</span>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer group p-2 rounded hover:bg-primary/5 transition-colors">
                        <input
                          type="checkbox"
                          name="languages"
                          value="English (ENG)"
                          defaultChecked={state.formData?.languages?.includes("English (ENG)")}
                          className="w-4 h-4 rounded border-2 border-border text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                          disabled={isPending}
                        />
                        <span className="text-sm text-foreground/90">English (ENG)</span>
                      </label>

                      {/* Other language option with text field */}
                      <div className="space-y-2 pt-2 border-t border-border/50">
                        <label className="flex items-center gap-3 cursor-pointer group p-2 rounded hover:bg-primary/5 transition-colors">
                          <input
                            type="checkbox"
                            name="languages"
                            value="Autre"
                            defaultChecked={state.formData?.languages?.includes("Autre")}
                            className="w-4 h-4 rounded border-2 border-border text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                            disabled={isPending}
                          />
                          <span className="text-sm text-foreground/90">{t('quote.features.otherLanguage')}</span>
                        </label>
                        
                        <input
                          type="text"
                          name="otherLanguages"
                          placeholder={t('quote.features.otherLanguagePlaceholder')}
                          defaultValue={state.formData?.otherLanguages || ''}
                          className="w-full px-3 py-2 bg-card/50 backdrop-blur-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm"
                          disabled={isPending}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* E-commerce Features - Only show when e-commerce is selected */}
            {isEcommerce && (
              <div className="pt-3 mt-3 border-t border-border animate-fade-in">
                <p className="text-sm font-semibold text-foreground/70 mb-3 flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Fonctionnalités E-commerce
                </p>
                
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-secondary/5 transition-colors">
                    <input
                      type="checkbox"
                      name="features"
                      value="Catalogue de produits"
                      defaultChecked={state.formData?.features?.includes("Catalogue de produits")}
                      className="w-5 h-5 rounded border-2 border-border text-secondary focus:ring-2 focus:ring-secondary cursor-pointer"
                      disabled={isPending}
                    />
                    <span className="text-foreground/90 group-hover:text-foreground transition-colors">
                      {t('quote.features.productCatalog')}
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-secondary/5 transition-colors">
                    <input
                      type="checkbox"
                      name="features"
                      value="Panier d'achat"
                      defaultChecked={state.formData?.features?.includes("Panier d'achat")}
                      className="w-5 h-5 rounded border-2 border-border text-secondary focus:ring-2 focus:ring-secondary cursor-pointer"
                      disabled={isPending}
                    />
                    <span className="text-foreground/90 group-hover:text-foreground transition-colors">
                      {t('quote.features.shoppingCart')}
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-secondary/5 transition-colors">
                    <input
                      type="checkbox"
                      name="features"
                      value="Passerelle de paiement (Stripe, PayPal, etc.)"
                      defaultChecked={state.formData?.features?.includes("Passerelle de paiement (Stripe, PayPal, etc.)")}
                      className="w-5 h-5 rounded border-2 border-border text-secondary focus:ring-2 focus:ring-secondary cursor-pointer"
                      disabled={isPending}
                    />
                    <span className="text-foreground/90 group-hover:text-foreground transition-colors">
                      {t('quote.features.paymentGateway')}
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-secondary/5 transition-colors">
                    <input
                      type="checkbox"
                      name="features"
                      value="Gestion des commandes"
                      defaultChecked={state.formData?.features?.includes("Gestion des commandes")}
                      className="w-5 h-5 rounded border-2 border-border text-secondary focus:ring-2 focus:ring-secondary cursor-pointer"
                      disabled={isPending}
                    />
                    <span className="text-foreground/90 group-hover:text-foreground transition-colors">
                      {t('quote.features.orderManagement')}
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-secondary/5 transition-colors">
                    <input
                      type="checkbox"
                      name="features"
                      value="Gestion des stocks"
                      defaultChecked={state.formData?.features?.includes("Gestion des stocks")}
                      className="w-5 h-5 rounded border-2 border-border text-secondary focus:ring-2 focus:ring-secondary cursor-pointer"
                      disabled={isPending}
                    />
                    <span className="text-foreground/90 group-hover:text-foreground transition-colors">
                      {t('quote.features.inventoryManagement')}
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-secondary/5 transition-colors">
                    <input
                      type="checkbox"
                      name="features"
                      value="Comptes clients"
                      defaultChecked={state.formData?.features?.includes("Comptes clients")}
                      className="w-5 h-5 rounded border-2 border-border text-secondary focus:ring-2 focus:ring-secondary cursor-pointer"
                      disabled={isPending}
                    />
                    <span className="text-foreground/90 group-hover:text-foreground transition-colors">
                      {t('quote.features.customerAccounts')}
                    </span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Optimisation & Sécurité */}
        <div className="bg-gradient-to-br from-secondary/10 to-accent/10 border-2 border-secondary/30 rounded-xl p-6">
          <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Lock className="w-6 h-6 text-secondary" />
            {t('quote.optimization.title')}
          </h3>
          
          <div className="space-y-4">
            {/* Pack Tout Inclus - RECOMMANDÉ */}
            <div className="relative">
              <div className="absolute -top-3 left-4 z-10">
                <span className="px-3 py-1 bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold rounded-full shadow-lg">
                  ⭐ RECOMMANDÉ
                </span>
              </div>
              <label className="flex items-start gap-3 cursor-pointer group p-5 rounded-xl border-2 border-primary/50 bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/15 hover:to-secondary/15 transition-all">
                <input
                  type="checkbox"
                  name="optimization"
                  value="Pack Tout Inclus (SEO + Performance + SSL + RGPD)"
                  checked={allInclusiveOptimization}
                  onChange={handleAllInclusiveChange}
                  className="w-6 h-6 mt-0.5 rounded border-2 border-primary text-primary focus:ring-2 focus:ring-primary cursor-pointer flex-shrink-0"
                  disabled={isPending}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-primary" />
                    <span className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                      Pack Tout Inclus
                    </span>
                  </div>
                  <p className="text-sm text-foreground/80 mb-3">
                    Inclut toutes les optimisations essentielles pour un site professionnel et performant
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 text-sm text-foreground/70">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>SEO de base</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-foreground/70">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>Optimisation vitesse</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-foreground/70">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>Certificat SSL/HTTPS</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-foreground/70">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>Conformité RGPD</span>
                    </div>
                  </div>
                </div>
              </label>
            </div>

            {/* Divider */}
            {!allInclusiveOptimization && (
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-3 py-1 text-foreground/60 rounded-full border border-border">
                    ou choisissez individuellement
                  </span>
                </div>
              </div>
            )}

            {/* Individual Options - Disabled when all-inclusive is selected */}
            <div className={`space-y-3 ${allInclusiveOptimization ? 'opacity-40 pointer-events-none' : ''}`}>
              <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-secondary/5 transition-colors">
                <input
                  type="checkbox"
                  name="optimization"
                  value="SEO de base (balises, titres, URLs)"
                  defaultChecked={state.formData?.optimization?.includes("SEO de base (balises, titres, URLs)")}
                  disabled={allInclusiveOptimization || isPending}
                  className="w-5 h-5 rounded border-2 border-border text-secondary focus:ring-2 focus:ring-secondary cursor-pointer"
                />
                <span className="text-foreground/90 group-hover:text-foreground transition-colors">
                  {t('quote.optimization.seo')}
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-secondary/5 transition-colors">
                <input
                  type="checkbox"
                  name="optimization"
                  value="Optimisation vitesse / performance"
                  defaultChecked={state.formData?.optimization?.includes("Optimisation vitesse / performance")}
                  disabled={allInclusiveOptimization || isPending}
                  className="w-5 h-5 rounded border-2 border-border text-secondary focus:ring-2 focus:ring-secondary cursor-pointer"
                />
                <span className="text-foreground/90 group-hover:text-foreground transition-colors">
                  {t('quote.optimization.performance')}
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-secondary/5 transition-colors">
                <input
                  type="checkbox"
                  name="optimization"
                  value="Certificat SSL / HTTPS"
                  defaultChecked={state.formData?.optimization?.includes("Certificat SSL / HTTPS")}
                  disabled={allInclusiveOptimization || isPending}
                  className="w-5 h-5 rounded border-2 border-border text-secondary focus:ring-2 focus:ring-secondary cursor-pointer"
                />
                <span className="text-foreground/90 group-hover:text-foreground transition-colors">
                  {t('quote.optimization.ssl')}
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-secondary/5 transition-colors">
                <input
                  type="checkbox"
                  name="optimization"
                  value="RGPD / conformité légale"
                  defaultChecked={state.formData?.optimization?.includes("RGPD / conformité légale")}
                  disabled={allInclusiveOptimization || isPending}
                  className="w-5 h-5 rounded border-2 border-border text-secondary focus:ring-2 focus:ring-secondary cursor-pointer"
                />
                <span className="text-foreground/90 group-hover:text-foreground transition-colors">
                  {t('quote.optimization.gdpr')}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Hébergement */}
        <div className="bg-gradient-to-br from-accent/10 to-primary/10 border-2 border-accent/30 rounded-xl p-6">
          <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Wrench className="w-6 h-6 text-accent" />
            {t('quote.hosting.title')}
          </h3>
          
          <div className="space-y-4">
            {/* Hébergement - Always included, no choice */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                <Server className="w-4 h-4 text-accent" />
                {t('quote.hosting.hosting')}
              </label>
              <input type="hidden" name="hosting" value="Inclus dans le projet" />
              <div className="flex items-center gap-3 p-4 bg-accent/10 border-2 border-accent/40 rounded-lg">
                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-foreground font-semibold">{t('quote.hosting.included')}</span>
              </div>
              <p className="text-sm text-foreground/70 mt-2">
                L'hébergement est automatiquement inclus dans votre projet.
              </p>
            </div>

            <div>
              <label htmlFor="domain" className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                <Globe className="w-4 h-4 text-accent" />
                {t('quote.hosting.domain')} *
              </label>
              <select
                id="domain"
                name="domain"
                required
                defaultValue={state.formData?.domain || 'Inclus dans le projet'}
                className="w-full px-4 py-3 bg-card/50 backdrop-blur-sm border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                disabled={isPending}
              >
                <option value="">{t('quote.hosting.selectOption')}</option>
                <option value="Inclus dans le projet">{t('quote.hosting.included')}</option>
                <option value="Fourni par le client">{t('quote.hosting.clientProvided')}</option>
                <option value="À discuter">{t('quote.hosting.toDiscuss')}</option>
              </select>
              {state.errors?.domain && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {state.errors.domain[0]}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Champs libres / Commentaires */}
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/30 rounded-xl p-6">
          <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-primary" />
            {t('quote.message.title')}
          </h3>
          
          <div>
            <label htmlFor="message" className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
              {t('quote.message.label')} *
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={8}
              defaultValue={state.formData?.message || ''}
              className="w-full px-4 py-3 bg-card/50 backdrop-blur-sm border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none"
              placeholder={t('quote.message.placeholder')}
              disabled={isPending}
            />
            {state.errors?.message && (
              <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {state.errors.message[0]}
              </p>
            )}
          </div>
        </div>

        {/* RGPD Consent */}
        <div className="bg-card/50 backdrop-blur-sm border-2 border-primary/30 rounded-xl p-6">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              name="rgpdConsent"
              required
              defaultChecked={state.formData?.rgpdConsent === 'on'}
              className="w-5 h-5 mt-0.5 rounded border-2 border-border text-primary focus:ring-2 focus:ring-primary cursor-pointer flex-shrink-0"
              disabled={isPending}
            />
            <div className="space-y-2">
              <span className="text-foreground/90 group-hover:text-foreground transition-colors flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <strong>{t('quote.gdpr.title')} *</strong>
              </span>
              <p className="text-sm text-foreground/70">
                {t('quote.gdpr.text')}{' '}
                <a href="mailto:info@guapowebdesigner.com" className="text-primary hover:underline">
                  info@guapowebdesigner.com
                </a>
                . {t('quote.gdpr.moreInfo')}{' '}
                <Link href="/politique-confidentialite" className="text-primary hover:underline font-semibold">
                  {t('quote.gdpr.privacyPolicy')}
                </Link>
                .
              </p>
            </div>
          </label>
          {state.errors?.rgpdConsent && (
            <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {state.errors.rgpdConsent[0]}
            </p>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] flex items-center justify-center gap-3 text-lg"
        >
          {isPending ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {t('quote.submit.sending')}
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              {t('quote.submit.button')}
            </>
          )}
        </button>

        <p className="text-center text-sm text-foreground/60">
          {t('quote.submit.required')}
        </p>
      </form>
    </div>
  );
}