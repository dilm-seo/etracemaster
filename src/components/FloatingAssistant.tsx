import React, { useState, useEffect, useMemo } from 'react';
import { Bot, X, Calendar, Clock, MapPin, Wrench, AlertCircle, ChevronRight, ChevronLeft, Sparkles, Ticket, Barcode, Info, ExternalLink } from 'lucide-react';
import { parseAppointmentDate, parseAppointmentTimes, formatDate } from '../utils/dateUtils';

interface FloatingAssistantProps {
  appointments: any[];
}

export function FloatingAssistant({ appointments }: FloatingAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const allSortedAppointments = useMemo(() => {
    return appointments
      .filter(apt => apt.RDV)
      .sort((a, b) => {
        const dateA = parseAppointmentDate(a.RDV.split(' ')[0]);
        const dateB = parseAppointmentDate(b.RDV.split(' ')[0]);
        const [startTimeA] = parseAppointmentTimes(a.RDV);
        const [startTimeB] = parseAppointmentTimes(b.RDV);
        
        const [hoursA, minutesA] = startTimeA.split(':').map(Number);
        const [hoursB, minutesB] = startTimeB.split(':').map(Number);
        
        const fullDateA = new Date(dateA.setHours(hoursA, minutesA));
        const fullDateB = new Date(dateB.setHours(hoursB, minutesB));
        
        return fullDateA.getTime() - fullDateB.getTime();
      });
  }, [appointments]);

  useEffect(() => {
    // Trouver l'index de la prochaine intervention
    const now = new Date();
    const nextIndex = allSortedAppointments.findIndex(apt => {
      const date = parseAppointmentDate(apt.RDV.split(' ')[0]);
      const [startTime] = parseAppointmentTimes(apt.RDV);
      const [aptHours, aptMinutes] = startTime.split(':').map(Number);
      const appointmentDate = new Date(date.setHours(aptHours, aptMinutes));
      return appointmentDate > now;
    });
    
    if (nextIndex !== -1) {
      setCurrentIndex(nextIndex);
    }
  }, [allSortedAppointments]);

  const handleNext = () => {
    if (currentIndex < allSortedAppointments.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const getTimeUntilAppointment = () => {
    if (!allSortedAppointments[currentIndex]) return '';

    const apt = allSortedAppointments[currentIndex];
    const date = parseAppointmentDate(apt.RDV.split(' ')[0]);
    const [startTime] = parseAppointmentTimes(apt.RDV);
    const [aptHours, aptMinutes] = startTime.split(':').map(Number);
    const appointmentDate = new Date(date.setHours(aptHours, aptMinutes));
    const now = new Date();
    
    const diff = appointmentDate.getTime() - now.getTime();
    
    if (diff < 0) {
      return 'Intervention passée';
    }
    
    const daysUntil = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hoursUntil = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesUntil = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (daysUntil > 0) {
      return `Dans ${daysUntil} jour${daysUntil > 1 ? 's' : ''}`;
    } else if (hoursUntil > 0) {
      return `Dans ${hoursUntil}h${minutesUntil}min`;
    } else {
      return `Dans ${minutesUntil} minute${minutesUntil > 1 ? 's' : ''}`;
    }
  };

  if (!allSortedAppointments.length) return null;

  const currentAppointment = allSortedAppointments[currentIndex];
  const hasNext = currentIndex < allSortedAppointments.length - 1;
  const hasPrevious = currentIndex > 0;
  const isUrgent = currentAppointment.JUSTIFICATION?.toLowerCase().includes('urgent');

  const ritm = currentAppointment.RITM || currentAppointment.ENTETE || 'N/A';
  const oldBarcode = 
    currentAppointment['CODE BARRE ANCIEN'] || 
    currentAppointment['ANCIEN CODE BARRE'] || 
    currentAppointment['ANCIEN CODE-BARRE'] ||
    currentAppointment['CODE BARRE'] ||
    currentAppointment['CODE-BARRE'];
  const newBarcode = 
    currentAppointment['CODE BARRE NEW'] ||
    currentAppointment['NOUVEAU CODE BARRE'] || 
    currentAppointment['NOUVEAU CODE-BARRE'] ||
    currentAppointment['NOUVEAU CB'];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <div className="mb-4 bg-gradient-to-br from-slate-800/95 to-indigo-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 w-80 transform transition-all duration-300 animate-fade-in-up">
          <div className="relative">
            <div className="flex justify-between items-start p-6">
              <div>
                <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-violet-400" />
                  <span>
                    {`Intervention ${currentIndex + 1}/${allSortedAppointments.length}`}
                  </span>
                </h3>
                <p className="text-violet-300 text-sm mt-1">{getTimeUntilAppointment()}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-white/5 rounded-lg"
                >
                  <Info className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-white/5 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="px-6 pb-6 space-y-4">
              <div className="flex items-center justify-between bg-slate-700/30 px-3 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Ticket className="h-5 w-5 text-violet-400" />
                  <span className="text-white font-medium">RITM-{ritm}</span>
                </div>
                <a
                  href={`https://etrace.cristalcloud.com/Pilotage-10/11-livraison.php?ritm=${ritm}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-400 hover:text-violet-300 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              {isUrgent && (
                <div className="flex items-center space-x-2 text-rose-300 bg-rose-500/10 px-4 py-3 rounded-xl border border-rose-500/20">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium">Intervention urgente</span>
                </div>
              )}
              
              <div className="space-y-3 bg-white/5 rounded-xl p-4">
                <div className="flex items-center space-x-3 text-violet-200">
                  <Calendar className="h-5 w-5 flex-shrink-0 text-violet-400" />
                  <span>{formatDate(currentAppointment.RDV.split(' ')[0])}</span>
                </div>
                
                <div className="flex items-center space-x-3 text-violet-200">
                  <Clock className="h-5 w-5 flex-shrink-0 text-violet-400" />
                  <span>{parseAppointmentTimes(currentAppointment.RDV)[0]}</span>
                </div>
                
                <div className="flex items-start space-x-3 text-violet-200">
                  <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5 text-violet-400" />
                  <span>{currentAppointment.LOCALISATION}</span>
                </div>
                
                <div className="flex items-start space-x-3 text-violet-200">
                  <Wrench className="h-5 w-5 flex-shrink-0 mt-0.5 text-violet-400" />
                  <span className="line-clamp-2">{currentAppointment.ARTICLE}</span>
                </div>

                {(oldBarcode || newBarcode) && (
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    {oldBarcode && (
                      <div className="flex items-center space-x-2">
                        <Barcode className="h-4 w-4 text-violet-400" />
                        <span className="text-sm text-slate-300">Ancien : </span>
                        <span className="text-sm text-white font-medium">{oldBarcode}</span>
                      </div>
                    )}
                    {newBarcode && (
                      <div className="flex items-center space-x-2">
                        <Barcode className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm text-slate-300">Nouveau : </span>
                        <span className="text-sm text-white font-medium">{newBarcode}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {showDetails && currentAppointment.JUSTIFICATION && (
                <div className="bg-white/5 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-violet-300 mb-2">Détails :</h4>
                  <p className="text-sm text-slate-300">{currentAppointment.JUSTIFICATION}</p>
                </div>
              )}

              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={handlePrevious}
                  disabled={!hasPrevious}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors duration-200
                    ${hasPrevious 
                      ? 'text-violet-300 hover:bg-white/5' 
                      : 'text-slate-600 cursor-not-allowed'}`}
                >
                  <ChevronLeft className="h-5 w-5" />
                  <span>Précédente</span>
                </button>

                <button
                  onClick={handleNext}
                  disabled={!hasNext}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors duration-200
                    ${hasNext 
                      ? 'text-violet-300 hover:bg-white/5' 
                      : 'text-slate-600 cursor-not-allowed'}`}
                >
                  <span>Suivante</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              <div className="text-center pt-2 text-sm text-slate-400">
                Heure actuelle : {currentTime.toLocaleTimeString('fr-FR', { 
                  timeZone: 'Europe/Paris',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => {
          setIsAnimating(true);
          setIsOpen(!isOpen);
          setTimeout(() => setIsAnimating(false), 300);
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 transform hover:scale-110 hover:shadow-violet-500/25
          ${isAnimating ? 'animate-bounce' : ''}
          ${isOpen ? 'rotate-180 bg-violet-700' : ''}`}
      >
        <Bot className="h-6 w-6" />
        {!isOpen && isHovered && (
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap">
            <div className="bg-slate-800 text-white px-4 py-2 rounded-xl text-sm animate-fade-in-up flex items-center space-x-2 border border-white/10 shadow-lg">
              <span>Voir la prochaine intervention</span>
              <ChevronRight className="h-4 w-4 text-violet-400" />
            </div>
          </div>
        )}
      </button>
    </div>
  );
}