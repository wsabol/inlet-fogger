/**
 * Fog Model Calculation Module
 * Converted from MATLAB script: mee_funct.m
 */

// Constants
const g = 9.80665; // m/s/s
const M_water = 0.01801528; // kg/mol water molar mass
const M_da = 0.0289652; // kg/mol dry air molar mass
const R = 8.314472; // J/mol/K
const k = 1.3806505e-23; // J/K // Boltzman Constant
const k_water = 0.58; // W/m/K

const round = (v, n = 0) => parseFloat(v.toFixed(n))

// Helper function to convert Celsius to Kelvin
const celsiusToKelvin = celsius => celsius + 273.15;

// Helper function to convert Fahrenheit to Kelvin
const fahrenheitToKelvin = fahrenheit => (5 / 9) * (fahrenheit - 32) + 273.15;

// Helper function to convert Kelvin to Celsius
const kelvinToCelsius = kelvin => kelvin - 273.15;

// Helper function to convert Kelvin to Fahrenheit
const kelvinToFahrenheit = kelvin => (9 / 5) * (kelvin - 273.15) + 32;

const gasLaw_Pressure = (density, temp, molar_mass) => density * R * temp / molar_mass;

const densityWater = T => 786.5 + 1.681 * T - 0.003272 * T**2;

const densityDryAir = T => 2.3723 - 0.00397 * T;

const saturationVaporPressure = T => 611.21*Math.exp((19.8428 - T/234.5) * (T-273.15) / (T-16.01))

/**
 * Gas Turbine Inlet Fogger Model - JavaScript Implementation
 * Converted from MATLAB function mee_funct
 *
 * @param {number} Td_0 - Initial droplet temperature (°F)
 * @param {number} Ta_0 - Initial air temperature (°F)
 * @param {number} flow_water - Water flow rate
 * @param {number} load - Turbine load (between 0 and 1)
 * @param {number} RH0 - Relative humidity or wet bulb temperature
 * @param {number} Dd0 - Initial droplet diameter (μm)
 * @returns {Object} Object containing all simulation results
 */
function calculateFogModel(Td_0, Ta_0, flow_water, load, RH0, Dd0) {

    // validate
    if (Ta_0 > 140 || Ta_0 < 40) {
        throw `Air Temperature of ${Ta_0} is out of bounds for this simulation. Please enter a reasonable ambient air temperature.`
    }

    flow_water = flow_water * 8.34 * 60;
    const flow_air = 3900000 * load; // pph
    const mixing_ratio = flow_water / flow_air; // water[mass] / air[mass]

    const delta_t = 0.0001;
    const t_max = 1.5;

    // Initial Conditions
    let Ta = fahrenheitToKelvin(Ta_0); // K
    let Td = fahrenheitToKelvin(Td_0); // K
    let Dd = Dd0 * 1e-6; // m
    let s_air = 0;
    let s_drp = 0;
    let h_air = 0;
    let h_drp = 0;
    let md = densityWater(Td) * 4/3 * Math.PI * (Dd/2)**3; // kg // initial mass of droplet
    let ma = md / mixing_ratio; // kg // initial mass of air
    let RH = RH0;

    // initial Psychrometrics
    let Psat = saturationVaporPressure(Ta)
    let row_da = densityDryAir(Ta); // kg/m^3 // density of dry air
    let Pda = gasLaw_Pressure(row_da, Ta, M_da); // partial pressure of dry air in humid air
    let Pvap = RH * Psat; // Pa, Partial pressure of water vapor
    let SH = 0.622 * Pvap / Pda; // absolute humidity

    /*let Psat = 611.21 * Math.exp((19.8428 - Ta/234.5) * (Ta-273.15) / (Ta-16.01)); // Pa // saturation vapor pressure // Arden Buck equation
    let Pvap = RH * Psat; // Pa // partial pressure of water in humid air
    let row_wv = Pvap * M_water / (R * Ta);
    let row_da = -0.0041845 * Ta + 2.4325; // kg/m^3
    let Pda = row_da * R * Ta / M_da; // partial pressure of dry air in humid air
    let SH = 0.622 * Pvap / Pda; // absolute humidity
    let c_a = 1 / (1 + SH); // mass concentration of dry air
    let c_v = 1 - c_a; // mass concentration of water vapor
    const row0 = c_a * row_da + c_v * row_wv; // kg/m^3 // density of wet air
    const m_da = c_a * ma; // kg // mass of dry air (non water compounds in air)
    let Ptot = Pvap + Pda;

    let C_da = 981 + 0.08 * Ta; // J/kg/K // specific heat of dry air
    let C_wv = 1772 + 0.312 * Ta; // J/kg/K // specific heat of water vapor
    let Ca = c_a * C_da + c_v * C_wv;
    let Cd = 2.628e-6 * (Td-273.15)**4 - 0.000651 * (Td-273.15)**3 + 0.0659 * (Td-273.15)**2 - 2.6567 * (Td-273.15) + 4214.5;
    let Qd = Cd * Td;
    let Qa = Ca * Ta;*/

    // Initialize arrays to store results
    let results = {
        time: [],
        Ta: [],
        Td: [],
        Dd: [],
        RH: [],
        density: [],
        specificHeat: [],
        Qd: [],
        Qa: [],
        AWB: [],
    }

    // Main simulation loop
    let t,
        Ptot_prev = 0,
        Qa = 0,
        Qd = 0,
        row0 = 1 // row, Ca, AWB, mass_flux, h_cv;

    for (t = 0; t < t_max; t += delta_t) {

        // Calculate air characteristics
        const k_air = (46.766 + 0.7143 * Ta) * 1e-4; // W/m/K // thermal conductivity
        const miu_air = 1.512e-6 * Ta**1.5 / (Ta + 120); // kg/m/s // dynamic viscosity
        const row_da = densityDryAir(Ta); // kg/m^3 // density of dry air
        const Pda = gasLaw_Pressure(row_da, Ta, M_da); // partial pressure of dry air in humid air

        // Psychrometrics
        const Psat = saturationVaporPressure(Ta); // Pa, saturation vapor pressure
        const Pvap = SH * Pda / 0.622; // Pa, Partial pressure of water vapor
        const row_wv = Pvap * M_water / (R * Ta); // density of the water vapor
        const Ptot = Pvap + Pda; // total pressure

        const c_a = 1 / (1 + SH); // mass concentration of dry air
        const c_v = 1 - c_a; // mass concentration of water vapor
        const row = c_a * row_da + c_v * row_wv; // kg/m^3 // density of wet air
        const delta_a = 2.26e-5 * 101325 * Ta / Ptot / 273.15; // m^2/s // mass diffusion coeff

        const C_da = 0.000402 * Ta**2 - 0.2026 * Ta + 1030.9; // J/kg/K // specific heat of dry air
        const C_wv = 1772 + 0.312 * Ta; // J/kg/K // specific heat of water vapor
        const Ca = c_a * C_da + c_v * C_wv; // specific heat of wet air
        if (t === 0) {
            console.log(c_a, C_da, c_v, C_wv)
        }

        // Calculate droplet characteristics
        const row_water = densityWater(Td); // kg/m^3
        const Sd = 4 * Math.PI * (Dd/2)**2; // m^2 // surface area of droplet
        md = row_water * 4/3 * Math.PI * (Dd/2)**3; // mass of droplet
        const Lv = Psat * Td * (R * Td / (M_water * Psat) - 1/row_water) * (1192134 + 32.02 * Td - Td**2) / (234.5 * (Td-16.01)**2); // J/kg // latent heat of water vapor
        const Cd = -0.000099 * Td**3 + 0.10913 * Td**2 - 39.178 * Td + 8785.4; // J/kg/K
        const m_da = c_a * ma; // kg, mass of dry air (non water compounds in air)

        // Heat transfer process
        const Pr = miu_air * Ca / k_air; // Prandtl number
        const beta = 1 / Ta; // thermal dilatation coefficient
        const Gr_t = row**2 * g * beta * Math.abs(Ta - Td) * Dd**3 / miu_air**2; // thermal Grashof number
        const Nu = 2 + 0.6 * Gr_t**0.25 * Pr**0.33; // Nusselt number
        const h_cv = Nu * k_air / Dd; // W/m^2/K // thermal conductivity

        // Mass Transfer process
        const ST = 2.1e-7 * (row_water/M_water)**(2/3) * (647.10 - Td);
        const P_knd = Psat * Math.exp(4 * ST * M_water / (R * Td * Dd * row_water));
        const row_knd = M_water * P_knd / (R * Td); // kg/m^3 // mass density concentration at saturation
        const beta_m = c_v / row;
        const Gr_m = row**2 * g * beta_m * Math.abs(row_wv - row_knd) * Dd**3 / miu_air**2; // mass transfer Grashof number
        const Sc = miu_air / (row * delta_a); // Schmidt number
        const Sh = 2 + 0.6 * Gr_m**0.25 * Sc**0.33; // Sherwood number: mass transfer Nusselt number
        const Cmass = row_wv - row_knd; // kg/m^3 // "diving force": mass density difference between current and saturated states
        const K_mass = Sh * delta_a / Dd; // m/s // mass transfer coefficient
        const mass_flux = K_mass * Cmass; // kg/m^2/s // mass rate flux

        // Lumped Capacitance - Biot numbers
        // const Bi_a = h_cv * Dd / (6 * k_air);
        // const Bi_d = h_cv * Dd / (6 * k_water);
        // const Bi_m = K_mass * Dd / (6 * delta_a);

        const AWB = -Lv * mass_flux / h_cv;

        if (t === 0) {
            Qd = Cd * Td
            Qa = Ca * Ta

            results.time.push(round(t, 4))
            results.Td.push(round(kelvinToFahrenheit(Td), 2))
            results.Ta.push(round(kelvinToFahrenheit(Ta), 2))
            results.Dd.push(round(1e6 * Dd, 2))
            results.RH.push(round(100 * RH, 2))
            results.density.push(round(row, 6))
            results.specificHeat.push(round(Ca, 2))
            results.Qd.push(round(Qd, 2))
            results.Qa.push(round(Qa, 2))
            results.AWB.push(round(100 * AWB, 2))
            Ptot_prev = Ptot
            row0 = row

            continue;
        }

        // Calculate Differentials
        const dmd = Sd * mass_flux; // kg/s
        const dma = -Sd * mass_flux; // kg/s

        const dC_da = 0.000804 * Ta - 0.2026; // J/kg/K^2
        const dC_wv = 0.312; // J/kg/K^2
        const dCd = -3 * 0.000099 * Td**2 + 2 * 0.10913 * Td - 39.178; // J/kg/K^2

        const dTd = (h_cv * Sd * (Ta - Td) + Sd * Lv * mass_flux - dmd * Cd * Td) / (md * (Cd + dCd * Td)); // K/s
        const dTa = (h_cv * Sd * (Td - Ta) - dma * Ta * (Ca + c_a * (C_wv-C_da))) / (ma * (Ca + Ta * (dC_da * c_a + dC_wv * c_v))); // K/s

        const dQd = dCd * dTd * Td + Cd * dTd; // J/kg/s
        const dQa = ((dC_da * c_a + dC_wv * c_v) * dTa + dma / m_da * c_a**2 * (C_wv-C_da)) * Ta + Ca * dTa; // J/kg/s

        const dP = (Ptot - Ptot_prev) / delta_t; // change in pressure over time

        const ds_d = dQd / Td; // J/kg/K/s
        const ds_a = dQa / Ta; // J/kg/K/s
        const dh_d = Td * ds_d + dP / row_water; // J/kg/s
        const dh_a = Ta * ds_a + dP / row; // J/kg/s

        // Calculate new values
        Td = Td + delta_t * dTd;
        const tempTa = Ta + delta_t * dTa;
        Ta = (tempTa * ma + Td * delta_t * dma) / (ma + delta_t * dma);
        md = md + delta_t * dmd;
        ma = ma + delta_t * dma;

        Qd = Qd + delta_t * dQd;
        Qa = Qa + delta_t * dQa;

        s_drp = s_drp + delta_t * ds_d;
        s_air = s_air + delta_t * ds_a;
        h_drp = h_drp + delta_t * dh_d;
        h_air = h_air + delta_t * dh_a;

        Dd = 2 * (3 * md / (4 * Math.PI * row_water))**(1/3);
        SH = (ma - m_da)/m_da;
        RH = Pvap / Psat;

        // Store values in arrays
        results.time.push(round(t, 4))
        results.Td.push(round(kelvinToFahrenheit(Td), 2))
        results.Ta.push(round(kelvinToFahrenheit(Ta), 2))
        results.Dd.push(round(1e6 * Dd, 2))
        results.RH.push(round(100 * RH, 2))
        results.density.push(round(row, 6))
        results.specificHeat.push(round(Ca, 2))
        results.Qd.push(round(Qd, 2))
        results.Qa.push(round(Qa, 2))
        results.AWB.push(round(100 * AWB, 2))
        Ptot_prev = Ptot

        // Check Knudsen Number
        let mfp = k * Td / (Math.sqrt(2) * Math.PI * (2.75e-10)**2 * Ptot); // m, layer thickness
        let Kn = 2 * mfp / Dd;
        if (Kn > 0.08) {
            break;
        }

        // check changes
        if (results.Ta.length > 500) {
            const l = results.Ta.length - 1
            if (results.Ta[l - 1] === results.Ta[l - 500] && results.Dd[l - 1] === results.Dd[l - 500]) {
                break;
            }
        }
    }

    // Prepare return values
    const last_index = results.time.length - 1
    const Ta_f = kelvinToFahrenheit(Ta)
    const Td_f = kelvinToFahrenheit(Td)
    const time_f = results.time[last_index];
    const RH_f = results.RH[last_index] * 100;
    const row_f = results.density[last_index]
        row0
    // Return all results as an object
    return {
        timeEnd: time_f,                    // Simulation end time (s)
        finalAirTemperature: Ta_f,          // Final air temperature (°C)
        finalDropletTemperature: Td_f,      // Final droplet temperature (°C)
        finalDropletDiameter: Dd * 1e6,     // Final droplet diameter (μm)
        finalRelativeHumidity: RH_f,        // Final relative humidity (fraction)
        finalAirDensity: row_f,           // Final Air Density
        airDensityIncrease: (row_f - row0) / row0,
        AWB: results.AWB[last_index],           // Adiabatic wet bulb
        s_drp,         // Droplet entropy
        s_air,         // Air entropy
        h_drp,         // Droplet enthalpy
        h_air,         // Air enthalpy
        temperatureData: results.time.map((t, i) => {
            return {
                time: t,
                airTemp: results.Ta[i],
                dropletTemp: results.Td[i],
                density: round(results.density[i], 4),
            }
        }),
        humidityData: results.time.map((t, i) => {
            return {
                time: t,
                dropletDiameter: results.Dd[i],
                relativeHumidity: results.RH[i],
            }
        }),
        transferData: results.time.map((t, i) => {
            return {
                time: t,
                convection: results.Qa[i],
                evaporation: results.Qd[i]
            }
        }),
    };
}

export default calculateFogModel;

// Helper function to convert Celsius to Kelvin
export {
    calculateFogModel,
    celsiusToKelvin,
    fahrenheitToKelvin,
    kelvinToCelsius,
    kelvinToFahrenheit,
}
