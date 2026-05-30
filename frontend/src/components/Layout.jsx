import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    window.localStorage?.setItem('theme', 'light');
  }, []);

  return (
    <div className="proofhire-app min-h-screen bg-[#f6f8fb] text-[#071b3a]">
      <style>{`
        html.dark .proofhire-app,
        html.dark .proofhire-app main {
          background: #f6f8fb !important;
          color: #071b3a !important;
        }

        html.dark .proofhire-app aside,
        html.dark .proofhire-app header,
        html.dark .proofhire-app .bg-white {
          background-color: #ffffff !important;
          color: #071b3a !important;
          border-color: #e2e8f0 !important;
        }

        html.dark .proofhire-app h1,
        html.dark .proofhire-app h2,
        html.dark .proofhire-app h3,
        html.dark .proofhire-app .text-slate-900,
        html.dark .proofhire-app .text-\\[\\#071b3a\\] {
          color: #071b3a !important;
        }

        html.dark .proofhire-app .text-slate-500,
        html.dark .proofhire-app .text-slate-600,
        html.dark .proofhire-app .text-slate-400 {
          color: #64748b !important;
        }

        html.dark .proofhire-app input,
        html.dark .proofhire-app select,
        html.dark .proofhire-app textarea {
          background-color: #f8faff !important;
          color: #071b3a !important;
          border-color: #e2e8f0 !important;
        }
      `}</style>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div 
        className={`transition-all duration-300 ${sidebarOpen ? 'pl-64' : 'pl-20'}`}
      >
        <Header />
        <main className="mx-auto max-w-[1500px] p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
