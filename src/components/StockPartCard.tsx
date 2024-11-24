import React, { useState } from 'react';
import { Calendar, MapPin, Package, Ticket, Clock, ChevronDown, ChevronUp, ExternalLink, Copy, Check } from 'lucide-react';
import { formatDate, parseAppointmentTimes } from '../utils/dateUtils';
import { StatusBadge } from './StatusBadge';

interface StockPartCardProps {
  appointment: any;
  animate?: boolean;
  delay?: number;
}

export function StockPartCard({ appointment, animate = false, delay = 0 }: StockPartCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const [startTime] = parseAppointmentTimes(appointment['RDV'] || '');
  const ritm = appointment['RITM'] || appointment['ENTETE'] || '';
  const status = appointment['STATUT'] || 'En attente';

  const handleCopyAndOpen = async () => {
    try {
      await navigator.clipboard.writeText(ritm);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      window.open(`https://etrace.cristalcloud.com/Pilotage-10/11-livraison.php?ritm=${ritm}`, '_blank');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div 
      className={`bg-slate-800/50 backdrop-blur-xl rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-white/5
        ${animate ? 'opacity-0 translate-y-4 animate-fade-in-up' : ''}`}
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: 'forwards'
      }}
    >
      <div className="p-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span className="font-medium">{formatDate(appointment['RDV']?.split(' ')[0] || '')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>{startTime}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyAndOpen}
              className="flex items-center space-x-1 text-white hover:text-violet-200 transition-colors duration-200"
              title="Copier le RITM et ouvrir dans eTRACE"
            >
              <Ticket className="h-4 w-4" />
              <span className="font-medium">{ritm}</span>
              {isCopied ? (
                <Check className="h-3 w-3 ml-1" />
              ) : (
                <>
                  <Copy className="h-3 w-3 ml-1 opacity-50" />
                  <ExternalLink className="h-3 w-3 opacity-50" />
                </>
              )}
            </button>
          </div>
        </div>

        <StatusBadge status={status} />
      </div>

      <div className="p-4 space-y-4">
        <div className="space-y-3">
          <div className="flex items-start space-x-2">
            <Package className="h-5 w-5 text-violet-400 mt-1 flex-shrink-0" />
            <span className="text-slate-300 text-sm">{appointment['ARTICLE']}</span>
          </div>

          <div className="flex items-start space-x-2">
            <MapPin className="h-5 w-5 text-violet-400 mt-1 flex-shrink-0" />
            <span className="text-slate-300 text-sm">{appointment['LOCALISATION']}</span>
          </div>
        </div>

        {appointment['JUSTIFICATION'] && (
          <div className="mt-4 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-white">Détails :</h4>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center text-violet-400 text-sm hover:text-violet-300"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Voir moins</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Voir plus</span>
                  </>
                )}
              </button>
            </div>
            <p className={`text-slate-300 text-sm ${isExpanded ? '' : 'line-clamp-3'}`}>
              {appointment['JUSTIFICATION']}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}