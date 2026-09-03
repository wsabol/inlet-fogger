import { useCallback, useEffect, useRef, useState } from "react";
import { calculateFogModel } from "../../model/fog-model";
import { interpretResult, type Interpretation } from "../../model/interpret";
import { scenarioToModel, type ModelResult, type ScenarioInputs } from "../../model/types";
import { hasErrors, validateScenario } from "../../model/validate";
import { BASELINE_INPUTS } from "../../model/presets";
import type { WorkerRequest, WorkerResponse } from "../../model/worker";

export type ScenarioRun = {
  id: string;
  name: string;
  inputs: ScenarioInputs;
  result: ModelResult;
  interpretation: Interpretation;
};

function runLocal(inputs: ScenarioInputs): ModelResult {
  return calculateFogModel(scenarioToModel(inputs));
}

export function useSimulation() {
  const workerRef = useRef<Worker | null>(null);
  const pending = useRef<Map<string, (res: WorkerResponse) => void>>(new Map());
  const [draft, setDraft] = useState<ScenarioInputs>({ ...BASELINE_INPUTS });
  const [runLabel, setRunLabel] = useState("Baseline");
  const [runs, setRuns] = useState<ScenarioRun[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [stale, setStale] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const worker = new Worker(new URL("../../model/worker.ts", import.meta.url), { type: "module" });
    workerRef.current = worker;
    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const resolver = pending.current.get(event.data.id);
      if (resolver) {
        pending.current.delete(event.data.id);
        resolver(event.data);
      }
    };
    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  const post = useCallback((inputs: ScenarioInputs) => {
    return new Promise<ModelResult>((resolve, reject) => {
      const id = crypto.randomUUID();
      const worker = workerRef.current;
      if (!worker) {
        try {
          resolve(runLocal(inputs));
        } catch (e) {
          reject(e);
        }
        return;
      }
      pending.current.set(id, (res) => {
        if (res.success) resolve(res.result);
        else reject(new Error(res.error));
      });
      const msg: WorkerRequest = { id, inputs: scenarioToModel(inputs) };
      worker.postMessage(msg);
    });
  }, []);

  const updateDraft = useCallback((patch: Partial<ScenarioInputs>) => {
    setDraft((d) => ({ ...d, ...patch }));
    setStale(true);
    setError(null);
  }, []);

  const loadInputs = useCallback((inputs: ScenarioInputs, name?: string) => {
    setDraft({ ...inputs });
    if (name) setRunLabel(name);
    setStale(true);
    setError(null);
  }, []);

  const run = useCallback(
    async (name?: string, asComparison = false) => {
      const issues = validateScenario(draft);
      if (hasErrors(issues)) {
        setError(issues.find((i) => i.level === "error")?.message ?? "Invalid inputs.");
        return;
      }
      setBusy(true);
      setError(null);
      try {
        const result = await post(draft);
        const interpretation = interpretResult(draft, result);
        const runName = name ?? (asComparison ? `${runLabel} (compare)` : runLabel);
        const next: ScenarioRun = {
          id: crypto.randomUUID(),
          name: runName,
          inputs: { ...draft },
          result,
          interpretation,
        };
        setRuns((current) => {
          if (!asComparison || current.length === 0) return [next];
          if (current.length >= 3) return [...current.slice(0, 2), next];
          return [...current, next];
        });
        setActiveId(next.id);
        setStale(false);
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : "The simulation could not complete for these conditions. Try adjusting droplet diameter, humidity, or temperature.",
        );
      } finally {
        setBusy(false);
      }
    },
    [draft, post, runs.length, runLabel],
  );

  const clearComparisons = useCallback(() => {
    setRuns((current) => current.slice(0, 1));
  }, []);

  const issues = validateScenario(draft);

  return {
    draft,
    updateDraft,
    loadInputs,
    runs,
    activeId,
    setActiveId,
    stale,
    busy,
    error,
    issues,
    run,
    clearComparisons,
  };
}
