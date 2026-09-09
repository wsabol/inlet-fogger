export const TRANSFER_ARROW_MAX_LENGTH = 250;

// Rounded-up maxima from the complete integer slider grid, keeping one fixed linear scale per vector.
export const TRANSFER_RATE_MAXIMA = {
  vapor: 2.2e3, // 835,
  latent: 5.3e9, // 2.1e9,
  convection: 11.9e8, // 4.75e8,
} as const;

export function scaleTransferArrow(value: number, maximum: number): number {
  if (!Number.isFinite(value) || maximum <= 0) return 0;
  return Math.min(Math.abs(value) / maximum, 1) * TRANSFER_ARROW_MAX_LENGTH;
}
