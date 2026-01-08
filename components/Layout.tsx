
import React, { useState } from 'react';
import { LayoutDashboard, LogIn, BarChart3, Settings, ShieldCheck } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: 'kiosk' | 'dashboard';
  onViewChange: (view: 'kiosk' | 'dashboard') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onViewChange }) => {
  const [logoError, setLogoError] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8f9fa]">
      {/* Sidebar - Official Kibabo Brand Identity */}
      <nav className="w-full md:w-72 bg-white text-gray-800 flex flex-col p-8 shadow-[10px_0_40px_rgba(0,0,0,0.02)] z-20 border-r border-gray-100">
        <div className="flex flex-col items-center mb-12">
          <div className="p-2 mb-4">
            {!logoError ? (
              <img 
                src="https://files.catbox.moe/p99c1z.png" 
                alt="Logo Kibabo" 
                onError={() => setLogoError(true)}
                className="h-12 w-auto"
              />
            ) : (
              <span className="text-2xl font-black italic tracking-tighter text-[#f39200]">
                KIBABO
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-[#f39200] animate-pulse"></div>
            <span className="text-[9px] font-black tracking-[0.2em] text-gray-400 uppercase">Sistema de Gestão</span>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4 ml-4">Navegação</p>
          
          <button 
            onClick={() => onViewChange('kiosk')}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-bold group ${
              activeView === 'kiosk' 
                ? 'bg-gradient-to-r from-orange-600 to-yellow-400 text-black shadow-lg shadow-orange-100' 
                : 'hover:bg-gray-50 text-gray-500 hover:text-gray-900'
            }`}
          >
            <LogIn size={20} className={activeView === 'kiosk' ? 'text-black' : 'text-gray-400 group-hover:text-orange-600'} />
            <span className="text-sm">Modo Totem</span>
          </button>

          <button 
            onClick={() => onViewChange('dashboard')}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-bold group ${
              activeView === 'dashboard' 
                ? 'bg-black text-white shadow-lg shadow-gray-200' 
                : 'hover:bg-gray-50 text-gray-500 hover:text-gray-900'
            }`}
          >
            <LayoutDashboard size={20} className={activeView === 'dashboard' ? 'text-orange-500' : 'text-gray-400 group-hover:text-orange-600'} />
            <span className="text-sm">Painel Gestor</span>
          </button>
        </div>

        <div className="pt-8 border-t border-gray-100">
          <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <ShieldCheck size={20} className="text-green-500" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-900">ADMIN SEGURO</p>
              <p className="text-[9px] font-bold text-gray-400">v2.4.0 active</p>
            </div>
          </div>
          <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest text-center">© 2024 GRUPO KIBABO</p>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto relative">
        <header className="sticky top-0 bg-white/70 backdrop-blur-xl border-b border-gray-100 px-10 py-5 z-10 hidden md:flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-orange-600"></div>
             <h2 className="font-black text-xs text-gray-900 uppercase tracking-[0.2em]">
               {activeView === 'kiosk' ? 'Interface de Atendimento' : 'Métricas de Performance'}
             </h2>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 bg-white border border-gray-100 px-4 py-2 rounded-xl shadow-sm">
                <BarChart3 size={14} className="text-orange-600" />
                <span>GOOGLE CLOUD SINC</span>
             </div>
             <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors cursor-pointer">
               <Settings size={18} />
             </div>
          </div>
        </header>
        
        <div className="h-[calc(100vh-73px)]">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
