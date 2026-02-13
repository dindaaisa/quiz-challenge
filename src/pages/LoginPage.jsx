// src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import AuthForm from '../components/auth/AuthForm';

const LoginIcon = () => (
  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/intro');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Username dan password harus diisi');
      return;
    }

    setLoading(true);

    try {
      await authService.login(username.trim(), password);
      navigate('/intro');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      name: 'username',
      type: 'text',
      label: 'Username',
      value: username,
      onChange: (e) => {
        setUsername(e.target.value);
        setError('');
      },
      placeholder: 'Masukkan username',
      autoFocus: true
    },
    {
      name: 'password',
      type: 'password',
      label: 'Password',
      value: password,
      onChange: (e) => {
        setPassword(e.target.value);
        setError('');
      },
      placeholder: 'Masukkan password'
    }
  ];

  return (
    <AuthForm
      title="Selamat Datang Kembali"
      subtitle="Masuk untuk melanjutkan quiz"
      fields={fields}
      error={error}
      loading={loading}
      onSubmit={handleSubmit}
      submitText="Masuk"
      footerText="Belum punya akun?"
      footerLinkText="Daftar sekarang"
      footerLinkTo="/register"
      headerIcon={<LoginIcon />}
      topStripColor="#7F5539"
    />
  );
};

export default LoginPage;
