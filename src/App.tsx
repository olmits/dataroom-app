
import { DataRoomProvider } from './contexts/DataRoomProvider';
import './App.css';

function App() {
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
                <p className="text-sm text-blue-800">
                  Context architecture has been refactored with separate Loading, Error, Folder, and Items contexts.
                  Ready for component integration!
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
