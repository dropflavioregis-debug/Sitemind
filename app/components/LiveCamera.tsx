"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import DetectionOverlay from "./DetectionOverlay";
import {
  CLIENT_MODEL_OPTIONS,
  getModelEmptyMessage,
  getModelLabel,
  MODEL_BUTTON_ACTIVE_CLASS,
  type DetectionModelId,
} from "../lib/models";
import type { Detection } from "../types/detection";

type CameraStatus = "idle" | "loading" | "live" | "error";
type ApiStatus = "idle" | "checking" | "ok" | "error";

export type LiveCameraProps = {
  variant?: "full" | "embed";
  defaultModel?: DetectionModelId;
  lockedModel?: DetectionModelId;
  isActive?: boolean;
  /** Shown when the camera cannot start (e.g. permission denied on pitch slides). */
  fallbackImage?: string;
};

const DETECTION_INTERVAL_MS = 1500;
const MAX_CAPTURE_WIDTH = 1280;
const JPEG_QUALITY = 0.7;

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function getPpeStatus(
  detections: Detection[],
): "safe" | "unsafe" | "scanning" {
  if (detections.length === 0) return "scanning";
  const unsafe = detections.some((d) =>
    /no-|missing|without|unsafe|violation/i.test(d.class),
  );
  if (unsafe) return "unsafe";
  const hasPpe = detections.some((d) =>
    /hardhat|helmet|vest|gloves|mask|boots|ppe|safety/i.test(d.class),
  );
  return hasPpe ? "safe" : "scanning";
}

export default function LiveCamera({
  variant = "full",
  defaultModel = "ppe",
  lockedModel,
  isActive = true,
  fallbackImage,
}: LiveCameraProps) {
  const isEmbed = variant === "embed";
  const initialModel = lockedModel ?? defaultModel;

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const inFlightRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  const [status, setStatus] = useState<CameraStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment",
  );
  const [isDetecting, setIsDetecting] = useState(true);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [inferenceError, setInferenceError] = useState<string | null>(null);
  const [inferenceMs, setInferenceMs] = useState<number | null>(null);
  const [sourceSize, setSourceSize] = useState({ width: 0, height: 0 });
  const [apiStatus, setApiStatus] = useState<ApiStatus>("idle");
  const [scanCount, setScanCount] = useState(0);
  const [lastOkAt, setLastOkAt] = useState<Date | null>(null);
  const [flashTick, setFlashTick] = useState(0);
  const [activeModel, setActiveModel] = useState<DetectionModelId>(initialModel);
  const activeModelRef = useRef<DetectionModelId>(initialModel);

  const resetDetectionState = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    inFlightRef.current = false;
    setDetections([]);
    setInferenceError(null);
    setApiStatus("idle");
    setScanCount(0);
    setLastOkAt(null);
    setInferenceMs(null);
    setFlashTick(0);
  }, []);

  const switchModel = useCallback(
    (model: DetectionModelId) => {
      if (lockedModel) return;
      if (model === activeModelRef.current) return;
      activeModelRef.current = model;
      setActiveModel(model);
      resetDetectionState();
    },
    [lockedModel, resetDetectionState],
  );

  const stopStream = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    inFlightRef.current = false;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("error");
      setErrorMessage(
        "Camera API not available. Use HTTPS or localhost in a modern browser.",
      );
      return;
    }

    stopStream();
    setStatus("loading");
    setErrorMessage(null);
    setDetections([]);
    setInferenceError(null);
    setApiStatus("idle");
    setScanCount(0);
    setLastOkAt(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) {
        stopStream();
        return;
      }

      video.srcObject = stream;
      await video.play();
      setStatus("live");
    } catch (err) {
      stopStream();
      setStatus("error");
      if (err instanceof DOMException) {
        if (err.name === "NotAllowedError") {
          setErrorMessage(
            "Camera permission denied. Allow camera access in your browser settings.",
          );
        } else if (err.name === "NotFoundError") {
          setErrorMessage("No camera found on this device.");
        } else {
          setErrorMessage(err.message || "Could not access the camera.");
        }
      } else {
        setErrorMessage("Could not access the camera.");
      }
    }
  }, [facingMode, stopStream]);

  const captureFrame = useCallback(async (): Promise<string | null> => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.videoWidth === 0) return null;

    let width = video.videoWidth;
    let height = video.videoHeight;

    if (width > MAX_CAPTURE_WIDTH) {
      const ratio = MAX_CAPTURE_WIDTH / width;
      width = MAX_CAPTURE_WIDTH;
      height = Math.round(height * ratio);
    }

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, width, height);
    setSourceSize({ width: video.videoWidth, height: video.videoHeight });

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY),
    );
    if (!blob) return null;

    return blobToBase64(blob);
  }, []);

  const runDetection = useCallback(async () => {
    if (inFlightRef.current) return;

    const image = await captureFrame();
    if (!image) return;

    inFlightRef.current = true;
    const controller = new AbortController();
    abortRef.current = controller;
    setApiStatus("checking");

    try {
      const res = await fetch("/api/detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, model: activeModelRef.current }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(data.error ?? `Detection failed (${res.status})`);
      }

      const data = (await res.json()) as {
        predictions: Detection[];
        inferenceMs?: number;
      };

      setDetections(data.predictions);
      setInferenceMs(data.inferenceMs ?? null);
      setInferenceError(null);
      setApiStatus("ok");
      setScanCount((n) => n + 1);
      setLastOkAt(new Date());
      setFlashTick((n) => n + 1);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setApiStatus("error");
      setInferenceError(
        err instanceof Error ? err.message : "Detection failed",
      );
    } finally {
      inFlightRef.current = false;
      abortRef.current = null;
    }
  }, [captureFrame]);

  useEffect(() => {
    const model = lockedModel ?? defaultModel;
    activeModelRef.current = model;
    setActiveModel(model);
  }, [lockedModel, defaultModel]);

  useEffect(() => {
    if (!isActive) {
      stopStream();
      setStatus("idle");
      setDetections([]);
      return;
    }

    startCamera();
    return () => stopStream();
  }, [isActive, startCamera, stopStream]);

  useEffect(() => {
    if (status !== "live" || !isDetecting || !isActive) return;

    const interval = setInterval(runDetection, DETECTION_INTERVAL_MS);
    runDetection();

    return () => {
      clearInterval(interval);
      abortRef.current?.abort();
    };
  }, [status, isDetecting, runDetection, activeModel, isActive]);

  const flipCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  const ppeStatus =
    activeModel === "ppe" ? getPpeStatus(detections) : null;

  const maxWidthClass = isEmbed ? "max-w-2xl" : "max-w-5xl";
  const showFallbackFeed = status === "error" && !!fallbackImage;

  const videoFrame = (
    <div
      className={`relative w-full ${maxWidthClass} aspect-video bg-slate-900 rounded-lg overflow-hidden border-2 transition-colors duration-500 ${
        showFallbackFeed || apiStatus === "ok"
          ? "border-emerald-500/80"
          : apiStatus === "error"
            ? "border-red-500"
            : apiStatus === "checking"
              ? "border-amber-500/60"
              : "border-slate-700"
      }`}
    >
      {isEmbed && status === "live" && (
        <div className="absolute top-0 right-0 z-20 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-md tracking-wider">
          LIVE
        </div>
      )}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-contain ${
          status === "live" ? "opacity-100" : "opacity-0"
        }`}
      />

      {status === "live" && sourceSize.width > 0 && (
        <DetectionOverlay
          detections={detections}
          sourceWidth={sourceSize.width}
          sourceHeight={sourceSize.height}
          modelId={activeModel}
        />
      )}

      {status === "live" && isDetecting && (
        <div
          key={flashTick}
          className={`absolute z-10 rounded-lg bg-black/75 backdrop-blur-sm border border-slate-700 text-xs ${
            isEmbed
              ? "top-2 left-2 px-2 py-1.5 min-w-[120px]"
              : "top-3 left-3 px-3 py-2 space-y-1.5 min-w-[180px]"
          }`}
        >
          <div className="flex items-center gap-2 font-medium">
            <span
              className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                apiStatus === "ok"
                  ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                  : apiStatus === "error"
                    ? "bg-red-500"
                    : apiStatus === "checking"
                      ? "bg-amber-400 animate-pulse"
                      : "bg-slate-500"
              }`}
            />
            <span
              className={
                apiStatus === "ok"
                  ? "text-emerald-300"
                  : apiStatus === "error"
                    ? "text-red-300"
                    : apiStatus === "checking"
                      ? "text-amber-300"
                      : "text-slate-400"
              }
            >
              {isEmbed && ppeStatus
                ? ppeStatus === "unsafe"
                  ? "PPE · UNSAFE"
                  : ppeStatus === "safe"
                    ? "PPE · SAFE"
                    : apiStatus === "ok"
                      ? "PPE · Scanning"
                      : apiStatus === "checking"
                        ? "Calling API…"
                        : "Waiting…"
                : apiStatus === "ok"
                  ? `${getModelLabel(activeModel)} · API OK`
                  : apiStatus === "error"
                    ? "API error"
                    : apiStatus === "checking"
                      ? "Calling API…"
                      : "Waiting…"}
            </span>
          </div>
          {!isEmbed && apiStatus === "ok" && (
            <>
              <p className="text-slate-300">
                Scans:{" "}
                <span className="text-white font-semibold">{scanCount}</span>
                {inferenceMs !== null && (
                  <span className="text-slate-500"> · {inferenceMs}ms</span>
                )}
              </p>
              <p className="text-slate-300">
                Objects:{" "}
                <span
                  className={
                    detections.length > 0
                      ? "text-emerald-300 font-semibold"
                      : "text-slate-400"
                  }
                >
                  {detections.length}
                </span>
              </p>
              {lastOkAt && (
                <p className="text-slate-500">
                  Last OK {lastOkAt.toLocaleTimeString()}
                </p>
              )}
            </>
          )}
          {apiStatus === "error" && inferenceError && (
            <p className="text-red-300/90 leading-snug text-[10px] mt-1">
              {inferenceError}
            </p>
          )}
        </div>
      )}

      {status === "live" && apiStatus === "ok" && flashTick > 0 && (
        <div
          key={`pulse-${flashTick}`}
          className="absolute inset-0 pointer-events-none rounded-lg api-flash-once"
        />
      )}

      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
          <p className="text-slate-400 text-sm">Starting camera…</p>
        </div>
      )}

      {status === "error" && fallbackImage && (
        <>
          <Image
            src={fallbackImage}
            alt="AI PPE detection on a construction site"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 672px"
            priority
          />
          {isEmbed && (
            <div className="absolute top-0 right-0 z-20 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-md tracking-wider">
              LIVE
            </div>
          )}
          <div className="absolute top-2 left-2 z-20 rounded-lg bg-black/75 backdrop-blur-sm border border-slate-700 px-2 py-1.5 text-xs min-w-[120px]">
            <div className="flex items-center gap-2 font-medium text-emerald-300">
              <span className="h-2.5 w-2.5 rounded-full shrink-0 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              PPE · Demo feed
            </div>
          </div>
        </>
      )}

      {status === "error" && !fallbackImage && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-900 p-6 text-center">
          <p className="text-red-300 text-sm max-w-md">{errorMessage}</p>
          <button
            type="button"
            onClick={startCamera}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium"
          >
            Try again
          </button>
        </div>
      )}

      {status === "idle" && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
          <p className="text-slate-500 text-sm">
            {isActive ? "Camera off" : "Camera paused"}
          </p>
        </div>
      )}
    </div>
  );

  if (isEmbed) {
    return (
      <div className="w-full flex flex-col items-center">
        {videoFrame}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-wide">MIND SITE</h1>
          <p className="text-sm text-slate-400">
            Live camera · model comparison
          </p>
        </div>
        <div className="flex items-center gap-3">
          {status === "live" && isDetecting && (
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium border ${
                apiStatus === "ok"
                  ? "bg-emerald-950/60 border-emerald-800/50 text-emerald-300"
                  : apiStatus === "error"
                    ? "bg-red-950/60 border-red-800/50 text-red-300"
                    : "bg-amber-950/60 border-amber-800/50 text-amber-300"
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    apiStatus === "ok"
                      ? "bg-emerald-400"
                      : apiStatus === "error"
                        ? "bg-red-400"
                        : "bg-amber-400"
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    apiStatus === "ok"
                      ? "bg-emerald-500"
                      : apiStatus === "error"
                        ? "bg-red-500"
                        : "bg-amber-500"
                  }`}
                />
              </span>
              {apiStatus === "ok"
                ? "MODEL OK"
                : apiStatus === "error"
                  ? "API ERROR"
                  : apiStatus === "checking"
                    ? "CALLING API"
                    : "DETECTING"}
            </div>
          )}
          {status === "live" && (
            <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-md text-xs font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              LIVE
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6 flex flex-col items-center justify-center">
        {status === "live" && !lockedModel && (
          <div className="mb-4 w-full max-w-5xl flex flex-wrap gap-2">
            {CLIENT_MODEL_OPTIONS.map((option) => {
              const isActiveModel = activeModel === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => switchModel(option.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    isActiveModel
                      ? MODEL_BUTTON_ACTIVE_CLASS[option.id]
                      : "bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        )}

        {videoFrame}

        {status === "live" && (
          <div className="mt-4 w-full max-w-5xl">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <button
                type="button"
                onClick={() => setIsDetecting((prev) => !prev)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                  isDetecting
                    ? "bg-emerald-700 border-emerald-600 hover:bg-emerald-600 text-white"
                    : "bg-slate-800 border-slate-600 hover:bg-slate-700"
                }`}
              >
                {isDetecting ? "Detection ON" : "Detection OFF"}
              </button>
              {inferenceMs !== null && (
                <span className="text-xs text-slate-500">
                  Last inference: {inferenceMs}ms
                </span>
              )}
              {inferenceError && (
                <span className="text-xs text-red-400">{inferenceError}</span>
              )}
            </div>

            {detections.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {detections.map((det, i) => (
                  <span
                    key={`${det.class}-${i}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs"
                  >
                    <span className="font-medium capitalize">{det.class}</span>
                    <span className="text-slate-400">
                      {Math.round(det.confidence * 100)}%
                    </span>
                  </span>
                ))}
              </div>
            ) : (
              isDetecting && (
                <p className="text-xs text-slate-500">
                  {apiStatus === "ok"
                    ? getModelEmptyMessage(activeModel)
                    : apiStatus === "checking"
                      ? "Sending frame to API…"
                      : apiStatus === "error"
                        ? "Fix the API error above to resume scanning."
                        : "Waiting for first API response…"}
                </p>
              )
            )}
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-3 justify-center">
          <button
            type="button"
            onClick={flipCamera}
            disabled={status === "loading"}
            className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 hover:bg-slate-700 text-sm font-medium disabled:opacity-50"
          >
            Flip camera
          </button>
          <button
            type="button"
            onClick={startCamera}
            disabled={status === "loading"}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium disabled:opacity-50"
          >
            Restart
          </button>
          <button
            type="button"
            onClick={() => {
              stopStream();
              setStatus("idle");
              setDetections([]);
            }}
            className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 hover:bg-slate-700 text-sm font-medium"
          >
            Stop
          </button>
        </div>

        <p className="mt-6 text-xs text-slate-500 text-center max-w-md">
          Uses your device webcam. On first visit, your browser will ask for
          camera permission — choose Allow.
        </p>
      </main>
    </div>
  );
}

