import { useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ScenarioRun } from "./useSimulation";
import { round } from "../../model/types";

const COLORS = ["#c5a572", "#4fd1d9", "#9eb6d4"];

type Row = Record<string, number>;

function nearest<T extends { time: number }>(series: T[], time: number): T {
  let best = series[0];
  let d = Math.abs(series[0].time - time);
  for (const p of series) {
    const dd = Math.abs(p.time - time);
    if (dd < d) {
      best = p;
      d = dd;
    }
  }
  return best;
}

function merge(
  runs: ScenarioRun[],
  pick: (point: ScenarioRun["result"]["series"][number], i: number) => Record<string, number>,
): Row[] {
  const times = new Set<number>();
  for (const run of runs) {
    for (const p of run.result.series) times.add(p.time);
  }
  return [...times]
    .sort((a, b) => a - b)
    .map((time) => {
      const row: Row = { time };
      runs.forEach((run, i) => {
        Object.assign(row, pick(nearest(run.result.series, time), i));
      });
      return row;
    });
}

function ChartFrame({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-line bg-panel p-4">
      <p className="mb-3 font-mono text-sm tracking-widest text-muted">{title}</p>
      <div className="h-72">{children}</div>
    </div>
  );
}

const axis = { fill: "#8b93a7", fontSize: 14, fontFamily: "IBM Plex Mono" };
const grid = { stroke: "#2a3340" };
const tooltipStyle = { background: "#11151f", border: "1px solid #2a3340", fontSize: 14 } as const;
const legendStyle = { fontSize: 14 };

export function SimulatorCharts({ runs }: { runs: ScenarioRun[] }) {
  const [showDensity, setShowDensity] = useState(false);
  if (runs.length === 0) return null;

  const primary = runs[0].result.series;
  const t0 = primary[0]?.time ?? 0;
  const tEnd = primary[primary.length - 1]?.time ?? 0;
  const minDrop = primary.reduce((m, p) => Math.min(m, p.dropletTempF), primary[0]?.dropletTempF ?? 0);

  const tempData = merge(runs, (p, i) => ({
    [`${i}-air`]: p.airTempF,
    [`${i}-drop`]: p.dropletTempF,
  }));
  const rhData = merge(runs, (p, i) => ({ [`${i}-rh`]: p.rhPercent }));
  const dData = merge(runs, (p, i) => ({ [`${i}-d`]: p.dropletUm }));
  const densData = merge(runs, (p, i) => ({ [`${i}-rho`]: p.density }));

  return (
    <div className="space-y-4">
      <ChartFrame title="Temperature vs. time">
        <ResponsiveContainer>
          <LineChart data={tempData}>
            <CartesianGrid {...grid} />
            <XAxis dataKey="time" tick={axis} tickFormatter={(v) => `${round(v, 2)}s`} />
            <YAxis tick={axis} unit=" °F" width={56} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={legendStyle} />
            <ReferenceLine x={t0} stroke="#8b93a7" strokeDasharray="2 4" label={{ value: "inlet", fill: "#8b93a7", fontSize: 14 }} />
            <ReferenceLine y={minDrop} stroke="#e08a4a" strokeDasharray="3 3" label={{ value: "min droplet", fill: "#e08a4a", fontSize: 14 }} />
            <ReferenceLine x={tEnd} stroke="#8b93a7" strokeDasharray="2 4" label={{ value: "final", fill: "#8b93a7", fontSize: 14 }} />
            {runs.map((run, i) => (
              <Line
                key={`${run.id}-air`}
                type="monotone"
                dataKey={`${i}-air`}
                name={`${run.name} air`}
                stroke={COLORS[i]}
                dot={false}
                strokeWidth={2}
              />
            ))}
            {runs.map((run, i) => (
              <Line
                key={`${run.id}-drop`}
                type="monotone"
                dataKey={`${i}-drop`}
                name={`${run.name} droplet`}
                stroke={COLORS[i]}
                dot={false}
                strokeDasharray="4 3"
                strokeWidth={1.5}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </ChartFrame>
      <div className="grid gap-4 md:grid-cols-2">
        <ChartFrame title="Relative humidity">
          <ResponsiveContainer>
            <LineChart data={rhData}>
              <CartesianGrid {...grid} />
              <XAxis dataKey="time" tick={axis} tickFormatter={(v) => `${round(v, 2)}s`} />
              <YAxis tick={axis} unit=" %" width={48} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={legendStyle} />
              {runs.map((run, i) => (
                <Line
                  key={run.id}
                  type="monotone"
                  dataKey={`${i}-rh`}
                  name={run.name}
                  stroke={COLORS[i]}
                  dot={false}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartFrame>
        <ChartFrame title="Droplet diameter">
          <ResponsiveContainer>
            <LineChart data={dData}>
              <CartesianGrid {...grid} />
              <XAxis dataKey="time" tick={axis} tickFormatter={(v) => `${round(v, 2)}s`} />
              <YAxis tick={axis} unit=" μm" width={56} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={legendStyle} />
              {runs.map((run, i) => (
                <Line
                  key={run.id}
                  type="monotone"
                  dataKey={`${i}-d`}
                  name={run.name}
                  stroke={COLORS[i]}
                  dot={false}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartFrame>
      </div>
      <details className="rounded-lg border border-line bg-panel p-4" open={showDensity} onToggle={(e) => setShowDensity((e.target as HTMLDetailsElement).open)}>
        <summary className="cursor-pointer font-mono text-sm tracking-widest text-muted">
          Air density vs. time (advanced)
        </summary>
        {showDensity && (
          <div className="mt-3 h-72">
            <ResponsiveContainer>
              <LineChart data={densData}>
                <CartesianGrid {...grid} />
                <XAxis dataKey="time" tick={axis} tickFormatter={(v) => `${round(v, 2)}s`} />
                <YAxis tick={axis} width={64} domain={["auto", "auto"]} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={legendStyle} />
                {runs.map((run, i) => (
                  <Line
                    key={run.id}
                    type="monotone"
                    dataKey={`${i}-rho`}
                    name={run.name}
                    stroke={COLORS[i]}
                    dot={false}
                    strokeWidth={2}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </details>
    </div>
  );
}
