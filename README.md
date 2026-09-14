# Hire a Wifey — Hervey Bay Homepage

> **WE TAKE CARE OF HOME.**
> Premium, mobile-first, one-page landing site for Hire a Wifey (Hervey Bay, QLD).
> Static prototype built for faithful conversion into WordPress + Elementor.

## What's in the box

| Path | Purpose |
|---|---|
| `index.html` | The complete homepage — semantic, Elementor-mappable sections, one `<h1>` |
| `booking.html` | Booking page — reuses the homepage design system and the shared enquiry-form logic in `public/script.js` to power its booking form |
| `recruitment.html` | Recruitment / careers page — reuses the homepage design system and the shared enquiry-form logic in `public/script.js` to power its application form |
| `public/style.css` | Mobile-first design system (numbered sections, reusable classes) — shared by all three pages |
| `public/script.js` | Vanilla JS: nav, accordion, form validation, sticky CTA, reveal |
| `public/assets/` | Photography (uniformed Wifeys), logo SVGs, lifestyle imagery |

No React / Vue / Angular / jQuery is used by the page — it's plain, dependency-free
HTML/CSS/JS with no build step required.

### Multi-page notes

`index.html`, `booking.html` and `recruitment.html` all load the same
`public/style.css` and `public/script.js`, so header, footer, buttons, forms,
accordion and reveal animations behave identically on every page.

* On `booking.html` and `recruitment.html`, header/footer nav links that point to
  homepage sections are written as `index.html#section` (e.g. `index.html#faq`)
  since those sections only exist on the homepage.
* The booking and application forms reuse the exact field IDs and classes from
  the homepage's enquiry form (`#enquiry-form`, `#enq-name`, `#enq-mobile`,
  `#enq-suburb`, `#enq-message`, `.js-submit`, `#enquiry-reset`) so the shared
  validation/submission logic in `public/script.js` works on both pages without
  any changes to that file. Extra fields on those pages (frequency, task
  checkboxes, experience, availability, etc.) are collected but not validated —
  the same pattern the homepage already uses for its optional "topic" field.

## Run it

```bash
# Just open it
open index.html
```

Or upload the folder as-is to any static host (Netlify, GitHub Pages, S3, etc.),
or hand it to the WordPress developer as the visual/functional reference.

## Configure the CTAs (one place)

Open `public/script.js` and edit:

```js
var SITE_CONFIG = {
  BOOKING_URL: 'booking.html',        // future Booking Page
  RECRUITMENT_URL: 'recruitment.html' // future Recruitment Page
};
```

Every booking-intent button (`data-cta="booking"`) and recruitment button
(`data-cta="recruitment"`) updates automatically. Enquiry buttons scroll to `#enquiry`.

## Elementor conversion map

| HTML section (`id`) | Elementor widgets |
|---|---|
| `#home` hero | Container (2 col) → Heading, Text, Buttons, Image, HTML (to-do card + stamp) |
| `.trust-strip` | Icon List (inline) |
| `#intro`, `#difference`, `#trust` | Container, Heading, Text, Icon Box, Image, Button |
| `#services` | Container grid → Image Box / custom `.service-card` |
| `#your-visit`, `#who-we-help`, `#regular`, `#why` | Icon List, Icon Box, custom cards |
| `#ndis-dva`, `#areas`, `#how` | Container, Heading, Text, Icon List, Button |
| `#time-back` | Container with background image overlay |
| `#reviews` | Testimonial / Reviews widget (placeholders — replace with real reviews) |
| `#faq` | **Accordion** widget (all 25 Q&As are in the HTML) |
| `#enquiry` | **Form** widget (fields listed in the HTML) + contact Icon List |
| `#final-cta`, `#careers`, `.footer` | Container, Heading, Buttons, footer columns |
| `.sticky-cta` | Custom HTML / sticky container (mobile only) |

Reusable class names to carry over: `.section .container .section-heading
.primary-btn .secondary-btn .service-card .trust-card .review-card .faq-item
.enquiry-form .cta-section .footer`.

## Brand rules baked into the build

* Logo: `public/assets/logo-hire-a-wifey.svg` (+ white variant). Never redraw — swap
  in the client's master file when the WordPress site is built.
* Uniform: every Wifey photo shows the official black polo, hot-pink piping, pink
  collar/cuff trim and the Hire a Wifey logo on the left chest. Photos without a
  verifiable uniform were replaced by people-free lifestyle shots.
* Reviews are clearly marked placeholders — no fake testimonials.
* Business facts (phone, email, ABN, suburbs, services) come only from the client brief.

## Before go-live checklist

- [ ] Replace `booking.html` / `recruitment.html` with real page URLs
- [ ] Connect the enquiry form (Elementor Form → email / CRM). The prototype only simulates success.
- [ ] Add real customer reviews (or a Google review feed) in `#reviews`
- [ ] Drop in the master logo file and, ideally, a real staff photo shoot in uniform
- [ ] Add FAQPage schema via the SEO plugin if desired (content is already semantic)
- [ ] Set the canonical URL / OG image to the live domain

## Credits & licences

See [`CREDITS.md`](CREDITS.md) for photography and font licences.
