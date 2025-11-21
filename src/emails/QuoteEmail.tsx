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
  // Calculate pricing estimate
  const estimate = calculateEstimate({ siteType, features, optimization, domain });
  const siteTypePrice = PRICING.siteTypes[siteType as keyof typeof PRICING.siteTypes];
  
  return (
    <Html>
      <Preview>Nouvelle demande de devis de {firstName} {lastName} - {company}</Preview>
      <Body style={{ fontFamily: 'sans-serif', backgroundColor: '#f9fafb' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
          <Section style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Heading style={{ 
              marginTop: 0, 
              color: '#7c3aed',
              fontSize: '24px',
              marginBottom: '20px'
            }}>
              🎨 Nouvelle Demande de Devis
            </Heading>
            <Hr style={{ borderColor: '#e5e7eb', margin: '20px 0' }} />
            
            <Section style={{ marginBottom: '20px' }}>
              <Text style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '10px', color: '#7c3aed' }}>
                1️⃣ Informations du client
              </Text>
              <Text style={{ margin: '5px 0', color: '#6b7280' }}>
                <strong>Nom complet:</strong> {firstName} {lastName}
              </Text>
              <Text style={{ margin: '5px 0', color: '#6b7280' }}>
                <strong>Email:</strong> {email}
              </Text>
              <Text style={{ margin: '5px 0', color: '#6b7280' }}>
                <strong>Entreprise / Projet:</strong> {company}
              </Text>
              {sector && (
                <Text style={{ margin: '5px 0', color: '#6b7280' }}>
                  <strong>Secteur d'activité:</strong> {sector}
                </Text>
              )}
            </Section>

            <Hr style={{ borderColor: '#e5e7eb', margin: '20px 0' }} />

            <Section style={{ marginBottom: '20px' }}>
              <Text style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '10px', color: '#7c3aed' }}>
                2️⃣ Type de site
              </Text>
              <Section style={{ 
                backgroundColor: '#f0f9ff', 
                padding: '15px', 
                borderRadius: '8px',
                border: '2px solid #7c3aed',
                marginTop: '10px'
              }}>
                <Text style={{ margin: '5px 0', color: '#1f2937', fontSize: '15px' }}>
                  <strong>{siteType}</strong>
                </Text>
                {siteTypePrice && (
                  <Text style={{ 
                    margin: '8px 0 0 0', 
                    color: '#059669',
                    fontSize: '18px',
                    fontWeight: 'bold'
                  }}>
                    💰 {siteTypePrice.min === siteTypePrice.max 
                      ? `${siteTypePrice.min}€`
                      : `${siteTypePrice.min}€ - ${siteTypePrice.max}€`}
                  </Text>
                )}
              </Section>
            </Section>

            <Hr style={{ borderColor: '#e5e7eb', margin: '20px 0' }} />

            <Section style={{ marginBottom: '20px' }}>
              <Text style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '10px', color: '#7c3aed' }}>
                3️⃣ Design & Contenu
              </Text>
              <Text style={{ margin: '5px 0', color: '#6b7280' }}>
                ✓ Design sur mesure (UX/UI personnalisé)
              </Text>
              <Text style={{ margin: '5px 0', color: '#6b7280' }}>
                ✓ Responsive (mobile + tablette + ordinateur)
              </Text>
              <Text style={{ margin: '5px 0', color: '#6b7280' }}>
                <strong>Nombre de pages prévues:</strong> {pageCount}
              </Text>
            </Section>

            {features && features.length > 0 && (
              <>
                <Hr style={{ borderColor: '#e5e7eb', margin: '20px 0' }} />
                <Section style={{ marginBottom: '20px' }}>
                  <Text style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '10px', color: '#7c3aed' }}>
                    4️⃣ Fonctionnalités / Modules
                  </Text>
                  {features.map((feature, index) => {
                    const featurePrice = PRICING.features[feature as keyof typeof PRICING.features];
                    return (
                      <Section key={index} style={{ 
                        backgroundColor: '#f0fdf4', 
                        padding: '12px', 
                        borderRadius: '6px',
                        marginBottom: '8px',
                        border: '1px solid #86efac'
                      }}>
                        <Text style={{ 
                          margin: 0, 
                          color: '#1f2937',
                          fontSize: '14px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <span>• {feature}</span>
                          {featurePrice !== undefined && (
                            <strong style={{ 
                              color: '#059669',
                              fontSize: '15px',
                              marginLeft: '10px'
                            }}>
                              {featurePrice === 0 ? 'Inclus' : `${featurePrice}€`}
                            </strong>
                          )}
                        </Text>
                      </Section>
                    );
                  })}
                </Section>
              </>
            )}

            {optimization && optimization.length > 0 && (
              <>
                <Hr style={{ borderColor: '#e5e7eb', margin: '20px 0' }} />
                <Section style={{ marginBottom: '20px' }}>
                  <Text style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '10px', color: '#7c3aed' }}>
                    5️⃣ Optimisation & Sécurité
                  </Text>
                  {optimization.map((opt, index) => {
                    const optPrice = PRICING.optimization[opt as keyof typeof PRICING.optimization];
                    return (
                      <Section key={index} style={{ 
                        backgroundColor: '#fef3c7', 
                        padding: '12px', 
                        borderRadius: '6px',
                        marginBottom: '8px',
                        border: '1px solid #fbbf24'
                      }}>
                        <Text style={{ 
                          margin: 0, 
                          color: '#1f2937',
                          fontSize: '14px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <span>• {opt}</span>
                          {optPrice !== undefined && (
                            <strong style={{ 
                              color: '#d97706',
                              fontSize: '15px',
                              marginLeft: '10px'
                            }}>
                              {optPrice === 0 ? 'Inclus' : `${optPrice}€`}
                            </strong>
                          )}
                        </Text>
                      </Section>
                    );
                  })}
                </Section>
              </>
            )}

            <Hr style={{ borderColor: '#e5e7eb', margin: '20px 0' }} />

            <Section style={{ marginBottom: '20px' }}>
              <Text style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '10px', color: '#7c3aed' }}>
                6️⃣ Hébergement & Nom de domaine
              </Text>
              <Section style={{ 
                backgroundColor: '#f0f9ff', 
                padding: '12px', 
                borderRadius: '6px',
                marginBottom: '8px',
                border: '1px solid #7c3aed'
              }}>
                <Text style={{ margin: 0, color: '#1f2937', fontSize: '14px' }}>
                  <strong>Hébergement:</strong> {hosting}
                  <strong style={{ color: '#059669', marginLeft: '10px' }}>Inclus</strong>
                </Text>
              </Section>
              <Section style={{ 
                backgroundColor: '#f0f9ff', 
                padding: '12px', 
                borderRadius: '6px',
                marginBottom: '8px',
                border: '1px solid #7c3aed'
              }}>
                <Text style={{ margin: 0, color: '#1f2937', fontSize: '14px', display: 'flex', justifyContent: 'space-between' }}>
                  <span><strong>Nom de domaine:</strong> {domain}</span>
                  <strong style={{ color: '#059669' }}>
                    {PRICING.domain[domain as keyof typeof PRICING.domain] === 0 ? 'Inclus' : `${PRICING.domain[domain as keyof typeof PRICING.domain]}€`}
                  </strong>
                </Text>
              </Section>
            </Section>

            <Hr style={{ borderColor: '#e5e7eb', margin: '20px 0' }} />

            <Section style={{ 
              backgroundColor: '#ddd6fe', 
              padding: '20px', 
              borderRadius: '10px',
              border: '3px solid #7c3aed',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              <Text style={{ 
                fontWeight: 'bold', 
                fontSize: '20px', 
                color: '#5b21b6',
                marginTop: 0,
                marginBottom: '10px'
              }}>
                💰 ESTIMATION TOTALE DU PROJET
              </Text>
              <Text style={{ 
                fontSize: '32px', 
                fontWeight: 'bold',
                color: '#7c3aed',
                margin: '10px 0'
              }}>
                {estimate.minTotal === estimate.maxTotal 
                  ? `${estimate.minTotal}€`
                  : `${estimate.minTotal}€ - ${estimate.maxTotal}€`}
              </Text>
              <Text style={{ 
                fontSize: '13px', 
                color: '#6b7280',
                margin: '10px 0 0 0',
                fontStyle: 'italic'
              }}>
                (Hors maintenance mensuelle)
              </Text>
            </Section>

            <Hr style={{ borderColor: '#e5e7eb', margin: '20px 0' }} />

            <Section style={{ 
              backgroundColor: '#f0f9ff', 
              padding: '20px', 
              borderRadius: '8px',
              border: '2px solid #7c3aed',
              marginBottom: '20px'
            }}>
              <Text style={{ 
                fontWeight: 'bold', 
                fontSize: '18px', 
                marginBottom: '10px', 
                color: '#7c3aed',
                marginTop: 0,
                textAlign: 'center'
              }}>
                🔧 Maintenance – Sites vitrines
              </Text>
              
              <Text style={{ 
                fontSize: '14px', 
                color: '#4b5563',
                marginBottom: '20px',
                textAlign: 'center',
                fontWeight: '500'
              }}>
                Choisissez votre formule de maintenance :
              </Text>

              {/* Option 1: Abonnement annuel */}
              <Section style={{ 
                backgroundColor: '#ffffff', 
                padding: '20px', 
                borderRadius: '8px',
                marginBottom: '15px',
                border: '2px solid #7c3aed',
                boxShadow: '0 4px 6px rgba(124, 58, 237, 0.1)'
              }}>
                <Text style={{ 
                  fontWeight: 'bold', 
                  fontSize: '16px', 
                  color: '#7c3aed',
                  marginTop: 0,
                  marginBottom: '12px',
                  textAlign: 'center'
                }}>
                  📦 Abonnement Annuel - 300€/an
                </Text>
                
                <Text style={{ 
                  margin: '8px 0 5px 0', 
                  color: '#4b5563',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  Inclus :
                </Text>
                <Text style={{ margin: '4px 0 4px 15px', color: '#6b7280', fontSize: '14px' }}>
                  • Jusqu'à 6 interventions par an
                </Text>
                <Text style={{ margin: '4px 0 4px 15px', color: '#6b7280', fontSize: '14px' }}>
                  • Mises à jour mineures (texte, images)
                </Text>
                <Text style={{ margin: '4px 0 4px 15px', color: '#6b7280', fontSize: '14px' }}>
                  • Corrections simples
                </Text>
                <Text style={{ margin: '4px 0 4px 15px', color: '#6b7280', fontSize: '14px' }}>
                  • Sécurité & sauvegardes
                </Text>
                
                <Text style={{ 
                  margin: '12px 0 5px 0', 
                  color: '#4b5563',
                  fontSize: '14px'
                }}>
                  <strong>Interventions supplémentaires :</strong> 100€/intervention
                </Text>
                <Text style={{ 
                  margin: '5px 0', 
                  color: '#4b5563',
                  fontSize: '14px'
                }}>
                  <strong>Délai :</strong> 48h ouvrées
                </Text>
              </Section>

              {/* Option 2: Paiement par intervention */}
              <Section style={{ 
                backgroundColor: '#ffffff', 
                padding: '20px', 
                borderRadius: '8px',
                marginBottom: '15px',
                border: '2px solid #a78bfa',
                boxShadow: '0 4px 6px rgba(167, 139, 250, 0.1)'
              }}>
                <Text style={{ 
                  fontWeight: 'bold', 
                  fontSize: '16px', 
                  color: '#7c3aed',
                  marginTop: 0,
                  marginBottom: '12px',
                  textAlign: 'center'
                }}>
                  💳 Paiement par Intervention - 100€
                </Text>
                
                <Text style={{ 
                  margin: '8px 0 5px 0', 
                  color: '#4b5563',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  Chaque intervention comprend :
                </Text>
                <Text style={{ margin: '4px 0 4px 15px', color: '#6b7280', fontSize: '14px' }}>
                  • Mise à jour mineure
                </Text>
                <Text style={{ margin: '4px 0 4px 15px', color: '#6b7280', fontSize: '14px' }}>
                  • Correction ou modification simple
                </Text>
                <Text style={{ margin: '4px 0 4px 15px', color: '#6b7280', fontSize: '14px' }}>
                  • Aucun engagement
                </Text>
                
                <Text style={{ 
                  margin: '12px 0 5px 0', 
                  color: '#4b5563',
                  fontSize: '14px'
                }}>
                  <strong>Délai :</strong> 48h ouvrées
                </Text>
              </Section>
            </Section>

            <Hr style={{ borderColor: '#e5e7eb', margin: '20px 0' }} />

            <Section style={{ 
              backgroundColor: '#fef3f4', 
              padding: '20px', 
              borderRadius: '8px',
              border: '2px solid #dc2626',
              marginBottom: '20px'
            }}>
              <Text style={{ 
                fontWeight: 'bold', 
                fontSize: '18px', 
                marginBottom: '10px', 
                color: '#dc2626',
                marginTop: 0,
                textAlign: 'center'
              }}>
                🛒 Maintenance – Sites e-commerce
              </Text>
              
              <Text style={{ 
                fontSize: '14px', 
                color: '#4b5563',
                marginBottom: '20px',
                textAlign: 'center',
                fontWeight: '500'
              }}>
                Choisissez votre formule de maintenance :
              </Text>

              {/* Option 1: Abonnement annuel */}
              <Section style={{ 
                backgroundColor: '#ffffff', 
                padding: '20px', 
                borderRadius: '8px',
                marginBottom: '15px',
                border: '2px solid #dc2626',
                boxShadow: '0 4px 6px rgba(220, 38, 38, 0.1)'
              }}>
                <Text style={{ 
                  fontWeight: 'bold', 
                  fontSize: '16px', 
                  color: '#dc2626',
                  marginTop: 0,
                  marginBottom: '12px',
                  textAlign: 'center'
                }}>
                  📦 Abonnement Annuel - 700€/an
                </Text>
                
                <Text style={{ 
                  margin: '8px 0 5px 0', 
                  color: '#4b5563',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  Inclus :
                </Text>
                <Text style={{ margin: '4px 0 4px 15px', color: '#6b7280', fontSize: '14px' }}>
                  • Jusqu'à 12 interventions par an
                </Text>
                <Text style={{ margin: '4px 0 4px 15px', color: '#6b7280', fontSize: '14px' }}>
                  • Mises à jour du site et des plugins
                </Text>
                <Text style={{ margin: '4px 0 4px 15px', color: '#6b7280', fontSize: '14px' }}>
                  • Corrections mineures (texte, images, prix)
                </Text>
                <Text style={{ margin: '4px 0 4px 15px', color: '#6b7280', fontSize: '14px' }}>
                  • Gestion sécurité & sauvegardes
                </Text>
                <Text style={{ margin: '4px 0 4px 15px', color: '#6b7280', fontSize: '14px' }}>
                  • Vérification des passerelles de paiement
                </Text>
                
                <Text style={{ 
                  margin: '12px 0 5px 0', 
                  color: '#4b5563',
                  fontSize: '14px'
                }}>
                  <strong>Interventions supplémentaires :</strong> 150€/intervention
                </Text>
                <Text style={{ 
                  margin: '5px 0', 
                  color: '#4b5563',
                  fontSize: '14px'
                }}>
                  <strong>Délai :</strong> 48h ouvrées
                </Text>
              </Section>

              {/* Option 2: Paiement par intervention */}
              <Section style={{ 
                backgroundColor: '#ffffff', 
                padding: '20px', 
                borderRadius: '8px',
                marginBottom: '15px',
                border: '2px solid #fca5a5',
                boxShadow: '0 4px 6px rgba(252, 165, 165, 0.1)'
              }}>
                <Text style={{ 
                  fontWeight: 'bold', 
                  fontSize: '16px', 
                  color: '#dc2626',
                  marginTop: 0,
                  marginBottom: '12px',
                  textAlign: 'center'
                }}>
                  💳 Paiement par Intervention - 150€
                </Text>
                
                <Text style={{ 
                  margin: '8px 0 5px 0', 
                  color: '#4b5563',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  Chaque intervention comprend :
                </Text>
                <Text style={{ margin: '4px 0 4px 15px', color: '#6b7280', fontSize: '14px' }}>
                  • Mise à jour ou correction mineure
                </Text>
                <Text style={{ margin: '4px 0 4px 15px', color: '#6b7280', fontSize: '14px' }}>
                  • Sécurité et sauvegardes
                </Text>
                <Text style={{ margin: '4px 0 4px 15px', color: '#6b7280', fontSize: '14px' }}>
                  • Aucun engagement
                </Text>
                
                <Text style={{ 
                  margin: '12px 0 5px 0', 
                  color: '#4b5563',
                  fontSize: '14px'
                }}>
                  <strong>Délai :</strong> 48h ouvrées
                </Text>
              </Section>
            </Section>

            <Hr style={{ borderColor: '#e5e7eb', margin: '20px 0' }} />

            <Section>
              <Text style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '10px', color: '#7c3aed' }}>
                7️⃣ Remarques spécifiques / Besoins particuliers
              </Text>
              <Section style={{ 
                backgroundColor: '#f3f4f6', 
                padding: '15px', 
                borderRadius: '6px',
                borderLeft: '4px solid #7c3aed'
              }}>
                <Text style={{ 
                  color: '#1f2937',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                  margin: 0
                }}>
                  {message}
                </Text>
              </Section>
            </Section>

            <Hr style={{ borderColor: '#e5e7eb', margin: '20px 0' }} />
            
            <Text style={{ 
              color: '#9ca3af', 
              fontSize: '12px',
              textAlign: 'center',
              marginTop: '20px'
            }}>
              Répondez directement à cet email pour contacter le client
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}