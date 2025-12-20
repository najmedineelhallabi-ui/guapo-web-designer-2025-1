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
            body { font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: #f4f7f6; }
            .card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }
            .header { background: ${isModelB ? '#10b981' : '#1e293b'}; color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .badge { display: inline-block; padding: 6px 12px; border-radius: 20px; font-weight: 800; font-size: 12px; text-transform: uppercase; margin-bottom: 20px; }
            .badge-a { background: #e0f2fe; color: #0369a1; }
            .badge-b { background: #dcfce7; color: #15803d; }
            .section { margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px solid #f1f5f9; }
            .label { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; }
            .value { font-size: 16px; color: #1e293b; font-weight: 600; margin-top: 4px; }
            .price-box { background: #f8fafc; border-radius: 8px; padding: 20px; border: 1px solid #e2e8f0; }
            .total { font-size: 24px; font-weight: 900; color: ${isModelB ? '#059669' : '#1e293b'}; }
            .footer { text-align: center; padding: 20px; color: #94a3b8; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <h1 style="margin:0;font-size:24px;">Confirmation de Choix</h1>
              <p style="margin:10px 0 0 0;opacity:0.9;">Projet #${ref || 'INCONNU'}</p>
            </div>
            <div class="content">
              <div style="text-align:center">
                <span class="badge ${isModelB ? 'badge-b' : 'badge-a'}">
                  ${isModelB ? 'MODÈLE B : ABONNEMENT' : 'MODÈLE A : ACHAT'}
                </span>
              </div>

              <div class="section">
                <div class="label">Client</div>
                <div class="value">${escapeHtml(firstName)} ${escapeHtml(lastName)}</div>
                <div class="value" style="font-size:14px;font-weight:400;color:#64748b">${escapeHtml(email)}</div>
                ${company ? `<div class="value" style="font-size:14px;color:#334155;margin-top:8px">🏢 ${escapeHtml(company)}</div>` : ''}
              </div>

              <div class="section">
                <div class="label">Type de Projet</div>
                <div class="value">${escapeHtml(siteType)}</div>
              </div>

              <div class="price-box">
                ${isModelA ? `
                  <div class="label">Investissement Initial (Payé au début)</div>
                  <div class="total">${minPrice === maxPrice ? `${minPrice}€` : `${minPrice}€ - ${maxPrice}€`} TVAC</div>
                  <div style="margin-top:15px;padding-top:15px;border-top:1px solid #e2e8f0">
                    <div class="label">Mensualité (Maintenance/Pack)</div>
                    <div class="value" style="font-size:18px">${monthlyPrice}€ / mois TVAC</div>
                    <div style="font-size:12px;color:#64748b">${escapeHtml(packName || 'Maintenance & plateforme')}</div>
                  </div>
                ` : `
                  <div class="label">Investissement Initial</div>
                  <div class="total" style="color:#10b981">0€ OFFERT</div>
                  <div style="margin-top:15px;padding-top:15px;border-top:1px solid #e2e8f0">
                    <div class="label">Abonnement Mensuel Tout-Inclus</div>
                    <div class="total">${monthlyPrice}€ / mois TVAC</div>
                    <div style="font-size:12px;color:#64748b">${escapeHtml(packName || 'Abonnement complet')}</div>
                  </div>
                `}
              </div>

              <div style="margin-top:30px; text-align:center">
                <a href="mailto:${email}" style="display:inline-block;background:#1e293b;color:white;padding:15px 30px;border-radius:8px;text-decoration:none;font-weight:700">RÉPONDRE AU CLIENT</a>
              </div>
            </div>
          </div>
          <div class="footer">
            GUAPO Web Designer • Notification de confirmation automatique
          </div>
        </body>
      </html>
    `;

      const result = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        to: 'info@guapowebdesigner.com',
        replyTo: email,
        subject: `✅ CHOIX ${model} : ${firstName} ${lastName} (${company || 'SANS-ENTREPRISE'})`,
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
}import { NextRequest, NextResponse } from 'next/server';
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
              body { font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: #f4f7f6; }
              .card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }
              .header { background: ${isModelB ? '#10b981' : '#1e293b'}; color: white; padding: 30px; text-align: center; }
              .content { padding: 30px; }
              .badge { display: inline-block; padding: 10px 20px; border-radius: 25px; font-weight: 900; font-size: 14px; text-transform: uppercase; margin-bottom: 25px; }
              .badge-a { background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }
              .badge-b { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
              .section { margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px solid #f1f5f9; }
              .label { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; margin-bottom: 6px; }
              .value { font-size: 17px; color: #1e293b; font-weight: 600; }
              .price-box { background: #f8fafc; border-radius: 12px; padding: 25px; border: 2px dashed #e2e8f0; margin-top: 10px; }
              .total { font-size: 28px; font-weight: 900; color: ${isModelB ? '#059669' : '#1e293b'}; margin: 10px 0; }
              .footer { text-align: center; padding: 25px; color: #94a3b8; font-size: 12px; }
              .btn { display: inline-block; background: #1e293b; color: white !important; padding: 15px 30px; border-radius: 10px; text-decoration: none; font-weight: 800; margin-top: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="header">
                <h1 style="margin:0;font-size:26px;">✅ NOUVEAU CHOIX CLIENT</h1>
                <p style="margin:10px 0 0 0;opacity:0.9;font-weight:600">RÉFÉRENCE : #${ref || 'INCONNU'}</p>
              </div>
              <div class="content">
                <div style="text-align:center">
                  <div class="badge ${isModelB ? 'badge-b' : 'badge-a'}">
                    ${isModelB ? 'MODÈLE B : TOUT-EN-UN (ABONNEMENT)' : 'MODÈLE A : ACHAT DU SYSTÈME'}
                  </div>
                </div>
  
                <div class="section">
                  <div class="label">Informations Client</div>
                  <div class="value">${escapeHtml(firstName)} ${escapeHtml(lastName)}</div>
                  <div style="font-size:15px;color:#64748b;margin-top:5px">${escapeHtml(email)}</div>
                  ${company ? `<div style="font-size:15px;color:#1e293b;margin-top:10px;font-weight:600">🏢 Entreprise : ${escapeHtml(company)}</div>` : ''}
                </div>
  
                <div class="section">
                  <div class="label">Projet Sélectionné</div>
                  <div class="value">${escapeHtml(siteType)}</div>
                </div>
  
                <div class="price-box">
                  ${isModelA ? `
                    <div class="label">Investissement Initial (Budget unique)</div>
                    <div class="total">${minPrice === maxPrice ? `${minPrice}€` : `${minPrice}€ - ${maxPrice}€`} TVAC</div>
                    <div style="margin-top:20px;padding-top:20px;border-top:2px solid #fff">
                      <div class="label">Mensualité récurrente</div>
                      <div class="value" style="font-size:20px;color:#0369a1">${monthlyPrice}€ / mois TVAC</div>
                      <div style="font-size:13px;color:#64748b;margin-top:4px;font-style:italic">Détail : ${escapeHtml(packName || 'Maintenance & plateforme')}</div>
                    </div>
                  ` : `
                    <div class="label">Investissement Initial</div>
                    <div class="total" style="color:#10b981">0€ (OFFERT)</div>
                    <div style="margin-top:20px;padding-top:20px;border-top:2px solid #fff">
                      <div class="label">Abonnement Mensuel Tout-Inclus</div>
                      <div class="total">${monthlyPrice}€ / mois TVAC</div>
                      <div style="font-size:13px;color:#64748b;margin-top:4px;font-style:italic">Pack : ${escapeHtml(packName || 'Abonnement complet')}</div>
                    </div>
                  `}
                </div>
  
                <div style="margin-top:35px; text-align:center">
                  <p style="font-size:14px;color:#64748b;margin-bottom:15px">Cliquez ci-dessous pour répondre directement :</p>
                  <a href="mailto:${email}" class="btn">RÉPONDRE AU CLIENT PAR EMAIL</a>
                </div>
              </div>
            </div>
            <div class="footer">
              GUAPO Web Designer • Système de Devis Automatique<br>
              ${new Date().toLocaleString('fr-BE')}
            </div>
          </body>
        </html>
      `;


      const result = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        to: 'info@guapowebdesigner.com',
        replyTo: email,
        subject: `✅ CHOIX ${model} : ${firstName} ${lastName} (${company || 'SANS-ENTREPRISE'})`,
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