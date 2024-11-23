import React from 'react';
import { UploadIcon, AlertTriangle, ExternalLink, Download } from 'lucide-react';
import { analyzeExcelFile } from '../utils/excelAnalyzer';

interface TechnicianSelectorProps {
  onSelect: (data: any) => void;
  loading: boolean;
  progress: number;
}

export function TechnicianSelector({ onSelect, loading }: TechnicianSelectorProps) {
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const buffer = e.target.result as ArrayBuffer;
          const analysis = analyzeExcelFile(buffer);
          onSelect(analysis);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-white text-center mb-4">
        Importez votre planning
      </h2>
      
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 bg-amber-500/10 text-amber-300 px-4 py-2 rounded-lg">
          <AlertTriangle className="h-5 w-5" />
          <p className="text-sm">
            Pour accéder aux données, veuillez d'abord vous connecter à{' '}
            <a 
              href="https://etrace.cristalcloud.com/MODULES/Covea/livraison_export.php?statut=" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 underline hover:text-amber-200"
            >
              <span>eTRACE</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-8 border border-white/10">
          <div className="text-center mb-6">
            <UploadIcon className="h-12 w-12 text-violet-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              Téléchargez votre planning depuis eTRACE
            </h3>
            <p className="text-slate-300 text-sm">
              Une fois le fichier téléchargé, importez-le ici pour visualiser vos rendez-vous
            </p>
          </div>

          <label className="block">
            <span className="sr-only">Importer un fichier Excel</span>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              className="block w-full text-sm text-slate-400
                file:mr-4 file:py-3 file:px-6
                file:rounded-lg file:border-0
                file:text-sm file:font-medium
                file:bg-violet-600 file:text-white
                hover:file:bg-violet-500
                file:cursor-pointer cursor-pointer
                focus:outline-none
                transition-all duration-200"
            />
          </label>
        </div>

        <a
          href="https://etrace.cristalcloud.com/MODULES/Covea/livraison_export.php?statut="
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center space-x-2 w-full px-6 py-4 bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-colors duration-200 group"
        >
          <Download className="h-5 w-5 transform group-hover:translate-y-0.5 transition-transform duration-200" />
          <span>Télécharger le planning complet</span>
        </a>
      </div>
    </div>
  );
}