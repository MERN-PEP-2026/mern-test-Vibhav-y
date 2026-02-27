import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import Input from '../components/ui/Input';

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
    <main className="auth-page">
      <Card className="auth-card">
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>Start your task workspace in seconds.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="ui-alert ui-alert-error">{error}</div>}
          <form onSubmit={handleSubmit} className="form-grid">
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full name"
              required
            />
            <Input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            <Input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              minLength={6}
              required
            />
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Registering...' : 'Register'}
            </Button>
          </form>
          <p className="muted-text">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
};

export default RegisterPage;
