import React from 'react';
import { createRoot } from 'react-dom/client';

import FogIndex from './pages/index';
import FogCaseStudy from './pages/case-study';
import FogModelSimulator from './pages/simulator';
import FogModelTheory from './pages/theory';

// style
import '../scss/app.scss'

document.addEventListener("DOMContentLoaded", function() {
    const FoggerApp = {
        init() {
            const pathname = window.location.pathname;
            const root = createRoot(document.getElementById('root'));

            switch (pathname) {

                case '/':
                    root.render(<FogIndex />);
                    break;

                case '/case-study/':
                    root.render(<FogCaseStudy />);
                    break;

                case '/simulator/':
                    root.render(<FogModelSimulator />);
                    break;

                case '/theory/':
                    root.render(<FogModelTheory />);
                    break;

                default:
                    throw "nav not handled " + pathname

            }
        },
    }

    FoggerApp.init();
});
