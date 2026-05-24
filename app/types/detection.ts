export type Detection = {
  class: string;
  confidence: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type DetectResponse = {
  predictions: Detection[];
  inferenceMs?: number;
  model?: string;
  modelLabel?: string;
};
