import type { Detection } from "../types/detection";
import { inferFashionpediaViaGradio } from "./huggingface-fashionpedia";
import { inferHuggingFaceObjectDetection } from "./huggingface-inference";
import { inferImage } from "./roboflow";

export type DetectionModelId = "ppe" | "fashionpedia" | "detr";

export type ModelProvider = "roboflow" | "gradio" | "huggingface";

export type ModelConfig = {
  id: DetectionModelId;
  label: string;
  subtitle: string;
  provider: ModelProvider;
  roboflowModelId?: string;
  huggingFaceModelId?: string;
  gradioSpaceUrl?: string;
  emptyMessage: string;
};

const DEFAULT_PPE_MODEL =
  process.env.ROBOFLOW_PPE_MODEL_ID ??
  process.env.ROBOFLOW_MODEL_ID ??
  "ppes-kaxsi/8";

const DEFAULT_FASHIONPEDIA_MODEL =
  process.env.ROBOFLOW_FASHIONPEDIA_MODEL_ID ?? "fashionpedia-wnt48/1";

const DEFAULT_DETR_MODEL =
  process.env.HF_DETR_MODEL_ID ?? "facebook/detr-resnet-50";

export function getModelConfig(modelId: DetectionModelId): ModelConfig {
  if (modelId === "ppe") {
    return {
      id: "ppe",
      label: "PPE",
      subtitle: `Roboflow · ${DEFAULT_PPE_MODEL}`,
      provider: "roboflow",
      roboflowModelId: DEFAULT_PPE_MODEL,
      emptyMessage: "PPE model responding — no objects detected in this frame.",
    };
  }

  if (modelId === "fashionpedia") {
    const useGradio = process.env.FASHIONPEDIA_PROVIDER === "gradio";
    return {
      id: "fashionpedia",
      label: "Fashionpedia",
      subtitle: "Roboflow · trained on HF Fashionpedia dataset",
      provider: useGradio ? "gradio" : "roboflow",
      roboflowModelId: DEFAULT_FASHIONPEDIA_MODEL,
      gradioSpaceUrl: process.env.HF_FASHIONPEDIA_SPACE_URL,
      emptyMessage:
        "Fashionpedia model responding — no clothing detected in this frame.",
    };
  }

  return {
    id: "detr",
    label: "DETR-50",
    subtitle: `Hugging Face · ${DEFAULT_DETR_MODEL}`,
    provider: "huggingface",
    huggingFaceModelId: DEFAULT_DETR_MODEL,
    emptyMessage:
      "DETR model responding — no COCO objects detected in this frame.",
  };
}

export function isValidModelId(value: string): value is DetectionModelId {
  return value === "ppe" || value === "fashionpedia" || value === "detr";
}

export async function inferWithModel(
  modelId: DetectionModelId,
  base64Image: string,
): Promise<Detection[]> {
  const config = getModelConfig(modelId);

  if (config.provider === "gradio") {
    if (!config.gradioSpaceUrl) {
      throw new Error(
        "HF_FASHIONPEDIA_SPACE_URL is not configured for Gradio inference",
      );
    }
    return inferFashionpediaViaGradio(base64Image, config.gradioSpaceUrl);
  }

  if (config.provider === "huggingface") {
    if (!config.huggingFaceModelId) {
      throw new Error(`No Hugging Face model configured for ${modelId}`);
    }
    return inferHuggingFaceObjectDetection(
      base64Image,
      config.huggingFaceModelId,
    );
  }

  if (!config.roboflowModelId) {
    throw new Error(`No Roboflow model configured for ${modelId}`);
  }

  return inferImage(base64Image, config.roboflowModelId);
}

export const CLIENT_MODEL_OPTIONS: {
  id: DetectionModelId;
  label: string;
  description: string;
}[] = [
  {
    id: "ppe",
    label: "PPE",
    description: "Safety gear detection",
  },
  {
    id: "fashionpedia",
    label: "Fashionpedia",
    description: "Fashion / clothing detection",
  },
  {
    id: "detr",
    label: "DETR-50",
    description: "General COCO object detection (HF)",
  },
];

export const MODEL_BUTTON_ACTIVE_CLASS: Record<DetectionModelId, string> = {
  ppe: "bg-blue-600 border-blue-500 text-white",
  fashionpedia: "bg-purple-600 border-purple-500 text-white",
  detr: "bg-amber-600 border-amber-500 text-white",
};

export function getModelLabel(modelId: DetectionModelId): string {
  return (
    CLIENT_MODEL_OPTIONS.find((option) => option.id === modelId)?.label ??
    modelId
  );
}

export function getModelEmptyMessage(modelId: DetectionModelId): string {
  return getModelConfig(modelId).emptyMessage;
}
