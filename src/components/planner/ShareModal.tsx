"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

interface ShareModalProps {
  url: string;
  onClose: () => void;
}

// Most browsers support URLs up to ~2 000 chars reliably; beyond 4 000 some
// servers / link-shorteners may reject them.
const WARN_LENGTH = 2000;
const ERROR_LENGTH = 4000;

export default function ShareModal({ url, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [displayUrl, setDisplayUrl] = useState(url);
  const [isShortening, setIsShortening] = useState(false);
  const [shortenError, setShortenError] = useState<string | null>(null);
  const isShortened = displayUrl !== url;
  const isLocalUrl = /^https?:\/\/(localhost|127\.|0\.0\.0\.0|192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.)/.test(url);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displayUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement("input");
      input.value = displayUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShorten = async () => {
    if (isLocalUrl) {
      setShortenError("Short links only work on the live site, not localhost.");
      return;
    }
    setIsShortening(true);
    setShortenError(null);
    try {
      const res = await fetch(
        `https://api.shrtco.de/v2/shorten?url=${encodeURIComponent(url)}`
      );
      const data = await res.json() as { ok: boolean; result?: { full_short_link: string }; error?: string };
      if (data.ok && data.result?.full_short_link) {
        setDisplayUrl(data.result.full_short_link);
      } else {
        setShortenError(data.error ?? "Shortener unavailable — use the full link.");
      }
    } catch {
      setShortenError("Could not reach shortener — use the full link.");
    } finally {
      setIsShortening(false);
    }
  };

  const len = displayUrl.length;
  const isLong = len > WARN_LENGTH;
  const isVeryLong = len > ERROR_LENGTH;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-2xl shadow-2xl p-6 max-w-lg w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-sky-deep mb-2">Share Your Island Plan</h3>
        <p className="text-sm text-text-secondary mb-4">
          Copy this link and share it with friends! They&apos;ll see your exact island layout.
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            value={displayUrl}
            className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm bg-cloud-soft text-text-primary min-w-0"
          />
          <Button onClick={handleCopy} variant={copied ? "secondary" : "primary"}>
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>

        {/* URL length feedback + shorten button */}
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-medium ${isVeryLong ? "text-red-500" : isLong ? "text-orange-500" : "text-text-secondary"}`}>
            {len.toLocaleString()} chars
          </span>
          {isVeryLong && (
            <span className="text-xs text-red-500">
              — very long; some browsers may truncate this link.
            </span>
          )}
          {!isVeryLong && isLong && (
            <span className="text-xs text-orange-500">
              — moderately long; should work in most browsers.
            </span>
          )}
          {shortenError && (
            <span className="text-xs text-red-500">— {shortenError}</span>
          )}
          {!isShortened && (
            <button
              onClick={handleShorten}
              disabled={isShortening}
              className="ml-auto text-xs text-sky-600 hover:text-sky-800 underline disabled:opacity-50 disabled:cursor-wait"
            >
              {isShortening ? "Shortening…" : "Get short link"}
            </button>
          )}
        </div>

        <div className="mt-4 text-right">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
