import { Shield, Lock, Database, Mail, Eye, FileText } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Politique de confidentialité - GUAPO Web Designer',
  description: 'Politique de confidentialité et protection des données personnelles conforme au RGPD',
};

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 bg-gradient-to-br from-background via-primary/20 to-secondary/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/30 text-sm border border-primary/50 backdrop-blur-sm mb-6">
            <Shield className="w-4 h-4 text-primary" />
            <span>Conforme RGPD</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Politique de <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Confidentialité</span>
          </h1>
          
          <p className="text-lg text-foreground/80">
            Dernière mise à jour : 10 novembre 2025
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Introduction */}
          <div className="bg-card/50 backdrop-blur-sm border-2 border-primary/30 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Introduction</h2>
            </div>
            <div className="space-y-4 text-foreground/80">
              <p>
                GUAPO Web Designer, accessible à l'adresse <strong>guapowebdesigner.com</strong>, s'engage à protéger 
                la vie privée de ses utilisateurs et à respecter le Règlement Général sur la Protection des Données (RGPD).
              </p>
              <p>
                Cette politique de confidentialité explique quelles données nous collectons, pourquoi nous les collectons, 
                et comment nous les utilisons.
              </p>
            </div>
          </div>

          {/* Responsable du traitement */}
          <div className="bg-card/50 backdrop-blur-sm border-2 border-secondary/30 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Responsable du traitement</h2>
            </div>
            <div className="space-y-3 text-foreground/80">
              <p><strong>Nom :</strong> GUAPO Web Designer</p>
              <p><strong>Email :</strong> <a href="mailto:info@guapowebdesigner.com" className="text-primary hover:underline">info@guapowebdesigner.com</a></p>
              <p><strong>Site web :</strong> <a href="https://guapowebdesigner.com" className="text-primary hover:underline">guapowebdesigner.com</a></p>
            </div>
          </div>

          {/* Données collectées */}
          <div className="bg-card/50 backdrop-blur-sm border-2 border-accent/30 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center">
                <Database className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Données collectées</h2>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Formulaire de contact et devis</h3>
                <ul className="space-y-2 text-foreground/80 ml-6">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Nom et prénom</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Adresse email</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Numéro de téléphone (optionnel)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Nom de l'entreprise (optionnel)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Détails du projet</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">Cookies</h3>
                <ul className="space-y-2 text-foreground/80 ml-6">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Cookies essentiels :</strong> Nécessaires au fonctionnement du site</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Cookies analytiques :</strong> Pour améliorer l'expérience utilisateur (avec votre consentement)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Utilisation des données */}
          <div className="bg-card/50 backdrop-blur-sm border-2 border-primary/30 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Utilisation des données</h2>
            </div>
            <div className="space-y-3 text-foreground/80">
              <p>Nous utilisons vos données personnelles uniquement pour :</p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Répondre à vos demandes de contact et de devis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Vous fournir les services demandés</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Améliorer notre site et nos services</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Respecter nos obligations légales</span>
                </li>
              </ul>
              <p className="pt-4">
                <strong>Nous ne vendons jamais vos données à des tiers.</strong>
              </p>
            </div>
          </div>

          {/* Conservation des données */}
          <div className="bg-card/50 backdrop-blur-sm border-2 border-secondary/30 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Conservation des données</h2>
            </div>
            <div className="space-y-3 text-foreground/80">
              <p>
                Vos données personnelles sont conservées uniquement le temps nécessaire aux finalités 
                pour lesquelles elles ont été collectées :
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Demandes de contact :</strong> 3 ans maximum</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Cookies :</strong> 13 mois maximum</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Vos droits */}
          <div className="bg-card/50 backdrop-blur-sm border-2 border-accent/30 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Vos droits RGPD</h2>
            </div>
            <div className="space-y-3 text-foreground/80">
              <p>Conformément au RGPD, vous disposez des droits suivants :</p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Droit d'accès :</strong> Obtenir une copie de vos données personnelles</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Droit de rectification :</strong> Corriger vos données inexactes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Droit à l'effacement :</strong> Supprimer vos données personnelles</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Droit d'opposition :</strong> Vous opposer au traitement de vos données</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Droit à la portabilité :</strong> Récupérer vos données dans un format structuré</span>
                </li>
              </ul>
              <p className="pt-4">
                Pour exercer ces droits, contactez-nous à : <a href="mailto:info@guapowebdesigner.com" className="text-primary hover:underline font-semibold">info@guapowebdesigner.com</a>
              </p>
            </div>
          </div>

          {/* Sécurité */}
          <div className="bg-card/50 backdrop-blur-sm border-2 border-primary/30 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Sécurité des données</h2>
            </div>
            <div className="space-y-3 text-foreground/80">
              <p>
                Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées 
                pour protéger vos données personnelles contre :
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>La perte ou la destruction accidentelle</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>L'accès non autorisé</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>La divulgation ou l'altération</span>
                </li>
              </ul>
              <p className="pt-4">
                <strong>🔒 Connexion SSL :</strong> Toutes les communications sont chiffrées via HTTPS.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary/30 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Contact</h2>
            </div>
            <div className="space-y-3 text-foreground/80">
              <p>
                Pour toute question concernant cette politique de confidentialité ou l'exercice de vos droits :
              </p>
              <div className="flex flex-col gap-2 pt-2">
                <a 
                  href="mailto:info@guapowebdesigner.com" 
                  className="inline-flex items-center gap-2 text-primary hover:underline font-semibold"
                >
                  <Mail className="w-4 h-4" />
                  info@guapowebdesigner.com
                </a>
              </div>
            </div>
          </div>

          {/* Retour */}
          <div className="text-center pt-8">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Retour à l'accueil
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
}
