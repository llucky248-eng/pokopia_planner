"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import { SHARE_PARAM, BLOB_PARAM, JSONBLOB_API } from "@/lib/constants";

interface ShareModalProps {
  url: string;
  onClose: () => void;
}

export default function ShareModal({ url, onClose }: ShareModalProps) {
  const [status, setStatus] = useState<"creating" | "ready" | "error">("creating");
  const [displayUrl, setDisplayUrl] = useState(url);
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  // Create JSONBlob on mount to get a short share URL.
  useEffect(() => {
    const compressed = new URL(url).searchParams.get(SHARE_PARAM);
    if (!compressed) { setStatus("error"); return; }

    fetch(JSONBLOB_API, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ plan: compressed }),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        const location = res.headers.get("Location");
        const blobId = location?.split("/").pop();
        if (!blobId) throw new Error();
        const short = new URL(url);
        short.searchParams.delete(SHARE_PARAM);
        short.searchParams.set(BLOB_PARAM, blobId);
        setDisplayUrl(short.toString());
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [url]);

  // Generate QR code whenever the display URL changes.
  useEffect(() => {
    import("qrcode").then((QRCode) =>
      QRCode.toDataURL(displayUrl, { width: 200, margin: 2 })
        .then(setQrDataUrl)
        .catch(() => {})
    );
  }, [displayUrl]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displayUrl);
    } catch {
      const input = document.createElement("input");
      input.value = displayUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusMessage =
    status === "creating"
      ? "Creating short link…"
      : status === "ready"
        ? "Short link ready"
        : "Service unavailable — using full link";

  const statusColor =
    status === "creating"
      ? "text-text-secondary"
      : status === "ready"
        ? "text-emerald-600"
        : "text-orange-500";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-sky-deep mb-1">Share Your Island Plan</h3>
        <p className={`text-xs font-medium mb-4 ${statusColor}`}>
          {status === "creating" && (
            <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin mr-1.5 align-middle" />
          )}
          {statusMessage}
        </p>

        <div className="flex gap-2 mb-4">
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

        {qrDataUrl && (
          <div className="flex justify-center mb-4">
            <img
              src={qrDataUrl}
              alt="QR code for share link"
              width={200}
              height={200}
              className="rounded-xl border border-gray-200"
            />
          </div>
        )}

        <div className="text-right">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
