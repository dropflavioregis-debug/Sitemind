import type { Detection } from "../types/detection";

const POLL_INTERVAL_MS = 500;
const MAX_POLL_ATTEMPTS = 60;

type GradioBox = {
  xmin?: number;
  ymin?: number;
  xmax?: number;
  ymax?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  label?: string;
  class?: string;
  score?: number;
  confidence?: number;
};

function normalizeSpaceUrl(spaceUrl: string): string {
  const trimmed = spaceUrl.trim().replace(/\/$/, "");
  if (trimmed.startsWith("http")) return trimmed;
  return `https://${trimmed}`;
}

function boxToDetection(box: GradioBox): Detection | null {
  const className = box.label ?? box.class;
  const confidence = box.score ?? box.confidence;
  if (!className || confidence === undefined) return null;

  if (
    box.x !== undefined &&
    box.y !== undefined &&
    box.width !== undefined &&
    box.height !== undefined
  ) {
    return {
      class: className,
      confidence,
      x: box.x,
      y: box.y,
      width: box.width,
      height: box.height,
    };
  }

  if (
    box.xmin !== undefined &&
    box.ymin !== undefined &&
    box.xmax !== undefined &&
    box.ymax !== undefined
  ) {
    const width = box.xmax - box.xmin;
    const height = box.ymax - box.ymin;
    return {
      class: className,
      confidence,
      x: box.xmin + width / 2,
      y: box.ymin + height / 2,
      width,
      height,
    };
  }

  return null;
}

function parseGradioResult(data: unknown): Detection[] {
  if (!Array.isArray(data)) return [];

  for (const item of data) {
    if (Array.isArray(item)) {
      const nested = parseGradioResult(item);
      if (nested.length > 0) return nested;
    }
    if (item && typeof item === "object") {
      const obj = item as Record<string, unknown>;
      if (Array.isArray(obj.predictions)) {
        return obj.predictions
          .map((p) => boxToDetection(p as GradioBox))
          .filter((d): d is Detection => d !== null);
      }
      const single = boxToDetection(obj as GradioBox);
      if (single) return [single];
    }
  }

  return [];
}

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export async function inferFashionpediaViaGradio(
  base64Image: string,
  spaceUrl: string,
): Promise<Detection[]> {
  const base = normalizeSpaceUrl(spaceUrl);
  const imageDataUri = `data:image/jpeg;base64,${base64Image}`;

  const submitRes = await fetch(`${base}/gradio_api/call/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: [imageDataUri] }),
  });

  if (!submitRes.ok) {
    const text = await submitRes.text().catch(() => "");
    throw new Error(
      `Gradio Space unreachable (${submitRes.status})${text ? `: ${text.slice(0, 200)}` : ""}`,
    );
  }

  const submitJson = (await submitRes.json()) as { event_id?: string };
  if (!submitJson.event_id) {
    throw new Error("Gradio Space did not return an event_id");
  }

  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
    const pollRes = await fetch(
      `${base}/gradio_api/call/predict/${submitJson.event_id}`,
    );

    if (!pollRes.ok) {
      throw new Error(`Gradio poll failed (${pollRes.status})`);
    }

    const pollText = await pollRes.text();
    const dataLine = pollText
      .split("\n")
      .find((line) => line.startsWith("data: "));

    if (dataLine) {
      const payload = JSON.parse(dataLine.slice(6)) as unknown;
      if (Array.isArray(payload) && payload.length > 0) {
        const detections = parseGradioResult(payload);
        return detections;
      }
    }

    await sleep(POLL_INTERVAL_MS);
  }

  throw new Error("Gradio inference timed out waiting for results");
}
