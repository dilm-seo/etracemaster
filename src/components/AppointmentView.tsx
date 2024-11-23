import React, { useState, useEffect, useMemo } from 'react';
import { DatePicker } from './DatePicker';
import { AppointmentCard } from './AppointmentCard';
import { SheetAnalysis } from '../utils/excelAnalyzer';
import { getTodayString, findClosestDate, parseAppointmentDate } from '../utils/dateUtils';
import { Calendar, Users, AlertCircle } from 'lucide-react';

interface AppointmentViewProps {
  data: SheetAnalysis;
}

export function AppointmentView({ data }: AppointmentViewProps) {
  const appointments = useMemo(() => {
    return data.data.slice(1).map((row: any[]) => {
      const obj: any = {};
      data.data[0].forEach((header: string, index: number) => {
        obj[header] = row[index];
      });
      return obj;
    });
  }, [data]);

  const uniqueDates = useMemo(() => {
    const dates = new Set(['all']);
    appointments.forEach(apt => {
      if (apt['RDV']) {
        const date = apt['RDV'].split(' ')[0];
        if (date) dates.add(date);
      }
    });
    return dates;
  }, [appointments]);

  const uniqueTechs = useMemo(() => {
    const techs = new Set(['all']);
    appointments.forEach(apt => {
      if (apt['TECHNICIEN']) techs.add(apt['TECHNICIEN']);
    });
    return techs;
  }, [appointments]);

  const today = getTodayString();
  const [selectedDate, setSelectedDate] = useState(findClosestDate(Array.from(uniqueDates), today));
  const [selectedTech, setSelectedTech] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'tech' | 'location'>('date');

  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      if (selectedDate !== 'all' && !apt['RDV']?.startsWith(selectedDate)) return false;
      if (selectedTech !== 'all' && apt['TECHNICIEN'] !== selectedTech) return false;
      if (selectedStatus === 'urgent' && !apt['JUSTIFICATION']?.toLowerCase().includes('urgent')) return false;
      if (selectedStatus === 'normal' && apt['JUSTIFICATION']?.toLowerCase().includes('urgent')) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'date') {
        return parseAppointmentDate(a['RDV']?.split(' ')[0]).getTime() - 
               parseAppointmentDate(b['RDV']?.split(' ')[0]).getTime();
      }
      if (sortBy === 'tech') {
        return (a['TECHNICIEN'] || '').localeCompare(b['TECHNICIEN'] || '');
      }
      return (a['LOCALISATION'] || '').localeCompare(b['LOCALISATION'] || '');
    });
  }, [appointments, selectedDate, selectedTech, selectedStatus, sortBy]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DatePicker
          selectedDate={selectedDate}
          onChange={(date) => {
            if (date) {
              const formattedDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
              setSelectedDate(formattedDate);
            } else {
              setSelectedDate('all');
            }
          }}
          availableDates={uniqueDates}
        />

        <select
          value={selectedTech}
          onChange={(e) => setSelectedTech(e.target.value)}
          className="bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-white"
        >
          <option value="all">Tous les techniciens</option>
          {Array.from(uniqueTechs).slice(1).map(tech => (
            <option key={tech} value={tech}>{tech}</option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-white"
        >
          <option value="all">Tous les statuts</option>
          <option value="urgent">Urgents</option>
          <option value="normal">Non urgents</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-white"
        >
          <option value="date">Trier par date</option>
          <option value="tech">Trier par technicien</option>
          <option value="location">Trier par localisation</option>
        </select>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment, index) => (
            <AppointmentCard
              key={`${appointment['ENTETE']}-${index}`}
              appointment={appointment}
              animate={true}
              delay={index * 100}
            />
          ))
        ) : (
          <div className="col-span-full">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-8 text-center border border-white/5">
              <Calendar className="h-12 w-12 text-violet-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                Aucun rendez-vous trouvé
              </h3>
              <p className="text-slate-400">
                Essayez de modifier vos filtres pour voir plus de résultats
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-slate-400 border-t border-white/5 pt-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>{uniqueTechs.size - 1} techniciens</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>{uniqueDates.size - 1} dates</span>
          </div>
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4" />
            <span>
              {appointments.filter(apt => apt['JUSTIFICATION']?.toLowerCase().includes('urgent')).length} urgents
            </span>
          </div>
        </div>
        <div>
          Total: {filteredAppointments.length} rendez-vous
        </div>
      </div>
    </div>
  );
}