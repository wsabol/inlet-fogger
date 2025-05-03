import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export default class FogNavbar extends React.Component {
    constructor(props) {
        super(props);
    }

    static getLinks() {
        return [
            {
                href: '/',
                text: 'Home'
            },
            {
                href: '/case-study/',
                text: 'Case Study'
            },
            {
                href: '/simulator/',
                text: 'Simulator'
            },
            {
                href: '/theory/',
                text: 'Theory'
            },
            {
                href: '/contact/',
                text: 'Contact'
            }
        ]
    }
    render() {
        const pathname = window.location.pathname;
        const links = FogNavbar.getLinks()

        return (
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container fluid>
                    <Navbar.Brand >Inlet Fogger</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            {links.map(link =>
                                <Nav.Link
                                    href={link.href}
                                    className={pathname === link.href ? 'active' : ''}
                                >{link.text}</Nav.Link>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        )
    }
}
