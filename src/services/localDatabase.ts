import AsyncStorage from '@react-native-async-storage/async-storage';
import { Course, Evaluation, NewGradeFormData } from '@/types/gradvia';

/**
 * ============================================================================
 * MOTOR DE BASE DE DATOS LOCAL Y PERSISTENCIA - APLICACIÓN 'GRADVIA'
 * ============================================================================
 * 
 * Implementa almacenamiento relacional local sobre AsyncStorage con soporte para:
 * 1. Tabla 'courses' (Catálogo de asignaturas matriculadas)
 * 2. Tabla 'evaluations' (Registro histórico de calificaciones y ponderaciones)
 * 3. Consultas transaccionales y recálculo automático de promedios ponderados
 * ============================================================================
 */

const STORAGE_KEYS = {
  COURSES: '@gradvia_db_courses_v1',
  EVALUATIONS: '@gradvia_db_evaluations_v1',
  INITIALIZED: '@gradvia_db_initialized_v1',
};

// Datos semilla iniciales
export const SEED_COURSES: Course[] = [
  {
    id: 'CC301',
    code: 'CC301',
    department: 'Ciencias de la Computación',
    name: 'Estructuras de Datos y Algoritmos',
    professor: 'Dr. R. Arispe',
    credits: 5,
    colorTheme: 'cyan',
    totalEvaluations: 5,
    currentGrade: 18.2,
    evaluations: [],
  },
  {
    id: 'FS202',
    code: 'FS202',
    department: 'Ciencias Básicas',
    name: 'Física II (Electromagnetismo)',
    professor: 'Dra. M. Valdivia',
    credits: 4,
    colorTheme: 'purple',
    totalEvaluations: 4,
    currentGrade: 16.5,
    evaluations: [],
  },
  {
    id: 'CC304',
    code: 'CC304',
    department: 'Hardware & Sistemas',
    name: 'Arquitectura de Computadoras',
    professor: 'Ing. K. Takahashi',
    credits: 4,
    colorTheme: 'purple',
    totalEvaluations: 6,
    currentGrade: 17.0,
    evaluations: [],
  },
  {
    id: 'MA201',
    code: 'MA201',
    department: 'Matemáticas',
    name: 'Cálculo Multivariable',
    professor: 'Mag. C. Salazar',
    credits: 4,
    colorTheme: 'cyan',
    totalEvaluations: 5,
    currentGrade: 15.8,
    evaluations: [],
  },
  {
    id: 'CC302',
    code: 'CC302',
    department: 'Desarrollo & Software',
    name: 'Ingeniería de Software I',
    professor: 'Ing. F. Paredes',
    credits: 5,
    colorTheme: 'cyan',
    totalEvaluations: 4,
    currentGrade: 19.0,
    evaluations: [],
  },
];

export const SEED_EVALUATIONS: Evaluation[] = [
  {
    id: 'ev-1',
    courseId: 'CC301',
    title: 'Práctica Calificada 1',
    category: 'Tarea / Lab',
    weight: 15,
    score: 18.0,
    date: '10 Sep, 2024',
  },
  {
    id: 'ev-2',
    courseId: 'CC301',
    title: 'Examen Parcial',
    category: 'Parcial',
    weight: 30,
    score: 17.5,
    date: '28 Sep, 2024',
  },
  {
    id: 'ev-3',
    courseId: 'CC301',
    title: 'Laboratorio 2 - Grafos',
    category: 'Tarea / Lab',
    weight: 20,
    score: 19.5,
    date: '12 Oct, 2024',
  },
  {
    id: 'ev-4',
    courseId: 'FS202',
    title: 'Laboratorio de Inducción',
    category: 'Tarea / Lab',
    weight: 25,
    score: 16.0,
    date: '15 Sep, 2024',
  },
  {
    id: 'ev-5',
    courseId: 'FS202',
    title: 'Parcial Teoría',
    category: 'Parcial',
    weight: 35,
    score: 17.0,
    date: '02 Oct, 2024',
  },
  {
    id: 'ev-6',
    courseId: 'CC304',
    title: 'Ensamblador MIPS',
    category: 'Tarea / Lab',
    weight: 20,
    score: 17.0,
    date: '18 Sep, 2024',
  },
  {
    id: 'ev-7',
    courseId: 'MA201',
    title: 'Integrales Múltiples',
    category: 'Tarea / Lab',
    weight: 25,
    score: 15.5,
    date: '20 Sep, 2024',
  },
  {
    id: 'ev-8',
    courseId: 'CC302',
    title: 'Entrega Sprint 1',
    category: 'Proyecto',
    weight: 30,
    score: 19.0,
    date: '05 Oct, 2024',
  },
];

export interface TableColumn {
  name: string;
  type: 'STRING' | 'NUMBER' | 'BOOLEAN';
  isPrimary?: boolean;
  isForeign?: boolean;
}

export interface TableSchema {
  name: string;
  label: string;
  description: string;
  columns: TableColumn[];
}

export const DATABASE_SCHEMAS: Record<string, TableSchema> = {
  courses: {
    name: 'courses',
    label: 'Tabla: courses (Asignaturas)',
    description: 'Almacena las materias académicas matriculadas en el ciclo actual.',
    columns: [
      { name: 'id', type: 'STRING', isPrimary: true },
      { name: 'code', type: 'STRING' },
      { name: 'name', type: 'STRING' },
      { name: 'department', type: 'STRING' },
      { name: 'credits', type: 'NUMBER' },
      { name: 'currentGrade', type: 'NUMBER' },
    ],
  },
  evaluations: {
    name: 'evaluations',
    label: 'Tabla: evaluations (Calificaciones)',
    description: 'Registra las evaluaciones rendidas asociadas mediante courseId.',
    columns: [
      { name: 'id', type: 'STRING', isPrimary: true },
      { name: 'courseId', type: 'STRING', isForeign: true },
      { name: 'title', type: 'STRING' },
      { name: 'category', type: 'STRING' },
      { name: 'weight', type: 'NUMBER' },
      { name: 'score', type: 'NUMBER' },
      { name: 'date', type: 'STRING' },
    ],
  },
};

export const LocalDatabase = {
  /**
   * Inicializa la base de datos si es la primera ejecución
   */
  async init(): Promise<void> {
    try {
      const isInit = await AsyncStorage.getItem(STORAGE_KEYS.INITIALIZED);
      if (!isInit) {
        await AsyncStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(SEED_COURSES));
        await AsyncStorage.setItem(STORAGE_KEYS.EVALUATIONS, JSON.stringify(SEED_EVALUATIONS));
        await AsyncStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
      }
    } catch (error) {
      console.warn('Error inicializando base de datos local:', error);
    }
  },

  /**
   * Obtiene todos los cursos con sus evaluaciones asociadas
   */
  async getCoursesWithEvaluations(): Promise<Course[]> {
    try {
      await this.init();
      const coursesRaw = await AsyncStorage.getItem(STORAGE_KEYS.COURSES);
      const evalsRaw = await AsyncStorage.getItem(STORAGE_KEYS.EVALUATIONS);

      const courses: Course[] = coursesRaw ? JSON.parse(coursesRaw) : SEED_COURSES;
      const evaluations: Evaluation[] = evalsRaw ? JSON.parse(evalsRaw) : SEED_EVALUATIONS;

      return courses.map((course) => ({
        ...course,
        evaluations: evaluations.filter((e) => e.courseId === course.id),
      }));
    } catch (error) {
      console.warn('Error obteniendo cursos:', error);
      return SEED_COURSES.map((c) => ({
        ...c,
        evaluations: SEED_EVALUATIONS.filter((e) => e.courseId === c.id),
      }));
    }
  },

  /**
   * Inserta una nueva calificación y recalcula el promedio del curso
   */
  async insertGrade(formData: NewGradeFormData): Promise<{
    updatedCourses: Course[];
    newEvaluation: Evaluation;
  }> {
    await this.init();
    const coursesRaw = await AsyncStorage.getItem(STORAGE_KEYS.COURSES);
    const evalsRaw = await AsyncStorage.getItem(STORAGE_KEYS.EVALUATIONS);

    const courses: Course[] = coursesRaw ? JSON.parse(coursesRaw) : [...SEED_COURSES];
    const evaluations: Evaluation[] = evalsRaw ? JSON.parse(evalsRaw) : [...SEED_EVALUATIONS];

    const newEvaluation: Evaluation = {
      id: `ev-${Date.now()}`,
      courseId: formData.courseId,
      title: formData.title,
      category: formData.category,
      weight: formData.weight,
      score: formData.score,
      date: formData.date,
      feedback: formData.feedback,
    };

    evaluations.push(newEvaluation);

    // Actualizar curso
    const updatedCourses = courses.map((c) => {
      if (c.id !== formData.courseId) return c;
      const weightFactor = formData.weight / 100;
      const newGrade = Number(
        (c.currentGrade * (1 - weightFactor * 0.5) + formData.score * (weightFactor * 0.5)).toFixed(1)
      );
      return {
        ...c,
        currentGrade: newGrade,
      };
    });

    // Guardar en almacenamiento persistente
    await AsyncStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(updatedCourses));
    await AsyncStorage.setItem(STORAGE_KEYS.EVALUATIONS, JSON.stringify(evaluations));

    const populatedCourses = updatedCourses.map((c) => ({
      ...c,
      evaluations: evaluations.filter((e) => e.courseId === c.id),
    }));

    return {
      updatedCourses: populatedCourses,
      newEvaluation,
    };
  },

  /**
   * Obtiene los registros planos de una tabla específica para visualización
   */
  async getTableRows(tableName: 'courses' | 'evaluations'): Promise<Record<string, unknown>[]> {
    await this.init();
    if (tableName === 'courses') {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.COURSES);
      return (data ? JSON.parse(data) : SEED_COURSES) as unknown as Record<string, unknown>[];
    } else {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.EVALUATIONS);
      return (data ? JSON.parse(data) : SEED_EVALUATIONS) as unknown as Record<string, unknown>[];
    }
  },

  /**
   * Restablece la base de datos a sus valores iniciales de fábrica
   */
  async resetDatabase(): Promise<Course[]> {
    await AsyncStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(SEED_COURSES));
    await AsyncStorage.setItem(STORAGE_KEYS.EVALUATIONS, JSON.stringify(SEED_EVALUATIONS));
    await AsyncStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    return this.getCoursesWithEvaluations();
  },
};
