# AGENTS.md — Working rules for AI agents on this repo

> Purpose: give any AI agent (or new developer) instant context so it acts correctly **without
> re-exploring or burning tokens**. Read this file before doing anything. Spanish is the
> project's working language for content and docs; code identifiers in English.

## 1. What this project is

Official institutional website of **RECUPERAR S.R.L.** (industrial mineral fertilizers,
Córdoba, Argentina, with its own quarry). Redesign replacing the current Wix Editor site
(https://www.recuperarsrl.com.ar). **Institutional site only: no e-commerce, no payments,
no chat, no members.** Blog is explicitly out of scope for v1.

The live site is production during all development — **never touch the existing Wix site**.

## 2. Stack (decided — do not change without the owner of the repo)

| Layer | Choice |
|---|---|
| Framework | Astro 5.x, static output, TypeScript strict |
| Node / packages | Node 26 LTS, npm (never yarn here) |
| Version control | Git + GitHub, branch `main`, conventional commits (English subjects: `feat:`, `docs:`, `fix:`...) |
| Hosting | Wix Headless — deploy the static build (`dist/`) via `wix.com/headless/drop` or `npx wix release` |
| Do NOT use | Velo/Wix Studio development, Velo packages, PHP, server frameworks (Express etc.) — the site must stay statically deployable |

## 3. Project layout (see docs/arquitectura-estructura.md)

```
src/content/   data: products (typed schema), crops, site copy
src/assets/    source images (Astro optimizes to AVIF/WebP)
src/components UI blocks  |  src/layouts page shells
src/pages/     routes (file-based). This is the "controller" layer.
public/files/  downloadable PDFs (technical sheets, manuals)
docs/          all project documentation (Spanish)
```

- **Content lives in `src/content/` as typed files, not hardcoded in pages.** Two taxonomies
  point to the same product collection: by product line, and by crop (extensivo/intensivo).
- Product slugs and identifiers in English (`microcanphos-soja` style kebab-case); displayed
  content in Spanish.

## 4. Hard constraints

- Build output budget: **20 MB total** (Wix Headless upload). Optimize images, keep PDFs lean.
- Entry point must remain `index.html` at build root (Astro default — don't break it).
- The contact form must work on static hosting: use an email service or a Wix Headless CLI
  backend on Cloudflare Workers runtime — decision tracked in docs/perfil-tecnico.md.
- **No `dist/` commits, no binary originals over ~1 MB in git without consulting owner.**

## 5. Commands

```bash
npm install        # first setup
npm run dev        # local dev at localhost:4321
npm run build      # production build to dist/
npm run preview    # serve the built dist/
npm run check      # type/content-collection checks, run before committing
```

## 6. Where the truth lives (read before acting)

| Doc | Contents |
|---|---|
| `docs/perfil-tecnico.md` | decisions, constraints, email-strategy options |
| `docs/arquitectura-estructura.md` | structure, data model, asset rules |
| `docs/backlog.md` | phase plan + open questions |
| `docs/contenido-relevado.md` | real content inventory from the current site |
| `docs/wix/` | Wix ecosystem research and setup notes |

When a decision is made in chat, update the relevant doc and commit it (`docs:`). Do not start
coding features not present in `docs/backlog.md` without asking first.
