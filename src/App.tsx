
import { useEffect, useState } from 'react';
import { DataRoomProvider } from './contexts/DataRoomProvider';
import { initializeDataLayer } from './data-room';
import DataRoomDashboard from './components/DataRoomDashboard';

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeDataLayer();
        setIsInitialized(true);
      } catch (error) {
        setInitError(error instanceof Error ? error.message : 'Failed to initialize');
      }
    };

    init();
  }, []);

  if (initError) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Initialization Error</h1>
          <p className="text-gray-600">{initError}</p>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h1>
          <p className="text-gray-600">Initializing Data Room...</p>
        </div>
      </div>
    );
  }

  return (
    <DataRoomProvider>
      <DataRoomDashboard />
    </DataRoomProvider>
  );
}

export default App;
