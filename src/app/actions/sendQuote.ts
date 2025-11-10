'use server';

import { resend } from '@/lib/resend';
import { QuoteEmail } from '@/emails/QuoteEmail';
import { z } from 'zod';

const quoteSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Adresse email invalide'),
  phone: z.string().optional(),
  projectType: z.string().min(1, 'Veuillez sélectionner un type de projet'),
  budget: z.string().optional(),
  deadline: z.string().optional(),
  domain: z.string().min(1, 'Veuillez sélectionner une option pour le nom de domaine'),
  hosting: z.string().min(1, 'Veuillez sélectionner une option pour l\'hébergement'),
  features: z.array(z.string()).optional(),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères').max(5000),
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
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone') || undefined,
      projectType: formData.get('projectType'),
      budget: formData.get('budget') || undefined,
      deadline: formData.get('deadline') || undefined,
      domain: formData.get('domain'),
      hosting: formData.get('hosting'),
      features: formData.getAll('features') as string[],
      message: formData.get('message'),
    };

    const validatedData = quoteSchema.parse(rawData);

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: 'GUAPO Web Designer <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL_TO || 'info@guapowebdesigner.com',
      replyTo: validatedData.email,
      subject: `Demande de devis - ${validatedData.name} (${validatedData.projectType})`,
      react: QuoteEmail({
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        projectType: validatedData.projectType,
        budget: validatedData.budget,
        deadline: validatedData.deadline,
        domain: validatedData.domain,
        hosting: validatedData.hosting,
        features: validatedData.features,
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