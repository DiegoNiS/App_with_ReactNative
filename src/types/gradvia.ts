/**
 * ============================================================================
 * UNIVERSIDAD - INFORME DE LABORATORIO DE REACT NATIVE
 * DEFINICIÓN DE MODELOS DE DATOS Y TIPOS (TypeScript) - APLICACIÓN 'GRADVIA'
 * ============================================================================
 * 
 * Este archivo centraliza los tipos e interfaces del dominio académico:
 * - Cursos matriculados
 * - Evaluaciones y ponderaciones
 * - Métricas semestrales (GPA, créditos, avance curricular)
 */

export type EvaluationCategory = 'Parcial' | 'Tarea / Lab' | 'Proyecto' | 'Quiz';

export type CourseDepartment =
  | 'Ciencias de la Computación'
  | 'Ciencias Básicas'
  | 'Hardware & Sistemas'
  | 'Matemáticas'
  | 'Desarrollo & Software';

export interface Evaluation {
  id: string;
  courseId: string;
  title: string;
  category: EvaluationCategory;
  weight: number; // Porcentaje de peso (ej. 15%)
  score: number;  // Calificación en escala vigesimal (0 - 20)
  date: string;
  feedback?: string;
}

export interface Course {
  id: string;
  code: string;
  department: CourseDepartment;
  name: string;
  professor: string;
  credits: number;
  colorTheme: 'cyan' | 'purple' | 'teal';
  totalEvaluations: number;
  evaluations: Evaluation[];
  // Propiedades calculadas reactivamente por el estado
  currentGrade: number;
}

export interface NewGradeFormData {
  courseId: string;
  title: string;
  category: EvaluationCategory;
  weight: number;
  score: number;
  date: string;
  feedback: string;
}
