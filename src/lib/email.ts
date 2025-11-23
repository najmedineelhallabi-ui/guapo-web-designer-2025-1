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

  // Calculer les prix avec réduction -30%
  const originalMinPrice = minTotal;
  const originalMaxPrice = maxTotal;
  const minDiscount = Math.round(originalMinPrice * 0.30);
  const maxDiscount = Math.round(originalMaxPrice * 0.30);
  const discountedMinPrice = originalMinPrice - minDiscount;
  const discountedMaxPrice = originalMaxPrice - maxDiscount;

  // Vérifier si on a une fourchette de prix ou un prix fixe
  const hasRange = minTotal !== maxTotal;

  return { 
    minTotal, 
    maxTotal, 
    breakdown,
    originalMinPrice,
    originalMaxPrice,
    minDiscount,
    maxDiscount,
    discountedMinPrice,
    discountedMaxPrice,
    hasRange
  };
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
  
  // Calculer les prix avec réduction -30%
  const pricing = calculatePricing({
    siteType: data.siteType,
    pageCount: data.pageCount,
    features: data.features,
    languages: data.languages,
    otherLanguages: data.otherLanguages,
    optimization: data.optimization,
    domain: data.domain
  });

  console.log('💰 Pricing calculated:', `Original: ${pricing.originalMinPrice}€, Avec -30%: ${pricing.discountedMinPrice}€`);

  // Grouper les éléments par catégorie
  const groupedBreakdown = pricing.breakdown.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push({ item: item.item, price: item.price });
    return acc;
  }, {} as Record<string, { item: string; price: string }[]>);

  // EMAIL 1: Pour le propriétaire (AVEC RÉDUCTION -30%)
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
            max-width: 700px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .header {
            background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
            color: white;
            padding: 30px;
            border-radius: 12px 12px 0 0;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 26px;
            font-weight: 700;
          }
          .header p {
            margin: 8px 0 0 0;
            opacity: 0.95;
            font-size: 14px;
          }
          .content {
            background: white;
            border: 2px solid #e2e8f0;
            border-radius: 0 0 12px 12px;
            padding: 30px;
          }
          .section {
            margin-bottom: 25px;
          }
          .section-title {
            font-size: 18px;
            font-weight: 700;
            color: #8b5cf6;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 3px solid #e9d5ff;
          }
          .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            background: #f9fafb;
            border-radius: 10px;
            padding: 20px;
            border: 2px solid #e5e7eb;
          }
          .info-item {
            padding: 12px;
            background: white;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
          }
          .info-label {
            font-size: 11px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            font-weight: 600;
            margin-bottom: 6px;
          }
          .info-value {
            font-size: 15px;
            color: #1f2937;
            font-weight: 600;
            word-break: break-word;
          }
          .features-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin-top: 10px;
          }
          .feature-tag {
            background: #f3e8ff;
            color: #7c3aed;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 600;
            border: 2px solid #e9d5ff;
            text-align: center;
          }
          .price-section {
            background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
            border: 3px solid #8b5cf6;
            border-radius: 12px;
            padding: 25px;
            margin: 25px 0;
          }
          .price-title {
            font-size: 20px;
            font-weight: 700;
            color: #6d28d9;
            text-align: center;
            margin-bottom: 20px;
          }
          .price-breakdown {
            background: white;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
          }
          .price-category {
            font-size: 15px;
            font-weight: 700;
            color: #8b5cf6;
            margin-top: 18px;
            margin-bottom: 10px;
            padding-bottom: 6px;
            border-bottom: 2px solid #e9d5ff;
          }
          .price-category:first-child {
            margin-top: 0;
          }
          .price-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #f3f4f6;
            align-items: center;
          }
          .price-row:last-child {
            border-bottom: none;
          }
          .price-label {
            color: #374151;
            font-size: 14px;
            font-weight: 500;
          }
          .price-value {
            font-weight: 700;
            color: #8b5cf6;
            font-size: 15px;
          }
          .discount-highlight {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
            padding: 18px;
            border-radius: 10px;
            margin: 20px 0;
            text-align: center;
          }
          .discount-label {
            font-size: 14px;
            opacity: 0.95;
            margin-bottom: 8px;
          }
          .discount-amount {
            font-size: 32px;
            font-weight: 700;
          }
          .price-summary {
            background: white;
            border-radius: 10px;
            padding: 18px;
            margin-top: 15px;
          }
          .price-final {
            background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
            color: white;
            padding: 18px;
            border-radius: 10px;
            text-align: center;
            font-size: 22px;
            font-weight: 700;
            margin-top: 15px;
          }
          .message-box {
            background: #fef3c7;
            border-left: 5px solid #f59e0b;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .message-title {
            font-size: 15px;
            font-weight: 700;
            color: #92400e;
            margin-bottom: 12px;
          }
          .message-text {
            color: #78350f;
            font-size: 14px;
            line-height: 1.7;
            white-space: pre-wrap;
          }
          .maintenance-section {
            background: #f0f9ff;
            border: 3px solid #0ea5e9;
            border-radius: 12px;
            padding: 25px;
            margin: 25px 0;
          }
          .maintenance-title {
            color: #0369a1;
            text-align: center;
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 15px;
          }
          .option-card {
            background: white;
            padding: 18px;
            border-radius: 10px;
            margin: 12px 0;
            border: 2px solid #0ea5e9;
          }
          .option-name {
            font-weight: 700;
            color: #0369a1;
            margin-bottom: 10px;
            font-size: 15px;
          }
          .option-details {
            font-size: 13px;
            color: #475569;
            line-height: 1.6;
          }
          .gift-banner {
            background: #fef3c7;
            padding: 15px;
            border-radius: 8px;
            margin-top: 15px;
            text-align: center;
            font-weight: 700;
            color: #78350f;
            border: 2px solid #fbbf24;
          }
          .action-buttons {
            text-align: center;
            margin-top: 30px;
          }
          .btn {
            display: inline-block;
            background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
            color: white;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 10px;
            font-weight: 700;
            margin: 8px;
            font-size: 15px;
          }
          .footer {
            text-align: center;
            margin-top: 25px;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
            color: #9ca3af;
            font-size: 13px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎨 Nouvelle Demande de Devis</h1>
          <p>Vous avez reçu une nouvelle demande de création de site web</p>
        </div>
        
        <div class="content">
          <!-- INFORMATIONS CLIENT -->
          <div class="section">
            <div class="section-title">👤 Informations Client</div>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Nom Complet</div>
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
                <div class="info-label">Secteur d'Activité</div>
                <div class="info-value">${escapeHtml(data.sector)}</div>
              </div>
              ` : ''}
            </div>
          </div>

          <!-- DÉTAILS DU PROJET -->
          <div class="section">
            <div class="section-title">📋 Détails du Projet</div>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Type de Site</div>
                <div class="info-value">${escapeHtml(data.siteType)}</div>
              </div>
              ${data.pageCount ? `
              <div class="info-item">
                <div class="info-label">Nombre de Pages</div>
                <div class="info-value">${escapeHtml(data.pageCount.toString())} pages</div>
              </div>
              ` : ''}
              ${data.hosting ? `
              <div class="info-item">
                <div class="info-label">Hébergement</div>
                <div class="info-value">${escapeHtml(data.hosting)}</div>
              </div>
              ` : ''}
              ${data.domain ? `
              <div class="info-item">
                <div class="info-label">Nom de Domaine</div>
                <div class="info-value">${escapeHtml(data.domain)}</div>
              </div>
              ` : ''}
            </div>

            ${data.features && data.features.length > 0 ? `
            <div style="margin-top: 20px;">
              <div style="font-size: 14px; font-weight: 600; color: #6b7280; margin-bottom: 10px;">⚡ Fonctionnalités Demandées:</div>
              <div class="features-grid">
                ${data.features.map(feature => `<div class="feature-tag">${escapeHtml(feature)}</div>`).join('')}
              </div>
            </div>
            ` : ''}

            ${data.languages && data.languages.length > 0 ? `
            <div style="margin-top: 15px;">
              <div style="font-size: 14px; font-weight: 600; color: #6b7280; margin-bottom: 10px;">🌐 Langues:</div>
              <div class="features-grid">
                ${data.languages.map(lang => `<div class="feature-tag">${escapeHtml(lang)}</div>`).join('')}
                ${data.otherLanguages ? `<div class="feature-tag">Autre: ${escapeHtml(data.otherLanguages)}</div>` : ''}
              </div>
            </div>
            ` : ''}

            ${data.optimization && data.optimization.length > 0 ? `
            <div style="margin-top: 15px;">
              <div style="font-size: 14px; font-weight: 600; color: #6b7280; margin-bottom: 10px;">🔒 Optimisation & Sécurité:</div>
              <div class="features-grid">
                ${data.optimization.map(opt => `<div class="feature-tag">${escapeHtml(opt)}</div>`).join('')}
              </div>
            </div>
            ` : ''}
          </div>

          <!-- ESTIMATION TARIFAIRE -->
          <div class="price-section">
            <div class="price-title">💰 Estimation Tarifaire avec -30%</div>
            
            <div class="price-breakdown">
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

            <div class="discount-highlight">
              <div class="discount-label">🎉 Réduction Promotionnelle -30%</div>
              <div class="discount-amount">${pricing.hasRange ? `-${pricing.minDiscount}€ à -${pricing.maxDiscount}€` : `-${pricing.minDiscount}€`}</div>
            </div>

            <div class="price-summary">
              <div class="price-row">
                <span class="price-label" style="text-decoration: line-through; opacity: 0.6;">Prix Original HT</span>
                <span class="price-value" style="text-decoration: line-through; opacity: 0.6;">${pricing.hasRange ? `${pricing.originalMinPrice}€ à ${pricing.originalMaxPrice}€` : `${pricing.originalMinPrice}€`}</span>
              </div>
              <div class="price-row">
                <span class="price-label"><strong>Prix avec -30% HT</strong></span>
                <strong class="price-value" style="font-size: 17px;">${pricing.hasRange ? `${pricing.discountedMinPrice}€ à ${pricing.discountedMaxPrice}€` : `${pricing.discountedMinPrice}€`}</strong>
              </div>
              <div class="price-row">
                <span class="price-label">TVA (21%)</span>
                <span class="price-value">${pricing.hasRange ? `${Math.round(pricing.discountedMinPrice * 0.21)}€ à ${Math.round(pricing.discountedMaxPrice * 0.21)}€` : `${Math.round(pricing.discountedMinPrice * 0.21)}€`}</span>
              </div>
            </div>

            <div class="price-final">
              💳 Total TTC: ${pricing.hasRange ? `${Math.round(pricing.discountedMinPrice * 1.21)}€ à ${Math.round(pricing.discountedMaxPrice * 1.21)}€` : `${Math.round(pricing.discountedMinPrice * 1.21)}€`}
            </div>
          </div>

          <!-- MESSAGE DU CLIENT -->
          ${data.message ? `
          <div class="message-box">
            <div class="message-title">💬 Message du Client</div>
            <div class="message-text">${escapeHtml(data.message)}</div>
          </div>
          ` : ''}

          <!-- OPTIONS DE MAINTENANCE -->
          ${data.siteType.toLowerCase().includes('vitrine') || data.siteType.toLowerCase().includes('portfolio') || data.siteType.toLowerCase().includes('personnel') ? `
          <div class="maintenance-section">
            <h3 class="maintenance-title">🔧 Options de Maintenance Disponibles</h3>
            <p style="text-align: center; color: #475569; font-size: 14px; margin-bottom: 15px;">
              Le client n'a pas encore sélectionné d'option de maintenance
            </p>

            <div class="option-card">
              <div class="option-name">📦 Maintenance Annuelle - 300€ HT/an (363€ TTC/an)</div>
              <div class="option-details">
                ✓ 6 interventions incluses par an<br>
                ✓ Interventions supplémentaires : 100€ HT (121€ TTC)<br>
                ✓ Délai d'intervention : 48h ouvrées<br>
                ✓ Support prioritaire
              </div>
            </div>

            <div class="option-card">
              <div class="option-name">💳 Maintenance par Intervention - 100€ HT (121€ TTC)</div>
              <div class="option-details">
                ✓ Sans engagement<br>
                ✓ Paiement à la demande<br>
                ✓ Délai d'intervention : 48h ouvrées<br>
                ✓ Idéal pour besoins ponctuels
              </div>
            </div>

            <div class="gift-banner">
              🎁 <strong>Premier Mois de Maintenance Offert !</strong>
            </div>
          </div>
          ` : data.siteType.toLowerCase().includes('boutique') || data.siteType.toLowerCase().includes('e-commerce') || data.siteType.toLowerCase().includes('ecommerce') ? `
          <div class="maintenance-section">
            <h3 class="maintenance-title">🛒 Options de Maintenance E-commerce</h3>
            <p style="text-align: center; color: #475569; font-size: 14px; margin-bottom: 15px;">
              Le client n'a pas encore sélectionné d'option de maintenance
            </p>

            <div class="option-card">
              <div class="option-name">📦 Maintenance Premium - 700€ HT/an (847€ TTC/an)</div>
              <div class="option-details">
                ✓ 12 interventions incluses par an<br>
                ✓ Interventions supplémentaires : 150€ HT (181.50€ TTC)<br>
                ✓ Délai d'intervention : 48h ouvrées<br>
                ✓ Support prioritaire<br>
                ✓ Suivi des performances e-commerce
              </div>
            </div>

            <div class="option-card">
              <div class="option-name">💳 Maintenance par Intervention - 150€ HT (181.50€ TTC)</div>
              <div class="option-details">
                ✓ Sans engagement<br>
                ✓ Paiement à la demande<br>
                ✓ Délai d'intervention : 48h ouvrées<br>
                ✓ Idéal pour besoins ponctuels
              </div>
            </div>

            <div class="gift-banner">
              🎁 <strong>Premier Mois de Maintenance Offert !</strong>
            </div>
          </div>
          ` : `
          <div style="background: #fef2f2; border: 2px solid #ef4444; border-radius: 8px; padding: 15px; margin: 20px 0; text-align: center;">
            <strong style="color: #991b1b;">⚠️ Aucune option de maintenance sélectionnée</strong>
          </div>
          `}

          <!-- ACTIONS -->
          <div class="action-buttons">
            <a href="mailto:${escapeHtml(data.email)}" class="btn">
              📧 Répondre au Client
            </a>
          </div>
        </div>

        <div class="footer">
          © 2025 GUAPO Web Designer - Gestion des Devis
        </div>
      </body>
    </html>
  `;

  // EMAIL 2: Pour le client (VERSION ULTRA-OPTIMISÉE - MAXIMUM COMPACT AVEC -30%)
  
  // Créer un résumé du devis pour le bouton Question
  const quoteSummary = `Bonjour,

J'ai reçu mon estimation de devis et j'aurais une question concernant mon projet :

--- RÉSUMÉ DE MON DEVIS ---
Entreprise: ${data.company || 'Mon projet'}
Type de site: ${data.siteType}
Nombre de pages: ${data.pageCount || 'Non spécifié'}
${data.features && data.features.length > 0 ? `Fonctionnalités: ${data.features.join(', ')}` : ''}
${data.optimization && data.optimization.length > 0 ? `Optimisation: ${data.optimization.join(', ')}` : ''}
${data.hosting ? `Hébergement: ${data.hosting}` : ''}
${data.domain ? `Domaine: ${data.domain}` : ''}

${pricing.hasRange 
  ? `Prix original: ${pricing.originalMinPrice}€ à ${pricing.originalMaxPrice}€ HT
Réduction -30%: -${pricing.minDiscount}€ à -${pricing.maxDiscount}€
Prix final: ${pricing.discountedMinPrice}€ à ${pricing.discountedMaxPrice}€ HT (${Math.round(pricing.discountedMinPrice * 1.21)}€ à ${Math.round(pricing.discountedMaxPrice * 1.21)}€ TTC)`
  : `Prix original: ${pricing.originalMinPrice}€ HT
Réduction -30%: -${pricing.minDiscount}€
Prix final: ${pricing.discountedMinPrice}€ HT (${Math.round(pricing.discountedMinPrice * 1.21)}€ TTC)`
}
-----------------------

Ma question:
[Écrivez votre question ici]

Cordialement,
${data.firstName} ${data.lastName}
${data.email}`;

  const mailtoQuestionLink = `mailto:info@guapowebdesigner.com?subject=${encodeURIComponent(`Question concernant mon devis - ${data.company || data.firstName}`)}&body=${encodeURIComponent(quoteSummary)}`;

  const clientEmailHtml = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
body{font-family:Arial,sans-serif;color:#333;max-width:600px;margin:0 auto;padding:15px;background:#f8f9fa}
.h{background:linear-gradient(135deg,#8b5cf6,#a855f7);color:#fff;padding:20px;border-radius:8px 8px 0 0;text-align:center}
.c{background:#fff;border:2px solid #e2e8f0;border-radius:0 0 8px 8px;padding:20px}
.ps{background:linear-gradient(135deg,#f3e8ff,#e9d5ff);border:2px solid #8b5cf6;border-radius:8px;padding:15px;margin:15px 0}
.pg{background:#fff;border-radius:6px;padding:12px;margin-bottom:12px}
.pr{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f3f4f6;font-size:13px}
.pr:last-child{border-bottom:none}
.pc{font-size:13px;font-weight:600;color:#8b5cf6;margin-top:10px;margin-bottom:5px;padding-bottom:3px;border-bottom:2px solid #e9d5ff}
.pc:first-child{margin-top:0}
.db{background:linear-gradient(135deg,#ef4444,#dc2626);color:#fff;padding:12px;border-radius:6px;margin:10px 0;text-align:center}
.pst{background:#f9fafb;padding:10px 12px;border-radius:6px;margin-top:12px;border:2px solid #e5e7eb}
.pt{background:linear-gradient(135deg,#8b5cf6,#a855f7);color:#fff;padding:12px;border-radius:6px;text-align:center;font-size:18px;font-weight:700;margin-top:8px}
.mb{background:#f0f9ff;border:2px solid #0ea5e9;border-radius:8px;padding:15px;margin:15px 0}
.oc{background:#fff;padding:10px;border-radius:6px;margin:8px 0;border:2px solid #8b5cf6}
.btn{display:inline-block;background:linear-gradient(135deg,#16a34a,#22c55e);color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:700;margin:8px 4px;font-size:14px}
.btn-q{background:linear-gradient(135deg,#8b5cf6,#a855f7)}
.gift{background:#fef3c7;padding:10px;border-radius:6px;margin:10px 0;text-align:center;font-weight:600;color:#78350f;border:2px solid#fbbf24;font-size:13px}
.cb{background:#fef3c7;border:2px solid#fbbf24;border-radius:8px;padding:15px;margin:15px 0;text-align:center}
</style>
</head>
<body>
<div class="h"><h1 style="margin:0;font-size:22px">✅ Demande Reçue</h1></div>
<div class="c">
<p style="margin:10px 0">Bonjour ${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)},</p>
<p style="margin:10px 0">Merci pour <strong style="color:#8b5cf6">GUAPO Web Designer</strong> ! Demande reçue pour <strong>${escapeHtml(data.company || 'votre projet')}</strong>.</p>

<div class="ps">
<div style="font-size:16px;font-weight:700;color:#6d28d9;text-align:center;margin-bottom:12px">💰 Votre Estimation (-30%)</div>
<div class="pg">
${Object.entries(groupedBreakdown).map(([category, items]) => `
<div class="pc">${category}</div>
${items.map(({ item, price }) => `
<div class="pr"><span>${escapeHtml(item)}</span><strong style="color:#8b5cf6">${escapeHtml(price)}</strong></div>
`).join('')}
`).join('')}
</div>
<div class="db">
<div style="font-size:12px;opacity:0.9;margin-bottom:5px">🎉 Réduction -30%</div>
<div style="font-size:24px;font-weight:700">${pricing.hasRange ? `-${pricing.minDiscount}€ à -${pricing.maxDiscount}€` : `-${pricing.minDiscount}€`}</div>
</div>
<div class="pst">
<div class="pr"><span style="text-decoration:line-through;opacity:0.6">Prix original</span><span style="text-decoration:line-through;opacity:0.6">${pricing.hasRange ? `${pricing.originalMinPrice}€ à ${pricing.originalMaxPrice}€ HT` : `${pricing.originalMinPrice}€ HT`}</span></div>
<div class="pr"><span><strong>Prix avec -30%</strong></span><strong style="color:#8b5cf6">${pricing.hasRange ? `${pricing.discountedMinPrice}€ à ${pricing.discountedMaxPrice}€ HT` : `${pricing.discountedMinPrice}€ HT`}</strong></div>
<div class="pr"><span>TVA (21%)</span><strong style="color:#8b5cf6">${pricing.hasRange ? `${Math.round(pricing.discountedMinPrice * 0.21)}€ à ${Math.round(pricing.discountedMaxPrice * 0.21)}€` : `${Math.round(pricing.discountedMinPrice * 0.21)}€`}</strong></div>
</div>
<div class="pt">Total TTC: ${pricing.hasRange ? `${Math.round(pricing.discountedMinPrice * 1.21)}€ à ${Math.round(pricing.discountedMaxPrice * 1.21)}€` : `${Math.round(pricing.discountedMinPrice * 1.21)}€`}</div>
</div>

<div class="mb">
<h3 style="color:#0369a1;text-align:center;margin:0 0 8px 0;font-size:15px">🔧 Pourquoi Maintenance ?</h3>
<p style="color:#475569;font-size:12px;text-align:center;margin:8px 0">Site nécessite entretien pour rester <strong>sécurisé</strong> et <strong>performant</strong>.</p>
<div style="background:#fff;border-radius:5px;padding:10px;font-size:11px;color:#64748b">
✅ Sécurité ✅ Sauvegardes ✅ Performance ✅ Support ✅ Corrections
</div>
</div>

${data.siteType.toLowerCase().includes('vitrine') || data.siteType.toLowerCase().includes('portfolio') || data.siteType.toLowerCase().includes('personnel') ? `
<div style="background:#fff;border:2px solid#8b5cf6;border-radius:8px;padding:12px;margin:15px 0">
<h3 style="color:#8b5cf6;text-align:center;margin:0 0 10px 0;font-size:15px">🌐 Options Vitrines</h3>
<div class="oc">
<div style="font-weight:700;color:#8b5cf6;margin-bottom:5px;font-size:13px">📦 Annuel - 300€ HT/an (363€ TTC)</div>
<div style="font-size:11px;color:#4b5563">• 6 interventions/an • Supp: 100€ HT • Délai 48h</div>
</div>
<div class="oc">
<div style="font-weight:700;color:#8b5cf6;margin-bottom:5px;font-size:13px">💳 Intervention - 100€ HT (121€ TTC)</div>
<div style="font-size:11px;color:#4b5563">• Sans engagement • Paiement à la demande</div>
</div>
<div class="gift">🎁 Premier Mois Offert !</div>
</div>
` : data.siteType.toLowerCase().includes('boutique') || data.siteType.toLowerCase().includes('e-commerce') || data.siteType.toLowerCase().includes('ecommerce') ? `
<div style="background:#fff;border:2px solid#8b5cf6;border-radius:8px;padding:12px;margin:15px 0">
<h3 style="color:#8b5cf6;text-align:center;margin:0 0 10px 0;font-size:15px">🛒 Options E-commerce</h3>
<div class="oc">
<div style="font-weight:700;color:#8b5cf6;margin-bottom:5px;font-size:13px">📦 Annuel - 700€ HT/an (847€ TTC)</div>
<div style="font-size:11px;color:#4b5563">• 12 interventions/an • Supp: 150€ HT • Délai 48h</div>
</div>
<div class="oc">
<div style="font-weight:700;color:#8b5cf6;margin-bottom:5px;font-size:13px">💳 Intervention - 150€ HT (181.50€ TTC)</div>
<div style="font-size:11px;color:#4b5563">• Sans engagement • Paiement à la demande</div>
</div>
<div class="gift">🎁 Premier Mois Offert !</div>
</div>
` : ''}

<div class="cb">
<div style="font-size:15px;font-weight:700;color:#92400e;margin-bottom:10px">📋 Estimation OK ?</div>
<div style="font-size:12px;color:#78350f;margin-bottom:12px">Choisissez maintenance ou posez questions</div>
${data.siteType.toLowerCase().includes('vitrine') || data.siteType.toLowerCase().includes('portfolio') || data.siteType.toLowerCase().includes('personnel') ? `
<a href="https://guapowebdesigner.com/confirm-quote?firstName=${encodeURIComponent(data.firstName)}&lastName=${encodeURIComponent(data.lastName)}&email=${encodeURIComponent(data.email)}&company=${encodeURIComponent(data.company || '')}&siteType=${encodeURIComponent(data.siteType)}&minPrice=${pricing.discountedMinPrice}&maxPrice=${pricing.discountedMaxPrice}&maintenanceType=${encodeURIComponent('Annuel 300€/an')}" class="btn">📦 Confirmer Annuel</a>
<a href="https://guapowebdesigner.com/confirm-quote?firstName=${encodeURIComponent(data.firstName)}&lastName=${encodeURIComponent(data.lastName)}&email=${encodeURIComponent(data.email)}&company=${encodeURIComponent(data.company || '')}&siteType=${encodeURIComponent(data.siteType)}&minPrice=${pricing.discountedMinPrice}&maxPrice=${pricing.discountedMaxPrice}&maintenanceType=${encodeURIComponent('Intervention 100€')}" class="btn">💳 Confirmer Intervention</a>
` : data.siteType.toLowerCase().includes('boutique') || data.siteType.toLowerCase().includes('e-commerce') || data.siteType.toLowerCase().includes('ecommerce') ? `
<a href="https://guapowebdesigner.com/confirm-quote?firstName=${encodeURIComponent(data.firstName)}&lastName=${encodeURIComponent(data.lastName)}&email=${encodeURIComponent(data.email)}&company=${encodeURIComponent(data.company || '')}&siteType=${encodeURIComponent(data.siteType)}&minPrice=${pricing.discountedMinPrice}&maxPrice=${pricing.discountedMaxPrice}&maintenanceType=${encodeURIComponent('Annuel 700€/an')}" class="btn">📦 Confirmer Annuel</a>
<a href="https://guapowebdesigner.com/confirm-quote?firstName=${encodeURIComponent(data.firstName)}&lastName=${encodeURIComponent(data.lastName)}&email=${encodeURIComponent(data.email)}&company=${encodeURIComponent(data.company || '')}&siteType=${encodeURIComponent(data.siteType)}&minPrice=${pricing.discountedMinPrice}&maxPrice=${pricing.discountedMaxPrice}&maintenanceType=${encodeURIComponent('Intervention 150€')}" class="btn">💳 Confirmer Intervention</a>
` : `
<a href="https://guapowebdesigner.com/confirm-quote?firstName=${encodeURIComponent(data.firstName)}&lastName=${encodeURIComponent(data.lastName)}&email=${encodeURIComponent(data.email)}&company=${encodeURIComponent(data.company || '')}&siteType=${encodeURIComponent(data.siteType)}&minPrice=${pricing.discountedMinPrice}&maxPrice=${pricing.discountedMaxPrice}" class="btn">✅ Confirmer</a>
`}
<div style="margin-top:10px">
<a href="${mailtoQuestionLink}" class="btn btn-q">💬 Question avec Résumé</a>
</div>
<div style="font-size:10px;color:#78350f;margin-top:10px;font-style:italic">Cliquer "Question" ouvre email pré-rempli avec votre résumé de devis</div>
</div>

<div style="background:#f9fafb;border-left:4px solid#8b5cf6;border-radius:6px;padding:10px;margin:12px 0">
<div style="font-weight:600;color:#6d28d9;margin-bottom:6px;font-size:13px">📋 Prochaines Étapes</div>
<div style="font-size:12px;color:#4b5563">Contact sous <strong>24-48h</strong> pour finaliser.</div>
</div>

<div style="text-align:center;padding:10px;background:#f3e8ff;border-radius:6px;margin:12px 0;font-size:12px">
📧 <strong style="color:#8b5cf6">info@guapowebdesigner.com</strong><br>
📱 <strong style="color:#8b5cf6">@guapo_webdesigner</strong>
</div>

<p style="margin:10px 0">À bientôt,<br><strong style="color:#8b5cf6">L'équipe GUAPO</strong></p>
</div>
<div style="text-align:center;margin-top:12px;padding-top:10px;border-top:1px solid#e2e8f0;color:#9ca3af;font-size:10px">© 2025 GUAPO Web Designer</div>
</body>
</html>
  `;

  try {
    console.log('📨 Sending emails via Resend...');
    
    // Envoyer EMAIL 1: Au propriétaire (MÊME EMAIL QUE LE CLIENT)
    console.log('📧 1/2 - Sending email to owner...');
    const ownerResult = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: process.env.CONTACT_EMAIL_TO || 'info@guapowebdesigner.com',
      replyTo: data.email,
      subject: `🎨 Nouvelle demande - ${data.firstName} ${data.lastName} - ${pricing.hasRange ? `${pricing.discountedMinPrice}€ à ${pricing.discountedMaxPrice}€` : `${pricing.discountedMinPrice}€`} (-30%)`,
      html: ownerEmailHtml,
    });
    console.log('✅ 1/2 - Owner email sent successfully!', ownerResult);

    // Envoyer EMAIL 2: Au client
    console.log('📧 2/2 - Sending confirmation email to client...');
    const clientResult = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: data.email,
      replyTo: process.env.CONTACT_EMAIL_TO || 'info@guapowebdesigner.com',
      subject: `✅ Votre estimation avec -30% - GUAPO Web Designer`,
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