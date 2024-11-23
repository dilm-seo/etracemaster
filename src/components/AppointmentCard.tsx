import React, { useState } from 'react';
import { Calendar, MapPin, User, Wrench, Clock, Truck, Phone, ChevronDown, ChevronUp, AlertCircle, ExternalLink, Ticket, Copy, Check, Barcode } from 'lucide-react';
import { parseAppointmentTimes, formatDate, extractPhoneNumber } from '../utils/dateUtils';

interface AppointmentCardProps {
  appointment: any;
  animate?: boolean;
  delay?: number;
}

export function AppointmentCard({ appointment, animate = false, delay = 0 }: AppointmentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [startTime, endTime] = parseAppointmentTimes(appointment['RDV'] || '');
  const phoneNumber = extractPhoneNumber(appointment['JUSTIFICATION']);
  const isUrgent = appointment['JUSTIFICATION']?.toLowerCase().includes('urgent');
  const ritm = appointment['RITM'] || appointment['ENTETE'] || 'N/A';

  // Gestion des différentes possibilités de noms de colonnes pour les codes-barres
  const oldBarcode = 
    appointment['CODE BARRE ANCIEN'] || 
    appointment['ANCIEN CODE BARRE'] || 
    appointment['ANCIEN CODE-BARRE'] ||
    appointment['CODE BARRE'] ||
    appointment['CODE-BARRE'] ||
    null;

  const newBarcode = 
    appointment['CODE BARRE NEW'] ||
    appointment['NOUVEAU CODE BARRE'] || 
    appointment['NOUVEAU CODE-BARRE'] ||
    appointment['NOUVEAU CB'] ||
    null;

  const handleCopyRitm = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(`RITM-${ritm}`);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div 
      className={`bg-slate-800/50 backdrop-blur-xl rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-white/5 group
        ${animate ? 'opacity-0 translate-y-4 animate-fade-in-up' : ''}
        ${isUrgent ? 'ring-2 ring-rose-500' : ''}
      `}
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: 'forwards'
      }}
    >
      <div className={`px-4 py-3 text-white flex flex-wrap items-center justify-between gap-2
        ${isUrgent 
          ? 'bg-gradient-to-r from-rose-500 to-pink-600' 
          : 'bg-gradient-to-r from-violet-600 to-indigo-600'}`}
      >
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span className="font-medium">{formatDate(appointment['RDV']?.split(' ')[0] || '')}</span>
          {isUrgent && (
            <div className="flex items-center space-x-1 bg-white/10 px-2 py-0.5 rounded-full">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">Urgent</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4" />
          <span className="font-medium">{startTime}</span>
          <span className="text-white/60">→</span>
          <span className="font-medium">{endTime}</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between bg-slate-700/30 px-3 py-2 rounded-lg">
          <div className="flex items-center space-x-2">
            <Ticket className="h-5 w-5 text-violet-400" />
            <span className="text-white font-medium">RITM-{ritm}</span>
          </div>
          <button
            onClick={handleCopyRitm}
            className="flex items-center space-x-1 text-violet-400 hover:text-violet-300 transition-colors duration-200"
            title="Copier le RITM"
          >
            {isCopied ? (
              <>
                <Check className="h-4 w-4" />
                <span className="text-sm">Copié!</span>
              </>
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>

        {(oldBarcode || newBarcode) && (
          <div className="bg-slate-700/30 px-3 py-2 rounded-lg space-y-2">
            {oldBarcode && (
              <div className="flex items-center space-x-2">
                <Barcode className="h-5 w-5 text-violet-400" />
                <span className="text-slate-300 text-sm">Ancien code : </span>
                <span className="text-white font-medium">{oldBarcode}</span>
              </div>
            )}
            {newBarcode && (
              <div className="flex items-center space-x-2">
                <Barcode className="h-5 w-5 text-emerald-400" />
                <span className="text-slate-300 text-sm">Nouveau code : </span>
                <span className="text-white font-medium">{newBarcode}</span>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <MapPin className="h-5 w-5 text-violet-400 mt-1 flex-shrink-0" />
              <span className="text-slate-300 text-sm">{appointment['LOCALISATION']}</span>
            </div>

            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-violet-400" />
              <span className="text-slate-300 text-sm">{appointment['TECHNICIEN']}</span>
            </div>

            {phoneNumber && (
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-violet-400" />
                <a href={`tel:${phoneNumber}`} className="text-slate-300 text-sm hover:text-violet-400">
                  {phoneNumber}
                </a>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <Wrench className="h-5 w-5 text-violet-400 mt-1 flex-shrink-0" />
              <span className="text-slate-300 text-sm line-clamp-2">{appointment['ARTICLE']}</span>
            </div>

            {appointment['POINT RELAI'] && (
              <div className="flex items-start space-x-2">
                <Truck className="h-5 w-5 text-violet-400 mt-1 flex-shrink-0" />
                <span className="text-slate-300 text-sm">{appointment['POINT RELAI']}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/5">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-white">Notes :</h4>
            {appointment['JUSTIFICATION']?.length > 100 && (
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
            )}
          </div>
          <p className={`text-slate-300 text-sm ${isExpanded ? '' : 'line-clamp-3'}`}>
            {appointment['JUSTIFICATION']}
          </p>
        </div>

        <a
          href={`https://etrace.cristalcloud.com/Pilotage-10/11-livraison.php?ritm=${ritm}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-center w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors duration-200 gap-2 group-hover:bg-emerald-500"
        >
          <ExternalLink className="h-4 w-4" />
          <span>Ouvrir dans eTRACE</span>
        </a>
      </div>
    </div>
  );
}