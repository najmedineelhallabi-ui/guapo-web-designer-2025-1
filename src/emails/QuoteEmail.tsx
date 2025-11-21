import {
  Html,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Hr,
  Preview,
} from '@react-email/components';
import { PRICING, calculateEstimate } from '@/lib/pricing';

interface QuoteEmailProps {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  sector?: string;
  siteType: string;
  pageCount: string;
  features?: string[];
  optimization?: string[];
  hosting: string;
  domain: string;
  maintenance?: string;
  message: string;
}

export function QuoteEmail({ 
  firstName,
  lastName,
  email,
  company,
  sector,
  siteType,
  pageCount,
  features,
  optimization,
  hosting,
  domain,
  maintenance,
  message 
}: QuoteEmailProps) {
  const estimate = calculateEstimate({ siteType, features, optimization, domain });
  const siteTypePrice = PRICING.siteTypes[siteType as keyof typeof PRICING.siteTypes];
  
  // Détection du type de site pour la maintenance
  const isEcommerce = siteType.toLowerCase().includes('boutique') || siteType.toLowerCase().includes('e-commerce');
  const maintenanceYearly = isEcommerce ? 700 : 300;
  const maintenancePerIntervention = isEcommerce ? 150 : 100;
  const interventionsIncluded = isEcommerce ? 12 : 6;
  
  return (
    <Html>
      <Preview>Nouvelle demande de devis de {firstName} {lastName} - {company}</Preview>
      <Body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f4', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: '600px', margin: '20px auto', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
          
          {/* Header */}
          <Section style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)', padding: '20px', textAlign: 'center' }}>
            <Heading style={{ color: '#fff', fontSize: '22px', margin: 0 }}>
              🎨 Nouvelle Demande de Devis
            </Heading>
          </Section>

          <Section style={{ padding: '20px' }}>
            
            {/* 1. Client Info */}
            <Text style={{ fontWeight: 'bold', fontSize: '15px', color: '#7c3aed', marginBottom: '8px' }}>
              1️⃣ Client
            </Text>
            <Text style={{ fontSize: '13px', color: '#666', margin: '3px 0' }}>
              <strong>Nom:</strong> {firstName} {lastName}
            </Text>
            <Text style={{ fontSize: '13px', color: '#666', margin: '3px 0' }}>
              <strong>Email:</strong> {email}
            </Text>
            <Text style={{ fontSize: '13px', color: '#666', margin: '3px 0' }}>
              <strong>Entreprise:</strong> {company}
            </Text>
            {sector && (
              <Text style={{ fontSize: '13px', color: '#666', margin: '3px 0' }}>
                <strong>Secteur:</strong> {sector}
              </Text>
            )}

            <Hr style={{ borderColor: '#e5e7eb', margin: '15px 0' }} />

            {/* 2. Site Type */}
            <Text style={{ fontWeight: 'bold', fontSize: '15px', color: '#7c3aed', marginBottom: '8px' }}>
              2️⃣ Type de site
            </Text>
            <Section style={{ backgroundColor: '#f0f9ff', padding: '10px', borderRadius: '6px', border: '1px solid #7c3aed' }}>
              <Text style={{ margin: 0, fontSize: '14px', color: '#1f2937' }}>
                <strong>{siteType}</strong>
              </Text>
              {siteTypePrice && (
                <Text style={{ margin: '5px 0 0 0', fontSize: '16px', fontWeight: 'bold', color: '#059669' }}>
                  💰 {siteTypePrice.min === siteTypePrice.max ? `${siteTypePrice.min}€` : `${siteTypePrice.min}€ - ${siteTypePrice.max}€`}
                </Text>
              )}
            </Section>

            <Hr style={{ borderColor: '#e5e7eb', margin: '15px 0' }} />

            {/* 3. Design */}
            <Text style={{ fontWeight: 'bold', fontSize: '15px', color: '#7c3aed', marginBottom: '8px' }}>
              3️⃣ Design & Contenu
            </Text>
            <Text style={{ fontSize: '13px', color: '#666', margin: '3px 0' }}>
              ✓ Design sur mesure (UX/UI)
            </Text>
            <Text style={{ fontSize: '13px', color: '#666', margin: '3px 0' }}>
              ✓ Responsive (mobile + tablette + PC)
            </Text>
            <Text style={{ fontSize: '13px', color: '#666', margin: '3px 0' }}>
              <strong>Pages:</strong> {pageCount}
            </Text>

            {/* 4. Features */}
            {features && features.length > 0 && (
              <>
                <Hr style={{ borderColor: '#e5e7eb', margin: '15px 0' }} />
                <Text style={{ fontWeight: 'bold', fontSize: '15px', color: '#7c3aed', marginBottom: '8px' }}>
                  4️⃣ Fonctionnalités
                </Text>
                {features.map((feature, index) => {
                  const featurePrice = PRICING.features[feature as keyof typeof PRICING.features];
                  return (
                    <Text key={index} style={{ fontSize: '13px', color: '#666', margin: '4px 0' }}>
                      • {feature} {featurePrice !== undefined && (
                        <strong style={{ color: '#059669', marginLeft: '5px' }}>
                          {featurePrice === 0 ? '(Inclus)' : `${featurePrice}€`}
                        </strong>
                      )}
                    </Text>
                  );
                })}
              </>
            )}

            {/* 5. Optimization */}
            {optimization && optimization.length > 0 && (
              <>
                <Hr style={{ borderColor: '#e5e7eb', margin: '15px 0' }} />
                <Text style={{ fontWeight: 'bold', fontSize: '15px', color: '#7c3aed', marginBottom: '8px' }}>
                  5️⃣ Optimisation
                </Text>
                {optimization.map((opt, index) => {
                  const optPrice = PRICING.optimization[opt as keyof typeof PRICING.optimization];
                  return (
                    <Text key={index} style={{ fontSize: '13px', color: '#666', margin: '4px 0' }}>
                      • {opt} {optPrice !== undefined && (
                        <strong style={{ color: '#d97706', marginLeft: '5px' }}>
                          {optPrice === 0 ? '(Inclus)' : `${optPrice}€`}
                        </strong>
                      )}
                    </Text>
                  );
                })}
              </>
            )}

            <Hr style={{ borderColor: '#e5e7eb', margin: '15px 0' }} />

            {/* 6. Hosting & Domain */}
            <Text style={{ fontWeight: 'bold', fontSize: '15px', color: '#7c3aed', marginBottom: '8px' }}>
              6️⃣ Hébergement & Domaine
            </Text>
            <Text style={{ fontSize: '13px', color: '#666', margin: '3px 0' }}>
              <strong>Hébergement:</strong> {hosting} <strong style={{ color: '#059669' }}>(Inclus)</strong>
            </Text>
            <Text style={{ fontSize: '13px', color: '#666', margin: '3px 0' }}>
              <strong>Domaine:</strong> {domain} <strong style={{ color: '#059669' }}>
                ({PRICING.domain[domain as keyof typeof PRICING.domain] === 0 ? 'Inclus' : `${PRICING.domain[domain as keyof typeof PRICING.domain]}€`})
              </strong>
            </Text>

            <Hr style={{ borderColor: '#e5e7eb', margin: '15px 0' }} />

            {/* ESTIMATION TOTALE */}
            <Section style={{ backgroundColor: '#ddd6fe', padding: '15px', borderRadius: '8px', border: '2px solid #7c3aed', textAlign: 'center' }}>
              <Text style={{ fontSize: '16px', fontWeight: 'bold', color: '#5b21b6', margin: '0 0 8px 0' }}>
                💰 ESTIMATION TOTALE
              </Text>
              <Text style={{ fontSize: '28px', fontWeight: 'bold', color: '#7c3aed', margin: '5px 0' }}>
                {estimate.minTotal === estimate.maxTotal ? `${estimate.minTotal}€` : `${estimate.minTotal}€ - ${estimate.maxTotal}€`}
              </Text>
              <Text style={{ fontSize: '12px', color: '#6b7280', margin: '5px 0', fontStyle: 'italic' }}>
                (Hors TVA et maintenance)
              </Text>
              <Text style={{ fontSize: '13px', color: '#4b5563', margin: '8px 0 0 0' }}>
                <strong>+ TVA 21%:</strong> {Math.round(estimate.minTotal * 0.21)}€ - {Math.round(estimate.maxTotal * 0.21)}€
              </Text>
              <Text style={{ fontSize: '15px', fontWeight: 'bold', color: '#5b21b6', margin: '8px 0 0 0' }}>
                <strong>Total TTC:</strong> {Math.round(estimate.minTotal * 1.21)}€ - {Math.round(estimate.maxTotal * 1.21)}€
              </Text>
            </Section>

            <Hr style={{ borderColor: '#e5e7eb', margin: '15px 0' }} />

            {/* MAINTENANCE SECTION - Condensée */}
            <Section style={{ backgroundColor: '#f0f9ff', padding: '15px', borderRadius: '8px', border: '2px solid #7c3aed' }}>
              <Text style={{ fontSize: '16px', fontWeight: 'bold', color: '#7c3aed', margin: '0 0 10px 0', textAlign: 'center' }}>
                🔧 Options de Maintenance {isEcommerce ? '(E-commerce)' : '(Site vitrine)'}
              </Text>
              
              <Section style={{ backgroundColor: '#fff', padding: '12px', borderRadius: '6px', marginBottom: '10px', border: '1px solid #7c3aed' }}>
                <Text style={{ fontSize: '14px', fontWeight: 'bold', color: '#7c3aed', margin: '0 0 8px 0' }}>
                  📦 Abonnement Annuel - {maintenanceYearly}€ HT/an ({Math.round(maintenanceYearly * 1.21)}€ TTC)
                </Text>
                <Text style={{ fontSize: '12px', color: '#4b5563', margin: '3px 0' }}>
                  • {interventionsIncluded} interventions/an incluses
                </Text>
                <Text style={{ fontSize: '12px', color: '#4b5563', margin: '3px 0' }}>
                  • Mises à jour & corrections
                </Text>
                <Text style={{ fontSize: '12px', color: '#4b5563', margin: '3px 0' }}>
                  • Sécurité & sauvegardes
                </Text>
                <Text style={{ fontSize: '12px', color: '#4b5563', margin: '3px 0' }}>
                  • Support prioritaire (délai 48h)
                </Text>
                <Text style={{ fontSize: '11px', color: '#6b7280', margin: '5px 0 0 0', fontStyle: 'italic' }}>
                  🎁 Premier mois offert !
                </Text>
              </Section>

              <Section style={{ backgroundColor: '#fff', padding: '12px', borderRadius: '6px', border: '1px solid #a78bfa' }}>
                <Text style={{ fontSize: '14px', fontWeight: 'bold', color: '#7c3aed', margin: '0 0 8px 0' }}>
                  💳 Paiement par Intervention - {maintenancePerIntervention}€ HT ({Math.round(maintenancePerIntervention * 1.21)}€ TTC)
                </Text>
                <Text style={{ fontSize: '12px', color: '#4b5563', margin: '3px 0' }}>
                  • Aucun engagement
                </Text>
                <Text style={{ fontSize: '12px', color: '#4b5563', margin: '3px 0' }}>
                  • Paiement à la demande
                </Text>
                <Text style={{ fontSize: '12px', color: '#4b5563', margin: '3px 0' }}>
                  • Délai 48h ouvrées
                </Text>
              </Section>
            </Section>

            <Hr style={{ borderColor: '#e5e7eb', margin: '15px 0' }} />

            {/* 7. Message */}
            <Text style={{ fontWeight: 'bold', fontSize: '15px', color: '#7c3aed', marginBottom: '8px' }}>
              7️⃣ Remarques spécifiques
            </Text>
            <Section style={{ backgroundColor: '#f3f4f6', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #7c3aed' }}>
              <Text style={{ fontSize: '13px', color: '#1f2937', lineHeight: '1.5', whiteSpace: 'pre-wrap', margin: 0 }}>
                {message}
              </Text>
            </Section>

            <Hr style={{ borderColor: '#e5e7eb', margin: '15px 0' }} />
            
            <Text style={{ fontSize: '11px', color: '#9ca3af', textAlign: 'center', margin: '10px 0 0 0' }}>
              Répondez directement à cet email pour contacter le client
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}