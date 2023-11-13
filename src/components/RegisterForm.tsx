'use client';

import { signIn } from 'next-auth/react';
import { ChangeEvent, useState } from 'react';

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormValues({ name: '', email: '', password: '' });
    console.log(formValues);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        body: JSON.stringify(formValues),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setLoading(false);
      if (!res.ok) {
        setError((await res.json()).message);
        return;
      }

      signIn(undefined, { callbackUrl: '/' });
    } catch (error: any) {
      setLoading(false);
      setError(error);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className={''}>{error}</p>}
      <div className={''}>
        <input
          required
          type="name"
          name="name"
          value={formValues.name}
          onChange={handleChange}
          placeholder="Name"
          className={''}
        />
      </div>
      <div className={''}>
        <input
          required
          type="email"
          name="email"
          value={formValues.email}
          onChange={handleChange}
          placeholder="Email address"
          className={''}
        />
      </div>
      <div className={''}>
        <input
          required
          type="password"
          name="password"
          value={formValues.password}
          onChange={handleChange}
          placeholder="Password"
          className={''}
        />
      </div>
      <button
        type="submit"
        style={{ backgroundColor: `${loading ? '#ccc' : '#3446eb'}` }}
        className={''}
        disabled={loading}
      >
        {loading ? 'loading...' : 'Sign Up'}
      </button>
    </form>
  );
};

export default RegisterForm;
