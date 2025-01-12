import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from "../store/appContext";
import "../../styles/authRequired.css";

const AuthRequired = ({ onClose }) => {
  const { actions } = useContext(Context);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userGender, setUserGender] = useState('');
  const [userCountry, setUserCountry] = useState('Colombia');
  const [userCity, setUserCity] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const backend = process.env.BACKEND_URL;


  const validateAndContinue = (currentStep) => {
    setErrorMessage('');
    
    // Validaciones por paso
    switch (currentStep) {
      case 1:
        if (!email || !email.includes('@')) {
          setErrorMessage('Por favor ingresa un correo electrónico válido');
          return;
        }
        break;
      
      case 2:
        if (!isLogin) {
          if (!firstName.trim()) {
            setErrorMessage('El nombre es obligatorio');
            return;
          }
          if (!lastName.trim()) {
            setErrorMessage('El apellido es obligatorio');
            return;
          }
        }
        break;
      
      case 3:
        if (!birthdate) {
          setErrorMessage('La fecha de nacimiento es obligatoria');
          return;
        }
        if (!userGender) {
          setErrorMessage('El género es obligatorio');
          return;
        }
        if (!userCountry) {
          setErrorMessage('El Pais es obligatorio');
          return;
        }
        if (!userCity) {
          setErrorMessage('La ciudad es obligatoria');
          return;
        }
        break;
    }

    setStep(currentStep + 1);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const response = await fetch(`${backend}/api/users/token`, {
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
      const token = data['access token'];
      actions.setToken(token);
      localStorage.setItem('token', token);

      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    if (password.length < 8) {
      setErrorMessage('La contraseña debe tener al menos 8 caracteres.');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      setIsLoading(false);
      return;
    }

    if (!termsAccepted) {
      setErrorMessage('Debes aceptar los términos y condiciones.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${backend}/api/users`, {
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
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('¡Registro exitoso! Redirigiendo al inicio de sesión...');
        setTimeout(() => {
          setIsLogin(true);
          setStep(2);
          setPassword('');
          setConfirmPassword('');
          setFirstName('');
          setLastName('');
          setUserGender('');
          setUserCity('');
          setBirthdate('');
          setTermsAccepted(false);
        }, 2000);
      } else {
        setErrorMessage(data.message || 'No se pudo crear la cuenta.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Ocurrió un error inesperado. Por favor, intenta de nuevo más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const AuthTitle = ({ option, page }) => (
    <div className="titleLoginRegister">
      {option === 'register' ? (
        <div className="auth-title">
          <h1>
            <span className="bold">Registrate</span> y enterate de todos los espectáculos y eventos que{' '}
            <span className="bold">SON PARA TI.</span>
          </h1>
        </div>
      ) : (
        <div className="auth-title">
          <h1>
            {page === 'EventsForm' ? (
              <>
                <span className="bold">Inicia Sesión</span> para crear tu evento y descubre todos los espectáculos y eventos que{' '}
                <span className="bold">SON PARA TI.</span>
              </>
            ) : (
              <>
                <span className="bold">Inicia Sesión</span> y descubre todos los espectáculos y eventos que{' '}
                <span className="bold">SON PARA TI.</span>
              </>
            )}
          </h1>
        </div>
      )}
      <br />
      <div>
        <h1>
          Si eres{' '}
          <span className="bold">artista, productor o dueño de un local</span>, difundí tus eventos a{' '}
          <span className="bold">MILES</span> de personas.
        </h1>
      </div>
    </div>
  );
  
  

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="auth-step">
            <AuthTitle option="register" />
            <div className="registerDetail">
              <div className="inputContainerRegisterDetail">
                <input 
                  type="email" 
                  placeholder="Ingresa tu correo" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
              <div className="auth-buttons">
                <button onClick={() => {
                  if (email && email.includes('@')) {
                    setIsLogin(false);
                    setStep(2);
                  } else {
                    setErrorMessage('Por favor ingresa un correo electrónico válido');
                  }
                }}>Registrarme</button>
              </div>
              <div className="auth-buttons">
                <button onClick={() => {
                  if (email && email.includes('@')) {
                    setIsLogin(true);
                    setStep(2);
                  } else {
                    setErrorMessage('Por favor ingresa un correo electrónico válido');
                  }
                }}>Ya tengo cuenta</button>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="auth-step">
            <AuthTitle option={isLogin ? "login" : "register"} />
            {isLogin ? (
              <div className="registerDetail">
                <div className="inputContainerRegisterDetail">
                  <input
                    type="email"
                    placeholder="Ingresa tu correo"
                    value={email}
                    readOnly
                    required
                  />
                  <input
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="auth-buttons">
                   <button onClick={() => validateAndContinue(2)}>Continuar</button>
               </div>
              </div>
            ) : (
              <div className="registerDetail">
                <div className="inputContainerRegisterDetail">
                  <input
                    type="email"
                    placeholder="Ingresa tu correo"
                    value={email}
                    readOnly
                    required
                  />
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Apellido"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
                <div className="auth-buttons">
                  <button onClick={() => validateAndContinue(2)}>Continuar</button>
                </div>
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="auth-step">
            <AuthTitle option="register" />
            <div className="registerDetail">
              <div className="inputContainerRegisterDetail">
                <input
                  type="date"
                  placeholder="Fecha de nacimiento"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  required
                />
              </div>
              <div className="selectContainerRegisterDetail">
                <select
                  value={userGender}
                  onChange={(e) => setUserGender(e.target.value)}
                  required
                >
                  <option value="">Género</option>
                  <option value="Male">Masculino</option>
                  <option value="Female">Femenino</option>
                  <option value="Other">Otro</option>
                </select>
                <select
                  value={userCountry}
                  onChange={(e) => setUserCountry(e.target.value)}
                  required
                >
                  <option value="Colombia">Colombia</option>
                </select>
                <select
                  value={userCity}
                  onChange={(e) => setUserCity(e.target.value)}
                  required
                >
                  <option value="">Ciudad</option>
                  <option value="Bogotá">Bogotá</option>
                  <option value="Medellín">Medellín</option>
                  <option value="Cali">Cali</option>
                </select>
              </div>
              <div className="auth-buttons">
               <button onClick={() => validateAndContinue(3)}>Continuar</button>
             </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="auth-step">
            <AuthTitle option="register" />
            <div className="registerDetail">
              <div className="inputContainerRegisterDetail">
                <input
                  type="password"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Confirma tu contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="terms-container">
                <label className="terms-label">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    required
                  />
                  <span>Acepto los términos y condiciones</span>
                </label>
              </div>
              <div className="auth-buttons">
                <button onClick={handleSignup} disabled={isLoading}>
                  Registrarme
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="auth-required-modal">
      <div className="auth-overlay"></div>
      <div className="auth-message">
        <div className="auth-dark-overlay"></div>
        <button 
          className="auth-close-button" 
          onClick={onClose}
          disabled={isLoading}
        >
          X
        </button>
        <div className="auth-content">
          {renderStepContent()}
          {errorMessage && (
            <div className="alert alert-danger">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="alert alert-success">
              {successMessage}
            </div>
          )}
          {isLoading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthRequired;