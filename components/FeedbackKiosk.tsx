
import React, { useState, useMemo } from 'react';
import { FeedbackRating, Customer } from '../types';
import { CheckCircle2, Send, ArrowLeft, Store, Search, ChevronRight, ChevronLeft, Star, HelpCircle, X, Share2, Mail, Twitter, Facebook } from 'lucide-react';

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

const HELP_CONTENT: Record<string, { title: string, text: string }> = {
  store: {
    title: "Identificação da Loja",
    text: "Selecione a unidade onde você realizou suas compras. Isso nos ajuda a direcionar seu elogio ou sugestão para a equipe correta!"
  },
  nps: {
    title: "Escala de Recomendação",
    text: "O NPS (Net Promoter Score) mede sua lealdade. Notas 9 ou 10 indicam que somos sua escolha preferida. Queremos saber se você nos indicaria para as pessoas que você gosta!"
  },
  rating: {
    title: "Qualidade da Visita",
    text: "Avalie como foi sua experiência geral hoje. Queremos saber se o Kibabo atendeu às suas expectativas de preço, limpeza e variedade."
  },
  comment: {
    title: "Sua Voz em Detalhes",
    text: "Este espaço é seu! Sinta-se à vontade para detalhar o que mais gostou ou o que precisamos melhorar urgentemente."
  }
};

const FeedbackKiosk: React.FC<FeedbackKioskProps> = ({ customer, onSubmit }) => {
  const [step, setStep] = useState<'store' | 'nps' | 'rating' | 'comment' | 'success'>('store');
  const [selectedStore, setSelectedStore] = useState<string>('');
  const [npsScore, setNpsScore] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<FeedbackRating | null>(null);
  const [comment, setComment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

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

  const handleShare = (platform: 'email' | 'twitter' | 'facebook') => {
    const text = encodeURIComponent(`Acabei de avaliar minha experiência no Kibabo ${selectedStore}! #KibaboExperience #SatisfacaoDoVizinho`);
    const url = encodeURIComponent('https://kibabo.ao');
    
    switch (platform) {
      case 'email':
        window.location.href = `mailto:?subject=Minha Experiência no Kibabo&body=Oi! Acabei de dar um feedback para o Kibabo ${selectedStore}. Confira como eles valorizam os vizinhos em ${url}`;
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        break;
    }
    setIsShareModalOpen(false);
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

  const HelpButton = () => (
    <button 
      onClick={() => setIsHelpOpen(true)}
      className="inline-flex items-center justify-center w-10 h-10 ml-3 shrink-0 rounded-full bg-orange-50 text-orange-400 hover:bg-orange-100 hover:text-orange-600 transition-all active:scale-90 border border-orange-100 shadow-sm"
      aria-label="Ajuda"
    >
      <HelpCircle size={22} />
    </button>
  );

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 md:p-10 bg-[#f8f9fa] relative">
      
      {/* Modal de Ajuda Contextual */}
      {isHelpOpen && step !== 'success' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl relative border border-orange-100 animate-[scaleIn_0.3s_ease-out]">
            <button 
              onClick={() => setIsHelpOpen(false)}
              className="absolute top-8 right-8 p-3 bg-gray-50 rounded-2xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all active:scale-90"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-4 mb-6">
               <div className="p-4 bg-orange-100 text-orange-600 rounded-2xl">
                 <HelpCircle size={32} />
               </div>
               <h4 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">
                 {HELP_CONTENT[step]?.title}
               </h4>
            </div>
            <p className="text-gray-500 font-bold text-lg leading-relaxed italic">
              {HELP_CONTENT[step]?.text}
            </p>
            <button 
              onClick={() => setIsHelpOpen(false)}
              className="w-full mt-10 py-5 bg-black text-white rounded-[2rem] font-black uppercase tracking-widest hover:bg-gray-800 transition-all active:scale-95 shadow-xl shadow-gray-200"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Modal de Compartilhamento */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl relative border border-gray-100 animate-[scaleIn_0.3s_ease-out]">
            <button 
              onClick={() => setIsShareModalOpen(false)}
              className="absolute top-8 right-8 p-3 bg-gray-50 rounded-2xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all active:scale-90"
            >
              <X size={20} />
            </button>
            <div className="text-center mb-8">
               <div className="w-16 h-16 bg-orange-50 text-[#f39200] rounded-2xl flex items-center justify-center mx-auto mb-4">
                 <Share2 size={32} />
               </div>
               <h4 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">Compartilhar</h4>
               <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">Sua voz merece ser ouvida!</p>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={() => handleShare('email')}
                className="flex items-center gap-4 p-5 bg-gray-50 rounded-[1.5rem] hover:bg-orange-50 hover:text-orange-600 transition-all group"
              >
                <div className="p-3 bg-white rounded-xl shadow-sm text-gray-400 group-hover:text-orange-600">
                  <Mail size={24} />
                </div>
                <span className="font-black uppercase tracking-widest text-sm italic">Enviar por E-mail</span>
              </button>
              
              <button 
                onClick={() => handleShare('twitter')}
                className="flex items-center gap-4 p-5 bg-gray-50 rounded-[1.5rem] hover:bg-blue-50 hover:text-blue-500 transition-all group"
              >
                <div className="p-3 bg-white rounded-xl shadow-sm text-gray-400 group-hover:text-blue-500">
                  <Twitter size={24} />
                </div>
                <span className="font-black uppercase tracking-widest text-sm italic">Postar no Twitter</span>
              </button>

              <button 
                onClick={() => handleShare('facebook')}
                className="flex items-center gap-4 p-5 bg-gray-50 rounded-[1.5rem] hover:bg-indigo-50 hover:text-indigo-600 transition-all group"
              >
                <div className="p-3 bg-white rounded-xl shadow-sm text-gray-400 group-hover:text-indigo-600">
                  <Facebook size={24} />
                </div>
                <span className="font-black uppercase tracking-widest text-sm italic">Compartilhar no Facebook</span>
              </button>
            </div>
            
            <button 
              onClick={() => setIsShareModalOpen(false)}
              className="w-full mt-8 py-5 border-2 border-gray-100 text-gray-400 rounded-[2rem] font-black uppercase tracking-widest hover:bg-gray-50 transition-all"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="max-w-5xl w-full bg-white rounded-[3rem] md:rounded-[4rem] shadow-[0_40px_100px_rgba(0,0,0,0.1)] overflow-hidden border border-gray-100 flex flex-col h-[90vh] md:h-[85vh]">
        
        {/* Header Consistente */}
        <div className="bg-white border-b border-gray-50 p-6 md:p-10 text-center relative shrink-0 flex items-center justify-center">
          <div className="flex items-center justify-center gap-3">
             <span className="text-3xl md:text-5xl font-black text-[#f39200] tracking-tighter italic">KIBABO</span>
             <div className="h-6 w-[2px] bg-gray-100 rotate-12 mx-2"></div>
             <p className="text-gray-400 font-black text-[10px] md:text-xs uppercase tracking-[0.3em]">Experiência</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-16 scrollbar-hide">
          {step === 'store' && (
            <div className="animate-fadeIn h-full flex flex-col max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <div className="flex items-center justify-center mb-2">
                  <h3 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter italic">
                    Onde você <span className="text-[#f39200]">está?</span>
                  </h3>
                  <HelpButton />
                </div>
                <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Identifique a loja do seu atendimento</p>
              </div>

              <div className="relative mb-10 group">
                <div className="absolute inset-y-0 left-0 pl-8 flex items-center pointer-events-none text-gray-300 group-focus-within:text-[#f39200] transition-colors">
                  <Search size={22} />
                </div>
                <input
                  type="text"
                  placeholder="Pesquisar por bairro ou rua..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-20 pr-10 py-6 bg-gray-50 border-2 border-gray-100 rounded-[2.5rem] focus:border-[#f39200] focus:bg-white focus:ring-8 focus:ring-orange-50 outline-none transition-all font-bold text-lg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-12">
                {filteredStores.map((store) => (
                  <button
                    key={store}
                    onClick={() => handleStoreSelect(store)}
                    className="flex items-center justify-between p-6 bg-white border-2 border-gray-50 rounded-[2rem] hover:border-[#f39200] hover:bg-orange-50/20 transition-all group active:scale-95 shadow-sm"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-gray-50 text-gray-400 group-hover:bg-[#f39200] group-hover:text-black rounded-2xl flex items-center justify-center transition-all">
                        <Store size={22} />
                      </div>
                      <span className="font-black text-gray-800 uppercase tracking-tighter text-left text-lg">{store}</span>
                    </div>
                    <ChevronRight size={22} className="text-gray-200 group-hover:text-[#f39200] transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'nps' && (
            <div className="animate-fadeIn h-full flex flex-col items-center justify-center py-4">
              <div className="w-full max-w-lg bg-gray-100 h-2 rounded-full mb-12 relative overflow-hidden">
                <div className="bg-[#f39200] h-full w-2/4 shadow-[0_0_15px_rgba(243,146,0,0.5)] transition-all duration-700"></div>
              </div>
              
              <div className="text-center mb-12">
                <div className="inline-block px-4 py-1 bg-orange-50 text-[#f39200] rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-orange-100">
                  Etapa 02/04
                </div>
                <div className="flex items-start justify-center text-center">
                  <h3 className="text-2xl md:text-4xl font-black text-gray-900 leading-tight max-w-2xl italic">
                    Numa escala de 0 a 10, qual a probabilidade de recomendar o <span className="text-[#f39200]">Kibabo</span> a um amigo?
                  </h3>
                  <HelpButton />
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3 mb-10">
                {[...Array(11)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleNpsSelect(i)}
                    className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-[1.2rem] font-black text-2xl border-2 transition-all transform active:scale-90 ${
                      npsScore === i 
                        ? 'bg-black text-white border-black scale-125 shadow-2xl z-10' 
                        : 'bg-white text-gray-400 border-gray-100 hover:border-[#f39200] hover:text-[#f39200] hover:scale-110 shadow-sm'
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>

              <div className="w-full max-w-2xl flex justify-between items-center mb-16 px-4">
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">Nada Provável 👎</span>
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">Muito Provável 👍</span>
              </div>

              <div className="w-full max-w-xl flex gap-4">
                <button onClick={() => setStep('store')} className="flex-1 flex items-center justify-center gap-3 py-6 bg-gray-50 text-gray-400 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all">
                  <ChevronLeft size={20} /> Voltar
                </button>
                <button
                  disabled={npsScore === null}
                  onClick={() => setStep('rating')}
                  className={`flex-1 flex items-center justify-center gap-3 py-6 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all ${
                    npsScore === null 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-orange-600 to-yellow-400 text-black shadow-2xl shadow-orange-100 hover:scale-[1.05] active:scale-95'
                  }`}
                >
                  Continuar <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}

          {step === 'rating' && (
            <div className="text-center animate-fadeIn flex flex-col items-center justify-center h-full">
              <div className="mb-10 text-center">
                <div className="flex items-center justify-center mb-4">
                  <h3 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter leading-none italic">
                    Como foi sua <span className="text-[#f39200]">visita?</span>
                  </h3>
                  <HelpButton />
                </div>
                <div className="flex items-center justify-center gap-2 mb-10">
                   <Star size={18} fill="#f39200" className="text-[#f39200]" />
                   <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em]">{selectedStore}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6 md:gap-8 max-w-3xl w-full">
                {ratings.map((r) => (
                  <button
                    key={r.type}
                    onClick={() => handleRatingSelect(r.type)}
                    className={`flex flex-col items-center p-10 md:p-14 rounded-[3rem] transition-all border-2 shadow-sm active:scale-95 group hover:scale-105 ${r.color}`}
                  >
                    <span className="text-7xl md:text-8xl mb-6 transform group-hover:scale-110 transition-transform">{r.emoji}</span>
                    <span className="font-black text-sm md:text-base uppercase tracking-widest">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'comment' && (
            <div className="animate-slideInUp flex flex-col items-center justify-center h-full max-w-3xl mx-auto space-y-12">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <h3 className="text-3xl md:text-5xl font-black text-gray-900 italic uppercase tracking-tighter">Algum <span className="text-[#f39200]">comentário?</span></h3>
                  <HelpButton />
                </div>
                <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Sua voz ajuda a melhorar o Kibabo de todos nós</p>
              </div>

              <div className="w-full relative">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Conte-nos o que achou dos preços, atendimento ou qualidade dos produtos..."
                  className="w-full h-56 md:h-64 p-10 text-xl border-2 border-gray-100 bg-gray-50 rounded-[3rem] focus:border-[#f39200] focus:bg-white focus:ring-12 focus:ring-orange-50 outline-none transition-all placeholder:text-gray-300 font-medium shadow-inner"
                />
              </div>

              <div className="w-full flex flex-col md:flex-row gap-5">
                <button onClick={() => setStep('rating')} className="px-10 py-6 bg-gray-50 text-gray-400 rounded-[2.5rem] font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all flex items-center justify-center gap-3">
                  <ArrowLeft size={18} /> Voltar
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 flex items-center justify-center gap-5 py-6 bg-black text-white rounded-[2.5rem] font-black text-lg md:text-xl uppercase tracking-[0.2em] shadow-2xl hover:bg-gray-900 transition-all active:scale-95"
                >
                  <Send size={24} className="text-[#f39200]" />
                  Finalizar Avaliação
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-10 h-full flex flex-col items-center justify-center animate-[scaleIn_0.5s_ease-out]">
              <div className="relative mb-12">
                 <div className="absolute -inset-10 bg-orange-100 rounded-full blur-3xl animate-ping"></div>
                 <div className="relative w-44 h-44 bg-gradient-to-tr from-orange-600 to-yellow-400 text-black rounded-full flex items-center justify-center shadow-[0_25px_60px_-15px_rgba(243,146,0,0.6)]">
                    <CheckCircle2 size={90} strokeWidth={2.5} />
                 </div>
              </div>
              <h3 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 uppercase tracking-tighter italic">Valeu, <span className="text-[#f39200]">Vizinho!</span></h3>
              <p className="text-xl md:text-2xl text-gray-400 font-bold max-w-lg mx-auto leading-tight uppercase tracking-tight mb-8">
                Recebemos sua avaliação da unidade <span className="text-black">{selectedStore}</span>.
              </p>
              
              <div className="flex flex-col gap-4 w-full max-w-sm">
                <button 
                  onClick={() => setIsShareModalOpen(true)}
                  className="flex items-center justify-center gap-4 py-5 bg-white border-2 border-gray-100 text-gray-900 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:border-[#f39200] hover:text-[#f39200] transition-all active:scale-95 shadow-sm"
                >
                  <Share2 size={20} /> Compartilhar Experiência
                </button>
                
                <div className="flex items-center justify-center gap-3 px-6 py-3 bg-gray-50 rounded-full">
                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sincronizado com o Sucesso do Cliente</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackKiosk;
