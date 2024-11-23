import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';

export type PopupType = 'success' | 'error' | 'info' | 'warning';

interface Popup {
  id: string;
  type: PopupType;
  title: string;
  message: string;
  duration?: number;
}

interface PopupManagerProps {
  popups: Popup[];
  onClose: (id: string) => void;
}

const POPUP_STYLES = {
  success: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    text: 'text-emerald-400',
    icon: CheckCircle,
  },
  error: {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    text: 'text-rose-400',
    icon: XCircle,
  },
  info: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    text: 'text-blue-400',
    icon: Info,
  },
  warning: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    text: 'text-amber-400',
    icon: AlertCircle,
  },
};

export function PopupManager({ popups, onClose }: PopupManagerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {popups.map((popup, index) => {
        const style = POPUP_STYLES[popup.type];
        const Icon = style.icon;

        return (
          <div
            key={popup.id}
            className={`${style.bg} backdrop-blur-xl rounded-lg shadow-lg border ${style.border} 
              w-80 transform transition-all duration-300 animate-fade-in-up`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="p-4">
              <div className="flex items-start space-x-3">
                <Icon className={`h-5 w-5 ${style.text} flex-shrink-0 mt-0.5`} />
                <div className="flex-1 min-w-0">
                  <h3 className={`text-sm font-medium ${style.text}`}>
                    {popup.title}
                  </h3>
                  <p className="mt-1 text-sm text-white/80">
                    {popup.message}
                  </p>
                </div>
                <button
                  onClick={() => onClose(popup.id)}
                  className="flex-shrink-0 ml-4 text-white/60 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}