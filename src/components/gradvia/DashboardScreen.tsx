import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Course } from '@/types/gradvia';

/**
 * ============================================================================
 * GUÍA TÉCNICA Y DOCUMENTACIÓN DE WIDGETS - INFORME UNIVERSITARIO
 * ============================================================================
 * 
 * 1. <View>:
 *    - Es el bloque contenedor fundamental en React Native (análogo a un <div> web).
 *    - MANEJO DE LAYOUT CON FLEXBOX:
 *      * 'flexDirection': En React Native el valor estándar es 'column' (eje principal vertical),
 *        a diferencia del navegador web que es 'row'.
 *      * 'justifyContent': Distribuye los componentes a lo largo del eje principal
 *        ('space-between' separa elementos a los extremos, 'center' los centra).
 *      * 'alignItems': Controla la alineación en el eje transversal o cruzado
 *        ('center' para centrar horizontalmente en columnas, 'stretch' para ocupar todo el ancho).
 *      * 'flex: 1': Hace que el contenedor se expanda para consumir todo el espacio disponible
 *        de su padre en la proporción indicada.
 * 
 * 2. <Text>:
 *    - Widget primitivo obligatorio para cualquier contenido tipográfico en pantalla.
 *    - REGLA NATIVA: React Native rechaza texto directo dentro de un <View>.
 *      Todo texto debe estar encapsulado en <Text> para que el motor nativo (Yoga)
 *      calcule sus dimensiones y renderice las fuentes del sistema operativo.
 *    - Admite anidación con herencia de estilos y utilidades como 'numberOfLines'.
 * 
 * 3. <ScrollView>:
 *    - Contenedor con capacidad de scroll que envuelve pantallas cuando su contenido
 *      excede las dimensiones físicas del dispositivo.
 *    - ESTRUCTURA DE LAYOUT:
 *      * La propiedad 'contentContainerStyle' aplica padding y alineación Flexbox a los
 *        hijos desplazables internos, mientras que 'style' controla el contenedor externo.
 *      * Permite 'horizontal={true}' para carriles de desplazamiento horizontal (ej. filtros).
 * 
 * 4. <TouchableOpacity>:
 *    - Componente táctil interactivo que envuelve elementos y provee retroalimentación visual
 *      reduciendo la opacidad al pulsar ('activeOpacity={0.7}').
 *    - Crucial para botones de acción, píldoras de filtro e interacción accesible.
 * ============================================================================
 */

export interface DashboardScreenProps {
  courses: Course[];
  overallGpa: number;
  totalCredits: number;
  onOpenRecordGrade: () => void;
  onSelectCourse?: (course: Course) => void;
  onOpenDatabaseViewer?: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  courses,
  overallGpa,
  totalCredits,
  onOpenRecordGrade,
  onSelectCourse,
  onOpenDatabaseViewer,
}) => {
  // Estado local para los filtros de categoría de cursos
  const [selectedFilter, setSelectedFilter] = useState<string>('Todos');

  // Filtrado reactivo de cursos según la pestaña seleccionada
  const filteredCourses = courses.filter((c) => {
    if (selectedFilter === 'Todos') return true;
    if (selectedFilter === 'Laboratorios') {
      return c.evaluations.some((e) => e.category === 'Tarea / Lab');
    }
    return true;
  });

  // Métricas calculadas para los badges de estado
  const passingCourses = courses.filter((c) => c.currentGrade >= 11.5).length;
  const atRiskCourses = courses.filter((c) => c.currentGrade < 11.5).length;

  return (
    // <SafeAreaView> (View nativo seguro): Evita superposición con la barra de estado y el notch
    <SafeAreaView style={styles.safeAreaContainer} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0E17" />

      {/* ==================================================================
          CABECERA SUPERIOR: Branding de la aplicación 'Gradvia'
          Layout Flexbox: 'flexDirection: row', 'justifyContent: space-between'
          ================================================================== */}
      <View style={styles.topNavigation}>
        {/* Lado izquierdo: Icono de Birrete, Título Gradvia y Badge Semestre */}
        <View style={styles.brandingGroup}>
          <View style={styles.capIconBox}>
            <Ionicons name="school" size={18} color="#38BDF8" />
          </View>
          <View style={styles.titleColumn}>
            <View style={styles.appNameRow}>
              <Text style={styles.appNameText}>Gradvia</Text>
              <View style={styles.semesterTag}>
                <Text style={styles.semesterTagText}>2025-1</Text>
              </View>
            </View>
            <Text style={styles.appSubText}>Dashboard</Text>
          </View>
        </View>

        {/* Lado derecho: Visor de BD Local, Notificaciones y Avatar */}
        <View style={styles.topRightActions}>
          {onOpenDatabaseViewer && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onOpenDatabaseViewer}
              style={styles.notificationBtn}
              accessibilityLabel="Ver Tablas de Base de Datos">
              <Ionicons name="server-outline" size={18} color="#38BDF8" />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.notificationBtn}
            accessibilityLabel="Notificaciones">
            <Ionicons name="notifications-outline" size={20} color="#CBD5E1" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.avatarBtn}
            accessibilityLabel="Perfil del estudiante">
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={18} color="#1E1B4B" />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* ==================================================================
          <ScrollView>: Contenedor de desplazamiento vertical principal
          Permite navegar de manera fluida por todo el dashboard universitario
          ================================================================== */}
      <ScrollView
        style={styles.scrollWrapper}
        contentContainerStyle={styles.scrollContentLayout}
        showsVerticalScrollIndicator={false}>
        
        {/* ================================================================
            SECCIÓN DE SALUDO Y RACHA DE ESTUDIO
            Layout Flexbox: 'flexDirection: row', 'justifyContent: space-between'
            ================================================================ */}
        <View style={styles.greetingRow}>
          <View style={styles.greetingTextCol}>
            <Text style={styles.greetingHeading}>Hola, Mateo 👋</Text>
            <View style={styles.semesterSubtitleRow}>
              <View style={styles.cyanStatusDot} />
              <Text style={styles.semesterSubtitleText}>
                Semestre 2025-1 · 5to Ciclo
              </Text>
            </View>
          </View>

          {/* Badge de Racha Académica */}
          <View style={styles.streakBadge}>
            <Ionicons name="flame" size={16} color="#FB923C" />
            <View style={styles.streakTextCol}>
              <Text style={styles.streakLabel}>Racha</Text>
              <Text style={styles.streakDays}>14 días</Text>
            </View>
          </View>
        </View>

        {/* ================================================================
            TARJETA 1: RENDIMIENTO SEMESTRAL (KPIs Y PROMEDIO PONDERADO)
            Muestra el promedio ponderado reactivo que se actualiza con el estado
            ================================================================ */}
        <View style={styles.kpiCardContainer}>
          {/* Cabecera de la tarjeta */}
          <View style={styles.kpiCardHeader}>
            <View style={styles.kpiTitleGroup}>
              <Ionicons name="trending-up" size={18} color="#818CF8" />
              <Text style={styles.kpiTitleText}>Rendimiento Semestral</Text>
            </View>
            <View style={styles.timeProgressTag}>
              <View style={styles.cyanMiniDot} />
              <Text style={styles.timeProgressText}>68% Tiempo</Text>
            </View>
          </View>

          {/* Cuerpo principal de la tarjeta: Anillo de progreso a la izquierda, Promedio a la derecha */}
          <View style={styles.kpiBodyRow}>
            {/* Gráfico circular estilizado con Flexbox y bordes concéntricos */}
            <View style={styles.progressCircleWrapper}>
              <View style={styles.outerRing}>
                <View style={styles.innerCircle}>
                  <Text style={styles.ringPercentageText}>68%</Text>
                  <Text style={styles.ringSubText}>Semana 11/16</Text>
                </View>
              </View>
            </View>

            {/* Columna informativa: Promedio Ponderado y Créditos Matriculados */}
            <View style={styles.kpiStatsColumn}>
              {/* Bloque del Promedio Ponderado Reactivo */}
              <View style={styles.gradeDisplayBlock}>
                <View style={styles.gpaLabelRow}>
                  <Text style={styles.gradeLabelText}>Promedio Ponderado</Text>
                  <View style={styles.gpaPill}>
                    <Text style={styles.gpaPillText}>GPA {(overallGpa / 5).toFixed(1)}</Text>
                  </View>
                </View>

                {/* Nota global calculada reactivamente desde el estado useState */}
                <View style={styles.bigScoreRow}>
                  <Text style={styles.bigScoreValue}>{overallGpa.toFixed(1)}</Text>
                  <Text style={styles.bigScoreMax}> / 20</Text>
                </View>
              </View>

              {/* Bloque de Carga Lectiva (Créditos) */}
              <View style={styles.creditsRow}>
                <View>
                  <Text style={styles.creditsLabel}>Carga Lectiva</Text>
                  <Text style={styles.creditsValue}>{totalCredits} Créditos</Text>
                </View>
                <View style={styles.creditsIconCircle}>
                  <Ionicons name="school-outline" size={16} color="#A78BFA" />
                </View>
              </View>
            </View>
          </View>

          {/* Fila inferior de estado: Cursos aprobando, En riesgo y Próxima entrega */}
          <View style={styles.statusChipsRow}>
            <View style={styles.statusChip}>
              <Ionicons name="checkmark-circle-outline" size={14} color="#34D399" />
              <Text style={styles.statusChipText}>{passingCourses} Aprobando</Text>
            </View>

            <View style={styles.statusChip}>
              <Ionicons name="shield-checkmark-outline" size={14} color="#38BDF8" />
              <Text style={styles.statusChipText}>{atRiskCourses} En Riesgo</Text>
            </View>

            <View style={styles.statusChip}>
              <Ionicons name="time-outline" size={14} color="#FBBF24" />
              <Text style={styles.statusChipText}>2 días Próx. Entrega</Text>
            </View>
          </View>
        </View>

        {/* ================================================================
            SELECTOR DE FILTROS HORIZONTALES (<ScrollView horizontal>)
            ================================================================ */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterBarContainer}>
          {/* Píldora: Todos los Cursos */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setSelectedFilter('Todos')}
            style={[
              styles.filterPill,
              selectedFilter === 'Todos' ? styles.filterPillActive : styles.filterPillInactive,
            ]}>
            <Text
              style={[
                styles.filterPillText,
                selectedFilter === 'Todos' && styles.filterPillTextActive,
              ]}>
              Todos los Cursos ({courses.length})
            </Text>
          </TouchableOpacity>

          {/* Píldora: En curso */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setSelectedFilter('En curso')}
            style={[
              styles.filterPill,
              selectedFilter === 'En curso' ? styles.filterPillActive : styles.filterPillInactive,
            ]}>
            <Text
              style={[
                styles.filterPillText,
                selectedFilter === 'En curso' && styles.filterPillTextActive,
              ]}>
              En curso
            </Text>
          </TouchableOpacity>

          {/* Píldora: Laboratorios */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setSelectedFilter('Laboratorios')}
            style={[
              styles.filterPill,
              selectedFilter === 'Laboratorios' ? styles.filterPillActive : styles.filterPillInactive,
            ]}>
            <Text
              style={[
                styles.filterPillText,
                selectedFilter === 'Laboratorios' && styles.filterPillTextActive,
              ]}>
              Laboratorios
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* ================================================================
            SECCIÓN: "MIS CURSOS"
            Layout: Título, contador de cursos y enlace al plan de estudios
            ================================================================ */}
        <View style={styles.coursesSectionHeader}>
          <View style={styles.coursesTitleGroup}>
            <Text style={styles.coursesTitleText}>Mis Cursos</Text>
            <View style={styles.activeCoursesBadge}>
              <Text style={styles.activeCoursesBadgeText}>{courses.length} activas</Text>
            </View>
          </View>

          <TouchableOpacity activeOpacity={0.7} style={styles.studyPlanLink}>
            <Text style={styles.studyPlanText}>Ver plan de estudios</Text>
            <Ionicons name="chevron-forward" size={14} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* ================================================================
            LISTADO DINÁMICO DE CURSOS (<View> y mapeo dinámico)
            Cada tarjeta de curso refleja el promedio ponderado individual
            ================================================================ */}
        <View style={styles.coursesListContainer}>
          {filteredCourses.map((course) => {
            const percentage = Math.round((course.currentGrade / 20) * 100);
            const isCyan = course.colorTheme === 'cyan';
            const badgeColor = isCyan ? '#38BDF8' : '#818CF8';
            const badgeBg = isCyan ? 'rgba(56, 189, 248, 0.15)' : 'rgba(129, 140, 248, 0.15)';
            const barFillColor = isCyan ? '#38BDF8' : '#818CF8';

            return (
              <TouchableOpacity
                key={course.id}
                activeOpacity={0.85}
                onPress={() => onSelectCourse && onSelectCourse(course)}
                style={styles.courseCard}>
                
                {/* Cabecera del curso: Código, Área de conocimiento y Calificación */}
                <View style={styles.courseCardTopRow}>
                  <View style={styles.courseTagsGroup}>
                    {/* Código de Asignatura */}
                    <View style={[styles.codeTag, { backgroundColor: badgeBg }]}>
                      <Text style={[styles.codeTagText, { color: badgeColor }]}>
                        {course.code}
                      </Text>
                    </View>

                    {/* Departamento / Área */}
                    <View style={styles.departmentTag}>
                      <Text style={styles.departmentTagText}>{course.department}</Text>
                    </View>
                  </View>

                  {/* Cuadro de Calificación del Curso */}
                  <View style={styles.gradeBoxColumn}>
                    <View style={[styles.gradeSquare, { backgroundColor: badgeBg, borderColor: badgeColor }]}>
                      <Text style={[styles.gradeSquareText, { color: badgeColor }]}>
                        {course.currentGrade.toFixed(1)}
                      </Text>
                    </View>
                    <Text style={[styles.gradePercentageLabel, { color: badgeColor }]}>
                      {percentage}% logrado
                    </Text>
                  </View>
                </View>

                {/* Nombre de la Asignatura */}
                <Text style={styles.courseNameText}>{course.name}</Text>

                {/* Docente a cargo */}
                <View style={styles.professorRow}>
                  <Ionicons name="person-outline" size={13} color="#94A3B8" />
                  <Text style={styles.professorText}>{course.professor}</Text>
                </View>

                {/* Barra y contador de avance curricular de evaluaciones */}
                <View style={styles.progressSection}>
                  <View style={styles.progressLabelsRow}>
                    <Text style={styles.progressLabelLeft}>Avance curricular</Text>
                    <Text style={styles.progressLabelRight}>
                      {course.evaluations.length} / {course.totalEvaluations} evaluaciones
                    </Text>
                  </View>

                  {/* Barra de progreso de ancho porcentual con Flexbox */}
                  <View style={styles.progressBarTrack}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${Math.min(
                            (course.evaluations.length / course.totalEvaluations) * 100,
                            100
                          )}%`,
                          backgroundColor: barFillColor,
                        },
                      ]}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ================================================================
            TARJETA DE PRÓXIMA ENTREGA (Banner de Sprint)
            ================================================================ */}
        <View style={styles.nextDeliveryCard}>
          <View style={styles.deliveryIconSquare}>
            <Ionicons name="checkbox-outline" size={22} color="#38BDF8" />
          </View>

          <View style={styles.deliveryTextColumn}>
            <Text style={styles.deliveryDueTime}>EN 2 DÍAS · JUEVES</Text>
            <Text style={styles.deliveryTitle} numberOfLines={1}>
              Entrega Sprint 2: Arquitect...
            </Text>
            <Text style={styles.deliveryCourseSub}>
              Ingeniería de Software I (CC302)
            </Text>
          </View>

          <TouchableOpacity activeOpacity={0.7} style={styles.deliveryArrowBtn}>
            <Ionicons name="arrow-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* ================================================================
            <TouchableOpacity>: BOTÓN DE ACCIÓN RÁPIDA (+ REGISTRAR NOTA)
            Navega al formulario para agregar nuevas notas al estado dinámico
            ================================================================ */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onOpenRecordGrade}
          style={styles.floatingActionBtn}>
          <Ionicons name="add-circle" size={22} color="#FFFFFF" />
          <Text style={styles.floatingActionBtnText}>Registrar Nota</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ==================================================================
          BARRA DE NAVEGACIÓN INFERIOR (Dock nativo con Flexbox)
          Distribución: 'flexDirection: row', 'justifyContent: space-around'
          ================================================================== */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity activeOpacity={0.7} style={styles.tabItem}>
          <Ionicons name="grid" size={20} color="#38BDF8" />
          <Text style={[styles.tabItemLabel, styles.tabItemLabelActive]}>Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.7} style={styles.tabItem}>
          <Ionicons name="calendar-outline" size={20} color="#64748B" />
          <Text style={styles.tabItemLabel}>Horario</Text>
        </TouchableOpacity>

        {/* Botón central elevado para Registrar Calificaciones */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onOpenRecordGrade}
          style={styles.centerFabTab}>
          <Ionicons name="add" size={26} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.7} style={styles.tabItem}>
          <Ionicons name="person-outline" size={20} color="#64748B" />
          <Text style={styles.tabItemLabel}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#070A12',
  },
  scrollWrapper: {
    flex: 1,
  },
  scrollContentLayout: {
    paddingHorizontal: 18,
    paddingBottom: 90,
    gap: 16,
  },
  topNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: '#070A12',
  },
  brandingGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  capIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  titleColumn: {
    gap: 2,
  },
  appNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  appNameText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  semesterTag: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  semesterTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#38BDF8',
  },
  appSubText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  notificationBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#131826',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  avatarBtn: {
    borderRadius: 18,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#C4B5FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  greetingTextCol: {
    gap: 4,
  },
  greetingHeading: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  semesterSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cyanStatusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#38BDF8',
  },
  semesterSubtitleText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161B29',
    borderWidth: 1,
    borderColor: '#263147',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  streakTextCol: {
    alignItems: 'flex-start',
  },
  streakLabel: {
    fontSize: 9,
    color: '#94A3B8',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  streakDays: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  kpiCardContainer: {
    backgroundColor: '#111524',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#1E273D',
    padding: 16,
    gap: 16,
  },
  kpiCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  kpiTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  kpiTitleText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  timeProgressTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 5,
  },
  cyanMiniDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38BDF8',
  },
  timeProgressText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#38BDF8',
  },
  kpiBodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  progressCircleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 8,
    borderColor: '#38BDF8',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F1322',
  },
  innerCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringPercentageText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  ringSubText: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  kpiStatsColumn: {
    flex: 1,
    gap: 12,
  },
  gradeDisplayBlock: {
    backgroundColor: '#161B2E',
    borderRadius: 14,
    padding: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: '#212B44',
  },
  gpaLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gradeLabelText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  gpaPill: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  gpaPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#38BDF8',
  },
  bigScoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  bigScoreValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  bigScoreMax: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  creditsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#161B2E',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#212B44',
  },
  creditsLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  creditsValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  creditsIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(167, 139, 250, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusChipsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  statusChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#161B2E',
    paddingVertical: 8,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: '#212B44',
  },
  statusChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#CBD5E1',
  },
  filterBarContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
  },
  filterPillActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#6366F1',
  },
  filterPillInactive: {
    backgroundColor: '#121726',
    borderColor: '#1F293D',
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  coursesSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  coursesTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  coursesTitleText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  activeCoursesBadge: {
    backgroundColor: '#1A2236',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#283552',
  },
  activeCoursesBadgeText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  studyPlanLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  studyPlanText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  coursesListContainer: {
    gap: 12,
  },
  courseCard: {
    backgroundColor: '#111524',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1E273D',
    padding: 16,
    gap: 8,
  },
  courseCardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  courseTagsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
    flex: 1,
  },
  codeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  codeTagText: {
    fontSize: 11,
    fontWeight: '800',
  },
  departmentTag: {
    backgroundColor: '#181F30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  departmentTagText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  gradeBoxColumn: {
    alignItems: 'flex-end',
    gap: 3,
  },
  gradeSquare: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  gradeSquareText: {
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  gradePercentageLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  courseNameText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  professorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  professorText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  progressSection: {
    gap: 6,
    marginTop: 4,
  },
  progressLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabelLeft: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  progressLabelRight: {
    fontSize: 11,
    color: '#CBD5E1',
    fontWeight: '600',
  },
  progressBarTrack: {
    height: 5,
    backgroundColor: '#1E273D',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  nextDeliveryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131828',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#202B44',
    padding: 14,
    gap: 12,
  },
  deliveryIconSquare: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliveryTextColumn: {
    flex: 1,
    gap: 2,
  },
  deliveryDueTime: {
    fontSize: 10,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 0.5,
  },
  deliveryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  deliveryCourseSub: {
    fontSize: 12,
    color: '#94A3B8',
  },
  deliveryArrowBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1B2236',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5856D6',
    paddingVertical: 14,
    borderRadius: 24,
    gap: 8,
    shadowColor: '#5856D6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 8,
  },
  floatingActionBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  bottomTabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#070A12',
    borderTopWidth: 1,
    borderTopColor: '#171E30',
    paddingVertical: 10,
  },
  tabItem: {
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
  },
  tabItemLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  tabItemLabelActive: {
    color: '#38BDF8',
    fontWeight: '700',
  },
  centerFabTab: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
});
