import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, LayoutDashboard, Search } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'text-teal-600 bg-teal-50 border-teal-100' : 'text-slate-600 hover:text-teal-600 hover:bg-slate-50';
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-teal-600 p-2 rounded-xl group-hover:bg-teal-700 transition-colors shadow-inner">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-xl tracking-tight text-slate-900">
                ProofHire <span className="text-teal-600">AI</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-transparent ${isActive('/')}`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <Link
              to="/compare"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-transparent ${isActive('/compare')}`}
            >
              <Users className="w-4 h-4" />
              Compare
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
