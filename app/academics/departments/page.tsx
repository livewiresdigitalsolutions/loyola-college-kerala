import React from "react";
import DepartmentsHero from "./components/departmentsHero";
import ExcellenceSection from "./components/ExcellenceSection";
import DepartmentsList from "./components/departmentsList";



export default function DepartmentsPage() {
  return (
    <>
      <DepartmentsHero />
      <ExcellenceSection />
      <DepartmentsList />
      
    </>
  );
}

export const metadata = {
  title: "Departments | Loyola College",
  description: "Explore our diverse range of academic departments offering world-class education and research opportunities.",
};
