"use client";

import { useState, useEffect, useRef } from "react";
import Button from "@/components/ui/Button";

interface ShareModalProps {
  url: string;
  onClose: () => void;
}

export default function ShareModal({ url, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    import("qrcode").then((mod) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const QRCode = (mod as any).default ?? mod;
      QRCode.toCanvas(canvas, url, {
        width: 200,
        margin: 2,
        errorCorrectionLevel: "M",
      });
    });
  }, [url]);

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
        <p className="text-xs text-text-secondary mb-4">
          Copy the link or scan the QR code to share your layout.
        </p>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            readOnly
            value={url}
            className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm bg-cloud-soft text-text-primary min-w-0"
          />
          <Button onClick={handleCopy} variant={copied ? "secondary" : "primary"}>
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>

        <div className="flex justify-center mb-4 p-3 bg-white rounded-xl border border-gray-200">
          <canvas ref={canvasRef} width={200} height={200} className="rounded" />
        </div>

        <div className="text-right">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
