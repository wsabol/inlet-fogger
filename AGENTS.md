# AGENTS.md

This file gives coding agents the repository-specific context needed to make safe, consistent changes.

## Project intent

This is an educational engineering site about gas-turbine inlet fogging. Preserve the distinction between:

- modeled behavior and measured field performance;
- general operating guidance and site-specific recommendations; and
- thermodynamic cooling performance and equipment reliability.

Do not present the simulator as a design, safety, or OEM-compliance tool. Avoid adding unsupported performance guarantees or prescriptive operating limits.

## Repository map

- `src/app/pages/`: route-level educational and simulator pages
- `src/app/components/`: reusable layout and content components
- `src/app/content/`: shared glossary and comparison content
- `src/app/simulator/`: simulator state, inputs, results, interpretations, and charts
- `src/model/`: model equations, transfer calculations, types, presets, validation, and tests
- `src/model/worker.ts`: browser Web Worker wrapper for the model
- `worker/index.ts`: Cloudflare Worker API for contact-form email
- `public/`: files served as-is, including the case-study PDF
- `img/`: source images and diagrams used by the project

## Working conventions

- Use TypeScript and functional React components.
- Follow the existing formatting: two-space indentation, double quotes, semicolons, and trailing commas.
- Keep route composition in `src/app/App.tsx` and navigation metadata in `src/app/nav.ts` aligned when adding or removing pages.
- Prefer the `@/` alias for cross-area imports; short relative imports are fine within a feature directory.
- Reuse `PageShell`, `PageIntro`, `Section`, `InsightCard`, `TextLink`, and `Term` before introducing parallel UI patterns.
- Follow the existing visual language and Tailwind tokens defined in `src/index.css`. Verify responsive behavior rather than designing only for desktop.
- Keep long-running model calculations off the React render path. The Web Worker is the primary execution path; the synchronous path in `useSimulation.ts` is a fallback.
- Do not edit generated output such as `dist/`, TypeScript build-info files, or generated Cloudflare types unless the task specifically requires regeneration.

## Model guardrails

Changes under `src/model/` require extra care:

- UI-facing scenario temperatures are °F, humidity and load are percentages, water flow is gpm, and droplet diameter is μm.
- `ModelInputs` uses °F, fractional humidity/load, gpm, and μm. Internal transfer calculations convert to SI units where needed.
- Keep unit conversions explicit at boundaries. Do not silently change the meaning of an existing field.
- Preserve the fixed integration assumptions unless the task explicitly changes the model: `DELTA_T`, `T_MAX`, `REFERENCE_AIRFLOW_PPH`, and `CHART_STRIDE` live in `src/model/types.ts`.
- Maintain the model's stopping reasons and result shape because the simulator and interpretation layers consume them.
- Update both worker and fallback execution paths if request or response types change.
- Add or update regression tests for equation, constant, unit, validation-range, termination, or output-shape changes.
- Treat scientific claims in page copy, presets, and interpretations with the same care as model code. Keep qualifications and assumptions visible.

## Contact API guardrails

The endpoint in `worker/index.ts` accepts only JSON `POST` requests at `/api/contact`.

- Keep server-side validation even if client-side validation exists.
- Preserve output escaping for HTML email content.
- Never commit API keys, destination addresses, `.dev.vars`, or other secrets.
- Keep bot handling and public error messages from leaking provider details.
- If the payload changes, update the form, Worker types, validation, and tests together.

## Verification

Run the checks appropriate to the change, and run both before completing broad changes:

```bash
npm test
npm run build
```

For model work, add targeted Vitest coverage near the affected module. For UI work, inspect the relevant routes in a browser at mobile and desktop widths. Exercise the contact form's success and failure states when changing either side of that flow.

## Change hygiene

- Inspect `git status` first and preserve unrelated user changes.
- Keep changes scoped to the request; do not rewrite engineering copy or numerical constants incidentally.
- Do not commit build artifacts or secrets.
- Summarize changed behavior, tests run, and any remaining assumptions when handing work back.
