import React from 'react';
import { Toaster } from 'sonner';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-right" richColors />
      {children}
    </div>
  );
}