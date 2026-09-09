type Comparison = {
    title: string;
    rows: Array<{
        property: string;
        actual: string|number;
        simulated: string|number;
        unit: string;
    }>;
};

export const COMPARISONS: Comparison[] = [
    {
        title: "Table 3. Turbine Comparison 1",
        rows: [
        { property: "Initial Air Temperature", actual: "79.6", simulated: "79.6", unit: " °F" },
        { property: "Wet Bulb Temperature", actual: "68.9", simulated: "68.9", unit: " °F" },
        { property: "Water Flow Rate", actual: "~26.3", simulated: "26.3", unit: " gpm" },
        { property: "Initial Water Temperature", actual: "195", simulated: "195", unit: " °F" },
        { property: "Load", actual: "98", simulated: "98", unit: "%" },
        { property: "Final Air Temperature", actual: "71.7", simulated: "70.76", unit: " °F" },
        ],
    },
    {
        title: "Table 4. Turbine Comparison 2",
        rows: [
        { property: "Initial Air Temperature", actual: "80.7", simulated: "80.7", unit: " °F" },
        { property: "Wet Bulb Temperature", actual: "68.6", simulated: "68.6", unit: " °F" },
        { property: "Water Flow Rate", actual: "27.1", simulated: "27.1", unit: " gpm" },
        { property: "Initial Water Temperature", actual: "212", simulated: "212", unit: " °F" },
        { property: "Load", actual: "98", simulated: "98", unit: "%" },
        { property: "Final Air Temperature", actual: "72.4", simulated: "71.61", unit: " °F" },
        ],
    },
    {
        title: "Table 5. Turbine Comparison 3",
        rows: [
        { property: "Initial Air Temperature", actual: "81.6", simulated: "81.6", unit: " °F" },
        { property: "Wet Bulb Temperature", actual: "69.0", simulated: "69.0", unit: " °F" },
        { property: "Water Flow Rate", actual: "~25.6", simulated: "25.6", unit: " gpm" },
        { property: "Initial Water Temperature", actual: "204", simulated: "204", unit: " °F" },
        { property: "Load", actual: "98", simulated: "98", unit: "%" },
        { property: "Final Air Temperature", actual: "73.0", simulated: "72.90", unit: " °F" },
        ],
    },
    {
        title: "Table 6. Turbine Comparison 4",
        rows: [
        { property: "Initial Air Temperature", actual: "79.3", simulated: "79.3", unit: " °F" },
        { property: "Wet Bulb Temperature", actual: "67.6", simulated: "67.6", unit: " °F" },
        { property: "Water Flow Rate", actual: "~24.4", simulated: "24.4", unit: " gpm" },
        { property: "Initial Water Temperature", actual: "204", simulated: "204", unit: " °F" },
        { property: "Load", actual: "99", simulated: "99", unit: "%" },
        { property: "Final Air Temperature", actual: "71.7", simulated: "71.10", unit: " °F" },
        ],
    },
    {
        title: "Table 7. Turbine Comparison 5",
        rows: [
        { property: "Initial Air Temperature", actual: "63.6", simulated: "63.6", unit: " °F" },
        { property: "Wet Bulb Temperature", actual: "53.3", simulated: "53.3", unit: " °F" },
        { property: "Water Flow Rate", actual: "15.5", simulated: "15.5", unit: " gpm" },
        { property: "Initial Water Temperature", actual: "84", simulated: "84", unit: " °F" },
        { property: "Load", actual: "94", simulated: "94", unit: "%" },
        { property: "Final Air Temperature", actual: "56.7", simulated: "57.15", unit: " °F" },
        ],
    },
];