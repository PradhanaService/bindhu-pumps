# Content audit and verification register

## Why this exists

The brief asked for the business content (products, specifications, company facts, contact details, policies)
to come from the reference website, bindhupumps.com. That domain was blocked by the build environment's network
policy, and search engines return no indexed pages for it. **No business facts could be verified.**

To meet the brief's rule against inventing credentials, specifications or claims, every business-specific value is
held as `null` in `src/content/*` and renders on the site as a visible dashed **"To be confirmed"** marker.
Nothing was estimated or filled in.

## What is on the site, and where it came from

| Content | Source | Status |
|---|---|---|
| Five product category names | The brief | Verified by brief |
| Application sectors and sub-applications | The brief | Verified by brief |
| Service offering names (support, warranty, maintenance, AMC, technical assistance) | The brief | Verified by brief |
| Business scope: engineering, sales and service | The brief | Verified by brief |
| How each pump type works, construction, characteristics | General pump engineering, written to describe the pump type, not a product | No business claim |
| Category to application mapping | General practice, worded as "considered", with a duty-assessment caveat | No business claim |
| 3D model geometry and dimensions | Supplied STEP file, measured | Verified from CAD |

## To be confirmed before launch

Edit the files listed. Removing a `null` removes its marker automatically.

### `src/content/site.ts`
- [ ] `brand`: final company name and descriptor; set `isPlaceholder: false` (this also enables search indexing)
- [ ] `contact.phone`, `contact.phoneAlt`, `contact.email`
- [ ] `contact.whatsapp`: only if the business uses WhatsApp (the button and links appear automatically)
- [ ] `contact.addressLines`, `contact.mapUrl`, `contact.hours`
- [ ] `companyFacts`: established, registered office, service area, brands, manufacturing, certifications

### `src/content/products.ts` (per category)
- [ ] Power rating (HP/kW range), supply (phase, voltage, frequency)
- [ ] Head range, flow range, outlet size
- [ ] Bore size and stages (borewell); mounting (openwell); suction/delivery size (monoblock)
- [ ] Pump materials, motor type and insulation class
- [ ] Warranty period
- [ ] `documents`: catalogue PDFs and performance curves (put files in `public/docs/`)
- [ ] Optional: product photographs from the business

### `src/content/catalogue.ts` (shop)
The six shop products are **samples** added to review the shop layout. Their names, prices and
specifications are examples, shown on the site with "Sample" tags.
- [ ] Replace each item with a real product: name, SKU, category, price (INR), description, highlights, specs
- [ ] Add product photos to `public/images/products/` and list them in `images`
- [ ] Set `isSample: false` on each real item (removes its Sample tags and the shop's sample notice)
- [ ] Add a GLB per product in `public/models/` when available; until then every product shows the reference model

### `src/content/services.ts`
- [ ] Warranty periods, terms and claim procedure
- [ ] AMC plan scope, visit frequency, pricing
- [ ] Service area, on-site or workshop, brands serviced
- [ ] Support channels and hours

### `src/app/company/page.tsx`
- [ ] Company history, years in operation, team experience
- [ ] Sourcing and inspection practice; delivery coverage and lead times

### Legal (`src/app/privacy`, `src/app/terms`)
- [ ] Review both drafts; add legal entity name, address, jurisdiction, and the services that process enquiry data

### Deployment
- [ ] Set `NEXT_PUBLIC_SITE_URL`
- [ ] Configure enquiry delivery (`.env.example`); until then the form tells visitors that their enquiry was **not** sent

## Content rules applied
- No testimonials, statistics, certifications, awards, partnerships or performance figures
- No response-time or warranty promises
- No em dashes in site copy
- The 3D model is labelled as a representative reference model from supplied CAD, not a catalogue item.
  Internal parts absent from the CAD are described in text and never drawn.
