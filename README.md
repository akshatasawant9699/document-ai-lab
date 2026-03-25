# 📘 Document AI Learning Lab

> **A comprehensive hands-on learning portal for Salesforce Data Cloud Document AI**

Built with Next.js 16, Tailwind CSS, and designed for seamless Vercel deployment. This portal provides step-by-step recipes, sample documents, code examples, and curated resources to help developers master Salesforce Document AI.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/document-ai-poc)

---

## 🌟 Features

- **🧪 Interactive "Try It" Section** - Connect to Salesforce via OAuth 2.0 PKCE and extract data from documents in real-time
- **📚 Step-by-Step Recipes** - Three progressive tutorials from basic setup to advanced Agentforce integration
- **📄 Sample Documents** - Realistic pharmaceutical industry documents (invoices, prescriptions, lab reports)
- **🐍 Python Code Reference** - Complete Flask app with OAuth, schema generation, and CLI demo
- **💬 AI Chatbot** - Interactive assistant powered by PRD knowledge base
- **🔗 Curated Resources** - Documentation, Slack channels, videos, blogs, and best practices
- **🚀 Production-Ready** - Optimized for Vercel deployment with proper configuration

---

## 🗂️ What's Inside

### 🎯 Recipes (Progressive Tutorials)

| Recipe | Level | Duration | Topics |
|--------|-------|----------|--------|
| **1. Basic Salesforce Setup** | Beginner | 30 min | Enable Document AI, configure schemas, test extraction from UI |
| **2. API with Postman** | Intermediate | 45 min | OAuth 2.0 authentication, REST API calls, confidence scores |
| **3. End-to-End Integration** | Advanced | 90 min | Custom objects, Apex, Screen Flows, Agentforce agents |

### 📄 Sample Documents (Medico Pharmaceuticals)

Realistic pharmaceutical industry documents for testing:

- **Invoices** (2 variants) - Line items, NDC codes, tax calculations
- **Prescription** - Multiple medications, DEA/NPI numbers, ICD-10 codes
- **Lab Report** - CBC, CMP, Lipid Panel with flags and reference ranges
- **Purchase Order** - Corresponding to invoice for cross-reference testing

**Document Relationships**: The samples tell a connected story with cross-references (e.g., PO-MED-4521 matches INV-2026-001)

### 🐍 Python App Reference

Complete Python implementation with:

- **Flask Backend** - OAuth 2.0 PKCE authentication flow
- **Smart Schema Generator** - Auto-detects document type from filename
- **CLI Demo** - Command-line extraction tool with confidence scores
- **Vercel Ready** - Deployment configuration included

### 💬 Interactive AI Chatbot

Built-in chatbot that answers questions about:
- Document AI features and APIs
- Model selection and best practices
- Troubleshooting and error handling
- Schema design tips

### 🔗 Comprehensive Resources

- **Official Documentation** - Salesforce Help, Developer Docs, API Reference
- **Slack & Community** - #dc-document-ai-support, Trailblazer Community, Feature Requests
- **Learning Materials** - Trailhead modules, video demos, tutorials
- **Best Practices** - Schema design, model selection, performance optimization, security
- **Release Notes** - Latest updates, roadmap, known issues
- **Web Resources** - Blogs, GitHub repos, community articles

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Salesforce Org** with Data Cloud enabled
- **Einstein AI** features enabled
- **OAuth Connected App** configured (for "Try It" section)

### Local Development

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/document-ai-poc.git
cd document-ai-poc

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev

# 4. Open in browser
# Navigate to http://localhost:3000
```

### First-Time Setup

1. **Navigate to the portal** at `http://localhost:3000`
2. **Explore the recipes** - Start with Recipe 1: Basic Salesforce Setup
3. **Download sample documents** from the Samples page
4. **Try the interactive extractor** (requires Salesforce OAuth setup)

---

## 📖 Usage Guide

### Following the Recipes

The recipes are designed to be completed in order:

1. **Recipe 1: Basic Setup**
   - Set up Document AI in your Salesforce org
   - Create your first IDP configuration
   - Test extraction from the Salesforce UI

2. **Recipe 2: API with Postman**
   - Authenticate via OAuth 2.0
   - Make API calls from Postman
   - Parse confidence scores and handle responses

3. **Recipe 3: End-to-End Integration**
   - Build custom objects for Medico Pharma
   - Create Apex class for extraction
   - Build Screen Flow for user interaction
   - Deploy Agentforce agent

### Using Sample Documents

1. Navigate to **Samples** page
2. Click **Preview** or **Download** for any document
3. Print HTML to PDF using your browser (Cmd/Ctrl + P)
4. Use the PDF in Document AI testing

### Interactive Extraction ("Try It")

1. Go to **Try It Live** section
2. Enter your Salesforce credentials:
   - **Login URL**: `https://your-domain.my.salesforce.com`
   - **Client ID**: From your Connected App
3. Click **Login with Salesforce** (opens popup)
4. After authentication, upload a document
5. Select LLM model (Gemini 2.0 Flash recommended)
6. Review auto-generated schema or customize
7. Click **Extract Data**
8. View results with confidence scores

### Python Implementation

View the **Python App** tab for:
- Complete Flask application code
- Schema generator implementation
- CLI demo script
- Deployment instructions

Copy and modify for your own projects!

---

## 🚢 Deploy to Vercel

### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/document-ai-poc)

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Option 3: GitHub Integration

1. Push code to GitHub
2. Import repository in [Vercel Dashboard](https://vercel.com/dashboard)
3. Deploy automatically on every push

**📖 See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment guide**

---

## 🛠️ Tech Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Framework** | Next.js 16 | React framework with App Router |
| **Styling** | Tailwind CSS 4 | Utility-first CSS framework |
| **Language** | TypeScript | Type-safe JavaScript |
| **API Routes** | Next.js API Routes | Serverless backend functions |
| **Authentication** | OAuth 2.0 PKCE | Secure Salesforce auth |
| **Deployment** | Vercel | Serverless hosting platform |
| **Icons** | Heroicons | SVG icon library |

### Key Features

- ✅ **Server-side rendering** for optimal SEO
- ✅ **Client-side interactivity** for dynamic features
- ✅ **API proxy** to handle CORS and secure credentials
- ✅ **Responsive design** for mobile and desktop
- ✅ **Type safety** with TypeScript throughout
- ✅ **Production optimized** with Next.js build pipeline

---

## 📁 Project Structure

```
document-ai-poc/
├── src/
│   ├── app/
│   │   ├── page.tsx                      # 🏠 Home / landing page
│   │   ├── layout.tsx                    # Root layout with Navigation & ChatBot
│   │   ├── globals.css                   # Global styles
│   │   ├── recipes/
│   │   │   ├── page.tsx                  # Recipes overview
│   │   │   ├── basic-setup/page.tsx      # 📘 Recipe 1: Basic Setup
│   │   │   ├── api-postman/page.tsx      # 📗 Recipe 2: API & Postman
│   │   │   └── end-to-end/page.tsx       # 📕 Recipe 3: End-to-End
│   │   ├── python-app/page.tsx           # 🐍 Python code reference + Try It
│   │   ├── samples/page.tsx              # 📄 Sample documents
│   │   ├── resources/page.tsx            # 🔗 Curated resources
│   │   ├── auth/
│   │   │   └── callback/page.tsx         # OAuth callback handler
│   │   └── api/
│   │       ├── auth/route.ts             # OAuth token exchange
│   │       ├── extract/route.ts          # Document extraction proxy
│   │       ├── chat/route.ts             # Chatbot API
│   │       └── generate-schema/route.ts  # Auto schema generation
│   ├── components/
│   │   ├── Navigation.tsx                # 🧭 Top navigation bar
│   │   ├── ChatBot.tsx                   # 💬 AI assistant
│   │   ├── CodeBlock.tsx                 # 💻 Syntax-highlighted code
│   │   ├── StepCard.tsx                  # 🔢 Numbered step cards
│   │   ├── InfoBox.tsx                   # ℹ️  Info/warning/tip boxes
│   │   └── RecipeLayout.tsx              # 📐 Shared recipe layout
│   └── lib/
│       └── prd-knowledge.ts              # ChatBot knowledge base
├── public/
│   └── samples/
│       ├── medico-invoice-001.html       # Sample invoice 1
│       ├── medico-invoice-002.html       # Sample invoice 2
│       ├── medico-prescription-001.html  # Sample prescription
│       ├── medico-lab-report-001.html    # Sample lab report
│       └── medico-purchase-order-001.html # Sample PO
├── .gitignore                            # Git ignore rules
├── package.json                          # Dependencies
├── vercel.json                           # Vercel deployment config
├── next.config.ts                        # Next.js configuration
├── tailwind.config.ts                    # Tailwind CSS config
├── tsconfig.json                         # TypeScript config
├── README.md                             # This file
└── DEPLOYMENT.md                         # Deployment guide
```

---

## 🎨 Customization

### Branding

Update colors in `src/app/globals.css`:

```css
:root {
  --sf-navy: #032d60;
  --sf-blue: #0176d3;
  --sf-cloud: #ecf3fe;
  /* Add your colors */
}
```

### Content

- **Recipes**: Edit files in `src/app/recipes/`
- **Samples**: Add new documents to `public/samples/`
- **Resources**: Update `src/app/resources/page.tsx`
- **Chatbot**: Modify knowledge base in `src/lib/prd-knowledge.ts`

### Styling

Built with Tailwind CSS. Modify utility classes directly in components:

```tsx
className="bg-[var(--sf-blue)] text-white hover:bg-[var(--sf-blue-dark)]"
```

---

## 🧪 Testing

### Test Locally

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run production build locally
npm start
```

### Test Checklist

- [ ] All recipe pages load correctly
- [ ] Sample documents download/preview
- [ ] Navigation works across all pages
- [ ] ChatBot opens and responds
- [ ] "Try It" OAuth flow (requires Salesforce setup)
- [ ] API routes return expected responses
- [ ] Responsive design on mobile

---

## 🐛 Troubleshooting

### Common Issues

**Build fails with module errors**
```bash
rm -rf .next node_modules
npm install
npm run build
```

**OAuth popup blocked**
- Allow popups for localhost/your domain
- Check browser console for errors
- Verify Connected App callback URL

**API routes return 404**
- Ensure you're using Next.js 13+ App Router
- Check file structure matches `src/app/api/`
- Verify route.ts files export GET/POST functions

**ChatBot doesn't respond**
- Check `/api/chat` route is working
- Verify PRD knowledge base is populated
- Check browser console for errors

---

## 📚 Learning Resources

### Salesforce Document AI

- [Official Documentation](https://help.salesforce.com/s/articleView?id=data.c360_a_document_ai.htm&type=5)
- [API Reference](https://developer.salesforce.com/docs/data/data-cloud-int/guide/c360-a-document-ai.html)
- [Trailhead Module](https://trailhead.salesforce.com/content/learn/modules/data-360-process-content)

### Next.js & React

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### OAuth 2.0

- [OAuth 2.0 PKCE Flow](https://oauth.net/2/pkce/)
- [Salesforce OAuth Guide](https://help.salesforce.com/s/articleView?id=sf.remoteaccess_oauth_PKCE_flow.htm)

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Contribution Ideas

- Add more sample documents (different industries)
- Create additional recipes (batch processing, error handling)
- Improve ChatBot knowledge base
- Add unit tests
- Translate to other languages
- Enhance UI/UX

---

## 📝 License

This project is intended for educational purposes. Sample documents and code are provided as-is.

**Salesforce, Data Cloud, Einstein, and related trademarks are property of Salesforce, Inc.**

---

## 🙏 Acknowledgments

- **Salesforce Data Cloud Team** for Document AI
- **#dc-document-ai-support** Slack community
- **Ananth Anto** for the Document AI Testbed
- **Medico Pharma** (fictional company used in examples)

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/document-ai-poc/issues)
- **Discussions**: [GitHub Discussions](https://github.com/YOUR_USERNAME/document-ai-poc/discussions)
- **Slack**: #dc-document-ai-support (Salesforce internal)
- **Email**: your-email@example.com

---

## 🗺️ Roadmap

- [ ] Add batch processing example
- [ ] Create video walkthroughs
- [ ] Add more language examples (Java, C#, Go)
- [ ] Implement result comparison tool
- [ ] Add schema validation
- [ ] Create Postman collection
- [ ] Add performance benchmarking

---

**Built with ❤️ for the Salesforce Developer Community**

⭐ **Star this repo** if you find it helpful!
