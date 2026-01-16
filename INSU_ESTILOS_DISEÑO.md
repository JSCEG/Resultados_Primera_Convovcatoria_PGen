# Insumo: Identidad Gráfica y Mobile-First (SENER 2025)

Este documento sirve como guía maestra para el **Agente de Estilos y Diseño**. Detalla cómo se implementa la identidad institucional y el flujo de diseño adaptable en el proyecto.

## 1. Fundamentos de Identidad (GUIA_ESTILOS_WEB.md)

El proyecto se rige por la `GUIA_ESTILOS_WEB.md`, la cual define los **Design Tokens** institucionales.

### Paleta de Colores (Design Tokens)
- `--color-gobmx-guinda`: `#9B2247` (Primario institucional)
- `--color-gobmx-verde`: `#1E5B4F` (Acentos y botones secundarios)
- `--color-gobmx-dorado`: `#A57F2C` (Detalles y bordes de realce)
- `--color-gobmx-gris`: `#98989A` (Texto secundario)
- Variantes `-light`: Versiones con opacidad 0.05 para fondos de tarjetas.

### Tipografía
- **Títulos:** `Patria` o `Merriweather` (Serif). Se usa para `h1` a `h4`.
- **Cuerpo:** `Noto Sans` o `Inter` (Sans-serif).

## 2. Implementación Mobile-First

El proyecto utiliza un enfoque **Mobile-First** agresivo, gestionado principalmente a través de `js/mobile-interface.js`.

### Componentes Clave en Móvil
- **Bottom Sheet:** Un panel deslizable desde la parte inferior (`.mobile-bottom-sheet`) que contiene los controles del mapa, capas e información.
- **Floating Menu:** Un botón circular (`.mobile-menu-toggle-btn`) que despliega una lista de acciones rápidas.
- **Capas (Sync):** La interfaz móvil sincroniza en tiempo real el control de capas de Leaflet con su propia interfaz visual en el Bottom Sheet.

### Estrategia de Diseño
1. **Prioridad de Mapa:** El mapa ocupa el 100% de la pantalla. Los controles son flotantes o se encuentran dentro del Bottom Sheet colapsable.
2. **Interactividad:** Se prefiere el uso de iconos (`bi-` de Bootstrap Icons o Material Icons Round) con etiquetas claras.
3. **Glassmorphism:** Uso de `backdrop-blur` y fondos semitransparentes (`rgba`) para dar un aspecto premium y moderno al estilo de aplicaciones de mapas comerciales (Google Maps/Apple Maps).

## 3. Guía para el Agente de Estilos
Al realizar cambios en el diseño, el agente debe:
- **Respetar los Tokens:** Nunca usar colores "hardcoded" fuera de las variables CSS.
- **Verificar la Responsividad:** Cualquier cambio en desktop debe tener su contraparte en la clase `MobileInterface`.
- **Estilos de Tarjetas:** Las tarjetas informativas deben seguir el patrón de `border-left` grueso (5px) utilizando los colores institucionales para diferenciar tipos de contenido (Nota, Definición, Ejemplo).
