"use client";

import { useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export default function CodeBlock({ code, language = "plaintext", filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 my-4">
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-400">{language}</span>
          {filename && (
            <span className="text-xs text-gray-500 border-l border-gray-600 pl-2">{filename}</span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-700"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="bg-gray-900 p-4 overflow-x-auto">
        <code className="text-sm text-gray-100 font-mono whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}
