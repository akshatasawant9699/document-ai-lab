"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const LLM_MODELS = [
  { id: "llmgateway__VertexAIGemini20Flash001", label: "Gemini 2.0 Flash", note: "Recommended for PDFs" },
  { id: "llmgateway__VertexAIGemini25Flash", label: "Gemini 2.5 Flash", note: "Latest, improved accuracy" },
  { id: "llmgateway__OpenAIGPT4Omni_08_06", label: "GPT-4o", note: "Best for OCR / complex layouts" },
  { id: "llmgateway__OpenAIGPT41", label: "GPT-4.1", note: "Recommended for Prompt Templates" },
  { id: "llmgateway__AnthropicClaude37Sonnet", label: "Claude 3.7 Sonnet", note: "" },
];

const API_VERSION = "v65.0";
const REDIRECT_URI = "https://document-ai-lab.vercel.app/python-app";

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

function getCredentials() {
  const envUrl = process.env.NEXT_PUBLIC_SF_LOGIN_URL;
  const envClientId = process.env.NEXT_PUBLIC_SF_CLIENT_ID;
  const envSecret = process.env.NEXT_PUBLIC_SF_CLIENT_SECRET || "";
  const envIdp = process.env.NEXT_PUBLIC_SF_IDP_CONFIG || "";

  if (envUrl && envClientId) {
    return { loginUrl: envUrl, clientId: envClientId, clientSecret: envSecret, idpConfigName: envIdp };
  }

  const saved = typeof window !== "undefined" ? localStorage.getItem("docai_login") : null;
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch { /* ignore */ }
  }

  return { loginUrl: "", clientId: "", clientSecret: "", idpConfigName: "" };
}

export default function ExtractPage() {
  const [auth, setAuth] = useState<{ accessToken: string; instanceUrl: string } | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [loginUrl, setLoginUrl] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [idpConfigName, setIdpConfigName] = useState("");
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const creds = getCredentials();
    setLoginUrl(creds.loginUrl || "");
    setClientId(creds.clientId || "");
    setClientSecret(creds.clientSecret || "");
    if (creds.idpConfigName) {
      setIdpConfigName(creds.idpConfigName);
      setUseIdpConfig(true);
    }

    const savedAuth = sessionStorage.getItem("docai_auth");
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth);
        setAuth(parsed);
        setAuthenticated(true);
      } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code && !auth) {
      setAuthLoading(true);
      const verifier = sessionStorage.getItem("docai_pkce_verifier") || "";
      const creds = getCredentials();

      fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          codeVerifier: verifier,
          redirectUri: REDIRECT_URI,
          loginUrl: creds.loginUrl,
          clientId: creds.clientId,
          clientSecret: creds.clientSecret,
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.access_token) {
            const authData = { accessToken: data.access_token, instanceUrl: data.instance_url };
            setAuth(authData);
            setAuthenticated(true);
            sessionStorage.setItem("docai_auth", JSON.stringify(authData));
            window.history.replaceState({}, "", window.location.pathname);
          } else {
            setError(`Authentication failed: ${data.error}`);
          }
        })
        .catch((e) => setError(`Auth error: ${e.message}`))
        .finally(() => setAuthLoading(false));
    }
  }, [auth]);

  const startAuth = async () => {
    const creds = getCredentials();
    const url = loginUrl || creds.loginUrl;
    const cid = clientId || creds.clientId;

    if (!url || !cid) {
      setShowSettings(true);
      setError("Please configure your Login URL and Client ID first.");
      return;
    }

    localStorage.setItem("docai_login", JSON.stringify({ loginUrl: url, clientId: cid, clientSecret, idpConfigName }));

    const { verifier, challenge } = await generatePKCE();
    sessionStorage.setItem("docai_pkce_verifier", verifier);

    const authUrl =
      `${url}/services/oauth2/authorize` +
      `?response_type=code` +
      `&client_id=${encodeURIComponent(cid)}` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      `&code_challenge=${challenge}` +
      `&code_challenge_method=S256`;

    window.location.href = authUrl;
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
    sessionStorage.removeItem("docai_auth");
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
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                (i === 0 && !authenticated) || (i === 1 && authenticated)
                  ? "bg-[var(--sf-blue)] text-white"
                  : authenticated
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  i === 0 && authenticated ? "bg-green-500 text-white" : "bg-white/20"
                }`}
              >
                {i === 0 && authenticated ? (
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  i + 1
                )}
              </span>
              {label}
            </div>
            {i < 1 && <div className="w-8 h-px bg-gray-300" />}
          </div>
        ))}
        {authenticated && (
          <button onClick={logout} className="ml-auto text-xs text-red-500 hover:text-red-700 hover:underline">
            Logout
          </button>
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
        <div className="bg-white border border-gray-200 rounded-2xl p-8 md:p-12 shadow-sm">
          <div className="max-w-sm mx-auto text-center">
            <div className="w-20 h-20 bg-[var(--sf-cloud)] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-[var(--sf-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[var(--sf-navy)] mb-2">Connect to Salesforce</h2>
            <p className="text-gray-500 mb-8">
              Sign in with your Salesforce credentials to start extracting data from documents using Document AI.
            </p>

            {authLoading ? (
              <div className="flex items-center justify-center gap-3 py-4 text-[var(--sf-blue)]">
                <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="text-sm font-medium">Completing authentication...</span>
              </div>
            ) : (
              <button
                onClick={startAuth}
                className="w-full px-6 py-3.5 bg-[var(--sf-blue)] text-white font-semibold rounded-lg hover:bg-[var(--sf-blue-dark)] transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.4 2.2c-3.1-.3-5.9 1.3-7.3 3.8C2.2 5.5-.1 8 0 11c.1 2.4 1.5 4.6 3.6 5.8.5.3 1-.2.9-.7-.2-1.1-.2-2.2.1-3.3.1-.2 0-.5-.2-.6C3 11 2.3 9.3 2.5 7.5c.3-2.3 2-4.2 4.3-4.7 3-.7 5.8 1.1 6.2 3.9.3 2.1-.7 4.1-2.4 5.1-.2.1-.3.4-.2.6.3 1.1.3 2.2.1 3.3-.1.5.4 1 .9.7C15 14.7 17 10.5 15.6 6.4c-.8-2.4-3-4-5.2-4.2z"/>
                  <path d="M12 8.8c-1.9-.2-3.5 1.1-3.7 3-.2 1.5.6 2.9 1.8 3.5.2.1.3.3.2.5-.2.8-.5 1.6-.8 2.4-.2.5.2 1 .7.9 1.1-.3 2.1-.8 2.9-1.5.2-.2.4-.2.6-.1.8.3 1.7.4 2.6.2 1.9-.4 3.2-2.2 3.1-4.1-.1-2.2-2-3.9-4.2-3.8-.7 0-1.4.2-2 .5-.2.1-.4 0-.5-.1-.3-.5-.6-.9-1.1-1.2-.2-.1-.4-.2-.6-.2z"/>
                </svg>
                Login with Salesforce
              </button>
            )}

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="mt-6 text-xs text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1 mx-auto"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </button>

            {showSettings && (
              <div className="mt-4 text-left bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Login URL</label>
                    <input
                      type="text"
                      value={loginUrl}
                      onChange={(e) => setLoginUrl(e.target.value)}
                      placeholder="https://your-domain.my.salesforce.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--sf-blue)] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Client ID</label>
                    <input
                      type="text"
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                      placeholder="External Client App Client ID"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--sf-blue)] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Client Secret <span className="text-gray-400">(optional)</span></label>
                    <input
                      type="password"
                      value={clientSecret}
                      onChange={(e) => setClientSecret(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--sf-blue)] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">IDP Config Name <span className="text-gray-400">(optional)</span></label>
                    <input
                      type="text"
                      value={idpConfigName}
                      onChange={(e) => setIdpConfigName(e.target.value)}
                      placeholder="e.g. Medico_Invoice_Extractor"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--sf-blue)] focus:border-transparent outline-none"
                    />
                  </div>
                  <button
                    onClick={() => {
                      localStorage.setItem("docai_login", JSON.stringify({ loginUrl, clientId, clientSecret, idpConfigName }));
                      setShowSettings(false);
                    }}
                    className="w-full px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-900 transition-colors"
                  >
                    Save Settings
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-3">
                  Or set <code className="bg-gray-200 px-1 rounded">NEXT_PUBLIC_SF_LOGIN_URL</code> and <code className="bg-gray-200 px-1 rounded">NEXT_PUBLIC_SF_CLIENT_ID</code> as Vercel environment variables.
                </p>
              </div>
            )}
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
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFileChange(f);
                    }}
                  />
                  {file ? (
                    <div>
                      {filePreview && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={filePreview} alt="Preview" className="max-h-32 mx-auto mb-3 rounded-lg shadow" />
                      )}
                      <p className="text-sm font-medium text-gray-800">{file.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {(file.size / 1024).toFixed(1)} KB &middot; {file.type || "unknown type"}
                      </p>
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
                      <label
                        key={m.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          model === m.id ? "border-[var(--sf-blue)] bg-blue-50" : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
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
                          const res = await fetch("/api/generate-schema", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ filename: file.name }),
                          });
                          const data = await res.json();
                          setDetectedType(data.documentType);
                          setSchema(JSON.stringify(data.schema, null, 2));
                        }
                      }}
                      disabled={!file}
                      className="text-xs px-3 py-1.5 bg-[var(--sf-cloud)] text-[var(--sf-blue)] rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-40"
                    >
                      Re-generate
                    </button>
                    <button
                      onClick={() => { try { setSchema(JSON.stringify(JSON.parse(schema), null, 2)); } catch { /* ignore */ } }}
                      className="text-xs px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Format
                    </button>
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
              ) : (
                "Extract Data"
              )}
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
    </div>
  );
}
