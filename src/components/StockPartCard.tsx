import React, { useState } from 'react';
import { Calendar, MapPin, Package, Ticket, Clock, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { formatDate, parseAppointmentTimes } from '../utils/dateUtils';

interface StockPartCardProps {
  appointment: any;
  animate?: boolean;
  delay?: number;
}

export function StockPartCard({ appointment, animate = false, delay = 0 }: StockPartCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const ritm = appointment.RITM || appointment.ENTETE || 'N/A';
  const [startTime] = parseAppointmentTimes(appointment['RDV'] || '');

  return (
    <div 
      className={`bg-slate-800/50 backdrop-blur-xl rounded-xl shadow-lg overflow-hidden border border-white/5 print:break-inside-avoid
        ${animate ? 'opacity-0 translate-y-4 animate-fade-in-up' : ''}`}
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: 'forwards'
      }}
    >
      <div className="px-4 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white flex items-center justify-between">
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
          <a
            href={`https://etrace.cristalcloud.com/Pilotage-10/11-livraison.php?ritm=${ritm}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 hover:text-violet-200 transition-colors"
          >
            <Ticket className="h-4 w-4" />
            <span className="font-medium">RITM-{ritm}</span>
            <ExternalLink className="h-3 w-3 opacity-50" />
          </a>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex items-start space-x-3">
          <Package className="h-5 w-5 text-violet-400 mt-1 flex-shrink-0" />
          <span className="text-white">{appointment['ARTICLE']}</span>
        </div>

        <div className="flex items-center space-x-3">
          <MapPin className="h-5 w-5 text-violet-400 flex-shrink-0" />
          <span className="text-slate-300">{appointment['LOCALISATION']}</span>
        </div>

        {appointment['JUSTIFICATION'] && (
          <div className="pt-3 border-t border-white/5">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-between w-full text-left text-sm text-violet-300 hover:text-violet-200 transition-colors"
            >
              <span className="font-medium">Détails de l'intervention</span>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            {isExpanded && (
              <p className="mt-2 text-sm text-slate-300 bg-white/5 rounded-lg p-3">
                {appointment['JUSTIFICATION']}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}