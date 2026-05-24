"use client";

import { useEffect, useRef } from "react";
import type { DetectionModelId } from "../lib/models";
import type { Detection } from "../types/detection";

type DetectionOverlayProps = {
  detections: Detection[];
  sourceWidth: number;
  sourceHeight: number;
  modelId?: DetectionModelId;
};

const BASE_COLORS = [
  "#22c55e",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#a855f7",
  "#06b6d4",
  "#ec4899",
];

const MODEL_PALETTES: Record<DetectionModelId, string[]> = {
  ppe: ["#22c55e", "#3b82f6", "#06b6d4", "#10b981", "#0ea5e9"],
  fashionpedia: ["#a855f7", "#ec4899", "#f472b6", "#c084fc", "#e879f9"],
  detr: ["#f59e0b", "#fb923c", "#fbbf24", "#f97316", "#eab308"],
};

function colorForClass(className: string, modelId: DetectionModelId): string {
  const palette = MODEL_PALETTES[modelId] ?? BASE_COLORS;
  let hash = 0;
  for (let i = 0; i < className.length; i++) {
    hash = className.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palette[Math.abs(hash) % palette.length];
}

export default function DetectionOverlay({
  detections,
  sourceWidth,
  sourceHeight,
  modelId = "ppe",
}: DetectionOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || sourceWidth === 0 || sourceHeight === 0) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const displayWidth = parent.clientWidth;
    const displayHeight = parent.clientHeight;

    canvas.width = displayWidth;
    canvas.height = displayHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, displayWidth, displayHeight);

    const scale = Math.min(
      displayWidth / sourceWidth,
      displayHeight / sourceHeight,
    );
    const offsetX = (displayWidth - sourceWidth * scale) / 2;
    const offsetY = (displayHeight - sourceHeight * scale) / 2;

    for (const det of detections) {
      const color = colorForClass(det.class, modelId);
      const left = offsetX + (det.x - det.width / 2) * scale;
      const top = offsetY + (det.y - det.height / 2) * scale;
      const width = det.width * scale;
      const height = det.height * scale;

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.strokeRect(left, top, width, height);

      const label = `${det.class} ${Math.round(det.confidence * 100)}%`;
      ctx.font = "bold 13px system-ui, sans-serif";
      const textWidth = ctx.measureText(label).width;
      const labelHeight = 18;

      ctx.fillStyle = color;
      ctx.fillRect(left, top - labelHeight, textWidth + 8, labelHeight);

      ctx.fillStyle = "#ffffff";
      ctx.fillText(label, left + 4, top - 5);
    }
  }, [detections, sourceWidth, sourceHeight, modelId]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
