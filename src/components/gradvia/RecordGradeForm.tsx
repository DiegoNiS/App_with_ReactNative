import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Course, EvaluationCategory, NewGradeFormData } from '@/types/gradvia';

/**
 * ============================================================================
 * GUÍA TÉCNICA Y DOCUMENTACIÓN DE WIDGETS - INFORME UNIVERSITARIO
 * ============================================================================
 * 
 * 1. <View>:
 *    - Bloque de construcción visual indispensable en React Native.
 *    - Gestiona el modelo de cajas y Flexbox:
 *      * 'flexDirection: row' para colocar elementos lado a lado (ej. selector de curso,
 *        insignia de moneda/porcentaje y grupos de botones).
 *      * 'justifyContent: space-between' para separar títulos de sus indicaciones ("Requerido",
 *        "Auto-ponderado").
 *      * 'alignItems: center' para alinear verticalmente iconos y textos dentro de cada fila.
 * 
 * 2. <Text>:
 *    - Componente nativo exclusivo para texto.
 *    - Controla jerarquía visual, colores temáticos ('#38BDF8', '#94A3B8', '#FFFFFF')
 *      y contadores dinámicos.
 * 
 * 3. <ScrollView>:
 *    - Envuelve el formulario extenso garantizando accesibilidad táctil total.
 *    - 'keyboardShouldPersistTaps="handled"': Asegura que al tocar los botones de acción,
 *      el evento de pulsación se dispare inmediatamente sin ser consumido exclusivamente
 *      por el cierre del teclado virtual.
 * 
 * 4. <TextInput>:
 *    - Componente nativo para captura de datos del usuario mediante el teclado del dispositivo.
 *    - Implementa el patrón 'Controlled Component' (Componente Controlado), donde su propiedad
 *      'value' se sincroniza bidireccionalmente con el estado de React ('useState') mediante
 *      la función de devolución de llamada 'onChangeText'.
 *    - Admite 'keyboardType="decimal-pad"' para entradas numéricas y 'multiline={true}'
 *      para áreas de texto extenso (feedback del docente).
 * 
 * 5. <TouchableOpacity>:
 *    - Envoltorio interactivo táctil que proporciona retroalimentación visual inmediata
 *      modulando la opacidad ('activeOpacity').
 *    - Esencial para botones de envío, chips de selección y disparadores modales.
 * ============================================================================
 */

export interface RecordGradeFormProps {
  courses: Course[];
  initialCourseId?: string;
  onSubmitGrade: (data: NewGradeFormData) => void;
  onCancel: () => void;
}

const EVALUATION_CATEGORIES: { label: EvaluationCategory; icon: keyof typeof Ionicons.glyphMap }[] = [
  { label: 'Parcial', icon: 'book-outline' },
  { label: 'Tarea / Lab', icon: 'albums-outline' },
  { label: 'Proyecto', icon: 'rocket-outline' },
  { label: 'Quiz', icon: 'flash-outline' },
];

export const RecordGradeForm: React.FC<RecordGradeFormProps> = ({
  courses,
  initialCourseId,
  onSubmitGrade,
  onCancel,
}) => {
  // --------------------------------------------------------------------------
  // ESTADO LOCAL DEL FORMULARIO CON REACT HOOKS (useState)
  // --------------------------------------------------------------------------
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    initialCourseId || courses[0]?.id || 'CC301'
  );
  const [isCoursePickerOpen, setIsCoursePickerOpen] = useState<boolean>(false);
  const [evaluationTitle, setEvaluationTitle] = useState<string>('Laboratorio 3 - Árboles AVL');
  const [selectedCategory, setSelectedCategory] = useState<EvaluationCategory>('Tarea / Lab');
  const [weight, setWeight] = useState<string>('15');
  const [score, setScore] = useState<string>('19.0');
  const [scaleMode, setScaleMode] = useState<'20' | '100'>('20');
  const [date] = useState<string>('24 Oct, 2024');
  const [feedback, setFeedback] = useState<string>(
    'Excelente implementación del balanceo de rotaciones dobles. Optimización de memoria en orden logarítmico impecable.'
  );

  // Obtener la asignatura actualmente seleccionada
  const activeCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  // --------------------------------------------------------------------------
  // CÁLCULO EN VIVO DE IMPACTO EN EL SEMESTRE (Simulación Reactiva)
  // --------------------------------------------------------------------------
  const parsedScore = parseFloat(score) || 0;
  const parsedWeight = parseFloat(weight) || 0;
  const currentGrade = activeCourse?.currentGrade ?? 18.2;

  // Simulación del nuevo promedio ponderado del curso
  // Fórmula de media ponderada incremental:
  const newEstimatedGrade =
    parsedWeight > 0 && parsedScore > 0
      ? Number((currentGrade * 0.85 + (parsedScore * (parsedWeight / 100))).toFixed(2))
      : currentGrade;

  const gradeDelta = Number((newEstimatedGrade - currentGrade).toFixed(2));

  // Manejo del envío del formulario con validaciones estrictas
  const handleSave = () => {
    if (!evaluationTitle.trim()) {
      Alert.alert('Campo Requerido', 'Por favor ingresa el nombre de la evaluación.');
      return;
    }

    if (isNaN(parsedScore) || parsedScore < 0 || parsedScore > 20) {
      Alert.alert('Calificación Inválida', 'La calificación debe encontrarse entre 0 y 20.');
      return;
    }

    if (isNaN(parsedWeight) || parsedWeight <= 0 || parsedWeight > 100) {
      Alert.alert('Ponderación Inválida', 'Por favor ingresa un peso porcentual válido.');
      return;
    }

    // Enviamos los datos tipados a la función despachadora global
    onSubmitGrade({
      courseId: selectedCourseId,
      title: evaluationTitle.trim(),
      category: selectedCategory,
      weight: parsedWeight,
      score: parsedScore,
      date,
      feedback: feedback.trim(),
    });
  };

  return (
    // <SafeAreaView> asegura que no haya colisión con barras del sistema
    <SafeAreaView style={styles.safeAreaContainer} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#070A12" />

      {/* ==================================================================
          CABECERA SUPERIOR: Título de pantalla y acción de regreso
          Flexbox: 'flexDirection: row', 'justifyContent: space-between'
          ================================================================== */}
      <View style={styles.topHeaderBar}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onCancel}
          style={styles.backIconButton}
          accessibilityLabel="Volver al dashboard">
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerTitleGroup}>
          <View style={styles.headerCapCircle}>
            <Ionicons name="school" size={16} color="#38BDF8" />
          </View>
          <Text style={styles.headerScreenTitle}>Nuevo Registro Calificacion</Text>
        </View>

        <View style={styles.userAvatarCircle}>
          <Ionicons name="person" size={16} color="#1E1B4B" />
        </View>
      </View>

      {/* ==================================================================
          SUB-BARRA: Cancelar a la izquierda, Tag NUEVA NOTA a la derecha
          Flexbox: 'flexDirection: row', 'justifyContent: space-between'
          ================================================================== */}
      <View style={styles.subActionsBar}>
        <TouchableOpacity activeOpacity={0.7} onPress={onCancel} style={styles.cancelLink}>
          <Ionicons name="close" size={16} color="#94A3B8" />
          <Text style={styles.cancelLinkText}>Cancelar</Text>
        </TouchableOpacity>

        <View style={styles.newGradeBadge}>
          <View style={styles.cyanStatusDot} />
          <Text style={styles.newGradeBadgeText}>NUEVA NOTA</Text>
        </View>
      </View>

      {/* ==================================================================
          <ScrollView>: Contenedor de formulario con scroll vertical
          Permite escribir con el teclado sin ocultar los botones de acción
          ================================================================== */}
      <ScrollView
        style={styles.formScrollWrapper}
        contentContainerStyle={styles.formContentLayout}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        
        {/* ================================================================
            CAMPO 1: ASIGNATURA DESTINO (Selector de curso)
            ================================================================ */}
        <View style={styles.inputSectionBlock}>
          <View style={styles.sectionLabelRow}>
            <Text style={styles.sectionLabelHeading}>ASIGNATURA DESTINO</Text>
            <View style={styles.autoWeightTag}>
              <Ionicons name="sparkles" size={12} color="#38BDF8" />
              <Text style={styles.autoWeightText}>Auto-ponderado</Text>
            </View>
          </View>

          {/* Tarjeta del Curso Seleccionado con Flechas de Alternancia */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsCoursePickerOpen(!isCoursePickerOpen)}
            style={styles.courseSelectCard}>
            <View style={styles.courseThumbSquare}>
              <Ionicons name="hardware-chip-outline" size={22} color="#A78BFA" />
            </View>

            <View style={styles.courseSelectTextCol}>
              <View style={styles.courseSelectNameRow}>
                <Text style={styles.courseSelectName} numberOfLines={1}>
                  {activeCourse.name}
                </Text>
                <Ionicons name="swap-vertical" size={16} color="#94A3B8" />
              </View>
              <Text style={styles.courseSelectMeta}>
                {activeCourse.code} · Promedio actual: {activeCourse.currentGrade.toFixed(1)}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Menú desplegable para alternar de asignatura */}
          {isCoursePickerOpen && (
            <View style={styles.coursePickerDropdown}>
              {courses.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  activeOpacity={0.7}
                  onPress={() => {
                    setSelectedCourseId(c.id);
                    setIsCoursePickerOpen(false);
                  }}
                  style={[
                    styles.pickerCourseOption,
                    c.id === selectedCourseId && styles.pickerCourseOptionActive,
                  ]}>
                  <Text
                    style={[
                      styles.pickerOptionName,
                      c.id === selectedCourseId && styles.pickerOptionNameActive,
                    ]}>
                    {c.code} - {c.name}
                  </Text>
                  <Text style={styles.pickerOptionGrade}>{c.currentGrade.toFixed(1)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* ================================================================
            CAMPO 2: NOMBRE DE LA EVALUACIÓN (<TextInput> con Icono)
            ================================================================ */}
        <View style={styles.inputSectionBlock}>
          <View style={styles.sectionLabelRow}>
            <Text style={styles.sectionSubLabel}>Nombre de la Evaluación</Text>
            <Text style={styles.requiredTagText}>Requerido</Text>
          </View>

          {/* Contenedor Flexbox del Input con icono de portapapeles y micrófono */}
          <View style={styles.textInputBox}>
            <Ionicons name="clipboard-outline" size={18} color="#94A3B8" />
            <TextInput
              value={evaluationTitle}
              onChangeText={setEvaluationTitle}
              placeholder="Ej. Laboratorio 3 - Árboles AVL"
              placeholderTextColor="#475569"
              style={styles.textInputField}
            />
            <TouchableOpacity activeOpacity={0.7}>
              <Ionicons name="mic-outline" size={18} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ================================================================
            CAMPO 3: TIPO DE EVALUACIÓN (Chips Horizontales con <TouchableOpacity>)
            ================================================================ */}
        <View style={styles.inputSectionBlock}>
          <View style={styles.sectionLabelRow}>
            <Text style={styles.sectionSubLabel}>Tipo de Evaluación</Text>
            <Text style={styles.optionalTagText}>Selecciona categoría</Text>
          </View>

          <View style={styles.categoriesRow}>
            {EVALUATION_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.label;
              return (
                <TouchableOpacity
                  key={cat.label}
                  activeOpacity={0.8}
                  onPress={() => setSelectedCategory(cat.label)}
                  style={[
                    styles.categoryChipBtn,
                    isSelected ? styles.categoryChipActive : styles.categoryChipInactive,
                  ]}>
                  <Ionicons
                    name={cat.icon}
                    size={15}
                    color={isSelected ? '#FFFFFF' : '#94A3B8'}
                  />
                  <Text
                    style={[
                      styles.categoryChipLabel,
                      isSelected && styles.categoryChipLabelActive,
                    ]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ================================================================
            CAMPO 4: PONDERACIÓN / PESO (%) (<TextInput> + Presets rápidos)
            ================================================================ */}
        <View style={styles.inputSectionBlock}>
          <View style={styles.sectionLabelRow}>
            <View style={styles.labelWithIconRow}>
              <Ionicons name="pie-chart-outline" size={16} color="#38BDF8" />
              <Text style={styles.sectionSubLabel}>Ponderación / Peso</Text>
            </View>
            <View style={styles.remainingWeightTag}>
              <Text style={styles.remainingWeightText}>Restante: 35%</Text>
            </View>
          </View>

          {/* Fila del Input de Porcentaje y Botones Predefinidos (10%, 15%, 20%) */}
          <View style={styles.weightInputRow}>
            <View style={styles.weightFieldBox}>
              <TextInput
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                style={styles.weightInputField}
              />
              <Text style={styles.percentSymbol}>%</Text>
            </View>

            {/* Presets rápidos */}
            <View style={styles.presetsGroup}>
              {['10', '15', '20'].map((preset) => {
                const isActive = weight === preset;
                return (
                  <TouchableOpacity
                    key={preset}
                    activeOpacity={0.8}
                    onPress={() => setWeight(preset)}
                    style={[
                      styles.presetButton,
                      isActive && styles.presetButtonActive,
                    ]}>
                    <Text
                      style={[
                        styles.presetButtonText,
                        isActive && styles.presetButtonTextActive,
                      ]}>
                      {preset}%
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Barra de progreso de peso acumulado */}
          <View style={styles.weightTrackContainer}>
            <View style={styles.weightTrackFillBase} />
            <View style={styles.weightTrackFillNew} />
          </View>

          <View style={styles.weightMetaRow}>
            <Text style={styles.weightMetaLeft}>Acumulado previo: 65%</Text>
            <Text style={styles.weightMetaRight}>Total con esta nota: 80%</Text>
          </View>
        </View>

        {/* ================================================================
            CAMPO 5: CALIFICACIÓN OBTENIDA (<TextInput> numérico de nota)
            ================================================================ */}
        <View style={styles.inputSectionBlock}>
          <View style={styles.sectionLabelRow}>
            <View style={styles.labelWithIconRow}>
              <Ionicons name="star-outline" size={16} color="#CBD5E1" />
              <Text style={styles.sectionSubLabel}>Calificación Obtenida</Text>
            </View>

            {/* Toggle de Escala (0-20 vs 0-100) */}
            <View style={styles.scaleToggleBox}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setScaleMode('20')}
                style={[
                  styles.scaleToggleOption,
                  scaleMode === '20' && styles.scaleToggleActive,
                ]}>
                <Text
                  style={[
                    styles.scaleToggleText,
                    scaleMode === '20' && styles.scaleToggleTextActive,
                  ]}>
                  0 - 20
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setScaleMode('100')}
                style={[
                  styles.scaleToggleOption,
                  scaleMode === '100' && styles.scaleToggleActive,
                ]}>
                <Text
                  style={[
                    styles.scaleToggleText,
                    scaleMode === '100' && styles.scaleToggleTextActive,
                  ]}>
                  0 - 100
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Entrada gigante de Calificación + Badge de Sobresaliente */}
          <View style={styles.scoreRowContainer}>
            <View style={styles.scoreInputBox}>
              <TextInput
                value={score}
                onChangeText={setScore}
                keyboardType="decimal-pad"
                style={styles.bigScoreInput}
              />
              <Text style={styles.scoreScaleSub}>/ 20</Text>
            </View>

            {/* Tarjeta de Sobresaliente / Aprobado */}
            <View style={styles.scoreRemarkCard}>
              <View style={styles.remarkTitleRow}>
                <Ionicons name="checkmark-circle" size={16} color="#38BDF8" />
                <Text style={styles.remarkTitleText}>Sobresaliente</Text>
              </View>
              <Text style={styles.remarkSubText}>Aprobado + Alto</Text>
            </View>
          </View>
        </View>

        {/* ================================================================
            SECCIÓN: IMPACTO EN EL SEMESTRE (Simulación viva reactiva)
            Calcula la variación del promedio de la asignatura en tiempo real
            ================================================================ */}
        <View style={styles.impactCardContainer}>
          <View style={styles.impactHeaderRow}>
            <View style={styles.impactTitleGroup}>
              <Ionicons name="trending-up" size={16} color="#38BDF8" />
              <Text style={styles.impactHeadingText}>IMPACTO EN EL SEMESTRE</Text>
            </View>
            <Text style={styles.liveSimulationLabel}>Simulación viva</Text>
          </View>

          <View style={styles.impactValuesRow}>
            <View>
              <Text style={styles.impactSubLabel}>Promedio actual</Text>
              <Text style={styles.currentGradeVal}>{currentGrade.toFixed(1)}</Text>
            </View>

            <View style={styles.arrowBetweenBox}>
              <Ionicons name="arrow-forward" size={18} color="#38BDF8" />
            </View>

            <View style={styles.estimatedGradeBox}>
              <Text style={styles.impactSubLabel}>Nuevo estimado</Text>
              <View style={styles.estimatedGradeRow}>
                <Text style={styles.estimatedGradeVal}>{newEstimatedGrade.toFixed(2)}</Text>
                <View style={styles.deltaPill}>
                  <Text style={styles.deltaPillText}>
                    {gradeDelta >= 0 ? `+${gradeDelta}` : `${gradeDelta}`}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* ================================================================
            CAMPO 6: FECHA DE PUBLICACIÓN (Selector de fecha con icono)
            ================================================================ */}
        <View style={styles.inputSectionBlock}>
          <View style={styles.sectionLabelRow}>
            <Text style={styles.sectionSubLabel}>Fecha de Publicación</Text>
            <Text style={styles.optionalTagText}>Opcional</Text>
          </View>

          <View style={styles.dateSelectorBox}>
            <View style={styles.dateLabelRow}>
              <Ionicons name="calendar-outline" size={18} color="#94A3B8" />
              <Text style={styles.dateValueText}>{date}</Text>
            </View>
            <Ionicons name="chevron-down" size={18} color="#64748B" />
          </View>
        </View>

        {/* ================================================================
            CAMPO 7: FEEDBACK DEL DOCENTE (<TextInput multiline>)
            ================================================================ */}
        <View style={styles.inputSectionBlock}>
          <View style={styles.sectionLabelRow}>
            <Text style={styles.sectionSubLabel}>Feedback del Docente o Anotaciones</Text>
            <Text style={styles.optionalTagText}>Opcional</Text>
          </View>

          <View style={styles.textAreaBox}>
            <TextInput
              value={feedback}
              onChangeText={setFeedback}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholder="Escribe comentarios del profesor..."
              placeholderTextColor="#475569"
              style={styles.textAreaField}
            />
          </View>
        </View>

        {/* ================================================================
            BOTONES DE ACCIÓN: Guardar Calificación + Descartar Cambios
            Flexbox: Centrado y espaciado vertical 'gap: 12'
            ================================================================ */}
        <View style={styles.formActionsContainer}>
          {/* Botón Principal: Guardar Calificación */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleSave}
            style={styles.submitGradeButton}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
            <Text style={styles.submitGradeButtonText}>Guardar Calificación</Text>
          </TouchableOpacity>

          {/* Botón Secundario: Descartar Cambios */}
          <TouchableOpacity activeOpacity={0.7} onPress={onCancel} style={styles.discardButton}>
            <Text style={styles.discardButtonText}>Descartar Cambios</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#070A12',
  },
  topHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#070A12',
  },
  backIconButton: {
    padding: 6,
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerCapCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerScreenTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  userAvatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#C4B5FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subActionsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  cancelLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cancelLinkText: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '600',
  },
  newGradeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
  },
  cyanStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38BDF8',
  },
  newGradeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#38BDF8',
  },
  formScrollWrapper: {
    flex: 1,
  },
  formContentLayout: {
    paddingHorizontal: 18,
    paddingBottom: 40,
    gap: 18,
  },
  inputSectionBlock: {
    gap: 8,
  },
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionLabelHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  autoWeightTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  autoWeightText: {
    fontSize: 12,
    color: '#38BDF8',
    fontWeight: '600',
  },
  courseSelectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121726',
    borderWidth: 1,
    borderColor: '#1F293D',
    borderRadius: 16,
    padding: 12,
    gap: 12,
  },
  courseThumbSquare: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#1E1B4B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#6366F1',
  },
  courseSelectTextCol: {
    flex: 1,
    gap: 3,
  },
  courseSelectNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  courseSelectName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  courseSelectMeta: {
    fontSize: 12,
    color: '#94A3B8',
  },
  coursePickerDropdown: {
    backgroundColor: '#161B2E',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#26314D',
    overflow: 'hidden',
    marginTop: 4,
  },
  pickerCourseOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1F273D',
  },
  pickerCourseOptionActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
  },
  pickerOptionName: {
    fontSize: 13,
    color: '#CBD5E1',
    flex: 1,
  },
  pickerOptionNameActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  pickerOptionGrade: {
    fontSize: 13,
    fontWeight: '800',
    color: '#38BDF8',
  },
  sectionSubLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E2E8F0',
  },
  requiredTagText: {
    fontSize: 11,
    color: '#38BDF8',
    fontWeight: '600',
  },
  optionalTagText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  textInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121726',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1F293D',
    paddingHorizontal: 14,
    height: 50,
    gap: 10,
  },
  textInputField: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
  },
  categoriesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryChipBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  categoryChipActive: {
    backgroundColor: '#6366F1',
    borderColor: '#818CF8',
  },
  categoryChipInactive: {
    backgroundColor: '#121726',
    borderColor: '#1F293D',
  },
  categoryChipLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  categoryChipLabelActive: {
    color: '#FFFFFF',
  },
  labelWithIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  remainingWeightTag: {
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  remainingWeightText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#38BDF8',
  },
  weightInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  weightFieldBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121726',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1F293D',
    paddingHorizontal: 14,
    height: 48,
    width: 110,
  },
  weightInputField: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  percentSymbol: {
    color: '#38BDF8',
    fontSize: 16,
    fontWeight: '800',
  },
  presetsGroup: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  presetButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#121726',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1F293D',
    height: 48,
  },
  presetButtonActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderColor: '#38BDF8',
  },
  presetButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94A3B8',
  },
  presetButtonTextActive: {
    color: '#38BDF8',
  },
  weightTrackContainer: {
    flexDirection: 'row',
    height: 8,
    backgroundColor: '#1E273D',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 4,
  },
  weightTrackFillBase: {
    width: '65%',
    backgroundColor: '#818CF8',
  },
  weightTrackFillNew: {
    width: '15%',
    backgroundColor: '#38BDF8',
  },
  weightMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weightMetaLeft: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  weightMetaRight: {
    fontSize: 11,
    color: '#38BDF8',
    fontWeight: '600',
  },
  scaleToggleBox: {
    flexDirection: 'row',
    backgroundColor: '#121726',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1F293D',
    padding: 2,
  },
  scaleToggleOption: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  scaleToggleActive: {
    backgroundColor: '#6366F1',
  },
  scaleToggleText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  scaleToggleTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  scoreRowContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  scoreInputBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: '#121726',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1F293D',
    paddingHorizontal: 16,
    height: 64,
  },
  bigScoreInput: {
    flex: 1,
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  scoreScaleSub: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  scoreRemarkCard: {
    flex: 1,
    backgroundColor: '#0C202E',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    justifyContent: 'center',
    paddingHorizontal: 14,
    gap: 2,
  },
  remarkTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  remarkTitleText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#38BDF8',
  },
  remarkSubText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  impactCardContainer: {
    backgroundColor: '#121726',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1F293D',
    padding: 14,
    gap: 12,
  },
  impactHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  impactTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  impactHeadingText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 0.5,
  },
  liveSimulationLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  impactValuesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  impactSubLabel: {
    fontSize: 11,
    color: '#94A3B8',
  },
  currentGradeVal: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 2,
  },
  arrowBetweenBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  estimatedGradeBox: {
    alignItems: 'flex-end',
  },
  estimatedGradeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  estimatedGradeVal: {
    fontSize: 22,
    fontWeight: '900',
    color: '#38BDF8',
  },
  deltaPill: {
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  deltaPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#38BDF8',
  },
  dateSelectorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#121726',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1F293D',
    paddingHorizontal: 14,
    height: 50,
  },
  dateLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateValueText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  textAreaBox: {
    backgroundColor: '#121726',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1F293D',
    padding: 12,
    minHeight: 90,
  },
  textAreaField: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 18,
  },
  formActionsContainer: {
    marginTop: 6,
    gap: 12,
  },
  submitGradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5856D6',
    height: 54,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#5856D6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 8,
  },
  submitGradeButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  discardButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  discardButtonText: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '600',
  },
});
