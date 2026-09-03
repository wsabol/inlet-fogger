import type { ModelInputs, ModelResult, SeriesPoint, StopReason } from "./types";
import {
  CHART_STRIDE,
  DELTA_T,
  REFERENCE_AIRFLOW_PPH,
  T_MAX,
  fahrenheitToKelvin,
  kelvinToFahrenheit,
  round,
} from "./types";
import { calculateTransferState } from "./transfer";
export { saturationVaporPressure } from "./transfer";

const K_BOLTZMANN = 1.3806505e-23;

/**
 * Transient droplet / humid-air solver ported from mee_funct.m via the recovered JS implementation.
 *
 * Input temperatures are °F. RH is a fraction 0–1. Load is a fraction 0–1. Flow is gpm.
 */
export function calculateFogModel(inputs: ModelInputs): ModelResult {
  const { Td_0, Ta_0, load, Dd0 } = inputs;
  let { flow_water, RH } = inputs;

  if (Ta_0 > 140 || Ta_0 < 40) {
    throw new Error(
      `Air temperature of ${Ta_0} °F is out of bounds. Enter an inlet dry-bulb between 40 and 140 °F.`,
    );
  }
  if (!(RH >= 0 && RH <= 1)) {
    throw new Error("Relative humidity must be between 0 and 100%.");
  }
  if (!(flow_water > 0)) {
    throw new Error("Water flow rate must be greater than zero.");
  }
  if (!(Dd0 > 0)) {
    throw new Error("Droplet diameter must be greater than zero.");
  }
  if (!(load > 0)) {
    throw new Error("Turbine load must be greater than zero.");
  }

  flow_water = flow_water * 8.34 * 60;
  const flow_air = REFERENCE_AIRFLOW_PPH * load;
  const mixing_ratio = flow_water / flow_air;

  let Ta = fahrenheitToKelvin(Ta_0);
  let Td = fahrenheitToKelvin(Td_0);
  let Dd = Dd0 * 1e-6;
  let s_air = 0;
  let s_drp = 0;
  let h_air = 0;
  let h_drp = 0;
  const initialTransfer = calculateTransferState({
    airTemperatureK: Ta,
    dropletTemperatureK: Td,
    dropletDiameterM: Dd,
    relativeHumidity: RH,
  });
  let md = initialTransfer.dropletMass;
  let ma = md / mixing_ratio;

  let Psat = initialTransfer.saturationVaporPressure;
  let Pvap = initialTransfer.vaporPressure;
  let SH = initialTransfer.specificHumidity;

  const time: number[] = [];
  const TaArr: number[] = [];
  const TdArr: number[] = [];
  const DdArr: number[] = [];
  const RHArr: number[] = [];
  const density: number[] = [];
  const QdArr: number[] = [];
  const QaArr: number[] = [];
  const AWBArr: number[] = [];

  let Ptot_prev = 0;
  let Qa = 0;
  let Qd = 0;
  let row0 = 1;
  let stopReason: StopReason = "residence-time";
  let t = 0;

  for (t = 0; t < T_MAX; t += DELTA_T) {
    const transfer = calculateTransferState({
      airTemperatureK: Ta,
      dropletTemperatureK: Td,
      dropletDiameterM: Dd,
      specificHumidity: SH,
    });
    const {
      saturationVaporPressure: currentPsat,
      vaporPressure: currentPvap,
      totalPressure: Ptot,
      dryAirMassFraction: c_a,
      vaporMassFraction: c_v,
      humidAirDensity: row,
      dryAirSpecificHeat: C_da,
      vaporSpecificHeat: C_wv,
      airSpecificHeat: Ca,
      waterDensity: row_water,
      dropletSurfaceArea: Sd,
      dropletMass: currentMd,
      latentHeat: Lv,
      dropletSpecificHeat: Cd,
      convectiveCoefficient: h_cv,
      massFlux: mass_flux,
    } = transfer;
    Psat = currentPsat;
    Pvap = currentPvap;
    md = currentMd;
    const m_da = c_a * ma;

    const AWB = (-Lv * mass_flux) / h_cv;

    if (t === 0) {
      Qd = Cd * Td;
      Qa = Ca * Ta;
      record(t, Td, Ta, Dd, RH, row, Qd, Qa, AWB);
      Ptot_prev = Ptot;
      row0 = row;
      continue;
    }

    const dmd = transfer.dropletMassRate;
    const dma = -Sd * mass_flux;
    const dC_da = 0.000804 * Ta - 0.2026;
    const dC_wv = 0.312;
    const dCd = -3 * 0.000099 * Td ** 2 + 2 * 0.10913 * Td - 39.178;

    const dTd =
      (h_cv * Sd * (Ta - Td) + Sd * Lv * mass_flux - dmd * Cd * Td) / (md * (Cd + dCd * Td));
    const dTa =
      (h_cv * Sd * (Td - Ta) - dma * Ta * (Ca + c_a * (C_wv - C_da))) /
      (ma * (Ca + Ta * (dC_da * c_a + dC_wv * c_v)));

    const dQd = dCd * dTd * Td + Cd * dTd;
    const dQa =
      ((dC_da * c_a + dC_wv * c_v) * dTa + (dma / m_da) * c_a ** 2 * (C_wv - C_da)) * Ta +
      Ca * dTa;
    const dP = (Ptot - Ptot_prev) / DELTA_T;
    const ds_d = dQd / Td;
    const ds_a = dQa / Ta;
    const dh_d = Td * ds_d + dP / row_water;
    const dh_a = Ta * ds_a + dP / row;

    Td = Td + DELTA_T * dTd;
    const tempTa = Ta + DELTA_T * dTa;
    Ta = (tempTa * ma + Td * DELTA_T * dma) / (ma + DELTA_T * dma);
    md = md + DELTA_T * dmd;
    ma = ma + DELTA_T * dma;
    Qd = Qd + DELTA_T * dQd;
    Qa = Qa + DELTA_T * dQa;
    s_drp += DELTA_T * ds_d;
    s_air += DELTA_T * ds_a;
    h_drp += DELTA_T * dh_d;
    h_air += DELTA_T * dh_a;

    Dd = 2 * ((3 * md) / (4 * Math.PI * row_water)) ** (1 / 3);
    SH = (ma - m_da) / m_da;
    RH = Pvap / Psat;

    record(t, Td, Ta, Dd, RH, row, Qd, Qa, AWB);
    Ptot_prev = Ptot;

    const mfp =
      (K_BOLTZMANN * Td) / (Math.sqrt(2) * Math.PI * (2.75e-10) ** 2 * Ptot);
    const Kn = (2 * mfp) / Dd;
    if (Kn > 0.08) {
      stopReason = "continuum-limit";
      break;
    }

    if (TaArr.length > 500) {
      const l = TaArr.length - 1;
      if (TaArr[l] === TaArr[l - 500] && DdArr[l] === DdArr[l - 500]) {
        stopReason = "equilibrium";
        break;
      }
    }
  }

  function record(
    timeS: number,
    TdK: number,
    TaK: number,
    DdM: number,
    rhFrac: number,
    row: number,
    QdVal: number,
    QaVal: number,
    awb: number,
  ) {
    time.push(round(timeS, 4));
    TdArr.push(round(kelvinToFahrenheit(TdK), 2));
    TaArr.push(round(kelvinToFahrenheit(TaK), 2));
    DdArr.push(round(1e6 * DdM, 2));
    RHArr.push(round(100 * rhFrac, 2));
    density.push(round(row, 6));
    QdArr.push(round(QdVal, 2));
    QaArr.push(round(QaVal, 2));
    AWBArr.push(round(100 * awb, 2));
  }

  const last = time.length - 1;
  const series: SeriesPoint[] = [];
  for (let i = 0; i < time.length; i++) {
    if (i % CHART_STRIDE === 0 || i === last) {
      series.push({
        time: time[i],
        airTempF: TaArr[i],
        dropletTempF: TdArr[i],
        dropletUm: DdArr[i],
        rhPercent: RHArr[i],
        density: round(density[i], 4),
        convection: QaArr[i],
        evaporation: QdArr[i],
      });
    }
  }

  const initialD = DdArr[0];
  const finalD = DdArr[last];
  const evaporatedFraction = initialD > 0 ? Math.max(0, Math.min(1, 1 - (finalD / initialD) ** 3)) : 0;

  return {
    timeEnd: time[last],
    finalAirTemperatureF: kelvinToFahrenheit(Ta),
    finalDropletTemperatureF: kelvinToFahrenheit(Td),
    finalDropletDiameterUm: Dd * 1e6,
    finalRelativeHumidityPercent: RHArr[last],
    finalAirDensity: density[last],
    initialAirDensity: row0,
    airDensityChange: (density[last] - row0) / row0,
    AWB: AWBArr[last],
    s_drp,
    s_air,
    h_drp,
    h_air,
    stopReason,
    evaporatedFraction,
    series,
  };
}
