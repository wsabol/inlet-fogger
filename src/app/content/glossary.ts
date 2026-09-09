export const GLOSSARY = {
  "gas-turbine": {
    term: "Gas turbine",
    href: "/how-it-works#inlet-temperature",
    meaning: "A continuous-flow engine in which a compressor pressurizes inlet air, fuel is burned in that air, and expanding hot gas drives a turbine. Inlet-air conditions affect the mass flow the compressor can take in and the power the machine can produce.",
  },
  "evaporative-cooling": {
    term: "Evaporative cooling",
    href: "/how-it-works#evaporation",
    meaning: "Cooling that occurs when liquid water absorbs energy from its surroundings as it changes into vapor. Cooling is limited by the available water and the air's approach to saturation.",
  },
  "evaporative-potential": {
    term: "Evaporative potential",
    href: "/how-it-works#psychrometrics",
    meaning: "The difference between dry-bulb and wet-bulb temperature, indicating the maximum ideal temperature reduction available from evaporative cooling at the current air conditions.",
  },
  "dry-bulb": {
    term: "Dry-bulb temperature",
    href: "/how-it-works#psychrometrics",
    meaning: "The ordinary air temperature, measured with a dry thermometer.",
  },
  "wet-bulb": {
    term: "Wet-bulb temperature",
    href: "/how-it-works#psychrometrics",
    meaning: "The lowest temperature air can reach by evaporating water at the current humidity.",
  },
  "relative-humidity": {
    term: "Relative humidity",
    href: "/how-it-works#psychrometrics",
    meaning: "How close the air already is to saturation, expressed as a percentage.",
  },
  smd: {
    term: "SMD / D32",
    href: "/how-it-works#droplet-size",
    meaning: "Sauter mean diameter — a representative droplet size with the same volume-to-surface ratio as the spray.",
  },
  dv90: {
    term: "Dv90",
    href: "/how-it-works#droplet-size",
    meaning: "Diameter below which 90% of the spray volume lies; the large tail most likely to reach the compressor.",
  },
  "residence-time": {
    term: "Residence time",
    href: "/how-it-works#residence-time",
    meaning: "Time available between the fog grid and the compressor inlet, typically on the order of 1–1.5 s.",
  },
  overspray: {
    term: "Overspray",
    href: "/how-it-works#overspray",
    meaning: "Liquid water that still exists when the airstream reaches the compressor inlet.",
  },
  "wet-compression": {
    term: "Wet compression",
    href: "/how-it-works#overspray",
    meaning: "Evaporation of remaining liquid inside the compressor, which this educational model does not simulate.",
  },
  "liquid-fallout": {
    term: "Liquid fallout",
    href: "/guide#fallout",
    meaning: "Droplets that drop out of the airstream onto ducts, filters, or drains rather than evaporating.",
  },
  "latent-heat": {
    term: "Latent-heat",
    href: "/how-it-works#evaporation",
    meaning: "The energy absorbed as liquid becomes vapor.",
  },
  "convection": {
    term: "Convection",
    href: "/how-it-works#evaporation",
    meaning: "The transfer of heat between fluids of different temperatures.",
  },
  "knudsen-layer": {
    term: "Knudsen layer",
    href: "/how-it-works#evaporation",
    meaning: "At the interface of a vapor and a liquid/solid, the gas interaction with the liquid/solid dominates the gas behavior, and the gas is, very locally, not in equilibrium. This region, several mean free path lengths thick, is called the Knudsen layer.",
  },
  "lumped-capacitance": {
    term: "Lumped capacitance",
    href: "/how-it-works#lumped-capacitance",
    meaning: "A heat-transfer approximation that represents each modeled body or fluid region with one uniform temperature, neglecting temperature gradients within it.",
  },
  "ideal-gas": {
    term: "Ideal gas",
    href: "/how-it-works#ideal-gas",
    meaning: "A theoretical gas that follows the ideal gas law. The model treats air this way as an approximation when calculating selected humid-air properties.",
  },
} as const;

export type GlossaryId = keyof typeof GLOSSARY;
