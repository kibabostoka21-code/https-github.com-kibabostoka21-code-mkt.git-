
import React, { useState, useMemo } from 'react';
import { FeedbackRating, Customer } from '../types';
import { CheckCircle2, Send, ArrowLeft, Store, Search, ChevronRight, ChevronLeft } from 'lucide-react';

interface FeedbackKioskProps {
  customer: Customer | null;
  onSubmit: (rating: FeedbackRating, npsScore: number, comment?: string, storeLocation?: string) => void;
}

const STORES = [
  "1 de Maio", "Vila Alice", "São Paulo", "Kinaxixe", "Galerias Mutaba", "Mutamba Lusiada",
  "Serpa Pinto", "Ingombota", "Maianga", "Largo da Maianga", "Cassenda", "Morro Bento",
  "Samba", "Nova Vida", "Talatona", "Patriota", "Benfica Rua BFA", "Benfica Rua do Mercado",
  "Imperio", "Kilamba Viaduto", "Kilamba Bloco A4", "Kilamba Bloco Q3", "Kilamba Bloco S7",
  "Kilamba Bloco W12", "Kilamba Bloco G14", "Kilamba Bloco X2", "Kilamba KK5000", "Camama",
  "Jardim do Edem 2 Banco BIC", "Jardim Edem 1 Condominio", "Jardim Rosas", "Bairro Popular",
  "Viana", "Sequele Rua 3 BIC", "Sequele Rua 3 Praça", "Sequele Rua 1 Administração",
  "Sequele Rua 1 BFA", "Vida Pacifica", "Zango", "Avenida Brasil"
];

const FeedbackKiosk: React.FC<FeedbackKioskProps> = ({ customer, onSubmit }) => {
  const [step, setStep] = useState<'store' | 'nps' | 'rating' | 'comment' | 'success'>('store');
  const [selectedStore, setSelectedStore] = useState<string>('');
  const [npsScore, setNpsScore] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<FeedbackRating | null>(null);
  const [comment, setComment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStores = useMemo(() => {
    return STORES.filter(store => 
      store.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleStoreSelect = (store: string) => {
    setSelectedStore(store);
    setStep('nps');
  };

  const handleNpsSelect = (score: number) => {
    setNpsScore(score);
  };

  const handleRatingSelect = (rating: FeedbackRating) => {
    setSelectedRating(rating);
    setStep('comment');
  };

  const handleSubmit = () => {
    if (selectedRating && npsScore !== null) {
      onSubmit(selectedRating, npsScore, comment, selectedStore);
      setStep('success');
    }
  };

  const getNpsColor = (score: number) => {
    if (score <= 6) return 'bg-red-100 text-red-600 border-red-200';
    if (score <= 8) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-green-100 text-green-700 border-green-200';
  };

  const ratings = [
    { 
      type: FeedbackRating.POOR, 
      emoji: '😞', 
      label: 'Insatisfeito', 
      color: 'bg-red-50 text-red-500 hover:bg-red-100 border-red-100' 
    },
    { 
      type: FeedbackRating.AVERAGE, 
      emoji: '😐', 
      label: 'Regular', 
      color: 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100 border-yellow-100' 
    },
    { 
      type: FeedbackRating.GOOD, 
      emoji: '😊', 
      label: 'Bom', 
      color: 'bg-orange-50 text-[#f39200] hover:bg-orange-100 border-orange-200' 
    },
    { 
      type: FeedbackRating.EXCELLENT, 
      emoji: '🤩', 
      label: 'Excelente', 
      color: 'bg-orange-100 text-[#f39200] hover:bg-orange-200 border-[#f39200]/30' 
    },
  ];

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-gray-50">
      <div className="max-w-4xl w-full bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden border border-gray-100 flex flex-col h-[85vh]">
        <div className="bg-white border-b border-gray-100 p-8 text-center relative overflow-hidden shrink-0">
          <h2 className="text-4xl font-black text-[#f39200] mb-1 tracking-tighter italic">KIBABO</h2>
          <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Supermercados</p>
        </div>

        <div className="flex-1 overflow-y-auto p-8 md:p-12 scrollbar-hide">
          {step === 'store' && (
            <div className="animate-fadeIn h-full flex flex-col">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-black text-gray-800 mb-2 uppercase tracking-tighter">
                  Em qual loja você está?
                </h3>
                <p className="text-gray-400 font-medium italic">Selecione a unidade do seu atendimento</p>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-gray-400">
                  <Search size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Buscar loja..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[#f39200] outline-none transition-all font-bold"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-8">
                {filteredStores.map((store) => (
                  <button
                    key={store}
                    onClick={() => handleStoreSelect(store)}
                    className="flex items-center justify-between p-5 bg-white border-2 border-gray-50 rounded-2xl hover:border-orange-500 hover:bg-orange-50/30 transition-all group active:scale-95"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-gray-50 text-gray-400 group-hover:bg-[#f39200] group-hover:text-white rounded-lg transition-all">
                        <Store size={18} />
                      </div>
                      <span className="font-black text-gray-700 uppercase tracking-tight text-left">{store}</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-200 group-hover:text-orange-500 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'nps' && (
            <div className="animate-fadeIn h-full flex flex-col items-center justify-center py-4">
              <div className="w-full bg-gray-100 h-2 rounded-full mb-8 relative overflow-hidden">
                <div className="bg-orange-500 h-full w-2/4 transition-all duration-500"></div>
              </div>
              
              <p className="text-gray-400 font-black text-xs uppercase tracking-widest mb-10">Pergunta 2 de 4</p>
              
              <div className="max-w-2xl text-center mb-10">
                <h3 className="text-2xl md:text-3xl font-black text-gray-800 leading-tight">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 text-orange-600 text-lg mr-3">2</span>
                  Numa escala de 0 a 10, qual a probabilidade de recomendar a nossa empresa a um amigo ou colega? *
                </h3>
              </div>

              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {[...Array(11)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleNpsSelect(i)}
                    className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-xl font-black text-xl border-2 transition-all transform active:scale-90 ${
                      npsScore === i 
                        ? 'bg-black text-white border-black scale-110 shadow-lg' 
                        : `${getNpsColor(i)} hover:scale-105`
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>

              <div className="w-full max-w-2xl flex justify-between items-center mb-10 px-4">
                <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase italic">
                  <span>👎 Nada provável</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase italic">
                  <span>Muito provável 👍</span>
                </div>
              </div>

              <div className="flex gap-6 mb-12">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Detratores (0-6)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Neutros (7-8)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Promotores (9-10)</span>
                </div>
              </div>

              <div className="w-full max-w-2xl flex gap-4">
                <button
                  onClick={() => setStep('store')}
                  className="flex-1 flex items-center justify-center gap-3 py-5 bg-white border-2 border-gray-100 text-gray-400 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-50 transition-all"
                >
                  <ChevronLeft size={20} />
                  Anterior
                </button>
                <button
                  disabled={npsScore === null}
                  onClick={() => setStep('rating')}
                  className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg ${
                    npsScore === null 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-orange-600 to-yellow-400 text-black shadow-orange-100 hover:scale-[1.02] active:scale-95'
                  }`}
                >
                  Próxima
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}

          {step === 'rating' && (
            <div className="text-center animate-fadeIn py-4">
              <button 
                onClick={() => setStep('nps')}
                className="mb-8 flex items-center gap-2 text-gray-400 font-bold hover:text-orange-600 transition-colors uppercase text-xs tracking-widest"
              >
                <ArrowLeft size={16} /> Voltar à recomendação
              </button>
              <h3 className="text-3xl font-black text-gray-800 mb-4 uppercase tracking-tighter leading-tight">
                Como foi sua experiência <br/> hoje no <span className="text-[#f39200]">Kibabo</span> {selectedStore}?
              </h3>
              <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest mb-10">Pergunta 3 de 4</p>
              
              <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
                {ratings.map((r) => (
                  <button
                    key={r.type}
                    onClick={() => handleRatingSelect(r.type)}
                    className={`flex flex-col items-center p-8 rounded-[2rem] transition-all border-2 transform hover:scale-105 active:scale-95 shadow-sm ${r.color}`}
                  >
                    <span className="text-6xl mb-4">{r.emoji}</span>
                    <span className="font-black text-xs uppercase tracking-widest">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'comment' && (
            <div className="space-y-8 animate-slideUp py-4">
              <div className="text-center">
                <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest mb-4">Pergunta 4 de 4</p>
                <h3 className="text-3xl font-black text-gray-800 mb-2 italic">Algo a acrescentar?</h3>
                <p className="text-gray-400 font-medium">Seu comentário ajuda a melhorar o <span className="text-[#f39200] font-bold">Kibabo</span> {selectedStore}.</p>
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ex: O atendimento no setor de frescos foi ótimo..."
                className="w-full h-44 p-8 text-xl border-2 border-gray-100 bg-gray-50 rounded-[2rem] focus:border-[#f39200] focus:ring-4 focus:ring-orange-100 outline-none transition-all placeholder:text-gray-300 font-medium"
              />
              <div className="flex flex-col md:flex-row gap-4">
                <button
                  onClick={() => setStep('rating')}
                  className="flex items-center justify-center gap-2 px-8 py-6 bg-gray-100 text-gray-500 rounded-2xl font-bold text-lg hover:bg-gray-200 transition-colors"
                >
                  <ArrowLeft size={20} />
                  Voltar
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 flex items-center justify-center gap-4 py-6 bg-gradient-to-r from-orange-600 to-yellow-400 text-black rounded-2xl font-black text-xl hover:shadow-xl transition-all shadow-orange-100 active:scale-95"
                >
                  <Send size={24} />
                  ENVIAR FEEDBACK
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-10 animate-scaleIn">
              <div className="inline-flex items-center justify-center w-36 h-36 bg-orange-50 text-orange-600 rounded-full mb-8 border-4 border-orange-100">
                <CheckCircle2 size={70} strokeWidth={2.5} />
              </div>
              <h3 className="text-5xl font-black text-gray-900 mb-6 uppercase tracking-tighter italic">Valeu, Vizinho!</h3>
              <p className="text-xl text-gray-400 font-medium max-w-sm mx-auto leading-tight">
                Recebemos sua avaliação da unidade <span className="text-[#f39200] font-bold">Kibabo</span> <span className="text-gray-600 font-bold">{selectedStore}</span>. Volte sempre!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackKiosk;
