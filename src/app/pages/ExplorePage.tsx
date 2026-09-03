import { useState } from "react";
import { calculateInstantaneousTransfer } from "../../model";
import { EquationBlock, TextLink } from "../components/InsightCard";
import { PageIntro, PageShell, Section } from "../components/PageShell";
import { scaleTransferArrow, TRANSFER_RATE_MAXIMA } from "./transfer-visual";
// TODO: QA the equations against the model
// TODO: What is the difference the Transfer arrows labels and the 'Per-droplet totals at this instant'? Why are they different numbers?
// TODO: Format the equations blocks better

export function ExplorePage() {
  return (
    <PageShell>
      <PageIntro index="02 — Explore the physics" title="See the mechanisms">
        <p>
          These visuals isolate individual ideas. They are not the full transient solver — for coupled air and droplet
          histories, <TextLink to="/simulator">run the simulator</TextLink>.
        </p>
      </PageIntro>
      <Section kicker="Interactive" title="Droplet heat and mass transfer">
        <DropletTransfer />

        <p className="pt-6">
          Explaination of the equations that drive the model:
        </p>
        <EquationBlock
          label="Vapor / mass transfer"
          formula="m″ = K_mass(ρ_wv − ρ_knd); K_mass = Sh·δₐ/d;  ṁ_v/m_d = −S_d·m″/m_d"
          legend={[
            { symbol: "Sh", meaning: "2 + 0.6·Gr_m^0.25·Sc^0.33" },
            { symbol: "S_d", meaning: "Droplet area, πd²" },
            { symbol: "m_d", meaning: "Droplet mass, ρ_water·πd³/6" },
            { symbol: "ρ_knd", meaning: "Kelvin-corrected vapor density at the surface" },
          ]}
        />
        <EquationBlock
          label="Latent heat drawn from air"
          formula="q̇_lat,air/m_d = −Lᵥ·S_d·m″/m_d"
          legend={[
            { symbol: "Lᵥ", meaning: "Latent heat from the model's temperature-dependent expression" },
            { symbol: "m″ < 0", meaning: "Evaporation: latent demand from the surrounding air" },
            { symbol: "m″ > 0", meaning: "Condensation: latent heat direction reverses" },
          ]}
        />
        <EquationBlock
          label="Convective heat transfer"
          formula="q̇_conv/m_d = h_cv·S_d·(T_air − T_drop)/m_d;  h_cv = Nu·k_air/d"
          legend={[
            { symbol: "Nu", meaning: "2 + 0.6·Gr_t^0.25·Pr^0.33" },
            { symbol: "k_air", meaning: "Model air thermal conductivity" },
            { symbol: "T_air − T_drop", meaning: "Signed temperature driving force" },
          ]}
        />
      </Section>
    </PageShell>
  );
}

function DropletTransfer() {
  const [airTemperature, setAirTemperature] = useState(100);
  const [waterTemperature, setWaterTemperature] = useState(60);
  const [diameter, setDiameter] = useState(8);
  const [relativeHumidity, setRelativeHumidity] = useState(20);
  const [animate, ] = useState(true);

  const transfer = calculateInstantaneousTransfer({
    airTemperatureF: airTemperature,
    dropletTemperatureF: waterTemperature,
    dropletDiameterUm: diameter,
    relativeHumidityPercent: relativeHumidity,
  });
  const radius = 26 + ((diameter - 8) / (60 - 8)) * 24;
  const vapor = transfer.vaporMassRatePerDropletMass;
  const latent = transfer.latentHeatFromAirRatePerDropletMass;
  const convection = transfer.convectiveHeatRatePerDropletMass;

  return (
    <div className="rounded-lg border border-line bg-panel p-5 mb-3">
      <p className="max-w-3xl text-sm leading-6 text-muted">
        Arrow lengths are linear in the instantaneous model rate per kilogram of droplet. Each mechanism has its own
        fixed scale because mass transfer and heat transfer use different units.
      </p>

      <div className="mt-6 grid gap-8 xl:grid-cols-[minmax(0,1fr)_18rem] xl:items-center">
        <svg
          viewBox="0 0 560 300"
          className="h-auto min-h-64 w-full"
          role="img"
          aria-label="Droplet diagram showing signed vapor, latent heat, and convective heat transfer vectors"
        >
          <defs>
            <marker id="mass-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <path d="M0,0 L7,3.5 L0,7 Z" fill="#4fd1d9" />
            </marker>
            <marker id="latent-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <path d="M0,0 L7,3.5 L0,7 Z" fill="#c5a572" />
            </marker>
            <marker id="convection-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <path d="M0,0 L7,3.5 L0,7 Z" fill="#e08a4a" />
            </marker>
            <radialGradient id="droplet-fill">
              <stop offset="0" stopColor="#4fd1d9" stopOpacity="0.38" />
              <stop offset="1" stopColor="#4fd1d9" stopOpacity="0.14" />
            </radialGradient>
          </defs>

          <circle cx="280" cy="145" r={radius + 16} fill="none" stroke="#2a3340" strokeDasharray="3 7" />
          <TransferArrow angle={0} radius={radius} length={scaleTransferArrow(vapor, TRANSFER_RATE_MAXIMA.vapor)} towardDroplet={vapor < 0} color="#4fd1d9" marker="mass-arrow" animate={animate} />
          <TransferArrow angle={-145} radius={radius} length={scaleTransferArrow(latent, TRANSFER_RATE_MAXIMA.latent)} towardDroplet={latent > 0} color="#c5a572" marker="latent-arrow" animate={animate} />
          <TransferArrow angle={145} radius={radius} length={scaleTransferArrow(convection, TRANSFER_RATE_MAXIMA.convection)} towardDroplet={convection > 0} color="#e08a4a" marker="convection-arrow" animate={animate} />

          <circle cx="280" cy="145" r={radius} fill="url(#droplet-fill)" stroke="#4fd1d9" strokeWidth="1.5" />
          <text x="280" y="140" textAnchor="middle" fill="#e8e4d9" fontFamily="IBM Plex Mono" fontSize="14">
            {diameter} μm
          </text>
          <text x="280" y="160" textAnchor="middle" fill="#8b93a7" fontFamily="IBM Plex Mono" fontSize="12">
            {waterTemperature}°F water
          </text>

          <VectorLabel x={390} y={110} color="#4fd1d9" title={directionLabel(vapor, "Vapor out", "Condensation in")} value={`${formatSigned(vapor)} s⁻¹`} anchor="start" />
          <VectorLabel x={142} y={36} color="#c5a572" title={directionLabel(latent, "Latent heat from air", "Latent heat to air")} value={`${formatSigned(latent)} W/kg drop`} anchor="middle" />
          <VectorLabel x={140} y={248} color="#e08a4a" title={directionLabel(convection, "Convection from air", "Convection to air")} value={`${formatSigned(convection)} W/kg drop`} anchor="middle" />
        </svg>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
          <ControlSlider label="Air temperature" value={airTemperature} unit="°F" min={40} max={140} onChange={setAirTemperature} />
          <ControlSlider label="Water temperature" value={waterTemperature} unit="°F" min={32} max={212} onChange={setWaterTemperature} />
          <ControlSlider label="Droplet diameter" value={diameter} unit="μm" min={5} max={60} onChange={setDiameter} />
          <ControlSlider label="Relative humidity" value={relativeHumidity} unit="%" min={0} max={100} onChange={setRelativeHumidity} />
        </div>
      </div>

      <div className="mt-6 rounded border border-line bg-ink/40 px-4 py-3">
        <p className="font-mono text-xs tracking-widest text-muted">Per-droplet totals at this instant</p>
        <dl className="mt-2 grid gap-2 text-sm sm:grid-cols-3">
          <RateReadout label="Vapor" value={transfer.vaporMassRate} unit="kg/s" />
          <RateReadout label="Latent from air" value={transfer.latentHeatFromAirRate} unit="W" />
          <RateReadout label="Convection" value={transfer.convectiveHeatRate} unit="W" />
        </dl>
      </div>

      <p className="mt-5 text-sm leading-6 text-muted">
        Positive values follow the labeled arrow direction. Negative values reverse it. Smaller droplets generally
        show a much stronger response per unit mass because surface area scales with d² while droplet mass scales with
        d³. The equations below are the same expressions evaluated inside each transient-model timestep.
      </p>
    </div>
  );
}

function TransferArrow({ angle, radius, length, towardDroplet, color, marker, animate }: { angle: number; radius: number; length: number; towardDroplet: boolean; color: string; marker: string; animate: boolean }) {
  if (length < 0.1) return null;
  const radians = (angle * Math.PI) / 180;
  const point = (distance: number) => ({ x: 280 + Math.cos(radians) * distance, y: 145 + Math.sin(radians) * distance });
  const inner = point(radius + 10);
  const outer = point(radius + 10 + length);
  const start = towardDroplet ? outer : inner;
  const end = towardDroplet ? inner : outer;

  return <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke={color} strokeWidth="2.5" strokeLinecap="round" markerEnd={`url(#${marker})`} className={animate ? "animate-pulse" : undefined} />;
}

function VectorLabel({ x, y, color, title, value, anchor }: { x: number; y: number; color: string; title: string; value: string; anchor: "start" | "middle" }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fill={color} fontFamily="IBM Plex Mono" fontSize="12">
      <tspan x={x}>{title}</tspan>
      <tspan x={x} dy="17" fill="#e8e4d9">{value}</tspan>
    </text>
  );
}

function ControlSlider({ label, value, unit, min, max, onChange }: { label: string; value: number; unit: string; min: number; max: number; onChange: (value: number) => void }) {
  const id = `droplet-transfer-${label.toLowerCase().replaceAll(" ", "-")}`;
  return (
    <label htmlFor={id} className="block">
      <span className="flex items-baseline justify-between gap-3">
        <span className="text-sm text-cream/90">{label}</span>
        <output htmlFor={id} className="font-mono text-sm text-gold">{value} {unit}</output>
      </span>
      <input id={id} type="range" min={min} max={max} value={value} onChange={(event) => onChange(Number(event.target.value))} className="mt-3" />
    </label>
  );
}

function RateReadout({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div>
      <dt className="text-muted">{label}</dt>
      <dd className="font-mono text-cream">{formatSigned(value)} {unit}</dd>
    </div>
  );
}

function directionLabel(value: number, positive: string, negative: string): string {
  if (Math.abs(value) < 1e-12) return "Equilibrium";
  return value > 0 ? positive : negative;
}

function formatSigned(value: number): string {
  if (Math.abs(value) < 1e-12) return "0";
  return `${value > 0 ? "+" : "−"}${Math.abs(value).toExponential(2)}`;
}
