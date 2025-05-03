import React from 'react';
import { useRef } from 'react';
import ReactFullpage from '@fullpage/react-fullpage'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import FogNavbar from '../components/navbar';
import Container from 'react-bootstrap/Container';
import { Scatter } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

const HomePage = () => {
    const links = FogNavbar.getLinks();

    // Register the necessary components with Chart.js
    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
    );

    const chartRef = useRef(null);
    const densityData = [
        {x: 60, y: 1.83},
        {x: 80, y: 1.78},
        {x: 100, y: 1.72},
        {x: 120, y: 1.66},
        {x: 140, y: 1.60},
        {x: 160, y: 1.54},
        {x: 180, y: 1.47},
        {x: 200, y: 1.41},
    ]

    const afterSlideLoad = function(origin, destination, direction) {
        const { current: chart } = chartRef;
        if (!chart) {
            return;
        }

        const visible = chart.getVisibleDatasetCount();
        if (destination.index === 2 && !visible) {
            chart.show(0)
        }
    }

    return (
        <ReactFullpage
            // fullpage options
            duration={1000}
            navigation={true}
            navigationPosition={'right'}
            navigationTooltips={['Home', 'Case Study', 'Benefits', 'Theory', 'Try It', 'Footer']}
            // anchors={['section-home', 'section-case-study', 'section-benefits', 'section-theory', 'section-cta', 'section-footer']}
            showActiveTooltip={true}
            sectionsColor={['#f8f9fa', '#ffffff', '#f1f8ff', '#ffffff', '#f8f9fa', '#e9f7fe']}
            afterLoad={afterSlideLoad.bind(this)}
            render={({state, fullpageApi}) => {
                return (
                    <ReactFullpage.Wrapper>
                        {/* Hero Section */}
                        <div className="section">
                            <div className="container">
                                <div className="row align-items-center min-vh-100">
                                    <div className="col-lg-6">
                                        <h1 className="display-3 fw-bold mb-4">Gas Turbine Inlet Fogger Simulation</h1>
                                        <p className="lead mb-4">
                                            Learn how water temperature, air temperature, and humidity effect
                                            gas turbine performance through advanced thermodynamic modeling
                                            of inlet fogging systems.
                                        </p>
                                        <div className="d-flex gap-3">
                                            <a href="/simulator/" className="btn btn-primary btn-lg">
                                                Try the Simulator
                                            </a>
                                            <button
                                                onClick={() => fullpageApi.moveSectionDown()}
                                                className="btn btn-outline-secondary btn-lg"
                                            >
                                                Learn More
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <img
                                            src="https://wallpapercave.com/wp/wp7004741.jpg"
                                            alt="Gas Turbine Illustration"
                                            className="img-fluid"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* About the Case Study */}
                        <div className="section">
                            <div className="container">
                                <div className="row justify-content-center">
                                    <div className="col-lg-8 text-center">
                                        <h2 className="display-5 mb-4">More Evaporation. Less Cooling. </h2>
                                        <p className="lead mb-5">
                                            Learn about the case study that inspired this simulator.
                                            What does it mean when more of the fogger water is being evaporated? How
                                            does this effect performance?
                                        </p>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-md-4 mb-4">
                                        <div className="card h-100 border-0 shadow-sm">
                                            <div className="card-body text-center p-4">
                                                <div className="mb-3">
                                                    <i className="bi bi-droplet-fill text-primary"
                                                       style={{fontSize: '2.5rem'}}></i>
                                                </div>
                                                <h3 className="h4 mb-3">A Novel Approach</h3>
                                                <p className="text-muted">
                                                    Plant engineers started using boiler feed water for their foggers,
                                                    which reduced maintenance needs and showed measurable improvements
                                                    including less filter house runoff.
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
                                                <h3 className="h4 mb-3">The Assumption</h3>
                                                <p className="text-muted">
                                                    The increased efficiency was attributed to the warmer water, which
                                                    appeared to
                                                    promote more evaporation and, by extension, more cooling - a
                                                    reasonable hypothesis, but one that warranted more investigation.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4 mb-4">
                                        <div className="card h-100 border-0 shadow-sm">
                                            <div className="card-body text-center p-4">
                                                <div className="mb-3">
                                                    <i className="bi bi-lightning-fill text-primary"
                                                       style={{fontSize: '2.5rem'}}></i>
                                                </div>
                                                <h3 className="h4 mb-3">The Discovery</h3>
                                                <p className="text-muted">
                                                    Despite the operational benefits of using boiler feed water, our
                                                    model reveals that
                                                    cooler water reliably produces greater cooling, overall air density,
                                                    and turbine performance.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-center">
                                    <a href="/case-study/" className="btn btn-primary btn-lg">Read More</a>
                                </div>
                            </div>
                        </div>

                        {/* Benefits Section */}
                        <div className="section">
                            <div className="container">
                                <div className="row align-items-center">
                                <div className="col-lg-5">
                                        <Scatter
                                            ref={chartRef}
                                            data={{
                                                datasets: [
                                                    {
                                                        label: 'dataset',
                                                        hidden: true,
                                                        showLine: true,
                                                        data: densityData,
                                                        backgroundColor: 'rgba(13, 110, 253, 0.4)',  // Color of the points
                                                        borderColor: 'rgba(13, 110, 253, 1)',  // Color of the line connecting the points
                                                    }
                                                ],
                                            }}
                                            options={{
                                                responsive: true,
                                                aspectRatio: 5/3,
                                                interaction: {
                                                    intersect: false,
                                                    mode: 'nearest',
                                                    axis: 'x'
                                                },
                                                title: {
                                                    text: 'Air Density versus Water Temperature',
                                                },
                                                transitions: {
                                                    show: {
                                                        animations: {
                                                            x: {
                                                                from: 100
                                                            },
                                                            y: {
                                                                from: 100
                                                            },
                                                        }
                                                    },
                                                },
                                                scales: {
                                                    y: {
                                                        suggestedMax: 1.85,
                                                        suggestedMin: 1.35,
                                                        title: {
                                                            display: true,
                                                            text: 'Air Increase (%)',
                                                        }
                                                    },
                                                    x: {
                                                        suggestedMax: 200,
                                                        suggestedMin: 60,
                                                        title: {
                                                            display: true,
                                                            text: 'Water Temperature °F',
                                                        }
                                                    },
                                                },
                                                plugins: {
                                                    legend: {
                                                        display: false
                                                    },
                                                    tooltip: {
                                                        callbacks: {
                                                            label: function(context) {
                                                                let label = 'Water Temp: ' + context.parsed.x + '°F, '
                                                                label += 'Air Increase: ' + context.parsed.y.toFixed(2) + '%'
                                                                return label;
                                                            }
                                                        }
                                                    },
                                                },
                                            }}
                                            />
                                    </div>
                                    <div className="col-lg-6 offset-lg-1">
                                        <h2 className="display-5 mb-4">Why This Model Matters</h2>
                                        <p className="lead mb-4">
                                            Contrary to conventional wisdom, the thermodynamics do not stop with evaporative cooling. Our
                                            research shows that all other things being equal, cooler water temperatures
                                            deliver superior performance.
                                        </p>
                                        <div className="d-flex mb-3 align-items-center">
                                            <div className="me-3">
                                                <span className="badge bg-primary p-2 rounded-circle">
                                                    <i className="bi bi-check2 fs-5"></i>
                                                </span>
                                            </div>
                                            <div>
                                                <p className="mb-0"><strong>Increased Air Density</strong> - The primary
                                                    goal of fogging is achieved more effectively</p>
                                            </div>
                                        </div>
                                        <div className="d-flex mb-3 align-items-center">
                                            <div className="me-3">
                                                <span className="badge bg-primary p-2 rounded-circle">
                                                    <i className="bi bi-check2 fs-5"></i>
                                                </span>
                                            </div>
                                            <div>
                                                <p className="mb-0"><strong>Better Cooling</strong> -
                                                    Convective heat transfer works in your favor to cool the air</p>
                                            </div>
                                        </div>
                                        <div className="d-flex mb-3 align-items-center">
                                            <div className="me-3">
                                                <span className="badge bg-primary p-2 rounded-circle">
                                                    <i className="bi bi-check2 fs-5"></i>
                                                </span>
                                            </div>
                                            <div>
                                                <p className="mb-0"><strong>Scientific Approach</strong> - Based on
                                                    verified thermodynamic principles</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* How It Works */}
                        <div className="section">
                            <div className="container">
                                <div className="row justify-content-center mb-5">
                                    <div className="col-lg-8 text-center">
                                        <h2 className="display-5 mb-4">The Science Behind Our Model</h2>
                                        <p className="lead">
                                            Our thermodynamic model simulates the complex heat and mass transfer
                                            processes that occur when water droplets interact with airflow.
                                        </p>
                                        <div className="d-flex justify-content-center">
                                            <a href="/theory/" className="btn btn-primary btn-lg">Learn More</a>
                                        </div>
                                    </div>
                                </div>

                                <div className="row justify-content-center">
                                    <div className="col-lg-10">
                                    <div className="row g-4">
                                            <div className="col-md-6">
                                                <div className="card h-100 border-0 shadow-sm">
                                                    <div className="card-body p-4">
                                                        <h4 className="card-title mb-3">Convective Heat Transfer</h4>
                                                        <p className="card-text">
                                                            The exchange of thermal energy between water droplets and
                                                            surrounding air,
                                                            modeled using Newton's Law of Cooling and dimensionless
                                                            numbers.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="card h-100 border-0 shadow-sm">
                                                    <div className="card-body p-4">
                                                        <h4 className="card-title mb-3">Latent Heat Transfer</h4>
                                                        <p className="card-text">
                                                            The energy absorbed during evaporation, which significantly
                                                            contributes
                                                            to the cooling effect in fogging systems.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="card h-100 border-0 shadow-sm">
                                                    <div className="card-body p-4">
                                                        <h4 className="card-title mb-3">Psychrometrics</h4>
                                                        <p className="card-text">
                                                            The study of moist air properties, including relative
                                                            humidity, specific humidity,
                                                            and vapor pressure calculations crucial for accurate
                                                            modeling.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="card h-100 border-0 shadow-sm">
                                                    <div className="card-body p-4">
                                                        <h4 className="card-title mb-3">Mass Transfer</h4>
                                                        <p className="card-text">
                                                            The diffusion of water vapor into air, modeled through
                                                            Sherwood, Schmidt,
                                                            and mass Grashof dimensionless numbers.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CTA Section */}
                        <div className="section">
                            <div className="container">
                                <div className="row justify-content-center text-center">
                                    <div className="col-lg-8">
                                        <h2 className="display-5 fw-bold mb-4">Ready to Optimize Your Turbine
                                            Performance?</h2>
                                        <p className="lead mb-5">
                                            Our scientifically validated model helps you maximize efficiency and power
                                            output
                                            from your gas turbine inlet fogging system.
                                        </p>
                                        <a href="/simulator/" className="btn btn-primary btn-lg px-5 py-3">
                                            Launch the Simulator
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* footer */}
                        <footer className="section footer fp-auto-height">
                            <div className="container">
                                <Navbar className="bg-transparent">
                                    <Container fluid>
                                        <Navbar.Collapse id="basic-navbar-nav">
                                            <Nav className="mx-auto gap-4 mb-2">
                                                {links.map(link => {
                                                    if (link.text === 'Home') {
                                                        return (
                                                            <Nav.Link onClick={() => fullpageApi.moveTo(1, 0)}
                                                            >{link.text}</Nav.Link>
                                                        )
                                                    }
                                                    return (
                                                        <Nav.Link href={link.href} >{link.text}</Nav.Link>
                                                    )
                                                })}
                                            </Nav>
                                        </Navbar.Collapse>
                                    </Container>
                                </Navbar>
                                <div className="text-center text-dark">© 2025 <a href={"https://willsabol.com"}>Will Sabol</a></div>
                            </div>
                        </footer>
                    </ReactFullpage.Wrapper>
                );
            }}
        />
    );
};

export default HomePage;
