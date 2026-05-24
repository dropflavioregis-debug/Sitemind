import type { Detection } from "../types/detection";

type HfObjectDetectionResult = {
  label: string;
  score: number;
  box: {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
  };
};

function getConfidenceThreshold(): number {
  const raw = process.env.HF_DETR_CONFIDENCE ?? process.env.HF_CONFIDENCE ?? "0.4";
  const value = Number(raw);
  return Number.isFinite(value) ? (value > 1 ? value / 100 : value) : 0.4;
}

export async function inferHuggingFaceObjectDetection(
  base64Image: string,
  modelId: string,
): Promise<Detection[]> {
  const token = process.env.HF_TOKEN;
  if (!token) {
    throw new Error(
      "HF_TOKEN is required for Hugging Face models. Add it to .env.local (https://huggingface.co/settings/tokens)",
    );
  }

  const imageBuffer = Buffer.from(base64Image, "base64");
  if (imageBuffer.length === 0) {
    throw new Error("Invalid base64 image data");
  }

  const url = `https://router.huggingface.co/hf-inference/models/${modelId}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "image/jpeg",
    },
    body: imageBuffer,
  });

  if (response.status === 503) {
    const body = (await response.json().catch(() => ({}))) as {
      error?: string;
    };
    throw new Error(
      body.error ?? "Hugging Face model is loading — try again in a few seconds",
    );
  }

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `Hugging Face inference failed (${response.status})${text ? `: ${text.slice(0, 200)}` : ""}`,
    );
  }

  const results = (await response.json()) as HfObjectDetectionResult[];
  if (!Array.isArray(results)) {
    throw new Error("Unexpected Hugging Face response format");
  }

  const threshold = getConfidenceThreshold();

  return results
    .filter((r) => r.score >= threshold)
    .map((r) => {
      const width = r.box.xmax - r.box.xmin;
      const height = r.box.ymax - r.box.ymin;
      return {
        class: r.label,
        confidence: r.score,
        x: r.box.xmin + width / 2,
        y: r.box.ymin + height / 2,
        width,
        height,
      };
    });
}
