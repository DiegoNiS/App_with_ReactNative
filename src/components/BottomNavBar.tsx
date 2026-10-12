import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * ============================================================================
 * DOCUMENTACIÓN DE WIDGETS PRINCIPALES (EVALUACIÓN DE LABORATORIO)
 * ============================================================================
 * 
 * 1. <View>:
 *    - Se encarga de construir la barra de navegación persistente inferior.
 *    - Utiliza 'flexDirection: row', 'justifyContent: space-around' y 'alignItems: center'
 *      para distribuir equitativamente los 4 botones de acceso rápido.
 *    - Posee un borde superior 'borderTopWidth' y color de fondo oscuro a juego con la app.
 * 
 * 2. <Text>:
 *    - Renderiza las etiquetas de navegación bajo cada icono.
 *    - Aplica color dinámico (activo vs inactivo) para retroalimentar la pantalla actual.
 * ============================================================================
 */

export type TabType = 'dashboard' | 'nuevo' | 'actividad' | 'perfil';

export interface BottomNavBarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentTab, onSelectTab }) => {
  const tabs: { key: TabType; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: 'home-outline' },
    { key: 'nuevo', label: 'Nuevo', icon: 'add-circle-outline' },
    { key: 'actividad', label: 'Actividad', icon: 'bar-chart-outline' },
    { key: 'perfil', label: 'Perfil', icon: 'person-outline' },
  ];

  return (
    <View style={styles.navContainer}>
      {tabs.map((tab) => {
        const isActive = currentTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onSelectTab(tab.key)}
            style={styles.tabButton}>
            <Ionicons
              name={tab.icon}
              size={22}
              color={isActive ? '#38BDF8' : '#64748B'}
            />
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#0B0E17',
    borderTopWidth: 1,
    borderTopColor: '#1A202E',
    paddingTop: 10,
    paddingBottom: 22,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 12,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 12,
  },
  tabLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#38BDF8',
    fontWeight: '700',
  },
});
