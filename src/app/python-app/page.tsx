import CodeBlock from "@/components/CodeBlock";
import InfoBox from "@/components/InfoBox";
import Link from "next/link";

export const metadata = {
  title: "Python App - Document AI Lab",
};

export default function PythonAppPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[var(--sf-navy)] mb-3">
          Document AI Python Gateway App
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          A ready-to-deploy Flask application that provides a web UI for testing Document AI extraction.
          Features OAuth 2.0 PKCE authentication, file upload, confidence score visualization, and
          Vercel deployment support.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-bold text-[var(--sf-navy)] mb-3">Doc AI Gateway</h3>
          <p className="text-sm text-gray-600 mb-4">
            Full-featured test platform with OAuth PKCE, file upload, ML model selection,
            confidence score table with color coding, and a schema builder tool.
          </p>
          <div className="flex flex-wrap gap-2">
            {["Flask", "OAuth 2.0 PKCE", "Vercel", "Confidence Scores", "Schema Builder"].map((t) => (
              <span key={t} className="px-2 py-1 bg-blue-50 text-[var(--sf-blue)] rounded text-xs">{t}</span>
            ))}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-bold text-[var(--sf-navy)] mb-3">Doc AI Mini</h3>
          <p className="text-sm text-gray-600 mb-4">
            Simplified step-by-step wizard with runtime configuration (no .env needed),
            smart schema generation based on filename, and IDP configuration support.
          </p>
          <div className="flex flex-wrap gap-2">
            {["Flask", "Step-by-Step Wizard", "Smart Schema", "IDP Config", "Serverless"].map((t) => (
              <span key={t} className="px-2 py-1 bg-purple-50 text-[var(--sf-purple)] rounded text-xs">{t}</span>
            ))}
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-[var(--sf-navy)] mb-4 border-b-2 border-[var(--sf-cloud)] pb-2">
        App Architecture
      </h2>

      <div className="bg-gray-50 rounded-xl p-6 my-6 font-mono text-sm">
        <pre className="text-gray-700 whitespace-pre-wrap">{`
doc-ai-gateway/
  app.py                 # Flask app (routes, auth, extraction)
  api_client.py          # APIClient class for token management
  config.py              # Environment config loader
  api/
    index.py             # Vercel serverless entry point
  templates/
    index.html           # Web UI (single page)
  static/
    json-jazz.html       # JSON schema builder tool
  demo/
    document_ai_demo.py  # Standalone CLI demo script
  vercel.json            # Vercel deployment config
  requirements.txt       # Python dependencies
        `}</pre>
      </div>

      <h2 className="text-2xl font-bold text-[var(--sf-navy)] mb-4 mt-10 border-b-2 border-[var(--sf-cloud)] pb-2">
        Core Application Code
      </h2>

      <h3 className="text-lg font-semibold text-[var(--sf-blue-dark)] mt-6 mb-3">Flask App (app.py)</h3>
      <CodeBlock
        language="python"
        filename="app.py"
        code={`import os
import json
import base64
import hashlib
import secrets
from flask import Flask, request, redirect, jsonify, render_template, session
import requests
from config import Config

app = Flask(__name__)
app.secret_key = os.urandom(32)

config = Config()

@app.route("/")
def index():
    return render_template("index.html",
        authenticated=session.get("authenticated", False),
        instance_url=session.get("instance_url", ""))

@app.route("/auth/login")
def auth_login():
    code_verifier = secrets.token_urlsafe(64)
    code_challenge = base64.urlsafe_b64encode(
        hashlib.sha256(code_verifier.encode()).digest()
    ).rstrip(b"=").decode()

    session["code_verifier"] = code_verifier

    redirect_uri = request.host_url.rstrip("/") + "/auth/callback"
    auth_url = (
        f"{config.LOGIN_URL}/services/oauth2/authorize"
        f"?response_type=code"
        f"&client_id={config.CLIENT_ID}"
        f"&redirect_uri={redirect_uri}"
        f"&code_challenge={code_challenge}"
        f"&code_challenge_method=S256"
    )
    return redirect(auth_url)

@app.route("/auth/callback")
def auth_callback():
    code = request.args.get("code")
    redirect_uri = request.host_url.rstrip("/") + "/auth/callback"

    response = requests.post(
        f"{config.LOGIN_URL}/services/oauth2/token",
        data={
            "grant_type": "authorization_code",
            "client_id": config.CLIENT_ID,
            "client_secret": config.CLIENT_SECRET,
            "code": code,
            "redirect_uri": redirect_uri,
            "code_verifier": session.get("code_verifier", ""),
        },
    )

    if response.status_code == 200:
        token_data = response.json()
        session["access_token"] = token_data["access_token"]
        session["instance_url"] = token_data["instance_url"]
        session["authenticated"] = True

    return redirect("/")

@app.route("/extract-data", methods=["POST"])
def extract_data():
    if not session.get("authenticated"):
        return jsonify({"error": "Not authenticated"}), 401

    file = request.files.get("document")
    schema = request.form.get("schema", "")
    model = request.form.get("model", "llmgateway__VertexAIGemini20Flash001")

    if not file:
        return jsonify({"error": "No file provided"}), 400

    file_content = file.read()
    base64_data = base64.b64encode(file_content).decode("utf-8")
    mime_type = file.content_type or "application/pdf"

    payload = {
        "mlModel": model,
        "schemaConfig": schema,
        "files": [{"mimeType": mime_type, "data": base64_data}],
    }

    api_url = (
        f"{session['instance_url']}/services/data/{config.API_VERSION}"
        f"/ssot/document-processing/actions/extract-data"
        f"?htmlEncode=false&extractDataWithConfidenceScore=true"
    )

    response = requests.post(
        api_url,
        json=payload,
        headers={
            "Authorization": f"Bearer {session['access_token']}",
            "Content-Type": "application/json",
        },
    )

    return jsonify(response.json()), response.status_code

if __name__ == "__main__":
    app.run(port=3000, debug=True)`}
      />

      <h3 className="text-lg font-semibold text-[var(--sf-blue-dark)] mt-6 mb-3">
        Smart Schema Generator (from Doc AI Mini)
      </h3>
      <CodeBlock
        language="python"
        filename="generate_schema.py"
        code={`def generate_schema(filename: str) -> dict:
    """Generate an extraction schema based on document type detected from filename."""

    filename_lower = filename.lower()

    if any(kw in filename_lower for kw in ["invoice", "inv", "bill"]):
        return {
            "type": "object",
            "properties": {
                "invoice_number": {"type": "string", "description": "Invoice identifier"},
                "invoice_date": {"type": "string", "description": "Date of the invoice"},
                "due_date": {"type": "string", "description": "Payment due date"},
                "vendor_name": {"type": "string", "description": "Seller/vendor name"},
                "buyer_name": {"type": "string", "description": "Buyer/recipient name"},
                "subtotal": {"type": "number", "description": "Subtotal before tax"},
                "tax": {"type": "number", "description": "Tax amount"},
                "total": {"type": "number", "description": "Total amount due"},
                "line_items": {
                    "type": "array",
                    "description": "Invoice line items",
                    "items": {
                        "type": "object",
                        "properties": {
                            "description": {"type": "string"},
                            "quantity": {"type": "number"},
                            "unit_price": {"type": "number"},
                            "amount": {"type": "number"},
                        },
                    },
                },
            },
        }

    elif any(kw in filename_lower for kw in ["prescription", "rx", "script"]):
        return {
            "type": "object",
            "properties": {
                "doctor_name": {"type": "string", "description": "Prescribing physician"},
                "patient_name": {"type": "string", "description": "Patient full name"},
                "patient_dob": {"type": "string", "description": "Patient date of birth"},
                "date": {"type": "string", "description": "Prescription date"},
                "medications": {
                    "type": "array",
                    "description": "Prescribed medications",
                    "items": {
                        "type": "object",
                        "properties": {
                            "name": {"type": "string", "description": "Drug name and strength"},
                            "dosage": {"type": "string", "description": "Dosage instructions"},
                            "quantity": {"type": "string", "description": "Quantity to dispense"},
                            "refills": {"type": "string", "description": "Number of refills"},
                        },
                    },
                },
            },
        }

    # Generic fallback
    return {
        "type": "object",
        "properties": {
            "document_type": {"type": "string", "description": "Type of document"},
            "date": {"type": "string", "description": "Primary date on the document"},
            "title": {"type": "string", "description": "Document title or heading"},
            "key_parties": {"type": "string", "description": "Names of people or orgs"},
            "summary": {"type": "string", "description": "Brief summary of content"},
        },
    }`}
      />

      <h3 className="text-lg font-semibold text-[var(--sf-blue-dark)] mt-6 mb-3">
        CLI Demo Script
      </h3>
      <CodeBlock
        language="python"
        filename="document_ai_demo.py"
        code={`#!/usr/bin/env python3
"""Standalone CLI for testing Salesforce Document AI extraction."""

import base64
import json
import sys
import requests

UNIVERSAL_SCHEMA = json.dumps({
    "type": "object",
    "properties": {
        "document_type": {"type": "string", "description": "The type of this document"},
        "date": {"type": "string", "description": "Primary date on this document"},
        "parties": {
            "type": "array",
            "description": "People or organizations mentioned",
            "items": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "role": {"type": "string"},
                }
            }
        },
        "amounts": {
            "type": "array",
            "description": "Monetary amounts found",
            "items": {
                "type": "object",
                "properties": {
                    "label": {"type": "string"},
                    "value": {"type": "number"},
                    "currency": {"type": "string"}
                }
            }
        },
        "key_details": {"type": "string", "description": "Important details summary"}
    }
})


def extract_document(instance_url, access_token, file_path, api_version="v63.0"):
    with open(file_path, "rb") as f:
        base64_data = base64.b64encode(f.read()).decode("utf-8")

    ext = file_path.rsplit(".", 1)[-1].lower()
    mime_map = {"pdf": "application/pdf", "png": "image/png",
                "jpg": "image/jpeg", "jpeg": "image/jpeg"}
    mime_type = mime_map.get(ext, "application/pdf")

    url = (f"{instance_url}/services/data/{api_version}"
           f"/ssot/document-processing/actions/extract-data"
           f"?htmlEncode=false&extractDataWithConfidenceScore=true")

    payload = {
        "mlModel": "llmgateway__VertexAIGemini20Flash001",
        "schemaConfig": UNIVERSAL_SCHEMA,
        "files": [{"mimeType": mime_type, "data": base64_data}],
    }

    resp = requests.post(url, json=payload, headers={
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
    })

    if resp.status_code == 200:
        data = resp.json()
        print("\\n=== Extraction Results ===\\n")
        for item in data.get("data", []):
            for field, detail in item.get("extractedValues", {}).items():
                value = detail.get("value", "N/A")
                score = detail.get("confidenceScore", 0)
                indicator = "OK" if score >= 0.9 else "REVIEW" if score >= 0.7 else "LOW"
                print(f"  {field}: {value}  [{indicator} {score:.0%}]")
    else:
        print(f"Error {resp.status_code}: {resp.text}")


if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python document_ai_demo.py <instance_url> <access_token> <file_path>")
        sys.exit(1)

    extract_document(sys.argv[1], sys.argv[2], sys.argv[3])`}
      />

      <h2 className="text-2xl font-bold text-[var(--sf-navy)] mb-4 mt-10 border-b-2 border-[var(--sf-cloud)] pb-2">
        Configuration & Deployment
      </h2>

      <h3 className="text-lg font-semibold text-[var(--sf-blue-dark)] mt-6 mb-3">Environment Variables</h3>
      <CodeBlock
        language="bash"
        filename=".env"
        code={`LOGIN_URL=https://YOUR_DOMAIN.my.salesforce.com
CLIENT_ID=your_external_client_app_client_id
CLIENT_SECRET=your_external_client_app_client_secret
API_VERSION=v63.0
TOKEN_FILE=access-token.secret`}
      />

      <h3 className="text-lg font-semibold text-[var(--sf-blue-dark)] mt-6 mb-3">Dependencies</h3>
      <CodeBlock
        language="plaintext"
        filename="requirements.txt"
        code={`flask==3.0.2
Werkzeug==3.0.1
requests==2.31.0
python-dotenv==1.0.0
Flask-CORS==4.0.0`}
      />

      <h3 className="text-lg font-semibold text-[var(--sf-blue-dark)] mt-6 mb-3">Vercel Configuration</h3>
      <CodeBlock
        language="json"
        filename="vercel.json"
        code={`{
  "builds": [
    { "src": "app.py", "use": "@vercel/python" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "app.py" }
  ]
}`}
      />

      <InfoBox type="info" title="Running Locally">
        <ol className="list-decimal list-inside space-y-1">
          <li>Clone the repo and install dependencies: <code>pip install -r requirements.txt</code></li>
          <li>Create a <code>.env</code> file with your Salesforce credentials</li>
          <li>Run <code>python app.py</code> and open <code>http://localhost:3000</code></li>
          <li>Click &quot;Login with Salesforce&quot; to authenticate</li>
          <li>Upload a document, provide a schema, and click &quot;Extract&quot;</li>
        </ol>
      </InfoBox>

      <h2 className="text-2xl font-bold text-[var(--sf-navy)] mb-4 mt-10 border-b-2 border-[var(--sf-cloud)] pb-2">
        Key Features
      </h2>

      <div className="grid md:grid-cols-2 gap-4 my-6">
        {[
          {
            title: "OAuth 2.0 with PKCE",
            description: "Secure authentication flow with code verifier/challenge. Tokens stored in session (not files) for security.",
          },
          {
            title: "Confidence Score Visualization",
            description: "Color-coded indicators: green (>90%), yellow (70-90%), red (<70%) for each extracted field.",
          },
          {
            title: "Multiple LLM Models",
            description: "Switch between Gemini Flash and GPT-4o from the UI. Each model has different strengths.",
          },
          {
            title: "IDP Configuration Support",
            description: "Use pre-configured Document AI setups in Salesforce for simplified 2-parameter API calls.",
          },
          {
            title: "Smart Schema Detection",
            description: "Auto-generates extraction schemas based on document filename (invoices, prescriptions, etc.).",
          },
          {
            title: "Vercel Ready",
            description: "Deploy as serverless functions on Vercel with included vercel.json configuration.",
          },
        ].map((feature) => (
          <div key={feature.title} className="bg-white border border-gray-200 rounded-xl p-5">
            <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
            <p className="text-sm text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/recipes/api-postman"
          className="inline-flex items-center px-6 py-3 bg-[var(--sf-blue)] text-white font-semibold rounded-lg hover:bg-[var(--sf-blue-dark)] transition-colors"
        >
          Try the API Recipe
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
