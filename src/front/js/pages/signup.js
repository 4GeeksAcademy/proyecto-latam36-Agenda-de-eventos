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
    <div className='container'>
      <div className="card horizontal-card">
        <h2>Sign up</h2>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="signup-firstname">First Name</label>
              <input
                type="text"
                id="signup-firstname"
                required
                onChange={(event) => setFirstName(event.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="signup-lastname">Last Name</label>
              <input
                type="text"
                id="signup-lastname"
                required
                onChange={(event) => setLastName(event.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="signup-email">Email</label>
              <input
                type="email"
                id="signup-email"
                required
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="signup-password">Password</label>
              <input
                type="password"
                id="signup-password"
                required
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="signup-confirm-password">Confirm Password</label>
              <input
                type="password"
                id="signup-confirm-password"
                required
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="signup-gender">Gender</label>
              <select
                id="signup-gender"
                required
                onChange={(event) => setUserGender(event.target.value)}
              >
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
              <input
                type="text"
                id="signup-country"
                required
                onChange={(event) => setUserCountry(event.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="signup-city">City</label>
              <input
                type="text"
                id="signup-city"
                required
                onChange={(event) => setUserCity(event.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="signup-birthdate">Birthdate</label>
            <input
              type="date"
              id="signup-birthdate"
              required
              onChange={(event) => setBirthdate(event.target.value)}
            />
          </div>

          <div className="form-group terms">
            <input
              type="checkbox"
              id="signup-terms"
              onChange={(event) => setTermsAccepted(event.target.checked)}
            />
            <label htmlFor="signup-terms">
              I accept the{' '}
              <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>{' '}
              and{' '}
              <a href="/terms-of-service" target="_blank" rel="noopener noreferrer">
                Terms of Service
              </a>
            </label>
          </div>

          {termsError && (
            <div className="alert alert-warning">
              You must accept the terms and conditions to sign-up.
            </div>
          )}

          <div className="form-actions">
            <button
              type="submit"
              className="rounded-pill"
            >
              Registrarme
            </button>

        </div>
            <div className="text-center mt-3">
                <span>¿Ya estas Registrado?</span>
                <Link className="navbar-brand fs-6" to="/login"> Login</Link>
            </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
