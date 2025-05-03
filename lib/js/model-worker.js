/**
 * Fog Model Web Worker
 * Handles all the intensive calculations off the main thread
 */

import { calculateFogModel } from './model'

console.log('Worker initialized');

// Listen for messages from the main thread
self.onmessage = function(event) {
    console.log('Worker received message:', event.data);

    try {
        // Get the parameters from the main thread
        const params = event.data;

        console.log('Starting calculation...');

        // Run the simulation
        const results = calculateFogModel(
            params.Td_0,
            params.Ta_0,
            params.flow_water,
            params.load,
            params.RH,
            params.Dd0
        );

        console.log('Calculation complete...', results);

        // Send the results back to the main thread
        self.postMessage({
            processedData: {
                temperatureData: results.temperatureData,
                humidityData: results.humidityData,
                transferData: results.transferData,
            },
            stats: {
                timeEnd: results.timeEnd,
                finalAirTemperature: results.finalAirTemperature,
                finalDropletTemperature: results.finalDropletTemperature,
                finalDropletDiameter: results.finalDropletDiameter,
                finalRelativeHumidity: results.finalRelativeHumidity,
                finalAirDensity: results.finalAirDensity,
                airDensityChange: results.airDensityIncrease,
                adiabaticWetBulb: results.AWB,
                airEnthalpyChange: results.h_air,
            },
            success: true
        });
    } catch (error) {
        console.error('Worker error:', error);

        // Send error back to main thread
        self.postMessage({
            success: false,
            error: error
        });
    }
};
