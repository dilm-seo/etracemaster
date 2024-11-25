import React, { useState, useCallback, useEffect } from 'react';
import Snowfall from 'react-snowfall';
import { TechnicianSelector } from './components/TechnicianSelector';
import { FileViewer } from './components/FileViewer';
import { Preloader } from './components/Preloader';
import { FloatingAssistant } from './components/FloatingAssistant';
import { EncouragementMessage } from './components/EncouragementMessage';
import { InstallPWA } from './components/InstallPWA';
import { PopupManager } from './components/PopupManager';
import { usePopups } from './hooks/usePopups';
import { FileIcon, ExternalLinkIcon } from 'lucide-react';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileData, setFileData] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { popups, showSuccess, showError, showInfo, showWarning, removePopup } = usePopups();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleFileData = useCallback(async (data: any) => {
    try {
      setImporting(true);
      setProgress(0);

      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

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

        setFileData(data);
        setAppointments(formattedAppointments);
        setError(null);

        showSuccess(
          'Import réussi',
          `${formattedAppointments.length} rendez-vous ont été importés avec succès.`
        );

        if (deferredPrompt && !window.matchMedia('(display-mode: standalone)').matches) {
          setTimeout(() => {
            showInfo(
              'Installation disponible',
              "Installez l'application pour un accès rapide et hors-ligne à vos rendez-vous.",
              10000,
              async () => {
                try {
                  await deferredPrompt.prompt();
                  const { outcome } = await deferredPrompt.userChoice;
                  if (outcome === 'accepted') {
                    showSuccess('Installation réussie', "L'application a été installée avec succès.");
                  }
                  setDeferredPrompt(null);
                } catch (err) {
                  console.error('Installation error:', err);
                }
              }
            );
          }, 2000);
        }
      } else {
        throw new Error('Format de fichier invalide');
      }

      setProgress(100);
      setTimeout(() => {
        setImporting(false);
        clearInterval(progressInterval);
      }, 500);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(message);
      showError("Erreur d'import", message);
      setImporting(false);
      setProgress(0);
    }
  }, [showSuccess, showError, showInfo, deferredPrompt]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-800 to-red-600">
        <Snowfall snowflakeCount={100} />
        <div className="text-center">
          <h1 className="text-4xl font-bold animate-twinkle text-gold-200">🎄 Chargement... 🎁</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-green-800 via-red-700 to-gold-500">
      <Snowfall snowflakeCount={50} />
      <InstallPWA />
      <PopupManager popups={popups} onClose={removePopup} />

      <nav className="bg-red-600/50 backdrop-blur-xl border-b border-gold-400/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileIcon className="h-7 w-7 text-gold-300" />
              <h1 className="text-xl font-semibold bg-gradient-to-r from-red-400 to-green-400 text-transparent bg-clip-text">
                eTraceMaster 🎄
              </h1>
            </div>
            <a
              href="https://etrace.cristalcloud.com/Pilotage-10/11-livraison.php"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-700 hover:bg-red-500 text-white transition-colors duration-200"
            >
              <ExternalLinkIcon className="h-4 w-4" />
              <span>eTRACE</span>
            </a>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!fileData ? (
          <div className="bg-green-800/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/5">
            <TechnicianSelector onSelect={handleFileData} loading={importing} progress={progress} />
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

      <footer className="bg-red-800/50 backdrop-blur-xl border-t border-gold-500 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gold-200">
            🌟 Joyeux Noël {new Date().getFullYear()} ! Fait avec amour par Etienne Aubry 🎅
          </p>
        </div>
      </footer>
    </div>
  );
}
