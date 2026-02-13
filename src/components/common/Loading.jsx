// src/components/common/Loading.jsx
import React from 'react';
import PageBackground from './PageBackground';

const Loading = ({ text = 'Loading...' }) => {
  return (
    <PageBackground contentClassName="flex items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-secondary-light rounded-full"></div>
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <p className="mt-6 text-brown-light font-medium text-lg">{text}</p>
      </div>
    </PageBackground>
  );
};

export default Loading;