import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadIcon, Download, Users } from 'lucide-react';
import { analyzeExcelFile } from '../utils/excelAnalyzer';

interface FileUploadProps {
  onFileUpload: (data: any) => void;
}

const TECHNICIANS = [
  { id: '', name: 'Tous les techniciens' },
  { id: 'Aubry', name: 'Aubry Etienne' },
  { id: 'Marzat', name: 'Marzat Romain' },
  { id: 'Delanoe', name: 'Delanoe Sonia' },
  { id: 'Perez', name: 'Perez Anthony' },
  { id: 'Albert', name: 'Albert Alexis' },
  { id: 'Lecomte', name: 'Lecomte Vincent' }
];

export function FileUpload({ onFileUpload }: FileUploadProps) {
  const [selectedTech, setSelectedTech] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (!event.target?.result) return;
      const buffer = event.target.result as ArrayBuffer;
      const analysis = analyzeExcelFile(buffer);
      onFileUpload(analysis);
    };

    reader.readAsArrayBuffer(file);
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    multiple: false,
  });

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-300
          ${isDragActive 
            ? 'border-violet-400 bg-violet-400/10' 
            : 'border-white/10 hover:border-violet-400/50 hover:bg-white/5'}`}
      >
        <input {...getInputProps()} />
        <UploadIcon className={`h-12 w-12 mx-auto mb-4 transition-colors duration-300
          ${isDragActive ? 'text-violet-400' : 'text-slate-400'}`} />
        {isDragActive ? (
          <p className="text-violet-400 font-medium">Déposez le fichier ici</p>
        ) : (
          <p className="text-slate-300">
            Glissez-déposez un fichier Excel ici, ou cliquez pour sélectionner
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <div className="relative w-full sm:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Users className="h-5 w-5 text-violet-400" />
          </div>
          <select
            value={selectedTech}
            onChange={(e) => setSelectedTech(e.target.value)}
            className="block w-full sm:w-auto pl-10 pr-10 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500 appearance-none cursor-pointer hover:bg-slate-700/50 transition-colors duration-200"
          >
            {TECHNICIANS.map(tech => (
              <option key={tech.id} value={tech.id}>{tech.name}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-violet-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        <a
          href={`https://etrace.cristalcloud.com/MODULES/Covea/livraison_export.php?statut=&technicien=${selectedTech}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors duration-200 group whitespace-nowrap w-full sm:w-auto justify-center"
        >
          <Download className="h-5 w-5 transform group-hover:translate-y-0.5 transition-transform duration-200" />
          <span>Télécharger le planning</span>
        </a>
      </div>
    </div>
  );
}