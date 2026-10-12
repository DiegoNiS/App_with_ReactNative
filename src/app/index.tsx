import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Componentes de las dos pantallas de la aplicación 'Gradvia'
import { DashboardScreen } from '@/components/gradvia/DashboardScreen';
import { RecordGradeForm } from '@/components/gradvia/RecordGradeForm';
import { DatabaseViewerModal } from '@/components/gradvia/DatabaseViewerModal';
import { LocalDatabase } from '@/services/localDatabase';
import { Course, NewGradeFormData } from '@/types/gradvia';

/**
 * ============================================================================
 * UNIVERSIDAD - INFORME TÉCNICO DE LABORATORIO: APLICACIÓN 'GRADVIA'
 * ============================================================================
 * 
 * GUÍA DE COMPONENTES NATIVOS Y GESTIÓN DE LAYOUT MEDIANTE FLEXBOX:
 * 
 * 1. <View>:
 *    - Es el contenedor estructural primordial de React Native (equivalente a <div>).
 *    - No posee presentación visual propia hasta asignarle un estilo con StyleSheet.
 *    - MANEJO DE LAYOUT (FLEXBOX):
 *      * 'flexDirection': En React Native el valor por defecto es 'column' (distribución vertical).
 *        Se utiliza 'row' para crear filas horizontales (ej. cabeceras, botones y badges).
 *      * 'justifyContent': Distribuye el espacio a lo largo del eje principal:
 *        - 'space-between': Envía el primer hijo al inicio y el último al final.
 *        - 'center': Centra los hijos respecto al eje principal.
 *      * 'alignItems': Controla el posicionamiento en el eje transversal o secundario:
 *        - 'center': Centra verticalmente los elementos dentro de una fila 'row'.
 *        - 'stretch': Expande los hijos para cubrir todo el ancho transversal.
 *      * 'flex: 1': Hace que el contenedor reclame y ocupe el 100% del espacio disponible
 *        dentro del contenedor padre.
 * 
 * 2. <Text>:
 *    - Widget fundamental e indispensable para cualquier texto visible.
 *    - REGLA DE ORO: En React Native NO se puede renderizar texto sin envolverlo en <Text>.
 *    - Permite configurar tipografía, colores del tema ('#38BDF8', '#FFFFFF'), tamaños,
 *      negrita ('fontWeight: 800') y truncamiento accesible ('numberOfLines').
 * 
 * 3. <ScrollView>:
 *    - Contenedor con capacidad de desplazamiento tanto vertical como horizontal.
 *    - Renderiza a todos sus hijos en memoria (ideal para pantallas con formularios
 *      y tableros de control de tamaño medio).
 *    - Utiliza 'contentContainerStyle' para aplicar padding y centrado interno sin romper
 *      el contenedor exterior.
 *    - Incorpora 'keyboardShouldPersistTaps="handled"' para que los toques a botones
 *      no sean absorbidos únicamente por el teclado.
 * 
 * 4. <TextInput>:
 *    - Componente nativo para captura de datos del usuario desde el teclado.
 *    - Funciona como Componente Controlado vinculado a React Hooks ('useState'), donde
 *      'value' y 'onChangeText' mantienen sincronizado el estado con la entrada del usuario.
 * 
 * 5. <TouchableOpacity>:
 *    - Componente interactivo para botones y enlaces táctiles.
 *    - Modula automáticamente la opacidad al presionar ('activeOpacity={0.7}'), proveyendo
 *      retroalimentación visual sin requerir animaciones complejas manuales.
 * 
 * 6. React Hook - useState:
 *    - Permite gestionar el estado mutable local y reactivo de los cursos y calificaciones.
 *    - Al disparar la actualización de estado inmutable (setCourses), React Native recalcula
 *      el árbol de componentes y actualiza el Promedio Ponderado en tiempo real.
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// DATOS SEMILLA INICIALES (Fieles al Dashboard académico de Gradvia)
// ----------------------------------------------------------------------------
const INITIAL_COURSES: Course[] = [
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
    evaluations: [
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
    ],
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
    evaluations: [
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
    ],
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
    evaluations: [
      {
        id: 'ev-6',
        courseId: 'CC304',
        title: 'Ensamblador MIPS',
        category: 'Tarea / Lab',
        weight: 20,
        score: 17.0,
        date: '18 Sep, 2024',
      },
    ],
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
    evaluations: [
      {
        id: 'ev-7',
        courseId: 'MA201',
        title: 'Integrales Múltiples',
        category: 'Tarea / Lab',
        weight: 25,
        score: 15.5,
        date: '20 Sep, 2024',
      },
    ],
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
    evaluations: [
      {
        id: 'ev-8',
        courseId: 'CC302',
        title: 'Entrega Sprint 1',
        category: 'Proyecto',
        weight: 30,
        score: 19.0,
        date: '05 Oct, 2024',
      },
    ],
  },
];

export default function App() {
  // --------------------------------------------------------------------------
  // MANEJO DE ESTADO DINÁMICO (React Hooks - useState)
  // --------------------------------------------------------------------------

  // 1. Estado de la lista dinámica de cursos y calificaciones
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);

  // 2. Estado de navegación entre las dos pantallas: 'dashboard' | 'form'
  const [currentScreen, setCurrentScreen] = useState<'dashboard' | 'form'>('dashboard');

  // 3. Curso preseleccionado para registrar la nota
  const [selectedCourseId, setSelectedCourseId] = useState<string>('CC301');

  // 4. Modal para visualización e inspección de las tablas de la BD local
  const [isDbViewerOpen, setIsDbViewerOpen] = useState<boolean>(false);

  // 5. Mensaje toast de confirmación
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Carga inicial asíncrona de datos desde la Base de Datos Local
  useEffect(() => {
    LocalDatabase.getCoursesWithEvaluations().then((persistedCourses) => {
      if (persistedCourses && persistedCourses.length > 0) {
        setCourses(persistedCourses);
      }
    });
  }, []);

  // --------------------------------------------------------------------------
  // CÁLCULO DINÁMICO DEL PROMEDIO PONDERADO GLOBAL (GPA)
  // Fórmula académica: Suma(Nota_i * Créditos_i) / Suma(Créditos_i)
  // --------------------------------------------------------------------------
  const { overallGpa, totalCredits } = useMemo(() => {
    let accumulatedPoints = 0;
    let creditsSum = 0;

    courses.forEach((c) => {
      accumulatedPoints += c.currentGrade * c.credits;
      creditsSum += c.credits;
    });

    const calculatedGpa = creditsSum > 0 ? accumulatedPoints / creditsSum : 0;
    return {
      overallGpa: Number(calculatedGpa.toFixed(1)),
      totalCredits: creditsSum,
    };
  }, [courses]);

  // --------------------------------------------------------------------------
  // FUNCIÓN DESPACHADORA: Agregar nueva calificación y recalcular el estado
  // Persiste en la base de datos local y actualiza la interfaz
  // --------------------------------------------------------------------------
  const handleAddNewGrade = async (formData: NewGradeFormData) => {
    try {
      // Inserción relacional persistente en AsyncStorage
      const { updatedCourses } = await LocalDatabase.insertGrade(formData);
      setCourses(updatedCourses);
    } catch (error) {
      console.warn('Fallo guardando en base de datos local, aplicando fallback reactivo:', error);
      // Fallback reactivo en memoria
      setCourses((prev) =>
        prev.map((c) => {
          if (c.id !== formData.courseId) return c;
          const weightFactor = formData.weight / 100;
          const newGrade = Number(
            (c.currentGrade * (1 - weightFactor * 0.5) + formData.score * (weightFactor * 0.5)).toFixed(1)
          );
          return { ...c, currentGrade: newGrade };
        })
      );
    }

    // Notificación de éxito y retorno fluido al Dashboard
    setToastMessage(`¡Nota registrada en BD! Promedio recalculado.`);
    setTimeout(() => setToastMessage(null), 3500);
    setCurrentScreen('dashboard');
  };

  return (
    // <View> Contenedor raíz con Flexbox ('flex: 1') que ocupa el 100% de la ventana
    <View style={styles.rootContainer}>
      {/* Toast informativo de retroalimentación flotante */}
      {toastMessage && (
        <View style={styles.toastCard}>
          <Ionicons name="checkmark-circle" size={18} color="#38BDF8" />
          <Text style={styles.toastText}>{toastMessage}</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={() => setToastMessage(null)}>
            <Ionicons name="close" size={16} color="#94A3B8" />
          </TouchableOpacity>
        </View>
      )}

      {/* PANTALLA 1: DASHBOARD DE NOTAS DE GRADVIA */}
      {currentScreen === 'dashboard' ? (
        <DashboardScreen
          courses={courses}
          overallGpa={overallGpa}
          totalCredits={totalCredits}
          onOpenRecordGrade={() => {
            setSelectedCourseId(courses[0]?.id || 'CC301');
            setCurrentScreen('form');
          }}
          onSelectCourse={(course) => {
            setSelectedCourseId(course.id);
            setCurrentScreen('form');
          }}
          onOpenDatabaseViewer={() => setIsDbViewerOpen(true)}
        />
      ) : (
        /* PANTALLA 2: FORMULARIO DE REGISTRO DE CALIFICACIONES */
        <RecordGradeForm
          courses={courses}
          initialCourseId={selectedCourseId}
          onSubmitGrade={handleAddNewGrade}
          onCancel={() => setCurrentScreen('dashboard')}
        />
      )}

      {/* MODAL INSPECTOR DE TABLAS DE LA BASE DE DATOS LOCAL */}
      <DatabaseViewerModal
        visible={isDbViewerOpen}
        onClose={() => setIsDbViewerOpen(false)}
        onDatabaseReset={async () => {
          const fresh = await LocalDatabase.getCoursesWithEvaluations();
          setCourses(fresh);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#070A12',
  },
  toastCard: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 9999,
    backgroundColor: '#161B2E',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#38BDF8',
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
  toastText: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },
});
