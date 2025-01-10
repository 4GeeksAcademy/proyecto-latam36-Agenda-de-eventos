import React, { useContext, useEffect, useState, useRef } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/Navbar.css";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [profileMenuVisible, setProfileMenuVisible] = useState(false); 
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setProfileMenuVisible(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (store.token && !store.isAdmin) {
            actions.checkAdmin();
        }
    }, [store.token, store.isAdmin, actions]);

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

                <div className="navbar-content">
                    {store.loading ? (
                        <div className="spinner">
                            <div className="spinner-border text-light" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="navbar-links">
                            {store.token ? (
                                <>
                                    <div className="profile-menu">
                                        <button
                                            className="profile-icon"
                                            onClick={() => setProfileMenuVisible(!profileMenuVisible)}
                                        >
                                            <FaUserCircle size={30} />
                                        </button>
                                        {profileMenuVisible && (
                                            <div ref={dropdownRef} className="profile-dropdown">
                                                <ul>
                                                    <li>
                                                        <Link to="/perfil" className="nav-link">Perfil</Link>
                                                    </li>
                                                    {store.isAdmin && (
                                                        <li>
                                                            <Link to="/admineventrequests" className="admin-btn">
                                                                Panel Admin
                                                            </Link>
                                                        </li>
                                                    )}
                                                    <li>
                                                        <button onClick={handleLogout} className="logout-btn">
                                                            Logout
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="navbar-button login-btn">Login</Link>
                                    <Link to="/signup" className="navbar-button signup-btn">SignUp</Link>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
