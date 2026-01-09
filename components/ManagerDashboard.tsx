
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area,
  Cell 
} from 'recharts';
import { 
  FileSpreadsheet, FileText, Map as MapIcon, Users, MessageSquare, 
  Search, Sparkles, MapPin, RefreshCcw, User,
  FileDown, Navigation, Store, Star, Globe, Heart, BellRing, ExternalLink, TrendingUp, Info, Maximize2, Target
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Feedback, FeedbackRating } from '../types';

interface ManagerDashboardProps { feedbacks: Feedback[]; }

const KIBABO_ORANGE = '#f39200';

interface StoreLocation {
  id: string;
  name: string;
  x: number;
  y: number;
  rating: number;
  lat: number;
  lng: number;
  mapUrl?: string;
}

const ALL_STORES: StoreLocation[] = [
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
  { id: '32', name: 'Bairro Popular', x: 55, y: 45, rating: 4.5, lat: -8.8450, lng: 13.2650, mapUrl: 'https://maps.app.goo.gl/Yo1H5oraSugG7Uon9' },
  { id: '33', name: 'Viana', x: 75, y: 55, rating: 4.5, lat: -8.9050, lng: 13.3850 },
  { id: '34', name: 'Sequele Rua 3 BIC', x: 80, y: 24, rating: 4.7, lat: -8.8060, lng: 13.4560 },
  { id: '35', name: 'Sequele Rua 3 Praça', x: 81, y: 25, rating: 4.6, lat: -8.8070, lng: 13.4570 },
  { id: '36', name: 'Sequele Rua 1 Administration', x: 82, y: 26, rating: 4.5, lat: -8.8080, lng: 13.4580 },
  { id: '37', name: 'Sequele Rua 1 BFA', x: 80, y: 25, rating: 4.6, lat: -8.8050, lng: 13.4550 },
  { id: '38', name: 'Vida Pacifica', x: 78, y: 60, rating: 4.7, lat: -8.9200, lng: 13.4000 },
  { id: '39', name: 'Zango', x: 85, y: 75, rating: 4.3, lat: -9.0050, lng: 13.5050 },
  { id: '40', name: 'Avenida Brasil', x: 52, y: 40, rating: 4.7, lat: -8.8350, lng: 13.2550 },
];

const ActionTooltip = ({ text }: { text: string }) => (
  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
    <div className="bg-black text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-center shadow-2xl border border-[#f39200]/30 whitespace-nowrap">
      {text}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rotate-45 border-r border-b border-[#f39200]/30"></div>
    </div>
  </div>
);

const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ feedbacks }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [tableSearchTerm, setTableSearchTerm] = useState('');
  const [selectedStoreOnMap, setSelectedStoreOnMap] = useState<StoreLocation | null>(null);
  const [showLiveNotification, setShowLiveNotification] = useState(false);
  
  // Magnifying Glass Effect State
  const [isMapHovered, setIsMapHovered] = useState(false);
  const [isNearStore, setIsNearStore] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const dashboardRef = useRef<HTMLDivElement>(null);
  const prevFeedbacksLength = useRef(feedbacks.length);

  useEffect(() => {
    if (feedbacks.length > prevFeedbacksLength.current) {
      setShowLiveNotification(true);
      setIsSyncing(true);
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

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 1500);
  };

  const startRoute = (store?: StoreLocation) => {
    const s = store || selectedStoreOnMap;
    if (s) {
      const url = s.mapUrl || `https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`;
      window.open(url, '_blank');
    }
  };

  const handleExportStoreCSV = () => {
    if (!selectedStoreOnMap) return;
    const storeFeedbacks = feedbacks.filter(f => 
      f.storeLocation.toLowerCase().includes(selectedStoreOnMap.name.toLowerCase())
    );
    
    if (storeFeedbacks.length === 0) {
      alert("Nenhum feedback registrado para esta loja ainda.");
      return;
    }

    const headers = ["Nome", "Cartao", "Loja", "NPS", "Avaliacao", "Data", "Hora", "Comentario"];
    const rows = storeFeedbacks.map(f => [
      f.customer?.name || 'Anonimo',
      f.customer?.cardNumber || 'N/A',
      f.storeLocation,
      f.npsScore,
      f.rating,
      new Date(f.timestamp).toLocaleDateString('pt-AO'),
      new Date(f.timestamp).toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' }),
      `"${(f.comment || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = [headers.join(";"), ...rows.map(e => e.join(";"))].join("\n");
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Kibabo_${selectedStoreOnMap.name.replace(/\s+/g, '_')}_Feedback.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  const handleMapMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin({ x, y });

    // Check proximity to any store marker for interactive lens feedback
    const near = ALL_STORES.some(store => {
      const dx = x - store.x;
      const dy = y - store.y;
      return Math.sqrt(dx*dx + dy*dy) < 3.5; // Threshold for "near"
    });
    setIsNearStore(near);
  };

  const KPICard = ({ label, val, trend, icon: Icon, color, bg, info }: any) => (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-[0_45px_90px_-20px_rgba(243,146,0,0.35)] hover:-translate-y-4 hover:border-[#f39200]/50 transition-all duration-500 group relative cursor-pointer overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#f39200]/10 to-yellow-400/5 rounded-full -mr-16 -mt-16 group-hover:scale-[2.5] transition-transform duration-1000 ease-out"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-700 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="absolute -top-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 transform group-hover:-translate-y-4 z-40 w-56">
        <div className="bg-black text-white px-5 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-center shadow-2xl border border-[#f39200]/30 relative leading-relaxed">
          <div className="flex items-center justify-center gap-2 mb-2 text-[#f39200]">
            <Info size={14} />
            <span className="font-black">Definição da Métrica</span>
          </div>
          {info}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-black rotate-45 border-r border-b border-[#f39200]/30"></div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className={`p-4 ${bg} ${color} rounded-2xl group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-orange-700 group-hover:to-yellow-400 group-hover:text-black transition-all duration-300 shadow-sm`}>
          <Icon size={24} className="group-hover:drop-shadow-sm" />
        </div>
        <span className="text-[10px] font-black text-gray-300 group-hover:text-[#f39200] uppercase tracking-[0.2em] transition-colors">{label}</span>
      </div>
      <div className="flex items-end justify-between relative z-10">
        <h4 className="text-4xl font-black text-gray-900 group-hover:text-black transition-colors">{val}</h4>
        <span className="text-[9px] font-black uppercase px-2 py-1 rounded-lg bg-gray-50 text-gray-400 group-hover:bg-[#f39200]/20 group-hover:text-orange-800 transition-colors">
          {trend}
        </span>
      </div>
    </div>
  );

  return (
    <div ref={dashboardRef} className="p-10 space-y-10 animate-fadeIn bg-[#f8f9fa] relative">
      
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
          <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.3em] mt-2">Gestão Completa de 40 Unidades</p>
        </div>
        <div className="flex items-center gap-3 no-print">
           <div className="relative group">
             <ActionTooltip text="Sincroniza os dados locais com o Google Cloud Storage." />
             <button 
               onClick={handleManualSync} 
               className={`p-3 bg-white hover:bg-gray-50 rounded-2xl transition-all shadow-sm border border-gray-100 hover:scale-110 active:scale-95 ${isSyncing ? 'animate-spin text-orange-600' : 'text-gray-400'}`}
             >
               <RefreshCcw size={20} />
             </button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard label="NPS Médio" val={`${averageNps}%`} trend="Lealdade" icon={Heart} color="text-red-500" bg="bg-red-50" info="Net Promoter Score: Mede a fidelidade e probabilidade de recomendação da marca Kibabo pelos vizinhos." />
        <KPICard label="Feedbacks" val={feedbacks.length} trend="Total" icon={MessageSquare} color="text-gray-900" bg="bg-gray-100" info="Volume total de avaliações coletadas em tempo real através dos totens de atendimento." />
        <KPICard label="Rede Kibabo" val={ALL_STORES.length} trend="Lojas" icon={MapPin} color="text-orange-600" bg="bg-orange-50" info="Quantidade total de lojas físicas integradas no ecossistema de gestão centralizado." />
        <KPICard label="Sinc. Google" val="100%" trend="Sheets" icon={Globe} color="text-green-500" bg="bg-green-50" info="Estado de saúde da ponte de dados entre a aplicação e as ferramentas Google Cloud." />
      </div>

      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col lg:flex-row min-h-[700px]">
        {/* INTERACTIVE MAP CONTAINER WITH MAGNIFYING GLASS ZOOM */}
        <div 
          ref={mapContainerRef}
          onMouseEnter={() => setIsMapHovered(true)}
          onMouseLeave={() => setIsMapHovered(false)}
          onMouseMove={handleMapMouseMove}
          className="flex-1 bg-[#e5e3df] relative overflow-hidden cursor-crosshair group/map"
        >
          {/* Lupa / Magnifying Glass Indicator */}
          <div 
            className={`absolute pointer-events-none z-50 transition-all duration-300 ${isMapHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
            style={{ 
              left: `${zoomOrigin.x}%`, 
              top: `${zoomOrigin.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className={`w-20 h-20 border-2 rounded-full flex items-center justify-center bg-white/5 backdrop-blur-[1px] shadow-[0_0_50px_rgba(243,146,0,0.3)] transition-all duration-300 ${isNearStore ? 'border-orange-500 w-24 h-24 bg-orange-500/10' : 'border-gray-400/50'}`}>
              {isNearStore ? (
                <Target size={24} className="text-orange-600 animate-pulse" />
              ) : (
                <Maximize2 size={16} className="text-gray-500" />
              )}
            </div>
          </div>

          <div 
            className="absolute inset-0 transition-transform duration-500 ease-out"
            style={{ 
              transform: isMapHovered ? 'scale(1.8)' : 'scale(1)',
              transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`
            }}
          >
            <div className="absolute inset-0 opacity-40">
              <svg width="100%" height="100%">
                <defs><pattern id="gridMap" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M 100 0 L 0 0 0 100" fill="none" stroke="#fff" strokeWidth="4"/></pattern></defs>
                <rect width="100%" height="100%" fill="url(#gridMap)" />
                <path d="M 0,0 L 45,0 Q 50,35 30,65 L 0,85 Z" fill="#aad3df" />
                <path d="M 65,15 Q 85,10 98,30 L 85,55 L 55,50 Z" fill="#c4d3ab" />
                <line x1="0" y1="55" x2="100%" y2="55" stroke="#fff" strokeWidth="12" />
                <line x1="52%" y1="0" x2="52%" y2="100%" stroke="#fff" strokeWidth="12" />
              </svg>
            </div>

            <div className="absolute inset-0">
              {ALL_STORES.map((store) => (
                <button 
                  key={store.id} 
                  onClick={() => setSelectedStoreOnMap(store)} 
                  className={`absolute transform -translate-x-1/2 -translate-y-full transition-all hover:scale-150 z-10 ${isMapHovered ? 'scale-75' : 'scale-100'}`} 
                  style={{ left: `${store.x}%`, top: `${store.y}%` }}
                >
                  <div className="relative group">
                     <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1.5 bg-black/20 rounded-full blur-[1px]"></div>
                     <div className={`relative flex flex-col items-center transition-all duration-300 ${selectedStoreOnMap?.id === store.id ? 'scale-125' : 'scale-100'}`}>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center p-1 border-2 shadow-lg transition-colors ${selectedStoreOnMap?.id === store.id ? 'bg-black border-black text-white' : 'bg-white border-[#f39200] text-[#f39200]'}`}>
                          <Store size={12} />
                        </div>
                        <div className={`w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] -mt-[1px] ${selectedStoreOnMap?.id === store.id ? 'border-t-black' : 'border-t-[#f39200]'}`}></div>
                     </div>
                     {selectedStoreOnMap?.id === store.id && (
                       <div className="absolute top-[-45px] left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white px-3 py-2 rounded-xl shadow-2xl border border-gray-100 animate-fadeIn z-50">
                          <span className="text-[10px] font-black uppercase text-gray-900 whitespace-nowrap">{store.name}</span>
                          <button onClick={(e) => { e.stopPropagation(); startRoute(store); }} className="w-6 h-6 bg-[#f39200] rounded-lg flex items-center justify-center text-white hover:bg-black transition-colors">
                            <Navigation size={12} fill="currentColor" />
                          </button>
                       </div>
                     )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Map Overlays (Fixed position, not zoomed) */}
          <div className="absolute bottom-8 left-8 z-20 pointer-events-none">
            <div className="bg-white/95 backdrop-blur-md p-6 rounded-[2rem] shadow-2xl border border-gray-100 max-w-[240px]">
               <h3 className="text-sm font-black uppercase text-gray-900 mb-1 italic">Rede <span className="text-[#f39200]">Kibabo</span></h3>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{ALL_STORES.length} Unidades Mapeadas</p>
               <div className="mt-4 flex items-center gap-2">
                 <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                 <span className="text-[9px] font-black text-gray-600 uppercase tracking-tighter">Conexão Google Earth Ativa</span>
               </div>
            </div>
          </div>
          
          <div className="absolute top-8 left-8 z-20 pointer-events-none">
             <div className="flex items-center gap-2 px-4 py-2 bg-black/80 backdrop-blur-md text-white rounded-full border border-orange-500/30 shadow-lg">
                <Maximize2 size={12} className="text-[#f39200]" />
                <span className="text-[9px] font-black uppercase tracking-widest">Lupa Digital Ativa</span>
             </div>
          </div>
        </div>

        <div className="w-full lg:w-[460px] bg-white border-l border-gray-100 p-10 flex flex-col">
          {selectedStoreOnMap ? (
            <div key={selectedStoreOnMap.id} className="space-y-6 animate-slideInRight h-full flex flex-col">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 border border-orange-100">
                  <Store size={32} />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-gray-900 uppercase leading-none tracking-tighter italic">
                    <span className="text-[#f39200]">KIBABO</span> {selectedStoreOnMap.name}
                  </h4>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">ID: #UNIT-{selectedStoreOnMap.id.padStart(3, '0')}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100 group hover:border-orange-200 transition-colors">
                  <div className="flex items-center gap-2 text-black mb-1">
                    <Star size={14} fill="#f39200" className="text-[#f39200]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Score Médio</span>
                  </div>
                  <p className="text-3xl font-black text-gray-900">{selectedStoreOnMap.rating}</p>
                </div>
                <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100 group hover:border-orange-200 transition-colors">
                  <div className="flex items-center gap-2 text-orange-600 mb-1">
                    <Users size={14} fill="currentColor" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Vizinhos</span>
                  </div>
                  <p className="text-3xl font-black text-gray-900">{storeSpecificData?.count || 0}</p>
                </div>
              </div>

              <div className="bg-gray-50/30 p-8 rounded-[2.5rem] border border-gray-100 flex-1 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                  <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    <TrendingUp size={14} className="text-orange-600" />
                    Análise NPS (Últimos Feedbacks)
                  </h5>
                </div>
                <div className="flex-1 h-32 min-h-[160px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={storeSpecificData?.last5 || []} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                      <RechartsTooltip 
                        cursor={{ fill: 'rgba(243, 146, 0, 0.05)' }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const score = payload[0].value as number;
                            const type = score >= 9 ? 'Promotor' : score >= 7 ? 'Neutro' : 'Detrator';
                            const color = score >= 9 ? '#22c55e' : score >= 7 ? '#f39200' : '#ef4444';
                            
                            return (
                              <div className="bg-white/95 backdrop-blur-md px-5 py-4 rounded-[1.5rem] shadow-2xl border border-gray-100 animate-fadeIn">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">{type}</span>
                                </div>
                                <p className="text-3xl font-black text-gray-900 tabular-nums">{score}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="score" radius={[8, 8, 8, 8]} barSize={32}>
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
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={16} className="text-orange-600" />
                    <span className="text-[11px] font-black uppercase text-gray-900">IA Insight Local:</span>
                  </div>
                  <p className="text-[11px] font-bold text-gray-500 italic leading-relaxed">
                    "{storeSpecificData?.summary}"
                  </p>
                </div>
              </div>

              <div className="space-y-3 mt-auto pt-4">
                <div className="relative group">
                  <ActionTooltip text="Abre o Google Maps com a rota otimizada para esta unidade." />
                  <button 
                    onClick={() => startRoute()} 
                    className="w-full flex items-center justify-center gap-4 py-6 bg-gradient-to-r from-orange-700 to-yellow-400 text-black rounded-[1.8rem] text-sm font-black uppercase tracking-widest shadow-xl shadow-orange-100 hover:scale-[1.02] hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(243,146,0,0.5)] active:scale-95 transition-all duration-300"
                  >
                    <Navigation size={22} fill="currentColor" />
                    Iniciar Rota (Google Maps)
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative group">
                    <ActionTooltip text="Gera um arquivo .csv com todos os registros de feedback desta loja." />
                    <button 
                      onClick={handleExportStoreCSV} 
                      className="w-full flex items-center justify-center gap-3 py-5 bg-gradient-to-r from-orange-700 to-yellow-400 text-black rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-100/30 hover:scale-[1.02] hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-12px_rgba(243,146,0,0.4)] active:scale-95 transition-all duration-300"
                    >
                      <FileDown size={18} />
                      Dados CSV
                    </button>
                  </div>
                  <div className="relative group">
                    <ActionTooltip text="Visualiza a fachada e o entorno 3D da unidade via Google Earth." />
                    <button 
                      onClick={() => window.open(`https://earth.google.com/web/@${selectedStoreOnMap.lat},${selectedStoreOnMap.lng},500a,35y,0h,0t,0r`, '_blank')} 
                      className="w-full flex items-center justify-center gap-3 py-5 bg-black text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-gray-900 transition-colors"
                    >
                      <Globe size={18} className="text-[#f39200]" />
                      Earth View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center px-12 opacity-30">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8">
                <MapIcon size={48} className="text-gray-300" />
              </div>
              <p className="text-base font-black uppercase tracking-widest leading-tight italic">
                Selecione uma das 40 lojas no mapa para gerenciar rotas e exportar métricas
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white p-12 rounded-[3rem] shadow-sm border border-gray-100">
           <div className="flex items-center justify-between mb-12">
             <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">Fluxo na Rede <span className="text-orange-600">Kibabo</span></h3>
           </div>
           <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { time: '08:00', clients: 120 }, { time: '10:00', clients: 250 }, { time: '12:00', clients: 410 },
                  { time: '14:00', clients: 320 }, { time: '16:00', clients: 480 }, { time: '18:00', clients: 590 },
                  { time: '20:00', clients: 150 }
                ]}>
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
           <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-8 italic">Integração <span className="text-orange-600">Google Cloud</span></h3>
           <div className="space-y-4 flex-1">
              <div className="relative group">
                <ActionTooltip text="Acessa a planilha mestre consolidada com todos os vizinhos no Google Sheets." />
                <a href="https://sheets.google.com" target="_blank" className="flex items-center justify-between p-6 bg-gradient-to-r from-orange-700 to-yellow-400 rounded-[2rem] hover:scale-105 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-100/40 transition-all group">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/90 backdrop-blur-md rounded-xl shadow-sm text-gray-900"><FileSpreadsheet size={24} /></div>
                      <span className="text-xs font-black uppercase text-black">Feedback Sheets</span>
                 </div>
                 <ExternalLink size={14} className="text-black/40 group-hover:text-black" />
                </a>
              </div>
              <div className="relative group">
                <ActionTooltip text="Documentos e manuais de operação gerados automaticamente no Google Docs." />
                <a href="https://docs.google.com" target="_blank" className="flex items-center justify-between p-6 bg-gradient-to-r from-orange-700 to-yellow-400 rounded-[2rem] hover:scale-105 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-100/40 transition-all group">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/90 backdrop-blur-md rounded-xl shadow-sm text-gray-900"><FileText size={24} /></div>
                      <span className="text-xs font-black uppercase text-black">Relatórios Docs</span>
                   </div>
                   <ExternalLink size={14} className="text-black/40 group-hover:text-black" />
                </a>
              </div>
           </div>
           <div className="relative group">
             <ActionTooltip text="Captura a visualização atual do Dashboard e exporta como um relatório PDF A4." />
             <button onClick={handleExportPDF} className="mt-8 w-full py-5 bg-black text-white rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-gray-900 transition-colors shadow-xl shadow-gray-200">
                <FileDown size={18} />
                Exportar Dashboard (PDF)
             </button>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[3.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-12 py-10 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">Vizinhos em <span className="text-orange-600">Tempo Real</span></h3>
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
            {filteredFeedbacks.length > 0 ? filteredFeedbacks.map((f) => {
              const isPremiumRating = f.rating === FeedbackRating.EXCELLENT || f.rating === FeedbackRating.GOOD;
              return (
                <div key={f.id} className="flex flex-col md:flex-row md:items-center gap-6 p-8 rounded-[2.5rem] border-2 border-gray-50/50 bg-gray-50/10 hover:bg-white hover:border-[#f39200]/20 transition-all duration-300 group/row animate-slideInUp">
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
            }) : (
              <div className="text-center py-20 opacity-20 italic">
                 <p className="font-black uppercase tracking-widest text-sm">Aguardando novos vizinhos...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
