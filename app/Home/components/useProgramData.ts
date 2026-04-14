import { useState, useEffect } from "react";

export type ProgramLevel = { id: number; discipline: string };
export type Degree = { id: number; program_level_id: number; degree_name: string };
export type Course = { id: number; degree_id: number; course_name: string };

export function useProgramData() {
  const [data, setData] = useState<{
    ug: string[];
    pg: string[];
    phd: string[];
    loading: boolean;
  }>({
    ug: [],
    pg: [],
    phd: [],
    loading: true,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [levelsRes, degreesRes, coursesRes] = await Promise.all([
          fetch("/api/programs"),
          fetch("/api/degrees"),
          fetch("/api/courses"),
        ]);

        const levelsData = await levelsRes.json();
        const degreesData = await degreesRes.json();
        const coursesData = await coursesRes.json();

        const levels: ProgramLevel[] = Array.isArray(levelsData) ? levelsData : [];
        const degrees: Degree[] = Array.isArray(degreesData) ? degreesData : [];
        const courses: Course[] = Array.isArray(coursesData) ? coursesData : [];

        // Arrays to hold the formatted names
        const ug: string[] = [];
        const pg: string[] = [];
        const phd: string[] = [];

        // Map degrees to levels
        const degreeToLevel = new Map<number, string>();
        degrees.forEach((d) => {
          const levelName = levels.find((l) => l.id === d.program_level_id)?.discipline || "";
          degreeToLevel.set(d.id, levelName);
        });

        // Map courses to their respective arrays based on degree's level
        courses.forEach((c) => {
          const degree = degrees.find((d) => d.id === c.degree_id);
          if (!degree) return;

          const levelName = degreeToLevel.get(degree.id);
          const formattedName = `${degree.degree_name} ${c.course_name}`.trim().replace(/ +/g, ' ');

          if (levelName === "FYUG") {
            ug.push(formattedName);
          } else if (levelName === "PG") {
            pg.push(formattedName);
          } else if (levelName === "PhD") {
            phd.push(formattedName);
          }
        });

        setData({ ug, pg, phd, loading: false });
      } catch (error) {
        console.error("Failed to fetch program data", error);
        setData({ ug: [], pg: [], phd: [], loading: false });
      }
    }

    fetchData();
  }, []);

  return data;
}
