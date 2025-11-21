import { Resend } from 'resend';
import { PRICING } from './pricing';

const resend = new Resend(process.env.RESEND_API_KEY);

// Prix par page supplémentaire
const PAGE_EXTRA_COST = 100;

function calculatePricing(data: {
  siteType: string;
  pageCount?: number;
  features?: string[];
  optimization?: string[];
  domain?: string;
  languages?: string[];
  otherLanguages?: string;
}) {
  let minTotal = 0;
  let maxTotal = 0;
  const breakdown: { category: string; item: string; price: string }[] = [];

  // Type de site (prix de base)
  const siteTypeKey = data.siteType as keyof typeof PRICING.siteTypes;
  const siteTypePrice = PRICING.siteTypes[siteTypeKey];
  if (siteTypePrice) {
    minTotal += siteTypePrice.min;
    maxTotal += siteTypePrice.max;
    breakdown.push({
      category: '🎨 Type de site',
      item: data.siteType,
      price: siteTypePrice.min === siteTypePrice.max 
        ? `${siteTypePrice.min}€` 
        : `${siteTypePrice.min}€ - ${siteTypePrice.max}€`
    });
  }

  // Pages supplémentaires
  if (data.pageCount) {
    const pageCount = parseInt(data.pageCount.toString());
    let basePagesLimit = 3;
    
    if (data.siteType.includes('1 à 3 pages')) {
      basePagesLimit = 3;
    } else if (data.siteType.includes('4 à 5 pages')) {
      basePagesLimit = 5;
    } else if (data.siteType.includes('6 à 8 pages')) {
      basePagesLimit = 8;
    } else if (data.siteType.includes('9 à 12 pages')) {
      basePagesLimit = 12;
    }
    
    if (pageCount > basePagesLimit) {
      const extraPages = pageCount - basePagesLimit;
      const extraCost = extraPages * PAGE_EXTRA_COST;
      minTotal += extraCost;
      maxTotal += extraCost;
      breakdown.push({
        category: '📄 Pages supplémentaires',
        item: `${extraPages} page(s) supplémentaire(s)`,
        price: `${extraCost}€`
      });
    }
  }

  // Fonctionnalités
  if (data.features && data.features.length > 0) {
    data.features.forEach(feature => {
      const featureKey = feature as keyof typeof PRICING.features;
      const price = PRICING.features[featureKey];
      if (price !== undefined) {
        minTotal += price;
        maxTotal += price;
        breakdown.push({
          category: '⚡ Fonctionnalités',
          item: feature,
          price: price > 0 ? `${price}€` : 'Inclus'
        });
      }
    });
  }

  // Langues sélectionnées (si multilingue activé)
  if (data.languages && data.languages.length > 0) {
    const langList = [...data.languages];
    if (data.otherLanguages) {
      langList.push(`Autre: ${data.otherLanguages}`);
    }
    breakdown.push({
      category: '🌐 Langues',
      item: langList.join(', '),
      price: 'Inclus dans Multilingue'
    });
  }

  // Optimisation & Sécurité
  if (data.optimization && data.optimization.length > 0) {
    data.optimization.forEach(opt => {
      const optKey = opt as keyof typeof PRICING.optimization;
      const price = PRICING.optimization[optKey];
      if (price !== undefined) {
        minTotal += price;
        maxTotal += price;
        breakdown.push({
          category: '🔒 Optimisation & Sécurité',
          item: opt,
          price: price > 0 ? `${price}€` : 'Inclus'
        });
      }
    });
  }

  // Nom de domaine
  if (data.domain) {
    const domainKey = data.domain as keyof typeof PRICING.domain;
    const price = PRICING.domain[domainKey];
    if (price !== undefined && price > 0) {
      minTotal += price;
      maxTotal += price;
      breakdown.push({
        category: '🌐 Nom de domaine',
        item: `${data.domain} (première année)`,
        price: `${price}€`
      });
    }
  }

  return { minTotal, maxTotal, breakdown };
}

export async function sendQuoteEmail(data: {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  sector?: string;
  siteType: string;
  pageCount?: number;
  features?: string[];
  languages?: string[];
  otherLanguages?: string;
  optimization?: string[];
  hosting?: string;
  domain?: string;
  message: string;
}) {
  console.log('🚀 Starting email send process with Resend...');
  console.log('📧 Email FROM:', process.env.EMAIL_FROM || 'onboarding@resend.dev');
  console.log('📧 Owner Email TO:', process.env.CONTACT_EMAIL_TO || 'info@guapowebdesigner.com');
  console.log('📧 Client Email TO:', data.email);
  
  // Calculer les prix
  const pricing = calculatePricing({
    siteType: data.siteType,
    pageCount: data.pageCount,
    features: data.features,
    languages: data.languages,
    otherLanguages: data.otherLanguages,
    optimization: data.optimization,
    domain: data.domain
  });

  console.log('💰 Pricing calculated:', `${pricing.minTotal}€ - ${pricing.maxTotal}€`);

  // Grouper les éléments par catégorie
  const groupedBreakdown = pricing.breakdown.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push({ item: item.item, price: item.price });
    return acc;
  }, {} as Record<string, { item: string; price: string }[]>);

  // EMAIL 1: Pour le propriétaire (VERSION SIMPLIFIÉE)
  const ownerEmailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 650px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .header {
            background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
            color: white;
            padding: 25px;
            border-radius: 10px 10px 0 0;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            background: white;
            border: 2px solid #e2e8f0;
            border-radius: 0 0 10px 10px;
            padding: 25px;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin: 20px 0;
            padding: 20px;
            background: #f9fafb;
            border-radius: 8px;
          }
          .info-item {
            padding: 10px;
          }
          .info-label {
            font-size: 12px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
          }
          .info-value {
            font-size: 15px;
            color: #1f2937;
            font-weight: 600;
          }
          .price-section {
            background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
            border: 2px solid #8b5cf6;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
          }
          .price-title {
            font-size: 18px;
            font-weight: 700;
            color: #6d28d9;
            text-align: center;
            margin-bottom: 15px;
          }
          .price-grid {
            background: white;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
          }
          .price-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #f3f4f6;
          }
          .price-row:last-child {
            border-bottom: none;
          }
          .price-category {
            font-size: 14px;
            font-weight: 600;
            color: #8b5cf6;
            margin-top: 15px;
            margin-bottom: 8px;
            padding-bottom: 5px;
            border-bottom: 2px solid #e9d5ff;
          }
          .price-category:first-child {
            margin-top: 0;
          }
          .price-label {
            color: #374151;
            font-size: 14px;
          }
          .price-value {
            font-weight: 600;
            color: #8b5cf6;
            font-size: 14px;
          }
          .price-total {
            background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
            color: white;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            font-size: 20px;
            font-weight: 700;
          }
          .message-box {
            background: #f9fafb;
            border-left: 4px solid #8b5cf6;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
          }
          .message-title {
            font-size: 14px;
            font-weight: 600;
            color: #8b5cf6;
            margin-bottom: 10px;
          }
          .message-text {
            color: #4b5563;
            font-size: 14px;
            line-height: 1.6;
          }
          .maintenance-box {
            background: #fef3f4;
            border: 2px solid #8b5cf6;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
          }
          .option-card {
            background: white;
            padding: 15px;
            border-radius: 8px;
            margin: 10px 0;
            border: 2px solid #8b5cf6;
          }
          .gift-box {
            background: #fef3c7;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
            text-align: center;
            font-weight: 600;
            color: #78350f;
          }
          .warning-box {
            background: #fef2f2;
            border: 2px solid #ef4444;
            border-radius: 8px;
            padding: 15px;
            margin: 15px 0;
            text-align: center;
            font-weight: 600;
            color: #991b1b;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
            color: white;
            padding: 12px 25px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin-top: 15px;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #e2e8f0;
            color: #9ca3af;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🆕 Nouvelle Demande de Devis</h1>
        </div>
        <div class="content">
          <!-- Grille d'informations client -->
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Client</div>
              <div class="info-value">${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Email</div>
              <div class="info-value">${escapeHtml(data.email)}</div>
            </div>
            ${data.company ? `
            <div class="info-item">
              <div class="info-label">Entreprise</div>
              <div class="info-value">${escapeHtml(data.company)}</div>
            </div>
            ` : ''}
            ${data.sector ? `
            <div class="info-item">
              <div class="info-label">Secteur</div>
              <div class="info-value">${escapeHtml(data.sector)}</div>
            </div>
            ` : ''}
            <div class="info-item">
              <div class="info-label">Type de site</div>
              <div class="info-value">${escapeHtml(data.siteType)}</div>
            </div>
            ${data.pageCount ? `
            <div class="info-item">
              <div class="info-label">Pages</div>
              <div class="info-value">${escapeHtml(data.pageCount.toString())}</div>
            </div>
            ` : ''}
          </div>

          <!-- Estimation tarifaire -->
          <div class="price-section">
            <div class="price-title">💰 Estimation</div>
            
            <div class="price-grid">
              ${Object.entries(groupedBreakdown).map(([category, items]) => `
                <div class="price-category">${category}</div>
                ${items.map(({ item, price }) => `
                  <div class="price-row">
                    <span class="price-label">${escapeHtml(item)}</span>
                    <span class="price-value">${escapeHtml(price)}</span>
                  </div>
                `).join('')}
              `).join('')}
            </div>

            <div class="price-total">
              ${pricing.minTotal}€ - ${pricing.maxTotal}€
            </div>
          </div>

          <!-- Message du client -->
          ${data.message ? `
          <div class="message-box">
            <div class="message-title">💬 Message du client</div>
            <div class="message-text">${escapeHtml(data.message).replace(/\n/g, '<br>')}</div>
          </div>
          ` : ''}

          <!-- Options de Maintenance Disponibles -->
          ${data.siteType.toLowerCase().includes('vitrine') || data.siteType.toLowerCase().includes('portfolio') || data.siteType.toLowerCase().includes('personnel') ? `
          <div class="maintenance-box">
            <h3 style="color: #8b5cf6; text-align: center; margin-top: 0;">🔧 Options de Maintenance Disponibles</h3>
            <p style="text-align: center; color: #6b7280; font-size: 14px; margin-bottom: 15px;">
              Le client n'a pas encore choisi d'option de maintenance
            </p>

            <div class="option-card">
              <div style="font-weight: 700; color: #8b5cf6; margin-bottom: 8px;">📦 Maintenance Basique - 300€ HT/an (363€ TTC/an)</div>
              <div style="font-size: 13px; color: #4b5563;">
                • 6 interventions/an<br>
                • Interventions supplémentaires : 100€ HT (121€ TTC)<br>
                • Délai : 48h ouvrées
              </div>
            </div>

            <div class="option-card">
              <div style="font-weight: 700; color: #8b5cf6; margin-bottom: 8px;">💳 Par Intervention - 100€ HT (121€ TTC)</div>
              <div style="font-size: 13px; color: #4b5563;">
                • Sans engagement<br>
                • Délai : 48h ouvrées
              </div>
            </div>

            <div class="gift-box">
              🎁 <strong>Le Premier Mois de Maintenance Offert !</strong>
            </div>
          </div>
          ` : data.siteType.toLowerCase().includes('boutique') || data.siteType.toLowerCase().includes('e-commerce') || data.siteType.toLowerCase().includes('ecommerce') ? `
          <div class="maintenance-box">
            <h3 style="color: #8b5cf6; text-align: center; margin-top: 0;">🛒 Options de Maintenance Disponibles</h3>
            <p style="text-align: center; color: #6b7280; font-size: 14px; margin-bottom: 15px;">
              Le client n'a pas encore choisi d'option de maintenance
            </p>

            <div class="option-card">
              <div style="font-weight: 700; color: #8b5cf6; margin-bottom: 8px;">📦 Maintenance Premium - 700€ HT/an (847€ TTC/an)</div>
              <div style="font-size: 13px; color: #4b5563;">
                • 12 interventions/an<br>
                • Interventions supplémentaires : 150€ HT (181.50€ TTC)<br>
                • Délai : 48h ouvrées
              </div>
            </div>

            <div class="option-card">
              <div style="font-weight: 700; color: #8b5cf6; margin-bottom: 8px;">💳 Par Intervention - 150€ HT (181.50€ TTC)</div>
              <div style="font-size: 13px; color: #4b5563;">
                • Sans engagement<br>
                • Délai : 48h ouvrées
              </div>
            </div>

            <div class="gift-box">
              🎁 <strong>Le Premier Mois de Maintenance Offert !</strong>
            </div>
          </div>
          ` : `
          <div class="warning-box">
            ⚠️ Le client n'a pas choisi d'option de maintenance
          </div>
          `}

          <div style="text-align: center;">
            <a href="mailto:${escapeHtml(data.email)}" class="cta-button">
              Répondre au Client
            </a>
          </div>
        </div>

        <div class="footer">
          © 2025 GUAPO Web Designer
        </div>
      </body>
    </html>
  `;

  // EMAIL 2: Pour le client (AVEC CONFIRMATION)
  const clientEmailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 650px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .header {
            background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
            color: white;
            padding: 25px;
            border-radius: 10px 10px 0 0;
            text-align: center;
          }
          .content {
            background: white;
            border: 2px solid #e2e8f0;
            border-radius: 0 0 10px 10px;
            padding: 25px;
          }
          .price-section {
            background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
            border: 2px solid #8b5cf6;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
          }
          .price-title {
            font-size: 18px;
            font-weight: 700;
            color: #6d28d9;
            text-align: center;
            margin-bottom: 15px;
          }
          .price-grid {
            background: white;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
          }
          .price-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #f3f4f6;
          }
          .price-row:last-child {
            border-bottom: none;
          }
          .price-category {
            font-size: 14px;
            font-weight: 600;
            color: #8b5cf6;
            margin-top: 15px;
            margin-bottom: 8px;
            padding-bottom: 5px;
            border-bottom: 2px solid #e9d5ff;
          }
          .price-category:first-child {
            margin-top: 0;
          }
          .price-label {
            color: #374151;
            font-size: 14px;
          }
          .price-value {
            font-weight: 600;
            color: #8b5cf6;
            font-size: 14px;
          }
          .price-subtotal {
            background: #f9fafb;
            padding: 12px 15px;
            border-radius: 8px;
            margin-top: 15px;
            border: 2px solid #e5e7eb;
          }
          .price-total {
            background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
            color: white;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            font-size: 20px;
            font-weight: 700;
            margin-top: 10px;
          }
          .maintenance-explanation {
            background: #f0f9ff;
            border: 2px solid #0ea5e9;
            border-radius: 10px;
            padding: 20px;
            margin: 25px 0;
          }
          .maintenance-box {
            background: white;
            border: 2px solid #8b5cf6;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
          }
          .option-card {
            background: #f9fafb;
            padding: 15px;
            border-radius: 8px;
            margin: 12px 0;
            border: 2px solid #e5e7eb;
          }
          .btn {
            display: inline-block;
            background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
            color: white;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 700;
            margin: 10px 5px;
            font-size: 15px;
          }
          .btn-question {
            background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          }
          .gift-box {
            background: #fef3c7;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
            text-align: center;
            font-weight: 600;
            color: #78350f;
            border: 2px solid #fbbf24;
          }
          .confirmation-box {
            background: #fef3c7;
            border: 2px solid #fbbf24;
            border-radius: 10px;
            padding: 25px;
            margin: 25px 0;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>✅ Demande Reçue</h1>
        </div>
        <div class="content">
          <p>Bonjour ${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)},</p>

          <p>Merci d'avoir fait confiance à <strong style="color: #8b5cf6;">GUAPO Web Designer</strong> ! 
          Nous avons bien reçu votre demande pour <strong>${escapeHtml(data.company || 'votre projet')}</strong>.</p>

          <!-- 1. ESTIMATION DÉTAILLÉE AVEC OPTIONS SÉLECTIONNÉES -->
          <div class="price-section">
            <div class="price-title">💰 Votre Estimation Personnalisée</div>
            
            <div class="price-grid">
              ${Object.entries(groupedBreakdown).map(([category, items]) => `
                <div class="price-category">${category}</div>
                ${items.map(({ item, price }) => `
                  <div class="price-row">
                    <span class="price-label">${escapeHtml(item)}</span>
                    <span class="price-value">${escapeHtml(price)}</span>
                  </div>
                `).join('')}
              `).join('')}
            </div>

            <!-- 2. TOTAL HT + TVA + TOTAL TTC -->
            <div class="price-subtotal">
              <div class="price-row">
                <span class="price-label"><strong>Total HT (Hors TVA)</strong></span>
                <span class="price-value"><strong>${pricing.minTotal === pricing.maxTotal ? `${pricing.minTotal}€` : `${pricing.minTotal}€ - ${pricing.maxTotal}€`}</strong></span>
              </div>
              <div class="price-row">
                <span class="price-label">TVA (21%)</span>
                <span class="price-value">${pricing.minTotal === pricing.maxTotal ? `${Math.round(pricing.minTotal * 0.21)}€` : `${Math.round(pricing.minTotal * 0.21)}€ - ${Math.round(pricing.maxTotal * 0.21)}€`}</span>
              </div>
            </div>

            <div class="price-total">
              Total TTC: ${pricing.minTotal === pricing.maxTotal ? `${Math.round(pricing.minTotal * 1.21)}€` : `${Math.round(pricing.minTotal * 1.21)}€ - ${Math.round(pricing.maxTotal * 1.21)}€`}
            </div>
          </div>

          <!-- 3. EXPLICATION DE LA MAINTENANCE -->
          <div class="maintenance-explanation">
            <h3 style="color: #0369a1; text-align: center; margin-top: 0; font-size: 18px;">
              🔧 Pourquoi la Maintenance est Importante ?
            </h3>
            <p style="color: #475569; font-size: 14px; line-height: 1.7; text-align: center; margin-bottom: 15px;">
              Un site web nécessite un entretien régulier pour rester <strong>sécurisé</strong>, <strong>performant</strong> et <strong>à jour</strong>. 
              La maintenance garantit que votre site fonctionne toujours parfaitement et reste protégé contre les menaces.
            </p>
            
            <div style="background: white; border-radius: 8px; padding: 15px; margin-top: 15px;">
              <div style="font-size: 13px; color: #64748b; line-height: 1.8;">
                ✅ <strong>Mises à jour de sécurité</strong> régulières<br>
                ✅ <strong>Sauvegardes automatiques</strong> de vos données<br>
                ✅ <strong>Optimisation des performances</strong><br>
                ✅ <strong>Support technique</strong> rapide<br>
                ✅ <strong>Corrections de bugs</strong> et améliorations
              </div>
            </div>
          </div>

          <!-- 4. OPTIONS DE MAINTENANCE SELON LE TYPE DE SITE -->
          ${data.siteType.toLowerCase().includes('vitrine') || data.siteType.toLowerCase().includes('portfolio') || data.siteType.toLowerCase().includes('personnel') ? `
          <div class="maintenance-box">
            <h3 style="color: #8b5cf6; text-align: center; margin-top: 0; font-size: 18px;">
              🌐 Options de Maintenance – Sites Vitrines
            </h3>

            <div class="option-card">
              <div style="font-weight: 700; color: #8b5cf6; margin-bottom: 8px; font-size: 15px;">
                📦 Abonnement Annuel - 300€/an HT (363€/an TTC)
              </div>
              <div style="font-size: 13px; color: #4b5563; line-height: 1.7;">
                • <strong>6 interventions incluses par an</strong><br>
                • Interventions supplémentaires : 100€ HT (121€ TTC)<br>
                • Délai d'intervention : 48h ouvrées<br>
                • Idéal pour un suivi régulier de votre site
              </div>
            </div>

            <div class="option-card">
              <div style="font-weight: 700; color: #8b5cf6; margin-bottom: 8px; font-size: 15px;">
                💳 Par Intervention - 100€ HT (121€ TTC)
              </div>
              <div style="font-size: 13px; color: #4b5563; line-height: 1.7;">
                • <strong>Sans engagement</strong><br>
                • Payez uniquement quand vous avez besoin<br>
                • Délai d'intervention : 48h ouvrées<br>
                • Parfait pour des besoins ponctuels
              </div>
            </div>

            <div class="gift-box">
              🎁 <strong>Le Premier Mois de Maintenance Offert !</strong>
            </div>
          </div>
          ` : data.siteType.toLowerCase().includes('boutique') || data.siteType.toLowerCase().includes('e-commerce') || data.siteType.toLowerCase().includes('ecommerce') ? `
          <div class="maintenance-box">
            <h3 style="color: #8b5cf6; text-align: center; margin-top: 0; font-size: 18px;">
              🛒 Options de Maintenance – Sites E-commerce
            </h3>

            <div class="option-card">
              <div style="font-weight: 700; color: #8b5cf6; margin-bottom: 8px; font-size: 15px;">
                📦 Abonnement Annuel - 700€/an HT (847€/an TTC)
              </div>
              <div style="font-size: 13px; color: #4b5563; line-height: 1.7;">
                • <strong>12 interventions incluses par an</strong><br>
                • Interventions supplémentaires : 150€ HT (181.50€ TTC)<br>
                • Délai d'intervention : 48h ouvrées<br>
                • Support prioritaire pour votre boutique en ligne
              </div>
            </div>

            <div class="option-card">
              <div style="font-weight: 700; color: #8b5cf6; margin-bottom: 8px; font-size: 15px;">
                💳 Par Intervention - 150€ HT (181.50€ TTC)
              </div>
              <div style="font-size: 13px; color: #4b5563; line-height: 1.7;">
                • <strong>Sans engagement</strong><br>
                • Payez uniquement quand vous avez besoin<br>
                • Délai d'intervention : 48h ouvrées<br>
                • Flexibilité totale
              </div>
            </div>

            <div class="gift-box">
              🎁 <strong>Le Premier Mois de Maintenance Offert !</strong>
            </div>
          </div>
          ` : ''}

          <!-- 5. BOUTONS DE CONFIRMATION -->
          <div class="confirmation-box">
            <div style="font-size: 18px; font-weight: 700; color: #92400e; margin-bottom: 15px;">
              📋 Cette estimation vous convient ?
            </div>
            <div style="font-size: 14px; color: #78350f; margin-bottom: 20px;">
              Choisissez votre option de maintenance ou posez-nous vos questions
            </div>
            
            ${data.siteType.toLowerCase().includes('vitrine') || data.siteType.toLowerCase().includes('portfolio') || data.siteType.toLowerCase().includes('personnel') ? `
            <a href="https://guapowebdesigner.com/confirm-quote?firstName=${encodeURIComponent(data.firstName)}&lastName=${encodeURIComponent(data.lastName)}&email=${encodeURIComponent(data.email)}&company=${encodeURIComponent(data.company || '')}&siteType=${encodeURIComponent(data.siteType)}&minPrice=${pricing.minTotal}&maxPrice=${pricing.maxTotal}&maintenanceType=${encodeURIComponent('Abonnement Annuel - 300€/an')}" class="btn">
              📦 Confirmer avec Abonnement Annuel
            </a>
            <a href="https://guapowebdesigner.com/confirm-quote?firstName=${encodeURIComponent(data.firstName)}&lastName=${encodeURIComponent(data.lastName)}&email=${encodeURIComponent(data.email)}&company=${encodeURIComponent(data.company || '')}&siteType=${encodeURIComponent(data.siteType)}&minPrice=${pricing.minTotal}&maxPrice=${pricing.maxTotal}&maintenanceType=${encodeURIComponent('Par Intervention - 100€')}" class="btn">
              💳 Confirmer avec Paiement Par Intervention
            </a>
            ` : data.siteType.toLowerCase().includes('boutique') || data.siteType.toLowerCase().includes('e-commerce') || data.siteType.toLowerCase().includes('ecommerce') ? `
            <a href="https://guapowebdesigner.com/confirm-quote?firstName=${encodeURIComponent(data.firstName)}&lastName=${encodeURIComponent(data.lastName)}&email=${encodeURIComponent(data.email)}&company=${encodeURIComponent(data.company || '')}&siteType=${encodeURIComponent(data.siteType)}&minPrice=${pricing.minTotal}&maxPrice=${pricing.maxTotal}&maintenanceType=${encodeURIComponent('Abonnement Annuel - 700€/an')}" class="btn">
              📦 Confirmer avec Abonnement Annuel
            </a>
            <a href="https://guapowebdesigner.com/confirm-quote?firstName=${encodeURIComponent(data.firstName)}&lastName=${encodeURIComponent(data.lastName)}&email=${encodeURIComponent(data.email)}&company=${encodeURIComponent(data.company || '')}&siteType=${encodeURIComponent(data.siteType)}&minPrice=${pricing.minTotal}&maxPrice=${pricing.maxTotal}&maintenanceType=${encodeURIComponent('Par Intervention - 150€')}" class="btn">
              💳 Confirmer avec Paiement Par Intervention
            </a>
            ` : `
            <a href="https://guapowebdesigner.com/confirm-quote?firstName=${encodeURIComponent(data.firstName)}&lastName=${encodeURIComponent(data.lastName)}&email=${encodeURIComponent(data.email)}&company=${encodeURIComponent(data.company || '')}&siteType=${encodeURIComponent(data.siteType)}&minPrice=${pricing.minTotal}&maxPrice=${pricing.maxTotal}" class="btn">
              ✅ Confirmer mon intérêt
            </a>
            `}
            
            <div style="margin-top: 15px;">
              <a href="mailto:info@guapowebdesigner.com?subject=Question%20sur%20mon%20devis%20-%20${encodeURIComponent(data.firstName)}%20${encodeURIComponent(data.lastName)}&body=Bonjour,%0D%0A%0D%0AJ'ai%20une%20question%20concernant%20mon%20devis%20pour%20${encodeURIComponent(data.company || 'mon projet')}%20:%0D%0A%0D%0A" class="btn btn-question">
                💬 Poser une Question
              </a>
            </div>

            <div style="font-size: 12px; color: #78350f; margin-top: 15px; font-style: italic;">
              En cliquant sur "Confirmer", un email sera automatiquement envoyé à notre équipe
            </div>
          </div>

          <div style="background: #f9fafb; border-left: 4px solid #8b5cf6; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <div style="font-weight: 600; color: #6d28d9; margin-bottom: 10px;">📋 Prochaines Étapes</div>
            <div style="font-size: 14px; color: #4b5563;">
              Une fois votre confirmation reçue, notre équipe vous contactera sous <strong>24-48h</strong> pour finaliser les détails de votre projet.
            </div>
          </div>

          <div style="text-align: center; padding: 15px; background: #f3e8ff; border-radius: 8px; margin: 20px 0; font-size: 14px;">
            📧 <strong style="color: #8b5cf6;">info@guapowebdesigner.com</strong><br>
            📱 <strong style="color: #8b5cf6;">@guapo_webdesigner</strong>
          </div>

          <p>À très bientôt,<br><strong style="color: #8b5cf6;">L'équipe GUAPO</strong></p>
        </div>

        <div style="text-align: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid #e2e8f0; color: #9ca3af; font-size: 12px;">
          © 2025 GUAPO Web Designer
        </div>
      </body>
    </html>
  `;

  try {
    console.log('📨 Sending emails via Resend...');
    
    // Envoyer EMAIL 1: Au propriétaire
    console.log('📧 1/2 - Sending email to owner...');
    const ownerResult = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: process.env.CONTACT_EMAIL_TO || 'info@guapowebdesigner.com',
      replyTo: data.email,
      subject: `🎨 Nouvelle demande - ${data.firstName} ${data.lastName} - ${pricing.minTotal}€-${pricing.maxTotal}€`,
      html: ownerEmailHtml,
    });
    console.log('✅ 1/2 - Owner email sent successfully!', ownerResult);

    // Envoyer EMAIL 2: Au client
    console.log('📧 2/2 - Sending confirmation email to client...');
    const clientResult = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: data.email,
      replyTo: process.env.CONTACT_EMAIL_TO || 'info@guapowebdesigner.com',
      subject: `✅ Votre estimation - GUAPO Web Designer`,
      html: clientEmailHtml,
    });
    console.log('✅ 2/2 - Client email sent successfully!', clientResult);

    console.log('🎉 Email process completed with Resend!');
    return { success: true };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw error;
  }
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}