
import React, { useState } from 'react';
import Layout from './components/Layout';
import WelcomeScreen from './components/WelcomeScreen';
import FeedbackKiosk from './components/FeedbackKiosk';
import ManagerDashboard from './components/ManagerDashboard';
import { Feedback, FeedbackRating, ViewType, Customer } from './types';

// Initial Mock Data
const MOCK_FEEDBACKS: Feedback[] = [
  { 
    id: '1', 
    rating: FeedbackRating.EXCELLENT, 
    npsScore: 10,
    comment: 'Sempre encontro o que preciso no Kibabo do Kilamba!', 
    timestamp: new Date(Date.now() - 3600000), 
    storeLocation: 'Kilamba Viaduto',
    customer: { name: 'João Manuel', cardNumber: '1234 5678 9012' }
  },
  { 
    id: '2', 
    rating: FeedbackRating.GOOD, 
    npsScore: 8,
    comment: 'Preços razoáveis, mas as filas estavam um pouco longas.', 
    timestamp: new Date(Date.now() - 7200000), 
    storeLocation: 'Viana',
    customer: { name: 'Maria Santos', cardNumber: '9876 5432 1098' }
  },
  { 
    id: '3', 
    rating: FeedbackRating.EXCELLENT, 
    npsScore: 9,
    comment: 'Melhor loja de Ingombota.', 
    timestamp: new Date(Date.now() - 150000), 
    storeLocation: 'Ingombota',
    customer: { name: 'António Silva', cardNumber: '1111 2222 3333' }
  },
  { 
    id: '4', 
    rating: FeedbackRating.AVERAGE, 
    npsScore: 5,
    comment: 'Faltava pão quente.', 
    timestamp: new Date(Date.now() - 300000), 
    storeLocation: 'Talatona',
    customer: { name: 'Bela Costa', cardNumber: '4444 5555 6666' }
  }
];

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('welcome');
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(MOCK_FEEDBACKS);

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
    console.log(`SYNC: NPS ${npsScore} e Rating ${rating} de ${currentCustomer?.name} na loja ${storeLocation} enviado para Google Sheets.`);

    // Após 4 segundos na tela de sucesso, volta para a tela de boas-vindas para o próximo cliente
    setTimeout(() => {
      setActiveView('welcome');
      setCurrentCustomer(null);
    }, 4000);
  };

  return (
    <Layout activeView={activeView === 'dashboard' ? 'dashboard' : 'kiosk'} onViewChange={(view) => setActiveView(view)}>
      <div className="h-full">
        {activeView === 'welcome' && (
          <WelcomeScreen onStart={handleStartSession} />
        )}
        {activeView === 'kiosk' && (
          <FeedbackKiosk customer={currentCustomer} onSubmit={handleNewFeedback} />
        )}
        {activeView === 'dashboard' && (
          <ManagerDashboard feedbacks={feedbacks} />
        )}
      </div>
    </Layout>
  );
};

export default App;
