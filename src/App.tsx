
import { useEffect, useState } from 'react';
import { DataRoomProvider } from './contexts/DataRoomProvider';
import { initializeDataLayer } from './data-room';
import './App.css';

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
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Data Room Application</h1>
            <div className="bg-white rounded-lg shadow-md p-8">
              <p className="text-lg text-gray-600 mb-4">
                Welcome to your Data Room! This application provides secure document management with:
              </p>
              <ul className="text-left text-gray-600 space-y-2 max-w-md mx-auto">
                <li>• Create and manage folders</li>
                <li>• Upload PDF files</li>
                <li>• Organize documents hierarchically</li>
                <li>• Rename and delete items</li>
                <li>• Persistent local storage</li>
              </ul>
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 mb-2">
                  ✅ IndexedDB DataLayer initialized successfully
                </p>
                <p className="text-sm text-blue-800 mb-2">
                  ✅ FolderService configured with dependency injection
                </p>
                <p className="text-sm text-blue-800">
                  Ready for component integration! Use getFolderService() to access the service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DataRoomProvider>
  );
}

export default App;
