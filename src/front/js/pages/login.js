import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from "../store/appContext";
import "../../styles/login.css";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { actions } = useContext(Context);
    const navigate = useNavigate();

    const backend=process.env.BACKEND_URL

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(backend+'/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Error en la autenticación. Verifica tus credenciales.');
            }

            const data = await response.json();

            console.log('Inicio de sesión exitoso', data);

            const token = data['access token'];
            actions.setToken(token);
            localStorage.setItem('token', token);


            setTimeout(() => navigate('/'), 2000);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        <div className="container-fluid vh-100">
            <div className="row h-100">
                <div className="col-md-6 d-flex justify-content-center align-items-center">
                    <div className=" Login card p-4" style={{ maxWidth: '400px', width: '100%' }}>
                        <div className="mb-3">
                            <Link className="navbar-brand d-block" to="/" style={{ width: '100%' }}>
                                <img
                                    className="object-cover object-center"
                                    style={{ width: '160px' }}
                                    src="https://res.cloudinary.com/dj6gqmozm/image/upload/f_auto,q_auto/culturalwavelogo"
                                    alt="logo-culturalWave"
                                />
                            </Link>
                        </div>
                        <h3 className="text-center fw-bold">Iniciar Sesión</h3>
                        <form onSubmit={handleLogin}>
                            {errorMessage && (
                                <div className="alert alert-danger" role="alert">
                                    {errorMessage}
                                </div>
                            )}
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Correo Electrónico</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    placeholder="Ingresa tu correo"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Contraseña</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    placeholder="Ingresa tu contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="d-grid">
                                <button type="submit" className="btn btn-primary rounded-pill">Ingresar</button>
                            </div>
                        </form>
                        <div className="text-center mt-3">
                            <span>¿No tienes una cuenta?</span>
                            <Link className="navbar-brand fs-6" to="/signup"> Regístrate</Link>
                        </div>
                    </div>
                </div>

                <div
                    className="col-md-6 d-none d-md-block"
                    style={{
                        backgroundImage: 'url(https://res.cloudinary.com/dj6gqmozm/image/upload/f_auto,q_auto/mcyi8zijuqs8el2iwgr1)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                ></div>
            </div>
        </div>
    );
};

export default Login;
