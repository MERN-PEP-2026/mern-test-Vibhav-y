import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { register, error, setError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setError(null);
  }, [setError]);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="card">
        <h1 className="page-heading">Create an account</h1>
        {error && <div className="toast error">{error}</div>}
        <form onSubmit={handleSubmit} className="form-grid">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full name"
            required
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            minLength={6}
            required
          />
          <button className="primary" type="submit" disabled={submitting}>
            {submitting ? 'Registering…' : 'Register'}
          </button>
        </form>
        <p className="small-text">
          Already have an account? <Link to="/login">Sign in.</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
