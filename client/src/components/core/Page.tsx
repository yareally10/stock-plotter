import React from 'react';

const Page: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="max-w-4xl mx-auto my-10 p-5">
    {children}
  </div>
);

export default Page; 