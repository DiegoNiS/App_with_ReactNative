import React from 'react';
import { View, Text, StyleSheet, Pressable, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * ============================================================================
 * DOCUMENTACIÓN DE WIDGETS PRINCIPALES (EVALUACIÓN DE LABORATORIO)
 * ============================================================================
 * 
 * 1. <View>:
 *    - Se utiliza para posicionar el botón flotante (FAB) de manera fija respecto
 *      a la pantalla mediante 'position: absolute', 'bottom' y 'right'.
 *    - Implementa sombras complejas en iOS ('shadowColor', 'shadowOffset', 'shadowOpacity')
 *      y 'elevation' en Android para dar efecto de elevación por encima de la lista.
 *    - Contenedor circular con 'borderRadius' igual a la mitad del tamaño ('width/2')
 *      que centra el icono y/o texto con 'justifyContent: center' y 'alignItems: center'.
 * 
 * 2. <Text>:
 *    - Permite renderizar texto opcional de acción ('Nuevo', 'Agregar') al lado del icono
 *      si se utiliza como Extended FAB.
 * ============================================================================
 */

export interface FloatingButtonProps {
  onPress: () => void;
  iconName?: keyof typeof Ionicons.glyphMap;
  label?: string;
  style?: StyleProp<ViewStyle>;
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({
  onPress,
  iconName = 'add',
  label,
  style,
}) => {
  return (
    // <View> Contenedor posicionado con elevación
    <View style={[styles.fabContainer, style]}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.buttonBody,
          label ? styles.extendedButton : styles.circularButton,
          pressed && styles.buttonPressed,
        ]}>
        <Ionicons name={iconName} size={24} color="#FFFFFF" />
        {label && <Text style={styles.buttonLabel}>{label}</Text>}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    zIndex: 99,
    // Sombra para iOS
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    // Sombra para Android
    elevation: 8,
  },
  buttonBody: {
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: '#38BDF8',
  },
  circularButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  extendedButton: {
    height: 52,
    paddingHorizontal: 20,
    borderRadius: 26,
    gap: 8,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
  buttonLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
