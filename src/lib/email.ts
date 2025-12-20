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
  "Autre": { fr: "Autre", nl: "Andere", en: "Other" }
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
  let totalMonthlyModelA = 0;
  let totalMonthlyModelB = 0;
  
  const isMenuProject = data.siteType.includes('Menu / Site de commande');
  const monthlyBreakdownB: any[] = [];

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

      // Model B: Monthly price
      const mPrice = (PRICING as any).monthlyMenuFeatures?.[f];
      if (isMenuProject && mPrice !== undefined) {
        totalMonthlyModelB += mPrice;
        monthlyBreakdownB.push({ 
          item: translateOption(f, lang), 
          price: mPrice
        });
      }
    });
  }

  // 5. Subscription Pack
  let selectedPackName = "";
  if (data.menuSubscription) {
    const subKey = data.menuSubscription as keyof typeof PRICING.subscriptions;
    const subPrice = PRICING.subscriptions[subKey];
    if (subPrice) {
      selectedPackName = translateOption(data.menuSubscription, lang);
      // For Model A, monthly is ONLY the pack price + 30€ base system if Menu
      totalMonthlyModelA = subPrice + (isMenuProject ? 30 : 0);
      // For Model B, it's cumulative with features + 30€ base system
      totalMonthlyModelB += subPrice + (isMenuProject ? 30 : 0);
      
      if (isMenuProject) {
        monthlyBreakdownB.unshift({ item: "Système de base commande", price: 30 });
      }
      monthlyBreakdownB.unshift({ item: selectedPackName, price: subPrice });
    }
  } else {
    // Default maintenance for vitrine sites in Model A
    totalMonthlyModelA = isMenuProject ? 30 : 25; 
    if (isMenuProject) {
      totalMonthlyModelB += 30;
      monthlyBreakdownB.push({ item: "Système de base commande", price: 30 });
    }
  }

  // 6. Optimization
  if (data.optimization) {
    data.optimization.forEach((o: string) => {
      const price = (PRICING.optimization as any)[o];
      if (price !== undefined) { 
        minTotalHT += price; 
        maxTotalHT += price; 
      }
    });
  }

  // 7. Domain
  if (data.domain) {
    const price = (PRICING.domain as any)[data.domain];
    if (price !== undefined && price > 0) { 
      minTotalHT += price; 
      maxTotalHT += price; 
    }
  }

  const tvaRate = 0.21;
  const discountRate = 0.30;

  // Model A Investment Calculation
  const discountMin = Math.round(minTotalHT * discountRate);
  const discountMax = Math.round(maxTotalHT * discountRate);
  const discountedMinHT = minTotalHT - discountMin;
  const discountedMaxHT = maxTotalHT - discountMax;
  
  const tvaMinA = Math.round(discountedMinHT * tvaRate);
  const tvaMaxA = Math.round(discountedMaxHT * tvaRate);
  const minTotalTTCA = discountedMinHT + tvaMinA;
  const maxTotalTTCA = discountedMaxHT + tvaMaxA;

  // Model A Monthly (maintenance/pack)
  const monthlyHTA = totalMonthlyModelA;
  const monthlyTVAA = Math.round(monthlyHTA * tvaRate * 100) / 100;
  const monthlyTTCA = Math.round((monthlyHTA + monthlyTVAA) * 100) / 100;

  // Model B Monthly (subscription all-in)
  const monthlyHTB = totalMonthlyModelB;
  const monthlyTVAB = Math.round(monthlyHTB * tvaRate * 100) / 100;
  const monthlyTTCB = Math.round((monthlyHTB + monthlyTVAB) * 100) / 100;


  return {
    isMenuProject,
    hasRange: minTotalHT !== maxTotalHT,
    baseMinHT: minTotalHT,
    baseMaxHT: maxTotalHT,
    discountMin,
    discountMax,
    discountedMinHT,
    discountedMaxHT,
    tvaMinA,
    tvaMaxA,
    minTotalTTCA,
    maxTotalTTCA,
    monthlyHTA,
    monthlyTVAA,
    monthlyTTCA,
    monthlyHTB,
    monthlyTVAB,
    monthlyTTCB,
    monthlyBreakdownB,
    selectedPackName
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
  }

  const commonStyles = `
    body{font-family:sans-serif;color:#334155;margin:0;padding:20px;background:#f8fafc}
    .c{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:25px;max-width:600px;margin:0 auto;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1)}
    .h{background:#1e293b;color:#fff;padding:20px;border-radius:12px 12px 0 0;text-align:center;margin-bottom:20px}
    table{width:100%;border-collapse:collapse;margin:15px 0;font-size:13px}
    th{background:#f8fafc;padding:10px;text-align:left;border-bottom:2px solid #e2e8f0}
    td{padding:10px;border-bottom:1px solid #f1f5f9}
    .box{border:1px solid #e2e8f0;border-radius:10px;padding:15px;background:#f8fafc;margin-bottom:15px}
    .btn{display:block;padding:12px;text-decoration:none;border-radius:6px;font-weight:700;text-align:center;font-size:14px;margin-top:10px}
    .btn-a{background:#1e293b;color:#fff}
    .btn-b{background:#10b981;color:#fff}
    .promo-banner{background:#fefce8;border:1px solid #fef08a;padding:12px;border-radius:8px;margin-bottom:20px;text-align:center;color:#854d0e}
  `;

  const ownerEmailHtml = `
    <html><head><style>${commonStyles}</style></head><body>
      <div class="c">
        <div class="h"><h2>${t.owner.title} #${refId}</h2></div>
        <p><strong>Client:</strong> ${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}<br><strong>Email:</strong> ${data.email}<br><strong>Projet:</strong> ${escapeHtml(data.company || '-')}</p>
        <table>
          <thead><tr><th>Élément</th><th style="text-align:right">Unique</th><th style="text-align:right">Mensuel</th></tr></thead>
          <tbody>${tableRows.map(r => `<tr><td>${escapeHtml(r.item)}</td><td style="text-align:right">${r.unique}</td><td style="text-align:right">${r.monthly}</td></tr>`).join('')}</tbody>
        </table>
          <div class="box">
            <strong>Calcul Modèle A (Investissement):</strong><br>
            Base HTVA: ${pricing.hasRange ? `${pricing.baseMinHT}€ - ${pricing.baseMaxHT}€` : `${pricing.baseMinHT}€`}<br>
            Promo -30%: -${pricing.hasRange ? `${pricing.discountMin}€ - ${pricing.discountMax}€` : `${pricing.discountMin}€`} HTVA<br>
            Total HTVA: ${pricing.hasRange ? `${pricing.discountedMinHT}€ - ${pricing.discountedMaxHT}€` : `${pricing.discountedMinHT}€`}<br>
            TVA (21%): ${pricing.hasRange ? `${pricing.tvaMinA}€ - ${pricing.tvaMaxA}€` : `${pricing.tvaMinA}€`}<br>
            <strong>TOTAL TVAC: ${pricing.hasRange ? `${pricing.minTotalTTCA}€ - ${pricing.maxTotalTTCA}€` : `${pricing.minTotalTTCA}€`}</strong>
            <br><br>
            <strong>Mensuel Modèle A:</strong> ${pricing.selectedPackName ? `Pack ${pricing.selectedPackName}` : 'Maintenance & plateforme'}: ${pricing.monthlyHTA}€ HTVA (${pricing.monthlyTTCA}€ TVAC)
          </div>

        ${pricing.isMenuProject ? `<div class="box" style="background:#ecfdf5"><strong>Modèle B (Abonnement):</strong> Mensuel ${pricing.monthlyTTCB}€/m TVAC</div>` : ''}
        <div style="font-size:10px;color:#94a3b8;text-align:center;margin-top:20px">Ref: ${refId} | ${new Date().toLocaleString('fr-BE')}</div>
        <a href="mailto:${data.email}" class="btn btn-a">Répondre au client</a>
      </div>
    </body></html>
  `;

  const clientEmailHtml = `
    <html><head><style>${commonStyles}</style></head><body>
      <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
        Votre devis personnalisé #${refId} - ${new Date().toLocaleString('fr-BE')}
      </div>
      <div class="c">
        <div class="h"><h1>${t.client.title}</h1></div>
        <div style="text-align:right;font-size:11px;color:#94a3b8;margin-bottom:10px">Réf: ${refId}</div>
        <p>Bonjour <strong>${escapeHtml(data.firstName)}</strong>,</p>
        <p>Voici votre estimation personnalisée pour votre projet <strong>${escapeHtml(data.company || 'web')}</strong> :</p>
        
        <div class="promo-banner">
          <span style="font-size:18px">🎁 <strong>PROMO -30% APPLIQUÉE</strong></span><br>
          <span style="font-size:13px">Sur votre investissement initial jusqu'au 31/12/2025</span>
        </div>

          <table>
            <thead><tr><th>Détails de votre projet</th><th style="text-align:right">Mensuel</th></tr></thead>
            <tbody>${tableRows.filter(r => !pricing.isMenuProject || r.monthly !== '-').map(r => `<tr><td>${escapeHtml(r.item)}</td><td style="text-align:right;color:#0ea5e9">${r.monthly}</td></tr>`).join('')}</tbody>
          </table>

            ${pricing.isMenuProject ? `

                <div class="box" style="background:#ecfdf5;border:2px solid #10b981; padding:20px;">
                  <div style="font-weight:800;text-align:center;font-size:18px;color:#065f46;margin-bottom:5px">OFFRE ABONNEMENT TOUT-EN-UN</div>
                  <div style="font-size:12px;text-align:center;color:#059669;margin-bottom:20px">Zéro investissement, tout est inclus dans le mensuel</div>
                  
                  <div style="background:#fff;padding:20px;border-radius:10px;border:1px solid #a7f3d0">
                    <div style="display:flex;justify-content:space-between;margin-bottom:10px">
                      <span>Investissement initial :</span>
                      <span style="color:#10b981;font-weight:900;font-size:16px">0€ OFFERT</span>
                    </div>
                    <div style="margin:15px 0;font-size:12px;color:#4b5563;background:#f0fdf4;padding:12px;border-radius:8px">
                      <div style="font-weight:700;margin-bottom:8px;color:#166534">Détail de votre abonnement :</div>
                      ${pricing.monthlyBreakdownB.map((i: any) => `<div style="display:flex;justify-content:space-between;margin-bottom:4px"><span>• ${escapeHtml(i.item)}</span><span>${i.price === 0 ? 'Inclus' : `${i.price}€ HT / mois`}</span></div>`).join('')}
                    </div>
                    <div style="display:flex;justify-content:space-between;margin-bottom:8px;padding-top:10px;border-top:1px solid #f1f5f9">
                      <span>Total HTVA :</span>
                      <span><strong>${pricing.monthlyHTB}€ / mois</strong></span>
                    </div>
                    <div style="display:flex;justify-content:space-between;margin-bottom:8px">
                      <span>TVA (21%) :</span>
                      <span>${pricing.monthlyTVAB}€ / mois</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;margin-top:15px;padding-top:15px;border-top:2px solid #10b981;font-size:20px;font-weight:900;color:#065f46">
                      <span>TOTAL TVAC :</span>
                      <span>${pricing.monthlyTTCB}€ / mois</span>
                    </div>
                  </div>
                  <a href="https://guapowebdesigner.com/confirm-quote?model=B&ref=${refId}&firstName=${encodeURIComponent(data.firstName)}&lastName=${encodeURIComponent(data.lastName)}&email=${encodeURIComponent(data.email)}&company=${encodeURIComponent(data.company || '')}&siteType=${encodeURIComponent(data.siteType)}&monthlyPrice=${pricing.monthlyTTCB}&packName=${encodeURIComponent(pricing.selectedPackName || 'Abonnement complet')}" class="btn btn-b" style="margin-top:20px">CHOISIR CE MODÈLE</a>
                </div>
              ` : `

              <div class="box" style="text-align:center;padding:30px;border:2px solid #1e293b">
                <div style="font-weight:900;margin-bottom:20px;font-size:20px;color:#1e293b;text-transform:uppercase">Option A : Propriétaire</div>
                <div style="background:#fff;padding:25px;border-radius:12px;border:1px solid #e2e8f0;text-align:left;box-shadow:0 2px 4px rgba(0,0,0,0.05)">
                  <div style="font-weight:700;color:#1e293b;margin-bottom:15px;border-bottom:1px solid #f1f5f9;padding-bottom:10px">Règlement unique (Système)</div>
                  
                  <div style="display:flex;justify-content:space-between;margin-bottom:10px">
                    <span>Investissement HTVA :</span>
                    <span><strong>${pricing.hasRange ? `${pricing.discountedMinHT}€ - ${pricing.discountedMaxHT}€` : `${pricing.discountedMinHT}€`}</strong></span>
                  </div>
                  <div style="display:flex;justify-content:space-between;margin-bottom:10px">
                    <span>TVA (21%) :</span>
                    <span>${pricing.hasRange ? `${pricing.tvaMinA}€ - ${pricing.tvaMaxA}€` : `${pricing.tvaMinA}€`}</span>
                  </div>
                  <div style="display:flex;justify-content:space-between;margin-top:10px;padding-top:10px;border-top:2px solid #1e293b;font-size:22px;font-weight:900;color:#1e293b">
                    <span>TOTAL TVAC :</span>
                    <span>${pricing.hasRange ? `${pricing.minTotalTTCA}€ - ${pricing.maxTotalTTCA}€` : `${pricing.minTotalTTCA}€`}</span>
                  </div>

                  <div style="margin-top:25px;font-size:14px;color:#64748b;text-align:center;background:#f8fafc;padding:15px;border-radius:10px;border:1px solid #e2e8f0">
                    <div style="font-weight:700;color:#1e293b;margin-bottom:5px">+ ${pricing.selectedPackName ? `Pack ${pricing.selectedPackName}` : 'Maintenance & plateforme'}</div>
                    <strong>${pricing.monthlyHTA}€ / mois HTVA</strong><br>
                    <span style="font-size:12px">(${pricing.monthlyTTCA}€ / mois TVAC)</span>
                  </div>
                </div>
                <a href="https://guapowebdesigner.com/confirm-quote?model=A&ref=${refId}&firstName=${encodeURIComponent(data.firstName)}&lastName=${encodeURIComponent(data.lastName)}&email=${encodeURIComponent(data.email)}&company=${encodeURIComponent(data.company || '')}&siteType=${encodeURIComponent(data.siteType)}&minPrice=${pricing.minTotalTTCA}&maxPrice=${pricing.maxTotalTTCA}&monthlyPrice=${pricing.monthlyTTCA}&packName=${encodeURIComponent(pricing.selectedPackName || 'Maintenance')}" class="btn btn-a" style="margin-top:25px;font-size:16px">CHOISIR CE MODÈLE</a>
              </div>

              <div style="margin:40px 0;text-align:center;color:#94a3b8">OU</div>

              <div class="box" style="background:#ecfdf5;border:2px solid #10b981; padding:20px;">
                <div style="font-weight:800;text-align:center;font-size:18px;color:#065f46;margin-bottom:5px">Option B : Abonnement</div>
                <div style="font-size:12px;text-align:center;color:#059669;margin-bottom:20px">Tout inclus, zéro investissement initial</div>
                
                <div style="background:#fff;padding:20px;border-radius:10px;border:1px solid #a7f3d0;text-align:left">
                  <div style="display:flex;justify-content:space-between;margin-bottom:10px">
                    <span>Investissement initial :</span>
                    <span style="color:#10b981;font-weight:900;font-size:16px">0€ OFFERT</span>
                  </div>
                  <div style="display:flex;justify-content:space-between;margin-top:15px;padding-top:15px;border-top:2px solid #10b981;font-size:20px;font-weight:900;color:#065f46">
                    <span>TOTAL TVAC :</span>
                    <span>${pricing.monthlyTTCB}€ / mois</span>
                  </div>
                </div>
                <a href="https://guapowebdesigner.com/confirm-quote?model=B&ref=${refId}&firstName=${encodeURIComponent(data.firstName)}&lastName=${encodeURIComponent(data.lastName)}&email=${encodeURIComponent(data.email)}&company=${encodeURIComponent(data.company || '')}&siteType=${encodeURIComponent(data.siteType)}&monthlyPrice=${pricing.monthlyTTCB}&packName=${encodeURIComponent(pricing.selectedPackName || 'Abonnement complet')}" class="btn btn-b" style="margin-top:20px">CHOISIR CE MODÈLE</a>
              </div>
            `}
        <div style="text-align:center;margin-top:30px;color:#64748b;font-size:13px">
          Besoin d'ajuster ce devis ? <a href="mailto:info@guapowebdesigner.com" style="color:#1e293b;font-weight:700">Répondez simplement à cet email.</a>
          <br><br><span style="font-size:10px">Référence unique : #${refId}</span>
        </div>
      </div>
    </body></html>
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
