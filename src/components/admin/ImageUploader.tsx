"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}

export function ImageUploader({
  value,
  onChange,
  folder = "jess_enterprises",
  label = "Upload Image",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [manualUrl, setManualUrl] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);

    try {
      // 1. Get upload signature from backend
      const signRes = await fetch("/api/uploads/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder }),
      });

      if (!signRes.ok) {
        throw new Error("Failed to authenticate upload request.");
      }

      const { signature, timestamp, apiKey, cloudName } = await signRes.json();

      // 2. Upload file directly to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("folder", folder);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadRes.ok) {
        throw new Error("Cloudinary upload failed.");
      }

      const uploadData = await uploadRes.json();
      onChange(uploadData.secure_url);
    } catch (err) {
      console.error("Upload error:", err);
      setError("Upload failed. You can paste an image URL directly instead.");
      setShowManualInput(true);
    } finally {
      setUploading(false);
    }
  };

  const handleManualUrlSubmit = () => {
    if (manualUrl.trim()) {
      onChange(manualUrl.trim());
      setManualUrl("");
      setShowManualInput(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
        {label}
      </label>

      {value ? (
        <div className="relative w-40 h-32 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 group">
          <Image
            src={value}
            alt="Uploaded Preview"
            fill
            className="object-cover"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-600 text-white shadow-md hover:bg-red-700 transition-colors"
            aria-label="Remove image"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-slate-50 hover:bg-blue-50/50 hover:border-blue-400 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-500 text-xs">
              {uploading ? (
                <div className="flex items-center gap-2 text-[#1e5aa8] font-semibold">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Uploading to Cloudinary...</span>
                </div>
              ) : (
                <>
                  <Upload className="w-6 h-6 mb-1 text-slate-400" />
                  <p className="font-semibold text-slate-700">
                    Click to browse photo
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    PNG, JPG, WebP up to 5MB
                  </p>
                </>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <button
              type="button"
              onClick={() => setShowManualInput(!showManualInput)}
              className="text-[#1e5aa8] hover:underline flex items-center gap-1"
            >
              <LinkIcon className="w-3 h-3" />
              <span>Or enter image URL directly</span>
            </button>
          </div>

          {showManualInput && (
            <div className="flex items-center gap-2 pt-1 animate-in fade-in duration-200">
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={manualUrl}
                onChange={(e) => setManualUrl(e.target.value)}
                className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
              />
              <Button
                size="sm"
                variant="primary"
                onClick={handleManualUrlSubmit}
                className="text-xs h-8"
              >
                Apply
              </Button>
            </div>
          )}

          {error && <p className="text-[11px] text-red-600">{error}</p>}
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
