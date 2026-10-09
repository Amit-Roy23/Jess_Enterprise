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

/** Shrinks large photos in the browser (max 1600px, WebP) so pages stay fast. */
async function downscaleImage(file: File, maxSize = 1600): Promise<File> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.size < 500 * 1024) return file;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", 0.85)
    );
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.\w+$/, "") + ".webp", { type: "image/webp" });
  } catch {
    return file;
  }
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
    const original = e.target.files?.[0];
    e.target.value = "";
    if (!original) return;

    setError("");
    setUploading(true);

    try {
      const file = await downscaleImage(original);

      // Use Cloudinary when it is configured, otherwise store the image in MongoDB
      const signRes = await fetch("/api/uploads/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder }),
      });
      if (!signRes.ok) {
        throw new Error("Failed to authenticate upload request.");
      }
      const sign = await signRes.json();

      if (sign.enabled) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", sign.apiKey);
        formData.append("timestamp", sign.timestamp.toString());
        formData.append("signature", sign.signature);
        formData.append("folder", folder);

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`,
          { method: "POST", body: formData }
        );
        if (!uploadRes.ok) throw new Error("Cloudinary upload failed.");
        const uploadData = await uploadRes.json();
        onChange(uploadData.secure_url);
      } else {
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await fetch("/api/uploads", { method: "POST", body: formData });
        const uploadData = await uploadRes.json().catch(() => ({}));
        if (!uploadRes.ok) throw new Error(uploadData.error || "Upload failed.");
        onChange(uploadData.url);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(
        `${err instanceof Error ? err.message : "Upload failed."} You can paste an image URL instead.`
      );
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
            unoptimized
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
                  <span>Uploading...</span>
                </div>
              ) : (
                <>
                  <Upload className="w-6 h-6 mb-1 text-slate-400" />
                  <p className="font-semibold text-slate-700">
                    Click to browse photo
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    PNG, JPG or WebP — auto-optimised
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
                placeholder="Paste image link (e.g. from Google Images)"
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
