# Resultados_Primera_Convovcatoria_PGen

Plataforma de Visualización de Datos Energéticos - Resultados de la Primera Convocatoria de Permisos de Generación Eléctrica e Interconexión al SEN

## 📋 Descripción

Sistema web interactivo para visualización, análisis y gestión de proyectos de generación eléctrica. Incluye:

- 🗺️ Mapas interactivos con Leaflet
- 📊 Análisis espacial de capas
- 📁 Importación de datos KML
- 📈 Visualización de datos energéticos
- 🎯 Modal de detalle de proyectos con análisis de capas

## 🚀 Características Principales

### 1. **Modal de Detalle de Proyecto**
- Visualización profesional de información del proyecto
- Tabs para diferentes secciones (General, Análisis, Ubicación)
- Diseño responsivo con Tailwind CSS
- Integración con análisis de capas

### 2. **Sistema de Carga KML**
- Panel intuitivo para cargar archivos KML
- Drag & drop para archivos
- Conversión automática de KML a GeoJSON
- Datos de demostración (3 proyectos ejemplo)

### 3. **Análisis de Capas**
- Análisis espacial de intersecciones
- Cálculo de distancias
- Visualización de resultados
- Exportación de reportes

### 4. **Interfaz Responsiva**
- Diseño mobile-first
- Soporte para tema claro/oscuro
- Componentes interactivos
- Navegación intuitiva

## 📁 Estructura del Proyecto

```
├── index.html                 # Página principal
├── README.md                  # Este archivo
├── .gitignore                 # Configuración de git
│
├── css/
│   ├── main.css              # Estilos principales
│   ├── mobile-responsive.css  # Estilos móviles
│   ├── presas-popup.css       # Estilos de popups
│   ├── leaflet.css            # Leaflet framework
│   └── welcome-analyst.css    # Estilos legacy
│
├── js/
│   ├── project-detail-modal.js      # Modal de detalle [NUEVO]
│   ├── kml-handler.js               # Gestor de KML [NUEVO]
│   ├── kml-upload-panel.js          # Panel de carga [NUEVO]
│   ├── map-config.js                # Configuración de mapa
│   ├── presas-maps.js               # Mapas de presas
│   ├── mobile-interface.js          # Interfaz móvil
│   ├── pdf-generator.js             # Generador de PDF
│   ├── export-ui.js                 # UI de exportación
│   └── ... (otros módulos)
│
├── img/
│   ├── logo_gob.png           # Logo Gobierno de México
│   ├── logo_sener.png         # Logo SENER
│   └── ... (otras imágenes)
│
└── tipografias/
    ├── NotoSans-*.ttf         # Fuente Noto Sans
    └── Patria-*.otf           # Fuente Patria
```

## 🛠️ Desarrollo

### Requisitos
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Conexión a internet (para librerías CDN)
- Servidor web local (recomendado para desarrollo)

### Librerías Externas
- **Leaflet 1.9.4** - Mapas interactivos
- **Tailwind CSS** - Framework CSS
- **Material Icons** - Iconografía
- **Noto Sans & Merriweather** - Tipografías

### Uso Local

```bash
# 1. Clonar repositorio
git clone https://github.com/JSCEG/Resultados_Primera_Convovcatoria_PGen.git
cd Resultados_Primera_Convovcatoria_PGen

# 2. Servir localmente (Python 3)
python -m http.server 8000

# 3. Abrir en navegador
# http://localhost:8000
```

## 📊 Datos de Demostración

El sistema incluye 3 proyectos de ejemplo:

1. **Planta Solar Chihuahua** (PGEN-CHI-001)
   - Ubicación: Desierto del Chihuahua
   - Capacidad: 150.5 MW
   - Área: 420 Ha

2. **Parque Eólico Sonora** (PGEN-SON-001)
   - Ubicación: Llanura de Sonora
   - Capacidad: 1,250 MW (250 × 5 MW)
   - Tipo: Eólico

3. **Central Geotérmica Veracruz** (PGEN-VER-001)
   - Ubicación: Campo Geotérmico
   - Capacidad: 100 MW
   - Tipo: Geotérmico

## 📖 Uso del Sistema

### Cargar Datos Demo
1. Hacer clic en el botón **"Cargar Datos Demo"** en el panel inferior derecho
2. El mapa se centrar en los 3 proyectos de ejemplo
3. Hacer clic en cualquier marcador para abrir el detalle

### Cargar Datos KML
1. Arrastra un archivo `.kml` al panel de carga, o
2. Haz clic en "selecciona uno" para abrir un diálogo de archivo
3. El sistema procesará y visualizará automáticamente los datos

### Ejecutar Análisis
1. Haz clic en un marcador del proyecto
2. En la modal, ve a la pestaña "Análisis de Capas"
3. Haz clic en **"Ejecutar Análisis"**
4. Revisa los resultados de intersecciones y distancias

### Exportar Resultados
- Desde la modal: "Descargar Reporte" genera PDF
- Desde análisis: "Exportar Análisis" descarga JSON

## 🎨 Estilos y Branding

### Paleta de Colores (SENER 2025)
- **Guinda (Primary)**: `#9B2247`
- **Dorado (Secondary)**: `#A57F2C`
- **Verde (Accent)**: `#1E5B4F`
- **Gris**: `#98989A`

### Tipografía
- **Headings**: Merriweather (serif)
- **Body**: Noto Sans (sans-serif)

Ver [GUIA_ESTILOS_WEB.md](GUIA_ESTILOS_WEB.md) para más detalles.

## 📱 Características Móviles

- Interfaz optimizada para pantallas pequeñas
- Menú flotante con funciones principales
- Popups tactiles
- Análisis responsivo

## 🔄 Actualizaciones Próximas

- [ ] Integración de base de datos en tiempo real
- [ ] Análisis avanzados con más capas
- [ ] Exportación a múltiples formatos
- [ ] Mapas de calor
- [ ] Comparación entre proyectos
- [ ] API REST para datos externos

## 📝 Notas Técnicas

### Flujo de Carga KML
```
KML File → KMLHandler → parseKML() → GeoJSON → Leaflet Layer → Popups
```

### Modal de Detalle
```
Click Popup → projectDetailModal.open() → populateProjectData() 
→ switchTab() → runLayerAnalysis() → displayResults()
```

## 🤝 Contribuir

Para contribuir:
1. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
2. Realiza cambios y commits
3. Haz push a la rama
4. Abre un Pull Request

## 📄 Licencia

SENER - Secretaría de Energía

## 📞 Contacto

Para reportar problemas o sugerencias, contacta al equipo de desarrollo.
