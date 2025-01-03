import React, { useState, useEffect } from 'react';
import Navbar from '../component/navbar';
import Breadcrumbs from "../component/Breadcrumbs.jsx";

const Perfil = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('https://friendly-guide-7vw74rjq96jhwpgr-3001.app.github.dev/api/users/me', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}` // Suponiendo que el token está almacenado en localStorage
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
    }, []);

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

    return (
        <div>
            <Navbar />
            <Breadcrumbs />
            <div className="container mt-5">
                <div className="card-header bg-dark mb-5 text-white">
                    <h2>Perfil del Usuario</h2>
                </div>
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
            </div>
        </div>
    );
};

export default Perfil;
