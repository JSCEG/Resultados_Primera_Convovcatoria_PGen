# Guía de Uso - Sistema de Análisis de Áreas

## 📱 Interfaz Principal

La aplicación usa una interfaz móvil centralizada con un menú flotante que controla todas las funcionalidades.

## 🎯 Acciones Principales

### 1. Menú Flotante (Botón ☰)

Haz clic en el botón **"Menú"** en la esquina inferior izquierda para acceder a todas las opciones:

#### Tabs Disponibles:
- **Controles**: Seleccionar instrumentos y mapas
- **Capas**: Ver capas disponibles del mapa actual
- **Datos** ⭐ NUEVO: Cargar KML y datos de demostración
- **Información**: Ver datos del proyecto seleccionado
- **Acerca de**: Información sobre la plataforma

---

## 📊 Cargar Datos (Tab: Datos)

### Opción 1: Datos de Demostración
1. Abre el menú (☰)
2. Selecciona la pestaña **"Datos"**
3. Haz clic en **"Cargar Datos Demo"**
4. Aparecerán 3 proyectos de ejemplo en el mapa:
   - 🟡 Planta Solar Chihuahua
   - 🟡 Parque Eólico Sonora
   - 🟡 Central Geotérmica Veracruz

### Opción 2: Cargar Archivo KML
1. Abre el menú (☰)
2. Selecciona la pestaña **"Datos"**
3. Arrastra un archivo `.kml` al área de carga, o
4. Haz clic en **"selecciona uno"** para abrir un diálogo de archivo
5. El sistema procesará el archivo automáticamente

**Formatos soportados:**
- Puntos (Point)
- Líneas (LineString)
- Polígonos (Polygon)

---

## 🔍 Interactuar con Proyectos

### Ver Información del Proyecto
1. Haz clic en un marcador/punto en el mapa
2. En el popup, haz clic en el botón **"Información"** (azul)
3. Se abre una modal con:
   - Datos generales del proyecto
   - Especificaciones técnicas
   - Información de contacto
   - Ubicación geográfica (mapa)

### Ejecutar Análisis de Capas
1. Haz clic en un marcador/punto en el mapa
2. En el popup, haz clic en el botón **"Análisis"** (guinda)
3. Se abre la modal directamente en la pestaña de análisis
4. El análisis se ejecuta automáticamente y muestra:

#### Resultados del Análisis:
- **Intersecciones**: Número total de capas que se cruzan
- **Área de Influencia**: Superficie afectada
- **Nivel de Riesgo**: Evaluación de riesgo

#### Detalle de Capas:
Para cada capa intersectada se muestra:
- ✅/⚠️ Estado (sin intersecciones/intersecciones)
- Número de puntos de intersección
- Distancia al recurso más cercano

#### Acciones:
- **Exportar Análisis**: Descarga resultados en JSON
- **Compartir Resultados**: Comparte vía web

---

## 📋 Estructura de Datos

### Proyectos (GeoJSON)

```json
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [-106.6419, 28.6329]
  },
  "properties": {
    "id": "PGEN-CHI-001",
    "name": "Planta Solar Chihuahua",
    "location": "Desierto del Chihuahua, Región Norte",
    "description": "Descripción del proyecto..."
  }
}
```

### Capas de Análisis

El sistema analiza automáticamente:
1. **Centrales Eléctricas**
2. **Subestaciones**
3. **Líneas de Transmisión**
4. **Municipios**
5. **Cuerpos de Agua**
6. (Más capas según archivos KML cargados)

---

## 🗺️ Controles del Mapa

### Zoom
- **+/-**: Botones en esquina superior derecha
- **Scroll**: Rueda del ratón
- **Pellizco**: Gesto táctil (touch)

### Desplazamiento
- **Arrastrar**: Click y arrastrar el mapa
- **Deslizar**: En móvil, desliza con un dedo

---

## 💾 Exportar y Compartir

### Desde la Modal de Detalle:
- **Descargar Reporte**: Genera PDF con detalles del proyecto
- **Editar Proyecto**: Abre editor de datos

### Desde Análisis:
- **Exportar Análisis**: Descarga JSON con resultados
- **Compartir Resultados**: Genera enlace para compartir

### Desde el Menú:
- **Exportar PNG**: Captura la vista actual del mapa
- **Exportar Word**: Genera documento con datos

---

## 🎨 Elementos Visuales

### Marcadores
- 🔴 **Punto rojo**: Proyecto/ubicación
- 🟠 **Color naranja**: Capa complementaria
- 🟢 **Color verde**: Sin intersecciones
- 🔵 **Color azul**: Capa analizada

### Colores Institucionales
- **Guinda (#9B2247)**: Color primario (botones principales)
- **Verde (#1E5B4F)**: Color de información
- **Dorado (#A57F2C)**: Color secundario

---

## ⌨️ Búsqueda Rápida

### Buscar por ID de Presa
En la pestaña **"Controles"**, escribe el número (1-5) en el campo de búsqueda para encontrar rápidamente una presa:
- Ejemplo: "1" busca la presa con ID 1

### Buscar por Nombre
Escribe el nombre completo o parcial del proyecto.

---

## 🆘 Troubleshooting

### El mapa no carga
- Asegúrate de tener conexión a internet
- Recarga la página (F5)
- Vacía la caché del navegador

### KML no se carga
- Verifica que sea un archivo válido (`.kml`)
- Comprueba que contenga coordenadas válidas
- Intenta con los datos de demostración primero

### El análisis tarda mucho
- Es normal para análisis complejos (> 1000 features)
- Intenta reducir el área de análisis
- Usa datos simplificados

### Modal no responde
- Cierra la modal con la X
- Recarga la página
- Usa Ctrl+Shift+R para recarga forzada

---

## 📞 Contacto y Soporte

Para reportar problemas o sugerencias:
- Contacta al equipo de SENER
- Revisa la sección "Acerca de" en el menú
- Verifica la fuente de datos actualizada

---

## 🔄 Actualizaciones

**Última actualización**: 14 de enero de 2026

### Nuevas características (v1.1)
- ✅ Carga de archivos KML integrada en menú
- ✅ Separación de acciones: Información vs Análisis
- ✅ Análisis automático de capas
- ✅ Exportación de resultados en JSON
- ✅ Datos de demostración mejorados

### Próximas mejoras
- 📋 Base de datos en tiempo real
- 🗺️ Mapas de calor
- 📊 Comparación entre proyectos
- 🔗 API REST para datos externos
