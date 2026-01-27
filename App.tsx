
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import WelcomeScreen from './components/WelcomeScreen';
import FeedbackKiosk from './components/FeedbackKiosk';
import ManagerDashboard from './components/ManagerDashboard';
import { Feedback, FeedbackRating, ViewType, Customer } from './types';

// Chave para o LocalStorage
const STORAGE_KEY = 'kibabo_experience_data_v1';

// Mock Data Inicial caso o storage esteja vazio
const MOCK_FEEDBACKS: Feedback[] = [
  { 
    id: '1', 
    rating: FeedbackRating.EXCELLENT, 
    npsScore: 10,
    comment: 'Atendimento nota 10 no setor de frescos. O Kibabo do Kilamba está de parabéns!', 
    timestamp: new Date(Date.now() - 3600000), 
    storeLocation: 'Kilamba Viaduto',
    customer: { name: 'João Manuel', cardNumber: '7788 1234 5678' }
  },
  { 
    id: '2', 
    rating: FeedbackRating.GOOD, 
    npsScore: 8,
    comment: 'Boa variedade de produtos, mas os carrinhos estão um pouco desgastados.', 
    timestamp: new Date(Date.now() - 7200000), 
    storeLocation: 'Viana',
    customer: { name: 'Maria Santos', cardNumber: 'BI 009234812LA' }
  }
];

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('welcome');
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  
  // Inicializa o estado com dados do LocalStorage ou Mocks
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        // Converter strings de data de volta para objetos Date
        const parsed = JSON.parse(saved);
        return parsed.map((f: any) => ({
          ...f,
          timestamp: new Date(f.timestamp)
        }));
      }
    } catch (e) {
      console.error("Erro ao carregar dados locais:", e);
    }
    return MOCK_FEEDBACKS;
  });

  // Salva no LocalStorage sempre que o estado de feedbacks mudar
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(feedbacks));
  }, [feedbacks]);

  const handleStartSession = (customer: Customer) => {
    setCurrentCustomer(customer);
    setActiveView('kiosk');
  };

  const handleNewFeedback = (rating: FeedbackRating, npsScore: number, comment?: string, storeLocation?: string) => {
    const newFeedback: Feedback = {
      id: Math.random().toString(36).substr(2, 9),
      rating,
      npsScore,
      comment,
      timestamp: new Date(),
      storeLocation: storeLocation || 'Não Especificada',
      customer: currentCustomer || undefined,
    };
    
    setFeedbacks(prev => [newFeedback, ...prev]);
    
    // Log de sincronização simulando Google Cloud
    console.debug(`SYNC CLOUD: Feedback #${newFeedback.id} persistido em tempo real.`);

    // Retorna à tela inicial após 5 segundos para o próximo vizinho
    setTimeout(() => {
      setActiveView('welcome');
      setCurrentCustomer(null);
    }, 5000);
  };

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeView]);

  return (
    <Layout activeView={activeView === 'dashboard' ? 'dashboard' : 'kiosk'} onViewChange={(view) => setActiveView(view)}>
      <div className="h-full bg-[#f8f9fa]">
        {activeView === 'welcome' && (
          <div className="h-full animate-fadeIn">
            <WelcomeScreen onStart={handleStartSession} />
          </div>
        )}
        {activeView === 'kiosk' && (
          <div className="h-full animate-fadeIn">
            <FeedbackKiosk customer={currentCustomer} onSubmit={handleNewFeedback} />
          </div>
        )}
        {activeView === 'dashboard' && (
          <div className="h-full animate-fadeIn">
            <ManagerDashboard feedbacks={feedbacks} />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
