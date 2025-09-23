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
    totalRevenue: z.string().describe('The total revenue for the day.'),
    totalSales: z.string().describe('The total number of sales for the day.'),
    totalCredit: z.string().describe('The total outstanding credit from clients.'),
    peakHour: z.string().describe('The peak business hour of the day.'),
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
  Use basic HTML tags like <h1>, <h2>, <p>, <ul>, <li>, <strong>. Do not include <head>, <body>, or any CSS.

  Here is the data for the report:

  <h1>Bilan de la Journée - {{currentDate}}</h1>

  <h2>Statistiques Clés</h2>
  <ul>
    <li><strong>Chiffre d'Affaire :</strong> {{{totalRevenue}}}</li>
    <li><strong>Nombre de Ventes :</strong> {{{totalSales}}}</li>
    <li><strong>Total Crédit :</strong> {{{totalCredit}}}</li>
    <li><strong>Heure de Pointe :</strong> {{{peakHour}}}</li>
  </ul>

  <h2>Top Produits du Jour</h2>
  <ul>
    {{#each topProducts}}
    <li>{{this}}</li>
    {{/each}}
  </ul>

  <h2>Historique Détaillé des Ventes</h2>
  {{#each salesHistory}}
  <div>
    <p><strong>Commande #{{id}}</strong> - {{client}} ({{time}})</p>
    <p><strong>Total :</strong> {{total}}</p>
    <ul>
      {{#each items}}
      <li>{{this}}</li>
      {{/each}}
    </ul>
    <hr />
  </div>
  {{/each}}

  <p><em>Rapport généré automatiquement.</em></p>
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
