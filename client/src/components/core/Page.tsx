import React from 'react';

const Page: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ maxWidth: 900, margin: '24px auto', padding: 20 }}>
    {children}
  </div>
);

export default Page; 