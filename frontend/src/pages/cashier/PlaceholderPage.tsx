import React from 'react';

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-400">{title}</h1>
        <p className="text-gray-500 text-sm">This page is under construction.</p>
      </div>
    </div>
  );
};

export default PlaceholderPage;
