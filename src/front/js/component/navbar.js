import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/Navbar.css";

const Navbar = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        if (store.token && !store.isAdmin) {
            actions.checkAdmin();
        }
    }, []);

    const handleLogout = () => {
        const userConfirmed = window.confirm(`Are you sure you want to Logout, ${store.username || "user"}?`);
        if (userConfirmed) {
            actions.logout();
            navigate("/login");
        }
    };

    return (
        <nav className="navbar navbar-expand-lg text-center">
            <div className="container-fluid">
                <Link className="navbar-brand d-block" to="/">
                    <img
                        className="object-cover object-center logo-home"
                        src="https://res.cloudinary.com/dj6gqmozm/image/upload/f_auto,q_auto/nqyo2gpte9c8kwsgqlbn"
                        alt="logo-culturalWave"
                    />
                </Link>

                <button
                    className="navbar-toggler navbar-light"
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
                    {store.loading ? (
                        <div className="spinner-border text-light" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    ) : (
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a className="nav-link" href="#">Conciertos</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Teatro</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Museos</a>
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
                            <li className="nav-item">
                                <a className="nav-link" href="#">Infantil</a>
                            </li>
                            {store.token && (
                                <li className="nav-item">
                                    <Link className="nav-link user-link" to="/perfil">
                                        Perfil
                                    </Link>
                                </li>
                            )}
                            {store.isAdmin && (
                                <li className="nav-item">
                                    <Link className="nav-link admin-link" to="/admineventrequests">
                                        Panel Admin
                                    </Link>
                                </li>
                            )}
                        </ul>
                    )}
                </div>

                <div className="d-flex align-items-center">
                    {store.token ? (
                        <button className="btn btn-danger" onClick={handleLogout}>
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-outline-light bg-whithe fw-bold mr-2">
                                Login
                            </Link>
                            <Link to="/signup" className="btn btn-outline-light bg-whithe fw-bold">
                                SignUp
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
