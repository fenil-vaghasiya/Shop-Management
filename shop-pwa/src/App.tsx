import { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import { syncOfflineData } from './offline/sync';
import BottomNav from './components/ui/BottomNav';

function App() {
  useEffect(() => {
    syncOfflineData();

    window.addEventListener('online', syncOfflineData);

    return () => {
      window.removeEventListener('online', syncOfflineData);
    };
  }, []);

  return (
    <div className="pb-20">
      <AppRoutes />
      <BottomNav />
    </div>
  );
}

export default App;
