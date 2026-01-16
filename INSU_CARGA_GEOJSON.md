# Insumo: Carga de Capas GeoJSON, Basemaps y Análisis Espacial

Este documento sirve como guía maestra para el **Agente de Carga y Análisis Geoespacial**. Detalla la arquitectura de mapas y el flujo esperado para el análisis de capas con `turf.js`.

## 1. Arquitectura de Mapas (Leaflet)

El proyecto utiliza **Leaflet 1.9.4** como motor de mapas principal, con integración de **MapTiler SDK** para basemaps vectoriales y ráster.

### Inicialización y Basemaps (`js/map-config.js`)
- **Objeto Global:** `window.map`.
- **Límites (Bounds):** Restringido al territorio mexicano.
- **Capas Base Especiales:** 
    - `Crema` y `Gris`: Utilizan capas de satélite de ESRI aplicándoles filtros CSS Dinámicos (`sepia`, `grayscale`) para un look premium.
    - `Ninguno`: Fondo blanco puro para exportaciones técnicas.
- **GeoJSON Institucional:** El contorno de México se carga desde `https://cdn.sassoapps.com/Mapas/mexico.geojson` y se reproyecta usando `proj4`.

## 2. Gestión de Capas GeoJSON y KML (`js/kml-handler.js`)

La carga de datos externos sigue este flujo:
1. **Lectura:** El usuario sube un archivo `.kml`.
2. **Parsea:** `KMLHandler` procesa el XML y lo convierte a un objeto **GeoJSON** (`FeatureCollection`).
3. **Renderizado:** Se añade al mapa usando `L.geoJSON` con popups personalizados que incluyen botones de "Información" y "Análisis".

### Estilos por Defecto
```javascript
{
    color: '#9B2247',
    weight: 2,
    opacity: 0.8,
    fillOpacity: 0.5
}
```

## 3. Flujo de Análisis Espacial (Turf.js)

Actualmente, el botón de "Análisis" en el modal de detalles (`js/project-detail-modal.js`) es un placeholder. El objetivo es implementar análisis reales usando **Turf.js**.

### Objetivos del Análisis
- **Intersección:** Detectar si una capa KML cargada por el usuario cruza con capas GeoJSON predefinidas (Presas, Municipios, Ríos).
- **Buffer:** Generar áreas de influencia (ej. 10km a la redonda de una planta) para cuantificar recursos o población afectada.
- **Cruce de Capas:** Utilizar `turf.intersect()` o `turf.booleanPointInPolygon()` para validar proximidad o solapamiento.

## 4. Guía para el Agente de Carga y Análisis
Al implementar nuevas funcionalidades:
- **Mantener el Objeto Global:** Siempre operar sobre `window.map`.
- **Modularidad:** Mantener la lógica de procesamiento en `KMLHandler` y la lógica de visualización de resultados en `ProjectDetailModal`.
- **Reproyección:** Asegurarse de que las coordenadas estén en `EPSG:4326` (WGS84) antes de operar con Turf, o usar `proj4` si vienen en coordenadas métricas.
