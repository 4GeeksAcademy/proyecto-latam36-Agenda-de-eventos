import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar = () => {

    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
      };

    return (
        <nav className="navbar navbar-expand-lg text-center bg-dark navbar-dark border-bottom border-body rounded-2 m-0 p-0">
            <div className="container-fluid">

                <Link className="navbar-brand" to="/">
                    <img 
                        className="object-cover object-center w-25" 
                        src="https://res.cloudinary.com/dj6gqmozm/image/upload/f_auto,q_auto/culturalwavelogo" 
                        alt="logo-culturalWave" 
                    />
                </Link>

                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav" 
                    aria-controls="navbarNav" 
                    aria-expanded="false" 
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link" href="#">Conciertos</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Teatro</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Obras/Museos</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Familia</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Turismo</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Vida Nocturna</a>
                        </li>
                    </ul>
                </div>

                <div className="d-flex align-items-center">
                    <button
                        className="btn btn-outline-light bg-whithe rounded-pill"
                        onClick={handleLoginClick}
                    >
                        Login
                    </button>
                </div>
            </div>
        </nav>
    );
};
