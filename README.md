# Inlet Fogging: Physics & Practice

An interactive engineering site about gas-turbine inlet fogging. It combines practical field guidance with a transient droplet model so users can explore how inlet-air conditions, water temperature, flow, turbine load, and droplet size affect evaporation and air cooling.

The simulator is an educational comparison tool, not a substitute for OEM guidance, site-specific analysis, or engineering judgment.

## What is included

- Explanations of inlet-fogging physics and operating tradeoffs
- An interactive simulator with up to three comparable scenarios
- Presets for hot and cold water, dry and humid weather, and different droplet sizes
- Charts for temperature, droplet diameter, relative humidity, density, and energy transfer
- Field-oriented guidance for nozzles, pumps, drainage, controls, and maintenance
- A case study and downloadable white paper
- A contact form delivered through a Cloudflare Worker and Resend

## Tech stack

- React 19 and TypeScript
- Vite 8
- Tailwind CSS 4
- React Router
- Recharts
- Vitest
- Cloudflare Workers and Wrangler

## Getting started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Vite prints the local URL when the server starts. The Cloudflare Vite plugin also makes the Worker endpoint available during development.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm test` | Run the test suite once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run build` | Type-check and create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run deploy` | Build and deploy with Wrangler |
| `npm run cf-typegen` | Generate Cloudflare environment types |

## Contact form configuration

The contact endpoint at `/api/contact` requires two Cloudflare Worker secrets or environment variables:

- `RESEND_API_KEY`: API key used to send mail through Resend
- `CONTACT_TO_EMAIL`: destination address for contact submissions

For a deployed Worker, configure them with Wrangler:

```bash
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put CONTACT_TO_EMAIL
```

The sender address is currently configured in `worker/index.ts` and must be valid for the associated Resend account.

## Project structure

```text
src/
  app/
    components/     Shared layout and content components
    content/        Glossary and field-comparison content
    pages/          Route-level pages
    simulator/      Simulator controls, charts, and state
  model/            Physics model, validation, presets, and tests
  main.tsx          Browser entry point
worker/
  index.ts          Cloudflare Worker contact API
public/             Static public assets
img/                Source images and diagrams
```

The numerical model runs in a Web Worker to keep the interface responsive. Its public UI inputs use °F, percent, gallons per minute, and micrometres; conversion to model units happens at the boundary in `src/model/types.ts`.

## Testing and verification

Before submitting a change, run:

```bash
npm test
npm run build
```

Model changes should include focused regression tests. UI or content changes should also be checked in the browser at narrow and wide viewport sizes.

## Deployment

The application is configured as a Cloudflare single-page application in `wrangler.jsonc`. After authenticating Wrangler and setting the contact secrets, deploy with:

```bash
npm run deploy
```

Client-side routes fall back to the application shell through Cloudflare's `single-page-application` asset handling.

## Further reading

The case-study white paper is available at `public/Fogger-Case-Study-White-Paper.pdf` and is linked from the site.

