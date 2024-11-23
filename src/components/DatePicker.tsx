import React, { forwardRef } from 'react';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import fr from 'date-fns/locale/fr';
import { Calendar } from 'lucide-react';
import "react-datepicker/dist/react-datepicker.css";

registerLocale('fr', fr);

interface DatePickerProps {
  selectedDate: string | null;
  onChange: (date: Date | null) => void;
  availableDates: Set<string>;
}

export function DatePicker({ selectedDate, onChange, availableDates }: DatePickerProps) {
  const parseDate = (dateStr: string | null): Date | null => {
    if (!dateStr || dateStr === 'all') return null;
    const [day, month, year] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const highlightDates = Array.from(availableDates)
    .filter(date => date !== 'all')
    .map(parseDate)
    .filter((date): date is Date => date !== null);

  const CustomInput = forwardRef<HTMLDivElement, { value?: string; onClick?: () => void }>(
    ({ value, onClick }, ref) => (
      <div
        ref={ref}
        onClick={onClick}
        className="flex items-center space-x-2 bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 cursor-pointer hover:bg-slate-800/50 transition-colors duration-200"
      >
        <Calendar className="h-5 w-5 text-violet-400" />
        <span className="text-white">
          {selectedDate === 'all' ? 'Toutes les dates' : value}
        </span>
      </div>
    )
  );

  return (
    <div className="relative">
      <ReactDatePicker
        selected={parseDate(selectedDate)}
        onChange={(date: Date | null) => {
          if (date) {
            const formattedDate = formatDate(date);
            if (availableDates.has(formattedDate)) {
              onChange(date);
            }
          } else {
            onChange(null);
          }
        }}
        locale="fr"
        dateFormat="dd/MM/yyyy"
        highlightDates={highlightDates}
        customInput={<CustomInput />}
        isClearable
        placeholderText="Sélectionner une date"
        className="w-full"
        calendarClassName="bg-slate-800 border border-white/10 rounded-lg shadow-xl text-white"
        dayClassName={date => {
          const dateStr = formatDate(date);
          return availableDates.has(dateStr)
            ? "text-white hover:bg-violet-500 rounded"
            : "text-slate-500 cursor-not-allowed";
        }}
        popperClassName="react-datepicker-popper"
        popperModifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 8],
            },
          },
        ]}
      />
    </div>
  );
}