import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, User, Wrench, Clock, Truck, Phone, ChevronDown, ChevronUp, AlertCircle, ExternalLink, Ticket, Copy, Check, Barcode, Share2, Mail } from 'lucide-react';
import { parseAppointmentTimes, formatDate, extractPhoneNumber } from '../utils/dateUtils';
import { StatusBadge } from './StatusBadge';

interface AppointmentCardProps {
  appointment: any;
  animate?: boolean;
  delay?: number;
}

export function AppointmentCard({ appointment, animate = false, delay = 0 }: AppointmentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const [startTime, endTime] = parseAppointmentTimes(appointment['RDV'] || '');
  const phoneNumber = extractPhoneNumber(appointment['JUSTIFICATION']);
  const isUrgent = appointment['JUSTIFICATION']?.toLowerCase().includes('urgent');
  const ritm = appointment['RITM'] || appointment['ENTETE'] || '';
  const status = appointment['STATUT'] || 'En attente';

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

  // UseEffect to handle URL parameters for eTRACE filtering
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('ritm')) {
      const ritmValue = params.get('ritm');

      // Simulate form interaction in the eTRACE system
      const rechValeurElement = document.querySelector('#RECH_VALEUR') as HTMLInputElement;
      const rechColonneElement = document.querySelector('#RECH_COLONNE') as HTMLSelectElement;
      const formElement = document.querySelector('form[action="11-livraison.php"]') as HTMLFormElement;

      if (rechValeurElement && rechColonneElement && formElement) {
        rechValeurElement.value = ritmValue ?? '';
        rechColonneElement.value = 'LIG_NUMERO¤RITM';
        formElement.submit();
      }
    }
  }, []);

  // Function to copy RITM to clipboard
  const handleCopyRitm = async () => {
    try {
      await navigator.clipboard.writeText(ritm);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Function to handle share using Web Share API or Clipboard
  const handleShare = async () => {
    setIsSharing(true);
    const appointmentDate = formatDate(appointment['RDV']?.split(' ')[0] || '');
    const shareText = `
Intervention ${ritm}
📅 ${appointmentDate}
🕒 ${startTime} - ${endTime}
📍 ${appointment['LOCALISATION']}
🔧 ${appointment['ARTICLE']}
${isUrgent ? '⚠️ URGENT' : ''}
    `.trim();

    try {
      if (navigator.share) {
        await navigator.share({
          title: `Intervention ${ritm}`,
          text: shareText,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        alert('Détails copiés dans le presse-papiers !');
      }
    } catch (err) {
      console.error('Erreur lors du partage:', err);
    } finally {
      setIsSharing(false);
    }
  };

  // Function to handle email sharing
  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Intervention ${ritm}`);
    const body = encodeURIComponent(`
Détails de l'intervention :

RITM: ${ritm}
Date: ${formatDate(appointment['RDV']?.split(' ')[0] || '')}
Horaire: ${startTime} - ${endTime}
Lieu: ${appointment['LOCALISATION']}
Intervention: ${appointment['ARTICLE']}
${isUrgent ? '\nINTERVENTION URGENTE' : ''}
${oldBarcode ? `\nAncien code-barre: ${oldBarcode}` : ''}
${newBarcode ? `\nNouveau code-barre: ${newBarcode}` : ''}
    `);
    window.open(`mailto:?subject=${subject}&body=${body}`);
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
      <div className={`p-4 text-white flex flex-col gap-3
        ${isUrgent 
          ? 'bg-gradient-to-r from-rose-500 to-pink-600' 
          : 'bg-gradient-to-r from-violet-600 to-indigo-600'}`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span className="font-medium">{formatDate(appointment['RDV']?.split(' ')[0] || '')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span className="font-medium">{startTime}</span>
            <span className="text-white/60">→</span>
            <span className="font-medium">{endTime}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge status={status} />
          {isUrgent && (
            <div className="flex items-center space-x-2 bg-white/20 px-3 py-1.5 rounded-full shadow-sm backdrop-blur-sm">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Urgent</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between bg-slate-700/30 px-3 py-2 rounded-lg">
          <div className="flex items-center space-x-2">
            <Ticket className="h-5 w-5 text-violet-400" />
            <span className="text-white font-medium">{ritm}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="text-violet-400 hover:text-violet-300 transition-colors duration-200"
              title="Partager"
              disabled={isSharing}
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              onClick={handleEmailShare}
              className="text-violet-400 hover:text-violet-300 transition-colors duration-200"
              title="Envoyer par email"
            >
              <Mail className="h-4 w-4" />
            </button>
          </div>
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

        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            onClick={handleCopyRitm}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            {isCopied ? (
              <>
                <Check className="h-4 w-4" />
                <span>RITM copié!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copier le RITM</span>
              </>
            )}
          </button>

          <a
            href={`https://etrace.cristalcloud.com/Pilotage-10/11-livraison.php?ritm=${ritm}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Ouvrir eTRACE</span>
          </a>
        </div>
      </div>
    </div>
  );
}
