import React, { useState } from 'react';
import { Table } from './Table';
import { DataInsights } from './DataInsights';
import { AppointmentView } from './AppointmentView';
import { ChevronDownIcon, ChevronRightIcon, TableIcon, BarChart2Icon, CalendarIcon, MenuIcon } from 'lucide-react';
import { SheetAnalysis } from '../utils/excelAnalyzer';

interface FileViewerProps {
  data: SheetAnalysis[];
}

export function FileViewer({ data }: FileViewerProps) {
  const [activeSheet, setActiveSheet] = useState(0);
  const [activeView, setActiveView] = useState<'table' | 'insights' | 'appointments'>('appointments');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sheet = data[activeSheet];

  const viewOptions = [
    {
      id: 'appointments',
      label: 'Rendez-vous',
      icon: CalendarIcon,
    },
    {
      id: 'table',
      label: 'Tableau',
      icon: TableIcon,
    },
    {
      id: 'insights',
      label: 'Analyses',
      icon: BarChart2Icon,
    },
  ] as const;

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl shadow-2xl border border-white/5">
      <div className="border-b border-white/5 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <button 
              className="lg:hidden text-violet-400 hover:text-violet-300"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <MenuIcon className="h-6 w-6" />
            </button>
            <TableIcon className="h-5 w-5 text-violet-400" />
            <h2 className="text-lg font-semibold text-white">Analyse du fichier</h2>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {viewOptions.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveView(id)}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${activeView === id 
                    ? 'bg-violet-500/20 text-violet-300 shadow-lg shadow-violet-500/10' 
                    : 'text-slate-300 hover:bg-white/5'
                  }`}
              >
                <Icon className="h-4 w-4 inline mr-2" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
        <div className={`
          ${isSidebarOpen ? 'block' : 'hidden'} 
          lg:block lg:col-span-3 border-b lg:border-b-0 lg:border-r border-white/5 
          p-4 bg-slate-900/30 overflow-y-auto
          fixed lg:static inset-0 z-50 lg:z-auto
        `}>
          <div className="space-y-2">
            {data.map((sheet, index) => (
              <button
                key={sheet.name}
                onClick={() => {
                  setActiveSheet(index);
                  setIsSidebarOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-2 transition-all duration-200
                  ${activeSheet === index 
                    ? 'bg-violet-500/20 text-violet-300 shadow-lg shadow-violet-500/10 border border-violet-500/20' 
                    : 'text-slate-300 hover:bg-white/5'
                  }`}
              >
                {activeSheet === index ? (
                  <ChevronDownIcon className="h-4 w-4 flex-shrink-0" />
                ) : (
                  <ChevronRightIcon className="h-4 w-4 flex-shrink-0" />
                )}
                <span className="font-medium truncate">{sheet.name}</span>
                <span className="text-xs text-slate-400 flex-shrink-0">
                  ({sheet.rowCount} lignes)
                </span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-9 p-4 sm:p-6 bg-slate-900/20">
          {activeView === 'table' ? (
            <Table data={sheet.data} />
          ) : activeView === 'insights' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sheet.columns.map((column) => (
                <DataInsights key={column.name} column={column} />
              ))}
            </div>
          ) : (
            <AppointmentView data={sheet} />
          )}
        </div>
      </div>
    </div>
  );
}