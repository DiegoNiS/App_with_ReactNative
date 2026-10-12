import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  LocalDatabase,
  DATABASE_SCHEMAS,
} from '@/services/localDatabase';

/**
 * ============================================================================
 * VISOR DE TABLAS DE BASE DE DATOS LOCAL (INFORME UNIVERSITARIO)
 * ============================================================================
 * 
 * Permite a evaluadores e investigadores inspeccionar en tiempo real
 * la estructura relacional y los datos persistidos en AsyncStorage:
 * - Tabla 'courses': 5 registros iniciales
 * - Tabla 'evaluations': Registro histórico de notas añadidas
 * ============================================================================
 */

export interface DatabaseViewerModalProps {
  visible: boolean;
  onClose: () => void;
  onDatabaseReset?: () => void;
}

export const DatabaseViewerModal: React.FC<DatabaseViewerModalProps> = ({
  visible,
  onClose,
  onDatabaseReset,
}) => {
  const [selectedTable, setSelectedTable] = useState<'courses' | 'evaluations'>('courses');
  const [viewMode, setViewMode] = useState<'table' | 'json'>('table');
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchTableData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await LocalDatabase.getTableRows(selectedTable);
      setRows(data);
    } catch (e) {
      console.warn('Error cargando tabla:', e);
    } finally {
      setLoading(false);
    }
  }, [selectedTable]);

  useEffect(() => {
    if (visible) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchTableData();
    }
  }, [visible, fetchTableData]);

  const handleReset = () => {
    Alert.alert(
      'Restablecer Base de Datos',
      '¿Deseas restaurar todas las tablas a los datos originales de fábrica?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Restablecer',
          style: 'destructive',
          onPress: async () => {
            await LocalDatabase.resetDatabase();
            await fetchTableData();
            if (onDatabaseReset) onDatabaseReset();
          },
        },
      ]
    );
  };

  const schema = DATABASE_SCHEMAS[selectedTable];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.modalContainer} edges={['top', 'left', 'right']}>
        {/* Cabecera del Inspector */}
        <View style={styles.headerBar}>
          <View style={styles.headerTitleGroup}>
            <View style={styles.dbIconBadge}>
              <Ionicons name="server" size={16} color="#38BDF8" />
            </View>
            <View>
              <Text style={styles.headerTitle}>Base de Datos Local</Text>
              <Text style={styles.headerSub}>Motor Relacional AsyncStorage</Text>
            </View>
          </View>

          <TouchableOpacity activeOpacity={0.7} onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Selector de Tablas */}
        <View style={styles.tableSelectorRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setSelectedTable('courses')}
            style={[
              styles.tableTabBtn,
              selectedTable === 'courses' && styles.tableTabBtnActive,
            ]}>
            <Ionicons
              name="grid-outline"
              size={15}
              color={selectedTable === 'courses' ? '#FFFFFF' : '#94A3B8'}
            />
            <Text
              style={[
                styles.tableTabLabel,
                selectedTable === 'courses' && styles.tableTabLabelActive,
              ]}>
              courses
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setSelectedTable('evaluations')}
            style={[
              styles.tableTabBtn,
              selectedTable === 'evaluations' && styles.tableTabBtnActive,
            ]}>
            <Ionicons
              name="list-outline"
              size={15}
              color={selectedTable === 'evaluations' ? '#FFFFFF' : '#94A3B8'}
            />
            <Text
              style={[
                styles.tableTabLabel,
                selectedTable === 'evaluations' && styles.tableTabLabelActive,
              ]}>
              evaluations
            </Text>
          </TouchableOpacity>
        </View>

        {/* Descripción del Esquema */}
        <View style={styles.schemaCard}>
          <View style={styles.schemaMetaRow}>
            <Text style={styles.schemaHeading}>{schema.label}</Text>
            <View style={styles.recordsCountBadge}>
              <Text style={styles.recordsCountText}>{rows.length} registros</Text>
            </View>
          </View>
          <Text style={styles.schemaDescText}>{schema.description}</Text>

          {/* Columnas del Esquema */}
          <View style={styles.columnsList}>
            {schema.columns.map((col) => (
              <View key={col.name} style={styles.columnPill}>
                <Text style={styles.columnNameText}>
                  {col.name}
                  {col.isPrimary && ' 🔑'}
                  {col.isForeign && ' 🔗'}
                </Text>
                <Text style={styles.columnTypeText}>{col.type}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Alternador de Vista (Tabla vs JSON crudo) */}
        <View style={styles.viewModeRow}>
          <View style={styles.viewModeToggleBox}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setViewMode('table')}
              style={[
                styles.modeOptionBtn,
                viewMode === 'table' && styles.modeOptionBtnActive,
              ]}>
              <Text
                style={[
                  styles.modeOptionLabel,
                  viewMode === 'table' && styles.modeOptionLabelActive,
                ]}>
                Vista Grilla
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setViewMode('json')}
              style={[
                styles.modeOptionBtn,
                viewMode === 'json' && styles.modeOptionBtnActive,
              ]}>
              <Text
                style={[
                  styles.modeOptionLabel,
                  viewMode === 'json' && styles.modeOptionLabelActive,
                ]}>
                JSON Crudo
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity activeOpacity={0.7} onPress={handleReset} style={styles.resetDbBtn}>
            <Ionicons name="refresh-outline" size={14} color="#F87171" />
            <Text style={styles.resetDbBtnText}>Reset BD</Text>
          </TouchableOpacity>
        </View>

        {/* Visualización de Datos */}
        {loading ? (
          <View style={styles.centerLoading}>
            <Text style={styles.loadingText}>Cargando registros...</Text>
          </View>
        ) : viewMode === 'table' ? (
          <ScrollView style={styles.tableScroll} showsVerticalScrollIndicator={false}>
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
              <View style={styles.dataTableWrapper}>
                {/* Cabecera de la Grilla */}
                <View style={styles.dataTableHeaderRow}>
                  {schema.columns.map((col) => (
                    <Text key={col.name} style={styles.dataTableHeaderCell}>
                      {col.name}
                    </Text>
                  ))}
                </View>

                {/* Filas de la Grilla */}
                {rows.map((row, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.dataTableRow,
                      idx % 2 === 0 ? styles.dataTableRowEven : styles.dataTableRowOdd,
                    ]}>
                    {schema.columns.map((col) => (
                      <Text
                        key={col.name}
                        style={[
                          styles.dataTableCell,
                          col.isPrimary && styles.dataTableCellPrimary,
                        ]}
                        numberOfLines={1}>
                        {String(row[col.name] ?? '-')}
                      </Text>
                    ))}
                  </View>
                ))}
              </View>
            </ScrollView>
          </ScrollView>
        ) : (
          <ScrollView style={styles.jsonScrollView}>
            <View style={styles.jsonCard}>
              <Text style={styles.jsonCodeText}>
                {JSON.stringify(rows, null, 2)}
              </Text>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#070A12',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E273D',
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dbIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSub: {
    fontSize: 11,
    color: '#94A3B8',
  },
  closeBtn: {
    padding: 6,
    backgroundColor: '#161B2E',
    borderRadius: 16,
  },
  tableSelectorRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  tableTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#121726',
    borderWidth: 1,
    borderColor: '#1F293D',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  tableTabBtnActive: {
    backgroundColor: '#6366F1',
    borderColor: '#818CF8',
  },
  tableTabLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94A3B8',
  },
  tableTabLabelActive: {
    color: '#FFFFFF',
  },
  schemaCard: {
    backgroundColor: '#121726',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1F293D',
    padding: 12,
    marginTop: 12,
    gap: 8,
  },
  schemaMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  schemaHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#38BDF8',
  },
  recordsCountBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  recordsCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#38BDF8',
  },
  schemaDescText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  columnsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  columnPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#192236',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  columnNameText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E2E8F0',
  },
  columnTypeText: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '600',
  },
  viewModeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 8,
  },
  viewModeToggleBox: {
    flexDirection: 'row',
    backgroundColor: '#121726',
    borderRadius: 10,
    padding: 2,
    borderWidth: 1,
    borderColor: '#1F293D',
  },
  modeOptionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  modeOptionBtnActive: {
    backgroundColor: '#38BDF8',
  },
  modeOptionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  modeOptionLabelActive: {
    color: '#070A12',
    fontWeight: '800',
  },
  resetDbBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  resetDbBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F87171',
  },
  centerLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 13,
    color: '#94A3B8',
  },
  tableScroll: {
    flex: 1,
  },
  dataTableWrapper: {
    backgroundColor: '#121726',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1F293D',
    overflow: 'hidden',
  },
  dataTableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#192236',
    borderBottomWidth: 1,
    borderBottomColor: '#26314D',
    paddingVertical: 10,
  },
  dataTableHeaderCell: {
    width: 120,
    paddingHorizontal: 10,
    fontSize: 11,
    fontWeight: '800',
    color: '#38BDF8',
    textTransform: 'uppercase',
  },
  dataTableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1A2236',
  },
  dataTableRowEven: {
    backgroundColor: '#121726',
  },
  dataTableRowOdd: {
    backgroundColor: '#0F1422',
  },
  dataTableCell: {
    width: 120,
    paddingHorizontal: 10,
    fontSize: 12,
    color: '#CBD5E1',
  },
  dataTableCellPrimary: {
    fontWeight: '800',
    color: '#A78BFA',
  },
  jsonScrollView: {
    flex: 1,
  },
  jsonCard: {
    backgroundColor: '#121726',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1F293D',
    padding: 12,
  },
  jsonCodeText: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#38BDF8',
    lineHeight: 16,
  },
});
