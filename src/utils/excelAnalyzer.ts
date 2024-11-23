import { utils, read } from 'xlsx';

export interface ValueDistribution {
  value: string | number;
  count: number;
  percentage: number;
}

export interface ColumnAnalysis {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  uniqueValues: number;
  nullCount: number;
  totalCount: number;
  examples: any[];
  min?: number;
  max?: number;
  average?: number;
  validValues?: number;
  valueDistribution?: ValueDistribution[];
}

export interface SheetAnalysis {
  name: string;
  rowCount: number;
  columnCount: number;
  columns: ColumnAnalysis[];
  data: any[][];
}

export function analyzeExcelFile(buffer: ArrayBuffer): SheetAnalysis[] {
  const workbook = read(buffer, { type: 'array' });
  
  return workbook.SheetNames.map(sheetName => {
    const worksheet = workbook.Sheets[sheetName];
    const data = utils.sheet_to_json(worksheet, { header: 1 });
    const headers = data[0] as string[];
    const rows = data.slice(1);

    const columns = headers.map((header, index) => {
      const values = rows.map(row => row[index]);
      const nonNullValues = values.filter(v => v != null && v !== '');
      
      const type = inferColumnType(nonNullValues);
      const uniqueValues = new Set(nonNullValues).size;
      const totalCount = values.length;
      
      const analysis: ColumnAnalysis = {
        name: header,
        type,
        uniqueValues,
        nullCount: values.length - nonNullValues.length,
        totalCount,
        examples: nonNullValues.slice(0, 3),
        valueDistribution: calculateDistribution(nonNullValues)
      };

      if (type === 'number') {
        const numbers = nonNullValues.map(Number).filter(n => !isNaN(n));
        analysis.validValues = numbers.length;
        if (numbers.length > 0) {
          analysis.min = Math.min(...numbers);
          analysis.max = Math.max(...numbers);
          analysis.average = numbers.reduce((a, b) => a + b, 0) / numbers.length;
        }
      }

      return analysis;
    });

    return {
      name: sheetName,
      rowCount: rows.length,
      columnCount: headers.length,
      columns,
      data,
    };
  });
}

function calculateDistribution(values: any[]): ValueDistribution[] {
  const counts = values.reduce((acc, value) => {
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .map(([value, count]) => ({
      value,
      count: count as number,
      percentage: (count as number) / values.length
    }))
    .sort((a, b) => b.count - a.count);
}

function inferColumnType(values: any[]): ColumnAnalysis['type'] {
  const sample = values.find(v => v != null);
  if (sample == null) return 'string';
  
  if (typeof sample === 'number' || !isNaN(Number(sample))) return 'number';
  if (typeof sample === 'boolean') return 'boolean';
  if (!isNaN(Date.parse(sample))) return 'date';
  return 'string';
}