import React from 'react';
import ReactFullpage from '@fullpage/react-fullpage';
import Navbar from '../components/navbar';

const HomePage = () => {
    return (
        <>
            <Navbar/>
            <div className="section">
                <div className="container py-5">
                    <h1 className="display-5 mb-4">The Boiler Feedwater Paradox</h1>
                    <p className="lead mb-5">
                        A real-world case study that challenged conventional wisdom about inlet fogging systems.
                    </p>

                    <div className="row align-items-center mb-5">
                        <div className="col-lg-6">
                            <h3 className="h4 mb-4">The Challenge</h3>
                            <p className="mb-4">
                                Our client was facing common issues with their traditional fogging system: pump
                                degradation
                                from
                                demineralized water's low lubricity, persistent clogging of filters and nozzles, and
                                ongoing
                                maintenance
                                headaches that affected reliability and performance.
                            </p>
                        </div>
                        <div className="col-lg-6">
                            <h3 className="h4 mb-4">Their Solution</h3>
                            <p>
                                They implemented an innovative approach: tapping directly into their boiler feedwater
                                system.
                                This eliminated dedicated pumps, reduced maintenance issues, and the warmer water
                                (approximately 200°F)
                                appeared to evaporate more completely with less runoff.
                            </p>
                        </div>
                    </div>

                    <figure className="text-center">
                        <blockquote className="blockquote">
                            <p>"We noticed the turbine with the new fogging system was generating 2-3 MW more
                                than
                                the other units. The temperature of the fogging water must be responsible for
                                the
                                power
                                spike – it's the only parameter that's different."</p>
                        </blockquote>
                        <figcaption className="blockquote-footer">
                            <cite>Plant Operator</cite>
                        </figcaption>
                    </figure>

                    <hr />

                    <div className="row justify-content-center mt-5">
                        <div className="col-lg-8 text-center mb-5">
                            <h3 className="h4 mb-3">The Surprising Discovery</h3>
                            <p>
                                Our research revealed a counterintuitive truth: despite operational benefits and
                                increased
                                evaporation, the warmer boiler feedwater was actually <strong>reducing</strong> the
                                effectiveness of
                                the fogging system.
                            </p>
                        </div>
                    </div>

                    <div className="row justify-content-center">
                        <div className="col-md-4 mb-4">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body text-center p-4">
                                    <div className="mb-3">
                                        <i className="bi bi-droplet-half text-primary" style={{fontSize: '2.5rem'}}></i>
                                    </div>
                                    <h3 className="h5 mb-3">The Assumption</h3>
                                    <p className="text-muted">
                                        More evaporation means better cooling performance and higher turbine output.
                                        This is
                                        a common
                                        industry misconception.
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
                                    <h3 className="h5 mb-3">The Physics</h3>
                                    <p className="text-muted">
                                        Cooling effectiveness depends on both evaporation and convection. Warmer water
                                        reduces convective
                                        cooling, and water vapor itself negatively impacts air density.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body text-center p-4">
                                    <div className="mb-3">
                                        <i className="bi bi-graph-down-arrow text-primary"
                                           style={{fontSize: '2.5rem'}}></i>
                                    </div>
                                    <h3 className="h5 mb-3">The Reality</h3>
                                    <p className="text-muted">
                                        Despite increased evaporation, warmer water actually decreased air density
                                        entering
                                        the turbine,
                                        potentially offsetting the maintenance benefits.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

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
