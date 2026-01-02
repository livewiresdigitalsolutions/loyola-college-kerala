// app/hooks/useAcademicYear.ts
import { useState, useEffect } from 'react';

export interface AcademicYear {
  start: number;
  end: number;
  label: string;
  isOpen: boolean;
}

export function useAcademicYear() {
  const [academicYear, setAcademicYear] = useState<AcademicYear | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAcademicYear();
  }, []);

  const fetchAcademicYear = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/config');
      if (response.ok) {
        const configs = await response.json();
        
        const startConfig = configs.find((c: any) => c.key === 'academic_year_start');
        const endConfig = configs.find((c: any) => c.key === 'academic_year_end');
        const labelConfig = configs.find((c: any) => c.key === 'academic_year_label');
        const openConfig = configs.find((c: any) => c.key === 'admissions_open');

        if (startConfig && endConfig) {
          setAcademicYear({
            start: parseInt(startConfig.value),
            end: parseInt(endConfig.value),
            label: labelConfig?.value || `${startConfig.value}-${endConfig.value}`,
            isOpen: openConfig?.value === 'true',
          });
        }
      }
    } catch (error) {
      console.error('Error fetching academic year:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    academicYear,
    loading,
    refetch: fetchAcademicYear,
  };
}
