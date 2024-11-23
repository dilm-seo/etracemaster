import React from 'react';
import { FileIcon } from 'lucide-react';

export function Preloader() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative">
          <FileIcon className="h-16 w-16 text-violet-400 animate-bounce mx-auto" />
          <div className="absolute inset-0 bg-violet-500/20 blur-2xl rounded-full"></div>
        </div>
        <h1 className="mt-8 text-4xl font-bold bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 text-transparent bg-clip-text animate-pulse">
          eTraceMaster
        </h1>
        <div className="mt-6 flex justify-center gap-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full bg-violet-400"
              style={{
                animation: `bounce 1.4s infinite ease-in-out both`,
                animationDelay: `${i * 0.16}s`
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}