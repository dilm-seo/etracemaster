import React, { useState, useCallback, useEffect } from 'react';
import { FileUpload } from './components/FileUpload';
import { FileViewer } from './components/FileViewer';
import { Preloader } from './components/Preloader';
import { FloatingAssistant } from './components/FloatingAssistant';
import { FileIcon, TableIcon, ExternalLinkIcon } from 'lucide-react';

function App() {
  const [fileData, setFileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (fileData?.[0]?.data) {
      const headers = fileData[0].data[0];
      const rows = fileData[0].data.slice(1);
      const formattedAppointments = rows.map((row: any[]) => {
        const appointment: any = {};
        headers.forEach((header: string, index: number) => {
          appointment[header] = row[index];
        });
        return appointment;
      });
      setAppointments(formattedAppointments);
    }
  }, [fileData]);

  const handleFileUpload = useCallback((data: any) => {
    setFileData(data);
  }, []);

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950">
      <nav className="bg-slate-800/50 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileIcon className="h-7 w-7 text-violet-400" />
              <h1 className="text-xl font-semibold bg-gradient-to-r from-violet-400 to-fuchsia-400 text-transparent bg-clip-text">
                eTraceMaster
              </h1>
            </div>
            <a
              href="https://etrace.cristalcloud.com/Pilotage-10/11-livraison.php"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition-colors duration-200"
            >
              <ExternalLinkIcon className="h-4 w-4" />
              <span>Accéder à eTRACE</span>
            </a>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!fileData ? (
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/5">
            <div className="max-w-xl mx-auto text-center">
              <TableIcon className="h-14 w-14 text-violet-400 mx-auto mb-6 animate-bounce" />
              <h2 className="text-2xl font-bold text-white mb-4">
                Importez votre fichier Excel
              </h2>
              <p className="text-slate-300 mb-8">
                Glissez-déposez votre fichier Excel ici ou cliquez pour parcourir. 
                Nous vous aiderons à analyser et organiser vos rendez-vous.
              </p>
              <FileUpload onFileUpload={handleFileUpload} />
            </div>
          </div>
        ) : (
          <FileViewer data={fileData} />
        )}
      </main>

      <footer className="bg-slate-800/50 backdrop-blur-xl border-t border-white/5 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-slate-400">
            © {new Date().getFullYear()} - Outil créé par Etienne Aubry, Technicien SPIE
          </p>
        </div>
      </footer>

      {appointments.length > 0 && <FloatingAssistant appointments={appointments} />}
    </div>
  );
}

export default App;