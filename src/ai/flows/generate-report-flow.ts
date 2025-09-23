'use server';
/**
 * @fileOverview A flow to generate a daily report email body.
 *
 * - generateReport - A function that generates the report.
 * - GenerateReportInput - The input type for the generateReport function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateReportInputSchema = z.object({
    totalRevenue: z.string().describe("The total revenue for the day."),
    totalSales: z.string().describe("The total number of sales for the day."),
    totalCredit: z.string().describe("The total outstanding credit from clients."),
    peakHour: z.string().describe("The peak business hour of the day."),
    topProducts: z.array(z.string()).describe('A list of the top-selling products for the day.'),
    salesHistory: z.array(z.object({
        id: z.string(),
        client: z.string(),
        time: z.string(),
        total: z.string(),
        items: z.array(z.string()),
    })).describe('A detailed list of all sales transactions for the day.'),
});
export type GenerateReportInput = z.infer<typeof GenerateReportInputSchema>;

export async function generateReport(input: GenerateReportInput): Promise<string> {
  return generateReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReportPrompt',
  input: { schema: GenerateReportInputSchema },
  output: { format: 'text' },
  prompt: `
  You are an assistant responsible for generating a daily report for a coffee shop owner.
  Generate an HTML email body summarizing the day's business.
  The report should be clean, professional, and easy to read.
  Use inline CSS for styling to ensure compatibility with email clients. Do not include <head> or <body> tags.
  The design should be modern, using a dark theme with orange accents.

  Here is the data for the report:

  <div style="font-family: Arial, sans-serif; background-color: #1a1a1a; color: #f0f0f0; padding: 20px; max-width: 600px; margin: auto; border-radius: 8px;">
    <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #444;">
        <h1 style="color: #f97316; margin: 0;">Bilan de la Journée</h1>
        <p style="color: #aaa; margin: 5px 0 0;">{{currentDate}}</p>
    </div>

    <div style="padding: 20px 0; border-bottom: 1px solid #444;">
        <h2 style="color: #f97316; margin-top: 0;">Statistiques Clés</h2>
        <table style="width: 100%; color: #f0f0f0;">
            <tr style="border-bottom: 1px solid #333;">
                <td style="padding: 8px 0;"><strong>Chiffre d'Affaire :</strong></td>
                <td style="text-align: right; font-weight: bold;">{{{totalRevenue}}}</td>
            </tr>
            <tr style="border-bottom: 1px solid #333;">
                <td style="padding: 8px 0;"><strong>Nombre de Ventes :</strong></td>
                <td style="text-align: right;">{{{totalSales}}}</td>
            </tr>
            <tr style="border-bottom: 1px solid #333;">
                <td style="padding: 8px 0;"><strong>Total Crédit :</strong></td>
                <td style="text-align: right;">{{{totalCredit}}}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0;"><strong>Heure de Pointe :</strong></td>
                <td style="text-align: right;">{{{peakHour}}}</td>
            </tr>
        </table>
    </div>

    <div style="padding: 20px 0; border-bottom: 1px solid #444;">
        <h2 style="color: #f97316;">Top Produits du Jour</h2>
        <ul style="list-style: none; padding: 0;">
            {{#each topProducts}}
            <li style="background-color: #2c2c2c; padding: 10px; border-radius: 4px; margin-bottom: 5px;">{{this}}</li>
            {{/each}}
        </ul>
    </div>

    <div style="padding: 20px 0;">
        <h2 style="color: #f97316;">Historique Détaillé des Ventes</h2>
        {{#each salesHistory}}
        <div style="background-color: #2c2c2c; padding: 15px; border-radius: 4px; margin-bottom: 10px;">
            <p style="margin: 0; font-weight: bold;">Commande #{{id}} - {{client}} ({{time}})</p>
            <p style="margin: 5px 0; color: #f97316; font-size: 1.1em;">Total : {{total}}</p>
            <ul style="margin: 10px 0 0 20px; padding: 0; color: #ccc;">
              {{#each items}}
              <li>{{this}}</li>
              {{/each}}
            </ul>
        </div>
        {{/each}}
    </div>

    <div style="text-align: center; padding-top: 20px; border-top: 1px solid #444;">
        <p style="color: #aaa; font-size: 0.8em; margin: 0;"><em>Rapport généré automatiquement.</em></p>
    </div>
  </div>
  `,
});

const generateReportFlow = ai.defineFlow(
  {
    name: 'generateReportFlow',
    inputSchema: GenerateReportInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const today = new Date().toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const { output } = await prompt({
        ...input,
        currentDate: today,
    });
    return output!;
  }
);
