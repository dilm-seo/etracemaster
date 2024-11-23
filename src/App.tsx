import React, { useState, useCallback, useEffect } from 'react';
import { FileViewer } from './components/FileViewer';
import { TechnicianSelector } from './components/TechnicianSelector';
import { Preloader } from './components/Preloader';
import { FloatingAssistant } from './components/FloatingAssistant';
import { EncouragementMessage } from './components/EncouragementMessage';
import { FileIcon, ExternalLinkIcon } from 'lucide-react';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileData, setFileData] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleFileData = (data: any) => {
    setFileData(data);
    if (data?.[0]?.data) {
      const headers = data[0].data[0];
      const rows = data[0].data.slice(1);
      const formattedAppointments = rows.map((row: any[]) => {
        const appointment: any = {};
        headers.forEach((header: string, index: number) => {
          appointment[header] = row[index];
        });
        return appointment;
      });
      setAppointments(formattedAppointments);
      setError(null);
    }
  };

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
            <TechnicianSelector 
              onSelect={handleFileData}
              loading={importing}
              progress={progress}
            />
            {error && (
              <div className="mt-6 max-w-md mx-auto">
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
                  <p className="text-red-400">{error}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <FileViewer data={fileData} />
        )}
      </main>

      {appointments.length > 0 && <FloatingAssistant appointments={appointments} />}
      <EncouragementMessage />

      <footer className="bg-slate-800/50 backdrop-blur-xl border-t border-white/5 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-slate-400">
            © {new Date().getFullYear()} - Outil créé par Etienne Aubry, Technicien SPIE
          </p>
        </div>
      </footer>
    </div>
  );
}