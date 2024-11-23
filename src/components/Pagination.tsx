import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
}

export function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  itemsPerPage,
  totalItems 
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5;
    
    let start = Math.max(1, currentPage - Math.floor(showPages / 2));
    let end = Math.min(totalPages, start + showPages - 1);
    
    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-800/50 backdrop-blur-xl rounded-xl p-4 border border-white/5">
      <div className="text-sm text-slate-400">
        Affichage {startItem}-{endItem} sur {totalItems} rendez-vous
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg transition-colors duration-200
            ${currentPage === 1 
              ? 'text-slate-600 cursor-not-allowed' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          title="Première page"
        >
          <ChevronsLeft className="h-5 w-5" />
        </button>

        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg transition-colors duration-200
            ${currentPage === 1 
              ? 'text-slate-600 cursor-not-allowed' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          title="Page précédente"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex items-center">
          {getPageNumbers().map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`min-w-[2.5rem] h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors duration-200
                ${pageNum === currentPage 
                  ? 'bg-violet-500/20 text-violet-300 shadow-lg shadow-violet-500/10' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              {pageNum}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg transition-colors duration-200
            ${currentPage === totalPages 
              ? 'text-slate-600 cursor-not-allowed' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          title="Page suivante"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg transition-colors duration-200
            ${currentPage === totalPages 
              ? 'text-slate-600 cursor-not-allowed' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          title="Dernière page"
        >
          <ChevronsRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}