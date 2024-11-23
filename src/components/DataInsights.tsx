import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ColumnAnalysis } from '../utils/excelAnalyzer';
import { BarChart2Icon, HashIcon, PercentIcon, AlertTriangle } from 'lucide-react';

interface DataInsightsProps {
  column: ColumnAnalysis;
}

const COLORS = ['#4f46e5', '#0891b2', '#0d9488', '#7c3aed', '#6b7280'];

export function DataInsights({ column }: DataInsightsProps) {
  const nullPercentage = (column.nullCount / column.uniqueValues) * 100;
  
  const renderVisualization = () => {
    if (column.type === 'number') {
      return (
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { name: 'Min', value: column.min },
              { name: 'Average', value: column.average },
              { name: 'Max', value: column.max }
            ]}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    }

    if (column.valueDistribution && column.valueDistribution.length > 0) {
      return (
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={column.valueDistribution.slice(0, 5)}
                dataKey="count"
                nameKey="value"
                cx="50%"
                cy="50%"
                outerRadius={60}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {column.valueDistribution.slice(0, 5).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      );
    }

    return null;
  };

  const renderQualityIndicator = () => {
    const quality = getDataQuality(column);
    return (
      <div className={`flex items-center space-x-2 ${quality.color}`}>
        {quality.score < 0.7 && <AlertTriangle className="h-4 w-4" />}
        <span className="text-sm font-medium">
          Data Quality: {(quality.score * 100).toFixed(0)}%
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{column.name}</h3>
        <span className="px-2 py-1 text-xs font-medium rounded-full" 
          style={{ 
            backgroundColor: getTypeColor(column.type),
            color: 'white'
          }}>
          {column.type}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Stat
          icon={<HashIcon className="h-4 w-4" />}
          label="Unique Values"
          value={`${column.uniqueValues} / ${column.totalCount || 0}`}
          subtext={`${((column.uniqueValues / (column.totalCount || 1)) * 100).toFixed(1)}% unique`}
        />
        <Stat
          icon={<PercentIcon className="h-4 w-4" />}
          label="Completeness"
          value={`${(100 - nullPercentage).toFixed(1)}%`}
          subtext={`${column.nullCount} empty values`}
        />
      </div>

      {renderQualityIndicator()}

      {column.examples.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-gray-500 mb-1">Sample Values:</p>
          <div className="space-y-1">
            {column.examples.slice(0, 3).map((example, i) => (
              <div key={i} className="text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded">
                {String(example)}
              </div>
            ))}
          </div>
        </div>
      )}

      {renderVisualization()}
    </div>
  );
}

function Stat({ 
  icon, 
  label, 
  value, 
  subtext 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string | number;
  subtext?: string;
}) {
  return (
    <div className="flex items-start space-x-2">
      <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
        {subtext && <p className="text-xs text-gray-500">{subtext}</p>}
      </div>
    </div>
  );
}

function getTypeColor(type: string): string {
  switch (type) {
    case 'string': return '#4f46e5';
    case 'number': return '#0891b2';
    case 'date': return '#0d9488';
    case 'boolean': return '#7c3aed';
    default: return '#6b7280';
  }
}

function getDataQuality(column: ColumnAnalysis): { score: number; color: string } {
  const completenessScore = 1 - (column.nullCount / (column.totalCount || 1));
  const uniquenessScore = column.uniqueValues / (column.totalCount || 1);
  
  // For numeric columns, check if values are within expected ranges
  let validityScore = 1;
  if (column.type === 'number' && column.min !== undefined && column.max !== undefined) {
    validityScore = column.validValues / (column.totalCount || 1);
  }

  const score = (completenessScore + uniquenessScore + validityScore) / 3;

  let color;
  if (score >= 0.8) color = 'text-green-600';
  else if (score >= 0.6) color = 'text-yellow-600';
  else color = 'text-red-600';

  return { score, color };
}