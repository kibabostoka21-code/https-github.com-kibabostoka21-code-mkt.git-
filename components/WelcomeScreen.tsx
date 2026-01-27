
import React, { useState } from 'react';
import { User, CreditCard, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { Customer } from '../types';

interface WelcomeScreenProps {
  onStart: (customer: Customer) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const [name, setName] = useState('');
  const [cardNumber, setCardNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && cardNumber.trim()) {
      onStart({ name, cardNumber });
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 md:p-8 bg-[#f8f9fa] relative overflow-hidden">
      {/* Elementos Decorativos de Fundo */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[80%] bg-[#f39200]/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[70%] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-2xl w-full bg-white rounded-[3rem] md:rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.06)] overflow-hidden border border-gray-100 flex flex-col items-center p-8 md:p-16 text-center relative z-10 animate-scaleIn">
        
        {/* Branding Central */}
        <div className="mb-12 w-full flex flex-col items-center">
          <div className="relative mb-8">
            <div className="absolute -inset-10 bg-gradient-to-tr from-[#f39200]/20 to-yellow-400/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="relative z-10">
               <span className="text-6xl md:text-8xl font-black italic tracking-tighter text-[#f39200] drop-shadow-sm select-none">
                 KIBABO
               </span>
            </div>
          </div>
          
          <div className="space-y-3">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter italic leading-tight">
              Olá, <span className="text-[#f39200]">Vizinho</span>!
            </h2>
            <p className="text-gray-400 font-bold text-xs md:text-sm uppercase tracking-[0.3em] max-w-xs mx-auto">
              Sua opinião ajuda a construir um Kibabo cada vez melhor
            </p>
          </div>
        </div>

        {/* Formulário de Identificação */}
        <form onSubmit={handleSubmit} className="w-full space-y-5 max-w-md">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-7 flex items-center pointer-events-none text-gray-300 group-focus-within:text-[#f39200] transition-colors">
              <User size={22} />
            </div>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Qual o seu nome?"
              className="w-full pl-16 pr-8 py-5 md:py-6 bg-gray-50 border-2 border-gray-100 rounded-[2rem] text-lg font-bold focus:border-[#f39200] focus:bg-white focus:ring-8 focus:ring-orange-50 outline-none transition-all placeholder:text-gray-300 shadow-sm"
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-7 flex items-center pointer-events-none text-gray-300 group-focus-within:text-[#f39200] transition-colors">
              <CreditCard size={22} />
            </div>
            <input
              type="text"
              required
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="Nº Cartão Kibabo ou BI"
              className="w-full pl-16 pr-8 py-5 md:py-6 bg-gray-50 border-2 border-gray-100 rounded-[2rem] text-lg font-bold focus:border-[#f39200] focus:bg-white focus:ring-8 focus:ring-orange-50 outline-none transition-all placeholder:text-gray-300 shadow-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-600 to-yellow-400 text-black py-6 md:py-7 mt-4 rounded-[2rem] font-black text-lg md:text-xl uppercase tracking-widest shadow-2xl shadow-orange-200/50 hover:-translate-y-2 hover:shadow-orange-300/40 transition-all flex items-center justify-center gap-4 active:scale-95 group overflow-hidden relative"
          >
            <span className="relative z-10">INICIAR AVALIAÇÃO</span>
            <ArrowRight size={24} className="relative z-10 group-hover:translate-x-2 transition-transform" />
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
        </form>

        {/* Rodapé Informativo */}
        <div className="mt-16 pt-10 border-t border-gray-50 w-full flex flex-col md:flex-row justify-center items-center gap-6 opacity-40">
           <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#f39200]" />
              <span className="text-[10px] font-black uppercase tracking-widest">IA Strategic Integrated</span>
           </div>
           <div className="hidden md:block w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
           <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-green-500" />
              <span className="text-[10px] font-black uppercase tracking-widest">Ambiente Seguro & Privado</span>
           </div>
        </div>
      </div>

      {/* Barra de Progresso Superior */}
      <div className="fixed top-0 left-0 w-full h-2 bg-gray-100">
        <div className="h-full bg-gradient-to-r from-orange-600 to-yellow-400 w-[10%] animate-pulse"></div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
