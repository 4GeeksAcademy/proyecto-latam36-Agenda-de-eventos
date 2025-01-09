import React from "react";
import "../../styles/AboutUs.css"; // Ruta al archivo CSS
import Breadcrumbs from "../component/Breadcrumbs.jsx";
import Navbar from "../component/navbar";

const AboutUs = () => {
    return (
        <>
            <Navbar />
            <Breadcrumbs />
            <div className="about-us-container">
                <div className="header-section">
                    <h1>Sobre Nosotros</h1>
                    <p className="subtitle">Conectando a Colombia a través de su cultura.</p>
                </div>

                <div className="mission-section">
                    <div className="text">
                        <h2>Nuestra Misión</h2>
                        <p>
                            En <span className="highlight">Cultural Wave</span>, nuestra misión es fomentar y
                            difundir la riqueza cultural de Colombia. Creemos en el poder de los eventos
                            culturales para unir a las personas, inspirar creatividad y celebrar la diversidad
                            que define a nuestro país.
                        </p>
                    </div>
                    <div className="image">
                        <img
                            src="https://res.cloudinary.com/dijfzjssm/image/upload/v1736410679/pexels-picjumbo-com-55570-196652_dse586.jpg"
                            alt="Concierto"
                        />
                    </div>
                </div>

                <div className="functionality-section">
                    <div className="image">
                        <img
                            src="https://res.cloudinary.com/dijfzjssm/image/upload/v1736410679/pexels-picjumbo-com-55570-196652_dse586.jpg"
                            alt="Teatro"
                        />
                    </div>
                    <div className="text">
                        <h2>¿Qué Hacemos?</h2>
                        <p>
                            Somos una agenda digital que reúne todos los eventos culturales de Colombia en un
                            solo lugar. Desde conciertos y obras de teatro, hasta exposiciones de arte y ferias
                            gastronómicas, te brindamos toda la información que necesitas para disfrutar al
                            máximo de la oferta cultural del país.
                        </p>
                    </div>
                </div>

                <div className="nature-section">
                    <div className="text">
                        <h2>Nuestra Naturaleza</h2>
                        <p>
                            Somos más que una plataforma, somos una comunidad. En <span className="highlight">Cultural
                            Wave</span>, buscamos ser el puente entre artistas, organizadores y amantes de la
                            cultura. Con un diseño intuitivo y herramientas prácticas, facilitamos la
                            exploración y planificación de eventos para todos los usuarios.
                        </p>
                    </div>
                    <div className="image">
                        <img
                            src="https://res.cloudinary.com/dijfzjssm/image/upload/v1736410679/pexels-picjumbo-com-55570-196652_dse586.jpg"
                            alt="Eventos culturales"
                        />
                    </div>
                </div>

                <div className="contact-section">
                    <h2>Contáctanos</h2>
                    <p>
                        ¿Tienes alguna pregunta, sugerencia o quieres colaborar con nosotros? Estamos aquí para
                        escucharte. Escríbenos a través de nuestro correo electrónico o redes sociales, y
                        estaremos encantados de responderte.
                    </p>
                    <ul>
                        <li>
                            <strong>Email:</strong> contacto@culturalwave.com
                        </li>
                        <li>
                            <strong>Teléfono:</strong> +57 123 456 7890
                        </li>
                        <li>
                            <strong>Redes Sociales:</strong> 
                            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"> Facebook</a>, 
                            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"> Instagram</a>, 
                            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer"> Twitter</a>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default AboutUs;
