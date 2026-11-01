/**
 * Service offerings named in the brief. Descriptions define what each service
 * covers in general terms. Terms, durations, pricing and response times are
 * NOT stated anywhere until confirmed by the business (see `pending`).
 */
export type Service = {
  id: string;
  name: string;
  summary: string;
  body: string;
  /** Details that must be confirmed before they can be published. */
  pending: string[];
};

export const services: Service[] = [
  {
    id: 'product-support',
    name: 'Product support',
    summary: 'Help choosing, installing and operating the pump.',
    body: 'Guidance on selecting the right category and model for the installation, on correct installation practice, and on operating the pump within its intended duty.',
    pending: ['Support channels and hours'],
  },
  {
    id: 'warranty',
    name: 'Warranty',
    summary: 'Coverage under the terms of each product.',
    body: 'Warranty coverage applies according to the terms of the specific product and manufacturer. Keep the invoice and the pump nameplate details; they are needed for any warranty claim.',
    pending: ['Warranty period per product category', 'Warranty terms and exclusions', 'Claim procedure'],
  },
  {
    id: 'maintenance',
    name: 'Service and maintenance',
    summary: 'Inspection, repair and servicing of installed pumps.',
    body: 'Inspection, fault diagnosis, repair and preventive servicing of pumps and their control equipment, to keep the installation working at its intended duty.',
    pending: ['Service area', 'Workshop or on-site service', 'Brands and pump types serviced'],
  },
  {
    id: 'amc',
    name: 'AMC plans',
    summary: 'Scheduled maintenance under an annual contract.',
    body: 'An annual maintenance contract (AMC) covers scheduled preventive maintenance visits for an installation over a year, so that wear is found and addressed before it causes a breakdown.',
    pending: ['Plan options and scope', 'Visit frequency', 'Pricing'],
  },
  {
    id: 'technical-assistance',
    name: 'Technical assistance',
    summary: 'Engineering advice on duty, sizing and performance problems.',
    body: 'Engineering input on pump sizing, total head and flow calculation, and investigation of installations that are not delivering the expected water.',
    pending: ['How to request assistance'],
  },
];
