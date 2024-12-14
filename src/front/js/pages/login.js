import React, { useState } from 'react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Aquí se puede añadir la lógica para manejar el login
        console.log('Email:', email);
        console.log('Password:', password);
    };

    return (
        <div className="container-fluid vh-100">
            <div className="row h-100">
                {/* Login Form Section */}
                <div className="col-md-6 d-flex justify-content-center align-items-center bg-light">
                    <div className="card p-4" style={{ maxWidth: '400px', width: '100%' }}>
                        <h3 className="text-center">Iniciar Sesión</h3>
                        <form onSubmit={handleLogin}>
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
                            <small>¿No tienes una cuenta? <a href="#">Regístrate</a></small>
                        </div>
                    </div>
                </div>

                {/* Background Image Section */}
                <div
                    className="col-md-6 d-none d-md-block"
                    style={{
                        backgroundImage: 'url(https://media-private.canva.com/dtmvk/MAGZSbdtmvk/1/p.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJWF6QO3UH4PAAJ6Q%2F20241214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241214T105046Z&X-Amz-Expires=40954&X-Amz-Signature=d9eb2a5bd6d5e06d45c46759c7b527f523c84c0a34ea8cb965ddf648bf38bdb8&X-Amz-SignedHeaders=host%3Bx-amz-expected-bucket-owner&response-expires=Sat%2C%2014%20Dec%202024%2022%3A13%3A20%20GMT)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                ></div>
            </div>
        </div>
    );
};

export default Login;
