"use client";

import { useEffect, useState } from "react";

export default function AuthCallback() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Completing authentication...");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const errorParam = params.get("error");

    if (errorParam) {
      setStatus("error");
      setMessage(params.get("error_description") || errorParam);
      return;
    }

    if (!code) {
      setStatus("error");
      setMessage("No authorization code received.");
      return;
    }

    const saved = localStorage.getItem("docai_login");
    const verifier = localStorage.getItem("docai_pkce_verifier") || "";

    if (!saved) {
      setStatus("error");
      setMessage("Login configuration not found. Please try again.");
      return;
    }

    const cfg = JSON.parse(saved);
    const redirectUri = window.location.origin + "/auth/callback";

    fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        codeVerifier: verifier,
        redirectUri,
        loginUrl: cfg.loginUrl,
        clientId: cfg.clientId,
        clientSecret: cfg.clientSecret,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.access_token) {
          const authData = {
            accessToken: data.access_token,
            instanceUrl: data.instance_url,
          };

          localStorage.setItem("docai_auth", JSON.stringify(authData));

          if (window.opener) {
            window.opener.postMessage({ type: "docai_auth_success", auth: authData }, window.location.origin);
          }

          setStatus("success");
          setMessage("Authenticated successfully! This window will close.");

          setTimeout(() => window.close(), 1500);
        } else {
          setStatus("error");
          setMessage(data.error || "Token exchange failed.");
        }
      })
      .catch((e) => {
        setStatus("error");
        setMessage(e.message || "Authentication failed.");
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center">
        {status === "loading" && (
          <>
            <svg className="animate-spin w-10 h-10 text-[#0176d3] mx-auto mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-gray-600 font-medium">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-green-700 font-semibold text-lg">Connected!</p>
            <p className="text-gray-500 text-sm mt-1">{message}</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-red-700 font-semibold">Authentication Failed</p>
            <p className="text-gray-500 text-sm mt-2 break-all">{message}</p>
            <button
              onClick={() => window.close()}
              className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close Window
            </button>
          </>
        )}
      </div>
    </div>
  );
}
