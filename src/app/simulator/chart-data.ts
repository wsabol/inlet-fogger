export type TimedPoint = {
  time: number;
};

export type ChartRow = Record<string, number>;

/**
 * Merge multiple time series without inventing samples for another series.
 * Missing values are left absent so Recharts can connect each line's own real
 * samples without drawing it beyond its natural endpoint.
 */
export function mergeSeries<T extends TimedPoint>(
  seriesByRun: readonly (readonly T[])[],
  pick: (point: T, runIndex: number) => Record<string, number>,
): ChartRow[] {
  const rows = new Map<number, ChartRow>();

  seriesByRun.forEach((series, runIndex) => {
    for (const point of series) {
      const row = rows.get(point.time) ?? { time: point.time };
      Object.assign(row, pick(point, runIndex));
      rows.set(point.time, row);
    }
  });

  return [...rows.values()].sort((a, b) => a.time - b.time);
}

export function longestSeriesTime(seriesByRun: readonly (readonly TimedPoint[])[]): number {
  let maxTime = 0;
  for (const series of seriesByRun) {
    for (const point of series) maxTime = Math.max(maxTime, point.time);
  }
  return maxTime;
}

export function timeTicks(maxTime: number, targetTickCount = 8): number[] {
  if (!(maxTime > 0)) return [0];

  const rawStep = maxTime / Math.max(1, targetTickCount - 1);
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const normalized = rawStep / magnitude;
  const niceNormalized = normalized < 1.5 ? 1 : normalized < 3 ? 2 : normalized < 7 ? 5 : 10;
  const step = niceNormalized * magnitude;
  const ticks: number[] = [];

  for (let tick = 0; tick < maxTime; tick += step) {
    ticks.push(Number(tick.toPrecision(12)));
  }

  const lastTick = ticks[ticks.length - 1];
  if (lastTick === undefined || Math.abs(lastTick - maxTime) > step * 1e-9) ticks.push(maxTime);
  return ticks;
}
