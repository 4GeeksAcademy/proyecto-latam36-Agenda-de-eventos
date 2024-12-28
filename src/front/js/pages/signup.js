import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userGender, setUserGender] = useState('');
  const [userCountry, setUserCountry] = useState('');
  const [userCity, setUserCity] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [termsError, setTermsError] = useState(false);
  const navigate = useNavigate();


  const backend=process.env.BACKEND_URL


  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setTermsError(false);

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (!termsAccepted) {
      setErrorMessage('You must accept the terms and conditions.');
      return;
    }

    if (!birthdate) {
      setErrorMessage('Birthdate is required.');
      return;
    }

    try {
      const response = await fetch(backend+'/api/signup', 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            first_name: firstName,
            last_name: lastName,
            user_gender: userGender,
            user_country: userCountry,
            user_city: userCity,
            birthdate,
          }),
        }
      );
      

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setErrorMessage(data.message || 'Failed to create account.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex flex-column">
    <div className="row h-100">
        <div className="col-md-6 d-flex justify-content-center align-items-center">
            <div className="Signup card p-4" style={{ maxWidth: '600px', width: '100%' }}>
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
                <h3 className="text-center fw-bold">Registrarse</h3>
                <form onSubmit={handleSubmit}>
                    {errorMessage && (
                        <div className="alert alert-danger" role="alert">
                            {errorMessage}
                        </div>
                    )}
                    {successMessage && (
                        <div className="alert alert-success" role="alert">
                            {successMessage}
                        </div>
                    )}
                    <div className="row">
                        <div className="col-12 col-md-6 mb-3">
                            <label htmlFor="signup-firstname" className="form-label">Nombre</label>
                            <input
                                type="text"
                                className="form-control"
                                id="signup-firstname"
                                placeholder="Ingresa tu nombre"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-12 col-md-6 mb-3">
                            <label htmlFor="signup-lastname" className="form-label">Apellido</label>
                            <input
                                type="text"
                                className="form-control"
                                id="signup-lastname"
                                placeholder="Ingresa tu apellido"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-12 col-md-6 mb-3">
                            <label htmlFor="signup-email" className="form-label">Correo Electrónico</label>
                            <input
                                type="email"
                                className="form-control"
                                id="signup-email"
                                placeholder="Ingresa tu correo"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-12 col-md-6 mb-3">
                            <label htmlFor="signup-password" className="form-label">Contraseña</label>
                            <input
                                type="password"
                                className="form-control"
                                id="signup-password"
                                placeholder="Ingresa tu contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-12 col-md-6 mb-3">
                            <label htmlFor="signup-confirm-password" className="form-label">Confirmar Contraseña</label>
                            <input
                                type="password"
                                className="form-control"
                                id="signup-confirm-password"
                                placeholder="Confirma tu contraseña"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-12 col-md-6 mb-3">
                            <label htmlFor="signup-gender" className="form-label">Género</label>
                            <select
                                className="form-select"
                                id="signup-gender"
                                value={userGender}
                                onChange={(e) => setUserGender(e.target.value)}
                                required
                            >
                                <option value="">Selecciona</option>
                                <option value="Male">Masculino</option>
                                <option value="Female">Femenino</option>
                                <option value="Other">Otro</option>
                            </select>
                        </div>
                        <div className="col-12 col-md-6 mb-3">
                            <label htmlFor="signup-country" className="form-label">País</label>
                            <input
                                type="text"
                                className="form-control"
                                id="signup-country"
                                placeholder="Ingresa tu país"
                                value={userCountry}
                                onChange={(e) => setUserCountry(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-12 col-md-6 mb-3">
                            <label htmlFor="signup-city" className="form-label">Ciudad</label>
                            <input
                                type="text"
                                className="form-control"
                                id="signup-city"
                                placeholder="Ingresa tu ciudad"
                                value={userCity}
                                onChange={(e) => setUserCity(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-12 mb-3">
                            <label htmlFor="signup-birthdate" className="form-label">Fecha de Nacimiento</label>
                            <input
                                type="date"
                                className="form-control"
                                id="signup-birthdate"
                                value={birthdate}
                                onChange={(e) => setBirthdate(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-check mb-3">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="signup-terms"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="signup-terms">
                            Acepto los términos y condiciones
                        </label>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        Registrarse
                    </button>
                </form>
            </div>
        </div>
        <div
            className="col-md-6 d-none d-md-block"
            style={{
                backgroundImage: 'url(https://res.cloudinary.com/dj6gqmozm/image/upload/f_auto,q_auto/j6y49ciylsfqym1mg34k)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        ></div>
    </div>
</div>

);
}

export default Signup;



