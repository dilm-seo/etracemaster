import React, { useState } from 'react';
import { UploadIcon, AlertTriangle, ExternalLink, Download, FilterIcon, FileSpreadsheet } from 'lucide-react';
import { analyzeExcelFile } from '../utils/excelAnalyzer';

interface TechnicianSelectorProps {
  onSelect: (data: any) => void;
  loading: boolean;
  progress: number;
}

export function TechnicianSelector({ onSelect, loading, progress }: TechnicianSelectorProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.name.match(/\.(xlsx|xls)$/)) {
      alert('Veuillez sélectionner un fichier Excel (.xlsx ou .xls)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        try {
          const buffer = e.target.result as ArrayBuffer;
          const analysis = analyzeExcelFile(buffer);
          onSelect(analysis);
        } catch (err) {
          console.error('Erreur lors de l\'analyse du fichier:', err);
          alert('Erreur lors de l\'analyse du fichier. Vérifiez que le format est correct.');
        }
      }
    };
    reader.onerror = () => {
      console.error('Erreur lors de la lecture du fichier');
      alert('Erreur lors de la lecture du fichier');
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-white text-center mb-4">
        Bienvenue sur eTraceMaster
      </h2>
      
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 bg-amber-500/10 text-amber-300 px-4 py-2 rounded-lg">
          <AlertTriangle className="h-5 w-5" />
          <p className="text-sm">
            Pour télécharger les données, assurez vous d'abord de vous connecter à{' '}
            <a 
              href="https://etrace.cristalcloud.com/Pilotage-10/11-livraison.php" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 underline hover:text-amber-200"
            >
              <span>eTRACE</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </p>
        </div>
		 <div className="space-y-4">
          <a
            href="https://etrace.cristalcloud.com/MODULES/Covea/livraison_export.php?statut="
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-2 w-full px-6 py-4 bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-all duration-200 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-400/20 to-fuchsia-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Download className="h-5 w-5 transform group-hover:translate-y-0.5 transition-transform duration-200" />
            <span className="relative">Télécharger le planning complet</span>
          </a>

          <div className="flex items-center space-x-2 text-slate-300 text-sm justify-center bg-slate-700/30 px-4 py-3 rounded-lg">
            <FilterIcon className="h-4 w-4 text-violet-400" />
            <p>Attention à vérifier vos filtres dans eTRACE avant le téléchargement</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-8 border border-white/10">
          <div className="text-center mb-6">
            <FileSpreadsheet className="h-12 w-12 text-violet-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              Importez votre planning
            </h3>
            <p className="text-slate-300 text-sm">
              Une fois le fichier téléchargé depuis eTRACE, importez-le ici pour visualiser vos rendez-vous
            </p>
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300
              ${dragActive 
                ? 'border-violet-400 bg-violet-400/10' 
                : 'border-white/10 hover:border-violet-400/50 hover:bg-white/5'
              }
              ${loading ? 'pointer-events-none' : 'cursor-pointer'}`}
          >
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={loading}
            />
            
            {loading ? (
              <div className="space-y-4">
                <div className="h-1 w-full bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-violet-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-center text-violet-400">
                  Analyse du fichier... {progress}%
                </p>
              </div>
            ) : (
              <div className="text-center">
                <UploadIcon className={`h-12 w-12 mx-auto mb-4 transition-colors duration-300
                  ${dragActive ? 'text-violet-400' : 'text-slate-400'}`} 
                />
                <p className={`text-sm ${dragActive ? 'text-violet-400' : 'text-slate-300'}`}>
                  {dragActive 
                    ? 'Déposez le fichier ici'
                    : 'Glissez-déposez un fichier Excel ici, ou cliquez pour sélectionner'
                  }
                </p>
              </div>
            )}
          </div>
        </div>

       
      </div>
    </div>
  );
}