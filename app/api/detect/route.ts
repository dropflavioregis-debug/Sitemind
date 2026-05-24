import { NextResponse } from "next/server";
import {
  getModelConfig,
  inferWithModel,
  isValidModelId,
  type DetectionModelId,
} from "../../lib/models";
import type { DetectResponse } from "../../types/detection";

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

function stripDataUrlPrefix(image: string): string {
  const commaIndex = image.indexOf(",");
  if (image.startsWith("data:") && commaIndex !== -1) {
    return image.slice(commaIndex + 1);
  }
  return image;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      image?: string;
      model?: string;
    };

    if (!body.image || typeof body.image !== "string") {
      return NextResponse.json(
        { error: "Missing image field" },
        { status: 400 },
      );
    }

    const modelId: DetectionModelId =
      body.model && isValidModelId(body.model) ? body.model : "ppe";

    const base64 = stripDataUrlPrefix(body.image.trim());
    if (!base64) {
      return NextResponse.json({ error: "Empty image data" }, { status: 400 });
    }

    const estimatedBytes = Math.ceil((base64.length * 3) / 4);
    if (estimatedBytes > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { error: "Image too large (max 2MB)" },
        { status: 413 },
      );
    }

    const config = getModelConfig(modelId);
    const start = Date.now();
    const predictions = await inferWithModel(modelId, base64);
    const inferenceMs = Date.now() - start;

    const response: DetectResponse = {
      predictions,
      inferenceMs,
      model: modelId,
      modelLabel: config.label,
    };
    return NextResponse.json(response);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Detection failed";
    console.error("[detect]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
