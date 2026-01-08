
import React, { useState } from 'react';
import { User, CreditCard, ArrowRight, Sparkles } from 'lucide-react';
import { Customer } from '../types';

interface WelcomeScreenProps {
  onStart: (customer: Customer) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const [name, setName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [logoError, setLogoError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && cardNumber.trim()) {
      onStart({ name, cardNumber });
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-[#f8f9fa] relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[60%] bg-[#f39200]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[60%] bg-[#f39200]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-2xl w-full bg-white rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.08)] overflow-hidden border border-gray-100 flex flex-col items-center p-12 text-center relative z-10 animate-scaleIn">
        
        {/* Brand Header - Solid Orange KIBABO */}
        <div className="mb-10 w-full flex flex-col items-center">
          <div className="relative mb-6">
            <div className="absolute -inset-6 bg-gradient-to-tr from-[#f39200]/20 to-[#f39200]/5 rounded-full blur-2xl animate-pulse"></div>
            
            <div className="relative z-10 flex items-center justify-center py-4">
               {/* Usando texto direto com cor sólida da marca para garantir fidelidade visual */}
               <span className="text-6xl md:text-7xl font-black italic tracking-tighter text-[#f39200] drop-shadow-sm select-none">
                 KIBABO
               </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter italic">
              Olá, <span className="text-[#f39200]">Vizinho</span>!
            </h2>
            <p className="text-gray-400 font-bold text-sm uppercase tracking-[0.2em]">O Kibabo quer ouvir você</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4 max-w-md">
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
              className="w-full pl-16 pr-8 py-5 bg-gray-50 border-2 border-gray-100 rounded-3xl text-lg font-bold focus:border-[#f39200] focus:bg-white focus:ring-4 focus:ring-orange-50 outline-none transition-all placeholder:text-gray-300"
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
              placeholder="Nº Cartão Kibabo"
              className="w-full pl-16 pr-8 py-5 bg-gray-50 border-2 border-gray-100 rounded-3xl text-lg font-bold focus:border-[#f39200] focus:bg-white focus:ring-4 focus:ring-orange-50 outline-none transition-all placeholder:text-gray-300"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-600 to-yellow-400 text-black py-6 mt-6 rounded-3xl font-black text-xl uppercase tracking-widest shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all flex items-center justify-center gap-4 active:scale-95 group overflow-hidden relative"
          >
            <span className="relative z-10">INICIAR AVALIAÇÃO</span>
            <ArrowRight size={24} className="relative z-10 group-hover:translate-x-2 transition-transform" />
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-gray-50 w-full flex justify-center items-center gap-6 opacity-40">
           <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-[#f39200]" />
              <span className="text-[10px] font-black uppercase tracking-widest">Google AI Integrated</span>
           </div>
           <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
           <span className="text-[10px] font-black uppercase tracking-widest">Kibabo Experience 2.0</span>
        </div>
      </div>

      <div className="fixed top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-600 to-yellow-400"></div>
    </div>
  );
};

export default WelcomeScreen;
