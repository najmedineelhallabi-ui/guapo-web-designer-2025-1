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
  
  // Calculate additional pages
  const pageCountNum = parseInt(pageCount);
  let includedPages = 5;
  if (siteType === "Site vitrine avancé (5 à 10 pages)") includedPages = 10;
  if (siteType === "Site e-commerce") includedPages = 10;
  const additionalPagesCount = Math.max(0, pageCountNum - includedPages);

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
              <Text style={{ margin: '5px 0', color: '#6b7280' }}>
                <strong>Type:</strong> {siteType}
              </Text>
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
                  {features.map((feature, index) => (
                    <Text key={index} style={{ margin: '5px 0 5px 15px', color: '#6b7280' }}>
                      • {feature}
                    </Text>
                  ))}
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
                  {optimization.map((opt, index) => (
                    <Text key={index} style={{ margin: '5px 0 5px 15px', color: '#6b7280' }}>
                      • {opt}
                    </Text>
                  ))}
                </Section>
              </>
            )}

            <Hr style={{ borderColor: '#e5e7eb', margin: '20px 0' }} />

            <Section style={{ marginBottom: '20px' }}>
              <Text style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '10px', color: '#7c3aed' }}>
                6️⃣ Hébergement & Maintenance
              </Text>
              <Text style={{ margin: '5px 0', color: '#6b7280' }}>
                <strong>Hébergement:</strong> {hosting} (Inclus dans le projet)
              </Text>
              <Text style={{ margin: '5px 0', color: '#6b7280' }}>
                <strong>Nom de domaine:</strong> {domain}
              </Text>
              {maintenance && (
                <Text style={{ margin: '5px 0', color: '#6b7280' }}>
                  <strong>Maintenance mensuelle:</strong> {maintenance}
                </Text>
              )}
            </Section>

            <Hr style={{ borderColor: '#e5e7eb', margin: '20px 0' }} />

            {/* MAINTENANCE OPTIONS SECTION */}
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

              {/* Notes explicatives */}
              <Hr style={{ borderColor: '#c7d2fe', margin: '20px 0' }} />
              
              <Text style={{ 
                fontWeight: 'bold', 
                fontSize: '14px', 
                color: '#5b21b6',
                marginTop: 0,
                marginBottom: '8px'
              }}>
                📝 Notes importantes :
              </Text>
              
              <Text style={{ margin: '5px 0', color: '#4b5563', fontSize: '13px', lineHeight: '1.6' }}>
                • <strong>Interventions incluses :</strong> modifications de texte ou images, corrections mineures, mises à jour simples, sécurité et sauvegardes.
              </Text>
              <Text style={{ margin: '5px 0', color: '#4b5563', fontSize: '13px', lineHeight: '1.6' }}>
                • <strong>Délai de traitement :</strong> 48h ouvrées, sauf urgence à discuter.
              </Text>
              <Text style={{ margin: '5px 0', color: '#4b5563', fontSize: '13px', lineHeight: '1.6' }}>
                • Convient à tous les sites vitrines, quelle que soit leur taille ou le nombre de pages.
              </Text>

              {/* Astuce commerciale */}
              <Section style={{ 
                backgroundColor: '#fef3c7', 
                padding: '15px', 
                borderRadius: '8px',
                marginTop: '15px',
                border: '2px solid #fbbf24'
              }}>
                <Text style={{ 
                  margin: 0,
                  color: '#78350f',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  textAlign: 'center',
                  fontWeight: '600'
                }}>
                  💡 <strong>Offre spéciale :</strong> 1 mois de maintenance offert pour tout nouveau site !
                </Text>
              </Section>
            </Section>

            <Hr style={{ borderColor: '#e5e7eb', margin: '20px 0' }} />

            {/* MAINTENANCE E-COMMERCE OPTIONS SECTION */}
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

              {/* Notes explicatives */}
              <Hr style={{ borderColor: '#fecaca', margin: '20px 0' }} />
              
              <Text style={{ 
                fontWeight: 'bold', 
                fontSize: '14px', 
                color: '#991b1b',
                marginTop: 0,
                marginBottom: '8px'
              }}>
                📝 Notes importantes :
              </Text>
              
              <Text style={{ margin: '5px 0', color: '#4b5563', fontSize: '13px', lineHeight: '1.6' }}>
                • <strong>Interventions incluses :</strong> corrections de textes/images, mises à jour produits, vérification des paiements, sécurité, sauvegardes.
              </Text>
              <Text style={{ margin: '5px 0', color: '#4b5563', fontSize: '13px', lineHeight: '1.6' }}>
                • <strong>Délai de traitement :</strong> 48h ouvrées, sauf urgence à discuter.
              </Text>
              <Text style={{ margin: '5px 0', color: '#4b5563', fontSize: '13px', lineHeight: '1.6' }}>
                • Convient à toutes les boutiques e-commerce, quelle que soit la taille du catalogue.
              </Text>

              {/* Astuce commerciale */}
              <Section style={{ 
                backgroundColor: '#fef3c7', 
                padding: '15px', 
                borderRadius: '8px',
                marginTop: '15px',
                border: '2px solid #fbbf24'
              }}>
                <Text style={{ 
                  margin: 0,
                  color: '#78350f',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  textAlign: 'center',
                  fontWeight: '600'
                }}>
                  💡 <strong>Offre spéciale :</strong> 1 mois de maintenance offert pour tout nouveau site e-commerce !
                </Text>
              </Section>
            </Section>

            <Hr style={{ borderColor: '#e5e7eb', margin: '20px 0' }} />

            <Section>
              <Text style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '10px', color: '#7c3aed' }}>
                8️⃣ Remarques spécifiques / Besoins particuliers
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