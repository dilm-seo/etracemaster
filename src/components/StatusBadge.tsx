import React from 'react';
import { CheckCircle, Clock, AlertCircle, XCircle, Calendar } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    const statusLower = status.toLowerCase();
    
    if (statusLower.includes('finalis') || statusLower.includes('done')) {
      return {
        icon: CheckCircle,
        bg: 'bg-emerald-500/30',
        text: 'text-emerald-300',
        border: 'border-emerald-400/30',
        label: 'Finalisé'
      };
    }
    
    if (statusLower.includes('erreur') || statusLower.includes('error')) {
      return {
        icon: XCircle,
        bg: 'bg-rose-500/30',
        text: 'text-rose-300',
        border: 'border-rose-400/30',
        label: 'Erreur'
      };
    }
    
    if (statusLower.includes('plannifi') || statusLower.includes('planned')) {
      return {
        icon: Calendar,
        bg: 'bg-violet-500/30',
        text: 'text-violet-300',
        border: 'border-violet-400/30',
        label: 'Planifié'
      };
    }
    
    if (statusLower.includes('cours') || statusLower.includes('progress')) {
      return {
        icon: Clock,
        bg: 'bg-amber-500/30',
        text: 'text-amber-300',
        border: 'border-amber-400/30',
        label: 'En cours'
      };
    }
    
    // Default: En attente
    return {
      icon: AlertCircle,
      bg: 'bg-blue-500/30',
      text: 'text-blue-300',
      border: 'border-blue-400/30',
      label: 'En attente'
    };
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div 
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-full 
        ${config.bg} ${config.border} border 
        shadow-sm backdrop-blur-sm
        transition-all duration-200 hover:scale-105
      `}
    >
      <Icon className={`h-4 w-4 ${config.text}`} />
      <span className={`text-sm font-medium ${config.text} whitespace-nowrap`}>
        {config.label}
      </span>
    </div>
  );
}