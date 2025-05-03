import React from 'react';
import ModelWorker from 'worker-loader!../model-worker.js'
import TemperatureChart from '../components/temperature-chart'
import DensityChart from '../components/density-chart'
import HumidityChart from '../components/humidity-chart'
import Navbar from '../components/navbar'

export default class FogModelSimulation extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // Input parameters state
            params: {
                Td_0: 60, // Initial droplet temperature (°F)
                Ta_0: 80, // Initial air temperature (°F)
                flow_water: 29.9, // Water flow rate
                load: 1.0, // Turbine load (0-1)
                RH: 0.5, // Relative humidity (fraction)
                Dd0: 30, // Initial droplet diameter (μm)
            },

            // Results state
            results: null,
            stats: null,
            isCalculating: false,
            activeTab: 'temperature',
            error: null
        };

        // Create refs
        this.worker = null;
    }

    componentDidMount() {
        console.log('Initializing worker...');
        this.worker = new ModelWorker();

        // Set up the event listener for messages from the worker
        this.worker.onmessage = this.handleWorkerMessage;
        this.worker.onerror = this.handleWorkerError;
    }

    componentWillUnmount() {
        if (this.worker) {
            this.worker.terminate();
        }
    }

    handleWorkerMessage = (event) => {
        console.log('Received response from worker:', event.data);

        const data = event.data;

        if (data.success) {
            this.setState({
                results: data.processedData,
                stats: data.stats,
                isCalculating: false
            });
        } else {
            this.setState({
                error: data.error,
                isCalculating: false
            });
            console.error('Worker error:', data.error);
        }
    };

    handleWorkerError = (error) => {
        console.error('Worker error event:', error);
        this.setState({ isCalculating: false });
    };

    runSimulation = () => {
        if (!this.worker) {
            console.error('Worker not initialized!');
            return;
        }

        this.setState({
            isCalculating: true,
            error: null
        });

        const { params } = this.state;

        console.log('Sending params to worker:', params);

        // Send parameters to the worker
        this.worker.postMessage(params);
    };

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState(prevState => ({
            params: {
                ...prevState.params,
                [name]: parseFloat(value)
            }
        }));
    };

    setActiveTab = (tab) => {
        this.setState({ activeTab: tab });
    };

    // Format number with specified decimals
    formatNumber = (num, decimals = 2) => {
        return Number(num).toFixed(decimals);
    };

    render() {
        const {params, results, stats, isCalculating, activeTab, error} = this.state;

        return (
            <>
                <Navbar/>
                <div className="container py-5">
                    <h1 className="display-5 mb-4">Gas Turbine Inlet Fog Model Simulator</h1>

                    <div className="alert alert-primary mb-4" role="alert">
                        <p className="mb-0">
                            This simulator models the thermodynamic interaction between water droplets and airflow in
                            gas turbine inlet fogging systems. Adjust the parameters below to analyze how water temperature and
                            droplet size affect cooling performance and air density.
                        </p>
                    </div>

                    {/* Input Parameters */}
                    <div className="card mb-4">
                        <div className="card-header">
                            <h2 className="h5 mb-0">Input Parameters</h2>
                        </div>
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <label className="form-label">
                                        Air Temperature (°F)
                                    </label>
                                    <input
                                        type="number"
                                        name="Ta_0"
                                        value={params.Ta_0}
                                        onChange={this.handleInputChange}
                                        className="form-control"
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label">
                                        Droplet Temperature (°F)
                                    </label>
                                    <input
                                        type="number"
                                        name="Td_0"
                                        value={params.Td_0}
                                        onChange={this.handleInputChange}
                                        className="form-control"
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label">
                                        Droplet Diameter (µm)
                                    </label>
                                    <input
                                        type="number"
                                        name="Dd0"
                                        value={params.Dd0}
                                        onChange={this.handleInputChange}
                                        className="form-control"
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label">
                                        Relative Humidity (fraction)
                                    </label>
                                    <input
                                        type="number"
                                        name="RH"
                                        value={params.RH}
                                        onChange={this.handleInputChange}
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        className="form-control"
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label">
                                        Water Flow Rate
                                    </label>
                                    <input
                                        type="number"
                                        name="flow_water"
                                        value={params.flow_water}
                                        onChange={this.handleInputChange}
                                        className="form-control"
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label">
                                        Turbine Load (0-1)
                                    </label>
                                    <input
                                        type="number"
                                        name="load"
                                        value={params.load}
                                        onChange={this.handleInputChange}
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        className="form-control"
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
                                <button
                                    onClick={this.runSimulation}
                                    disabled={isCalculating}
                                    className="btn btn-primary"
                                >
                                    {isCalculating ? (
                                        <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status"
                                              aria-hidden="true"></span>
                                            Calculating...
                                        </>
                                    ) : "Run Simulation"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Results Display */}
                    {results && (
                        <>
                            {/* Tabs */}
                            <div className="card mb-4">
                                <div className="card-header">
                                    <ul className="nav nav-tabs card-header-tabs">
                                        <li className="nav-item">
                                            <button
                                                className={`nav-link ${activeTab === 'temperature' ? 'active' : ''}`}
                                                onClick={() => this.setActiveTab('temperature')}
                                            >
                                                Temperature
                                            </button>
                                        </li>
                                        <li className="nav-item">
                                            <button
                                                className={`nav-link ${activeTab === 'density' ? 'active' : ''}`}
                                                onClick={() => this.setActiveTab('density')}
                                            >
                                                Air Density
                                            </button>
                                        </li>
                                        <li className="nav-item">
                                            <button
                                                className={`nav-link ${activeTab === 'humidity' ? 'active' : ''}`}
                                                onClick={() => this.setActiveTab('humidity')}
                                            >
                                                Humidity/Droplet Size
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                                <div className="card-body">
                                    <div style={{height: '400px'}}>
                                        {activeTab === 'temperature' &&
                                            <TemperatureChart data={results.temperatureData}/>}
                                        {activeTab === 'density' && <DensityChart data={results.temperatureData}/>}
                                        {activeTab === 'humidity' && <HumidityChart data={results.humidityData}/>}
                                    </div>

                                    <div className="mt-3 p-3 bg-light rounded">
                                        <h3 className="h6 fw-bold mb-2">Interpretation Guide</h3>
                                        {activeTab === 'temperature' && (
                                            <p className="small text-muted">
                                                This chart shows how air and water droplet temperatures change over time
                                                as they travel through
                                                the filter house. Lower final air temperature generally indicates better
                                                cooling performance,
                                                which is beneficial for increasing air density and turbine power output.
                                            </p>
                                        )}
                                        {activeTab === 'humidity' && (
                                            <p className="small text-muted">
                                                This chart displays how droplet size decreases due to evaporation while
                                                relative humidity increases.
                                                The rate of evaporation depends on water temperature, initial droplet
                                                size, and ambient conditions.
                                                Cooler water temperatures typically result in less evaporation but more
                                                effective cooling.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Results summary */}
                            <div className="card">
                                <div className="card-header">
                                    <h2 className="h5 mb-0">Simulation Results</h2>
                                </div>
                                <div className="card-body">
                                    <div className="row g-4">
                                        <div className="col-md-4">
                                            <div className="card">
                                                <div className="card-body">
                                                    <h3 className="h6 text-muted">Final Air Temperature</h3>
                                                    <p className="h3">{this.formatNumber(stats.finalAirTemperature)} °C</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="card">
                                                <div className="card-body">
                                                    <h3 className="h6 text-muted">Final Relative Humidity</h3>
                                                    <p className="h3">{this.formatNumber(results.humidityData[results.humidityData.length - 1].relativeHumidity)} %</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="card">
                                                <div className="card-body">
                                                    <h3 className="h6 text-muted">Air Density Increase</h3>
                                                    <p className="h3">{this.formatNumber(stats.airDensityChange * 100)} %</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="card">
                                                <div className="card-body">
                                                    <h3 className="h6 text-muted">Adiabatic Wet Bulb</h3>
                                                    <p className="h3">{this.formatNumber(stats.adiabaticWetBulb)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="card">
                                                <div className="card-body">
                                                    <h3 className="h6 text-muted">Air Enthalpy Change</h3>
                                                    <p className="h3">{this.formatNumber(stats.airEnthalpyChange)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 p-3 bg-light rounded">
                                        <h3 className="h5 text-primary mb-2">Key Findings</h3>
                                        <p>
                                            The air density increase
                                            of <strong>{this.formatNumber(stats.airDensityChange * 100)}%</strong> indicates
                                            the effectiveness of the fogging system in increasing mass flow through the
                                            turbine.
                                            {stats.airDensityChange > 0.016 ? (
                                                " This is an excellent result, suggesting good performance enhancement for your turbine."
                                            ) : stats.airDensityChange > 0.01 ? (
                                                " This is a good result, providing moderate performance enhancement."
                                            ) : (
                                                " This value is relatively low, suggesting limited performance enhancement."
                                            )}
                                        </p>
                                        <div className="mt-2">
                                            <p>
                                                <strong>Optimal Settings Recommendation:</strong> Based on this
                                                simulation,
                                                {params.Td_0 < params.Ta_0 ? (
                                                    " maintaining the water temperature below air temperature is beneficial for maximizing air density increase."
                                                ) : (
                                                    " lowering water temperature below air temperature may improve air density increase."
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {!results && error && (
                        <div className={'alert alert-danger'}>
                            {error}
                        </div>
                    )}
                </div>
            </>
        );
    }
}
