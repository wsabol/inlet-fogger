import { useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ScenarioRun } from "./useSimulation";
import { round } from "../../model/types";
import { longestSeriesTime, mergeSeries, timeTicks } from "./chart-data";

const COLORS = ["#c5a572", "#4fd1d9", "#9eb6d4"];

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

function formatSignedPercent(value: number): string {
  const rounded = round(value, 1);
  return `${rounded > 0 ? "+" : ""}${rounded}%`;
}

export function SimulatorCharts({ runs }: { runs: ScenarioRun[] }) {
  const [showDensity, setShowDensity] = useState(false);
  if (runs.length === 0) return null;

  const seriesByRun = runs.map((run) => run.result.series);

  const tempData = mergeSeries(seriesByRun, (p, i) => ({
    [`${i}-air`]: p.airTempF,
    [`${i}-drop`]: p.dropletTempF,
  }));
  const rhData = mergeSeries(seriesByRun, (p, i) => ({ [`${i}-rh`]: p.rhPercent }));
  const dData = mergeSeries(seriesByRun, (p, i) => ({ [`${i}-d`]: p.dropletUm }));
  const densData = mergeSeries(seriesByRun, (p, i) => {
    const initialDensity = runs[i].result.series[0]?.density ?? p.density;
    const percentChange = initialDensity === 0 ? 0 : ((p.density - initialDensity) / initialDensity) * 100;
    return { [`${i}-rho`]: percentChange };
  });
  const maxTime = longestSeriesTime(seriesByRun);
  const ticks = timeTicks(maxTime);
  const timeAxis = { domain: [0, maxTime] as [number, number], ticks, allowDataOverflow: true };

  return (
    <div className="space-y-4">
      <ChartFrame title="Temperature vs. time">
        <ResponsiveContainer>
          <LineChart data={tempData}>
            <CartesianGrid {...grid} />
            <XAxis dataKey="time" tick={axis} tickFormatter={(v) => `${round(v, 1)}s`} {...timeAxis} />
            <YAxis tick={axis} unit="°F" width={56} domain={[30, "auto"]} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={legendStyle} />
            {runs.map((run, i) => (
              <Line
                key={`${run.id}-air`}
                type="monotone"
                dataKey={`${i}-air`}
                name={`${run.name} air`}
                stroke={COLORS[i]}
                dot={false}
                connectNulls
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
                connectNulls
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
              <XAxis dataKey="time" tick={axis} tickFormatter={(v) => `${round(v, 1)}s`} {...timeAxis} />
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
                  connectNulls
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
              <XAxis dataKey="time" tick={axis} tickFormatter={(v) => `${round(v, 1)}s`} {...timeAxis} />
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
                  connectNulls
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartFrame>
      </div>
      <details className="rounded-lg border border-line bg-panel p-4" open={showDensity} onToggle={(e) => setShowDensity((e.target as HTMLDetailsElement).open)}>
        <summary className="cursor-pointer font-mono text-sm tracking-widest text-muted">
          Air density change vs. time (advanced)
        </summary>
        {showDensity && (
          <p className="my-3 text-sm text-muted">Increases in air density are the closest corrolate to effects of turbine output.</p>
        )}
        {showDensity && (
          <div className="mt-3 h-72">
            <ResponsiveContainer>
              <LineChart data={densData}>
                <CartesianGrid {...grid} />
                <XAxis dataKey="time" tick={axis} tickFormatter={(v) => `${round(v, 1)}s`} {...timeAxis} />
                <YAxis
                  tick={axis}
                  width={72}
                  domain={["auto", "auto"]}
                  tickFormatter={formatSignedPercent}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => formatSignedPercent(Number(value))}
                />
                <Legend wrapperStyle={legendStyle} />
                {runs.map((run, i) => (
                  <Line
                    key={run.id}
                    type="monotone"
                    dataKey={`${i}-rho`}
                    name={run.name}
                    stroke={COLORS[i]}
                    dot={false}
                    connectNulls
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
