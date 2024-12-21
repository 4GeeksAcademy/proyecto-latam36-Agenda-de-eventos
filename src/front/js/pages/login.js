import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [accessToken, setAccessToken] = useState(''); // Variable para guardar el token
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

            // Guarda el token en localStorage y en una variable de estado
            const token = data['access token'];
            localStorage.setItem('accessToken', token);
            setAccessToken(token); // Guardar en la variable de estado

            // Redirige o actualiza el estado de autenticación
            setTimeout(() => navigate('/'), 2000);
            console.log('Inicio de sesión exitoso');
            console.log('Token:', token);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        <div className="container-fluid vh-100">
            <div className="row h-100">
                {/* Formulario Login */}
                <div className="col-md-6 d-flex justify-content-center align-items-center bg-light">
                    <div className="card p-4" style={{ maxWidth: '400px', width: '100%' }}>
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
                                <button type="submit" className="btn btn-dark rounded-pill">Ingresar</button>
                            </div>
                        </form>
                        <div className="text-center mt-3">
                            <span>¿No tienes una cuenta?</span>
                            <Link className="navbar-brand fs-6" to="/signup"> Regístrate</Link>
                        </div>
                    </div>
                </div>

                {/* seccion de image */}
                <div
                    className="col-md-6 d-none d-md-block"
                    style={{
                        backgroundImage: 'url(https://media-private.canva.com/dtmvk/MAGZSbdtmvk/1/p.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJWF6QO3UH4PAAJ6Q%2F20241216%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241216T105046Z&X-Amz-Expires=51754&X-Amz-Signature=a5e5db1954af31046790803a856fbefd33ffd5d8aef6e12d774783377298f451&X-Amz-SignedHeaders=host%3Bx-amz-expected-bucket-owner&response-expires=Tue%2C%2017%20Dec%202024%2001%3A13%3A20%20GMT)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                ></div>
            </div>
        </div>
    );
};

export default Login;
