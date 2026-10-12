# 🎓 Gradvia - Sistema Académico de Seguimiento de Notas en React Native & Expo

> **Informe Técnico Universitario y Manual de Arquitectura**  
> **Autor / Estudiante:** Diego NiS  
> **Tecnologías:** React Native, Expo SDK 57, TypeScript, AsyncStorage (BD Local), Flexbox.  
> **Repositorio Oficial:** [https://github.com/DiegoNiS/App_with_ReactNative.git](https://github.com/DiegoNiS/App_with_ReactNative.git)

---

## 📋 1. Resumen Ejecutivo del Proyecto

**Gradvia** es una aplicación móvil académica de alto rendimiento diseñada para estudiantes universitarios. Permite gestionar asignaturas matriculadas, registrar evaluaciones con ponderación porcentual y visualizar en tiempo real el cálculo reactivo del **Promedio Ponderado Semestral (GPA)** y el avance curricular.

La aplicación consta de **dos pantallas principales interconectadas**:
1. **Dashboard de Calificaciones:** Tablero central con KPIs del ciclo, indicador circular de avance del semestre, desglose de créditos, filtros horizontales y tarjetas de cursos con barras de progreso curricular.
2. **Formulario de Registro de Calificaciones:** Formulario con selección de asignatura auto-ponderada, categorías de evaluación, escala vigesimal (0 a 20), simulación viva en tiempo real del impacto en el promedio y persistencia en una **Base de Datos Local**.
3. **Visor / Inspector de Tablas de BD Integrado:** Modal interactivo dentro de la app para auditar las tablas relacionales (`courses` y `evaluations`) en modo grilla y JSON crudo.

---

## 🎨 2. Descripción Visual y Funcional de las Pantallas

### 2.1 Pantalla 1: Dashboard de Notas (`DashboardScreen.tsx`)
* **Barra de Navegación Superior:**
  * Logo de Gradvia con birrete cian, badge del ciclo activo (`2025-1`) y subtítulo de módulo.
  * Botón para abrir el **Visor de Base de Datos Local** (`server-outline`), campana de notificaciones y avatar de estudiante.
* **Saludo y Racha:**
  * Titular dinámico: *"Hola, Mateo 👋"* con subtítulo *"● Semestre 2025-1 · 5to Ciclo"*.
  * Píldora de racha académica: *"🔥 Racha 14 días"*.
* **Tarjeta de Rendimiento Semestral (KPI Principal):**
  * **Anillo circular concéntrico:** Muestra *"68% Semana 11/16"* del ciclo universitario.
  * **Promedio Ponderado Reactivo:** Muestra la nota general en escala vigesimal (ej. **17.4 / 20**) con conversión a GPA (ej. `GPA 3.8`).
  * **Carga Lectiva:** Total de créditos matriculados (ej. `22 Créditos`).
  * **Fila de Estados:** Indicadores de cursos aprobando (`✔ 5 Aprobando`), en riesgo (`🛡 0 En Riesgo`) y próximas entregas (`⏱ 2 días Próx. Entrega`).
* **Carril de Filtros Horizontales:**
  * Píldoras con scroll horizontal: *"Todos los Cursos (5)"*, *"En curso"*, *"Laboratorios"*.
* **Lista Dinámica de Cursos Matriculados:**
  * Cada tarjeta presenta: Código (`CC301`, `FS202`, etc.), área (`Ciencias de la Computación`), calificación destacada con color temático (cian o violeta), porcentaje de logro, docente a cargo y barra de avance de evaluaciones.
* **Banner de Próxima Entrega:**
  * Recordatorio de entrega de sprint en tiempo límite.
* **Botón de Acción Rápida (+ Registrar Nota):**
  * Botón táctil que transiciona fluidamente hacia el formulario de ingreso de notas.
* **Barra Inferior (Dock):**
  * Accesos rápidos para *Dashboard*, *Horario*, botón central elevado de *Calificaciones* y *Perfil*.

---

### 2.2 Pantalla 2: Formulario de Nueva Calificación (`RecordGradeForm.tsx`)
* **Cabecera de Acción:**
  * Botón de retroceso `←`, título *"Nuevo Registro Calificación"*, botón `✕ Cancelar` y tag `● NUEVA NOTA`.
* **Asignatura Destino:**
  * Selector desplegable que muestra el curso activo con badge *"✨ Auto-ponderado"*, código y promedio actual.
* **Nombre de la Evaluación:**
  * Entrada `<TextInput>` controlada con icono de portapapeles y botón de dictado (ej. *"Laboratorio 3 - Árboles AVL"*).
* **Tipo de Evaluación:**
  * Selector mediante chips interactivos: `Parcial`, `Tarea / Lab`, `Proyecto` y `Quiz`.
* **Ponderación / Peso (%):**
  * Entrada numérica con badge de peso restante (ej. `Restante: 35%`), botones de ajuste rápido (`10%`, `15%`, `20%`) y barra de acumulación gráfica (`65% previo` vs `80% con esta nota`).
* **Calificación Obtenida:**
  * Selector de escala (`0 - 20` vs `0 - 100`), entrada en texto gigante (`19.0 / 20`) y tarjeta dinámica de estado (*Sobresaliente - Aprobado + Alto*).
* **Simulación Viva ("Impacto en el Semestre"):**
  * **Cálculo Reactivo en Tiempo Real:** Mientras el usuario escribe la nota y el peso, el componente calcula al instante:
    $$\text{Promedio Actual (18.2)} \longrightarrow \text{Nuevo Estimado (18.35)} \quad [\mathbf{+0.15}]$$
* **Fecha y Feedback:**
  * Fecha de publicación y área de texto multilínea para comentarios del docente.
* **Botones de Guardado:**
  * Botón principal con gradiente `Guardar Calificación` y botón `Descartar Cambios`.

---

## 🗄 3. Base de Datos Local y Visor de Tablas (`DatabaseViewerModal.tsx`)

Para cumplir con los estándares de persistencia local y evaluación en laboratorio, se integró un motor relacional implementado en `AsyncStorage` ([src/services/localDatabase.ts](file:///e:/MyProjects/My_App/src/services/localDatabase.ts)):

### 3.1 Esquema de la Base de Datos

#### Tabla: `courses` (Asignaturas)
| Campo | Tipo | Clave | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | STRING | 🔑 Primary Key | Código único del curso (ej. `CC301`) |
| `code` | STRING | - | Código oficial de la materia |
| `name` | STRING | - | Nombre completo de la asignatura |
| `department` | STRING | - | Departamento o facultad académica |
| `credits` | NUMBER | - | Créditos académicos ponderables |
| `currentGrade` | NUMBER | - | Promedio actual calculado (0 - 20) |

#### Tabla: `evaluations` (Calificaciones)
| Campo | Tipo | Clave | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | STRING | 🔑 Primary Key | Identificador único de evaluación (`ev-xxx`) |
| `courseId` | STRING | 🔗 Foreign Key | Referencia al curso (`courses.id`) |
| `title` | STRING | - | Nombre de la práctica, lab o examen |
| `category` | STRING | - | Categoría (`Parcial`, `Tarea / Lab`, etc.) |
| `weight` | NUMBER | - | Peso porcentual asignado |
| `score` | NUMBER | - | Calificación obtenida (escala 0 - 20) |
| `date` | STRING | - | Fecha de registro |

### 3.2 Inspector de Base de Datos en la Aplicación
* Haciendo clic en el icono de base de datos (`server-outline`) en la cabecera del Dashboard, se despliega el modal inspector:
  * **Pestaña `courses`:** Visualiza todas las asignaturas y sus notas promedio.
  * **Pestaña `evaluations`:** Visualiza cada evaluación agregada persistentemente.
  * **Modo Vista Grilla:** Tabla renderizada con cabeceras y filas alternadas.
  * **Modo JSON Crudo:** Permite auditar el estado del almacenamiento en formato JSON estructurado.
  * **Botón `Reset BD`:** Restaura la base de datos a sus valores semilla iniciales.

---

## 🧩 4. Documentación de Widgets Nativos y Flexbox (Evaluación de Laboratorio)

| Componente Nativo | Función en el Framework | Manejo de Layout con Flexbox |
| :--- | :--- | :--- |
| **`<View>`** | Contenedor de estructuración básico (equivalente a `<div>`). Es el bloque de construcción primario para tarjetas, filas y contenedores. | **`flexDirection`**: En React Native es `'column'` por defecto; se especifica `'row'` para distribuir hijos horizontalmente.<br>**`justifyContent`**: Distribuye a lo largo del eje principal (`'space-between'`, `'center'`).<br>**`alignItems`**: Alinea en el eje transversal (`'center'`, `'stretch'`).<br>**`flex: 1`**: Hace que el contenedor consuma todo el espacio disponible. |
| **`<Text>`** | Widget primitivo obligatorio para renderizar cualquier carácter alfanumérico. No se permite texto suelto en `<View>`. | Soporta estilos tipográficos (`fontSize`, `fontWeight`), colores HSL/Hex, herencia de estilos anidados y truncado con `numberOfLines={1}` con elipsis para evitar desbordamientos visuales. |
| **`<ScrollView>`** | Contenedor desplazable que habilita scroll vertical u horizontal. | **`contentContainerStyle`**: Aplica relleno y alineación al lienzo interno desplazable sin afectar el marco exterior.<br>**`horizontal={true}`**: Crea listas deslizables horizontales para los chips de filtro.<br>**`keyboardShouldPersistTaps="handled"`**: Asegura que tocar botones con el teclado abierto dispare la acción de inmediato. |
| **`<TextInput>`** | Componente nativo para captura de datos desde el teclado virtual. | Opera bajo el patrón **Controlled Component** enlazado al hook `useState` (`value` y `onChangeText`). Soporta `keyboardType="decimal-pad"` para notas numéricas y `multiline={true}` para feedback del docente. |
| **`<TouchableOpacity>`** | Envoltorio interactivo para botones y elementos clicables. | Aplica retroalimentación háptica y visual disminuyendo la opacidad al pulsar (`activeOpacity={0.7}`) sin sobrecargar el hilo de UI. |

---

## 📐 5. Fórmula Matemática del Promedio Ponderado Semestral

El promedio general mostrado en el Dashboard es calculado reactivamente mediante la fórmula de media ponderada por créditos:

$$\text{Promedio Ponderado} = \frac{\sum_{i=1}^{n} (\text{Nota}_i \times \text{Créditos}_i)}{\sum_{i=1}^{n} \text{Créditos}_i}$$

Con los datos semilla iniciales:
$$\frac{(18.2 \times 5) + (16.5 \times 4) + (17.0 \times 4) + (15.8 \times 4) + (19.0 \times 5)}{5 + 4 + 4 + 4 + 5} = \frac{383.2}{22} \approx \mathbf{17.4}$$

Al ingresar una nueva nota en el formulario, se actualiza el promedio de la materia seleccionada y la función despachadora reactiva recalcula el promedio ponderado global en tiempo real.

---

## 🚀 6. Guía de Ejecución y Pruebas Locales

### Requisitos Previos
* Node.js v18 o superior.
* Dispositivo móvil con la aplicación **Expo Go** (Android/iOS) o navegador web moderno.

### Instalación y Ejecución
```bash
# 1. Clonar el repositorio
git clone https://github.com/DiegoNiS/App_with_ReactNative.git
cd App_with_ReactNative

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo Expo
npx expo start

# Para abrir en el navegador web:
# Presionar 'w' en la terminal o ejecutar:
npx expo start --web
```

---

## 🤖 7. Prompt para Pasar a Otra IA y Probar la Aplicación

Puedes copiar y pegar este bloque directamente en cualquier IA (ChatGPT, Claude, Gemini, etc.) para que analice, valide o genere pruebas sobre el proyecto:

```text
Actúa como un Desarrollador Senior de Calidad (QA) y Arquitecto en React Native y TypeScript.
Revisa el proyecto 'Gradvia' disponible en el repositorio https://github.com/DiegoNiS/App_with_ReactNative.git

La aplicación cumple con los siguientes requerimientos:
1. Pantalla 1 (DashboardScreen.tsx): Muestra el tablero académico con saludo, tarjeta de rendimiento semestral con Promedio Ponderado reactivo (escala 0-20), gráfico circular del semestre, filtros horizontales y tarjetas dinámicas de cursos con avances curriculares.
2. Pantalla 2 (RecordGradeForm.tsx): Permite registrar una nueva evaluación con asignatura destino, peso porcentual, nota obtenida, simulación en vivo del impacto en el promedio y feedback del profesor.
3. Base de Datos Local: Persistencia local con AsyncStorage mediante las tablas relacionales 'courses' y 'evaluations', incluyendo un modal inspector de base de datos (DatabaseViewerModal.tsx) para auditar los registros en modo grilla o JSON crudo.
4. Componentes Nativos requeridos: <View>, <Text>, <ScrollView>, <TextInput> y <TouchableOpacity> con maquetación estricta en Flexbox.
5. Manejo de estado: React Hooks (useState, useMemo, useEffect) con cálculo dinámico del promedio ponderado: Suma(Nota * Creditos) / Suma(Creditos).

Por favor, realiza un análisis de la arquitectura del código, verifica la robustez del tipado con TypeScript y propón 3 casos de prueba unitarios (con Jest/React Native Testing Library) para validar que al agregar una nueva evaluación, el promedio ponderado se recalcula correctamente.
```
