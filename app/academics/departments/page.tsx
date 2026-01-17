import React from "react";
import DepartmentsHero from "./components/departmentsHero";
import DepartmentsList from "./components/departmentsList";

export default function DepartmentsPage() {
  return (
    <>
      <DepartmentsHero />
      <DepartmentsList />
    </>
  );
}

export const metadata = {
  title: "Departments | Loyola College",
  description: "Explore our diverse range of academic departments offering world-class education and research opportunities.",
};
