import {
  Html,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Hr,
  Preview,
  Link,
  Button,
} from '@react-email/components';
import { calculateEstimate } from '@/lib/pricing';

interface QuoteConfirmationEmailProps {
  firstName: string;
  lastName: string;
  company: string;
  siteType: string;
  email: string;
  pageCount: string;
  features?: string[];
  optimization?: string[];
  domain: string;
  hosting: string;
  maintenance?: string;
}

export function QuoteConfirmationEmail({ 
  firstName,
  lastName,
  company,
  siteType,
  email,
  pageCount,
  features,
  optimization,
  domain,
  hosting,
  maintenance
}: QuoteConfirmationEmailProps) {
  const estimate = calculateEstimate({ siteType, features, optimization, domain });
  
  // Créer un résumé du devis pour l'email
  const quoteSummary = `
Bonjour,

J'ai reçu mon devis et j'aurais une question concernant mon projet :

--- RÉSUMÉ DU DEVIS ---
Entreprise: ${company}
Type de site: ${siteType}
Nombre de pages: ${pageCount}
${features && features.length > 0 ? `Fonctionnalités: ${features.join(', ')}` : ''}
${optimization && optimization.length > 0 ? `Optimisation: ${optimization.join(', ')}` : ''}
Hébergement: ${hosting}
Domaine: ${domain}
${maintenance ? `Maintenance: ${maintenance}` : ''}

Estimation: ${estimate.minTotal === estimate.maxTotal ? `${estimate.minTotal}€` : `${estimate.minTotal}€ - ${estimate.maxTotal}€`} HT
TTC: ${Math.round(estimate.minTotal * 1.21)}€ - ${Math.round(estimate.maxTotal * 1.21)}€
-----------------------

Ma question:
[Écrivez votre question ici]

Cordialement,
${firstName} ${lastName}
${email}
  `.trim();

  const mailtoLink = `mailto:info@guapowebdesigner.com?subject=${encodeURIComponent(`Question concernant mon devis - ${company}`)}&body=${encodeURIComponent(quoteSummary)}`;

  return (
    <Html>
      <Preview>Confirmation de votre demande de devis - GUAPO Web Designer</Preview>
      <Body style={{ fontFamily: 'sans-serif', backgroundColor: '#f9fafb' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
          <Section style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Heading style={{ 
              marginTop: 0, 
              color: '#7c3aed',
              fontSize: '24px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              ✅ Demande de devis bien reçue !
            </Heading>
            
            <Hr style={{ borderColor: '#e5e7eb', margin: '20px 0' }} />
            
            <Text style={{ fontSize: '16px', color: '#1f2937', lineHeight: '1.6' }}>
              Bonjour {firstName} {lastName},
            </Text>
            
            <Text style={{ fontSize: '16px', color: '#1f2937', lineHeight: '1.6' }}>
              Merci d'avoir fait confiance à <strong style={{ color: '#7c3aed' }}>GUAPO Web Designer</strong> pour votre projet !
            </Text>
            
            <Text style={{ fontSize: '16px', color: '#1f2937', lineHeight: '1.6' }}>
              Nous avons bien reçu votre demande de devis concernant votre projet <strong>{company}</strong> pour un <strong>{siteType}</strong>.
            </Text>

            <Section style={{ 
              backgroundColor: '#f0f9ff', 
              padding: '20px', 
              borderRadius: '8px',
              margin: '20px 0',
              borderLeft: '4px solid #7c3aed'
            }}>
              <Text style={{ 
                fontSize: '16px', 
                color: '#1f2937', 
                margin: '0 0 10px 0',
                fontWeight: 'bold'
              }}>
                📋 Résumé de votre devis :
              </Text>
              <Text style={{ fontSize: '14px', color: '#4b5563', margin: '5px 0' }}>
                <strong>Type:</strong> {siteType}
              </Text>
              <Text style={{ fontSize: '14px', color: '#4b5563', margin: '5px 0' }}>
                <strong>Pages:</strong> {pageCount}
              </Text>
              <Text style={{ fontSize: '14px', color: '#4b5563', margin: '5px 0' }}>
                <strong>Estimation:</strong> {estimate.minTotal === estimate.maxTotal ? `${estimate.minTotal}€` : `${estimate.minTotal}€ - ${estimate.maxTotal}€`} HT
              </Text>
              <Text style={{ fontSize: '14px', color: '#059669', margin: '5px 0', fontWeight: 'bold' }}>
                <strong>TTC:</strong> {Math.round(estimate.minTotal * 1.21)}€ - {Math.round(estimate.maxTotal * 1.21)}€
              </Text>
            </Section>

            <Section style={{ 
              backgroundColor: '#f3f4f6', 
              padding: '20px', 
              borderRadius: '8px',
              margin: '20px 0',
              borderLeft: '4px solid #7c3aed'
            }}>
              <Text style={{ 
                fontSize: '16px', 
                color: '#1f2937', 
                margin: '0 0 10px 0',
                fontWeight: 'bold'
              }}>
                📋 Prochaines étapes :
              </Text>
              <Text style={{ fontSize: '14px', color: '#4b5563', margin: '8px 0', lineHeight: '1.6' }}>
                • Notre équipe attend votre réponse et nous vous contacterons ensuite pour des mises à jour
              </Text>
            </Section>

            <Text style={{ fontSize: '16px', color: '#1f2937', lineHeight: '1.6' }}>
              Vous avez des questions concernant votre devis ? Cliquez sur le bouton ci-dessous pour nous envoyer un email avec votre résumé de devis pré-rempli :
            </Text>

            <Section style={{ textAlign: 'center', margin: '25px 0' }}>
              <Link 
                href={mailtoLink}
                style={{
                  display: 'inline-block',
                  backgroundColor: '#7c3aed',
                  color: '#ffffff',
                  padding: '14px 28px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 6px rgba(124, 58, 237, 0.3)'
                }}
              >
                💬 Poser une question sur mon devis
              </Link>
            </Section>

            <Hr style={{ borderColor: '#e5e7eb', margin: '20px 0' }} />

            <Section style={{ textAlign: 'center', margin: '20px 0' }}>
              <Text style={{ fontSize: '14px', color: '#6b7280', margin: '5px 0' }}>
                📧 <strong>Email:</strong> info@guapowebdesigner.com
              </Text>
              <Text style={{ fontSize: '14px', color: '#6b7280', margin: '5px 0' }}>
                📱 <strong>Instagram:</strong> @guapo_webdesigner
              </Text>
            </Section>

            <Text style={{ 
              fontSize: '16px', 
              color: '#1f2937', 
              lineHeight: '1.6',
              marginTop: '20px'
            }}>
              À très bientôt,<br />
              <strong style={{ color: '#7c3aed' }}>L'équipe GUAPO Web Designer</strong>
            </Text>

            <Hr style={{ borderColor: '#e5e7eb', margin: '20px 0' }} />
            
            <Text style={{ 
              color: '#9ca3af', 
              fontSize: '12px',
              textAlign: 'center',
              lineHeight: '1.5'
            }}>
              © 2025 GUAPO Web Designer<br />
              Cet email a été envoyé en réponse à votre demande de devis
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}