import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div 
        className={`transition-all duration-300 ${sidebarOpen ? 'pl-64' : 'pl-20'}`}
      >
        <Header />
        <main className="p-8 max-w-[1600px] mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
