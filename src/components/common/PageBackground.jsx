// src/components/common/PageBackground.jsx
import React from 'react';
import bgPattern from '../../assets/bg-quiz.png';

const PageBackground = ({ children, className = '', contentClassName = '' }) => {
  return (
    <div className={`relative w-full ${className}`}>
      {/* Background layer dibuat FIXED supaya tetap nempel di layar walau konten scroll */}
      <div className="fixed inset-0 -z-10">
        {/* Layer 1 */}
        <div className="absolute inset-0 bg-gradient-to-br from-earth-cream via-earth-cream to-earth-sand" />

        {/* Layer 2 */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${bgPattern})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: '105% auto',
            opacity: 0.5,
            mixBlendMode: 'multiply',
          }}
        />

        {/* Layer 3 */}
        <div className="absolute inset-0 bg-[#F6F2EA]/50" />
      </div>

      {/* Scroll container (ini yang bikin semua page bisa scroll) */}
      <div className={`h-screen w-full overflow-y-auto px-3 py-3 ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default PageBackground;
