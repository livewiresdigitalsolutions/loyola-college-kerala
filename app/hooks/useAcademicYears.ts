// app/hooks/useAcademicYears.ts
import { useState, useEffect } from 'react';

interface AcademicYearData {
  start: string;
  isOpen: boolean;
}

export function useAcademicYear() {
  const [academicYear, setAcademicYear] = useState<AcademicYearData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAcademicYear = async () => {
      try {
        setLoading(true);
        
        // Fetch all configuration values
        const response = await fetch('/api/config');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error('Failed to fetch configuration');
        }

        // Find the specific config values
        const yearConfig = data.find((item: any) => item.key === 'current_academic_year');
        const admissionsConfig = data.find((item: any) => item.key === 'is_admissions_open');
        
        if (yearConfig && admissionsConfig) {
          setAcademicYear({
            start: yearConfig.value,
            isOpen: admissionsConfig.value === 'true' || admissionsConfig.value === true,
          });
        } else {
          setError('Configuration values not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchAcademicYear();
  }, []);

  return { academicYear, loading, error };
}
