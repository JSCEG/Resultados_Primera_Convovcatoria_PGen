/**
 * Global Layer Manager - Gestiona todas las capas del registro
 * Permite encender/apagar capas independientemente del análisis
 */

class GlobalLayerManager {
    constructor(map) {
        this.map = map;
        this.layers = {}; // { layerId: L.geoJSON layer }
        this.layerData = {}; // { layerId: GeoJSON data }
        this.layerStates = {}; // { layerId: boolean (visible/hidden) }
        this.control = null;
        this.isAnalysisMode = false;
        this.analysisResults = null;
        this.activeProjectGeometry = null; // Geometría del proyecto activo para clipping

        // Paletas de colores EXTENDIDAS - Garantiza colores únicos (20+ colores)
        this.colorPalettes = {
            banxico: [
                '#9B2247',  // 0 - Guinda
                '#1E5B4F',  // 1 - Verde
                '#A57F2C',  // 2 - Dorado
                '#98989A',  // 3 - Gris
                '#7a1b38',  // 4 - Guinda oscuro
                '#165845',  // 5 - Verde oscuro
                '#8a6a24',  // 6 - Dorado oscuro
                '#6d4c86',  // 7 - Púrpura
                '#E74C3C',  // 8 - Rojo
                '#3498DB',  // 9 - Azul
                '#F39C12',  // 10 - Naranja
                '#27AE60',  // 11 - Verde claro
                '#2980B9',  // 12 - Azul oscuro
                '#8E44AD',  // 13 - Púrpura oscuro
                '#C0392B',  // 14 - Rojo oscuro
                '#16A085',  // 15 - Turquesa
                '#D35400',  // 16 - Naranja oscuro
                '#34495E',  // 17 - Gris azulado
                '#F1C40F',  // 18 - Amarillo
                '#E67E22'   // 19 - Naranja claro
            ],
            gerencias: [
                '#9B2247',  // 0 - Guinda
                '#1E5B4F',  // 1 - Verde
                '#A57F2C',  // 2 - Dorado
                '#98989A',  // 3 - Gris
                '#7a1b38',  // 4 - Guinda oscuro
                '#165845',  // 5 - Verde oscuro
                '#8a6a24',  // 6 - Dorado oscuro
                '#6d4c86',  // 7 - Púrpura
                '#E74C3C',  // 8 - Rojo
                '#3498DB',  // 9 - Azul
                '#F39C12',  // 10 - Naranja
                '#27AE60',  // 11 - Verde claro
                '#2980B9',  // 12 - Azul oscuro
                '#8E44AD',  // 13 - Púrpura oscuro
                '#C0392B',  // 14 - Rojo oscuro
                '#16A085',  // 15 - Turquesa
                '#D35400',  // 16 - Naranja oscuro
                '#34495E',  // 17 - Gris azulado
                '#F1C40F',  // 18 - Amarillo
                '#E67E22'   // 19 - Naranja claro
            ]
        };

        // Registro de zonas ya vistas para garantizar colores únicos
        this.zoneColorAssignments = {}; // { "banxico:Centro": color, "gerencias:NorEste": color }
        this.nextZoneColorIndex = {
            'banxico': 0,
            'gerencias_control': 0
        };
    }

    /**
     * Inicializa el control de capas globales
     */
    async initializeControl() {
        console.log('[GlobalLayerManager] Initializing control');

        // Validar que el mapa esté listo y tenga el método getPane
        if (!this.map || typeof this.map.getPane !== 'function') {
            console.warn('[GlobalLayerManager] Map not ready yet, retrying initialization...');
            setTimeout(() => this.initializeControl(), 500);
            return;
        }

        // Crear panes personalizados si no existen
        try {
            if (!this.map.getPane('polygonsPane')) {
                this.map.createPane('polygonsPane');
                this.map.getPane('polygonsPane').style.zIndex = 400;
            }
            if (!this.map.getPane('linesPane')) {
                this.map.createPane('linesPane');
                this.map.getPane('linesPane').style.zIndex = 450;
            }
            if (!this.map.getPane('pointsPane')) {
                this.map.createPane('pointsPane');
                this.map.getPane('pointsPane').style.zIndex = 500;
            }
            if (!this.map.getPane('kmlPane')) {
                this.map.createPane('kmlPane');
                this.map.getPane('kmlPane').style.zIndex = 600; // Siempre arriba
            }
        } catch (e) {
            console.error('[GlobalLayerManager] Error creating panes:', e);
            return;
        }

        // Crear control de capas
        this.control = L.control({ position: 'bottomright' });

        this.control.onAdd = () => {
            const div = L.DomUtil.create('div', 'global-layers-control');
            this.updateControlContent(div);

            // Prevenir propagación de eventos
            L.DomEvent.disableClickPropagation(div);
            L.DomEvent.disableScrollPropagation(div);

            return div;
        };

        this.control.addTo(this.map);
        console.log('[GlobalLayerManager] Control added to map');

        // Inicializar estados (todas apagadas por defecto)
        LAYERS_REGISTRY.forEach(entry => {
            this.layerStates[entry.id] = false;
        });

        // Precargar conteos de todas las capas para mostrar en la UI
        this.preloadLayerCounts();
    }

    /**
     * Precarga los conteos de features de todas las capas
     * para mostrarlos en la UI sin necesidad de cargar las capas completas
     */
    async preloadLayerCounts() {
        console.log('[GlobalLayerManager] Preloading layer counts...');

        // Cargar datos de todas las capas en paralelo
        const promises = LAYERS_REGISTRY.map(async (entry) => {
            try {
                // Solo cargar si aún no está cargado
                if (!this.layerData[entry.id]) {
                    const response = await fetch(entry.url);
                    if (!response.ok) {
                        console.warn(`[GlobalLayerManager] Could not preload ${entry.name}: HTTP ${response.status}`);
                        return;
                    }
                    this.layerData[entry.id] = await response.json();
                    console.log(`[GlobalLayerManager] Preloaded ${entry.name}: ${this.layerData[entry.id].features?.length || 0} features`);
                }
            } catch (error) {
                console.warn(`[GlobalLayerManager] Error preloading ${entry.name}:`, error);
            }
        });

        // Esperar a que todas las cargas terminen (con o sin error)
        await Promise.allSettled(promises);

        // Actualizar UI para mostrar los conteos
        this.refresh();
        console.log('[GlobalLayerManager] Layer counts preloaded');
    }

    /**
     * Actualiza el contenido del control con diseño moderno
     */
    updateControlContent(div) {
        const title = this.isAnalysisMode ? 'RESULTADOS DEL ANÁLISIS' : 'CAPAS DISPONIBLES';
        const subtitle = this.isAnalysisMode ? 'Elementos intersectados' : 'Seleccione los elementos a visualizar';
        const headerIcon = this.isAnalysisMode ? 'analytics' : 'layers';

        let html = `
            <div class="layers-header">
                <div class="layers-title-row">
                    <span class="material-icons-round" style="color: #8B1D3D; font-size: 20px;">${headerIcon}</span>
                    <h1 class="layers-title">${title}</h1>
                </div>
                <p class="layers-subtitle">${subtitle}</p>
            </div>
            <div class="layers-list custom-scrollbar">
        `;

        // Sección de Información General del KML (solo en modo análisis)
        if (this.isAnalysisMode && this.activeProjectGeometry) {
            // ... (Mantener lógica de información general, adaptando estilos si es necesario)
            // Por brevedad, adaptamos el contenedor a un estilo más limpio
            const geom = this.activeProjectGeometry;
            const props = geom.properties || {};

            // ... (Cálculo de métricas igual que antes) ...
            let areaHa = 0;
            let perimeterKm = 0;
            let type = geom.geometry ? geom.geometry.type : 'Desconocido';

            try {
                if (type === 'Polygon' || type === 'MultiPolygon') {
                    const areaSqM = turf.area(geom);
                    areaHa = (areaSqM / 10000).toFixed(2);
                    const perimeterKmRaw = turf.length(geom, { units: 'kilometers' });
                    perimeterKm = perimeterKmRaw.toFixed(2);
                } else if (type === 'LineString' || type === 'MultiLineString') {
                    const lengthKm = turf.length(geom, { units: 'kilometers' });
                    perimeterKm = lengthKm.toFixed(2);
                }
            } catch (e) { }

            const name = props.name || 'Sin nombre';

            html += `
                <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 12px; margin-bottom: 12px;">
                    <div style="font-size: 11px; font-weight: bold; color: #166534; text-transform: uppercase; margin-bottom: 4px; letter-spacing: 0.05em;">Proyecto Activo</div>
                    <div style="font-size: 13px; font-weight: 700; color: #15803d; margin-bottom: 6px;">${name}</div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 11px; color: #374151;">
                        ${areaHa > 0 ? `<div style="background:rgba(255,255,255,0.6); padding:4px 8px; border-radius:6px;"><strong>${areaHa}</strong> ha</div>` : ''}
                        ${perimeterKm > 0 ? `<div style="background:rgba(255,255,255,0.6); padding:4px 8px; border-radius:6px;"><strong>${perimeterKm}</strong> km</div>` : ''}
                    </div>
                </div>
             `;
        }

        // Filtrar capas
        let layersToShow = LAYERS_REGISTRY;
        if (this.isAnalysisMode) {
            if (this.analysisResults) {
                const intersectedIds = this.analysisResults.layers
                    .filter(l => l.intersected)
                    .map(l => l.id);
                layersToShow = LAYERS_REGISTRY.filter(entry => intersectedIds.includes(entry.id));
            } else {
                layersToShow = [];
            }
        }

        if (layersToShow.length === 0) {
            const emptyMsg = this.isAnalysisMode
                ? 'No se encontraron intersecciones.'
                : 'No hay capas disponibles';
            html += `<div style="padding: 20px; text-align: center; color: #94a3b8; font-size: 13px;">${emptyMsg}</div>`;
        } else {
            layersToShow.forEach(entry => {
                const isChecked = this.layerStates[entry.id] ? 'checked' : '';
                const activeClass = this.layerStates[entry.id] ? 'active' : '';

                // Lógica de conteo
                let countBadge = '';
                let countClass = 'default';
                let countValue = '';

                if (this.isAnalysisMode && this.analysisResults) {
                    // Modo Análisis
                    const result = this.analysisResults.layers.find(l => l.id === entry.id);
                    if (result && result.count > 0) {
                        countValue = result.count;
                        countClass = 'analysis';
                    }
                } else if (this.layerData[entry.id] && this.layerData[entry.id].features) {
                    // Modo Normal (Total)
                    countValue = this.layerData[entry.id].features.length.toLocaleString();
                }

                if (countValue) {
                    countBadge = `<span class="layer-count ${countClass}">${countValue}</span>`;
                }

                // Icono de la capa (si existe)
                let layerIcon = '';
                if (entry.icon && entry.icon.url) {
                    layerIcon = `<img src="${entry.icon.url}" class="layer-icon" style="width: 20px; height: 20px; object-fit: contain; margin-right: 4px;" alt="" />`;
                } else {
                    layerIcon = `<div class="layer-color-indicator" style="background-color: ${entry.style.color || entry.style.fillColor || '#999'};"></div>`;
                }

                html += `
                    <label class="layer-item ${activeClass}">
                        <input type="checkbox" class="layer-checkbox" 
                            onchange="window.globalLayerManager.toggleLayer('${entry.id}', this.checked)" ${isChecked}>
                        ${layerIcon}
                        <span class="layer-name">${entry.name}</span>
                        ${countBadge}
                    </label>
                `;
            });
        }

        html += `</div>`; // Cierre layers-list

        // Footer con acciones (solo en modo análisis o si se desea limpiar)
        if (this.isAnalysisMode || Object.values(this.layerStates).some(s => s)) {
            html += `
                <div class="layers-footer">
                    <button class="btn-layer-action btn-clean" onclick="window.globalLayerManager.resetAllLayers()">
                        Limpiar
                    </button>
                    ${this.isAnalysisMode ? `
                    <button class="btn-layer-action btn-apply" onclick="document.getElementById('kmlInput').click()">
                        Nuevo Análisis
                    </button>
                    ` : ''}
                </div>
             `;
        }

        div.innerHTML = html;
    }

    /**
     * Resetea todas las capas (apagar)
     */
    resetAllLayers() {
        Object.keys(this.layerStates).forEach(id => this.toggleLayer(id, false));
        if (this.isAnalysisMode) this.exitAnalysisMode();
        this.refresh();
    }

    /**
     * Asegura que los datos de la capa estén cargados en memoria
     */
    async ensureLayerData(layerId) {
        const entry = LAYERS_REGISTRY.find(l => l.id === layerId);
        if (!entry) return null;

        if (!this.layerData[layerId]) {
            try {
                const response = await fetch(entry.url);
                if (!response.ok) {
                    const errorMsg = `No se pudo cargar la capa "${entry.name}". Archivo no disponible (HTTP ${response.status}).`;
                    console.error(`[GlobalLayerManager] ${errorMsg}`);

                    // Notificar al usuario si el sistema de notificaciones está disponible
                    if (window.NotificationSystem) {
                        window.NotificationSystem.showError(errorMsg);
                    }

                    throw new Error(`HTTP ${response.status} loading ${entry.url}`);
                }
                this.layerData[layerId] = await response.json();
            } catch (error) {
                console.error(`[GlobalLayerManager] Error fetching data for ${entry.name}:`, error);

                // Notificar al usuario si el sistema de notificaciones está disponible
                if (window.NotificationSystem && error.message.includes('HTTP')) {
                    window.NotificationSystem.showError(`Error al cargar "${entry.name}": Archivo no encontrado en el servidor.`);
                } else if (window.NotificationSystem) {
                    window.NotificationSystem.showError(`Error al cargar "${entry.name}": ${error.message}`);
                }

                throw error;
            }
        }
        return this.layerData[layerId];
    }

    /**
     * Carga una capa del registro
     */
    async loadLayer(layerId) {
        const entry = LAYERS_REGISTRY.find(l => l.id === layerId);
        if (!entry) return;

        console.log(`[GlobalLayerManager] Loading layer: ${entry.name}`);

        try {
            // Asegurar que los datos estén cargados
            const data = await this.ensureLayerData(layerId);
            if (!data) throw new Error("No data loaded");

            // Aplicar clipping si hay un proyecto activo
            let dataToRender = data;
            if (this.activeProjectGeometry && this.activeProjectGeometry.geometry) {
                console.log(`[GlobalLayerManager] Applying spatial clipping to ${entry.name}`);
                const clippedFeatures = [];
                const projectGeomType = this.activeProjectGeometry.geometry.type;
                const isProjectPoly = projectGeomType === 'Polygon' || projectGeomType === 'MultiPolygon';

                for (const feature of (dataToRender.features || [])) {
                    if (!feature.geometry) continue;

                    try {
                        // Caso 1: Puntos (siempre mostrar completos si están dentro)
                        if (entry.kind === 'points' || feature.geometry.type === 'Point') {
                            if (turf.booleanPointInPolygon(feature, this.activeProjectGeometry)) {
                                clippedFeatures.push(feature);
                            }
                            continue;
                        }

                        // Caso 2: Polígonos vs Polígonos (Recorte exacto)
                        const isFeaturePoly = feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon';

                        if (isProjectPoly && isFeaturePoly) {
                            try {
                                const intersection = turf.intersect(feature, this.activeProjectGeometry);
                                if (intersection) {
                                    clippedFeatures.push({
                                        type: 'Feature',
                                        geometry: intersection.geometry,
                                        properties: feature.properties
                                    });
                                }
                            } catch (err) {
                                // Si falla el recorte exacto (geometría inválida?), fallback a intersección simple
                                if (turf.booleanIntersects(feature, this.activeProjectGeometry)) {
                                    clippedFeatures.push(feature);
                                }
                            }
                            continue;
                        }

                        // Caso 3: Otros (Líneas, o mezclas) - Solo filtrar por intersección
                        if (turf.booleanIntersects(feature, this.activeProjectGeometry)) {
                            clippedFeatures.push(feature);
                        }

                    } catch (e) {
                        console.warn('Error clipping feature:', e);
                    }
                }

                dataToRender = {
                    type: 'FeatureCollection',
                    features: clippedFeatures
                };
            }

            // Crear capa de Leaflet
            let paneName = 'polygonsPane';
            if (entry.kind === 'lines') paneName = 'linesPane';
            if (entry.kind === 'points') paneName = 'pointsPane';

            // Función de estilo dinámica para colorear zonas
            const styleFunction = (feature) => {
                let baseStyle = { ...entry.style };

                // Aplicar colores únicos por zona para Banxico y Gerencias
                if (layerId === 'banxico' || layerId === 'gerencias_control') {
                    // Para Banxico usar propiedad 'banxico', para Gerencias usar 'Field1'
                    const zoneName = layerId === 'banxico'
                        ? feature.properties.banxico
                        : feature.properties.Field1 || feature.properties.nombre || feature.properties.nom_geo;

                    if (zoneName) {
                        // Clave única para esta zona
                        const zoneKey = `${layerId}:${zoneName}`;

                        // Si no hemos visto esta zona, asignarle un color nuevo
                        if (!this.zoneColorAssignments[zoneKey]) {
                            const palette = layerId === 'banxico' ? this.colorPalettes.banxico : this.colorPalettes.gerencias;
                            const colorIndex = this.nextZoneColorIndex[layerId] % palette.length;
                            this.zoneColorAssignments[zoneKey] = palette[colorIndex];
                            this.nextZoneColorIndex[layerId]++;
                        }

                        const color = this.zoneColorAssignments[zoneKey];
                        baseStyle.fillColor = color;
                        baseStyle.color = color;
                        baseStyle.fillOpacity = 0.4;
                        baseStyle.opacity = 0.8;
                    }
                }

                return baseStyle;
            };

            const layer = L.geoJSON(dataToRender, {
                pane: paneName,
                style: entry.kind !== "points" ? styleFunction : undefined,
                pointToLayer: (ft, latlng) => {
                    if (entry.kind === "points") {
                        if (entry.icon && entry.icon.url) {
                            // Usar icono personalizado si existe
                            const icon = L.icon({
                                iconUrl: entry.icon.url,
                                iconSize: entry.icon.size || [24, 24],
                                iconAnchor: entry.icon.anchor || [12, 12],
                                popupAnchor: [0, -12]
                            });
                            return L.marker(latlng, { icon: icon });
                        } else {
                            // Fallback a CircleMarker
                            return L.circleMarker(latlng, { ...entry.style, radius: 5 });
                        }
                    }
                    return undefined;
                },
                onEachFeature: (ft, lyr) => {
                    // Generar contenido enriquecido para el popup
                    const popupContent = this.createPopupContent(ft, entry);
                    lyr.bindPopup(popupContent, { maxWidth: 350, maxHeight: 300 });
                }
            });

            // Si es una capa de puntos, envolver en un MarkerClusterGroup
            if (entry.kind === "points") {
                const clusterGroup = L.markerClusterGroup({
                    maxClusterRadius: 60,
                    spiderfyOnMaxZoom: true,
                    showCoverageOnHover: false,
                    zoomToBoundsOnClick: true,
                    iconCreateFunction: (cluster) => {
                        const count = cluster.getChildCount();
                        let size = 'small';
                        if (count >= 100) size = 'large';
                        else if (count >= 10) size = 'medium';

                        const color = entry.style.fillColor || entry.style.color || '#ff6600';
                        return L.divIcon({
                            html: `<div style="background-color: ${color}; width: 100%; height: 100%; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">${count}</div>`,
                            className: `marker-cluster marker-cluster-${size}`,
                            iconSize: L.point(40, 40)
                        });
                    }
                });
                clusterGroup.addLayer(layer);
                this.layers[layerId] = clusterGroup;
            } else {
                this.layers[layerId] = layer;
            }
            console.log(`[GlobalLayerManager] Layer ${entry.name} loaded successfully`);

            // Actualizar control para mostrar conteo total
            this.refresh();
        } catch (error) {
            console.error(`[GlobalLayerManager] Error loading layer ${entry.name}:`, error);
        }
    }

    /**
     * Genera el contenido HTML del popup con diseño moderno
     */
    createPopupContent(feature, entry) {
        const p = feature.properties;
        const isSubstation = entry.id === 'subestaciones';
        const isTransmissionLine = entry.id === 'lineas_transmision';
        const isRegionalControl = entry.id === 'gerencias_control';
        const isBanxico = entry.id === 'banxico';

        // 1. Título y Subtítulo
        let title = p.Razón_social || p.nombre || p.nom_geo || p.nombre_lt || p.ducto || p.Field1 || p.banxico || entry.name;
        if (title === 'N/D' || !title) title = entry.name;

        let subtitle = p.Ubicación || p.Dirección || '';
        if (!subtitle && isSubstation) subtitle = 'Ubicación no disponible';

        // 2. Estado/Condición (Badge)
        let status = p.condicion || p.Estatus || p.Estatus_instalacion || '';
        let statusHtml = '';
        if (status) {
            let statusClass = 'bg-gray-100 text-gray-600';
            let dotColor = 'bg-gray-400';

            if (status.toLowerCase().includes('operación') || status.toLowerCase().includes('servicio')) {
                statusClass = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
                dotColor = 'bg-emerald-500';
            } else if (status.toLowerCase().includes('construcción') || status.toLowerCase().includes('proyecto')) {
                statusClass = 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
                dotColor = 'bg-amber-500';
            }

            statusHtml = `
                <span class="shrink-0 px-2.5 py-1 ${statusClass} text-[10px] font-bold rounded-full flex items-center uppercase tracking-wider">
                    <span class="w-1.5 h-1.5 ${dotColor} rounded-full mr-1.5"></span>
                    ${status}
                </span>
            `;
        }

        // 3. Contenido Principal
        let contentHtml = '';

        if (isBanxico) {
            // Contenido específico para División Regional de Banxico
            contentHtml = `
                <div>
                    <h2 class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 flex items-center">
                        <span class="material-icons-round text-sm mr-1.5">account_balance</span>
                        Zona Económica
                    </h2>
                    <div class="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/30 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                        <div class="flex items-center gap-3">
                            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center shrink-0">
                                <span class="material-icons-round text-white text-xl">location_city</span>
                            </div>
                            <div class="flex-1">
                                <p class="text-xs text-amber-700 dark:text-amber-300 mb-1 uppercase tracking-wide font-semibold">Región Banxico</p>
                                <p class="text-base font-bold text-amber-900 dark:text-amber-100">${p.banxico || 'Sin especificar'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else if (isRegionalControl) {
            // Contenido específico para Gerencias de Control Regional
            contentHtml = `
                <div>
                    <h2 class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 flex items-center">
                        <span class="material-icons-round text-sm mr-1.5">hub</span>
                        Información Regional
                    </h2>
                    <div class="space-y-4">
                        <div class="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/20 dark:to-primary/30 rounded-xl p-4 border border-primary/20">
                            <div class="flex items-start gap-3">
                                <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                                    <span class="material-icons-round text-white text-lg">corporate_fare</span>
                                </div>
                                <div class="flex-1">
                                    <p class="text-xs text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide">Gerencia</p>
                                    <p class="text-base font-bold text-slate-900 dark:text-white leading-tight">${p.Field1 || 'Sin especificar'}</p>
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div class="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                                <div class="flex items-center text-slate-500 dark:text-slate-400 mb-2">
                                    <span class="material-icons-round text-sm mr-1.5">fingerprint</span>
                                    <span class="text-[10px] font-bold uppercase">ID</span>
                                </div>
                                <p class="text-lg font-bold text-primary dark:text-pink-400">${p.id || '-'}</p>
                            </div>

                            <div class="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                                <div class="flex items-center text-slate-500 dark:text-slate-400 mb-2">
                                    <span class="material-icons-round text-sm mr-1.5">tag</span>
                                    <span class="text-[10px] font-bold uppercase">FID</span>
                                </div>
                                <p class="text-lg font-bold text-slate-800 dark:text-slate-200">${p.fid || '-'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="border-t border-slate-200 dark:border-slate-700 pt-4">
                    <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 border border-blue-200 dark:border-blue-800">
                        <div class="flex items-start gap-2">
                            <span class="material-icons-round text-blue-600 dark:text-blue-400 text-sm mt-0.5">info</span>
                            <div class="flex-1">
                                <p class="text-xs font-semibold text-blue-800 dark:text-blue-300 mb-1">Área de Cobertura</p>
                                <p class="text-xs text-blue-700 dark:text-blue-400">
                                    Esta gerencia coordina las operaciones del Sistema Eléctrico Nacional en su región asignada.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else if (isTransmissionLine) {
            // Contenido específico para Líneas de Transmisión
            contentHtml = `
                <div>
                    <h2 class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 flex items-center">
                        <span class="material-icons-round text-sm mr-1.5">cable</span>
                        Características Técnicas
                    </h2>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-0.5">
                            <div class="flex items-center text-slate-500 dark:text-slate-400">
                                <span class="material-icons-round text-[10px] mr-1.5">electric_bolt</span>
                                <span class="text-[10px] font-bold uppercase">Tensión</span>
                            </div>
                            <p class="text-base font-bold text-primary dark:text-pink-400">${p.tension_kv || '-'} kV</p>
                        </div>
                        <div class="space-y-0.5">
                            <div class="flex items-center text-slate-500 dark:text-slate-400">
                                <span class="material-icons-round text-[10px] mr-1.5">straighten</span>
                                <span class="text-[10px] font-bold uppercase">Longitud</span>
                            </div>
                            <p class="text-base font-bold text-slate-800 dark:text-slate-200">${p.longi_km ? p.longi_km.toFixed(2) : '-'} km</p>
                        </div>
                        <div class="space-y-0.5">
                            <div class="flex items-center text-slate-500 dark:text-slate-400">
                                <span class="material-icons-round text-[10px] mr-1.5">category</span>
                                <span class="text-[10px] font-bold uppercase">Categoría kV</span>
                            </div>
                            <p class="text-sm font-semibold text-slate-800 dark:text-slate-200">${p.categ_kv || '-'}</p>
                        </div>
                        <div class="space-y-0.5">
                            <div class="flex items-center text-slate-500 dark:text-slate-400">
                                <span class="material-icons-round text-[10px] mr-1.5">fingerprint</span>
                                <span class="text-[10px] font-bold uppercase">ID Global</span>
                            </div>
                            <p class="text-sm font-semibold text-slate-800 dark:text-slate-200">${p.g_id || p.fid || '-'}</p>
                        </div>
                    </div>
                </div>
                
                ${p.caracteri ? `
                <div class="border-t border-slate-200 dark:border-slate-700 pt-4">
                    <h2 class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 flex items-center">
                        <span class="material-icons-round text-sm mr-1.5">info</span>
                        Especificaciones
                    </h2>
                    <div class="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
                        <div class="flex items-start gap-2">
                            <span class="material-icons-round text-sm text-slate-400 mt-0.5">description</span>
                            <div class="flex-1">
                                <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">Características</p>
                                <p class="text-sm font-semibold text-slate-800 dark:text-slate-200 break-words">${p.caracteri}</p>
                            </div>
                        </div>
                    </div>
                </div>
                ` : ''}
            `;
        } else if (isSubstation) {
            contentHtml = `
                <div>
                    <h2 class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 flex items-center">
                        <span class="material-icons-round text-sm mr-1.5">analytics</span>
                        Datos de Activo
                    </h2>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-0.5">
                            <div class="flex items-center text-slate-500 dark:text-slate-400">
                                <span class="material-icons-round text-[10px] mr-1.5">fingerprint</span>
                                <span class="text-[10px] font-bold uppercase">ID</span>
                            </div>
                            <p class="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate" title="${p.id}">${p.id || '-'}</p>
                        </div>
                        <div class="space-y-0.5">
                            <div class="flex items-center text-slate-500 dark:text-slate-400">
                                <span class="material-icons-round text-[10px] mr-1.5">qr_code</span>
                                <span class="text-[10px] font-bold uppercase">Código</span>
                            </div>
                            <p class="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate" title="${p.codigo}">${p.codigo || '-'}</p>
                        </div>
                        <div class="space-y-0.5">
                            <div class="flex items-center text-slate-500 dark:text-slate-400">
                                <span class="material-icons-round text-[10px] mr-1.5">category</span>
                                <span class="text-[10px] font-bold uppercase">Clase</span>
                            </div>
                            <p class="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate" title="${p.clase_geo}">${p.clase_geo || '-'}</p>
                        </div>
                        <div class="space-y-0.5">
                            <div class="flex items-center text-slate-500 dark:text-slate-400">
                                <span class="material-icons-round text-[10px] mr-1.5">gps_fixed</span>
                                <span class="text-[10px] font-bold uppercase">Calif. Pos</span>
                            </div>
                            <p class="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate" title="${p.calif_pos}">${p.calif_pos || '-'}</p>
                        </div>
                    </div>
                </div>
                
                <div class="border-t border-slate-200 dark:border-slate-700 pt-4">
                    <h2 class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 flex items-center">
                        <span class="material-icons-round text-sm mr-1.5">settings_input_component</span>
                        Especificaciones
                    </h2>
                    <div class="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 space-y-2.5">
                        <div class="flex justify-between items-center text-xs">
                            <span class="text-slate-500 dark:text-slate-400">Nombre Objeto</span>
                            <span class="font-medium text-slate-700 dark:text-slate-300 text-right">${p.nom_obj || 'N/D'}</span>
                        </div>
                        <div class="flex justify-between items-center text-xs">
                            <span class="text-slate-500 dark:text-slate-400">Nombre Cono</span>
                            <span class="font-medium text-slate-700 dark:text-slate-300 text-right">${p.nom_cono || 'N/D'}</span>
                        </div>
                         <div class="flex justify-between items-center text-xs">
                            <span class="text-slate-500 dark:text-slate-400">Referencia</span>
                            <span class="font-medium text-slate-700 dark:text-slate-300 text-right">${p.fid || 'N/D'}</span>
                        </div>
                    </div>
                </div>
            `;
        } else {
            contentHtml = this.generateGenericContent(p);
        }

        return `
            <div class="font-sans w-[300px] bg-white dark:bg-slate-900 rounded-xl shadow-xl flex flex-col border border-slate-200 dark:border-slate-700">
                <!-- Header Fijo -->
                <div class="bg-primary px-4 py-2 flex items-center justify-between shrink-0">
                    <span class="text-[10px] font-bold tracking-[0.15em] text-white uppercase opacity-90 truncate max-w-[240px]">${entry.name}</span>
                    <button class="text-white/80 hover:text-white transition-colors" onclick="this.closest('.leaflet-popup').remove()">
                        <span class="material-icons-round text-sm">close</span>
                    </button>
                </div>

                <!-- Contenido Scrollable -->
                <div class="overflow-y-auto custom-scrollbar" style="max-height: 440px;">
                    <div class="p-5">
                        <div class="flex flex-col gap-3 mb-6">
                            <div class="flex justify-between items-start gap-2">
                                <h1 class="text-lg font-bold text-slate-900 dark:text-white leading-tight break-words">${title}</h1>
                                ${statusHtml}
                            </div>
                            ${subtitle ? `
                            <div class="flex items-center text-slate-500 dark:text-slate-400 text-xs">
                                <span class="material-icons-round text-sm mr-1">location_on</span>
                                <span class="truncate max-w-[250px]">${subtitle}</span>
                            </div>` : ''}
                        </div>

                        <div class="space-y-5">
                            ${contentHtml}
                        </div>

                        <div class="mt-6 flex gap-3">
                            <!-- Botón Editar removido según solicitud -->
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    generateGenericContent(p) {
        // Campos prioritarios basados en el ejemplo de Centrales Eléctricas
        const priorityFields = [
            'NumeroPermiso', 'Ubicación', 'EF_ID', 'MPO_ID', 'Dirección',
            'Razón_social', 'Numero_de_Expediente', 'Modalidad', 'FechaOtorgamiento',
            'Capacidad_autorizada_MW'
        ];

        let items = '';
        priorityFields.forEach(key => {
            if (p[key] && p[key] !== 'NULL') {
                let value = p[key];
                let label = key.replace(/_/g, ' ');

                // Formateo específico si es necesario
                if (key === 'Capacidad_autorizada_MW') {
                    value = `${value} MW`;
                    label = 'Capacidad';
                }

                items += `
                    <div class="flex justify-between items-center text-xs border-b border-slate-100 dark:border-slate-700/50 last:border-0 py-2">
                        <span class="text-slate-500 dark:text-slate-400 font-medium">${label}</span>
                        <span class="font-semibold text-slate-700 dark:text-slate-300 text-right max-w-[160px] truncate" title="${p[key]}">${value}</span>
                    </div>
                `;
            }
        });

        if (!items) items = '<div class="text-center text-xs text-slate-400 py-2">Sin datos adicionales</div>';

        return `
            <div>
                <h2 class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 flex items-center">
                    <span class="material-icons-round text-sm mr-1.5">info</span>
                    Detalles del Permiso
                </h2>
                <div class="bg-slate-50 dark:bg-slate-800/50 rounded-xl px-3 py-1">
                    ${items}
                </div>
            </div>
        `;
    }

    /**
     * Realiza el análisis espacial de una geometría contra todas las capas
     * @param {Object} geometry - Geometría GeoJSON (Feature o Geometry) del KML/Proyecto
     */
    async performAnalysis(geometry) {
        console.log('[GlobalLayerManager] Starting full spatial analysis...');

        // Normalizar geometría a Feature si es necesario
        const analysisFeature = geometry.type === 'Feature' ? geometry : { type: 'Feature', geometry: geometry, properties: {} };
        const analysisGeom = analysisFeature.geometry;

        const results = {
            layers: []
        };

        // Iterar sobre todas las capas del registro
        for (const entry of LAYERS_REGISTRY) {
            try {
                // Cargar datos silenciosamente
                const data = await this.ensureLayerData(entry.id);
                if (!data) continue;

                let intersectCount = 0;
                let isIntersected = false;

                // Verificar intersección con cada feature de la capa
                // Usamos turf.bboxClip o booleanIntersects para optimizar
                // Para simplificar, iteramos y chequeamos intersección

                // Optimización: Chequear bbox primero si es posible (no implementado aquí para brevedad, pero recomendado)

                for (const feature of data.features) {
                    if (!feature.geometry) continue;

                    try {
                        // Usamos booleanIntersects para todo tipo de geometría (Punto, Línea, Polígono)
                        // Esto es más robusto para casos como Subestaciones que pueden ser polígonos
                        if (turf.booleanIntersects(feature, analysisFeature)) {
                            intersectCount++;
                        }
                    } catch (e) {
                        // Fallback para puntos si booleanIntersects falla por alguna razón de topología
                        if (feature.geometry.type === 'Point') {
                            try {
                                if (turf.booleanPointInPolygon(feature, analysisFeature)) {
                                    intersectCount++;
                                }
                            } catch (e2) {
                                // Ignorar
                            }
                        }
                    }
                }

                if (intersectCount > 0) {
                    results.layers.push({
                        id: entry.id,
                        intersected: true,
                        count: intersectCount,
                        name: entry.name,
                        kind: entry.kind
                    });
                }

            } catch (error) {
                console.warn(`[GlobalLayerManager] Error analyzing layer ${entry.id}:`, error);
            }
        }

        // Ordenar resultados por cantidad de hallazgos
        results.layers.sort((a, b) => b.count - a.count);

        console.log('[GlobalLayerManager] Analysis complete:', results);
        this.enterAnalysisMode(results, analysisFeature);
        return results;
    }

    /**
     * Alterna la visibilidad de una capa
     */
    async toggleLayer(layerId, isVisible) {
        console.log(`[GlobalLayerManager] Toggle layer ${layerId}: ${isVisible}`);

        this.layerStates[layerId] = isVisible;

        if (isVisible) {
            // Cargar capa si no existe
            if (!this.layers[layerId]) {
                try {
                    await this.loadLayer(layerId);
                } catch (error) {
                    console.error(`[GlobalLayerManager] Failed to load layer ${layerId}:`, error);
                    // Revertir el estado si la carga falló
                    this.layerStates[layerId] = false;

                    // Desmarcar el checkbox en la UI si existe
                    const checkbox = document.querySelector(`input[data-layer-id="${layerId}"]`);
                    if (checkbox) {
                        checkbox.checked = false;
                    }

                    return; // Salir sin intentar agregar la capa al mapa
                }
            }

            // Mostrar capa solo si se cargó exitosamente
            if (this.layers[layerId] && !this.map.hasLayer(this.layers[layerId])) {
                this.layers[layerId].addTo(this.map);
            }
        } else {
            // Ocultar capa
            if (this.layers[layerId] && this.map.hasLayer(this.layers[layerId])) {
                this.map.removeLayer(this.layers[layerId]);
            }
        }
    }

    /**
     * Establece el proyecto activo para aplicar clipping
     */
    setActiveProject(projectGeometry) {
        console.log('[GlobalLayerManager] Setting active project for clipping');
        this.activeProjectGeometry = projectGeometry;

        // Recargar capas visibles para aplicar el clipping
        Object.keys(this.layerStates).forEach(layerId => {
            if (this.layerStates[layerId] && this.layers[layerId]) {
                // Remover capa actual
                if (this.map.hasLayer(this.layers[layerId])) {
                    this.map.removeLayer(this.layers[layerId]);
                }
                // Eliminar del cache para forzar recarga con clipping
                delete this.layers[layerId];
                // Recargar
                this.toggleLayer(layerId, true);
            }
        });
    }

    /**
     * Entra en modo análisis
     */
    enterAnalysisMode(analysisResults, projectGeometry) {
        console.log('[GlobalLayerManager] Entering analysis mode');
        this.isAnalysisMode = true;
        this.analysisResults = analysisResults;

        // 1. Identificar capas relevantes (intersectadas)
        const relevantLayerIds = analysisResults && analysisResults.layers
            ? analysisResults.layers.filter(l => l.intersected).map(l => l.id)
            : [];

        // 2. Apagar capas que NO son relevantes
        Object.keys(this.layerStates).forEach(layerId => {
            if (this.layerStates[layerId] && !relevantLayerIds.includes(layerId)) {
                this.toggleLayer(layerId, false);
            }
        });

        // 3. Establecer geometría del proyecto para clipping
        if (projectGeometry) {
            this.setActiveProject(projectGeometry);
        }

        // 4. Actualizar control
        if (this.control && this.control.getContainer()) {
            this.updateControlContent(this.control.getContainer());
        }

        // 5. Activar automáticamente las capas con hallazgos
        if (analysisResults && analysisResults.layers) {
            analysisResults.layers.forEach(layer => {
                if (layer.intersected && !this.layerStates[layer.id]) {
                    this.toggleLayer(layer.id, true);
                }
            });
        }
    }

    /**
     * Sale del modo análisis
     */
    exitAnalysisMode() {
        console.log('[GlobalLayerManager] Exiting analysis mode');
        this.isAnalysisMode = false;
        this.analysisResults = null;

        // Actualizar control
        if (this.control && this.control.getContainer()) {
            this.updateControlContent(this.control.getContainer());
        }
    }

    /**
     * Refresca el control
     */
    refresh() {
        if (this.control && this.control.getContainer()) {
            this.updateControlContent(this.control.getContainer());
        }
    }
}

// Variable global para acceso desde HTML
let globalLayerManager = null;
