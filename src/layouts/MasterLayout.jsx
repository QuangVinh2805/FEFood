import React from 'react';

function MasterLayout({ children }) {
  return (
    <main className="container my-5">
      {children}
    </main>
  );
}

export default MasterLayout;