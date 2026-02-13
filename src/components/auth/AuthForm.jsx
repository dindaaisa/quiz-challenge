// src/components/auth/AuthForm.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import PageBackground from '../common/PageBackground';

const DefaultIcon = () => (
  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AuthForm = ({
  title,
  subtitle,
  fields,
  error,
  loading,
  onSubmit,
  submitText,
  footerText,
  footerLinkText,
  footerLinkTo,
  headerIcon,
  topStripColor = '#7F5539',
}) => {
  return (
    <PageBackground contentClassName="flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="card overflow-hidden animate-[slideUp_0.5s_ease] flex flex-col">
          {/* top strip */}
          <div className="h-12" style={{ backgroundColor: topStripColor }} />

          <div className="p-10">
            {/* header */}
            <div className="text-center mb-10">
              <div className="w-16 h-16 mx-auto mb-6 bg-primary rounded-2xl flex items-center justify-center shadow-earth-sm">
                {headerIcon || <DefaultIcon />}
              </div>
              <h1 className="text-2xl font-bold text-brown mb-2">{title}</h1>
              <p className="text-brown-light text-sm">{subtitle}</p>
            </div>

            {/* form */}
            <form onSubmit={onSubmit} className="space-y-4 mb-6">
              {fields.map((field) => (
                <div key={field.name}>
                  <label htmlFor={field.name} className="block text-sm font-semibold text-brown mb-2">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={field.placeholder}
                    className={`input-field ${error ? 'input-field-error' : ''}`}
                    autoFocus={field.autoFocus}
                    disabled={loading}
                  />
                </div>
              ))}

              {error && (
                <div className="bg-red-50 border-l-4 border-sienna p-3 rounded-lg">
                  <p className="text-sm text-sienna font-medium">{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full btn btn-primary text-base py-3.5 mt-6"
                disabled={loading}
              >
                {loading ? 'Memproses...' : submitText}
              </button>
            </form>

            {/* footer */}
            <div className="text-center pt-6 border-t border-secondary-light/30">
              <p className="text-sm text-brown-light">
                {footerText}{' '}
                <Link
                  to={footerLinkTo}
                  className="text-primary font-semibold hover:text-primary-dark transition-colors"
                >
                  {footerLinkText}
                </Link>
              </p>
            </div>

          </div>
        </div>
      </div>
    </PageBackground>
  );
};

export default AuthForm;
