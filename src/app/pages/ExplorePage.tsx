import { useState } from "react";
import { EquationBlock, TextLink } from "../components/InsightCard";
import { PageIntro, PageShell, Section } from "../components/PageShell";

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
      </Section>
      <Section title="Surface area versus diameter">
        <p>
          Mass scales with d³; surface area scales with d². Halving diameter increases area per unit mass by a factor
          of two. That is why atomization quality dominates residence-time-limited fogging, and why a few large
          droplets in the Dv90 tail can still reach the compressor.
        </p>
        <AreaDemo />
      </Section>
    </PageShell>
  );
}

function DropletTransfer() {
  const [size, setSize] = useState(40);
  const [animate, setAnimate] = useState(true);
  const r = 18 + size * 0.55;

  return (
    <div className="rounded-lg border border-line bg-panel p-5">
      <p className="font-mono text-sm tracking-widest text-gold">Interactive: droplet heat & mass transfer</p>
      <div className="mt-4 grid gap-8 md:grid-cols-[1fr_14rem] md:items-center">
        <svg viewBox="0 0 420 220" className="h-56 w-full text-cream" role="img" aria-label="Droplet with heat and vapor arrows">
          <defs>
            <marker id="heat" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#e08a4a" />
            </marker>
            <marker id="vapor" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#4fd1d9" />
            </marker>
          </defs>
          {[0, 1, 2].map((i) => (
            <line
              key={`h${i}`}
              x1="40"
              y1={70 + i * 40}
              x2={210 - r - 8}
              y2={110}
              stroke="#e08a4a"
              strokeDasharray="6 5"
              markerEnd="url(#heat)"
              className={animate ? "animate-pulse" : ""}
            />
          ))}
          {[0, 1, 2].map((i) => (
            <line
              key={`v${i}`}
              x1={210 + r + 8}
              y1={110}
              x2="380"
              y2={70 + i * 40}
              stroke="#4fd1d9"
              strokeDasharray="5 4"
              markerEnd="url(#vapor)"
              className={animate ? "animate-pulse" : ""}
            />
          ))}
          <circle cx="210" cy="110" r={r} fill="#4fd1d9" fillOpacity="0.25" stroke="#4fd1d9" />
          <text x="210" y="114" textAnchor="middle" fill="#e8e4d9" fontFamily="IBM Plex Mono" fontSize="14">
            {size}μm
          </text>
          <text x="70" y="48" fill="#e08a4a" fontFamily="IBM Plex Mono" fontSize="14">
            Q_conv
          </text>
          <text x="330" y="48" fill="#4fd1d9" fontFamily="IBM Plex Mono" fontSize="14">
            vapor
          </text>
          <text x="210" y="200" textAnchor="middle" fill="#8b93a7" fontFamily="IBM Plex Mono" fontSize="14">
            T_drop → T_wb
          </text>
        </svg>
        <div>
          <p className="font-mono text-sm text-gold">Droplet size: {size} μm</p>
          <input
            type="range"
            min={8}
            max={60}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="mt-3"
          />
          <label className="mt-4 flex items-center gap-2 font-mono text-sm text-muted">
            <input type="checkbox" checked={animate} onChange={(e) => setAnimate(e.target.checked)} />
            Animate transfer
          </label>
        </div>
      </div>
      <p className="mt-4 text-sm text-muted">
        Warm air transfers heat to the droplet (convection). The droplet evaporates, releasing vapor — cooling both
        droplet and air. Larger droplets present more area in this drawing, but less area per unit mass.
      </p>
      <div className="mt-6">
        <EquationBlock
          label="Mass transfer rate (Sh = 2, stagnant sphere)"
          formula="ṁ = −π · d · Dᵥ · Sh · (ρ_vs − ρ_v∞)"
          legend={[
            { symbol: "ρ_vs", meaning: "Saturation vapor density at the droplet surface" },
            { symbol: "ρ_v∞", meaning: "Vapor density in bulk air" },
          ]}
        />
      </div>
    </div>
  );
}

function AreaDemo() {
  const [d, setD] = useState(20);
  const areaPerMass = (30 / d).toFixed(2);
  return (
    <div className="rounded-lg border border-line bg-panel p-5">
      <p className="font-mono text-sm text-gold">Relative area / mass vs 30 μm reference</p>
      <input
        type="range"
        min={8}
        max={50}
        value={d}
        onChange={(e) => setD(Number(e.target.value))}
        className="mt-4"
      />
      <p className="mt-3 font-mono text-sm text-cream">
        d = {d} μm → A/m ≈ {areaPerMass}× the 30 μm droplet
      </p>
      <p className="mt-2 text-sm text-muted">
        Load the <TextLink to="/simulator?preset=small-droplets">small-droplet preset</TextLink> to see this in the
        transient solver.
      </p>
    </div>
  );
}
