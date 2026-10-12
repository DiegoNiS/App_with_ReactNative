import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RecordItem, CategoryType, PriorityType } from '@/types/record';

/**
 * ============================================================================
 * DOCUMENTACIÓN DE WIDGETS PRINCIPALES (EVALUACIÓN DE LABORATORIO)
 * ============================================================================
 * 
 * 1. <View>:
 *    - Actúa como la tarjeta estructural (card wrapper) y agrupa los submódulos:
 *      cabecera de tarjeta, cuerpo informativo, badges y pie de tarjeta.
 *    - Utiliza 'borderRadius', 'borderWidth' y 'backgroundColor' para crear un
 *      diseño tipo superficie oscura (Dark Surface) con elevación visual.
 *    - Permite alinear el monto a la derecha y los badges en fila mediante Flexbox.
 * 
 * 2. <Text>:
 *    - Se encarga de mostrar la jerarquía visual de los datos:
 *      título en negrita (bold), categoría en chip estilizado, monto con contraste,
 *      y notas con estilo atenuado ('#94A3B8').
 *    - Emplea 'numberOfLines' para evitar desbordamientos de texto en pantallas pequeñas.
 * ============================================================================
 */

export interface CustomCardProps {
  item: RecordItem;
  onPress?: (item: RecordItem) => void;
  onDelete?: (id: string) => void;
}

// Configuración de colores e iconos por categoría
const CATEGORY_META: Record<
  CategoryType,
  { icon: keyof typeof Ionicons.glyphMap; color: string; bg: string }
> = {
  Tecnología: {
    icon: 'hardware-chip-outline',
    color: '#818CF8',
    bg: 'rgba(99, 102, 241, 0.15)',
  },
  Diseño: {
    icon: 'color-palette-outline',
    color: '#F472B6',
    bg: 'rgba(244, 114, 182, 0.15)',
  },
  Finanzas: {
    icon: 'wallet-outline',
    color: '#34D399',
    bg: 'rgba(52, 211, 153, 0.15)',
  },
  Operaciones: {
    icon: 'git-network-outline',
    color: '#FBBF24',
    bg: 'rgba(251, 191, 36, 0.15)',
  },
};

// Configuración de puntos de prioridad
const PRIORITY_META: Record<PriorityType, { dotColor: string; label: string }> = {
  Normal: { dotColor: '#06B6D4', label: 'Normal' },
  Prioritario: { dotColor: '#A855F7', label: 'Prioritario' },
  Urgente: { dotColor: '#EF4444', label: 'Urgente' },
};

export const CustomCard: React.FC<CustomCardProps> = ({ item, onPress, onDelete }) => {
  const categoryMeta = CATEGORY_META[item.category] || CATEGORY_META['Tecnología'];
  const priorityMeta = PRIORITY_META[item.priority] || PRIORITY_META['Normal'];

  return (
    // <View> Contenedor de la tarjeta con estilo 'card'
    <View style={styles.cardContainer}>
      <Pressable
        onPress={() => onPress && onPress(item)}
        style={({ pressed }) => [styles.pressableArea, pressed && styles.cardPressed]}>
        
        {/* Cabecera de la tarjeta: Categoría + Prioridad a la izquierda, Monto a la derecha */}
        <View style={styles.cardHeader}>
          <View style={styles.badgesGroup}>
            {/* Chip de Categoría */}
            <View style={[styles.categoryChip, { backgroundColor: categoryMeta.bg }]}>
              <Ionicons name={categoryMeta.icon} size={14} color={categoryMeta.color} />
              <Text style={[styles.categoryText, { color: categoryMeta.color }]}>
                {item.category}
              </Text>
            </View>

            {/* Badge de Prioridad */}
            <View style={styles.priorityPill}>
              <View style={[styles.priorityDot, { backgroundColor: priorityMeta.dotColor }]} />
              <Text style={styles.priorityText}>{priorityMeta.label}</Text>
            </View>
          </View>

          {/* Monto monetario formateado */}
          <View style={styles.amountContainer}>
            <Text style={styles.amountCurrency}>$</Text>
            <Text style={styles.amountValue}>{item.amount.toFixed(2)}</Text>
            <Text style={styles.amountCode}>USD</Text>
          </View>
        </View>

        {/* Título principal del elemento */}
        <Text style={styles.titleText} numberOfLines={2}>
          {item.title}
        </Text>

        {/* Notas o descripción opcional */}
        {item.notes ? (
          <Text style={styles.notesText} numberOfLines={2}>
            {item.notes}
          </Text>
        ) : null}

        {/* Pie de tarjeta: Indicador de recurrencia y botón de eliminación */}
        <View style={styles.cardFooter}>
          {item.isRecurring ? (
            <View style={styles.recurringTag}>
              <Ionicons name="repeat-outline" size={14} color="#38BDF8" />
              <Text style={styles.recurringText}>Recurrente mensual</Text>
            </View>
          ) : (
            <View style={styles.oneTimeTag}>
              <Ionicons name="checkmark-done-outline" size={13} color="#94A3B8" />
              <Text style={styles.oneTimeText}>Pago único</Text>
            </View>
          )}

          {onDelete && (
            <Pressable
              onPress={() => onDelete(item.id)}
              hitSlop={8}
              style={({ pressed }) => [styles.deleteBtn, pressed && styles.deleteBtnPressed]}>
              <Ionicons name="trash-outline" size={16} color="#F87171" />
            </Pressable>
          )}
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#131722',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#212838',
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  pressableArea: {
    padding: 16,
  },
  cardPressed: {
    opacity: 0.85,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  badgesGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 5,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
  },
  priorityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A202E',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 5,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  priorityText: {
    fontSize: 11,
    color: '#CBD5E1',
    fontWeight: '500',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
  },
  amountCurrency: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
    marginRight: 2,
  },
  amountValue: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  amountCode: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 3,
  },
  titleText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  notesText: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 18,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  recurringTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  recurringText: {
    fontSize: 12,
    color: '#38BDF8',
    fontWeight: '600',
  },
  oneTimeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  oneTimeText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  deleteBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  deleteBtnPressed: {
    backgroundColor: 'rgba(239, 68, 68, 0.25)',
  },
});
