# Document AI Learning Lab

> **A hands-on learning portal for Salesforce Data Cloud Document AI**

Interactive recipes, sample documents, code examples, and curated resources to help developers master Salesforce Document AI.

**Live Portal**: [document-ai-lab.vercel.app](https://document-ai-lab.vercel.app)

---

## Features

- **Interactive "Try It" Section** - Connect to Salesforce via OAuth 2.0 PKCE and extract data from documents in real-time
- **Step-by-Step Recipes** - Three progressive tutorials from basic setup to advanced Agentforce integration
- **Sample Documents** - Realistic pharmaceutical industry documents (invoices, prescriptions, lab reports)
- **Python Code Reference** - Complete Flask app with OAuth, schema generation, and CLI demo
- **AI Chatbot** - Interactive assistant that answers questions about Document AI
- **Curated Resources** - Documentation, community forums, videos, blogs, and best practices

---

## What's Inside

### Recipes (Progressive Tutorials)

| Recipe | Level | Duration | Topics |
|--------|-------|----------|--------|
| **1. Basic Salesforce Setup** | Beginner | 30 min | Enable Document AI, configure schemas, test extraction from UI |
| **2. API with Postman** | Intermediate | 45 min | OAuth 2.0 authentication, REST API calls, confidence scores |
| **3. End-to-End Integration** | Advanced | 90 min | Custom objects, Apex, Screen Flows, Agentforce agents |

### Sample Documents (Medico Pharmaceuticals)

Realistic pharmaceutical industry documents for testing:

- **Invoices** (2 variants) - Line items, NDC codes, tax calculations
- **Prescription** - Multiple medications, DEA/NPI numbers, ICD-10 codes
- **Lab Report** - CBC, CMP, Lipid Panel with flags and reference ranges
- **Purchase Order** - Corresponding to invoice for cross-reference testing

The samples tell a connected story with cross-references (e.g., PO-MED-4521 matches INV-2026-001).

### Interactive Extraction ("Try It")

1. Go to the **Try It** section
2. Enter your Salesforce Login URL and Client ID
3. Click **Login with Salesforce** (opens in a new window)
4. After authentication, upload a document
5. Select an LLM model (Gemini 2.0 Flash recommended)
6. Review the auto-generated schema or customize it
7. Click **Extract Data** and view results with confidence scores

### Python Code Reference

Complete Python implementation available on the Try It page:

- **Flask Backend** - OAuth 2.0 PKCE authentication flow
- **Smart Schema Generator** - Auto-detects document type from filename
- **CLI Demo** - Command-line extraction tool with confidence scores

### AI Chatbot

Built-in chatbot (bottom-right corner) that answers questions about:
- Document AI features and APIs
- Model selection and best practices
- Schema design tips
- Troubleshooting and error handling

---

## Getting Started

### Prerequisites

- **Salesforce Org** with Data Cloud and Einstein AI enabled
- **External Client App** configured in Salesforce (see setup below)

### Quick Setup (5 minutes)

#### 1. Enable Einstein AI in Your Org

1. Go to **Setup** → Search for **"Einstein Setup"**
2. Click **"Turn on Einstein"**
3. Accept the terms of service
4. Wait 5-10 minutes for provisioning

#### 2. Create External Client App

1. Go to **Setup** → Search for **"External Client App Manager"**
2. Click **"New External Client App"**
3. Fill in:
   - **Name:** Document AI Testbed (or any name)
   - **Distribution State:** Local
4. Under **OAuth Settings**:
   - Enable **"Authorization Code and Credentials Flow"**
   - **Callback URL:** `https://document-ai-lab.vercel.app/auth/callback` (or `http://localhost:3000/auth/callback` for local)
   - **OAuth Scopes:** `api`, `cdp_api`, `refresh_token`
5. Save and copy your **Client ID**

#### 3. Use the Try It Section

Visit [document-ai-lab.vercel.app/python-app](https://document-ai-lab.vercel.app/python-app) and:

1. Click **"Login with Salesforce"**
2. Enter your **Client ID** when prompted (or set `NEXT_PUBLIC_SF_CLIENT_ID` env variable)
3. Authenticate in the popup window
4. Upload a document and extract data!

### Using the Portal

1. **Start with Recipe 1** to set up Document AI in your org
2. **Download sample documents** from the Samples page
3. **Follow Recipe 2** to learn the API with Postman
4. **Use the Try It section** to test extraction directly in your browser
5. **Complete Recipe 3** for a full Apex + Flow + Agentforce integration

### Running Locally

```bash
git clone https://github.com/akshatasawant9699/document-ai-lab.git
cd document-ai-lab
npm install

# Optional: Configure environment variables
cp .env.local.example .env.local
# Edit .env.local and add your Salesforce Client ID

npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

#### Environment Variables

Create a `.env.local` file (see `.env.local.example`):

```bash
# Your Salesforce External Client App Client ID
NEXT_PUBLIC_SF_CLIENT_ID=your_client_id_here

# Salesforce Login URL (default: https://login.salesforce.com)
NEXT_PUBLIC_SF_LOGIN_URL=https://login.salesforce.com

# Optional: OpenAI API Key for enhanced chatbot
OPENAI_API_KEY=
```

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 16 with App Router |
| **Styling** | Tailwind CSS 4 |
| **Language** | TypeScript |
| **API Routes** | Next.js Route Handlers |
| **Authentication** | OAuth 2.0 PKCE |

---

## Project Structure

```
src/
  app/
    page.tsx                    # Home page
    layout.tsx                  # Root layout with nav and chatbot
    recipes/
      page.tsx                  # Recipes overview
      basic-setup/page.tsx      # Recipe 1: Basic Setup
      api-postman/page.tsx      # Recipe 2: API with Postman
      end-to-end/page.tsx       # Recipe 3: End-to-End Integration
    python-app/page.tsx         # Try It + Python reference
    samples/page.tsx            # Sample documents
    resources/page.tsx          # Curated resources
    auth/callback/page.tsx      # OAuth callback handler
    api/
      auth/route.ts             # OAuth token exchange
      extract/route.ts          # Document AI extraction proxy
      chat/route.ts             # Chatbot API
      generate-schema/route.ts  # Auto schema generation
  components/                   # Reusable UI components
  lib/
    prd-knowledge.ts            # Chatbot knowledge base
public/
  samples/                      # Medico Pharma HTML documents
```

---

## Learning Resources

- [Document AI Documentation](https://help.salesforce.com/s/articleView?id=data.c360_a_document_ai.htm&type=5)
- [Document AI API Reference](https://developer.salesforce.com/docs/data/data-cloud-int/guide/c360-a-document-ai.html)
- [Trailhead: Data 360 Process Content](https://trailhead.salesforce.com/content/learn/modules/data-360-process-content)
- [Salesforce OAuth PKCE Guide](https://help.salesforce.com/s/articleView?id=sf.remoteaccess_oauth_PKCE_flow.htm)

---

## Contributing

Contributions are welcome:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

This project is intended for educational purposes. Sample documents and code are provided as-is.

Salesforce, Data Cloud, Einstein, and related trademarks are property of Salesforce, Inc.
