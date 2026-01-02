

export interface AcademicYearConfig {
  start: number;
  end: number;
  label: string;
  isOpen: boolean;
}

/**
 * Central configuration for the current academic year
 * Update this configuration when opening/closing admissions
 */
export function getAcademicYearConfig(): AcademicYearConfig {
  return {
    start: 2025,
    end: 2026,
    label: '2025-26',
    isOpen: true, // Set to false when admissions close
  };
}

/**
 * Get academic year display text
 */
export function getAcademicYearDisplay(): string {
  const config = getAcademicYearConfig();
  return `${config.start}-${config.end}`;
}

/**
 * Check if admissions are currently open
 */
export function areAdmissionsOpen(): boolean {
  return getAcademicYearConfig().isOpen;
}

/**
 * Get full academic year label with formatting
 */
export function getFullAcademicYearLabel(): string {
  const config = getAcademicYearConfig();
  return `Academic Year ${config.label}`;
}
