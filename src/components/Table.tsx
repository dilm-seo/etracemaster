import React from 'react';
import { Table as TableIcon, ArrowUpDown, ExternalLink } from 'lucide-react';

interface TableProps {
  data: any[][];
}

export function Table({ data }: TableProps) {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-white/5 overflow-hidden">
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center space-x-3">
          <TableIcon className="h-5 w-5 text-violet-400" />
          <h2 className="text-lg font-semibold text-white">Vue détaillée</h2>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-900/50">
              {data[0].map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-4 text-left text-sm font-medium text-violet-300 whitespace-nowrap border-b border-white/5 hover:bg-slate-800/50 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-2">
                    <span>{header}</span>
                    <ArrowUpDown className="h-4 w-4 opacity-50" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.slice(1).map((row, rowIndex) => (
              <tr 
                key={rowIndex}
                className="hover:bg-slate-700/20 transition-colors duration-200"
              >
                {row.map((cell, cellIndex) => {
                  const isRitm = data[0][cellIndex]?.toLowerCase().includes('ritm') || 
                               data[0][cellIndex]?.toLowerCase().includes('entete');
                  
                  return (
                    <td
                      key={cellIndex}
                      className={`px-6 py-4 text-sm whitespace-nowrap
                        ${isRitm ? 'font-medium text-violet-300' : 'text-slate-300'}`}
                    >
                      {isRitm ? (
                        <div className="flex items-center space-x-2">
                          <span>RITM-{cell}</span>
                          <a
                            href={`https://etrace.cristalcloud.com/Pilotage-10/11-livraison.php?ritm=${cell}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-violet-400 hover:text-violet-300 transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      ) : (
                        cell
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}