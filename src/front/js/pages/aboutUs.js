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
                <div className="header-section ">
                    <div>
                    <h1>Sobre Nosotros</h1>
                    <div>
                        <p className="subtitle">Conectando a Colombia a través de su cultura.</p>
                    </div>
                    </div>
              
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
                            src="https://media.istockphoto.com/id/1806011581/photo/overjoyed-happy-young-people-dancing-jumping-and-singing-during-concert-of-favorite-group.jpg?s=612x612&w=0&k=20&c=cMFdhX403-yKneupEN-VWSfFdy6UWf1H0zqo6QBChP4="
                            alt="Concierto"
                        />
                    </div>
                </div>

                <div className="functionality-section">
                    <div className="image">
                        <img
                            src="https://i0.wp.com/ishootshows.com/wp-content/uploads/2019/10/DSC_0643.jpg?resize=1024%2C663&ssl=1git"
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
                    <h2>¿Quiénes somos?</h2>
  
    
   
    <ul>
        <li>👨‍💻<strong>Aurelio Najera</strong> <img src="https://flagcdn.com/w40/mx.png" alt="México" width="20"/> (México) - Full Stack Developer</li>
        <li>👨‍💻<strong>Martin Cuadro</strong> <img src="https://flagcdn.com/w40/uy.png" alt="Uruguay" width="20"/> (Uruguay) - Full Stack Developer</li>
        <li>👩‍💻<strong>Miguel Garcia</strong> <img src="https://flagcdn.com/w40/ve.png" alt="Venezuela" width="20"/> (Venezuela) - Full Stack Developer</li>
        <li>👩‍💻<strong>Andreina Paz</strong> <img src="https://flagcdn.com/w40/ve.png" alt="Venezuela" width="20"/> (Venezuela) - Full Stack Developer</li>
        <li>👨‍💻<strong>Juan Carlos Aviles</strong> <img src="https://flagcdn.com/w40/cr.png" alt="Costa Rica" width="20"/> (Costa Rica) - Full Stack Developer</li>
    </ul>

    <p>
        Somos un equipo apasionado de cinco desarrolladores, unidos por nuestra creatividad, talento y pasión por la tecnología. 
        Nos especializamos en el desarrollo de software, trabajando juntos para crear soluciones innovadoras y eficientes. 
        Nuestra diversidad nos fortalece, aportando diferentes perspectivas y experiencias que enriquecen cada proyecto.
    </p>

    <p><strong>¡Conócenos y descubre cómo podemos ayudarte a hacer realidad tu visión tecnológica! 🚀</strong></p>
                       
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
