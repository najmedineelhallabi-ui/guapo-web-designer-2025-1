'use client';

import { useActionState, useEffect } from 'react';
import { sendQuoteAction, QuoteFormState } from '@/app/actions/sendQuote';
import { Mail, User, Briefcase, Calendar, MessageSquare, Send, CheckCircle, AlertCircle, Globe, Server, CheckSquare, Shield, Palette, Zap, Lock, Wrench, Building } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import Link from 'next/link';

export function QuoteForm() {
  const { t } = useLanguage();
  const [state, formAction, isPending] = useActionState<QuoteFormState, FormData>(
    sendQuoteAction,
    {}
  );

  useEffect(() => {
    if (state.success) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [state.success]);

  return (
    <div className="max-w-4xl mx-auto">
      <form action={formAction} className="space-y-8">
        {/* Success message */}
        {state.success && (
          <div className="bg-gradient-to-r from-primary/20 to-secondary/20 border-2 border-primary/50 text-foreground px-6 py-4 rounded-xl flex items-start gap-3 animate-fade-in shadow-lg">
            <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-lg">Merci pour votre demande !</p>
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

        {/* 1️⃣ Informations Client */}
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/30 rounded-xl p-6">
          <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
            <User className="w-6 h-6 text-primary" />
            Informations
          </h3>
          
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                  Prénom *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  className="w-full px-4 py-3 bg-card/50 backdrop-blur-sm border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder="Votre prénom"
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
                  Nom *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  className="w-full px-4 py-3 bg-card/50 backdrop-blur-sm border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder="Votre nom"
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
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-3 bg-card/50 backdrop-blur-sm border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                placeholder="votre@email.com"
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
                Nom de l'entreprise / Projet *
              </label>
              <input
                type="text"
                id="company"
                name="company"
                required
                className="w-full px-4 py-3 bg-card/50 backdrop-blur-sm border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                placeholder="Nom de votre entreprise ou projet"
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
                Secteur d'activité (facultatif)
              </label>
              <input
                type="text"
                id="sector"
                name="sector"
                className="w-full px-4 py-3 bg-card/50 backdrop-blur-sm border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                placeholder="Ex: Restauration, Services, etc."
                disabled={isPending}
              />
            </div>
          </div>
        </div>

        {/* 2️⃣ Type de Site */}
        <div className="bg-gradient-to-br from-secondary/10 to-accent/10 border-2 border-secondary/30 rounded-xl p-6">
          <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Globe className="w-6 h-6 text-secondary" />
            Type de Site
          </h3>
          
          <div className="space-y-3">
            <label className="flex items-start gap-3 p-4 border-2 border-border rounded-lg hover:border-secondary/50 hover:bg-secondary/5 cursor-pointer transition-all group">
              <input
                type="radio"
                name="siteType"
                value="Site vitrine simple (1 à 5 pages)"
                required
                className="w-5 h-5 mt-0.5 text-secondary focus:ring-2 focus:ring-secondary cursor-pointer"
                disabled={isPending}
              />
              <div>
                <span className="font-semibold text-foreground group-hover:text-secondary transition-colors">Site vitrine simple (1 à 5 pages)</span>
                <p className="text-sm text-foreground/70 mt-1">Idéal pour présenter votre activité avec les pages essentielles</p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 border-2 border-border rounded-lg hover:border-secondary/50 hover:bg-secondary/5 cursor-pointer transition-all group">
              <input
                type="radio"
                name="siteType"
                value="Site vitrine avancé (5 à 10 pages)"
                className="w-5 h-5 mt-0.5 text-secondary focus:ring-2 focus:ring-secondary cursor-pointer"
                disabled={isPending}
              />
              <div>
                <span className="font-semibold text-foreground group-hover:text-secondary transition-colors">Site vitrine avancé (5 à 10 pages)</span>
                <p className="text-sm text-foreground/70 mt-1">Pour une présence web complète avec plus de contenu</p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 border-2 border-border rounded-lg hover:border-secondary/50 hover:bg-secondary/5 cursor-pointer transition-all group">
              <input
                type="radio"
                name="siteType"
                value="Portfolio / site personnel"
                className="w-5 h-5 mt-0.5 text-secondary focus:ring-2 focus:ring-secondary cursor-pointer"
                disabled={isPending}
              />
              <div>
                <span className="font-semibold text-foreground group-hover:text-secondary transition-colors">Portfolio / site personnel</span>
                <p className="text-sm text-foreground/70 mt-1">Mettez en valeur vos réalisations et votre expertise</p>
              </div>
            </label>
          </div>
          {state.errors?.siteType && (
            <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {state.errors.siteType[0]}
            </p>
          )}
        </div>

        {/* 3️⃣ Design & Contenu */}
        <div className="bg-gradient-to-br from-accent/10 to-primary/10 border-2 border-accent/30 rounded-xl p-6">
          <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Palette className="w-6 h-6 text-accent" />
            Design & Contenu
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-accent/5 border border-accent/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
              <span className="text-foreground/90"><strong>Design sur mesure</strong> (UX/UI personnalisé) - Inclus</span>
            </div>

            <div className="flex items-center gap-3 p-4 bg-accent/5 border border-accent/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
              <span className="text-foreground/90"><strong>Responsive</strong> (mobile + tablette + ordinateur) - Inclus</span>
            </div>

            <div>
              <label htmlFor="pageCount" className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                Nombre de pages prévues *
              </label>
              <input
                type="number"
                id="pageCount"
                name="pageCount"
                required
                min="1"
                max="50"
                className="w-full px-4 py-3 bg-card/50 backdrop-blur-sm border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                placeholder="Ex: 5"
                disabled={isPending}
              />
              {state.errors?.pageCount && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {state.errors.pageCount[0]}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 4️⃣ Fonctionnalités / Modules */}
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/30 rounded-xl p-6">
          <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Zap className="w-6 h-6 text-primary" />
            Fonctionnalités / Modules
          </h3>
          
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-primary/5 transition-colors">
              <input
                type="checkbox"
                name="features"
                value="Formulaire de contact simple"
                className="w-5 h-5 rounded border-2 border-border text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                disabled={isPending}
              />
              <span className="text-foreground/90 group-hover:text-foreground transition-colors">
                Formulaire de contact simple
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-primary/5 transition-colors">
              <input
                type="checkbox"
                name="features"
                value="Formulaire de demande de devis"
                className="w-5 h-5 rounded border-2 border-border text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                disabled={isPending}
              />
              <span className="text-foreground/90 group-hover:text-foreground transition-colors">
                Formulaire de demande de devis
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-primary/5 transition-colors">
              <input
                type="checkbox"
                name="features"
                value="Système de prise de rendez-vous en ligne"
                className="w-5 h-5 rounded border-2 border-border text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                disabled={isPending}
              />
              <span className="text-foreground/90 group-hover:text-foreground transition-colors">
                Système de prise de rendez-vous en ligne
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-primary/5 transition-colors">
              <input
                type="checkbox"
                name="features"
                value="Envoi automatique d'emails client + entreprise (pour rendez-vous)"
                className="w-5 h-5 rounded border-2 border-border text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                disabled={isPending}
              />
              <span className="text-foreground/90 group-hover:text-foreground transition-colors">
                Envoi automatique d'emails client + entreprise (pour rendez-vous)
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-primary/5 transition-colors">
              <input
                type="checkbox"
                name="features"
                value="Intégration calendrier (Google Calendar, etc.)"
                className="w-5 h-5 rounded border-2 border-border text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                disabled={isPending}
              />
              <span className="text-foreground/90 group-hover:text-foreground transition-colors">
                Intégration calendrier (Google Calendar, etc.)
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-primary/5 transition-colors">
              <input
                type="checkbox"
                name="features"
                value="Newsletter / inscription mailing"
                className="w-5 h-5 rounded border-2 border-border text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                disabled={isPending}
              />
              <span className="text-foreground/90 group-hover:text-foreground transition-colors">
                Newsletter / inscription mailing
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-primary/5 transition-colors">
              <input
                type="checkbox"
                name="features"
                value="Multilingue"
                className="w-5 h-5 rounded border-2 border-border text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                disabled={isPending}
              />
              <span className="text-foreground/90 group-hover:text-foreground transition-colors">
                Multilingue
              </span>
            </label>
          </div>
        </div>

        {/* 5️⃣ Optimisation & Sécurité */}
        <div className="bg-gradient-to-br from-secondary/10 to-accent/10 border-2 border-secondary/30 rounded-xl p-6">
          <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Lock className="w-6 h-6 text-secondary" />
            Optimisation & Sécurité
          </h3>
          
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-secondary/5 transition-colors">
              <input
                type="checkbox"
                name="optimization"
                value="SEO de base (balises, titres, URLs)"
                className="w-5 h-5 rounded border-2 border-border text-secondary focus:ring-2 focus:ring-secondary cursor-pointer"
                disabled={isPending}
              />
              <span className="text-foreground/90 group-hover:text-foreground transition-colors">
                SEO de base (balises, titres, URLs)
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-secondary/5 transition-colors">
              <input
                type="checkbox"
                name="optimization"
                value="Optimisation vitesse / performance"
                className="w-5 h-5 rounded border-2 border-border text-secondary focus:ring-2 focus:ring-secondary cursor-pointer"
                disabled={isPending}
              />
              <span className="text-foreground/90 group-hover:text-foreground transition-colors">
                Optimisation vitesse / performance
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-secondary/5 transition-colors">
              <input
                type="checkbox"
                name="optimization"
                value="Certificat SSL / HTTPS"
                className="w-5 h-5 rounded border-2 border-border text-secondary focus:ring-2 focus:ring-secondary cursor-pointer"
                disabled={isPending}
              />
              <span className="text-foreground/90 group-hover:text-foreground transition-colors">
                Certificat SSL / HTTPS
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-secondary/5 transition-colors">
              <input
                type="checkbox"
                name="optimization"
                value="RGPD / conformité légale"
                className="w-5 h-5 rounded border-2 border-border text-secondary focus:ring-2 focus:ring-secondary cursor-pointer"
                disabled={isPending}
              />
              <span className="text-foreground/90 group-hover:text-foreground transition-colors">
                RGPD / conformité légale
              </span>
            </label>
          </div>
        </div>

        {/* 6️⃣ Hébergement & Maintenance */}
        <div className="bg-gradient-to-br from-accent/10 to-primary/10 border-2 border-accent/30 rounded-xl p-6">
          <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Wrench className="w-6 h-6 text-accent" />
            Hébergement & Maintenance
          </h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="hosting" className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                <Server className="w-4 h-4 text-accent" />
                Hébergement *
              </label>
              <select
                id="hosting"
                name="hosting"
                required
                className="w-full px-4 py-3 bg-card/50 backdrop-blur-sm border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                disabled={isPending}
              >
                <option value="">Sélectionnez une option</option>
                <option value="Inclus dans le projet">Inclus dans le projet</option>
                <option value="Fourni par le client">Fourni par le client</option>
                <option value="À discuter">À discuter</option>
              </select>
              {state.errors?.hosting && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {state.errors.hosting[0]}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="domain" className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                <Globe className="w-4 h-4 text-accent" />
                Nom de domaine *
              </label>
              <select
                id="domain"
                name="domain"
                required
                className="w-full px-4 py-3 bg-card/50 backdrop-blur-sm border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                disabled={isPending}
              >
                <option value="">Sélectionnez une option</option>
                <option value="Inclus dans le projet">Inclus dans le projet</option>
                <option value="Fourni par le client">Fourni par le client</option>
                <option value="À discuter">À discuter</option>
              </select>
              {state.errors?.domain && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {state.errors.domain[0]}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="maintenance" className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                Maintenance mensuelle
              </label>
              <select
                id="maintenance"
                name="maintenance"
                className="w-full px-4 py-3 bg-card/50 backdrop-blur-sm border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                disabled={isPending}
              >
                <option value="">Sélectionnez une option</option>
                <option value="Oui, avec mises à jour et sauvegardes">Oui, avec mises à jour et sauvegardes</option>
                <option value="Oui, avec support inclus">Oui, avec support inclus</option>
                <option value="Non merci">Non merci</option>
                <option value="À discuter">À discuter</option>
              </select>
            </div>
          </div>
        </div>

        {/* 8️⃣ Champs libres / Commentaires */}
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/30 rounded-xl p-6">
          <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-primary" />
            Remarques spécifiques / Besoins particuliers
          </h3>
          
          <div>
            <label htmlFor="message" className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
              Description détaillée de votre projet *
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={8}
              className="w-full px-4 py-3 bg-card/50 backdrop-blur-sm border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none"
              placeholder="Décrivez votre projet en détail : vos objectifs, votre audience cible, vos besoins spécifiques, exemples de sites que vous aimez, contraintes particulières, etc."
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
              className="w-5 h-5 mt-0.5 rounded border-2 border-border text-primary focus:ring-2 focus:ring-primary cursor-pointer flex-shrink-0"
              disabled={isPending}
            />
            <div className="space-y-2">
              <span className="text-foreground/90 group-hover:text-foreground transition-colors flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <strong>Consentement RGPD *</strong>
              </span>
              <p className="text-sm text-foreground/70">
                J'accepte que mes données personnelles soient collectées et traitées par GUAPO Web Designer 
                dans le but de traiter ma demande de devis. Mes données ne seront jamais vendues à des tiers. 
                Je peux exercer mes droits (accès, rectification, suppression) en contactant{' '}
                <a href="mailto:info@guapowebdesigner.com" className="text-primary hover:underline">
                  info@guapowebdesigner.com
                </a>
                . Pour plus d'informations, consultez notre{' '}
                <Link href="/politique-confidentialite" className="text-primary hover:underline font-semibold">
                  politique de confidentialité
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
              Envoi en cours...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Envoyer ma demande de devis
            </>
          )}
        </button>

        <p className="text-center text-sm text-foreground/60">
          * Champs obligatoires
        </p>
      </form>
    </div>
  );
}