import { useState, useEffect } from 'react';
import { getVillages } from '../services/dashboardService';

// Fallback: static villages used when API is unavailable
const FALLBACK_VILLAGES = [
  { id: 'VLG-4829', name: 'Gundya Village', population: '850', sanitationStatus: 'Moderate', waterStatus: 'Scarcity', riskStatus: 'Medium' },
  { id: 'VLG-7281', name: 'Belur Sector', population: '1200', sanitationStatus: 'Good', waterStatus: 'Adequate', riskStatus: 'Low' },
  { id: 'VLG-1029', name: 'Mudigere Road', population: '600', sanitationStatus: 'Poor', waterStatus: 'Contaminated', riskStatus: 'High' },
  { id: 'VLG-5521', name: 'Kavalande Hadi', population: '420', sanitationStatus: 'Good', waterStatus: 'Adequate', riskStatus: 'Low' },
  { id: 'VLG-3318', name: 'Bettadapura', population: '780', sanitationStatus: 'Moderate', waterStatus: 'Scarcity', riskStatus: 'Medium' },
];

/**
 * useGeography — Fetches village geography from API with static fallback.
 *
 * Returns: { villages, isLoading }
 */
export function useGeography() {
  const [villages, setVillages] = useState(FALLBACK_VILLAGES);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('jeevan_roshini_token');
    if (!token) return; // Don't attempt if not authenticated

    setIsLoading(true);
    getVillages()
      .then(res => {
        const data = res.data.data || res.data;
        if (Array.isArray(data) && data.length > 0) {
          setVillages(data);
        }
      })
      .catch(() => {
        // Silent fallback to static data — no network = use local list
      })
      .finally(() => setIsLoading(false));
  }, []);

  return { villages, isLoading };
}
