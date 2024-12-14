import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function Signup() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (
      await actions.createUser({
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        gender: gender,
        country: country,
        city: city,
        birthdate: birthdate,
      })
    ) {
      navigate('/login');
    } else {
      alert('Failed to create account');
    }
  };

  return (
    <div className="card horizontal-card">
      <h2>Sign up</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="signup-firstname">Primer Nombre</label>
            <input type="text" id="signup-firstname" name="firstName" required onChange={(event) => setFirstName(event.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="signup-lastname">Apellido</label>
            <input type="text" id="signup-lastname" name="lastName" required onChange={(event) => setLastName(event.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="signup-email">Email</label>
            <input type="email" id="signup-email" name="email" required onChange={(event) => setEmail(event.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="signup-password">Password</label>
            <input type="password" id="signup-password" name="password" required onChange={(event) => setPassword(event.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="signup-confirm-password">Confirm Password</label>
            <input type="password" id="signup-confirm-password" name="confirm-password" required onChange={(event) => setConfirmPassword(event.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="signup-gender">Género</label>
            <select id="signup-gender" name="gender" required onChange={(event) => setGender(event.target.value)}>
              <option value="">Seleccionar</option>
              <option value="male">Masculino</option>
              <option value="female">Femenino</option>
              <option value="other">Otro</option>
              <option value="prefer-not-to-say">Prefiero no decir</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="signup-country">País</label>
            <input type="text" id="signup-country" name="country" required onChange={(event) => setCountry(event.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="signup-city">Ciudad</label>
            <input type="text" id="signup-city" name="city" required onChange={(event) => setCity(event.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="signup-birthdate">Fecha de Nacimiento</label>
            <input type="date" id="signup-birthdate" name="birthdate" required onChange={(event) => setBirthdate(event.target.value)} />
          </div>
        </div>
        <div className="form-group terms">
          <input type="checkbox" id="signup-terms" required onChange={(event) => setTermsAccepted(event.target.checked)} />
          <label htmlFor="signup-terms">
            Acepto las <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">Políticas de Privacidad</a> y los <a href="/terms-of-service" target="_blank" rel="noopener noreferrer">Términos de Servicio</a>
          </label>
        </div>
        <div className="form-actions">
          <button type="submit" disabled={!termsAccepted}>Sign up</button>
        </div>
      </form>
    </div>
  );
}

export default Signup;

