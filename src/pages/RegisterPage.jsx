// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import AuthForm from '../components/auth/AuthForm';

const RegisterIcon = () => (
  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="20" y1="8" x2="20" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="23" y1="11" x2="17" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password || !confirmPassword) {
      setError('Semua field harus diisi');
      return;
    }

    if (password !== confirmPassword) {
      setError('Password tidak cocok');
      return;
    }

    setLoading(true);

    try {
      await authService.register(username.trim(), password);
      alert('Registrasi berhasil! Silakan login.');
      navigate('/login');
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
      placeholder: 'Minimal 3 karakter',
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
      placeholder: 'Minimal 6 karakter'
    },
    {
      name: 'confirmPassword',
      type: 'password',
      label: 'Konfirmasi Password',
      value: confirmPassword,
      onChange: (e) => {
        setConfirmPassword(e.target.value);
        setError('');
      },
      placeholder: 'Ulangi password'
    }
  ];

  return (
    <AuthForm
      title="Buat Akun Baru"
      subtitle="Daftar untuk memulai quiz"
      fields={fields}
      error={error}
      loading={loading}
      onSubmit={handleSubmit}
      submitText={loading ? 'Mendaftar...' : 'Daftar'}
      footerText="Sudah punya akun?"
      footerLinkText="Login di sini"
      footerLinkTo="/login"
      headerIcon={<RegisterIcon />}
      topStripColor="#7F5539"
    />
  );
};

export default RegisterPage;