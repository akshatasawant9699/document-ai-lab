"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import CodeBlock from "@/components/CodeBlock";

const LLM_MODELS = [
  { id: "llmgateway__VertexAIGemini20Flash001", label: "Gemini 2.0 Flash", note: "Recommended for PDFs" },
  { id: "llmgateway__VertexAIGemini25Flash", label: "Gemini 2.5 Flash", note: "Latest, improved accuracy" },
  { id: "llmgateway__OpenAIGPT4Omni_08_06", label: "GPT-4o", note: "Best for OCR / complex layouts" },
  { id: "llmgateway__OpenAIGPT41", label: "GPT-4.1", note: "Recommended for Prompt Templates" },
  { id: "llmgateway__AnthropicClaude37Sonnet", label: "Claude 3.7 Sonnet", note: "" },
];

const API_VERSION = "v65.0";

interface FieldResult {
  value: unknown;
  confidenceScore?: number;
}

interface ExtractionData {
  extractedValues: Record<string, FieldResult>;
  pageRange?: string;
}

function generatePKCE() {
  const array = new Uint8Array(48);
  crypto.getRandomValues(array);
  const verifier = btoa(String.fromCharCode(...array))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return crypto.subtle
    .digest("SHA-256", new TextEncoder().encode(verifier))
    .then((hash) => {
      const challenge = btoa(String.fromCharCode(...new Uint8Array(hash)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
      return { verifier, challenge };
    });
}

function ConfidenceBadge({ score }: { score?: number }) {
  if (score == null) return <span className="text-xs text-gray-400">N/A</span>;
  const pct = Math.round(score * 100);
  const color =
    pct >= 90 ? "bg-green-100 text-green-800" : pct >= 70 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800";
  return <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>{pct}%</span>;
}

export default function ExtractPage() {
  const [loginUrl, setLoginUrl] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [idpConfigName, setIdpConfigName] = useState("");
  const [auth, setAuth] = useState<{ accessToken: string; instanceUrl: string } | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [model, setModel] = useState(LLM_MODELS[0].id);
  const [schema, setSchema] = useState("");
  const [detectedType, setDetectedType] = useState("");
  const [useIdpConfig, setUseIdpConfig] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [results, setResults] = useState<ExtractionData[] | null>(null);
  const [error, setError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [showPythonCode, setShowPythonCode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("docai_login");
    if (saved) {
      try {
        const { loginUrl: lu, clientId: ci, clientSecret: cs, idpConfigName: idp } = JSON.parse(saved);
        if (lu) setLoginUrl(lu);
        if (ci) setClientId(ci);
        if (cs) setClientSecret(cs);
        if (idp) { setIdpConfigName(idp); setUseIdpConfig(true); }
      } catch { /* ignore */ }
    }

    const savedAuth = localStorage.getItem("docai_auth");
    if (savedAuth) {
      try {
        setAuth(JSON.parse(savedAuth));
        setAuthenticated(true);
      } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === "docai_auth_success" && event.data.auth) {
        setAuth(event.data.auth);
        setAuthenticated(true);
        setAuthLoading(false);
        setError("");
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const startAuth = async () => {
    if (!loginUrl || !clientId) {
      setError("Login URL and Client ID are required.");
      return;
    }

    localStorage.setItem("docai_login", JSON.stringify({ loginUrl, clientId, clientSecret, idpConfigName }));

    const { verifier, challenge } = await generatePKCE();
    localStorage.setItem("docai_pkce_verifier", verifier);

    const redirectUri = window.location.origin + "/auth/callback";
    const authUrl =
      `${loginUrl}/services/oauth2/authorize` +
      `?response_type=code` +
      `&client_id=${encodeURIComponent(clientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&code_challenge=${challenge}` +
      `&code_challenge_method=S256`;

    setAuthLoading(true);

    const w = 600, h = 700;
    const left = window.screenX + (window.outerWidth - w) / 2;
    const top = window.screenY + (window.outerHeight - h) / 2;
    const popup = window.open(
      authUrl,
      "salesforce_login",
      `width=${w},height=${h},left=${left},top=${top},toolbar=no,menubar=no,location=yes`
    );

    if (!popup) {
      setError("Popup blocked. Please allow popups for this site and try again.");
      setAuthLoading(false);
      return;
    }

    const pollTimer = setInterval(() => {
      if (popup.closed) {
        clearInterval(pollTimer);
        const savedAuth = localStorage.getItem("docai_auth");
        if (savedAuth && !authenticated) {
          try {
            setAuth(JSON.parse(savedAuth));
            setAuthenticated(true);
          } catch { /* ignore */ }
        }
        setAuthLoading(false);
      }
    }, 500);
  };

  const handleFileChange = useCallback(async (f: File) => {
    setFile(f);
    setError("");
    setResults(null);

    if (f.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target?.result as string);
      reader.readAsDataURL(f);
    } else {
      setFilePreview(null);
    }

    try {
      const res = await fetch("/api/generate-schema", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: f.name }),
      });
      const data = await res.json();
      setDetectedType(data.documentType);
      setSchema(JSON.stringify(data.schema, null, 2));
    } catch {
      setDetectedType("generic");
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const f = e.dataTransfer.files[0];
      if (f) handleFileChange(f);
    },
    [handleFileChange]
  );

  const extractData = async () => {
    if (!file || !auth) return;
    setExtracting(true);
    setError("");
    setResults(null);

    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve) => {
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(",")[1]);
        };
        reader.readAsDataURL(file);
      });

      const body: Record<string, string> = {
        instanceUrl: auth.instanceUrl,
        accessToken: auth.accessToken,
        apiVersion: API_VERSION,
        fileBase64: base64,
        mimeType: file.type || "application/pdf",
      };

      if (useIdpConfig && idpConfigName) {
        body.idpConfigName = idpConfigName;
      } else {
        body.model = model;
        body.schema = schema;
      }

      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || `API error ${res.status}`);
        return;
      }

      const extracted: ExtractionData[] = data.data || [];
      setResults(extracted);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Extraction failed");
    } finally {
      setExtracting(false);
    }
  };

  const logout = () => {
    setAuth(null);
    setAuthenticated(false);
    localStorage.removeItem("docai_auth");
    setFile(null);
    setResults(null);
  };

  const renderValue = (val: unknown): string => {
    if (val == null) return "null";
    if (typeof val === "object") return JSON.stringify(val, null, 2);
    return String(val);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--sf-navy)] mb-2">Document AI Extractor</h1>
        <p className="text-gray-600">
          Upload a document, select an LLM model, and extract structured data with confidence scores
          using Salesforce Data Cloud Document AI.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-8">
        {["Authenticate", "Extract"].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              (i === 0 && !authenticated) || (i === 1 && authenticated)
                ? "bg-[var(--sf-blue)] text-white"
                : authenticated ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-400"
            }`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                i === 0 && authenticated ? "bg-green-500 text-white" : "bg-white/20"
              }`}>
                {i === 0 && authenticated ? (
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (i + 1)}
              </span>
              {label}
            </div>
            {i < 1 && <div className="w-8 h-px bg-gray-300" />}
          </div>
        ))}
        {authenticated && (
          <button onClick={logout} className="ml-auto text-xs text-red-500 hover:text-red-700 hover:underline">Logout</button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mb-6">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-medium text-red-800">Error</p>
              <p className="text-sm text-red-700 mt-1 break-all">{error}</p>
            </div>
          </div>
          <button onClick={() => setError("")} className="text-xs text-red-500 hover:underline mt-2">Dismiss</button>
        </div>
      )}

      {/* STEP 1: Authenticate */}
      {!authenticated && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[var(--sf-cloud)] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[var(--sf-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-[var(--sf-navy)] mb-1">Login with Salesforce</h2>
              <p className="text-sm text-gray-500">
                Connect to your Salesforce org to access Document AI. A new window will open for Salesforce login.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Login URL</label>
                <input
                  type="text"
                  value={loginUrl}
                  onChange={(e) => setLoginUrl(e.target.value)}
                  placeholder="https://your-domain.my.salesforce.com"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--sf-blue)] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client ID</label>
                <input
                  type="text"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder="External Client App Client ID"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--sf-blue)] focus:border-transparent outline-none"
                />
              </div>

              <details className="group">
                <summary className="text-xs text-gray-500 cursor-pointer hover:text-[var(--sf-blue)] select-none">
                  Advanced options
                </summary>
                <div className="mt-3 space-y-3 pt-3 border-t border-gray-100">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client Secret <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="password"
                      value={clientSecret}
                      onChange={(e) => setClientSecret(e.target.value)}
                      placeholder="Leave blank if not required"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--sf-blue)] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      IDP Config Name <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={idpConfigName}
                      onChange={(e) => setIdpConfigName(e.target.value)}
                      placeholder="e.g. Medico_Invoice_Extractor"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--sf-blue)] focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </details>

              <div className="pt-2">
                {authLoading ? (
                  <div className="w-full px-6 py-3 bg-[var(--sf-blue)]/80 text-white font-semibold rounded-lg flex items-center justify-center gap-3">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Waiting for Salesforce login...
                  </div>
                ) : (
                  <button
                    onClick={startAuth}
                    disabled={!loginUrl || !clientId}
                    className="w-full px-6 py-3 bg-[var(--sf-blue)] text-white font-semibold rounded-lg hover:bg-[var(--sf-blue-dark)] transition-colors shadow-md disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Login with Salesforce
                  </button>
                )}
              </div>

              <p className="text-xs text-gray-400 text-center">
                Salesforce login opens in a new window. Credentials are saved locally in your browser.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Extract */}
      {authenticated && (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-sm text-green-800 font-medium">Connected</span>
              <span className="text-xs text-green-600 font-mono">{auth?.instanceUrl}</span>
            </div>
            <span className="text-xs text-green-600">API {API_VERSION}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-5">
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <h3 className="font-semibold text-[var(--sf-navy)] mb-3">Upload Document</h3>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                    file ? "border-green-300 bg-green-50" : "border-gray-300 hover:border-[var(--sf-blue)] hover:bg-blue-50"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.tiff,.bmp"
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileChange(f); }}
                  />
                  {file ? (
                    <div>
                      {filePreview && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={filePreview} alt="Preview" className="max-h-32 mx-auto mb-3 rounded-lg shadow" />
                      )}
                      <p className="text-sm font-medium text-gray-800">{file.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{(file.size / 1024).toFixed(1)} KB &middot; {file.type || "unknown type"}</p>
                      {detectedType && (
                        <span className="inline-block mt-2 px-2 py-0.5 bg-blue-100 text-[var(--sf-blue)] rounded text-xs font-medium">
                          Detected: {detectedType.replace("_", " ")}
                        </span>
                      )}
                      <p className="text-xs text-gray-400 mt-2">Click or drop to replace</p>
                    </div>
                  ) : (
                    <div>
                      <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm text-gray-600 font-medium">Drop your document here or click to browse</p>
                      <p className="text-xs text-gray-400 mt-1">PDF, PNG, JPG, TIFF, BMP</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <h3 className="font-semibold text-[var(--sf-navy)] mb-3">LLM Model</h3>
                {idpConfigName && (
                  <label className="flex items-center gap-2 mb-3 text-sm">
                    <input type="checkbox" checked={useIdpConfig} onChange={(e) => setUseIdpConfig(e.target.checked)} className="rounded border-gray-300" />
                    <span>Use IDP Config: <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{idpConfigName}</code></span>
                  </label>
                )}
                {!useIdpConfig && (
                  <div className="space-y-2">
                    {LLM_MODELS.map((m) => (
                      <label key={m.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        model === m.id ? "border-[var(--sf-blue)] bg-blue-50" : "border-gray-200 hover:bg-gray-50"
                      }`}>
                        <input type="radio" name="model" value={m.id} checked={model === m.id} onChange={() => setModel(m.id)} className="text-[var(--sf-blue)]" />
                        <div>
                          <span className="text-sm font-medium">{m.label}</span>
                          {m.note && <span className="text-xs text-gray-400 ml-2">{m.note}</span>}
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-[var(--sf-navy)]">Extraction Schema</h3>
                {!useIdpConfig && (
                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        if (file) {
                          const res = await fetch("/api/generate-schema", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ filename: file.name }) });
                          const data = await res.json();
                          setDetectedType(data.documentType);
                          setSchema(JSON.stringify(data.schema, null, 2));
                        }
                      }}
                      disabled={!file}
                      className="text-xs px-3 py-1.5 bg-[var(--sf-cloud)] text-[var(--sf-blue)] rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-40"
                    >Re-generate</button>
                    <button
                      onClick={() => { try { setSchema(JSON.stringify(JSON.parse(schema), null, 2)); } catch { /* ignore */ } }}
                      className="text-xs px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >Format</button>
                  </div>
                )}
              </div>
              {useIdpConfig ? (
                <div className="flex-1 flex items-center justify-center text-center p-8">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Using IDP Configuration</p>
                    <code className="text-sm font-mono bg-gray-100 px-3 py-1.5 rounded-lg">{idpConfigName}</code>
                    <p className="text-xs text-gray-400 mt-3">Schema is managed in your Salesforce org</p>
                  </div>
                </div>
              ) : (
                <textarea
                  value={schema}
                  onChange={(e) => setSchema(e.target.value)}
                  placeholder='Upload a file to auto-generate a schema, or paste your JSON schema here...'
                  className="flex-1 min-h-[350px] w-full px-3 py-3 border border-gray-200 rounded-lg text-xs font-mono bg-gray-50 focus:ring-2 focus:ring-[var(--sf-blue)] focus:border-transparent outline-none resize-none"
                  spellCheck={false}
                />
              )}
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={extractData}
              disabled={!file || extracting || (!useIdpConfig && !schema)}
              className="px-10 py-3.5 bg-[var(--sf-blue)] text-white font-semibold rounded-xl hover:bg-[var(--sf-blue-dark)] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {extracting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Extracting...
                </span>
              ) : "Extract Data"}
            </button>
          </div>

          {results && results.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="bg-[var(--sf-navy)] px-6 py-4">
                <h3 className="text-white font-semibold text-lg">Extraction Results</h3>
                <p className="text-blue-200 text-sm mt-0.5">{results.length} page group{results.length > 1 ? "s" : ""} extracted</p>
              </div>
              {results.map((group, gi) => (
                <div key={gi} className="border-b border-gray-100 last:border-b-0">
                  {group.pageRange && <div className="px-6 py-2 bg-gray-50 text-xs text-gray-500 font-medium">Pages: {group.pageRange}</div>}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 text-left">
                          <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/4">Field</th>
                          <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Value</th>
                          <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-28 text-center">Confidence</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(group.extractedValues || {}).map(([field, detail]) => {
                          const isArray = Array.isArray(detail?.value);
                          return (
                            <tr key={field} className="border-t border-gray-100 hover:bg-gray-50">
                              <td className="px-6 py-3 text-sm font-medium text-[var(--sf-navy)] align-top">{field.replace(/_/g, " ")}</td>
                              <td className="px-6 py-3 text-sm text-gray-700 align-top">
                                {isArray ? (
                                  <div className="overflow-x-auto">
                                    <table className="min-w-full text-xs border border-gray-200 rounded-lg">
                                      <thead>
                                        <tr className="bg-gray-100">
                                          {Object.keys((detail.value as Record<string, unknown>[])[0] || {}).map((col) => (
                                            <th key={col} className="px-3 py-1.5 text-left font-semibold text-gray-600">{col.replace(/_/g, " ")}</th>
                                          ))}
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {(detail.value as Record<string, unknown>[]).map((row, ri) => (
                                          <tr key={ri} className="border-t border-gray-100">
                                            {Object.values(row).map((cell, ci) => (
                                              <td key={ci} className="px-3 py-1.5 text-gray-700">{renderValue(cell)}</td>
                                            ))}
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                ) : (
                                  <span className="whitespace-pre-wrap break-words">{renderValue(detail?.value)}</span>
                                )}
                              </td>
                              <td className="px-6 py-3 text-center align-top"><ConfidenceBadge score={detail?.confidenceScore} /></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
              <details className="border-t border-gray-200">
                <summary className="px-6 py-3 text-sm text-gray-500 cursor-pointer hover:bg-gray-50">View raw JSON response</summary>
                <pre className="px-6 py-4 bg-gray-900 text-gray-100 text-xs overflow-x-auto max-h-96">{JSON.stringify(results, null, 2)}</pre>
              </details>
            </div>
          )}

          {results && results.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
              <p className="text-yellow-800 font-medium">No data extracted</p>
              <p className="text-sm text-yellow-600 mt-1">The API returned an empty result. Try a different schema or model.</p>
            </div>
          )}
        </div>
      )}

      {/* Python Code Reference Section */}
      <div className="mt-12 border-t border-gray-200 pt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[var(--sf-navy)]">Python Implementation Reference</h2>
            <p className="text-gray-600 mt-1">Complete Python Flask app with OAuth 2.0 PKCE, schema generation, and CLI demo</p>
          </div>
          <button
            onClick={() => setShowPythonCode(!showPythonCode)}
            className="px-4 py-2 bg-[var(--sf-blue)] text-white rounded-lg hover:bg-[var(--sf-blue-dark)] transition-colors flex items-center gap-2"
          >
            {showPythonCode ? "Hide" : "Show"} Python Code
            <svg className={`w-4 h-4 transition-transform ${showPythonCode ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {showPythonCode && (
          <div className="space-y-8">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-semibold text-[var(--sf-navy)] mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                About This Python App
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                This reference implementation shows how to build a Python-based Document AI gateway with OAuth 2.0 PKCE authentication,
                intelligent schema generation, and a command-line interface. The Flask app can be deployed to Vercel using serverless functions.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[var(--sf-navy)] mb-3">1. Flask App with OAuth 2.0 PKCE</h3>
              <CodeBlock
                language="python"
                filename="app.py"
                code={`from flask import Flask, request, jsonify, session, redirect
from flask_cors import CORS
import requests
import base64
import hashlib
import secrets
import os

app = Flask(__name__)
app.secret_key = os.environ.get('FLASK_SECRET_KEY', secrets.token_hex(32))
CORS(app, supports_credentials=True)

# PKCE helper functions
def generate_code_verifier():
    """Generate a cryptographically random code verifier"""
    return base64.urlsafe_b64encode(secrets.token_bytes(32)).decode('utf-8').rstrip('=')

def generate_code_challenge(verifier):
    """Generate code challenge from verifier using SHA256"""
    digest = hashlib.sha256(verifier.encode('utf-8')).digest()
    return base64.urlsafe_b64encode(digest).decode('utf-8').rstrip('=')

@app.route('/auth/login', methods=['POST'])
def start_auth():
    """Initiate OAuth 2.0 PKCE flow"""
    data = request.json
    login_url = data.get('login_url')
    client_id = data.get('client_id')
    redirect_uri = data.get('redirect_uri', 'http://localhost:5000/auth/callback')

    # Generate PKCE parameters
    verifier = generate_code_verifier()
    challenge = generate_code_challenge(verifier)

    # Store verifier in session
    session['code_verifier'] = verifier
    session['login_url'] = login_url
    session['client_id'] = client_id

    # Build authorization URL
    auth_url = f"{login_url}/services/oauth2/authorize"
    params = {
        'response_type': 'code',
        'client_id': client_id,
        'redirect_uri': redirect_uri,
        'code_challenge': challenge,
        'code_challenge_method': 'S256'
    }

    auth_url_full = auth_url + '?' + '&'.join([f"{k}={v}" for k, v in params.items()])

    return jsonify({'auth_url': auth_url_full})

@app.route('/auth/callback')
def auth_callback():
    """Handle OAuth callback and exchange code for token"""
    code = request.args.get('code')
    error = request.args.get('error')

    if error:
        return jsonify({'error': error}), 400

    if not code:
        return jsonify({'error': 'No authorization code received'}), 400

    # Retrieve stored values
    verifier = session.get('code_verifier')
    login_url = session.get('login_url')
    client_id = session.get('client_id')

    if not all([verifier, login_url, client_id]):
        return jsonify({'error': 'Session expired or invalid'}), 400

    # Exchange code for token
    token_url = f"{login_url}/services/oauth2/token"
    token_data = {
        'grant_type': 'authorization_code',
        'code': code,
        'client_id': client_id,
        'code_verifier': verifier,
        'redirect_uri': 'http://localhost:5000/auth/callback'
    }

    response = requests.post(token_url, data=token_data)

    if response.status_code != 200:
        return jsonify({'error': 'Token exchange failed', 'details': response.json()}), 400

    token_response = response.json()

    # Store tokens in session
    session['access_token'] = token_response['access_token']
    session['instance_url'] = token_response['instance_url']

    return jsonify({
        'access_token': token_response['access_token'],
        'instance_url': token_response['instance_url']
    })

@app.route('/api/extract', methods=['POST'])
def extract_document():
    """Extract data from document using Document AI API"""
    if 'access_token' not in session:
        return jsonify({'error': 'Not authenticated'}), 401

    data = request.json
    file_base64 = data.get('file_base64')
    mime_type = data.get('mime_type', 'application/pdf')
    schema = data.get('schema')
    model = data.get('model', 'llmgateway__VertexAIGemini20Flash001')

    if not file_base64:
        return jsonify({'error': 'file_base64 is required'}), 400

    # Call Document AI API
    instance_url = session['instance_url']
    access_token = session['access_token']

    api_url = f"{instance_url}/services/data/v65.0/ssot/document-processing/actions/extract-data"
    api_url += "?htmlEncode=false&extractDataWithConfidenceScore=true"

    payload = {
        'files': [{'mimeType': mime_type, 'data': file_base64}],
        'mlModel': model
    }

    if schema:
        payload['schemaConfig'] = schema

    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }

    response = requests.post(api_url, json=payload, headers=headers)

    if response.status_code != 200:
        return jsonify({
            'error': 'Extraction failed',
            'status': response.status_code,
            'details': response.text
        }), response.status_code

    return jsonify(response.json())

if __name__ == '__main__':
    app.run(debug=True, port=5000)
`}
              />
            </div>

            <div>
              <h3 className="text-xl font-bold text-[var(--sf-navy)] mb-3">2. Smart Schema Generator</h3>
              <CodeBlock
                language="python"
                filename="schema_generator.py"
                code={`import json

def generate_schema_from_filename(filename):
    """Generate appropriate schema based on document type detected from filename"""
    filename_lower = filename.lower()

    # Detect document type
    if 'invoice' in filename_lower or 'inv-' in filename_lower:
        return generate_invoice_schema()
    elif 'prescription' in filename_lower or 'rx' in filename_lower:
        return generate_prescription_schema()
    elif 'lab' in filename_lower or 'report' in filename_lower:
        return generate_lab_report_schema()
    elif 'po-' in filename_lower or 'purchase' in filename_lower:
        return generate_purchase_order_schema()
    else:
        return generate_generic_schema()

def generate_invoice_schema():
    """Generate schema for pharmaceutical invoices"""
    return {
        "type": "object",
        "properties": {
            "invoice_number": {
                "type": "string",
                "description": "Unique invoice identifier"
            },
            "invoice_date": {
                "type": "string",
                "description": "Date the invoice was issued"
            },
            "due_date": {
                "type": "string",
                "description": "Payment due date"
            },
            "po_number": {
                "type": "string",
                "description": "Associated purchase order number"
            },
            "vendor_name": {
                "type": "string",
                "description": "Name of the vendor/seller"
            },
            "bill_to_name": {
                "type": "string",
                "description": "Billing recipient organization name"
            },
            "bill_to_address": {
                "type": "string",
                "description": "Billing address"
            },
            "ship_to_name": {
                "type": "string",
                "description": "Shipping recipient name"
            },
            "subtotal": {
                "type": "number",
                "description": "Subtotal before tax"
            },
            "tax_amount": {
                "type": "number",
                "description": "Total tax amount"
            },
            "shipping_amount": {
                "type": "number",
                "description": "Shipping and handling cost"
            },
            "total_due": {
                "type": "number",
                "description": "Total amount due for payment"
            },
            "line_items": {
                "type": "array",
                "description": "Invoice line items",
                "items": {
                    "type": "object",
                    "properties": {
                        "description": {
                            "type": "string",
                            "description": "Product description"
                        },
                        "ndc_code": {
                            "type": "string",
                            "description": "National Drug Code"
                        },
                        "quantity": {
                            "type": "number",
                            "description": "Quantity ordered"
                        },
                        "unit_price": {
                            "type": "number",
                            "description": "Price per unit"
                        },
                        "amount": {
                            "type": "number",
                            "description": "Line total (quantity × unit_price)"
                        }
                    }
                }
            }
        }
    }

def generate_prescription_schema():
    """Generate schema for medical prescriptions"""
    return {
        "type": "object",
        "properties": {
            "clinic_name": {"type": "string", "description": "Medical clinic name"},
            "doctor_name": {"type": "string", "description": "Prescribing physician full name"},
            "doctor_dea": {"type": "string", "description": "DEA registration number"},
            "doctor_npi": {"type": "string", "description": "National Provider Identifier"},
            "patient_name": {"type": "string", "description": "Patient full name"},
            "patient_dob": {"type": "string", "description": "Patient date of birth"},
            "patient_mrn": {"type": "string", "description": "Medical Record Number"},
            "prescription_date": {"type": "string", "description": "Date prescription was written"},
            "diagnosis_codes": {"type": "string", "description": "ICD-10 diagnosis codes"},
            "allergies": {"type": "string", "description": "Known patient allergies"},
            "medications": {
                "type": "array",
                "description": "List of prescribed medications",
                "items": {
                    "type": "object",
                    "properties": {
                        "name": {"type": "string", "description": "Medication name and strength"},
                        "sig": {"type": "string", "description": "Dosage instructions"},
                        "quantity": {"type": "string", "description": "Quantity to dispense"},
                        "refills": {"type": "string", "description": "Number of refills"}
                    }
                }
            }
        }
    }

def generate_lab_report_schema():
    """Generate schema for laboratory reports"""
    return {
        "type": "object",
        "properties": {
            "lab_name": {"type": "string", "description": "Laboratory name"},
            "report_number": {"type": "string", "description": "Unique report identifier"},
            "report_date": {"type": "string", "description": "Date results were reported"},
            "patient_name": {"type": "string", "description": "Patient full name"},
            "patient_dob": {"type": "string", "description": "Patient date of birth"},
            "ordering_physician": {"type": "string", "description": "Doctor who ordered tests"},
            "collection_date": {"type": "string", "description": "Specimen collection date/time"},
            "test_results": {
                "type": "array",
                "description": "Individual test results",
                "items": {
                    "type": "object",
                    "properties": {
                        "test_name": {"type": "string", "description": "Lab test name"},
                        "result": {"type": "string", "description": "Test result value"},
                        "units": {"type": "string", "description": "Unit of measurement"},
                        "reference_range": {"type": "string", "description": "Normal reference range"},
                        "flag": {"type": "string", "description": "Normal, HIGH, or LOW"}
                    }
                }
            }
        }
    }

def generate_generic_schema():
    """Generate a generic schema for unknown document types"""
    return {
        "type": "object",
        "properties": {
            "document_type": {"type": "string", "description": "Type of document"},
            "document_id": {"type": "string", "description": "Primary document identifier"},
            "date": {"type": "string", "description": "Primary date on document"},
            "from_party": {"type": "string", "description": "Sender or issuing party"},
            "to_party": {"type": "string", "description": "Recipient party"},
            "total_amount": {"type": "number", "description": "Total monetary amount if applicable"},
            "key_items": {
                "type": "array",
                "description": "Key items or entries in the document",
                "items": {
                    "type": "object",
                    "properties": {
                        "name": {"type": "string"},
                        "detail": {"type": "string"},
                        "value": {"type": "string"}
                    }
                }
            }
        }
    }

# Usage
if __name__ == "__main__":
    # Example: Generate schema from filename
    filename = "medico-invoice-001.pdf"
    schema = generate_schema_from_filename(filename)
    print(json.dumps(schema, indent=2))
`}
              />
            </div>

            <div>
              <h3 className="text-xl font-bold text-[var(--sf-navy)] mb-3">3. CLI Demo Script</h3>
              <CodeBlock
                language="python"
                filename="cli_demo.py"
                code={`#!/usr/bin/env python3
"""
Document AI CLI Demo
Extract data from documents via command line
"""

import argparse
import json
import base64
import requests
from pathlib import Path
from schema_generator import generate_schema_from_filename

def read_file_as_base64(file_path):
    """Read file and encode as base64"""
    with open(file_path, 'rb') as f:
        return base64.b64encode(f.read()).decode('utf-8')

def extract_document(instance_url, access_token, file_path, model='llmgateway__VertexAIGemini20Flash001', schema=None):
    """Extract data from a document using Document AI API"""

    # Read and encode file
    file_base64 = read_file_as_base64(file_path)

    # Determine MIME type
    suffix = Path(file_path).suffix.lower()
    mime_types = {
        '.pdf': 'application/pdf',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.tiff': 'image/tiff',
        '.bmp': 'image/bmp'
    }
    mime_type = mime_types.get(suffix, 'application/pdf')

    # Auto-generate schema if not provided
    if not schema:
        filename = Path(file_path).name
        schema = generate_schema_from_filename(filename)
        print(f"📋 Auto-generated schema for: {filename}")

    # Build API request
    api_url = f"{instance_url}/services/data/v65.0/ssot/document-processing/actions/extract-data"
    api_url += "?htmlEncode=false&extractDataWithConfidenceScore=true"

    payload = {
        'files': [{'mimeType': mime_type, 'data': file_base64}],
        'mlModel': model,
        'schemaConfig': schema
    }

    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }

    print(f"🚀 Extracting data from {Path(file_path).name} using {model}...")

    # Make API call
    response = requests.post(api_url, json=payload, headers=headers)

    if response.status_code != 200:
        print(f"❌ Error: {response.status_code}")
        print(response.text)
        return None

    return response.json()

def print_results(results, show_confidence=True):
    """Pretty print extraction results"""
    if not results or 'data' not in results:
        print("⚠️  No results returned")
        return

    for idx, page_group in enumerate(results['data']):
        print(f"\\n📄 Page Group {idx + 1}")
        if 'pageRange' in page_group:
            print(f"   Pages: {page_group['pageRange']}")

        extracted = page_group.get('extractedValues', {})

        for field, details in extracted.items():
            value = details.get('value', 'N/A')
            confidence = details.get('confidenceScore')

            # Format field name
            field_name = field.replace('_', ' ').title()

            # Print value
            if isinstance(value, list):
                print(f"\\n  {field_name}:")
                for item in value:
                    print(f"    • {json.dumps(item, indent=6)}")
            else:
                print(f"  {field_name}: {value}")

            # Print confidence score
            if show_confidence and confidence is not None:
                confidence_pct = int(confidence * 100)
                emoji = "🟢" if confidence >= 0.9 else "🟡" if confidence >= 0.7 else "🔴"
                print(f"    {emoji} Confidence: {confidence_pct}%")

def main():
    parser = argparse.ArgumentParser(description='Document AI CLI Demo')
    parser.add_argument('file', help='Path to document file')
    parser.add_argument('--instance-url', required=True, help='Salesforce instance URL')
    parser.add_argument('--access-token', required=True, help='OAuth access token')
    parser.add_argument('--model', default='llmgateway__VertexAIGemini20Flash001',
                       help='LLM model to use')
    parser.add_argument('--schema', help='Path to custom JSON schema file')
    parser.add_argument('--output', help='Save results to JSON file')
    parser.add_argument('--no-confidence', action='store_true', help='Hide confidence scores')

    args = parser.parse_args()

    # Load custom schema if provided
    schema = None
    if args.schema:
        with open(args.schema, 'r') as f:
            schema = json.load(f)

    # Extract document
    results = extract_document(
        args.instance_url,
        args.access_token,
        args.file,
        model=args.model,
        schema=schema
    )

    if results:
        print("\\n✅ Extraction complete!\\n")
        print_results(results, show_confidence=not args.no_confidence)

        # Save to file if requested
        if args.output:
            with open(args.output, 'w') as f:
                json.dump(results, f, indent=2)
            print(f"\\n💾 Results saved to {args.output}")
    else:
        print("\\n❌ Extraction failed")
        return 1

    return 0

if __name__ == '__main__':
    exit(main())

# Example usage:
# python cli_demo.py medico-invoice-001.pdf \\
#   --instance-url https://your-instance.salesforce.com \\
#   --access-token your_access_token \\
#   --output results.json
`}
              />
            </div>

            <div>
              <h3 className="text-xl font-bold text-[var(--sf-navy)] mb-3">4. Vercel Deployment Configuration</h3>
              <CodeBlock
                language="json"
                filename="vercel.json"
                code={`{
  "version": 2,
  "builds": [
    {
      "src": "app.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "app.py"
    }
  ],
  "env": {
    "FLASK_SECRET_KEY": "@flask-secret-key"
  }
}
`}
              />
              <CodeBlock
                language="text"
                filename="requirements.txt"
                code={`Flask==3.0.0
flask-cors==4.0.0
requests==2.31.0
python-dotenv==1.0.0
gunicorn==21.2.0
`}
              />
            </div>

            <div className="bg-[var(--sf-cloud)] border border-[var(--sf-blue)]/30 rounded-xl p-6">
              <h3 className="font-semibold text-[var(--sf-navy)] mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-[var(--sf-blue)]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                Quick Start Guide
              </h3>
              <ol className="text-sm space-y-2 text-gray-700">
                <li><strong>1.</strong> Clone or download the Python files above</li>
                <li><strong>2.</strong> Install dependencies: <code className="bg-white px-2 py-0.5 rounded">pip install -r requirements.txt</code></li>
                <li><strong>3.</strong> Set environment variables: <code className="bg-white px-2 py-0.5 rounded">export FLASK_SECRET_KEY=your_secret</code></li>
                <li><strong>4.</strong> Run locally: <code className="bg-white px-2 py-0.5 rounded">python app.py</code></li>
                <li><strong>5.</strong> Deploy to Vercel: <code className="bg-white px-2 py-0.5 rounded">vercel --prod</code></li>
              </ol>
              <div className="mt-4 pt-4 border-t border-blue-200">
                <p className="text-sm text-gray-600 mb-2"><strong>Related Resources:</strong></p>
                <div className="flex flex-wrap gap-2">
                  <Link href="/recipes/api-postman" className="text-xs px-3 py-1.5 bg-white rounded-lg hover:bg-blue-50 transition-colors">
                    Recipe 2: API with Postman
                  </Link>
                  <Link href="/resources" className="text-xs px-3 py-1.5 bg-white rounded-lg hover:bg-blue-50 transition-colors">
                    API Documentation
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
