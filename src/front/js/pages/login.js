import React, { useState } from 'react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('https://special-waddle-p554vx9pwvvfrp6q-3001.app.github.dev/api/login', {
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

            // Guarda el token en localStorage o en el estado global
            localStorage.setItem('accessToken', data['access token']);

            // Redirige o actualiza el estado de autenticación
            console.log('Inicio de sesión exitoso');
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        <div className="container-fluid vh-100">
            <div className="row h-100">
                {/* Login Form Section */}
                <div className="col-md-6 d-flex justify-content-center align-items-center bg-light">
                    <div className="card p-4" style={{ maxWidth: '400px', width: '100%' }}>
                        <h3 className="text-center">Iniciar Sesión</h3>
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
                            <small>¿No tienes una cuenta? <a href="https://improved-bassoon-x56jx6pww426969-3000.app.github.dev/Signup">Regístrate</a></small>
                        </div>
                    </div>
                </div>

                {/* Background Image Section */}
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
