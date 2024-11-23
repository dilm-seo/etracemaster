export function parseAppointmentDate(rdv: string): Date {
  if (!rdv) return new Date();
  const [datePart] = rdv.split(' ');
  if (!datePart) return new Date();
  
  const [day, month, year] = datePart.split('-').map(Number);
  if (!day || !month || !year) return new Date();
  
  return new Date(year, month - 1, day);
}

export function parseAppointmentTimes(rdv: string): [string, string] {
  if (!rdv) return ['00:00', '00:00'];
  
  try {
    const [startPart, endPart] = rdv.split(' au ');
    const startTime = startPart?.split(' ')?.[1]?.slice(0, 5) || '00:00';
    const endTime = endPart?.split(' ')?.[1]?.slice(0, 5) || '00:00';
    return [startTime, endTime];
  } catch (error) {
    return ['00:00', '00:00'];
  }
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  
  try {
    const [day, month, year] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day)
      .toLocaleDateString('fr-FR', { 
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      });
  } catch (error) {
    return dateStr;
  }
}

export function getTodayString(): string {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  return `${day}-${month}-${year}`;
}

export function extractPhoneNumber(text: string): string | null {
  if (!text) return null;
  const phoneRegex = /(?:Tel\s*:|Tél\s*:)?\s*((?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4})/;
  const match = text.match(phoneRegex);
  return match ? match[1] : null;
}

export function findClosestDate(dates: string[], targetDate: string): string {
  if (!dates.length) return 'all';
  if (dates.includes(targetDate)) return targetDate;

  const target = parseAppointmentDate(targetDate);
  let closestDate = dates[0];
  let minDiff = Infinity;

  for (const date of dates) {
    if (date === 'all') continue;
    const current = parseAppointmentDate(date);
    const diff = Math.abs(current.getTime() - target.getTime());
    if (diff < minDiff) {
      minDiff = diff;
      closestDate = date;
    }
  }

  return closestDate;
}