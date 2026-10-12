import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Switch,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CategoryType, PriorityType, RecordItem } from '@/types/record';

/**
 * ============================================================================
 * DOCUMENTACIÓN DE WIDGETS PRINCIPALES (EVALUACIÓN DE LABORATORIO)
 * ============================================================================
 * 
 * 1. <ScrollView>:
 *    - Es el contenedor desplazable fundamental en React Native.
 *    - Es crucial en pantallas con formularios, ya que cuando el teclado virtual
 *      se despliega o en pantallas compactas, los campos inferiores quedarían
 *      inaccesibles sin desplazamiento.
 *    - 'contentContainerStyle': Permite dar relleno (padding) y estructura
 *      flex al área con desplazamiento sin afectar el viewport exterior.
 *    - 'keyboardShouldPersistTaps="handled"': Asegura que al presionar botones
 *      como "Guardar", la acción se ejecute directamente sin requerir un primer
 *      tap solo para cerrar el teclado.
 * 
 * 2. <View>:
 *    - Se utiliza como bloque de construcción para cada grupo del formulario:
 *      etiquetas de entrada con iconos, tarjetas de selección de categoría,
 *      contenedor de moneda ("$ USD") y tarjetas con interruptor (Switch).
 * 
 * 3. <Text>:
 *    - Renderiza las etiquetas de los campos, contadores dinámicos de caracteres
 *      ("0 / 250"), textos de estado ("Requerido", "Estándar") y etiquetas de botones.
 * ============================================================================
 */

export interface NewRecordFormProps {
  onSubmit: (record: Omit<RecordItem, 'id' | 'createdAt'>) => void;
  onCancel?: () => void;
}

const CATEGORIES: { label: CategoryType; icon: keyof typeof Ionicons.glyphMap }[] = [
  { label: 'Tecnología', icon: 'hardware-chip-outline' },
  { label: 'Diseño', icon: 'color-palette-outline' },
  { label: 'Finanzas', icon: 'wallet-outline' },
  { label: 'Operaciones', icon: 'git-network-outline' },
];

const PRIORITIES: { label: PriorityType; dotColor: string }[] = [
  { label: 'Normal', dotColor: '#06B6D4' },
  { label: 'Prioritario', dotColor: '#A855F7' },
  { label: 'Urgente', dotColor: '#EF4444' },
];

export const NewRecordForm: React.FC<NewRecordFormProps> = ({ onSubmit, onCancel }) => {
  // Manejo de estado local del formulario mediante React Hook 'useState'
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<CategoryType>('Tecnología');
  const [amount, setAmount] = useState<string>('');
  const [priority, setPriority] = useState<PriorityType>('Normal');
  const [notes, setNotes] = useState<string>('');
  const [isRecurring, setIsRecurring] = useState<boolean>(true);

  // Validación y envío del formulario
  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Campo Requerido', 'Por favor ingresa el nombre o título del elemento.');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Monto Inválido', 'Por favor ingresa un monto estimado mayor a 0.00 USD.');
      return;
    }

    // Invocamos la función callback con el nuevo registro tipado
    onSubmit({
      title: title.trim(),
      category,
      amount: parsedAmount,
      priority,
      notes: notes.trim(),
      isRecurring,
    });

    // Resetear formulario para futuras entradas
    setTitle('');
    setAmount('');
    setNotes('');
    setIsRecurring(true);
  };

  return (
    // <ScrollView> para garantizar navegación vertical fluida ante campos y teclado
    <ScrollView
      style={styles.formScroll}
      contentContainerStyle={styles.formContainer}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">
      
      {/* CAMPO 1: Nombre o Título */}
      <View style={styles.fieldGroup}>
        <View style={styles.labelRow}>
          <View style={styles.labelWithIcon}>
            <Ionicons name="pencil-outline" size={16} color="#94A3B8" />
            <Text style={styles.labelText}>Nombre o Título del Elemento</Text>
          </View>
          <Text style={styles.labelHint}>Requerido</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Ej. Suscripción Cloud Infrastructure"
            placeholderTextColor="#475569"
            style={styles.textInput}
          />
          <Ionicons name="pricetag-outline" size={18} color="#475569" />
        </View>
      </View>

      {/* CAMPO 2: Categoría Principal */}
      <View style={styles.fieldGroup}>
        <View style={styles.labelRow}>
          <View style={styles.labelWithIcon}>
            <Ionicons name="shapes-outline" size={16} color="#94A3B8" />
            <Text style={styles.labelText}>Categoría Principal</Text>
          </View>
          <Text style={styles.labelHint}>Selecciona una</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}>
          {CATEGORIES.map((cat) => {
            const isSelected = category === cat.label;
            return (
              <Pressable
                key={cat.label}
                onPress={() => setCategory(cat.label)}
                style={[
                  styles.categoryPill,
                  isSelected ? styles.categoryPillActive : styles.categoryPillInactive,
                ]}>
                <Ionicons
                  name={cat.icon}
                  size={16}
                  color={isSelected ? '#FFFFFF' : '#94A3B8'}
                />
                <Text
                  style={[
                    styles.categoryPillText,
                    isSelected ? styles.categoryPillTextActive : styles.categoryPillTextInactive,
                  ]}>
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* CAMPO 3: Valor / Monto Estimado */}
      <View style={styles.fieldGroup}>
        <View style={styles.labelRow}>
          <View style={styles.labelWithIcon}>
            <Text style={styles.dollarIcon}>$</Text>
            <Text style={styles.labelText}>Valor / Monto Estimado</Text>
          </View>
          <Text style={styles.labelHint}>Dólares Americanos</Text>
        </View>

        <View style={styles.amountInputContainer}>
          <View style={styles.currencyBadge}>
            <Text style={styles.currencySymbol}>$</Text>
            <Text style={styles.currencyCode}>USD</Text>
          </View>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            placeholderTextColor="#475569"
            keyboardType="decimal-pad"
            style={styles.amountInput}
          />
        </View>
      </View>

      {/* CAMPO 4: Nivel de Prioridad */}
      <View style={styles.fieldGroup}>
        <View style={styles.labelRow}>
          <View style={styles.labelWithIcon}>
            <Ionicons name="alert-circle-outline" size={16} color="#94A3B8" />
            <Text style={styles.labelText}>Nivel de Prioridad</Text>
          </View>
          <Text style={styles.labelHint}>Estándar</Text>
        </View>

        <View style={styles.prioritiesRow}>
          {PRIORITIES.map((pri) => {
            const isSelected = priority === pri.label;
            return (
              <Pressable
                key={pri.label}
                onPress={() => setPriority(pri.label)}
                style={[
                  styles.priorityOption,
                  isSelected ? styles.priorityOptionActive : styles.priorityOptionInactive,
                ]}>
                <View style={[styles.priorityDot, { backgroundColor: pri.dotColor }]} />
                <Text
                  style={[
                    styles.priorityOptionText,
                    isSelected && styles.priorityOptionTextActive,
                  ]}>
                  {pri.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* CAMPO 5: Notas o Descripción */}
      <View style={styles.fieldGroup}>
        <View style={styles.labelRow}>
          <View style={styles.labelWithIcon}>
            <Ionicons name="document-text-outline" size={16} color="#94A3B8" />
            <Text style={styles.labelText}>Notas o Descripción</Text>
          </View>
          {/* Contador de caracteres dinámico */}
          <Text style={styles.labelHint}>{notes.length} / 250</Text>
        </View>

        <View style={styles.textAreaContainer}>
          <TextInput
            value={notes}
            onChangeText={(text) => {
              if (text.length <= 250) setNotes(text);
            }}
            placeholder="Escribe detalles adicionales, contexto o especificaciones técnicas..."
            placeholderTextColor="#475569"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={styles.textArea}
          />
        </View>
      </View>

      {/* CAMPO 6: Tarjeta Interruptor de Recurrencia */}
      <View style={styles.switchCard}>
        <View style={styles.switchIconBox}>
          <Ionicons name="sync-outline" size={20} color="#38BDF8" />
        </View>
        <View style={styles.switchTextBox}>
          <Text style={styles.switchTitle}>Marcar como recurrente</Text>
          <Text style={styles.switchSubtitle}>Se renovará cada ciclo mensual</Text>
        </View>
        <Switch
          value={isRecurring}
          onValueChange={setIsRecurring}
          trackColor={{ false: '#262F44', true: '#6366F1' }}
          thumbColor={isRecurring ? '#FFFFFF' : '#94A3B8'}
        />
      </View>

      {/* ACCIONES: Botón Guardar + Cancelar */}
      <View style={styles.actionsContainer}>
        <Pressable
          onPress={handleSubmit}
          style={({ pressed }) => [styles.submitButton, pressed && styles.submitButtonPressed]}>
          <Text style={styles.submitButtonText}>Guardar Registro</Text>
          <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
        </Pressable>

        {onCancel && (
          <Pressable onPress={onCancel} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancelar y volver</Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  formScroll: {
    flex: 1,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 20,
  },
  fieldGroup: {
    gap: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dollarIcon: {
    color: '#38BDF8',
    fontSize: 16,
    fontWeight: '700',
  },
  labelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E2E8F0',
  },
  labelHint: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121622',
    borderWidth: 1,
    borderColor: '#1E2638',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
  },
  textInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
  },
  categoryScroll: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 2,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    gap: 8,
    borderWidth: 1,
  },
  categoryPillActive: {
    backgroundColor: '#6366F1',
    borderColor: '#818CF8',
  },
  categoryPillInactive: {
    backgroundColor: '#131722',
    borderColor: '#1E2638',
  },
  categoryPillText: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
  },
  categoryPillTextInactive: {
    color: '#94A3B8',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121622',
    borderWidth: 1,
    borderColor: '#1E2638',
    borderRadius: 14,
    paddingHorizontal: 10,
    height: 58,
    gap: 12,
  },
  currencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 3,
  },
  currencySymbol: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '700',
  },
  currencyCode: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '800',
  },
  amountInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  prioritiesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  priorityOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 7,
  },
  priorityOptionActive: {
    backgroundColor: '#1A2133',
    borderColor: '#38BDF8',
  },
  priorityOptionInactive: {
    backgroundColor: '#121622',
    borderColor: '#1E2638',
  },
  priorityDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  priorityOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
  },
  priorityOptionTextActive: {
    color: '#FFFFFF',
  },
  textAreaContainer: {
    backgroundColor: '#121622',
    borderWidth: 1,
    borderColor: '#1E2638',
    borderRadius: 14,
    padding: 14,
    minHeight: 110,
  },
  textArea: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
  },
  switchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131722',
    borderWidth: 1,
    borderColor: '#1E2638',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  switchIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchTextBox: {
    flex: 1,
    gap: 2,
  },
  switchTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  switchSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
  },
  actionsContainer: {
    marginTop: 8,
    gap: 14,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    height: 54,
    borderRadius: 16,
    gap: 10,
    // Estilos de elevación y sombra
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  submitButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  cancelButtonText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
  },
});
