import { Link } from 'react-router-dom';
import { ReservationProvider } from './context/ReservationContext';
import { useReservation } from './hooks/useReservation';
import Header from './components/Header';
import ProgressBar from './components/ProgressBar';

// Import step pages
import WelcomeStep from './pages/WelcomeStep';
import PersonsStep from './pages/PersonsStep';
import OccasionStep from './pages/OccasionStep';
import DateStep from './pages/DateStep';
import TimeStep from './pages/TimeStep';
import PreOrderStep from './pages/PreOrderStep';
import ClientDataStep from './pages/ClientDataStep';
import SummaryStep from './pages/SummaryStep';

// Component that consumes context and renders steps
const ReservationAppContent = () => {
  const { step } = useReservation();

  // Helper to render the correct step component
  const renderStep = () => {
    switch (step) {
      case 1:
        return <WelcomeStep />;
      case 2:
        return <PersonsStep />;
      case 3:
        return <OccasionStep />;
      case 4:
        return <DateStep />;
      case 5:
        return <TimeStep />;
      case 6:
        return <PreOrderStep />;
      case 7:
        return <ClientDataStep />;
      case 8:
        return <SummaryStep />;
      default:
        return <WelcomeStep />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Premium Header */}
      <Header />

      {/* Main Container: Mobile-First layout */}
      <main className="flex-1 flex flex-col justify-start md:justify-center py-6 px-2 md:px-4">
        
        {/* Progress Bar (Visible from Step 2 onwards) */}
        {step > 1 && (
          <div className="w-full max-w-xl mx-auto mb-2">
            <ProgressBar />
          </div>
        )}

        {/* Active Step Content */}
        <div className="w-full flex-1 flex flex-col justify-start items-center">
          {renderStep()}
        </div>
      </main>

      {/* Subtle Footer */}
      <footer className="w-full py-4 text-center text-[10px] text-neutral-500 font-sans tracking-wider border-t border-white/5 bg-black/20">
        <p>© {new Date().getFullYear()} {import.meta.env.VITE_APP_NAME || "Los Compadres Rooftop"}. Todos los derechos reservados.</p>
        <Link to="/admin" className="text-neutral-600 hover:text-gold-400 transition-colors mt-1 inline-block">
          Admin
        </Link>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <ReservationProvider>
      <ReservationAppContent />
    </ReservationProvider>
  );
}

export default App;
