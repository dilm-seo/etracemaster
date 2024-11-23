import { useState, useCallback, useEffect } from 'react';
import { PopupType } from '../components/PopupManager';

interface Popup {
  id: string;
  type: PopupType;
  title: string;
  message: string;
  duration?: number;
}

export function usePopups() {
  const [popups, setPopups] = useState<Popup[]>([]);

  const addPopup = useCallback((popup: Omit<Popup, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newPopup = { ...popup, id };
    
    setPopups(current => [...current, newPopup]);

    if (popup.duration !== undefined) {
      setTimeout(() => {
        removePopup(id);
      }, popup.duration);
    }

    return id;
  }, []);

  const removePopup = useCallback((id: string) => {
    setPopups(current => current.filter(popup => popup.id !== id));
  }, []);

  const showSuccess = useCallback((title: string, message: string, duration = 5000) => {
    return addPopup({ type: 'success', title, message, duration });
  }, [addPopup]);

  const showError = useCallback((title: string, message: string, duration = 8000) => {
    return addPopup({ type: 'error', title, message, duration });
  }, [addPopup]);

  const showInfo = useCallback((title: string, message: string, duration = 5000) => {
    return addPopup({ type: 'info', title, message, duration });
  }, [addPopup]);

  const showWarning = useCallback((title: string, message: string, duration = 6000) => {
    return addPopup({ type: 'warning', title, message, duration });
  }, [addPopup]);

  return {
    popups,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    removePopup
  };
}