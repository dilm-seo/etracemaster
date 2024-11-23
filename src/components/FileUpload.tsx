import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadIcon } from 'lucide-react';
import { analyzeExcelFile } from '../utils/excelAnalyzer';

interface FileUploadProps {
  onFileUpload: (data: any) => void;
}

export function FileUpload({ onFileUpload }: FileUploadProps) {
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
  );
}