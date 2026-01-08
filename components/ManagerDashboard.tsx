
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area,
  Cell 
} from 'recharts';
import { 
  FileSpreadsheet, FileText, Map as MapIcon, Users, MessageSquare, 
  Download, Search, Sparkles, MapPin, CheckCircle, RefreshCcw, User, Loader2,
  FileDown, Navigation, Store, Star, Globe, Heart, BellRing, ExternalLink, TrendingUp, Info
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Feedback, FeedbackRating } from '../types';
import { analyzeFeedback } from '../services/geminiService';

interface ManagerDashboardProps { feedbacks: Feedback[]; }

const KIBABO_ORANGE = '#f39200';

// Official List of all 40 Kibabo Stores mapped to simulated Luanda coordinates
const ALL_STORES = [
  { id: '1', name: '1 de Maio', x: 48, y: 38, rating: 4.7, lat: -8.8250, lng: 13.2350 },
  { id: '2', name: 'Vila Alice', x: 46, y: 40, rating: 4.5, lat: -8.8290, lng: 13.2420 },
  { id: '3', name: 'São Paulo', x: 50, y: 36, rating: 4.6, lat: -8.8180, lng: 13.2400 },
  { id: '4', name: 'Kinaxixe', x: 45, y: 35, rating: 4.8, lat: -8.8150, lng: 13.2280 },
  { id: '5', name: 'Galerias Mutaba', x: 44, y: 37, rating: 4.9, lat: -8.8190, lng: 13.2250 },
  { id: '6', name: 'Mutamba Lusiada', x: 43, y: 38, rating: 4.7, lat: -8.8195, lng: 13.2240 },
  { id: '7', name: 'Serpa Pinto', x: 47, y: 37, rating: 4.4, lat: -8.8210, lng: 13.2380 },
  { id: '8', name: 'Ingombota', x: 46, y: 33, rating: 4.8, lat: -8.8120, lng: 13.2300 },
  { id: '9', name: 'Maianga', x: 44, y: 42, rating: 4.7, lat: -8.8350, lng: 13.2250 },
  { id: '10', name: 'Largo da Maianga', x: 45, y: 43, rating: 4.6, lat: -8.8360, lng: 13.2260 },
  { id: '11', name: 'Cassenda', x: 42, y: 48, rating: 4.5, lat: -8.8550, lng: 13.2150 },
  { id: '12', name: 'Morro Bento', x: 38, y: 55, rating: 4.6, lat: -8.8850, lng: 13.2050 },
  { id: '13', name: 'Samba', x: 40, y: 50, rating: 4.5, lat: -8.8650, lng: 13.2100 },
  { id: '14', name: 'Nova Vida', x: 48, y: 58, rating: 4.7, lat: -8.9050, lng: 13.2550 },
  { id: '15', name: 'Talatona', x: 42, y: 65, rating: 4.9, lat: -8.9350, lng: 13.2150 },
  { id: '16', name: 'Patriota', x: 45, y: 72, rating: 4.8, lat: -8.9550, lng: 13.2350 },
  { id: '17', name: 'Benfica Rua BFA', x: 35, y: 78, rating: 4.6, lat: -8.9850, lng: 13.1850 },
  { id: '18', name: 'Benfica Rua do Mercado', x: 36, y: 80, rating: 4.4, lat: -8.9900, lng: 13.1900 },
  { id: '19', name: 'Imperio', x: 58, y: 45, rating: 4.7, lat: -8.8600, lng: 13.2900 },
  { id: '20', name: 'Kilamba Viaduto', x: 55, y: 80, rating: 4.7, lat: -9.0050, lng: 13.2850 },
  { id: '21', name: 'Kilamba Bloco A4', x: 56, y: 81, rating: 4.8, lat: -9.0060, lng: 13.2860 },
  { id: '22', name: 'Kilamba Bloco Q3', x: 57, y: 82, rating: 4.6, lat: -9.0070, lng: 13.2870 },
  { id: '23', name: 'Kilamba Bloco S7', x: 58, y: 83, rating: 4.7, lat: -9.0080, lng: 13.2880 },
  { id: '24', name: 'Kilamba Bloco W12', x: 54, y: 82, rating: 4.9, lat: -9.0090, lng: 13.2840 },
  { id: '25', name: 'Kilamba Bloco G14', x: 53, y: 81, rating: 4.5, lat: -9.0100, lng: 13.2830 },
  { id: '26', name: 'Kilamba Bloco X2', x: 52, y: 80, rating: 4.8, lat: -9.0110, lng: 13.2820 },
  { id: '27', name: 'Kilamba KK5000', x: 52, y: 85, rating: 4.8, lat: -9.0250, lng: 13.2750 },
  { id: '28', name: 'Camama', x: 60, y: 65, rating: 4.4, lat: -8.9450, lng: 13.3150 },
  { id: '29', name: 'Jardim do Edem 2 Banco BIC', x: 62, y: 68, rating: 4.6, lat: -8.9500, lng: 13.3250 },
  { id: '30', name: 'Jardim Edem 1 Condominio', x: 63, y: 69, rating: 4.7, lat: -8.9520, lng: 13.3270 },
  { id: '31', name: 'Jardim Rosas', x: 65, y: 70, rating: 4.8, lat: -8.9550, lng: 13.3300 },
  { id: '32', name: 'Bairro Popular', x: 55, y: 45, rating: 4.5, lat: -8.8450, lng: 13.2650 },
  { id: '33', name: 'Viana', x: 75, y: 55, rating: 4.5, lat: -8.9050, lng: 13.3850 },
  { id: '34', name: 'Sequele Rua 3 BIC', x: 80, y: 24, rating: 4.7, lat: -8.8060, lng: 13.4560 },
  { id: '35', name: 'Sequele Rua 3 Praça', x: 81, y: 25, rating: 4.6, lat: -8.8070, lng: 13.4570 },
  { id: '36', name: 'Sequele Rua 1 Administração', x: 82, y: 26, rating: 4.5, lat: -8.8080, lng: 13.4580 },
  { id: '37', name: 'Sequele Rua 1 BFA', x: 80, y: 25, rating: 4.6, lat: -8.8050, lng: 13.4550 },
  { id: '38', name: 'Vida Pacifica', x: 78, y: 60, rating: 4.7, lat: -8.9200, lng: 13.4000 },
  { id: '39', name: 'Zango', x: 85, y: 75, rating: 4.3, lat: -9.0050, lng: 13.5050 },
  { id: '40', name: 'Avenida Brasil', x: 52, y: 40, rating: 4.7, lat: -8.8350, lng: 13.2550 },
];

const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ feedbacks }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string>(new Date().toLocaleTimeString());
  const [isExporting, setIsExporting] = useState(false);
  const [tableSearchTerm, setTableSearchTerm] = useState('');
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [selectedStoreOnMap, setSelectedStoreOnMap] = useState<typeof ALL_STORES[0] | null>(null);
  const [showLiveNotification, setShowLiveNotification] = useState(false);
  
  const dashboardRef = useRef<HTMLDivElement>(null);
  const prevFeedbacksLength = useRef(feedbacks.length);

  useEffect(() => {
    if (feedbacks.length > prevFeedbacksLength.current) {
      setShowLiveNotification(true);
      setIsSyncing(true);
      setLastSync(new Date().toLocaleTimeString());
      const timer = setTimeout(() => {
        setShowLiveNotification(false);
        setIsSyncing(false);
      }, 4000);
      prevFeedbacksLength.current = feedbacks.length;
      return () => clearTimeout(timer);
    }
  }, [feedbacks.length]);

  const averageNps = useMemo(() => {
    if (feedbacks.length === 0) return 0;
    const promoters = feedbacks.filter(f => f.npsScore >= 9).length;
    const detractors = feedbacks.filter(f => f.npsScore <= 6).length;
    return Math.round(((promoters - detractors) / feedbacks.length) * 100);
  }, [feedbacks]);

  const trafficData = [
    { time: '08:00', clients: 120 },
    { time: '10:00', clients: 250 },
    { time: '12:00', clients: 410 },
    { time: '14:00', clients: 320 },
    { time: '16:00', clients: 480 },
    { time: '18:00', clients: 590 },
    { time: '20:00', clients: 150 },
  ];

  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter(f => 
      f.customer?.name.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
      f.storeLocation.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
      f.comment?.toLowerCase().includes(tableSearchTerm.toLowerCase())
    );
  }, [feedbacks, tableSearchTerm]);

  const storeSpecificData = useMemo(() => {
    if (!selectedStoreOnMap) return null;
    const storeFeedbacks = feedbacks.filter(f => 
      f.storeLocation.toLowerCase().includes(selectedStoreOnMap.name.toLowerCase())
    );
    const last5 = storeFeedbacks.slice(0, 5).reverse().map((f, i) => ({
      index: i + 1,
      score: f.npsScore 
    }));
    const count = storeFeedbacks.length;
    
    let summary = "Feedback insuficiente para análise individual.";
    if (count > 0) {
      const avg = storeFeedbacks.reduce((acc, f) => acc + f.npsScore, 0) / count;
      if (avg >= 8.5) summary = "Vizinhos extremamente satisfeitos com o atendimento.";
      else if (avg < 6) summary = "Necessário foco em redução de filas e reposição.";
      else summary = "Operação estável com boa aceitação dos vizinhos.";
    }
    return { last5, summary, count };
  }, [selectedStoreOnMap, feedbacks]);

  const startRoute = (store?: typeof ALL_STORES[0]) => {
    const s = store || selectedStoreOnMap;
    if (s) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`, '_blank');
    }
  };

  const handleAIAnalysis = async () => {
    setIsAnalyzing(true);
    const result = await analyzeFeedback(feedbacks);
    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

  const handleManualSync = () => {
    setIsSyncing(true);
    setIsTableLoading(true);
    setTimeout(() => {
      setIsSyncing(false);
      setIsTableLoading(false);
      setLastSync(new Date().toLocaleTimeString());
    }, 1500);
  };

  const handleExportPDF = async () => {
    if (!dashboardRef.current || isExporting) return;
    try {
      setIsExporting(true);
      const canvas = await html2canvas(dashboardRef.current, { scale: 2, useCORS: true, backgroundColor: '#f8f9fa' });
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const ratio = Math.min(pdfWidth / canvas.width, pdfHeight / canvas.height);
      pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width * ratio, canvas.height * ratio);
      pdf.save(`Relatorio-Kibabo-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const KPICard = ({ label, val, trend, icon: Icon, color, bg, info }: any) => (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative">
      {/* Informative Tooltip */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 transform group-hover:-translate-y-4 z-40 w-48">
        <div className="bg-black text-white px-4 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-center shadow-2xl border border-[#f39200]/30 relative">
          <div className="flex items-center justify-center gap-2 mb-1 text-[#f39200]">
            <Info size={12} />
            <span>Info Métrica</span>
          </div>
          {info}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-black rotate-45 border-r border-b border-[#f39200]/30"></div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className={`p-3 ${bg} ${color} rounded-2xl group-hover:scale-110 transition-transform`}>
          <Icon size={24} />
        </div>
        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <h4 className="text-4xl font-black text-gray-900">{val}</h4>
        <span className="text-[10px] font-black uppercase px-2 py-1 rounded-lg bg-gray-100 text-gray-400">
          {trend}
        </span>
      </div>
    </div>
  );

  return (
    <div ref={dashboardRef} className="p-10 space-y-10 animate-fadeIn bg-[#f8f9fa] relative">
      
      {/* Live Toast Notification */}
      {showLiveNotification && (
        <div className="fixed top-8 right-8 z-[100] animate-slideInRight">
          <div className="bg-black text-white px-8 py-5 rounded-3xl shadow-2xl flex items-center gap-5 border border-orange-500/30 backdrop-blur-xl">
            <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center animate-bounce">
              <BellRing size={24} className="text-black" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-orange-500">Fluxo em Tempo Real</p>
              <p className="text-sm font-bold">Novo vizinho detectado na rede!</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">
            Dashboard <span className="text-[#f39200]">Performance</span>
          </h1>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.3em] mt-2">Visão 360º de todas as 40 lojas</p>
        </div>
        <div className="flex items-center gap-3 no-print">
           <button 
             onClick={handleManualSync} 
             className={`p-3 bg-white hover:bg-gray-50 rounded-2xl transition-all shadow-sm border border-gray-100 hover:scale-110 active:scale-95 ${isSyncing ? 'animate-spin text-orange-600' : 'text-gray-400'}`}
           >
             <RefreshCcw size={20} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard 
          label="NPS Médio" val={`${averageNps}%`} trend="Lealdade" icon={Heart} color="text-red-500" bg="bg-red-50" 
          info="Score de recomendação baseado na escala 0-10 de todos os vizinhos." 
        />
        <KPICard 
          label="Feedbacks" val={feedbacks.length} trend="Total" icon={MessageSquare} color="text-gray-900" bg="bg-gray-100" 
          info="Volume consolidado de avaliações colhidas em todas as unidades ativas." 
        />
        <KPICard 
          label="Lojas Online" val={ALL_STORES.length} trend="Ativas" icon={MapPin} color="text-orange-600" bg="bg-orange-50" 
          info="Número total de unidades Kibabo mapeadas e integradas ao dashboard." 
        />
        <KPICard 
          label="Sinc. Google" val="100%" trend="Cloud" icon={Globe} color="text-green-500" bg="bg-green-50" 
          info="Estado da conectividade entre o totem e o banco de dados Google Sheets." 
        />
      </div>

      {/* Main Map Content - 40 Stores Integrated */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col lg:flex-row min-h-[680px]">
        <div className="flex-1 bg-[#e5e3df] relative overflow-hidden">
          {/* Map Simulation - Google Style */}
          <div className="absolute inset-0 opacity-40">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="gridLarge" width="100" height="100" patternUnits="userSpaceOnUse">
                  <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#fff" strokeWidth="4"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#gridLarge)" />
              <path d="M 0,0 L 40,0 Q 45,30 25,60 L 0,80 Z" fill="#aad3df" />
              <path d="M 60,10 Q 80,5 95,25 L 80,50 L 50,45 Z" fill="#c4d3ab" />
              <line x1="0" y1="50" x2="100%" y2="50" stroke="#fff" strokeWidth="10" />
              <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#fff" strokeWidth="10" />
            </svg>
          </div>

          <div className="absolute inset-0 p-10">
            {ALL_STORES.map((store) => (
              <button
                key={store.id}
                onClick={() => {
                  setSelectedStoreOnMap(store);
                  // Double click or explicit action will trigger route below
                }}
                className="absolute transform -translate-x-1/2 -translate-y-full transition-all hover:scale-150 z-10"
                style={{ left: `${store.x}%`, top: `${store.y}%` }}
              >
                <div className="relative group">
                   <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1.5 bg-black/20 rounded-full blur-[1px]"></div>
                   <div className={`relative flex flex-col items-center transition-all duration-300 ${selectedStoreOnMap?.id === store.id ? 'scale-125' : 'scale-100'}`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center p-1 border-2 shadow-lg transition-colors
                        ${selectedStoreOnMap?.id === store.id ? 'bg-black border-black text-white' : 'bg-white border-[#f39200] text-[#f39200]'}`}>
                        <Store size={12} />
                      </div>
                      <div className={`w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] -mt-[1px]
                        ${selectedStoreOnMap?.id === store.id ? 'border-t-black' : 'border-t-[#f39200]'}`}></div>
                   </div>

                   {/* Quick Route Bubble on Map */}
                   {selectedStoreOnMap?.id === store.id && (
                     <div className="absolute top-[-40px] left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white px-3 py-2 rounded-xl shadow-2xl border border-gray-100 animate-fadeIn z-50">
                        <span className="text-[10px] font-black uppercase text-gray-900 whitespace-nowrap">{store.name}</span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); startRoute(store); }}
                          className="w-6 h-6 bg-[#f39200] rounded-lg flex items-center justify-center text-white hover:bg-black transition-colors"
                        >
                          <Navigation size={12} fill="currentColor" />
                        </button>
                     </div>
                   )}
                </div>
              </button>
            ))}
          </div>

          <div className="absolute bottom-8 left-8">
            <div className="bg-white/90 backdrop-blur p-5 rounded-[2rem] shadow-xl border border-gray-100">
               <h3 className="text-xs font-black uppercase text-gray-900 mb-1">Rede Kibabo Angola</h3>
               <p className="text-[9px] font-bold text-orange-600 uppercase tracking-widest">{ALL_STORES.length} lojas monitoradas ao vivo</p>
            </div>
          </div>
        </div>

        {/* Store Detail Side Panel */}
        <div className="w-full lg:w-[450px] bg-white border-l border-gray-100 p-10 flex flex-col">
          {selectedStoreOnMap ? (
            <div key={selectedStoreOnMap.id} className="space-y-8 animate-slideInRight h-full flex flex-col">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 border border-orange-100">
                  <Store size={32} />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-gray-900 uppercase leading-none tracking-tighter italic">
                    <span className="text-[#f39200]">KIBABO</span> {selectedStoreOnMap.name}
                  </h4>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Sincronizado via Google Earth</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100">
                  <div className="flex items-center gap-2 text-black mb-1">
                    <Star size={14} fill="#f39200" className="text-[#f39200]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Rating</span>
                  </div>
                  <p className="text-3xl font-black text-gray-900">{selectedStoreOnMap.rating}</p>
                </div>
                <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100">
                  <div className="flex items-center gap-2 text-orange-600 mb-1">
                    <Users size={14} fill="currentColor" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Vizinhos</span>
                  </div>
                  <p className="text-3xl font-black text-gray-900">{storeSpecificData?.count || 0}</p>
                </div>
              </div>

              <div className="bg-gray-50/30 p-8 rounded-[2.5rem] border border-gray-100 flex-1">
                <div className="flex items-center justify-between mb-6">
                   <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                     <TrendingUp size={14} className="text-orange-600" />
                     Evolução do NPS
                   </h5>
                </div>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={storeSpecificData?.last5 || []}>
                      <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                        {storeSpecificData?.last5?.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.score >= 9 ? '#22c55e' : entry.score >= 7 ? '#f39200' : '#ef4444'} 
                          />
                        ))}
                      </Bar>
                      <XAxis hide dataKey="index" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={16} className="text-orange-600" />
                    <span className="text-[11px] font-black uppercase text-gray-900">IA Insight:</span>
                  </div>
                  <p className="text-[11px] font-bold text-gray-500 italic leading-relaxed">
                    "{storeSpecificData?.summary}"
                  </p>
                </div>
              </div>

              <div className="space-y-3 mt-auto">
                <button 
                  onClick={() => startRoute()}
                  className="w-full flex items-center justify-center gap-4 py-6 bg-gradient-to-r from-orange-600 to-yellow-400 text-black rounded-3xl text-sm font-black uppercase tracking-widest shadow-xl shadow-orange-100 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <Navigation size={22} fill="currentColor" />
                  Iniciar Rota (Google Maps)
                </button>
                <button 
                  onClick={() => window.open(`https://earth.google.com/web/@${selectedStoreOnMap.lat},${selectedStoreOnMap.lng},400a,35y,0h,0t,0r`, '_blank')}
                  className="w-full flex items-center justify-center gap-4 py-5 bg-black text-white rounded-3xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-900 transition-colors"
                >
                  <Globe size={18} className="text-[#f39200]" />
                  Visualizar no Google Earth
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center px-12 opacity-30">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8">
                 <MapIcon size={48} className="text-gray-300" />
              </div>
              <p className="text-base font-black uppercase tracking-widest leading-tight italic">
                Selecione uma das 40 lojas Kibabo no mapa para visualizar rotas e KPIs detalhados
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Integration Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white p-12 rounded-[3rem] shadow-sm border border-gray-100">
           <div className="flex items-center justify-between mb-12">
             <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">Fluxo de <span className="text-orange-600">Vizinhos</span></h3>
             <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-600"></div>
                <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                <div className="w-3 h-3 rounded-full bg-gray-200"></div>
             </div>
           </div>
           <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficData}>
                  <defs>
                    <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={KIBABO_ORANGE} stopOpacity={0.2}/>
                      <stop offset="95%" stopColor={KIBABO_ORANGE} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="time" stroke="#cbd5e1" fontSize={10} fontWeight="black" axisLine={false} tickLine={false} />
                  <Area type="monotone" dataKey="clients" stroke={KIBABO_ORANGE} strokeWidth={4} fill="url(#colorTraffic)" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col">
           <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-8 italic">Ligações <span className="text-orange-600">Google</span></h3>
           <div className="space-y-4 flex-1">
              <a href="https://sheets.google.com" target="_blank" className="flex items-center justify-between p-6 bg-green-50/50 border border-green-100 rounded-[2rem] hover:scale-105 transition-transform group">
                 <div className="flex items-center gap-4">
                    <FileSpreadsheet size={24} className="text-green-600" />
                    <span className="text-xs font-black uppercase text-gray-900">Google Sheets</span>
                 </div>
                 <ExternalLink size={14} className="text-gray-300 group-hover:text-green-600" />
              </a>
              <a href="https://docs.google.com" target="_blank" className="flex items-center justify-between p-6 bg-blue-50/50 border border-blue-100 rounded-[2rem] hover:scale-105 transition-transform group">
                 <div className="flex items-center gap-4">
                    <FileText size={24} className="text-blue-600" />
                    <span className="text-xs font-black uppercase text-gray-900">Google Docs</span>
                 </div>
                 <ExternalLink size={14} className="text-gray-300 group-hover:text-blue-600" />
              </a>
           </div>
           <button onClick={handleExportPDF} className="mt-8 w-full py-5 bg-black text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-gray-900 transition-colors">
              <FileDown size={18} />
              Exportar Relatório PDF
           </button>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-[3.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-12 py-10 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">Registros de <span className="text-orange-600">Vizinhos</span></h3>
            <div className="flex items-center gap-2 px-3 py-1 bg-orange-50 rounded-full border border-orange-100">
               <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
               <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest">Live Sync Ativo</span>
            </div>
          </div>
          <div className="relative max-w-sm w-full">
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
            <input 
              type="text" 
              placeholder="Pesquisar registros..."
              value={tableSearchTerm}
              onChange={(e) => setTableSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-[1.5rem] text-sm font-bold focus:bg-white focus:border-orange-500 outline-none transition-all"
            />
          </div>
        </div>
        <div className="p-10">
          <div className="space-y-4">
            {filteredFeedbacks.map((f) => {
              const isPremiumRating = f.rating === FeedbackRating.EXCELLENT || f.rating === FeedbackRating.GOOD;
              return (
                <div key={f.id} className="flex flex-col md:flex-row md:items-center gap-6 p-8 rounded-[2.5rem] border-2 border-gray-50/50 bg-gray-50/20 hover:bg-white hover:border-[#f39200]/20 transition-all duration-300 group/row animate-slideInUp">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${isPremiumRating ? 'bg-gradient-to-tr from-orange-600 to-yellow-400 text-black' : 'bg-white text-gray-400'}`}>
                    <User size={24} />
                  </div>
                  <div className="w-56">
                    <p className="text-sm font-black uppercase truncate text-gray-900">{f.customer?.name || 'Anônimo'}</p>
                    <p className="text-[10px] font-black tracking-widest uppercase text-orange-600">{f.storeLocation}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-4 py-2 rounded-xl text-xs font-black ${f.npsScore >= 9 ? 'bg-green-100 text-green-700' : f.npsScore >= 7 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                      NPS {f.npsScore}
                    </span>
                  </div>
                  <div className="flex-1 text-xs text-gray-500 font-bold italic truncate">
                    {f.comment || "Sem relato adicional"}
                  </div>
                  <div className="text-[9px] font-black uppercase text-gray-300">
                    {new Date(f.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
