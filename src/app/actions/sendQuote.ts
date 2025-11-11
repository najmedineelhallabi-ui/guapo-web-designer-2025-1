'use server';

import { resend } from '@/lib/resend';
import { QuoteEmail } from '@/emails/QuoteEmail';
import { z } from 'zod';

const quoteSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Adresse email invalide'),
  company: z.string().min(2, 'Le nom de l\'entreprise/projet doit contenir au moins 2 caractères'),
  sector: z.string().optional(),
  siteType: z.string().min(1, 'Veuillez sélectionner un type de site'),
  pageCount: z.string().min(1, 'Veuillez indiquer le nombre de pages'),
  features: z.array(z.string()).optional(),
  optimization: z.array(z.string()).optional(),
  hosting: z.string().min(1, 'Veuillez sélectionner une option pour l\'hébergement'),
  domain: z.string().min(1, 'Veuillez sélectionner une option pour le nom de domaine'),
  maintenance: z.string().optional(),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères').max(5000),
  rgpdConsent: z.string().refine((val) => val === 'on', {
    message: 'Vous devez accepter la politique de confidentialité pour continuer',
  }),
});

export type QuoteFormState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function sendQuoteAction(
  _prevState: QuoteFormState | undefined,
  formData: FormData
): Promise<QuoteFormState> {
  try {
    // Parse and validate form data
    const rawData = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      company: formData.get('company'),
      sector: formData.get('sector') || undefined,
      siteType: formData.get('siteType'),
      pageCount: formData.get('pageCount'),
      features: formData.getAll('features') as string[],
      optimization: formData.getAll('optimization') as string[],
      hosting: formData.get('hosting'),
      domain: formData.get('domain'),
      maintenance: formData.get('maintenance') || undefined,
      message: formData.get('message'),
      rgpdConsent: formData.get('rgpdConsent'),
    };

    const validatedData = quoteSchema.parse(rawData);

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: 'GUAPO Web Designer <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL_TO || 'info@guapowebdesigner.com',
      replyTo: validatedData.email,
      subject: `Demande de devis - ${validatedData.firstName} ${validatedData.lastName} (${validatedData.company})`,
      react: QuoteEmail({
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        company: validatedData.company,
        sector: validatedData.sector,
        siteType: validatedData.siteType,
        pageCount: validatedData.pageCount,
        features: validatedData.features,
        optimization: validatedData.optimization,
        hosting: validatedData.hosting,
        domain: validatedData.domain,
        maintenance: validatedData.maintenance,
        message: validatedData.message,
      }),
    });

    if (error) {
      console.error('Resend error:', error);
      return {
        success: false,
        message: 'Échec de l\'envoi de la demande. Veuillez réessayer.',
      };
    }

    return {
      success: true,
      message: 'Votre demande de devis a été envoyée avec succès ! Nous vous répondrons dans les plus brefs délais.',
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    console.error('Unexpected error:', error);
    return {
      success: false,
      message: 'Une erreur inattendue s\'est produite',
    };
  }
}