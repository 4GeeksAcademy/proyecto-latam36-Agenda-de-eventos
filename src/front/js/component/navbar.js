import React from 'react';

export const Navbar = () => {
    return (
        
        <nav className="navbar navbar-expand-lg text-center bg-dark navbar-dark border-bottom border-body rounded-2 m-0 p-0">
            <div className="container-fluid d-flex justify-content-between">
                <a className="navbar-brand align-items-center" href="#">
                    <img className="object-cover object-center" src="https://res.cloudinary.com/dj6gqmozm/image/upload/f_auto,q_auto/culturalwavelogo" alt="logo-culturalWave"></img>
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
                    <ul className="navbar-nav">
                     <li className="nav-item ">
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
                    <div>
                        <button type="button" class="btn btn-light">
                            <span href="#" className="log-in">Sing up / Log In</span>
                        </button>
                    </div>
            </div>
                
                
         </nav>
         
    );
};