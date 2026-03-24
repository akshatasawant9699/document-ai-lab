# Document AI Learning Lab

A hands-on learning portal for **Salesforce Data Cloud Document AI**. Built with Next.js 16, Tailwind CSS, and designed for Vercel deployment.

## What's Inside

### Recipes (Step-by-Step Tutorials)

1. **Basic Salesforce Setup** - Enable Document AI, configure schemas, and test extraction from the Salesforce UI
2. **API with Postman** - OAuth 2.0 authentication, REST API calls, base64 payloads, and confidence score parsing
3. **End-to-End Integration** - Custom objects, Apex class, Screen Flow, and Agentforce agent for Medico Pharma

### Sample Documents (Medico Pharmaceuticals)

- Pharmaceutical invoices (2 variants)
- Doctor's prescription
- Lab report with test results
- Purchase order

### Python App Reference

- Flask-based Document AI gateway with OAuth 2.0 PKCE
- Smart schema generator
- CLI demo script
- Vercel deployment configuration

### Resources

- Official Salesforce documentation and Trailhead modules
- Implementation guides and tutorials
- GitHub testbed and community tools
- Video demos and walkthroughs
- API reference with supported models

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

```bash
npm run build   # Verify the build succeeds
npx vercel      # Deploy to Vercel
```

Or connect your Git repository to Vercel for automatic deployments.

## Tech Stack

- **Next.js 16** with App Router
- **Tailwind CSS 4** for styling
- **TypeScript** for type safety
- **Static export** - all pages are pre-rendered at build time

## Project Structure

```
src/
  app/
    page.tsx                    # Home / landing page
    recipes/
      page.tsx                  # Recipes overview
      basic-setup/page.tsx      # Recipe 1: Salesforce UI setup
      api-postman/page.tsx      # Recipe 2: REST API + Postman
      end-to-end/page.tsx       # Recipe 3: Apex + Flow + Agentforce
    python-app/page.tsx         # Python app code reference
    samples/page.tsx            # Sample documents page
    resources/page.tsx          # Curated resource links
  components/
    Navigation.tsx              # Top navigation bar
    CodeBlock.tsx               # Syntax-highlighted code with copy
    StepCard.tsx                # Numbered step cards for recipes
    InfoBox.tsx                 # Info/warning/tip callout boxes
    RecipeLayout.tsx            # Shared layout for recipe pages
public/
  samples/                      # Medico Pharma HTML documents
```
