import { useState } from "react";
import { calculateInstantaneousTransfer } from "../../model";
import { EquationBlock, EquationLine, MathFraction, MathVariable, TextLink } from "../components/InsightCard";
import { PageIntro, PageShell, Section } from "../components/PageShell";
import { scaleTransferArrow, TRANSFER_RATE_MAXIMA } from "./transfer-visual";

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
          Explanation of the equations that drive the model:
        </p>
        <EquationBlock
          label="Vapor / mass transfer"
          formula={
            <div className="space-y-2">
              <EquationLine>
                <MathVariable accent="dot" subscript="drop">m</MathVariable> = <MathVariable subscript="drop">S</MathVariable>
                <MathVariable subscript="mass">K</MathVariable>(<MathVariable subscript="wv">ρ</MathVariable> − <MathVariable subscript="knd">ρ</MathVariable>)
              </EquationLine>
              <EquationLine>
                <MathVariable subscript="mass">K</MathVariable> =
                <MathFraction
                  numerator={<><MathVariable>Sh</MathVariable> · <MathVariable subscript="air">δ</MathVariable></>}
                  denominator={<MathVariable>d</MathVariable>}
                />
              </EquationLine>
              <EquationLine>
                <MathVariable subscript="air">δ</MathVariable>{" = 2.26e-5 · "}
                <MathFraction
                  numerator={<>101325 · <MathVariable subscript="air">T</MathVariable></>}
                  denominator={<>273.15 · <MathVariable subscript="total">P</MathVariable></>}
                />
              </EquationLine>
            </div>
          }
          legend={[
            { symbol: <MathVariable subscript="drop" accent="dot">m</MathVariable>, meaning: "Rate of mass transfer from the droplet to the air" },
            { symbol: <MathVariable subscript="drop">S</MathVariable>, meaning: <>Droplet surface area, π<MathVariable superscript="2">d</MathVariable></> },
            { symbol: <MathVariable subscript="mass">K</MathVariable>, meaning: "Mass diffusion coefficient" },
            { symbol: <MathVariable subscript="wv">ρ</MathVariable>, meaning: "Density of water vapor in humid air" },
            { symbol: <MathVariable subscript="knd">ρ</MathVariable>, meaning: "Density of water vapor at the droplet surface (Knudsen layer)" },
            { symbol: <MathVariable>Sh</MathVariable>, meaning: <>Sherwood Number = 2 + 0.6 · <MathVariable subscript="m" superscript="0.25">Gr</MathVariable> · <MathVariable superscript="0.33">Sc</MathVariable></> },
            { symbol: <MathVariable>d</MathVariable>, meaning: "Diameter of the droplet" },
            { symbol: <MathVariable subscript="a">δ</MathVariable>, meaning: "Mass diffusivity for air" },
            { symbol: <MathVariable subscript="air">T</MathVariable>, meaning: "Air temperature" },
            { symbol: <MathVariable subscript="total">P</MathVariable>, meaning: "Air pressure = Partial pressures of water vapor and dry air" },
          ]}
        />
        <EquationBlock
          label="Latent heat drawn from air"
          formula={
            <EquationLine>
              <MathVariable subscript="lat" accent="dot">Q</MathVariable>
              = <MathVariable subscript="v">L</MathVariable><MathVariable subscript="drop" accent="dot">m</MathVariable>
            </EquationLine>
          }
          legend={[
            { symbol: <MathVariable subscript="lat" accent="dot">Q</MathVariable>, meaning: "Latent heat transfer rate" },
            { symbol: <MathVariable subscript="v">L</MathVariable>, meaning: "Latent heat of vaporization for water, derived from the Clausius-Clapeyron relation" },
            { symbol: <><MathVariable subscript="drop" accent="dot">m</MathVariable> &lt; 0</>, meaning: "Evaporation: latent demand from the surrounding air" },
            { symbol: <><MathVariable subscript="drop" accent="dot">m</MathVariable> &gt; 0</>, meaning: "Condensation: latent heat direction reverses" },
          ]}
        />
        <EquationBlock
          label="Convective heat transfer (Newton's Law of Cooling, no radiation)"
          formula={
            <div className="space-y-2">
              <EquationLine>
                <MathVariable subscript="conv" accent="dot">Q</MathVariable>
                = <MathVariable subscript="cv">h</MathVariable>
                  <MathVariable subscript="drop">S</MathVariable> (<MathVariable subscript="air">T</MathVariable> − <MathVariable subscript="drop">T</MathVariable>)
              </EquationLine>
              <EquationLine>
                <MathVariable subscript="cv">h</MathVariable> =
                <MathFraction
                  numerator={<><MathVariable>Nu</MathVariable> · <MathVariable subscript="air">k</MathVariable></>}
                  denominator={<MathVariable>d</MathVariable>}
                />
              </EquationLine>
            </div>
          }
          legend={[
            { symbol: <MathVariable subscript="conv" accent="dot">Q</MathVariable>, meaning: "Convective heat transfer rate" },
            { symbol: <MathVariable subscript="drop">m</MathVariable>, meaning: <>Droplet mass, <MathVariable subscript="water">ρ</MathVariable> · π<MathVariable superscript="3">d</MathVariable>/6</> },
            { symbol: <MathVariable subscript="cv">h</MathVariable>, meaning: <>Convective heat transfer coefficient, <MathVariable>Nu</MathVariable> · <MathVariable subscript="air">k</MathVariable> / <MathVariable>d</MathVariable></> },
            { symbol: <MathVariable>Nu</MathVariable>, meaning: <>Nusselt number, for natural convection = 2 + 0.6 · <MathVariable subscript="t" superscript="0.25">Gr</MathVariable> · <MathVariable superscript="0.33">Pr</MathVariable></> },
            { symbol: <MathVariable subscript="air">k</MathVariable>, meaning: "Thermal conductivity of air" },
            { symbol: <><MathVariable subscript="air">T</MathVariable> − <MathVariable subscript="drop">T</MathVariable></>, meaning: "Signed temperature driving force" },
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

          <VectorLabel x={390} y={110} color="#4fd1d9" title={directionLabel(vapor, "Vapor out", "Condensation in")} value={`${formatSigned(transfer.vaporMassRate)} kg/s`} anchor="start" />
          <VectorLabel x={142} y={36} color="#c5a572" title={directionLabel(latent, "Latent heat from air", "Latent heat to air")} value={`${formatSigned(transfer.latentHeatFromAirRate)} W drop`} anchor="middle" />
          <VectorLabel x={140} y={248} color="#e08a4a" title={directionLabel(convection, "Convection from air", "Convection to air")} value={`${formatSigned(transfer.convectiveHeatRate)} W drop`} anchor="middle" />
        </svg>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
          <ControlSlider label="Air temperature" value={airTemperature} unit="°F" min={40} max={140} onChange={setAirTemperature} />
          <ControlSlider label="Water temperature" value={waterTemperature} unit="°F" min={32} max={212} onChange={setWaterTemperature} />
          <ControlSlider label="Droplet diameter" value={diameter} unit="μm" min={5} max={60} onChange={setDiameter} />
          <ControlSlider label="Relative humidity" value={relativeHumidity} unit="%" min={0} max={100} onChange={setRelativeHumidity} />
        </div>
      </div>

      <div className="mt-6 rounded border border-line bg-ink/40 px-4 py-3">
        <p className="font-mono text-xs tracking-widest text-cyan">Per-droplet totals at this instant</p>
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
