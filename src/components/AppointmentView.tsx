import React, { useState, useEffect, useMemo } from 'react';
import { DatePicker } from './DatePicker';
import { AppointmentCard } from './AppointmentCard';
import { Pagination } from './Pagination';
import { SheetAnalysis } from '../utils/excelAnalyzer';
import { getTodayString, findClosestDate, parseAppointmentDate } from '../utils/dateUtils';
import { Calendar, Users, AlertCircle, Search, Filter, SortAsc, MapPin, ListFilter } from 'lucide-react';

interface AppointmentViewProps {
  data: SheetAnalysis;
}

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 25, 50];

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

  const uniqueLocations = useMemo(() => {
    const locations = new Set(['all']);
    appointments.forEach(apt => {
      if (apt['LOCALISATION']) locations.add(apt['LOCALISATION']);
    });
    return locations;
  }, [appointments]);

  const today = getTodayString();
  const [selectedDate, setSelectedDate] = useState(findClosestDate(Array.from(uniqueDates), today));
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'tech' | 'location'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Reset page when filters change or items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDate, selectedLocation, selectedStatus, searchQuery, sortBy, sortOrder, itemsPerPage]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      if (selectedDate !== 'all' && !apt['RDV']?.startsWith(selectedDate)) return false;
      if (selectedLocation !== 'all' && apt['LOCALISATION'] !== selectedLocation) return false;
      if (selectedStatus === 'urgent' && !apt['JUSTIFICATION']?.toLowerCase().includes('urgent')) return false;
      if (selectedStatus === 'normal' && apt['JUSTIFICATION']?.toLowerCase().includes('urgent')) return false;
      
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        return (
          apt['RITM']?.toLowerCase().includes(searchLower) ||
          apt['LOCALISATION']?.toLowerCase().includes(searchLower) ||
          apt['ARTICLE']?.toLowerCase().includes(searchLower) ||
          apt['JUSTIFICATION']?.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    }).sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'date') {
        comparison = parseAppointmentDate(a['RDV']?.split(' ')[0]).getTime() - 
                    parseAppointmentDate(b['RDV']?.split(' ')[0]).getTime();
      } else if (sortBy === 'tech') {
        comparison = (a['TECHNICIEN'] || '').localeCompare(b['TECHNICIEN'] || '');
      } else {
        comparison = (a['LOCALISATION'] || '').localeCompare(b['LOCALISATION'] || '');
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [appointments, selectedDate, selectedLocation, selectedStatus, searchQuery, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAppointments = filteredAppointments.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-violet-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher..."
            className="block w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-violet-400" />
          </div>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="block w-full pl-10 pr-10 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500 appearance-none cursor-pointer"
          >
            <option value="all">Toutes les localisations</option>
            {Array.from(uniqueLocations).slice(1).map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-violet-400" />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="block w-full pl-10 pr-10 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500 appearance-none cursor-pointer"
          >
            <option value="all">Tous les statuts</option>
            <option value="urgent">Urgents</option>
            <option value="normal">Non urgents</option>
          </select>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SortAsc className="h-5 w-5 text-violet-400" />
          </div>
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [newSortBy, newSortOrder] = e.target.value.split('-') as [typeof sortBy, typeof sortOrder];
              setSortBy(newSortBy);
              setSortOrder(newSortOrder);
            }}
            className="block w-full pl-10 pr-10 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500 appearance-none cursor-pointer"
          >
            <option value="date-asc">Date (croissant)</option>
            <option value="date-desc">Date (décroissant)</option>
            <option value="tech-asc">Technicien (A-Z)</option>
            <option value="tech-desc">Technicien (Z-A)</option>
            <option value="location-asc">Localisation (A-Z)</option>
            <option value="location-desc">Localisation (Z-A)</option>
          </select>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ListFilter className="h-5 w-5 text-violet-400" />
          </div>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="block w-full pl-10 pr-10 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500 appearance-none cursor-pointer"
          >
            {ITEMS_PER_PAGE_OPTIONS.map(option => (
              <option key={option} value={option}>
                {option} rendez-vous par page
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {paginatedAppointments.length > 0 ? (
          paginatedAppointments.map((appointment, index) => (
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

      {filteredAppointments.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filteredAppointments.length}
        />
      )}

      <div className="flex items-center justify-between text-sm text-slate-400 border-t border-white/5 pt-4">
        <div className="flex items-center space-x-4">
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
          Total : {filteredAppointments.length} rendez-vous
        </div>
      </div>
    </div>
  );
}