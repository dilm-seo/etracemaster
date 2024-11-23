import React, { useState, useMemo, useEffect } from 'react';
import { DatePicker } from './DatePicker';
import { Pagination } from './Pagination';
import { SheetAnalysis } from '../utils/excelAnalyzer';
import { getTodayString, findClosestDate, parseAppointmentDate, parseAppointmentTimes } from '../utils/dateUtils';
import { Calendar, Search, Filter, SortAsc, MapPin, ListFilter, Package, Printer, Download } from 'lucide-react';
import { StockPartCard } from './StockPartCard';

interface StockPartsViewProps {
  data: SheetAnalysis;
}

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 25, 50];

export function StockPartsView({ data }: StockPartsViewProps) {
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
  const [sortBy, setSortBy] = useState<'time' | 'location'>('time');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDate, selectedLocation, selectedStatus, searchQuery, sortBy, sortOrder, itemsPerPage]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      if (selectedDate !== 'all' && !apt['RDV']?.startsWith(selectedDate)) return false;
      if (selectedLocation !== 'all' && apt['LOCALISATION'] !== selectedLocation) return false;
      
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
      
      if (sortBy === 'time') {
        const dateA = parseAppointmentDate(a['RDV']?.split(' ')[0]);
        const dateB = parseAppointmentDate(b['RDV']?.split(' ')[0]);
        const [startTimeA] = parseAppointmentTimes(a['RDV']);
        const [startTimeB] = parseAppointmentTimes(b['RDV']);
        
        const [hoursA, minutesA] = startTimeA.split(':').map(Number);
        const [hoursB, minutesB] = startTimeB.split(':').map(Number);
        
        dateA.setHours(hoursA, minutesA);
        dateB.setHours(hoursB, minutesB);
        
        comparison = dateA.getTime() - dateB.getTime();
      } else {
        comparison = (a['LOCALISATION'] || '').localeCompare(b['LOCALISATION'] || '');
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [appointments, selectedDate, selectedLocation, selectedStatus, searchQuery, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAppointments = filteredAppointments.slice(startIndex, startIndex + itemsPerPage);

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    const csvContent = [
      ['Date', 'Heure', 'RITM', 'Article', 'Localisation', 'Détails'].join(','),
      ...filteredAppointments.map(apt => {
        const [startTime] = parseAppointmentTimes(apt['RDV']);
        return [
          apt['RDV']?.split(' ')[0],
          startTime,
          apt['RITM'] || apt['ENTETE'],
          apt['ARTICLE'],
          apt['LOCALISATION'],
          apt['JUSTIFICATION']
        ].map(cell => `"${cell || ''}"`).join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `interventions-${selectedDate === 'all' ? 'complet' : selectedDate}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Package className="h-6 w-6 text-violet-400" />
          Interventions du jour
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            <Printer className="h-4 w-4" />
            <span>Imprimer</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Exporter CSV</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <SortAsc className="h-5 w-5 text-violet-400" />
          </div>
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [newSortBy, newSortOrder] = e.target.value.split('-') as ['time' | 'location', 'asc' | 'desc'];
              setSortBy(newSortBy);
              setSortOrder(newSortOrder);
            }}
            className="block w-full pl-10 pr-10 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500 appearance-none cursor-pointer"
          >
            <option value="time-asc">Heure (croissant)</option>
            <option value="time-desc">Heure (décroissant)</option>
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
                {option} éléments par page
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 print:grid-cols-1">
        {paginatedAppointments.length > 0 ? (
          paginatedAppointments.map((appointment, index) => (
            <StockPartCard
              key={`${appointment['ENTETE']}-${index}`}
              appointment={appointment}
              animate={true}
              delay={index * 100}
            />
          ))
        ) : (
          <div className="col-span-full">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-8 text-center border border-white/5">
              <Package className="h-12 w-12 text-violet-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                Aucune intervention trouvée
              </h3>
              <p className="text-slate-400">
                Modifiez vos filtres pour voir plus de résultats
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

      <div className="flex items-center justify-between text-sm text-slate-400 border-t border-white/5 pt-4 print:hidden">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>{uniqueDates.size - 1} dates</span>
          </div>
          <div className="flex items-center space-x-2">
            <Package className="h-4 w-4" />
            <span>
              {filteredAppointments.length} interventions
            </span>
          </div>
        </div>
        <div>
          Total : {filteredAppointments.length} éléments
        </div>
      </div>
    </div>
  );
}