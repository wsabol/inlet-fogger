type Comparison = {
  title: string;
  rows: Array<{
    property: string;
    actual: string;
    simulated: string;
  }>;
};

const COMPARISONS: Comparison[] = [
  {
    title: "Table 3. Turbine Comparison 1",
    rows: [
      { property: "Initial Air Temperature", actual: "79.6 °F", simulated: "79.6 °F" },
      { property: "Wet Bulb Temperature", actual: "68.9 °F", simulated: "68.9 °F" },
      { property: "Water Flow Rate", actual: "~26.3 gpm", simulated: "26.3 gpm" },
      { property: "Initial Water Temperature", actual: "195 °F", simulated: "195 °F" },
      { property: "Load", actual: "98%", simulated: "98%" },
      { property: "Final Air Temperature", actual: "71.7 °F", simulated: "70.76 °F" },
    ],
  },
  {
    title: "Table 4. Turbine Comparison 2",
    rows: [
      { property: "Initial Air Temperature", actual: "80.7 °F", simulated: "80.7 °F" },
      { property: "Wet Bulb Temperature", actual: "68.6 °F", simulated: "68.6 °F" },
      { property: "Water Flow Rate", actual: "27.1 gpm", simulated: "27.1 gpm" },
      { property: "Initial Water Temperature", actual: "212 °F", simulated: "212 °F" },
      { property: "Load", actual: "98%", simulated: "98%" },
      { property: "Final Air Temperature", actual: "72.4 °F", simulated: "71.61 °F" },
    ],
  },
  {
    title: "Table 5. Turbine Comparison 3",
    rows: [
      { property: "Initial Air Temperature", actual: "81.6 °F", simulated: "81.6 °F" },
      { property: "Wet Bulb Temperature", actual: "69.0 °F", simulated: "69.0 °F" },
      { property: "Water Flow Rate", actual: "~25.6 gpm", simulated: "25.6 gpm" },
      { property: "Initial Water Temperature", actual: "204 °F", simulated: "204 °F" },
      { property: "Load", actual: "98%", simulated: "98%" },
      { property: "Final Air Temperature", actual: "73.0 °F", simulated: "72.90 °F" },
    ],
  },
  {
    title: "Table 6. Turbine Comparison 4",
    rows: [
      { property: "Initial Air Temperature", actual: "79.3 °F", simulated: "79.3 °F" },
      { property: "Wet Bulb Temperature", actual: "67.6 °F", simulated: "67.6 °F" },
      { property: "Water Flow Rate", actual: "~24.4 gpm", simulated: "24.4 gpm" },
      { property: "Initial Water Temperature", actual: "204 °F", simulated: "204 °F" },
      { property: "Load", actual: "99%", simulated: "99%" },
      { property: "Final Air Temperature", actual: "71.7 °F", simulated: "71.10 °F" },
    ],
  },
  {
    title: "Table 7. Turbine Comparison 5",
    rows: [
      { property: "Initial Air Temperature", actual: "63.6 °F", simulated: "63.6 °F" },
      { property: "Wet Bulb Temperature", actual: "53.3 °F", simulated: "53.3 °F" },
      { property: "Water Flow Rate", actual: "15.5 gpm", simulated: "15.5 gpm" },
      { property: "Initial Water Temperature", actual: "84 °F", simulated: "84 °F" },
      { property: "Load", actual: "94%", simulated: "94%" },
      { property: "Final Air Temperature", actual: "56.7 °F", simulated: "57.15 °F" },
    ],
  },
];

export function ValidationComparisons() {
  return (
    <div>
      <div>
        <h2 id="field-validation-heading" className="font-serif text-2xl text-cream">
          Field validation
        </h2>
        <p className="mt-2">
          Five turbine operating points compare real-world readings with model output. Across these cases, the
          simulated final air temperature is within 1 °F of the measured value, with a mean absolute error of 0.58
          °F.
        </p>
      </div>

      <div className="grid gap-5">
        {COMPARISONS.map((comparison) => (
          <div key={comparison.title} className="overflow-hidden rounded-lg border border-line">
            <div className="border-b border-line bg-panel px-3 py-2 font-serif text-lg text-cream">
              {comparison.title}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[34rem] text-left text-sm">
                <thead className="bg-panel/60 font-mono text-xs uppercase tracking-wide text-muted">
                  <tr>
                    <th scope="col" className="w-1/2 px-3 py-2">
                      Property
                    </th>
                    <th scope="col" className="w-1/4 px-3 py-2 text-right">
                      Actual
                    </th>
                    <th scope="col" className="w-1/4 px-3 py-2 text-right">
                      Simulated
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.rows.map((row) => (
                    <tr key={row.property} className="border-t border-line">
                      <th scope="row" className="px-3 py-2 font-sans font-normal text-muted">
                        {row.property}
                      </th>
                      <td className="whitespace-nowrap px-3 py-2 text-right font-mono text-cream">{row.actual}</td>
                      <td className="whitespace-nowrap px-3 py-2 text-right font-mono text-gold">
                        {row.simulated}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
