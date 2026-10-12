import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * ============================================================================
 * DOCUMENTACIÓN DE WIDGETS PRINCIPALES (EVALUACIÓN DE LABORATORIO)
 * ============================================================================
 * 
 * 1. <View>:
 *    - Es el contenedor de bloques fundamental en React Native (análogo a un <div> en HTML).
 *    - En React Native, todo <View> utiliza Flexbox de manera predeterminada con
 *      orientación 'column' (eje vertical principal).
 *    - Se emplea para estructurar maquetados, definir espaciados (padding/margin),
 *      diseñar filas de elementos ('flexDirection: row') y delimitar bordes y fondos.
 * 
 * 2. <Text>:
 *    - Es el componente elemental para renderizar cadenas de texto en pantalla.
 *    - REGLA ESENCIAL: En React Native NO se puede renderizar texto sin envolverlo
 *      en <Text> (hacerlo provoca error de compilación/ejecución).
 *    - Soporta tipografía enriquecida, anidación de estilos y propiedades como
 *      'numberOfLines' y 'ellipsizeMode'.
 * ============================================================================
 */

export interface HeaderProps {
  appName?: string;
  badgeLeft?: string;
  badgeRight?: string;
  title: string;
  subtitle?: string;
  onAvatarPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  appName = 'Nova',
  badgeLeft = 'CREACIÓN RÁPIDA',
  badgeRight = 'v2.4 Live Sync',
  title,
  subtitle,
  onAvatarPress,
}) => {
  return (
    // <View> utilizado como contenedor principal del encabezado
    <View style={styles.container}>
      {/* Barra superior: Logo + Nombre de App a la izquierda, Avatar a la derecha */}
      <View style={styles.topBar}>
        <View style={styles.brandContainer}>
          {/* Icono de logo representativo de Nova */}
          <View style={styles.logoCircle}>
            <View style={styles.logoInnerDot} />
          </View>
          {/* <Text> para renderizar el nombre de la marca */}
          <Text style={styles.appName}>{appName}</Text>
        </View>

        {/* Avatar del usuario con borde redondeado e interacción táctil */}
        <Pressable onPress={onAvatarPress} style={styles.avatarButton}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
            }}
            style={styles.avatarImage}
          />
        </Pressable>
      </View>

      {/* Fila de Insignias / Badges informativos */}
      <View style={styles.badgesRow}>
        {/* Badge izquierdo: Píldora de estado con indicador luminoso */}
        {badgeLeft && (
          <View style={styles.badgeLeft}>
            <View style={styles.activeDot} />
            <Text style={styles.badgeLeftText}>{badgeLeft}</Text>
          </View>
        )}

        {/* Badge derecho: Indicador de sincronización en vivo */}
        {badgeRight && (
          <View style={styles.badgeRight}>
            <Ionicons name="flash" size={13} color="#A78BFA" style={styles.badgeIcon} />
            <Text style={styles.badgeRightText}>{badgeRight}</Text>
          </View>
        )}
      </View>

      {/* Sección del Título y Subtítulo */}
      <View style={styles.titleSection}>
        <Text style={styles.titleText}>{title}</Text>
        {subtitle && <Text style={styles.subtitleText}>{subtitle}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#38BDF8',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
  },
  logoInnerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#38BDF8',
  },
  appName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  avatarButton: {
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  badgeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(14, 165, 233, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 7,
  },
  activeDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#38BDF8',
  },
  badgeLeftText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  badgeRight: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  badgeIcon: {
    marginRight: 2,
  },
  badgeRightText: {
    color: '#C4B5FD',
    fontSize: 12,
    fontWeight: '600',
  },
  titleSection: {
    gap: 6,
  },
  titleText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  subtitleText: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
    fontWeight: '400',
  },
});
