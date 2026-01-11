import { Resend } from 'resend';
import { PRICING } from './pricing';

const resend = new Resend(process.env.RESEND_API_KEY);

// Prix par page supplémentaire
const PAGE_EXTRA_COST = 100;

// Traductions pour les valeurs des options du formulaire
const optionTranslations = {
  "Site vitrine simple (1 à 3 pages)": { fr: "Site vitrine simple (1 à 3 pages)", nl: "Eenvoudige showcase site (1 tot 3 pagina's)", en: "Simple showcase website (1 to 3 pages)" },
  "Site vitrine standard (4 à 5 pages)": { fr: "Site vitrine standard (4 à 5 pages)", nl: "Standaard showcase site (4 tot 5 pagina's)", en: "Standard showcase website (4 to 5 pages)" },
  "Site vitrine avancé (6 à 8 pages)": { fr: "Site vitrine avancé (6 à 8 pages)", nl: "Geavanceerde showcase site (6 tot 8 pagina's)", en: "Advanced showcase website (6 to 8 pages)" },
  "Site vitrine premium (9 à 12 pages)": { fr: "Site vitrine premium (9 à 12 pages)", nl: "Premium showcase site (9 tot 12 pagina's)", en: "Premium showcase website (9 to 12 pages)" },
  "Portfolio / site personnel": { fr: "Portfolio / site personnel", nl: "Portfolio / persoonlijke website", en: "Portfolio / personal website" },
  "Petite boutique (1-20 produits)": { fr: "Petite boutique (1-20 produits)", nl: "Kleine winkel (1-20 producten)", en: "Small shop (1-20 products)" },
  "Boutique moyenne (21-100 produits)": { fr: "Boutique moyenne (21-100 produits)", nl: "Gemiddelde winkel (21-100 producten)", en: "Medium shop (21-100 products)" },
  "Grande boutique (100+ produits)": { fr: "Grande boutique (100+ produits)", nl: "Grote winkel (100+ producten)", en: "Large shop (100+ products)" },
  "Formulaire de contact simple": { fr: "Formulaire de contact simple", nl: "Eenvoudig contactformulier", en: "Simple contact form" },
  "Formulaire de demande de devis": { fr: "Formulaire de demande de devis", nl: "Offerteaanvraagformulier", en: "Quote request form" },
  "Envoi automatique d'emails de confirmation (pour devis)": { fr: "Envoi automatique d'emails de confirmation (pour devis)", nl: "Automatische verzending van bevestigingsmails (voor offertes)", en: "Automatic confirmation email sending (for quotes)" },
  "Système de prise de rendez-vous en ligne (avec emails automatiques)": { fr: "Système de prise de rendez-vous en ligne (avec emails automatiques)", nl: "Online afsprakenboekingssysteem (met automatische emails)", en: "Online appointment booking system (with automatic emails)" },
  "Intégration calendrier (Google Calendar, etc.)": { fr: "Intégration calendrier (Google Calendar, etc.)", nl: "Agenda-integratie (Google Calendar, etc.)", en: "Calendar integration (Google Calendar, etc.)" },
  "Multilingue": { fr: "Multilingue", nl: "Meertalig", en: "Multilingual" },
  "Blog / actualités": { fr: "Blog / actualités", nl: "Blog / nieuws", en: "Blog / news" },
  "Catalogue de produits": { fr: "Catalogue de produits", nl: "Productcatalogus", en: "Product catalog" },
  "Panier d'achat": { fr: "Panier d'achat", nl: "Winkelwagen", en: "Shopping cart" },
  "Passerelle de paiement (Stripe, PayPal, etc.)": { fr: "Passerelle de paiement (Stripe, PayPal, etc.)", nl: "Betalingsgateway (Stripe, PayPal, etc.)", en: "Payment gateway (Stripe, PayPal, etc.)" },
  "Gestion des commandes": { fr: "Gestion des commandes", nl: "Bestellingenbeheer", en: "Order management" },
  "Gestion des stocks": { fr: "Gestion des stocks", nl: "Voorraadbeheer", en: "Inventory management" },
  "Comptes clients": { fr: "Comptes clients", nl: "Klantenaccounts", en: "Customer accounts" },
  "Pack Tout Inclus (SEO + Performance + SSL + RGPD)": { fr: "Pack Tout Inclus (SEO + Performance + SSL + RGPD)", nl: "All-inclusive Pakket (SEO + Prestaties + SSL + AVG)", en: "All-Inclusive Pack (SEO + Performance + SSL + GDPR)" },
  "SEO de base (balises, titres, URLs)": { fr: "SEO de base (balises, titres, URLs)", nl: "Basis SEO (tags, titels, URL's)", en: "Basic SEO (tags, titles, URLs)" },
  "Optimisation vitesse / performance": { fr: "Optimisation vitesse / performance", nl: "Snelheid / prestaties optimalisatie", en: "Speed / performance optimization" },
  "Certificat SSL / HTTPS": { fr: "Certificat SSL / HTTPS", nl: "SSL-certificaat / HTTPS", en: "SSL certificate / HTTPS" },
  "RGPD / conformité légale": { fr: "RGPD / conformité légale", nl: "AVG / wettelijke naleving", en: "GDPR / legal compliance" },
  "Inclus dans le projet": { fr: "Inclus dans le projet", nl: "Inbegrepen in het project", en: "Included in the project" },
  "Fourni par le client": { fr: "Fourni par le client", nl: "Geleverd door de klant", en: "Provided by the client" },
  "À discuter": { fr: "À discuter", nl: "Te bespreken", en: "To discuss" },
  "Menu / Site de commande (système de base)": { fr: "Menu / Site de commande (système de base)", nl: "Menu / Bestelsite (basissysteem)", en: "Menu / Ordering site (base system)" },
  "Pack Menu Simple": { fr: "Pack Menu Simple", nl: "Eenvoudig Menupakket", en: "Simple Menu Pack" },
  "Pack Menu Complet": { fr: "Pack Menu Complet", nl: "Compleet Menupakket", en: "Complete Menu Pack" },
  "Ajout au panier": { fr: "Ajout au panier", nl: "Toevoegen aan winkelwagen", en: "Add to cart" },
  "Sur place / à emporter": { fr: "Sur place / à emporter", nl: "Ter plaatse / afhalen", en: "Dine-in / takeaway" },
  "Confirmation de commande": { fr: "Confirmation de commande", nl: "Bestelbevestiging", en: "Order confirmation" },
  "Email automatique client": { fr: "Email automatique client", nl: "Automatische klant email", en: "Automatic customer email" },
  "Dashboard Cuisine": { fr: "Dashboard Cuisine", nl: "Keuken dashboard", en: "Kitchen dashboard" },
  "Statuts de commande cuisine": { fr: "Statuts de commande cuisine", nl: "Keuken bestelstatus", en: "Kitchen order status" },
  "Gestion menu": { fr: "Gestion menu", nl: "Menu beheer", en: "Menu management" },
  "Dashboard Serveur": { fr: "Dashboard Serveur", nl: "Ober dashboard", en: "Waiter dashboard" },
  "Statuts de commande serveur": { fr: "Statuts de commande serveur", nl: "Ober bestelstatus", en: "Waiter order status" },
    "Français (FR)": { fr: "Français (FR)", nl: "Frans (FR)", en: "French (FR)" },
    "Néerlandais (NL)": { fr: "Néerlandais (NL)", nl: "Nederlands (NL)", en: "Dutch (NL)" },
    "English (ENG)": { fr: "Anglais (ENG)", nl: "Engels (ENG)", en: "English (ENG)" },
    "Autre": { fr: "Autre", nl: "Andere", en: "Other" },
    "Pack annuel (6 interventions)": { fr: "Pack annuel (6 interventions) - 300€ HTVA/an", nl: "Jaarlijkse pakket (6 interventies) - 300€ excl. BTW/jaar", en: "Annual pack (6 interventions) - 300€ excl. VAT/year" },
    "À l'intervention": { fr: "À l'intervention - 100€ HTVA/intervention", nl: "Per interventie - 100€ excl. BTW/interventie", en: "Per intervention - 100€ excl. VAT/intervention" },
    "Maintenance standard": { fr: "Maintenance standard - 30€ HTVA/mois", nl: "Standaard onderhoud - 30€ excl. BTW/maand", en: "Standard maintenance - 30€ excl. VAT/month" }
  };

function translateOption(option: string, lang: 'fr' | 'nl' | 'en' = 'fr'): string {
  const translation = optionTranslations[option as keyof typeof optionTranslations];
  return translation ? translation[lang] : option;
}

const emailTranslations = {
  fr: {
    owner: {
      subject: (firstName: string, lastName: string, min: number, max: number, hasRange: boolean) => `🎨 Devis - ${firstName} ${lastName} - ${hasRange ? `${min}€ à ${max}€` : `${min}€`}`,
      title: "🎨 Nouveau Devis",
      subtitle: "Nouvelle demande reçue",
      categorySiteType: "Type de site",
      categoryExtraPages: "Pages supp.",
      categoryFeatures: "Fonctionnalités",
      categoryLanguages: "Langues",
      categoryOptimization: "Optimisation",
      categoryDomain: "Domaine",
      extraPages: (count: number) => `${count} page(s) sup.`,
      included: "Inclus",
      firstYear: "1ère année"
    },
    client: {
      subject: "✅ Votre estimation - GUAPO Web Designer",
      title: "Votre Estimation"
    }
  }
};

function getT(lang: 'fr' | 'nl' | 'en' = 'fr') {
  return emailTranslations[lang] || emailTranslations.fr;
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

function calculatePricing(data: any, lang: 'fr' | 'nl' | 'en' = 'fr') {
  let minTotalHT = 0, maxTotalHT = 0;
  let totalMonthlyModelA = 30; // Maintenance par défaut pour tous les projets
  let tvaRate = 0.21; // TVA 21%
  
  // 1. Base Site Type Price (Model A)
  const siteTypeKey = data.siteType as keyof typeof PRICING.siteTypes;
  const siteTypePrice = PRICING.siteTypes[siteTypeKey];
  if (siteTypePrice) {
    minTotalHT += siteTypePrice.min;
    maxTotalHT += siteTypePrice.max;
  }

  // 2. Extra Pages
  if (data.pageCount) {
    const pageCount = parseInt(data.pageCount.toString());
    let limit = 3;
    if (data.siteType.includes('4 à 5')) limit = 5;
    else if (data.siteType.includes('6 à 8')) limit = 8;
    else if (data.siteType.includes('9 à 12')) limit = 12;
    if (pageCount > limit) {
      const extra = pageCount - limit;
      minTotalHT += extra * PAGE_EXTRA_COST;
      maxTotalHT += extra * PAGE_EXTRA_COST;
    }
  }

  // 3. Languages (Model A: Unique)
  if (data.languages && data.languages.length > 1) {
    // Each additional language adds to the setup cost
    const multiPrice = PRICING.features["Multilingue"];
    const extraLanguagesCount = data.languages.length - 1;
    minTotalHT += extraLanguagesCount * multiPrice;
    maxTotalHT += extraLanguagesCount * multiPrice;
  }

  // 4. Features
  if (data.features) {
    data.features.forEach((f: string) => {
      // Model A: Unique price
      const uPrice = (PRICING.features as any)[f];
      if (uPrice !== undefined) {
        minTotalHT += uPrice; 
        maxTotalHT += uPrice;
      }
    });
  }

  // 5. Optimization
  if (data.optimization) {
    data.optimization.forEach((o: string) => {
      const price = (PRICING.optimization as any)[o];
      if (price !== undefined) { 
        minTotalHT += price; 
        maxTotalHT += price; 
      }
    });
  }

  // 6. Domain
  if (data.domain) {
    const price = (PRICING.domain as any)[data.domain];
    if (price !== undefined && price > 0) { 
      minTotalHT += price; 
      maxTotalHT += price; 
    }
  }

  const tvaMinA = Math.round(minTotalHT * tvaRate);
  const tvaMaxA = Math.round(maxTotalHT * tvaRate);
  const minTotalTTCA = minTotalHT + tvaMinA;
  const maxTotalTTCA = maxTotalHT + tvaMaxA;

  // Model A Monthly (maintenance/pack)
  const monthlyHTA = totalMonthlyModelA;
  const monthlyTVAA = Math.round(monthlyHTA * tvaRate * 100) / 100;
  const monthlyTTCA = Math.round((monthlyHTA + monthlyTVAA) * 100) / 100;

  return {
    isMenuProject: false,
    hasRange: minTotalHT !== maxTotalHT,
    baseMinHT: minTotalHT,
    baseMaxHT: maxTotalHT,
    discountMin: 0,
    discountMax: 0,
    discountedMinHT: minTotalHT,
    discountedMaxHT: maxTotalHT,
    tvaMinA,
    tvaMaxA,
    minTotalTTCA,
    maxTotalTTCA,
    monthlyHTA,
    monthlyTVAA,
    monthlyTTCA,
    monthlyHTB: 0,
    monthlyTVAB: 0,
    monthlyTTCB: 0,
    monthlyBreakdownB: [],
    selectedPackName: ""
  };
}

export async function sendQuoteEmail(data: any) {
  const lang = data.language || 'fr';
  const pricing = calculatePricing(data, lang);
  const t = getT(lang);
  const refId = Math.random().toString(36).substring(2, 8).toUpperCase();

  const tableRows: any[] = [];
  const siteTypeKey = data.siteType as keyof typeof PRICING.siteTypes;
  const siteTypePrice = PRICING.siteTypes[siteTypeKey];
  if (siteTypePrice) tableRows.push({ item: translateOption(data.siteType, lang), unique: siteTypePrice.min === siteTypePrice.max ? `${siteTypePrice.min}€` : `${siteTypePrice.min}€ - ${siteTypePrice.max}€`, monthly: '-' });

  if (data.languages && data.languages.length > 1) {
    const multiPrice = PRICING.features["Multilingue"];
    const extraCount = data.languages.length - 1;
    const totalMultiPrice = extraCount * multiPrice;
    tableRows.push({ 
      item: translateOption("Multilingue", lang) + ` (${extraCount} supp.)`, 
      unique: `${totalMultiPrice}€`, 
      monthly: '-' 
    });
  }

  if (data.features) {
    data.features.forEach((f: string) => {
      if (f === "Multilingue") return; // Handled separately
      const uPrice = (PRICING.features as any)[f];
      const mPrice = (PRICING as any).monthlyMenuFeatures?.[f];
      tableRows.push({ 
        item: translateOption(f, lang), 
        unique: uPrice !== undefined ? (uPrice > 0 ? `${uPrice}€` : 'Inclus') : '-', 
        monthly: mPrice !== undefined ? `${mPrice}€` : '-' 
      });
    });
  }

  if (data.optimization) {
    data.optimization.forEach((o: string) => {
      const price = (PRICING.optimization as any)[o];
      tableRows.push({ item: translateOption(o, lang), unique: price !== undefined ? (price > 0 ? `${price}€` : 'Inclus') : '-', monthly: '-' });
    });
  }

  if (data.domain) {
    const price = (PRICING.domain as any)[data.domain];
    tableRows.push({ item: translateOption(data.domain, lang), unique: price !== undefined ? (price > 0 ? `${price}€` : 'Inclus') : '-', monthly: '-' });
  }

    if (data.menuSubscription) {
      const mPrice = (PRICING.subscriptions as any)[data.menuSubscription];
      tableRows.push({ item: translateOption(data.menuSubscription, lang), unique: '-', monthly: `${mPrice}€` });
      tableRows.push({ item: "Système de base & maintenance", unique: '-', monthly: "30€" });
    } else if (pricing.isMenuProject) {
      tableRows.push({ item: "Système de base & maintenance", unique: '-', monthly: "30€" });
    } else {
      tableRows.push({ item: "Maintenance & plateforme", unique: '-', monthly: "30€" });
    }

  const commonStyles = `
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; margin: 0; padding: 0; background-color: #f1f5f9; }
    .wrapper { width: 100%; table-layout: fixed; background-color: #f1f5f9; padding-bottom: 40px; }
    .main-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
    .header { background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%); padding: 40px 20px; text-align: center; color: #ffffff; }
    .logo { width: 150px; height: auto; margin-bottom: 20px; }
    .content { padding: 40px 30px; line-height: 1.6; }
    h1 { margin: 0 0 10px 0; font-size: 28px; font-weight: 800; letter-spacing: -0.025em; }
    h2 { margin: 30px 0 15px 0; font-size: 20px; font-weight: 700; color: #7c3aed; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; }
    .p-small { font-size: 14px; color: #64748b; margin-top: 5px; }
    .card { background-color: #f8fafc; border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0; margin-bottom: 25px; }
    .price-big { font-size: 32px; font-weight: 900; color: #1e293b; margin: 10px 0; }
    .price-label { font-size: 12px; text-transform: uppercase; font-weight: 700; color: #64748b; letter-spacing: 0.05em; }
    .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { font-weight: 600; color: #475569; }
    .detail-value { font-weight: 700; color: #1e293b; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; background-color: #7c3aed; color: #ffffff; margin-bottom: 10px; }
    .footer { text-align: center; padding: 30px; font-size: 12px; color: #94a3b8; }
    .btn { display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%); color: #ffffff !important; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; margin-top: 20px; box-shadow: 0 4px 6px -1px rgba(124, 58, 237, 0.3); transition: transform 0.2s; }
  `;

  const ownerEmailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>${commonStyles}</style>
      </head>
      <body>
        <div class="wrapper">
          <div class="main-container">
            <div class="header">
              <img src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Logo-de-Guapo-Designer-Web-1762372330786.png?width=400&height=200&resize=contain" alt="GUAPO" class="logo">
              <h1>Nouveau Devis</h1>
              <p>Réf: #${refId} | ${new Date().toLocaleDateString('fr-BE')}</p>
            </div>
            
            <div class="content">
              <div class="card" style="border-left: 5px solid #7c3aed;">
                <div class="badge" style="background-color: #7c3aed;">COORDONNÉES CLIENT</div>
                <div style="font-size: 18px; font-weight: 800; margin-bottom: 10px;">${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}</div>
                <div class="detail-row"><span class="detail-label">Email:</span> <span class="detail-value">${data.email}</span></div>
                ${data.company ? `<div class="detail-row"><span class="detail-label">Entreprise:</span> <span class="detail-value">${escapeHtml(data.company)}</span></div>` : ''}
                ${data.sector ? `<div class="detail-row"><span class="detail-label">Secteur:</span> <span class="detail-value">${escapeHtml(data.sector)}</span></div>` : ''}
                <div class="detail-row"><span class="detail-label">Langue:</span> <span class="detail-value">${lang.toUpperCase()}</span></div>
              </div>

              <h2>CONFIGURATION DU PROJET</h2>
              <div class="card">
                <div class="detail-row"><span class="detail-label">Type de site:</span> <span class="detail-value">${escapeHtml(translateOption(data.siteType, lang))}</span></div>
                ${data.pageCount ? `<div class="detail-row"><span class="detail-label">Pages estimées:</span> <span class="detail-value">${data.pageCount}</span></div>` : ''}
                ${data.domain ? `<div class="detail-row"><span class="detail-label">Domaine:</span> <span class="detail-value">${escapeHtml(translateOption(data.domain, lang))}</span></div>` : ''}
              </div>

              <h2>DÉTAIL DES OPTIONS (HTVA)</h2>
              <div class="card">
                ${tableRows.map(r => `
                  <div class="detail-row">
                    <span class="detail-label">${escapeHtml(r.item)}</span>
                    <span class="detail-value">${r.unique !== '-' ? r.unique : r.monthly}</span>
                  </div>
                `).join('')}
              </div>

              <h2>RÉSUMÉ FINANCIER</h2>
              <div class="card" style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);">
                <div class="detail-row"><span class="detail-label">Total Unique HTVA:</span> <span class="detail-value">${pricing.hasRange ? `${pricing.baseMinHT}€ - ${pricing.baseMaxHT}€` : `${pricing.baseMinHT}€`}</span></div>
                <div class="detail-row"><span class="detail-label">Total Unique TVAC:</span> <span class="detail-value">${pricing.hasRange ? `${pricing.minTotalTTCA}€ - ${pricing.maxTotalTTCA}€` : `${pricing.minTotalTTCA}€`}</span></div>
                <div class="detail-row" style="margin-top: 10px; padding-top: 10px; border-top: 2px dashed #cbd5e1;"><span class="detail-label" style="color: #db2777;">Maintenance Mensuelle HTVA:</span> <span class="detail-value" style="color: #db2777;">${pricing.monthlyHTA}€ / mois</span></div>
              </div>

              <div style="text-align: center; margin-top: 30px;">
                <a href="mailto:${data.email}" class="btn">RÉPONDRE AU CLIENT</a>
              </div>
            </div>
            
            <div class="footer">
              GUAPO Web Designer &copy; 2025 | Powered by Orchids
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  const clientEmailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>${commonStyles}</style>
      </head>
      <body>
        <div class="wrapper">
          <div class="main-container">
            <div class="header">
              <img src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Logo-de-Guapo-Designer-Web-1762372330786.png?width=400&height=200&resize=contain" alt="GUAPO" class="logo">
              <h1>Votre Estimation</h1>
              <p>Réf: #${refId}</p>
            </div>
            
            <div class="content">
              <p>Bonjour <strong>${escapeHtml(data.firstName)}</strong>,</p>
              <p>Merci pour votre intérêt ! Nous avons analysé vos besoins pour votre projet <strong>${escapeHtml(data.company || 'web')}</strong> et voici notre estimation personnalisée.</p>

              <h2>VOTRE PROJET</h2>
              <div class="card">
                <div class="detail-row"><span class="detail-label">Solution:</span> <span class="detail-value">${escapeHtml(translateOption(data.siteType, lang))}</span></div>
                ${data.pageCount ? `<div class="detail-row"><span class="detail-label">Volume:</span> <span class="detail-value">${data.pageCount} pages</span></div>` : ''}
                ${data.languages && data.languages.length > 0 ? `<div class="detail-row"><span class="detail-label">Langues:</span> <span class="detail-value">${data.languages.join(', ')}</span></div>` : ''}
              </div>

              <h2>ESTIMATION DE L'INVESTISSEMENT</h2>
              <div class="card" style="border: 2px solid #7c3aed; background-color: #ffffff;">
                <div class="price-label">CRÉATION DU SITE (Unique)</div>
                <div class="price-big">${pricing.hasRange ? `${pricing.minTotalTTCA}€ - ${pricing.maxTotalTTCA}€` : `${pricing.minTotalTTCA}€`} <span style="font-size: 16px; font-weight: 600;">TVAC</span></div>
                <p class="p-small">Inclut le design, le développement, et l'optimisation initiale.</p>
                
                <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                  <div class="price-label">MAINTENANCE & HÉBERGEMENT (Mensuel)</div>
                  <div style="font-size: 24px; font-weight: 800; color: #db2777;">${pricing.monthlyTTCA}€ <span style="font-size: 14px; font-weight: 600;">TVAC / mois</span></div>
                  <p class="p-small">Inclut l'hébergement haute performance, la sécurité SSL, et les mises à jour.</p>
                </div>
              </div>

              <div style="text-align: center; margin-top: 40px; padding: 30px; background-color: #f1f5f9; border-radius: 16px;">
                <h3 style="margin: 0 0 15px 0; color: #1e293b;">Ce projet vous intéresse ?</h3>
                <p style="margin-bottom: 25px; font-size: 15px;">Cliquez sur le bouton ci-dessous pour confirmer votre intérêt pour ce modèle. Nous vous recontacterons sous 24h pour discuter des prochaines étapes.</p>
                <a href="https://guapowebdesigner.com/confirm-quote?model=A&ref=${refId}&firstName=${encodeURIComponent(data.firstName)}&lastName=${encodeURIComponent(data.lastName)}&email=${encodeURIComponent(data.email)}&company=${encodeURIComponent(data.company || '')}&siteType=${encodeURIComponent(data.siteType)}&minPrice=${pricing.minTotalTTCA}&maxPrice=${pricing.maxTotalTTCA}&monthlyPrice=${pricing.monthlyTTCA}&packName=${encodeURIComponent(pricing.selectedPackName || 'Maintenance')}" class="btn">CONFIRMER MON INTÉRÊT</a>
              </div>

              <div style="margin-top: 40px; text-align: center;">
                <p class="p-small">Vous avez des questions ? Répondez simplement à cet email, nous sommes à votre disposition.</p>
              </div>
            </div>
            
            <div class="footer">
              GUAPO Web Designer | info@guapowebdesigner.com<br>
              www.guapowebdesigner.com
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const from = process.env.EMAIL_FROM || 'onboarding@resend.dev';
    const toOwner = process.env.CONTACT_EMAIL_TO || 'info@guapowebdesigner.com';

    await resend.emails.send({ 
      from, 
      to: 'info@guapowebdesigner.com', // Forcé pour être sûr
      replyTo: data.email, 
      subject: `🎨 [#${refId}] DEVIS : ${data.firstName} ${data.lastName} (${data.company || 'Projet'})`, 
      html: ownerEmailHtml 
    });
    await resend.emails.send({ 
      from, 
      to: data.email, 
      replyTo: toOwner, 
      subject: `✅ [#${refId}] Votre estimation - ${data.company || 'Projet Web'} - GUAPO`, 
      html: clientEmailHtml 
    });

    return { success: true };
  } catch (error) {
    console.error('Email error details:', error);
    throw error;
  }
}
