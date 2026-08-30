import { calculateFogModel } from "./fog-model";
import type { ModelInputs, ModelResult } from "./types";

export type WorkerRequest = {
  id: string;
  inputs: ModelInputs;
};

export type WorkerResponse =
  | { id: string; success: true; result: ModelResult }
  | { id: string; success: false; error: string };

self.onmessage = (event: MessageEvent<WorkerRequest>) => {
  const { id, inputs } = event.data;
  try {
    const result = calculateFogModel(inputs);
    const response: WorkerResponse = { id, success: true, result };
    self.postMessage(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "The simulation could not complete.";
    const response: WorkerResponse = { id, success: false, error: message };
    self.postMessage(response);
  }
};
