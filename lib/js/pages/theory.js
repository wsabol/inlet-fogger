import React from 'react';
import Navbar from '../components/navbar';

const HomePage = () => {
    return (
        <>
            <Navbar/>
            <div className="section">
                <div className="container py-5">
                    <h1 className="display-5 mb-4">Understanding Gas Turbine Inlet Foggers</h1>
                    <p>
                        Gas turbine inlet foggers are systems designed to enhance turbine output by increasing
                        the density of inlet air. By injecting fine water droplets into the airstream entering a gas
                        turbine, these systems cool the air, increasing its density and mass flow through the turbine.
                    </p>
                    <p>
                        Fogging can have a profound impact on gas turbine performance in hot and dry summer climates
                        when power generation is most critical. This is due to the fact that fogging is
                        primarily an <strong>evaporative cooling</strong> technology.
                        Heat is pulled from the air to vaporize the water on the surface of the droplets.This also
                        means that evaporative cooling stops when either all water is evaporated or
                        when the relative humidity in the filter house reaches 100%.
                    </p>
                    <p>
                        Contrary to conventional thinking, the analysis does not stop at evaporation.
                        An important element of this thermodynamic system that is often overlooked
                        is <strong>convective heat transfer</strong>. Convection can
                        have a substantial effect, positive or negative, on the air density if we consider all the
                        different temperatures the feed water could be.
                    </p>
                    <p>Based on this we can list some basic criteria that would make for an effective fogging system</p>
                    <ul>
                        <li>Ambient conditions need to be hot enough to stimulate evaporative cooling.</li>
                        <li>We need to increase the surface area of the water as much as possible to increase the
                            evaporative cooling effect.
                        </li>
                        <li>We need at least enough water to sustain cooling for the entire duration the air is in the
                            inlet filter house.
                        </li>
                        <li>The water droplet temperature should be as cool as possible so that convection works in
                            concert with evaporation to cool the air.
                        </li>
                    </ul>

                    <h2 className="mt-5">The Science Behind Our Model</h2>

                    <p>Our thermodynamic model simulates the complex heat and mass transfer processes
                                that occur when water droplets interact with airflow.</p>

                    <div className="row justify-content-center">
                        <div className="col-md-3 mb-4">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body text-center p-4">
                                    <h3 className="h5 mb-3">Convective Heat Transfer</h3>
                                    <p className="card-text text-muted">
                                        The exchange of thermal energy between water droplets and surrounding
                                        air,
                                        modeled using Newton's Law of Cooling and dimensionless numbers.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 mb-4">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body text-center p-4">
                                    <h3 className="h5 mb-3">Latent Heat Transfer</h3>
                                    <p className="card-text text-muted">
                                        The energy absorbed during evaporation, which significantly contributes
                                        to the cooling effect in fogging systems.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 mb-4">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body text-center p-4">
                                    <h3 className="h5 mb-3">Psychrometrics</h3>
                                    <p className="card-text text-muted">
                                        The study of moist air properties, including relative humidity, specific
                                        humidity,
                                        and vapor pressure calculations crucial for accurate modeling.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 mb-4">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body text-center p-4">
                                    <h3 className="h5 mb-3">Mass Transfer</h3>
                                    <p className="card-text text-muted">
                                        The diffusion of water vapor into air, modeled through Sherwood,
                                        Schmidt,
                                        and mass Grashof dimensionless numbers.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h2 className="mt-5">Practical Considerations</h2>

                    <p>Given the above criteria, lets think about how this applies from an operations and maintenance
                        perspective.</p>

                    <div className="row justify-content-center">
                        <div className="col-md-4 mb-4">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body text-center p-4">
                                    <div className="mb-3">
                                        <i className="bi bi-droplet-half text-primary" style={{fontSize: '2.5rem'}}></i>
                                    </div>
                                    <h3 className="h5 mb-3">Water Pumps</h3>
                                    <p className="card-text text-muted">
                                        The most common way to deliver water to your fogging system is from dedicated
                                        pumps, however this can come with a number of problems. Demineralized water's
                                        low lubricity will degrade pumps not specifically designed for it.
                                        Without constant maintenance, degraded pumps can vibrate violently sending
                                        debris upstream to clog filters and nozzles.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body text-center p-4">
                                    <div className="mb-3">
                                        <i className="bi bi-droplet-half text-primary" style={{fontSize: '2.5rem'}}></i>
                                    </div>
                                    <h3 className="h5 mb-3">Nozzle Condition</h3>
                                    <p className="card-text text-muted">
                                        Nozzles are responsible for droplet atomization. The droplets and can be
                                        anywhere from 10-40 microns in diameter. If the nozzles are not clean and free
                                        of
                                        debris or build up, the water will not atomize and cool as expected, which
                                        significantly diminishes any benefit from fogging.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body text-center p-4">
                                    <div className="mb-3">
                                        <i className="bi bi-thermometer-half text-primary"
                                           style={{fontSize: '2.5rem'}}></i>
                                    </div>
                                    <h3 className="h5 mb-3">Filter House Runoff</h3>
                                    <p className="card-text text-muted">
                                        The amount of water that runs off the filter house does not directly correlate
                                        with the amount of cooling or the health of the system. It is
                                        generally not an issue and will fluctuate with the climate. In fact, if
                                        you don't have any runoff, you are probably under fogging.
                                        Nozzles that are dirty or malfunctioning will also increase the runoff
                                        and should be inspected, but if you aim to maximize cooling,
                                        some runoff is to be expected.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h2 className="mt-5">The Case for using Boilerfeed Water</h2>

                    <div className="row mt-4">
                        <div className="col-12 text-center">
                            <div className="alert alert-primary d-inline-block mx-auto py-3 px-4">
                                <p className="mb-0">
                                    <strong>Key Finding:</strong> Our model demonstrated that cooler inlet water
                                    temperatures produce greater
                                    air density increases, which is the primary goal of fogging systems.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomePage;
