import type { Detection } from "../types/detection";

const ROBOFLOW_API_URL = "https://serverless.roboflow.com";

function getRoboflowConfig() {
  const apiKey = process.env.ROBOFLOW_API_KEY;
  const confidenceRaw = process.env.ROBOFLOW_CONFIDENCE ?? "0.4";

  if (!apiKey) {
    throw new Error("ROBOFLOW_API_KEY is not configured");
  }

  const confidence = Number(confidenceRaw);
  const confidenceParam = Number.isFinite(confidence)
    ? confidence > 1
      ? confidence / 100
      : confidence
    : 0.4;

  return { apiKey, confidence: confidenceParam };
}

type RoboflowPrediction = {
  x: number;
  y: number;
  width: number;
  height: number;
  class: string;
  confidence: number;
};

type RoboflowResponse = {
  predictions?: RoboflowPrediction[];
};

export async function inferImage(
  base64Image: string,
  modelId: string,
): Promise<Detection[]> {
  const { apiKey, confidence } = getRoboflowConfig();

  const imageBuffer = Buffer.from(base64Image, "base64");
  if (imageBuffer.length === 0) {
    throw new Error("Invalid base64 image data");
  }

  const [datasetId, versionId] = modelId.split("/");
  if (!datasetId || !versionId) {
    throw new Error(
      `Model ID must be in workspace/project/version form, got "${modelId}"`,
    );
  }

  const url = `${ROBOFLOW_API_URL}/${datasetId}/${versionId}?api_key=${encodeURIComponent(apiKey)}&confidence=${encodeURIComponent(String(confidence))}`;

  const response = await fetch(url, {
    method: "POST",
    body: base64Image,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `Roboflow inference failed (${response.status})${text ? `: ${text.slice(0, 200)}` : ""}`,
    );
  }

  const data = (await response.json()) as RoboflowResponse;
  return (data.predictions ?? []).map((p) => ({
    class: p.class,
    confidence: p.confidence,
    x: p.x,
    y: p.y,
    width: p.width,
    height: p.height,
  }));
}
