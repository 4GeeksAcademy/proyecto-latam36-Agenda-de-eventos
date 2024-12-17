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
      console.error('Passwords do not match');
      return;
    }

    if (!termsAccepted) {
      console.error('You must accept the terms and conditions');
      return;
    }

    try {
      const response = await fetch('https://bookish-umbrella-7644qqwvqq6c6rv-3001.app.github.dev/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          user_gender: gender,
          user_country: country,
          user_city: city,
          birthdate,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data.message);  // Mostrar el mensaje de éxito en la consola
        navigate('/login');
      } else {
        console.error(data.message || 'Failed to create account');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className='container'>
      <div className="card horizontal-card">
        <h2>Sign up</h2>
        <form onSubmit={handleSubmit}>
          {/* Todos los campos del formulario */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="signup-firstname">First Name</label>
              <input type="text" id="signup-firstname" name="firstName" required onChange={(event) => setFirstName(event.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="signup-lastname">Last Name</label>
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
              <label htmlFor="signup-gender">Gender</label>
              <select id="signup-gender" name="gender" required onChange={(event) => setGender(event.target.value)}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="signup-country">Country</label>
              <input type="text" id="signup-country" name="country" required onChange={(event) => setCountry(event.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="signup-city">City</label>
              <input type="text" id="signup-city" name="city" required onChange={(event) => setCity(event.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="signup-birthdate">Birthdate</label>
              <input type="date" id="signup-birthdate" name="birthdate" required onChange={(event) => setBirthdate(event.target.value)} />
            </div>
          </div>
          <div className="form-group terms">
            <input type="checkbox" id="signup-terms" required onChange={(event) => setTermsAccepted(event.target.checked)} />
            <label htmlFor="signup-terms">
              I accept the <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and the <a href="/terms-of-service" target="_blank" rel="noopener noreferrer">Terms of Service</a>
            </label>
          </div>
          <div className="form-actions">
            <button type="submit" className='rounded-pill' disabled={!termsAccepted}>Sign up</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
