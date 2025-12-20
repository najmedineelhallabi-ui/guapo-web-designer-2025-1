import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, company, siteType, minPrice, maxPrice, maintenanceType, model, monthlyPrice, packName, ref } = body;

    console.log('📧 Sending confirmation email from client to owner...');

    const isModelA = model === 'A';
    const isModelB = model === 'B';

    // Email pour le propriétaire confirmant l'intérêt du client
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
              background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
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
            .alert-success {
              background: #dcfce7;
              border: 3px solid #22c55e;
              border-radius: 10px;
              padding: 20px;
              margin: 20px 0;
              text-align: center;
            }
            .alert-title {
              font-size: 20px;
              font-weight: 700;
              color: #15803d;
              margin-bottom: 10px;
            }
            .alert-text {
              font-size: 15px;
              color: #166534;
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
            .price-box {
              background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
              border: 2px solid #8b5cf6;
              border-radius: 10px;
              padding: 20px;
              margin: 20px 0;
            }
            .price-title {
              font-size: 16px;
              color: #6d28d9;
              font-weight: 700;
              text-align: center;
              margin-bottom: 15px;
            }
            .price-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 15px;
              background: white;
              border-radius: 6px;
              margin-bottom: 8px;
            }
            .price-label {
              font-size: 14px;
              color: #4b5563;
            }
            .price-value {
              font-size: 14px;
              font-weight: 600;
              color: #8b5cf6;
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
            .maintenance-box {
              background: #fef3c7;
              border: 2px solid #fbbf24;
              border-radius: 10px;
              padding: 20px;
              margin: 20px 0;
              text-align: center;
            }
            .maintenance-title {
              font-size: 16px;
              color: #92400e;
              font-weight: 600;
              margin-bottom: 10px;
            }
            .maintenance-value {
              font-size: 18px;
              font-weight: 700;
              color: #78350f;
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
            <h1>✅ Client a confirmé son intérêt !</h1>
          </div>
          <div class="content">
            <div class="alert-success">
              <div class="alert-title">🎉 Bonne nouvelle !</div>
              <div class="alert-text">
                Le client a confirmé son intérêt pour le devis. 
                Il attend votre retour avec un devis détaillé.
              </div>
            </div>

            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Client</div>
                <div class="info-value">${escapeHtml(firstName)} ${escapeHtml(lastName)}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Email</div>
                <div class="info-value">${escapeHtml(email)}</div>
              </div>
              ${company ? `
              <div class="info-item">
                <div class="info-label">Entreprise</div>
                <div class="info-value">${escapeHtml(company)}</div>
              </div>
              ` : ''}
              <div class="info-item">
                <div class="info-label">Type de site</div>
                <div class="info-value">${escapeHtml(siteType)}</div>
              </div>
            </div>

            <div class="price-box">
              <div class="price-title">💰 Estimation confirmée avec TVA</div>
              
              <div class="price-row">
                <span class="price-label">Total HT (Hors TVA)</span>
                <span class="price-value">${minPriceNum === maxPriceNum ? `${minPriceNum}€` : `${minPriceNum}€ - ${maxPriceNum}€`}</span>
              </div>
              
              <div class="price-row">
                <span class="price-label">TVA (21%)</span>
                <span class="price-value">${minPriceTVA === maxPriceTVA ? `${minPriceTVA}€` : `${minPriceTVA}€ - ${maxPriceTVA}€`}</span>
              </div>

              <div class="price-total">
                Total TTC: ${minPriceTTC === maxPriceTTC ? `${minPriceTTC}€` : `${minPriceTTC}€ - ${maxPriceTTC}€`}
              </div>
            </div>

            ${maintenanceType ? `
            <div class="maintenance-box">
              <div class="maintenance-title">🔧 Maintenance choisie par le client</div>
              <div class="maintenance-value">${escapeHtml(maintenanceType)}</div>
              ${maintenanceTTC ? `<div style="font-size: 14px; color: #92400e; margin-top: 8px;">(${maintenanceTTC})</div>` : ''}
            </div>
            ` : ''}

            <div style="background: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 10px; padding: 20px; margin: 20px 0;">
              <h3 style="font-size: 16px; color: #0369a1; font-weight: 700; margin-bottom: 15px; text-align: center;">
                📋 Options de Maintenance Disponibles
              </h3>
              
              <div style="background: white; border-radius: 8px; padding: 15px; margin-bottom: 12px;">
                <div style="font-weight: 600; color: #0c4a6e; margin-bottom: 8px;">
                  🌐 Maintenance Basique - 300€ HT/an (363€ TTC/an)
                </div>
                <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 14px; line-height: 1.8;">
                  <li>Mises à jour de sécurité</li>
                  <li>Sauvegardes régulières</li>
                  <li>Monitoring basique</li>
                  <li>Support par email</li>
                </ul>
              </div>

              <div style="background: white; border-radius: 8px; padding: 15px; margin-bottom: 12px;">
                <div style="font-weight: 600; color: #0c4a6e; margin-bottom: 8px;">
                  💼 Maintenance Premium - 700€ HT/an (847€ TTC/an)
                </div>
                <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 14px; line-height: 1.8;">
                  <li>Tout de la maintenance basique</li>
                  <li>Modifications de contenu illimitées</li>
                  <li>Support prioritaire 24/7</li>
                  <li>Optimisation SEO continue</li>
                  <li>Rapports mensuels de performance</li>
                </ul>
              </div>

              <div style="background: white; border-radius: 8px; padding: 15px;">
                <div style="font-weight: 600; color: #0c4a6e; margin-bottom: 8px;">
                  🔧 Interventions Ponctuelles
                </div>
                <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 14px; line-height: 1.8;">
                  <li>Modifications simples: 100€ HT (121€ TTC)</li>
                  <li>Modifications complexes: 150€ HT (181.50€ TTC)</li>
                </ul>
              </div>

              ${!maintenanceType ? `
              <div style="background: #fef3c7; border-radius: 6px; padding: 12px; margin-top: 12px; text-align: center;">
                <span style="color: #92400e; font-size: 13px;">
                  ⚠️ Le client n'a pas encore choisi d'option de maintenance
                </span>
              </div>
              ` : ''}
            </div>

            <p style="font-size: 15px; color: #1f2937; text-align: center;">
              <strong style="color: #16a34a;">Action requise :</strong><br>
              Préparez et envoyez le devis détaillé au client sous 24-48h.
            </p>

            <div style="text-align: center;">
              <a href="mailto:${escapeHtml(email)}" class="cta-button">
                📧 Répondre au Client
              </a>
            </div>
          </div>

          <div class="footer">
            © 2025 GUAPO Web Designer
          </div>
        </body>
      </html>
    `;

    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: process.env.CONTACT_EMAIL_TO || 'info@guapowebdesigner.com',
      replyTo: email,
      subject: `✅ CONFIRMATION CLIENT - ${firstName} ${lastName} - ${minPriceTTC}€-${maxPriceTTC}€ TTC`,
      html: ownerEmailHtml,
    });

    console.log('✅ Confirmation email sent successfully!', result);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Error sending confirmation email:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send confirmation' },
      { status: 500 }
    );
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