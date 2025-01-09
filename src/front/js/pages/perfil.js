import React, { useState, useEffect } from 'react';
import Navbar from '../component/navbar';
import Breadcrumbs from "../component/Breadcrumbs.jsx";

const Perfil = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('perfil');
    
    const backend = process.env.BACKEND_URL || `https://${window.location.hostname}:3001`;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`${backend}/api/users/me`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Error al obtener el perfil');
                }

                const data = await response.json();
                setUser(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [backend]);

    if (loading) {
        return <p>Cargando perfil...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    const placeholderUser = {
        first_name: user?.first_name,
        last_name: user?.last_name,
        user_country: user?.country,
        user_city: user?.city,
        birthdate: user?.date_of_birth,
        profile_picture: user?.profile_picture || 'https://via.placeholder.com/150',
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'perfil':
                return (
                    <div className="card mb-5">
                        <div className="card-body d-flex align-items-center">
                            <div className="flex-grow-1">
                                <p><strong>Nombre:</strong> {placeholderUser.first_name}</p>
                                <p><strong>Apellido:</strong> {placeholderUser.last_name}</p>
                                <p><strong>País:</strong> {placeholderUser.user_country}</p>
                                <p><strong>Ciudad:</strong> {placeholderUser.user_city}</p>
                                <p><strong>Fecha de Nacimiento:</strong> {placeholderUser.birthdate}</p>
                            </div>
                            <img
                                src={placeholderUser.profile_picture}
                                alt="Foto de perfil"
                                className="rounded-circle ms-3"
                                style={{ width: '150px', height: '150px' }}
                            />
                        </div>
                    </div>
                );
            case 'Mis Eventos':
                return (
                    <div className="card mb-5">
                        <div className="card-body">
                            <h4>Configuración de tus eventos</h4>
                            <p>Aquí puedes cambiar y agregar tus eventos.</p>
                        </div>
                    </div>
                );
            case 'Favoritos':
                return (
                    <div className="card mb-5">
                        <div className="card-body">
                            <h4>Tus Eventos Favoritos</h4>
                            <p>Historial de actividades del usuario.</p>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div>
            <Navbar />
            <Breadcrumbs />
            <div className="container mt-5">
                <div className="card-header bg-dark mb-5 text-white">
                    <h2>Perfil del Usuario</h2>
                </div>
                <ul className="nav nav-tabs mb-3">
                    <li className="nav-item">
                        <button className={`nav-link ${activeTab === 'perfil' ? 'active' : ''}`} onClick={() => setActiveTab('perfil')}>Perfil</button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link ${activeTab === 'Mis Eventos' ? 'active' : ''}`} onClick={() => setActiveTab('Mis Eventos')}>Mis Eventos</button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link ${activeTab === 'Favoritos' ? 'active' : ''}`} onClick={() => setActiveTab('Favoritos')}>Favoritos</button>
                    </li>
                </ul>
                {renderContent()}
            </div>
        </div>
    );
};

export default Perfil;
