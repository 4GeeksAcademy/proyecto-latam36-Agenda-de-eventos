import React from 'react';
import { Link } from 'react-router-dom';
import "../../styles/footer.css";

const Footer = () => {
    return (
        <footer className="footer text-center bg-dark text-white p-5">
            <div className="container">
                <div className="footer-logo">
                    <Link to="/">
                          <img
                              className="logo"
                              src="https://res.cloudinary.com/dj6gqmozm/image/upload/f_auto,q_auto/nqyo2gpte9c8kwsgqlbn"
                              alt="logo-culturalWave"
                               
                          />
                          </Link>
                </div>

                <div className="footer-links">
                    <ul>
                        <li><Link to="/EventsForm" className="footer-link">Crea tu evento</Link></li>
                        <li><Link to="/AboutUs" className="footer-link">Sobre nosotros</Link></li>
                        <li><Link to="/AboutUs" className="footer-link">Contáctanos</Link></li>
                    </ul>
                </div>

                <div className="footer-info">
                    <p>Powered by CULTURALWAVE | Copyright &copy; 2024</p>
                    <p>Colombia - Conectando el país a través de su cultura.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
