import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, company, siteType, minPrice, maxPrice, model, monthlyPrice, packName, ref } = body;

    const isModelA = model === 'A';
    const isModelB = model === 'B';

    // Email ultra-clair pour Guapo Web Designer
    const ownerEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; background: #f1f5f9; }
            .card { background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); border: 1px solid #e2e8f0; }
            .header { background: ${isModelB ? '#10b981' : '#1e293b'}; color: white; padding: 35px 30px; text-align: center; }
            .content { padding: 30px; }
            .badge { display: inline-block; padding: 6px 16px; border-radius: 50px; font-weight: 800; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 15px; }
            .choice-badge { background: white; color: ${isModelB ? '#10b981' : '#1e293b'}; border: 1px solid white; }
            .section { margin-bottom: 25px; padding: 18px; border-radius: 12px; background: #f8fafc; border: 1px solid #e2e8f0; }
            .label { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 1.2px; font-weight: 800; margin-bottom: 8px; }
            .value { font-size: 15px; color: #0f172a; font-weight: 700; }
            .price-card { background: #ffffff; border-radius: 16px; padding: 25px; border: 2px solid ${isModelB ? '#10b981' : '#1e293b'}; margin-top: 20px; text-align: center; }
            .price-value { font-size: 32px; font-weight: 900; color: #0f172a; letter-spacing: -1px; }
            .price-sub { font-size: 13px; color: #64748b; font-weight: 500; margin-top: 4px; }
            .btn { display: block; background: #1e293b; color: white !important; padding: 16px; border-radius: 12px; text-decoration: none; font-weight: 800; text-align: center; margin-top: 25px; font-size: 15px; }
            .info-row { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
            .icon { font-size: 16px; width: 20px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <div style="font-size: 40px; margin-bottom: 10px;">⚡</div>
              <h1 style="margin:0;font-size:24px;font-weight:900;letter-spacing:-0.5px; text-transform: uppercase;">Choix Client Validé</h1>
              <p style="margin:8px 0 0 0;opacity:0.9;font-weight:500;font-size:14px;">Une nouvelle opportunité à concrétiser.</p>
            </div>
            <div class="content">
              <div style="text-align:center">
                <div class="badge choice-badge">
                  OFFRE ACCEPTÉE : ${isModelB ? 'MODÈLE B (ABONNEMENT)' : 'MODÈLE A (ACHAT)'}
                </div>
              </div>
  
              <div class="section">
                <div class="label">👤 CONTACT CLIENT</div>
                <div class="value" style="font-size: 17px; margin-bottom: 10px;">${escapeHtml(firstName)} ${escapeHtml(lastName)}</div>
                <div class="info-row">
                  <span class="icon">📧</span> <a href="mailto:${email}" style="color:#6366f1; text-decoration:none; font-weight:600;">${escapeHtml(email)}</a>
                </div>
                ${company ? `<div class="info-row"><span class="icon">🏢</span> <span style="font-weight:700">${escapeHtml(company)}</span></div>` : ''}
              </div>
  
              <div class="section">
                <div class="label">🌐 DÉTAILS DU PROJET</div>
                <div class="value">${escapeHtml(siteType)}</div>
                <div style="font-size:11px;color:#94a3b8;margin-top:8px;font-weight:600;">RÉFÉRENCE DEVIS : #${ref || 'N/A'}</div>
              </div>
  
              <div class="price-card">
                <div class="label" style="margin-bottom: 20px;"><span style="background:${isModelB ? '#10b981' : '#1e293b'}; color:white; padding:4px 12px; border-radius:4px;">RÉCAPITULATIF FINANCIER (TVAC)</span></div>
                
                ${isModelA ? `
                  <div style="margin-bottom: 20px;">
                    <div class="label">Investissement Initial (Achat)</div>
                    <div class="price-value">${minPrice === maxPrice ? `${minPrice}€` : `${minPrice}€ - ${maxPrice}€`}</div>
                    <div class="price-sub">Règlement unique</div>
                  </div>
                  <div style="padding-top: 20px; border-top: 1px solid #f1f5f9;">
                    <div class="label">🛠️ Pack Maintenance</div>
                    <div class="price-value" style="font-size: 26px; color: #6366f1;">${monthlyPrice}€<span style="font-size:15px; font-weight:600;">/mois</span></div>
                    <div class="price-sub">${escapeHtml(packName || 'Maintenance & Suivi')}</div>
                  </div>
                ` : `
                  <div style="margin-bottom: 20px;">
                    <div class="label">Investissement Initial</div>
                    <div class="price-value" style="color: #10b981;">OFFERT</div>
                    <div class="price-sub">Frais de mise en place : 0€</div>
                  </div>
                  <div style="padding-top: 20px; border-top: 1px solid #f1f5f9;">
                    <div class="label">🔄 Abonnement All-In</div>
                    <div class="price-value" style="font-size: 30px; color: #059669;">${monthlyPrice}€<span style="font-size:16px; font-weight:600;">/mois</span></div>
                    <div class="price-sub">Pack : ${escapeHtml(packName || 'Complet')}</div>
                  </div>
                `}
              </div>
  
              <a href="mailto:${email}" class="btn" style="background:${isModelB ? '#10b981' : '#1e293b'}">RÉPONDRE AU CLIENT</a>
              
              <div style="text-align:center; margin-top:25px; font-size:10px; color:#94a3b8; text-transform:uppercase; letter-spacing:1px; font-weight:600;">
                Guapo Web Designer Dashboard © 2025
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

              <a href="mailto:${email}" class="btn">CONTACTER LE CLIENT</a>
              
              <div style="text-align:center; margin-top:30px; font-size:11px; color:#94a3b8; text-transform:uppercase; letter-spacing:1px;">
                Guapo Web Designer Automations © 2025
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: 'info@guapowebdesigner.com',
      replyTo: email,
      subject: `✅ CHOIX ${model} : ${firstName} ${lastName} (#${ref || 'SANS-REF'})`,
      html: ownerEmailHtml,
    });

    return NextResponse.json({ success: true, id: result.data?.id });
  } catch (error) {
    console.error('❌ Error confirming quote:', error);
    return NextResponse.json({ success: false, error: 'Failed to send confirmation' }, { status: 500 });
  }
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
