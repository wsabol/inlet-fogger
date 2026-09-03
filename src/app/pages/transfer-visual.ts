export const TRANSFER_ARROW_MAX_LENGTH = 112;

// Rounded-up maxima from the complete integer slider grid, keeping one fixed linear scale per vector.
export const TRANSFER_RATE_MAXIMA = {
  vapor: 750, // 835,
  latent: 1.5e9, // 2.1e9,
  convection: 3.6e8, // 4.75e8,
} as const;

export function scaleTransferArrow(value: number, maximum: number): number {
  if (!Number.isFinite(value) || maximum <= 0) return 0;
  return Math.min(Math.abs(value) / maximum, 1) * TRANSFER_ARROW_MAX_LENGTH;
}
