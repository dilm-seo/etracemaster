import React, { useState, useEffect, useMemo } from 'react';
import { Bot, X, Calendar, Clock, MapPin, Wrench, AlertCircle } from 'lucide-react';
import { parseAppointmentDate, parseAppointmentTimes } from '../utils/dateUtils';

interface FloatingAssistantProps {
  appointments: any[];
}

export function FloatingAssistant({ appointments }: FloatingAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Mettre à jour l'heure toutes les minutes
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const nextAppointment = useMemo(() => {
    if (!appointments?.length) return null;

    // Utiliser l'heure de Paris
    const parisTime = new Date(currentTime.toLocaleString('en-US', { timeZone: 'Europe/Paris' }));
    
    return appointments
      .filter(apt => {
        if (!apt.RDV) return false;
        
        // Créer une date complète avec l'heure du rendez-vous
        const [datePart] = apt.RDV.split(' ');
        const [day, month, year] = datePart.split('-').map(Number);
        const [startTime] = parseAppointmentTimes(apt.RDV);
        const [hours, minutes] = startTime.split(':').map(Number);
        
        const appointmentDate = new Date(year, month - 1, day, hours, minutes);
        
        // Comparer avec l'heure actuelle de Paris
        return appointmentDate > parisTime;
      })
      .sort((a, b) => {
        // Trier par date et heure
        const [datePartA] = a.RDV.split(' ');
        const [dayA, monthA, yearA] = datePartA.split('-').map(Number);
        const [startTimeA] = parseAppointmentTimes(a.RDV);
        const [hoursA, minutesA] = startTimeA.split(':').map(Number);
        const dateA = new Date(yearA, monthA - 1, dayA, hoursA, minutesA);

        const [datePartB] = b.RDV.split(' ');
        const [dayB, monthB, yearB] = datePartB.split('-').map(Number);
        const [startTimeB] = parseAppointmentTimes(b.RDV);
        const [hoursB, minutesB] = startTimeB.split(':').map(Number);
        const dateB = new Date(yearB, monthB - 1, dayB, hoursB, minutesB);

        return dateA.getTime() - dateB.getTime();
      })[0];
  }, [appointments, currentTime]);

  if (!nextAppointment) return null;

  const formatDate = (date: string) => {
    const [day, month, year] = date.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  const getTimeUntilAppointment = () => {
    const [datePart] = nextAppointment.RDV.split(' ');
    const [day, month, year] = datePart.split('-').map(Number);
    const [startTime] = parseAppointmentTimes(nextAppointment.RDV);
    const [hours, minutes] = startTime.split(':').map(Number);
    
    const appointmentDate = new Date(year, month - 1, day, hours, minutes);
    const parisTime = new Date(currentTime.toLocaleString('en-US', { timeZone: 'Europe/Paris' }));
    
    const diffMs = appointmentDate.getTime() - parisTime.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 24) {
      const days = Math.floor(diffHours / 24);
      return `Dans ${days} jour${days > 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      return `Dans ${diffHours}h${diffMinutes > 0 ? ` ${diffMinutes}min` : ''}`;
    } else {
      return `Dans ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
    }
  };

  const isUrgent = nextAppointment.JUSTIFICATION?.toLowerCase().includes('urgent');

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <div className="mb-4 bg-slate-800/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/10 w-80 transform transition-all duration-300 animate-fade-in-up">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Prochaine intervention</h3>
              <p className="text-violet-400 text-sm">{getTimeUntilAppointment()}</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-3">
            {isUrgent && (
              <div className="flex items-center space-x-2 text-rose-400 bg-rose-500/10 px-3 py-2 rounded-lg">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>Intervention urgente</span>
              </div>
            )}
            
            <div className="flex items-center space-x-3 text-violet-300">
              <Calendar className="h-5 w-5 flex-shrink-0" />
              <span>{formatDate(nextAppointment.RDV.split(' ')[0])}</span>
            </div>
            
            <div className="flex items-center space-x-3 text-violet-300">
              <Clock className="h-5 w-5 flex-shrink-0" />
              <span>{parseAppointmentTimes(nextAppointment.RDV)[0]}</span>
            </div>
            
            <div className="flex items-start space-x-3 text-violet-300">
              <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span>{nextAppointment.LOCALISATION}</span>
            </div>
            
            <div className="flex items-start space-x-3 text-violet-300">
              <Wrench className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span className="line-clamp-2">{nextAppointment.ARTICLE}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-sm text-slate-300">
              Heure actuelle : {currentTime.toLocaleTimeString('fr-FR', { 
                timeZone: 'Europe/Paris',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-violet-600 hover:bg-violet-500 text-white rounded-full p-4 shadow-lg transition-all duration-300 transform hover:scale-110 ${
          isOpen ? 'rotate-180' : ''
        }`}
      >
        <Bot className="h-6 w-6" />
      </button>
    </div>
  );
}