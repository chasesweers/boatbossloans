import { z } from "zod";

// Shared by the form (client) and the route handler (server), playbook §6.5 / §7.5.
export const newsletterSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address")),
  firstName: z
    .string()
    .trim()
    .max(50, "Keep it under 50 characters")
    .optional()
    .transform((v) => v || undefined),
  sourcePage: z.string().max(200).optional(),
  // Honeypot: hidden from people, irresistible to bots.
  company: z.string().optional(),
});

export type NewsletterInput = z.input<typeof newsletterSchema>;
export type NewsletterSignup = z.output<typeof newsletterSchema>;
