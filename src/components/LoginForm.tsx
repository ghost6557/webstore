'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';

import InputField from './InputField';
import styles from './LoginForm.module.scss';

const initialForm = { name: '', email: '', password: '' };

const LoginForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState(initialForm);
  const [error, setError] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setFormValues(initialForm);
      if (showLogin) {
        const res = await signIn('login', {
          redirect: false,
          email: formValues.email,
          password: formValues.password,
        });

        setLoading(false);

        if (!res?.error) {
          document.body.style.overflow = 'unset';
          router.push(callbackUrl);
        } else {
          setError('invalid email or password');
        }
      } else {
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
        setShowLogin((showLogin) => !showLogin);
      }
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
    <div className={styles['login-container']}>
      <div className={styles['h1']}>
        <h1>{showLogin ? 'Вход в аккаунт' : 'Регистрация'}</h1>
      </div>
      <form className={styles['form-container']} onSubmit={handleSubmit}>
        {error && <p>{error}</p>}
        <div>
          {!showLogin && (
            <InputField
              required={true}
              name="name"
              value={formValues.name}
              onChange={handleChange}
              id="login"
              label="Логин"
            />
          )}
          <InputField
            required={true}
            name="email"
            value={formValues.email}
            onChange={handleChange}
            id="email"
            label="Email"
            type="email"
          />
          <InputField
            required={true}
            name="password"
            value={formValues.password}
            onChange={handleChange}
            id="password"
            label="Пароль"
            type="password"
          />
        </div>
        <div className={styles['container-btn-submit']}>
          <button
            type="submit"
            className={styles['btn-submit']}
            disabled={loading}
          >
            {loading ? 'Вход...' : showLogin ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </div>
      </form>

      <div className={styles['form-footer']}>
        <div>
          {!showLogin ? 'Есть аккаунт? ' : ''}
          <span
            className={styles['form-footer__action']}
            onClick={() => {
              setFormValues(initialForm);
              setShowLogin((showLogin) => !showLogin);
              setError('');
            }}
          >
            {showLogin ? 'Регистрация' : 'Войти'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
