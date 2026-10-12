/**
 * Definición de tipos de datos para los registros del sistema "Nova".
 * Arquitectura basada en TypeScript estricto para garantizar seguridad de tipos.
 */

export type CategoryType = 'Tecnología' | 'Diseño' | 'Finanzas' | 'Operaciones';

export type PriorityType = 'Normal' | 'Prioritario' | 'Urgente';

export interface RecordItem {
  id: string;
  title: string;
  category: CategoryType;
  amount: number;
  priority: PriorityType;
  notes?: string;
  isRecurring: boolean;
  createdAt: string;
}

export interface NewRecordFormData {
  title: string;
  category: CategoryType;
  amount: string;
  priority: PriorityType;
  notes: string;
  isRecurring: boolean;
}
