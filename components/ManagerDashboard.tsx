
import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area,
  Cell 
} from 'recharts';
import { 
  FileSpreadsheet, FileText, Map as MapIcon, Users, MessageSquare, 
  Search, Sparkles, MapPin, RefreshCcw, User,
  FileDown, Navigation, Store, Star, Globe, Heart, BellRing, ExternalLink, TrendingUp, Info, Maximize2, Target,
  BrainCircuit, Zap, AlertCircle, Loader2, Radar, Calendar, Filter, X, Cloud, Activity, Terminal
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Feedback, FeedbackRating } from '../types';
import { analyzeFeedback } from '../services/geminiService';

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

/**
 * Tooltip refinado com cores da marca Kibabo e animação suave.
 */
const ActionTooltip = ({ text }: { text: string }) => (
  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] transform translate-y-3 group-hover:translate-y-0 z-50">
    <div className="bg-black/95 backdrop-blur-md text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] text-center shadow-2xl border-b-2 border-[#f39200] whitespace-nowrap min-w-[140px]">
      <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-black rotate-45 border-r border-b border-[#f39200]"></div>
      <span className="bg-gradient-to-r from-orange-100 to-yellow-200 bg-clip-text text-transparent">
        {text}
      </span>
    </div>
  </div>
);

const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ feedbacks }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [tableSearchTerm, setTableSearchTerm] = useState('');
  const [selectedStoreOnMap, setSelectedStoreOnMap] = useState<StoreLocation | null>(null);
  const [showLiveNotification, setShowLiveNotification] = useState(false);
  const [isScanningStore, setIsScanningStore] = useState(false);
  
  // Filtering States
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [activeRange, setActiveRange] = useState<'all' | 'today' | 'week' | 'month'>('all');

  const [isLoadingMap, setIsLoadingMap] = useState(true);
  const [globalAnalysis, setGlobalAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [isMapHovered, setIsMapHovered] = useState(false);
  const [isNearStore, setIsNearStore] = useState(false);
  const [focusPoint, setFocusPoint] = useState({ x: 50, y: 50 });
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const prevFeedbacksLength = useRef(feedbacks.length);

  // Apply Time Filters
  const timeFilteredFeedbacks = useMemo(() => {
    return feedbacks.filter(f => {
      const fDate = new Date(f.timestamp);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      
      if (start) start.setHours(0, 0, 0, 0);
      if (end) end.setHours(23, 59, 59, 999);

      if (start && fDate < start) return false;
      if (end && fDate > end) return false;
      return true;
    });
  }, [feedbacks, startDate, endDate]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoadingMap(false), 2000);
    return () => clearTimeout(timer);
  }, []);

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
    if (timeFilteredFeedbacks.length === 0) return 0;
    const promoters = timeFilteredFeedbacks.filter(f => f.npsScore >= 9).length;
    const detractors = timeFilteredFeedbacks.filter(f => f.npsScore <= 6).length;
    return Math.round(((promoters - detractors) / timeFilteredFeedbacks.length) * 100);
  }, [timeFilteredFeedbacks]);

  const filteredFeedbacks = useMemo(() => {
    return timeFilteredFeedbacks.filter(f => 
      f.customer?.name.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
      f.storeLocation.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
      f.comment?.toLowerCase().includes(tableSearchTerm.toLowerCase())
    );
  }, [timeFilteredFeedbacks, tableSearchTerm]);

  const storeSpecificData = useMemo(() => {
    if (!selectedStoreOnMap) return null;
    const storeFeedbacks = timeFilteredFeedbacks.filter(f => 
      f.storeLocation.toLowerCase().includes(selectedStoreOnMap.name.toLowerCase())
    );
    const last5 = storeFeedbacks.slice(0, 5).reverse().map((f, i) => ({
      index: i + 1,
      score: f.npsScore 
    }));
    const count = storeFeedbacks.length;
    
    let summary = "Feedback insuficiente para análise individual no período selecionado.";
    if (count > 0) {
      const avg = storeFeedbacks.reduce((acc, f) => acc + f.npsScore, 0) / count;
      if (avg >= 8.5) summary = "Vizinhos extremamente satisfeitos com o atendimento.";
      else if (avg < 6) summary = "Necessário foco em redução de filas e reposição.";
      else summary = "Operação estável com boa aceitação dos vizinhos.";
    }
    return { last5, summary, count };
  }, [selectedStoreOnMap, timeFilteredFeedbacks]);

  const setRange = (range: 'all' | 'today' | 'week' | 'month') => {
    setActiveRange(range);
    const now = new Date();
    let start = new Date();
    
    switch(range) {
      case 'today':
        start.setHours(0,0,0,0);
        break;
      case 'week':
        start.setDate(now.getDate() - 7);
        break;
      case 'month':
        start.setMonth(now.getMonth() - 1);
        break;
      case 'all':
      default:
        setStartDate('');
        setEndDate('');
        return;
    }
    
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(now.toISOString().split('T')[0]);
  };

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setActiveRange('all');
  };

  const handleManualSync = () => {
    setIsSyncing(true);
    setIsLoadingMap(true);
    setTimeout(() => {
      setIsSyncing(false);
      setIsLoadingMap(false);
    }, 1800);
  };

  const handleGenerateGlobalAnalysis = async () => {
    if (timeFilteredFeedbacks.length === 0) return;
    setIsAnalyzing(true);
    setGlobalAnalysis(null);
    try {
      const result = await analyzeFeedback(timeFilteredFeedbacks);
      setGlobalAnalysis(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleStoreSelection = (store: StoreLocation) => {
    setIsScanningStore(true);
    setSelectedStoreOnMap(store);
    setTimeout(() => setIsScanningStore(false), 600);
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
    const storeFeedbacks = timeFilteredFeedbacks.filter(f => 
      f.storeLocation.toLowerCase().includes(selectedStoreOnMap.name.toLowerCase())
    );
    
    if (storeFeedbacks.length === 0) {
      alert("Nenhum feedback registrado para esta loja ainda no período selecionado.");
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

  const handleMapMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapContainerRef.current || isLoadingMap) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    let closestStore: StoreLocation | null = null;
    let minDistance = Infinity;

    ALL_STORES.forEach(store => {
      const dx = x - store.x;
      const dy = y - store.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < minDistance) {
        minDistance = dist;
        closestStore = store;
      }
    });

    const snapRange = 6.5; 
    const snapThreshold = 1.2; 
    const isNear = minDistance < snapRange;
    setIsNearStore(isNear);

    if (isNear && closestStore) {
      let snapFactor = 0;
      if (minDistance < snapThreshold) {
        snapFactor = 1;
      } else {
        snapFactor = 1 - (minDistance - snapThreshold) / (snapRange - snapThreshold);
      }
      
      const effectiveX = closestStore.x * snapFactor + x * (1 - snapFactor);
      const effectiveY = closestStore.y * snapFactor + y * (1 - snapFactor);
      setFocusPoint({ x: effectiveX, y: effectiveY });
    } else {
      setFocusPoint({ x, y });
    }
  }, [isLoadingMap]);

  const KPICard = ({ label, val, trend, icon: Icon, color, bg, info }: any) => (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-[0_25px_60px_-15px_rgba(243,146,0,0.4)] hover:-translate-y-3 hover:border-orange-200 transition-all duration-500 group relative cursor-pointer overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#f39200]/10 to-yellow-400/5 rounded-full -mr-16 -mt-16 group-hover:scale-[2.5] transition-transform duration-1000 ease-out"></div>
      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-600 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-500 ease-out transform translate-y-2 group-hover:-translate-y-4 z-40 w-[max(180px,85%)] max-w-[240px]">
        <div className="bg-black/95 backdrop-blur-md text-white px-5 py-4 rounded-2xl shadow-2xl border border-[#f39200]/30 relative leading-relaxed overflow-hidden">
          <div className="flex items-center justify-center gap-2 mb-2 text-[#f39200]">
            <span className="text-[9px] font-black uppercase tracking-widest">Métrica Analítica</span>
          </div>
          <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-center text-gray-200">
            {info}
          </p>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-black rotate-45 border-r border-b border-[#f39200]/30"></div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className={`p-4 ${bg} ${color} rounded-2xl group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-orange-700 group-hover:to-yellow-400 group-hover:text-black transition-all duration-300 shadow-sm`}>
          <Icon size={24} />
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
    <div ref={dashboardRef} className="p-10 space-y-8 animate-fadeIn bg-[#f8f9fa] relative">
      <style>{`
        @keyframes kibaboScan {
          0% { left: -5%; opacity: 0; }
          20% { opacity: 0.6; }
          80% { opacity: 0.6; }
          100% { left: 105%; opacity: 0; }
        }
        @keyframes pulsePin {
          0% { transform: scale(0.8); opacity: 0.8; }
          50% { transform: scale(2.5); opacity: 0; }
          100% { transform: scale(0.8); opacity: 0; }
        }
        .kibabo-map-grid {
          background-image: 
            linear-gradient(to right, rgba(243,146,0,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(243,146,0,0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .scan-line {
          width: 2px;
          height: 100%;
          background: linear-gradient(to bottom, transparent, #f39200, transparent);
          box-shadow: 0 0 15px #f39200;
          position: absolute;
          top: 0;
          animation: kibaboScan 3s linear infinite;
        }
      `}</style>

      {showLiveNotification && (
        <div className="fixed top-8 right-8 z-[100] animate-slideInRight">
          <div className="bg-black text-white px-8 py-5 rounded-3xl shadow-2xl flex items-center gap-5 border border-orange-500/30 backdrop-blur-xl">
            <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center animate-bounce">
              <BellRing size={24} className="text-black" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-orange-500">Live Feedback</p>
              <p className="text-sm font-bold">Novo registro detectado!</p>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic flex items-center gap-4">
            Dashboard <span className="text-[#f39200]">Performance</span>
            {isSyncing && <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.3em]">Analítica de rede em tempo real</p>
            {(startDate || endDate) && (
              <span className="text-[10px] font-black bg-orange-50 text-[#f39200] px-3 py-1 rounded-full border border-orange-100 uppercase tracking-widest animate-fadeIn">
                Período: {startDate ? new Date(startDate).toLocaleDateString() : 'Início'} — {endDate ? new Date(endDate).toLocaleDateString() : 'Hoje'}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3 no-print">
           <div className="relative group">
             <ActionTooltip text="Sincronizar Cloud" />
             <button 
               onClick={handleManualSync} 
               disabled={isSyncing}
               className={`p-4 bg-gradient-to-r from-orange-700 to-yellow-400 text-black rounded-2xl transition-all shadow-lg hover:-translate-y-1 hover:shadow-[0_15px_30px_-10px_rgba(243,146,0,0.5)] active:scale-95 ${isSyncing ? 'animate-spin' : ''}`}
             >
               <RefreshCcw size={20} />
             </button>
           </div>
        </div>
      </div>

      {/* Filter Bar Section - Enhanced with more control and tooltips */}
      <div className="bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-4 no-print">
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100">
          <Filter size={16} className="text-gray-400" />
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Filtrar Período:</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'Tudo', hint: 'Análise do Período Total' },
            { id: 'today', label: 'Hoje', hint: 'Filtrar Dados de Hoje' },
            { id: 'week', label: '7 Dias', hint: 'Métricas da Última Semana' },
            { id: 'month', label: '30 Dias', hint: 'Métricas do Último Mês' }
          ].map(r => (
            <div key={r.id} className="relative group">
              <ActionTooltip text={r.hint} />
              <button
                onClick={() => setRange(r.id as any)}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeRange === r.id 
                    ? 'bg-black text-white shadow-lg' 
                    : 'bg-white text-gray-400 border border-gray-100 hover:border-orange-200 hover:text-orange-600'
                }`}
              >
                {r.label}
              </button>
            </div>
          ))}
        </div>

        <div className="h-6 w-[1px] bg-gray-100 hidden md:block"></div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <ActionTooltip text="Data Inicial" />
            <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setActiveRange('all'); }}
              className="pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black uppercase outline-none focus:border-orange-500 transition-all font-bold"
            />
          </div>
          <span className="text-gray-300 font-bold">até</span>
          <div className="relative group">
            <ActionTooltip text="Data Final" />
            <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); setActiveRange('all'); }}
              className="pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black uppercase outline-none focus:border-orange-500 transition-all font-bold"
            />
          </div>
          {(startDate || endDate) && (
            <div className="relative group">
              <ActionTooltip text="Limpar Filtro de Datas" />
              <button 
                onClick={clearFilters}
                className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all active:scale-95"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard label="NPS Médio" val={`${averageNps}%`} trend="Fidelidade" icon={Heart} color="text-red-500" bg="bg-red-50" info="A probabilidade de recomendação de nossos vizinhos no período selecionado." />
        <KPICard label="Feedbacks" val={timeFilteredFeedbacks.length} trend="Período" icon={MessageSquare} color="text-gray-900" bg="bg-gray-100" info="O volume total de registros de voz dos vizinhos capturados entre as datas filtradas." />
        <KPICard label="Rede Kibabo" val={ALL_STORES.length} trend="Lojas" icon={MapPin} color="text-orange-600" bg="bg-orange-50" info="Unidades ativas monitoradas em tempo real em Luanda e arredores." />
        <KPICard label="Sincronização" val="100%" trend="OK" icon={Globe} color="text-green-500" bg="bg-green-50" info="Integridade da comunicação entre os terminais PDV e o Kibabo Cloud." />
      </div>

      {/* Map and Store Detail Section */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col lg:flex-row min-h-[700px]">
        <div 
          ref={mapContainerRef}
          onMouseEnter={() => !isLoadingMap && setIsMapHovered(true)}
          onMouseLeave={() => setIsMapHovered(false)}
          onMouseMove={handleMapMouseMove}
          className="flex-1 bg-[#e5e3df] relative overflow-hidden cursor-crosshair group/map kibabo-map-grid"
        >
          {isMapHovered && !isLoadingMap && <div className="scan-line z-40 pointer-events-none" />}

          {isLoadingMap && (
            <div className="absolute inset-0 z-[60] bg-[#e5e3df]/60 backdrop-blur-[2px] flex items-center justify-center animate-fadeIn">
               <div className="flex flex-col items-center">
                  <div className="relative mb-8">
                     <div className="absolute inset-0 bg-orange-500/20 rounded-full animate-ping scale-150"></div>
                     <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl border-2 border-orange-500/50">
                        <Radar size={40} className="text-[#f39200] animate-spin" />
                     </div>
                  </div>
                  <div className="text-center">
                     <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic mb-1">GEO-SCANNING</h3>
                     <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-2 justify-center">
                        <Loader2 size={12} className="animate-spin" />
                        Mapeando Unidades
                     </p>
                  </div>
               </div>
            </div>
          )}

          <div 
            className={`absolute pointer-events-none z-50 transition-all duration-[300ms] ease-out ${isMapHovered && !isLoadingMap ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
            style={{ 
              left: `${focusPoint.x}%`, 
              top: `${focusPoint.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className={`w-28 h-28 border-2 rounded-full flex items-center justify-center bg-white/5 backdrop-blur-[3px] shadow-[0_0_80px_rgba(243,146,0,0.5)] transition-all duration-300 ${isNearStore ? 'border-orange-500 scale-110 bg-orange-500/20' : 'border-gray-400/40 scale-100'}`}>
              <div className="relative">
                {isNearStore ? (
                  <Target size={32} className="text-orange-600 relative z-10 drop-shadow-2xl animate-[bounce_1.5s_infinite]" />
                ) : (
                  <Maximize2 size={20} className="text-gray-400/40" />
                )}
              </div>
            </div>
          </div>

          <div 
            className={`absolute inset-0 transition-all duration-500 ease-out ${isLoadingMap ? 'blur-md opacity-50 grayscale' : 'blur-0 opacity-100 grayscale-0'}`}
            style={{ 
              transform: isMapHovered ? 'scale(1.75)' : 'scale(1)',
              transformOrigin: `${focusPoint.x}% ${focusPoint.y}%`
            }}
          >
            <div className="absolute inset-0">
              {ALL_STORES.map((store) => (
                <button 
                  key={store.id} 
                  onClick={() => handleStoreSelection(store)} 
                  disabled={isLoadingMap}
                  className={`absolute transform -translate-x-1/2 -translate-y-full transition-all hover:scale-150 z-10 ${isMapHovered ? 'scale-75' : 'scale-100'} ${isLoadingMap ? 'opacity-0' : 'opacity-100'}`} 
                  style={{ left: `${store.x}%`, top: `${store.y}%` }}
                >
                  <div className="relative group">
                     {(selectedStoreOnMap?.id === store.id || isLoadingMap) && (
                        <div className="absolute inset-0 w-full h-full rounded-full border-2 border-orange-500" style={{ animation: 'pulsePin 1.5s ease-out infinite' }}></div>
                     )}
                     
                     <div className={`relative flex flex-col items-center transition-all duration-300 ${selectedStoreOnMap?.id === store.id ? 'scale-125' : 'scale-100'}`}>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center p-1 border-2 shadow-lg transition-colors ${selectedStoreOnMap?.id === store.id ? 'bg-black border-black text-white' : 'bg-white border-[#f39200] text-[#f39200]'}`}>
                          <Store size={12} />
                        </div>
                     </div>
                     {selectedStoreOnMap?.id === store.id && (
                       <div className="absolute top-[-45px] left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white px-3 py-2 rounded-xl shadow-2xl border border-gray-100 animate-fadeIn z-50">
                          <span className="text-[10px] font-black uppercase text-gray-900 whitespace-nowrap">{store.name}</span>
                       </div>
                     )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[460px] bg-white border-l border-gray-100 p-10 flex flex-col relative">
          {isScanningStore && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-[70] flex flex-col items-center justify-center animate-fadeIn">
               <Activity size={40} className="text-orange-600 animate-pulse mb-4" />
               <p className="text-[10px] font-black uppercase tracking-widest text-orange-600 italic">Capturando métricas...</p>
            </div>
          )}

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
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Status Período Selecionado</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Score Médio</span>
                  <p className="text-3xl font-black text-gray-900">{selectedStoreOnMap.rating}</p>
                </div>
                <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Vizinhos</span>
                  <p className="text-3xl font-black text-gray-900">{storeSpecificData?.count || 0}</p>
                </div>
              </div>

              <div className="bg-gray-50/30 p-8 rounded-[2.5rem] border border-gray-100 flex-1 flex flex-col">
                <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Tendência de Satisfação</h5>
                <div className="flex-1 h-32 min-h-[160px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={storeSpecificData?.last5 || []}>
                      <RechartsTooltip content={({ active, payload }) => {
                          if (active && payload?.length) return (
                            <div className="bg-white p-3 rounded-xl shadow-xl border border-gray-100 text-[10px] font-black">NPS: {payload[0].value}</div>
                          );
                          return null;
                        }}
                      />
                      <Bar dataKey="score" radius={[8, 8, 8, 8]}>
                        {storeSpecificData?.last5?.map((entry, index) => (
                          <Cell key={index} fill={entry.score >= 9 ? '#22c55e' : entry.score >= 7 ? '#f39200' : '#ef4444'} />
                        ))}
                      </Bar>
                      <XAxis hide dataKey="index" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <span className="text-[11px] font-black uppercase text-gray-900 block mb-2">Resumo IA:</span>
                  <p className="text-[11px] font-bold text-gray-500 italic leading-relaxed">"{storeSpecificData?.summary}"</p>
                </div>
              </div>

              <div className="space-y-3">
                  <div className="relative group">
                    <ActionTooltip text="Abrir no Google Maps" />
                    <button onClick={() => startRoute()} className="w-full py-6 bg-gradient-to-r from-orange-700 to-yellow-400 text-black rounded-[1.8rem] text-sm font-black uppercase tracking-widest shadow-xl hover:-translate-y-1 hover:shadow-[0_20px_40px_-12px_rgba(243,146,0,0.5)] transition-all active:scale-95">
                      Iniciar Rota
                    </button>
                  </div>
                  <div className="relative group">
                    <ActionTooltip text="Baixar Planilha CSV" />
                    <button onClick={handleExportStoreCSV} className="w-full py-5 bg-gradient-to-r from-orange-700 to-yellow-400 text-black rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest shadow-lg hover:-translate-y-1 hover:shadow-[0_15px_30px_-10px_rgba(243,146,0,0.3)] transition-all active:scale-95">
                      Dados CSV Período
                    </button>
                  </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center px-12 opacity-30">
              <MapIcon size={48} className="text-gray-300 mb-6" />
              <p className="text-base font-black uppercase tracking-widest italic">Selecione uma loja para filtrar dados individuais</p>
            </div>
          )}
        </div>
      </div>

      {/* Cloud Sync & AI Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 no-print">
        <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 text-orange-500/10 group-hover:scale-110 transition-transform">
              <Cloud size={120} />
           </div>
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                   <Cloud size={24} />
                 </div>
                 <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter">Integração <span className="text-[#f39200]">Google Cloud</span></h3>
              </div>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-8 max-w-sm">Sincronização persistente de feedbacks em tempo real.</p>
              
              <div className="flex gap-4">
                 <div className="relative group">
                   <ActionTooltip text="Atualizar Dados Agora" />
                   <button 
                    onClick={handleManualSync}
                    className="px-8 py-5 bg-gradient-to-r from-orange-700 to-yellow-400 text-black rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:-translate-y-1 hover:shadow-[0_15px_30px_-10px_rgba(243,146,0,0.5)] transition-all flex items-center gap-3 active:scale-95"
                   >
                     <RefreshCcw size={16} className={isSyncing ? 'animate-spin' : ''} />
                     Sincronizar
                   </button>
                 </div>
              </div>
           </div>
        </div>

        <div className="bg-black rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-2xl flex flex-col justify-between">
           <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-125 transition-transform duration-1000">
              <BrainCircuit size={180} />
           </div>
           <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                 <div className="p-4 bg-gradient-to-br from-orange-600 to-yellow-400 rounded-2xl text-black">
                    <BrainCircuit size={28} />
                 </div>
                 <div>
                   <h3 className="text-2xl font-black uppercase tracking-tighter italic">Análise <span className="text-[#f39200]">IA Estratégica</span></h3>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Insights Gerenciais Google Gemini</p>
                 </div>
              </div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-8 max-w-sm">Analise sentimentos e obtenha sugestões acionáveis para o período.</p>
           </div>

           <div className="relative z-10 group">
              <ActionTooltip text="Executar Análise com Gemini" />
              <button 
                 onClick={handleGenerateGlobalAnalysis}
                 disabled={isAnalyzing || timeFilteredFeedbacks.length === 0}
                 className={`px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-3 active:scale-95 ${isAnalyzing ? 'bg-gray-800 text-gray-500 animate-pulse' : 'bg-white text-black hover:bg-[#f39200] hover:shadow-[0_20px_40px_-10px_rgba(243,146,0,0.4)] hover:-translate-y-1'}`}
              >
                 {isAnalyzing ? <><Loader2 size={16} className="animate-spin" /> Processando...</> : <><Sparkles size={16} /> Gerar Relatório IA</>}
              </button>
           </div>
        </div>
      </div>

      { (globalAnalysis || isAnalyzing) && (
        <div className="animate-fadeIn no-print">
           <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden relative">
              <div className="bg-gray-50 px-10 py-5 border-b border-gray-100 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <Terminal size={18} className="text-orange-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-900 italic">Console Analítico Kibabo</span>
                 </div>
              </div>
              
              <div className="p-12">
                 {isAnalyzing ? (
                   <div className="space-y-4">
                      <div className="h-4 bg-gray-100 rounded-full w-3/4 animate-pulse"></div>
                      <div className="h-4 bg-gray-100 rounded-full w-1/2 animate-pulse"></div>
                      <div className="h-4 bg-gray-100 rounded-full w-5/6 animate-pulse"></div>
                   </div>
                 ) : (
                   <div className="text-gray-700 leading-relaxed font-medium whitespace-pre-line text-sm md:text-base animate-fadeIn italic">
                      {globalAnalysis}
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white p-12 rounded-[3rem] shadow-sm border border-gray-100 relative group overflow-hidden">
           <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic mb-12 relative z-10">Picos de Atendimento</h3>
           <div className="h-64 relative z-10">
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
                  <Area type="monotone" dataKey="clients" stroke={KIBABO_ORANGE} strokeWidth={4} fill="url(#colorTraffic)" />
                  <XAxis dataKey="time" hide />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
           <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center text-[#f39200] mb-8 shadow-2xl">
              <FileDown size={40} />
           </div>
           <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-4 italic">Exportação Geral</h3>
           <div className="relative group w-full">
             <ActionTooltip text="Baixar PDF do Dashboard" />
             <button onClick={handleExportPDF} className="w-full py-6 bg-black text-white rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-gray-900 transition-all shadow-xl hover:-translate-y-1 active:scale-95">
                Gerar Relatório PDF
             </button>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[3.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-12 py-10 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">Feedbacks Filtrados ({filteredFeedbacks.length})</h3>
          <div className="relative max-w-sm w-full">
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
            <input 
              type="text" 
              placeholder="Pesquisar resultados..."
              value={tableSearchTerm}
              onChange={(e) => setTableSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-orange-500 outline-none transition-all font-bold"
            />
          </div>
        </div>
        <div className="p-10 space-y-4">
            {filteredFeedbacks.length > 0 ? filteredFeedbacks.map((f) => (
                <div key={f.id} className="flex flex-col md:flex-row md:items-center gap-6 p-8 rounded-[2.5rem] border-2 border-gray-50/50 bg-gray-50/10 hover:bg-white transition-all group">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-white text-gray-400 group-hover:bg-[#f39200] group-hover:text-black transition-all">
                    <User size={24} />
                  </div>
                  <div className="w-56">
                    <p className="text-sm font-black uppercase truncate text-gray-900">{f.customer?.name || 'Anônimo'}</p>
                    <p className="text-[10px] font-black tracking-widest uppercase text-orange-600">{f.storeLocation}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-xl text-xs font-black min-w-[80px] text-center ${f.npsScore >= 9 ? 'bg-green-100 text-green-700' : f.npsScore >= 7 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                    NPS {f.npsScore}
                  </div>
                  <div className="flex-1 text-xs text-gray-500 font-bold italic truncate">
                    {f.comment || "Sem relato adicional"}
                  </div>
                  <div className="text-[9px] font-black uppercase text-gray-300">
                    {new Date(f.timestamp).toLocaleDateString()}
                  </div>
                </div>
            )) : (
              <div className="text-center py-24 opacity-20 italic font-black uppercase tracking-widest flex flex-col items-center gap-6">
                 <AlertCircle size={48} />
                 Nenhum registro encontrado
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
