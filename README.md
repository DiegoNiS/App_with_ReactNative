# 🎓 Gradvia - Aplicación Universitaria en React Native & Expo

Aplicación móvil de gestión académica y seguimiento de calificaciones desarrollada con **React Native**, **Expo SDK 57** y **TypeScript**.

Repositorio Oficial: [https://github.com/DiegoNiS/App_with_ReactNative.git](https://github.com/DiegoNiS/App_with_ReactNative.git)

---

## 🌟 Características Principales

* **Dashboard Académico:** KPIs semestrales, cálculo dinámico de **Promedio Ponderado (GPA)**, porcentaje de avance, carga lectiva (créditos) y tarjetas de cursos con barras de progreso curricular.
* **Formulario de Registro:** Registro de nuevas evaluaciones con ponderación porcentual, cálculo en vivo de impacto en el promedio y feedback del profesor.
* **Base de Datos Local y Visor de Tablas:** Persistencia con `AsyncStorage` mediante tablas relacionales (`courses` y `evaluations`) con modal integrado para auditar la base de datos en modo grilla y JSON crudo.
* **Componentes Nativos:** Implementación estricta de `<View>`, `<Text>`, `<ScrollView>`, `<TextInput>` y `<TouchableOpacity>` con maquetación completa en **Flexbox**.
* **Tipado Estricto:** 100% TypeScript con interfaces robustas y 0 advertencias de linter.

---

## 📖 Informe Técnico Completo

Consulta el documento [INFORME_GRADVIA.md](./INFORME_GRADVIA.md) para acceder a:
* Desglose visual de cada pantalla y componentes.
* Documentación detallada de widgets y diseño Flexbox.
* Fórmulas matemáticas de cálculo del promedio ponderado.
* Esquema relacional de la Base de Datos Local.
* Prompt especializado para pruebas con Inteligencia Artificial.

---

## 🚀 Cómo Ejecutar el Proyecto

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar el servidor Expo
npx expo start

# 3. Para probar en la web:
npx expo start --web
```
