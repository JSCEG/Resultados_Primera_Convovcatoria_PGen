/**
 * Project Detail Modal System
 * Gestiona la visualización de detalles de proyectos con análisis de capas
 */

class ProjectDetailModal {
    constructor() {
        this.modal = null;
        this.currentProject = null;
        this.analysisResults = null;
        this.detailMap = null;
        this.detailMapLayers = [];
        this.init();
    }

    init() {
        // Crear el modal HTML
        this.createModalHTML();
        // Cargar evento de cierre
        this.setupEventListeners();
    }

    createModalHTML() {
        const modalHTML = `
        <div id="projectDetailModal" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm bg-black/40" style="display: none;">
            <div class="bg-white dark:bg-gray-900 w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700">
                
                <!-- Header -->
                <div class="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-start">
                    <div class="flex-1">
                        <div class="flex items-center gap-3 mb-1">
                            <span class="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" id="projectStatus">
                                En Proceso
                            </span>
                            <span class="text-xs font-medium text-gray-500 dark:text-gray-400" id="projectID">ID: SL-CH-2024-042</span>
                        </div>
                        <h2 class="text-2xl font-bold text-primary dark:text-white" id="projectTitle">Detalle del Proyecto</h2>
                        <p class="text-gray-500 dark:text-gray-400 text-sm mt-1" id="projectLocation">Ubicación: Por definir</p>
                    </div>
                    <button class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors" onclick="projectDetailModal.close()">
                        <span class="material-icons-round text-gray-400">close</span>
                    </button>
                </div>

                <!-- Tabs -->
                <div class="px-8 bg-gray-50 dark:bg-gray-800/50 flex gap-8 border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
                    <button class="tab-button py-4 border-b-2 border-primary text-primary font-semibold text-sm whitespace-nowrap" data-tab="general">
                        Información General
                    </button>
                    <button class="tab-button py-4 border-b-2 border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-medium text-sm transition-all whitespace-nowrap" data-tab="analysis">
                        Análisis de Capas
                    </button>
                    <button class="tab-button py-4 border-b-2 border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-medium text-sm transition-all whitespace-nowrap" data-tab="location">
                        Ubicación Geográfica
                    </button>
                </div>

                <!-- Content -->
                <div class="flex-1 overflow-y-auto p-8">
                    
                    <!-- Tab: General -->
                    <div id="tab-general" class="tab-content">
                        <div class="grid grid-cols-12 gap-8">
                            <div class="col-span-12 lg:col-span-8 space-y-8">
                                <!-- Resumen -->
                                <div>
                                    <h3 class="text-sm font-bold text-primary uppercase tracking-wider mb-4">Resumen del Proyecto</h3>
                                    <div class="grid grid-cols-2 md:grid-cols-3 gap-6" id="projectSummaryGrid">
                                        <div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700">
                                            <span class="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase block mb-1">Capacidad</span>
                                            <span class="text-xl font-bold text-gray-800 dark:text-white">-</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Descripción -->
                                <div>
                                    <h3 class="text-sm font-bold text-primary uppercase tracking-wider mb-4">Descripción Técnica</h3>
                                    <div class="space-y-4 text-gray-600 dark:text-gray-300 text-sm leading-relaxed" id="projectDescription">
                                        <p>Proyecto en análisis inicial...</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Sidebar -->
                            <div class="col-span-12 lg:col-span-4 space-y-6">
                                <!-- Imagen -->
                                <div class="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 h-48">
                                    <div class="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                                        <span class="material-icons-round text-primary/30 text-6xl">image</span>
                                    </div>
                                </div>

                                <!-- Contacto -->
                                <div class="p-5 rounded-2xl bg-primary/5 border border-primary/10">
                                    <h4 class="text-xs font-bold text-primary uppercase tracking-widest mb-4">Información de Contacto</h4>
                                    <div class="space-y-4" id="projectContact">
                                        <div>
                                            <span class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase block">Responsable</span>
                                            <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">-</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Tab: Analysis -->
                    <div id="tab-analysis" class="tab-content" style="display: none;">
                        <div class="space-y-6">
                            <div class="flex justify-between items-center">
                                <div>
                                    <h3 class="text-sm font-bold text-primary uppercase tracking-wider mb-1">Análisis de Capas</h3>
                                    <p class="text-sm text-gray-500 dark:text-gray-400">Ejecuta un análisis espacial completo del proyecto</p>
                                </div>
                                <button onclick="projectDetailModal.runLayerAnalysis()" class="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:brightness-110 transition-all flex items-center gap-2">
                                    <span class="material-icons-round text-sm">play_arrow</span>
                                    Ejecutar Análisis
                                </button>
                            </div>

                            <!-- Analysis Results -->
                            <div id="analysisResults" class="space-y-4">
                                <div class="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-center">
                                    <span class="material-icons-round text-gray-300 text-5xl block mb-2">analytics</span>
                                    <p class="text-gray-500 dark:text-gray-400">Haz clic en "Ejecutar Análisis" para comenzar</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Tab: Location -->
                    <div id="tab-location" class="tab-content" style="display: none;">
                        <div class="space-y-6">
                            <h3 class="text-sm font-bold text-primary uppercase tracking-wider">Ubicación Geográfica</h3>
                            <div class="w-full h-96 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 overflow-hidden">
                                <div id="detailMapContainer" class="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                    <span class="material-icons-round text-gray-400 text-4xl">map</span>
                                </div>
                            </div>
                            <div id="geoInfo" class="grid grid-cols-2 gap-4 text-sm">
                                <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                                    <span class="text-[10px] text-gray-400 font-bold uppercase block mb-1">Latitud</span>
                                    <span class="font-semibold text-gray-800 dark:text-white">-</span>
                                </div>
                                <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                                    <span class="text-[10px] text-gray-400 font-bold uppercase block mb-1">Longitud</span>
                                    <span class="font-semibold text-gray-800 dark:text-white">-</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="px-8 py-5 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
                    <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span class="material-icons-round text-sm">update</span>
                        <span id="updateTime">Última actualización: ahora</span>
                    </div>
                    <div class="flex gap-3">
                        <button class="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            Descargar Reporte
                        </button>
                        <button class="px-8 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:brightness-110 transition-all">
                            Editar Proyecto
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `;

        // Insertar HTML en el body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('projectDetailModal');
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.closest('.tab-button').dataset.tab;
                this.switchTab(tabName);
            });
        });
    }

    switchTab(tabName) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.style.display = 'none';
        });

        // Remove active state from all buttons
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('border-primary', 'text-primary');
            btn.classList.add('border-transparent', 'text-gray-500', 'dark:text-gray-400');
        });

        // Show selected tab
        const selectedTab = document.getElementById(`tab-${tabName}`);
        if (selectedTab) {
            selectedTab.style.display = 'block';

            // Si es la pestaña de ubicación, inicializar o invalidar el tamaño del mapa
            if (tabName === 'location') {
                this.initDetailMap();
            }
        }

        // Set active button
        const activeBtn = document.querySelector(`.tab-button[data-tab="${tabName}"]`);
        if (activeBtn) {
            activeBtn.classList.add('border-primary', 'text-primary');
            activeBtn.classList.remove('border-transparent', 'text-gray-500', 'dark:text-gray-400');
        }
    }

    open(project) {
        this.currentProject = project;
        this.populateProjectData(project);
        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        this.switchTab('general');
    }

    openAnalysis(project) {
        this.currentProject = project;
        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        this.switchTab('analysis');
        // Auto-run analysis
        setTimeout(() => {
            this.runLayerAnalysis();
        }, 300);
    }

    close() {
        this.modal.style.display = 'none';
        document.body.style.overflow = '';
        this.analysisResults = null;
    }

    populateProjectData(project) {
        // Actualizar header
        document.getElementById('projectStatus').textContent = project.status || 'En Proceso';
        document.getElementById('projectID').textContent = `ID: ${project.id || 'N/A'}`;
        document.getElementById('projectTitle').textContent = project.name || 'Proyecto sin nombre';
        document.getElementById('projectLocation').textContent = `Ubicación: ${project.location || 'Por definir'}`;

        // Limpiar mapa de detalle si ya existe para cargar nueva data
        this.clearDetailMap();

        // Actualizar resumen
        let summaryHTML = '';
        if (project.specs) {
            Object.entries(project.specs).forEach(([key, value]) => {
                summaryHTML += `
                    <div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700">
                        <span class="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase block mb-1">${key}</span>
                        <span class="text-xl font-bold text-gray-800 dark:text-white">${value}</span>
                    </div>
                `;
            });
        }
        document.getElementById('projectSummaryGrid').innerHTML = summaryHTML;

        // Descripción
        document.getElementById('projectDescription').innerHTML =
            `<p>${project.description || 'Descripción técnica del proyecto'}</p>`;

        // Contacto
        document.getElementById('projectContact').innerHTML = `
            <div>
                <span class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase block">Responsable</span>
                <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">${project.contact?.name || '-'}</span>
            </div>
            <div>
                <span class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase block">Empresa Operadora</span>
                <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">${project.contact?.company || '-'}</span>
            </div>
        `;

        // Información geográfica
        if (project.coordinates) {
            document.querySelector('[id="geoInfo"] .p-4:nth-child(1) span:last-child').textContent =
                project.coordinates.lat.toFixed(6);
            document.querySelector('[id="geoInfo"] .p-4:nth-child(2) span:last-child').textContent =
                project.coordinates.lng.toFixed(6);
        }
    }

    async runLayerAnalysis() {
        if (!this.currentProject) return;

        // Limpiar capas previas si existen
        this.clearAnalysisLayers();

        // Mostrar estado de carga
        const resultsDiv = document.getElementById('analysisResults');
        resultsDiv.innerHTML = `
            <div class="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <div class="flex items-center justify-center gap-3">
                    <div class="animate-spin text-primary">
                        <span class="material-icons-round">sync</span>
                    </div>
                    <p class="text-gray-600 dark:text-gray-400">Ejecutando análisis espacial detallado...</p>
                </div>
            </div>
        `;

        try {
            const project = this.currentProject;
            // Asegurarnos de tener un GeoJSON del proyecto para Turf
            const projectGeo = this.getProjectGeoJSON(project);

            const results = {
                layers: [],
                summary: {
                    totalIntersections: 0,
                    riskLevel: 'Bajo'
                }
            };

            this.analysisLayers = [];

            // Procesar cada capa del catálogo
            for (const entry of LAYERS_REGISTRY) {
                try {
                    const layerGeo = await this.fetchLayer(entry.url);
                    const analysis = this.analyzeLayer(projectGeo, layerGeo, entry);

                    if (analysis.intersected) {
                        // Pasamos el ID del layer al result para usarlo en el toggle
                        analysis.id = entry.id;
                        results.layers.push(analysis);
                        results.summary.totalIntersections += analysis.count;

                        // "Pintar" la capa en el mapa (solo las geometrías recortadas)
                        this.visualizeIntersection(analysis.clippedHits || analysis.hits, entry);

                        // Guardar referencia para el toggle del mapa principal
                        if (!this.mainMapLayersMap) this.mainMapLayersMap = {};
                        const mainLayer = this.analysisLayers[this.analysisLayers.length - 1];
                        this.mainMapLayersMap[entry.id] = mainLayer;
                    } else {
                        results.layers.push({
                            id: entry.id,
                            name: entry.name,
                            intersected: false,
                            count: 0,
                            distance: 'Fuera de rango'
                        });
                    }
                } catch (err) {
                    console.error(`Error analizando capa ${entry.name}:`, err);
                }
            }

            // Calcular nivel de riesgo (lógica simple para el demo)
            if (results.summary.totalIntersections > 10) results.summary.riskLevel = 'Crítico';
            else if (results.summary.totalIntersections > 5) results.summary.riskLevel = 'Alto';
            else if (results.summary.totalIntersections > 0) results.summary.riskLevel = 'Moderado';

            this.analysisResults = results;
            this.displayAnalysisResults(results);

            // Ajustar vista del mapa general para ver los hallazgos si hay capas visibles
            if (this.analysisLayers.length > 0 && window.map) {
                const group = L.featureGroup(this.analysisLayers);
                window.map.fitBounds(group.getBounds(), { padding: [50, 50] });
            }

            // Sincronizar con el mini-mapa del modal si existe
            this.syncDetailMapWithAnalysis();

            // Añadir leyenda al mini-mapa
            this.addLegendToDetailMap();

            // Activar modo análisis en el Global Layer Manager
            if (window.globalLayerManager) {
                const projectGeo = this.getProjectGeoJSON(this.currentProject);
                window.globalLayerManager.enterAnalysisMode(results, projectGeo);
            }

        } catch (error) {
            console.error('Error en el análisis:', error);
            resultsDiv.innerHTML = `<p class="text-red-500 p-4">Error al ejecutar el análisis: ${error.message}</p>`;
        }
    }

    // Helper para obtener GeoJSON del proyecto actual
    getProjectGeoJSON(project) {
        // Si ya es un feature válido (tiene type: Feature)
        if (project.type === 'Feature') return project;

        // Si tiene geometría pero no es un feature (es lo que estamos enviando desde los popups)
        if (project.geometry) {
            return {
                type: 'Feature',
                geometry: project.geometry,
                properties: {
                    id: project.id,
                    name: project.name,
                    description: project.description
                }
            };
        }

        // Si solo tiene coordenadas y es un punto
        if (project.coordinates) {
            return {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [project.coordinates.lng, project.coordinates.lat]
                },
                properties: project
            };
        }
        throw new Error('Geometría del proyecto no válida para análisis');
    }

    // Cache simple para capas GeoJSON
    async fetchLayer(url) {
        if (!this._layerCache) this._layerCache = {};
        if (this._layerCache[url]) return this._layerCache[url];

        // Intentar fetch normal
        let response = await fetch(url);

        // Si falla con 404, intentar reemplazar espacios con guiones bajos (algunos CDNs prefieren esto)
        if (!response.ok && response.status === 404 && url.includes('%20')) {
            const alternativeUrl = url.replace(/%20/g, '_');
            console.warn(`404 detected. Trying alternative URL: ${alternativeUrl}`);
            response = await fetch(alternativeUrl);
        }

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        this._layerCache[url] = data;
        return data;
    }

    analyzeLayer(projectGeo, layerGeo, entry) {
        const feats = layerGeo.features || [];
        const hits = [];
        const clippedHits = []; // Features recortados por el polígono

        for (const f of feats) {
            let intersected = false;
            let clippedFeature = null;

            try {
                if (entry.kind === "points") {
                    // Si el proyecto es un punto, buscar cercanía o coincidencia exacta (demo: punto en polígono si la capa es puntos? No, es revés)
                    // Si la capa es puntos y el proyecto es un polígono o punto
                    if (projectGeo.geometry.type === "Point") {
                        // Distancia mínima para puntos (ej: 5km)
                        const distance = turf.distance(projectGeo, f);
                        if (distance < 5) {
                            intersected = true;
                            clippedFeature = f; // Los puntos no se recortan
                        }
                    } else {
                        intersected = turf.booleanPointInPolygon(f, projectGeo);
                        if (intersected) clippedFeature = f;
                    }
                } else {
                    // Para líneas y polígonos, hacer spatial clipping
                    if (turf.booleanIntersects(f, projectGeo)) {
                        intersected = true;

                        // Intentar recortar la geometría usando turf.intersect
                        try {
                            // turf.intersect solo funciona con polígonos
                            if (f.geometry.type.includes('Polygon') && projectGeo.geometry.type.includes('Polygon')) {
                                const intersection = turf.intersect(f, projectGeo);
                                if (intersection) {
                                    clippedFeature = {
                                        type: 'Feature',
                                        geometry: intersection.geometry,
                                        properties: f.properties
                                    };
                                } else {
                                    clippedFeature = f;
                                }
                            } else {
                                clippedFeature = f; // Líneas: mostrar completas por ahora
                            }
                        } catch (clipError) {
                            console.warn('Error al recortar geometría:', clipError);
                            clippedFeature = f;
                        }
                    }
                }
            } catch (e) {
                // Silencioso para features mal formados
            }

            if (intersected && clippedFeature) {
                hits.push(f); // Original para análisis
                clippedHits.push(clippedFeature); // Recortado para visualización
            }
        }

        const result = {
            name: entry.name,
            intersected: hits.length > 0,
            count: hits.length,
            hits: hits, // Originales para análisis
            clippedHits: clippedHits, // Recortados para visualización
            distance: hits.length > 0 ? 'En área' : 'N/A',
            groups: {}
        };

        // Agregados por campo
        if (entry.analyze?.groupBy && hits.length > 0) {
            entry.analyze.groupBy.forEach(gKey => {
                const groupCounts = {};
                hits.forEach(h => {
                    const val = h.properties[gKey] || 'N/D';
                    groupCounts[val] = (groupCounts[val] || 0) + 1;
                });
                result.groups[gKey] = groupCounts;
            });
        }

        return result;
    }

    visualizeIntersection(hits, entry) {
        if (!window.map || !hits.length) return;

        const layer = L.geoJSON(hits, {
            style: entry.kind !== "points" ? () => entry.style : undefined,
            pointToLayer: entry.kind === "points"
                ? (ft, latlng) => L.circleMarker(latlng, entry.style)
                : undefined,
            onEachFeature: (ft, lyr) => {
                let popupContent = `<div class="p-2 font-sans">
                    <h5 class="font-bold text-primary border-b mb-2 pb-1">${entry.name}</h5>
                    <div class="max-h-32 overflow-y-auto text-xs space-y-1">`;

                // Mostrar propiedades más relevantes
                const relevantProps = ['Razón_social', 'nombre', 'nom_geo', 'Field1', 'NumeroPermiso', 'capacidad_'];
                let propFound = false;

                Object.entries(ft.properties).forEach(([k, v]) => {
                    if (relevantProps.includes(k) || (typeof v !== 'object' && String(v).length < 50)) {
                        popupContent += `<div><span class="font-semibold text-gray-500">${k}:</span> ${v}</div>`;
                        propFound = true;
                    }
                });

                if (!propFound) popupContent += `<p class="italic">Haga clic para ver detalles en panel.</p>`;

                popupContent += `</div></div>`;
                lyr.bindPopup(popupContent);
            }
        });

        layer.addTo(window.map);
        this.analysisLayers.push(layer);
    }

    clearAnalysisLayers() {
        if (this.analysisLayers && window.map) {
            this.analysisLayers.forEach(l => window.map.removeLayer(l));
        }
        this.analysisLayers = [];
    }

    displayAnalysisResults(analysisData) {
        const resultsDiv = document.getElementById('analysisResults');
        if (!analysisData) {
            resultsDiv.innerHTML = `
                <div class="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-center">
                    <span class="material-icons-round text-gray-300 text-5xl block mb-2">analytics</span>
                    <p class="text-gray-500 dark:text-gray-400">Haz clic en "Ejecutar Análisis" para comenzar</p>
                </div>
            `;
            return;
        }

        let resultsHTML = `
            <div class="space-y-6">
                <!-- Resumen de Análisis -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                        <span class="text-[10px] text-yellow-700 dark:text-yellow-600 font-bold uppercase block mb-1">Hallazgos Totales</span>
                        <span class="text-2xl font-bold text-yellow-800 dark:text-yellow-400">${analysisData.summary.totalIntersections}</span>
                    </div>
                    <div class="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                        <span class="text-[10px] text-blue-700 dark:text-blue-600 font-bold uppercase block mb-1">Capas Analizadas</span>
                        <span class="text-2xl font-bold text-blue-800 dark:text-blue-400">${LAYERS_REGISTRY.length}</span>
                    </div>
                    <div class="p-4 rounded-xl ${analysisData.summary.riskLevel === 'Crítico' || analysisData.summary.riskLevel === 'Alto' ? 'bg-red-50 dark:bg-red-900/20 border-red-200' : 'bg-green-50 dark:bg-green-900/20 border-green-200'} border">
                        <span class="text-[10px] font-bold uppercase block mb-1">Grado de Interacción</span>
                        <span class="text-2xl font-bold ${analysisData.summary.riskLevel === 'Crítico' || analysisData.summary.riskLevel === 'Alto' ? 'text-red-700 dark:text-red-400' : 'text-green-700 dark:text-green-400'}">${analysisData.summary.riskLevel}</span>
                    </div>
                </div>

                <!-- Detalles de Capas -->
                <div>
                    <h4 class="text-sm font-bold text-primary uppercase tracking-wider mb-3">Intersecciones de Capas</h4>
                    <div class="space-y-3">
        `;

        analysisData.layers.forEach(layer => {
            const statusIcon = layer.intersected ?
                '<span class="material-icons-round text-red-500 text-sm">warning</span>' :
                '<span class="material-icons-round text-green-500 text-sm">check_circle</span>';

            // Obtener el color de la capa del registro
            const layerEntry = LAYERS_REGISTRY.find(l => l.id === layer.id);
            const layerColor = layerEntry ? (layerEntry.style.fillColor || layerEntry.style.color || '#999') : '#999';

            resultsHTML += `
                <div class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 ${layer.intersected ? 'bg-white dark:bg-gray-800 shadow-sm border-l-4 border-l-primary' : 'bg-gray-50/50 dark:bg-gray-900/30 opacity-60'}">
                    <div class="flex items-start justify-between">
                        <div class="flex items-center gap-3">
                            ${layer.intersected
                    ? `<input type="checkbox" checked 
                                    class="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary cursor-pointer"
                                    onchange="projectDetailModal.toggleLayerVisibility('${layer.id}', this.checked); projectDetailModal.toggleMainMapLayer('${layer.id}', this.checked);"
                                    title="Ocultar/Mostrar capa en ambos mapas">`
                    : statusIcon}
                            <div class="w-4 h-4 rounded flex-shrink-0" style="background-color: ${layerColor}; border: 1px solid rgba(0,0,0,0.2);" title="Color de la capa"></div>
                            <div>
                                <p class="text-sm font-bold text-gray-800 dark:text-white">${layer.name}</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">${layer.intersected ? layer.count + ' elementos encontrados en el área' : 'Sin intersecciones detectadas'}</p>
                            </div>
                        </div>
                        <span class="text-[10px] font-bold py-1 px-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase">${layer.distance}</span>
                    </div>
                </div>
            `;

            if (layer.intersected && layer.hits) {
                // Listado detallado de hallazgos
                resultsHTML += `
                    <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <button onclick="this.nextElementSibling.classList.toggle('hidden')" class="text-[10px] font-bold text-primary flex items-center gap-1 uppercase hover:underline mb-2">
                            <span class="material-icons-round text-xs">list</span>
                            Ver Entidades Identificadas (${layer.count})
                        </button>
                        <div class="hidden space-y-2">
                            <div class="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                `;

                layer.hits.forEach(hit => {
                    const hitName = hit.properties.Razón_social || hit.properties.nombre || hit.properties.nom_geo || hit.properties.nombre_lt || hit.properties.Field1 || 'Entidad sin nombre';
                    const hitInfo = hit.properties.Tecnología || hit.properties.tension_kv ? `${hit.properties.Tecnología || hit.properties.tension_kv + ' kV'}` : '';

                    resultsHTML += `
                        <div class="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 text-[11px]">
                            <span class="font-medium text-gray-700 dark:text-gray-300 truncate mr-2" title="${hitName}">${hitName}</span>
                            ${hitInfo ? `<span class="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold whitespace-nowrap">${hitInfo}</span>` : ''}
                        </div>
                    `;
                });

                resultsHTML += `
                            </div>
                        </div>
                    </div>
                `;

                // Agregados por grupo (si existen)
                if (layer.groups) {
                    resultsHTML += `<div class="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-2">`;
                    Object.entries(layer.groups).forEach(([key, values]) => {
                        resultsHTML += `<div>
                            <span class="text-[9px] font-bold text-gray-400 uppercase block">${key}</span>
                            <div class="mt-1 space-y-1">`;

                        Object.entries(values).slice(0, 3).forEach(([label, count]) => {
                            resultsHTML += `<div class="flex justify-between text-[11px] text-gray-600 dark:text-gray-400">
                                <span class="truncate pr-2">${label}</span>
                                <span class="font-bold">${count}</span>
                            </div>`;
                        });

                        if (Object.keys(values).length > 3) {
                            resultsHTML += `<span class="text-[9px] text-primary italic">... y ${Object.keys(values).length - 3} más</span>`;
                        }

                        resultsHTML += `</div></div>`;
                    });
                    resultsHTML += `</div>`;
                }
            }

            resultsHTML += `</div>`;
        });

        resultsHTML += `
                    </div>
                </div>

                <!-- Acciones -->
                <div class="flex gap-3">
                    <button onclick="projectDetailModal.exportAnalysis()" class="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                        <span class="material-icons-round text-sm">download</span>
                        Exportar Reporte JSON
                    </button>
                    <button onclick="projectDetailModal.close()" class="flex-1 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:brightness-110 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                        <span class="material-icons-round text-sm">expand</span>
                        Ver en Mapa General
                    </button>
                </div>
            </div>
        `;

        resultsDiv.innerHTML = resultsHTML;
    }

    exportAnalysis() {
        if (!this.analysisResults) return;

        const data = JSON.stringify({
            proyecto: this.currentProject.name,
            id: this.currentProject.id,
            fecha_analisis: new Date().toISOString(),
            resultados: this.analysisResults
        }, null, 2);

        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analisis-espacial-${this.currentProject.id}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
    initDetailMap() {
        if (!this.currentProject) return;

        // Si el mapa ya existe, solo invalidar el tamaño para que se renderice correctamente
        if (this.detailMap) {
            setTimeout(() => {
                this.detailMap.invalidateSize();
                this.centerDetailMapOnProject();
            }, 100);
            return;
        }

        const container = document.getElementById('detailMapContainer');
        if (!container) return;
        container.innerHTML = ''; // Limpiar el placeholder

        const { lat, lng } = this.currentProject.coordinates;

        // Crear el mapa
        this.detailMap = L.map('detailMapContainer', {
            zoomControl: false,
            attributionControl: false
        }).setView([lat, lng], 14);

        // Crear Panes para orden de apilamiento (z-index)
        this.detailMap.createPane('polygonsPane');
        this.detailMap.getPane('polygonsPane').style.zIndex = 400;

        this.detailMap.createPane('linesPane');
        this.detailMap.getPane('linesPane').style.zIndex = 450;

        this.detailMap.createPane('pointsPane');
        this.detailMap.getPane('pointsPane').style.zIndex = 500;

        // Añadir controles de zoom en la esquina superior derecha
        L.control.zoom({ position: 'topright' }).addTo(this.detailMap);

        // Capa base (usando MapTiler para consistencia)
        const mtKey = 'v7u9wI1y1jF4C3kE5T6X'; // Mismo key que en index.html
        L.tileLayer(`https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=${mtKey}`, {
            maxZoom: 19
        }).addTo(this.detailMap);

        // Capa de satélite alternativa (opcional para el mini-mapa)
        this.satelliteLayer = L.tileLayer(`https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=${mtKey}`, {
            maxZoom: 19
        });

        // Pintar el proyecto actual
        this.visualizeProjectOnDetailMap();

        // Si ya hay hallazgos de un análisis previo, pintarlos
        if (this.analysisResults) {
            this.syncDetailMapWithAnalysis();
        }
    }

    centerDetailMapOnProject() {
        if (!this.detailMap || !this.currentProject) return;

        const { lat, lng } = this.currentProject.coordinates;
        this.detailMap.setView([lat, lng], 14);
    }

    visualizeProjectOnDetailMap() {
        if (!this.detailMap || !this.currentProject) return;

        const projectGeo = this.getProjectGeoJSON(this.currentProject);

        const style = {
            color: '#9B2247',
            weight: 3,
            fillColor: '#9B2247',
            fillOpacity: 0.3
        };

        const projectLayer = L.geoJSON(projectGeo, {
            style: style,
            pointToLayer: (ft, latlng) => L.circleMarker(latlng, {
                radius: 8,
                fillColor: '#9B2247',
                color: '#fff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
            })
        });

        projectLayer.addTo(this.detailMap);
        this.detailMapLayers.push(projectLayer);

        // Ajustar zoom si es un polígono
        if (projectGeo.geometry.type !== 'Point') {
            this.detailMap.fitBounds(projectLayer.getBounds(), { padding: [20, 20] });
        }
    }

    syncDetailMapWithAnalysis() {
        if (!this.detailMap || !this.analysisResults) return;

        this.analysisResults.layers.forEach((layerRes, idx) => {
            if (layerRes.intersected && layerRes.hits) {
                const entry = LAYERS_REGISTRY.find(l => l.name === layerRes.name);
                if (entry) {
                    this.visualizeOnDetailMap(layerRes.hits, entry);
                }
            }
        });

        // Ajustar bounds para incluir todos los hallazgos
        if (this.detailMapLayers.length > 0) {
            const group = L.featureGroup(this.detailMapLayers);
            this.detailMap.fitBounds(group.getBounds(), { padding: [30, 30] });
        }
    }

    visualizeOnDetailMap(hits, entry) {
        if (!this.detailMap || !hits.length) return;

        let paneName = 'polygonsPane';
        if (entry.kind === 'lines') paneName = 'linesPane';
        if (entry.kind === 'points') paneName = 'pointsPane';

        const layer = L.geoJSON(hits, {
            pane: paneName, // Asignar al pane correcto
            style: entry.kind !== "points" ? () => entry.style : undefined,
            pointToLayer: entry.kind === "points"
                ? (ft, latlng) => L.circleMarker(latlng, { ...entry.style, radius: 4 })
                : undefined,
            onEachFeature: (ft, lyr) => {
                lyr.bindPopup(`<div class="text-xs font-bold text-primary">${entry.name}</div>`);
            }
        });

        layer.addTo(this.detailMap);

        // Guardar referencia con ID para el toggle
        if (!this.detailMapLayersMap) this.detailMapLayersMap = {};
        this.detailMapLayersMap[entry.id] = layer;

        this.detailMapLayers.push(layer);
    }

    toggleLayerVisibility(layerId, isVisible) {
        if (!this.detailMap || !this.detailMapLayersMap || !this.detailMapLayersMap[layerId]) return;

        const layer = this.detailMapLayersMap[layerId];
        if (isVisible) {
            if (!this.detailMap.hasLayer(layer)) {
                this.detailMap.addLayer(layer);
            }
        } else {
            if (this.detailMap.hasLayer(layer)) {
                this.detailMap.removeLayer(layer);
            }
        }
    }

    toggleMainMapLayer(layerId, isVisible) {
        if (!window.map || !this.mainMapLayersMap || !this.mainMapLayersMap[layerId]) return;

        const layer = this.mainMapLayersMap[layerId];
        if (isVisible) {
            if (!window.map.hasLayer(layer)) {
                window.map.addLayer(layer);
            }
        } else {
            if (window.map.hasLayer(layer)) {
                window.map.removeLayer(layer);
            }
        }
    }

    addLegendToDetailMap() {
        if (!this.detailMap || !this.analysisResults) return;

        // Remover leyenda previa si existe
        if (this.legendControl) {
            this.detailMap.removeControl(this.legendControl);
        }

        // Crear control de leyenda
        const legend = L.control({ position: 'bottomright' });

        legend.onAdd = () => {
            const div = L.DomUtil.create('div', 'info legend');
            div.style.background = 'white';
            div.style.padding = '10px';
            div.style.borderRadius = '8px';
            div.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
            div.style.fontSize = '11px';
            div.style.lineHeight = '18px';

            let html = '<div style="font-weight: bold; margin-bottom: 6px; font-size: 10px; text-transform: uppercase; color: #9B2247;">Capas Analizadas</div>';

            this.analysisResults.layers.forEach(layer => {
                if (layer.intersected) {
                    const layerEntry = LAYERS_REGISTRY.find(l => l.id === layer.id);
                    if (layerEntry) {
                        const color = layerEntry.style.fillColor || layerEntry.style.color || '#999';
                        html += `
                            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
                                <div style="width: 14px; height: 14px; background-color: ${color}; border: 1px solid rgba(0,0,0,0.3); border-radius: 2px; flex-shrink: 0;"></div>
                                <span style="font-size: 10px;">${layer.name}</span>
                            </div>
                        `;
                    }
                }
            });

            div.innerHTML = html;
            return div;
        };

        legend.addTo(this.detailMap);
        this.legendControl = legend;
    }

    addMainMapLayerControl() {
        console.log('[DEBUG] addMainMapLayerControl - window.map:', window.map, 'analysisResults:', this.analysisResults);
        if (!window.map || !this.analysisResults) return;

        // Remover control previo si existe
        if (this.mainMapControl) {
            window.map.removeControl(this.mainMapControl);
        }

        // Crear control de capas para el mapa principal
        const layerControl = L.control({ position: 'bottomright' });

        layerControl.onAdd = () => {
            const div = L.DomUtil.create('div', 'analysis-layers-control');
            div.style.display = 'block';
            div.style.background = 'white';
            div.style.padding = '14px';
            div.style.borderRadius = '10px';
            div.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
            div.style.maxWidth = '300px';
            div.style.maxHeight = '450px';
            div.style.overflowY = 'auto';
            div.style.zIndex = '1000';
            div.style.border = '2px solid #9B2247';
            div.style.marginTop = '10px';
            div.style.position = 'relative';

            let html = '<div style="font-weight: bold; margin-bottom: 10px; font-size: 12px; text-transform: uppercase; color: #9B2247; border-bottom: 2px solid #9B2247; padding-bottom: 6px; display: flex; align-items: center; gap: 6px;"><span class="material-icons-round" style="font-size: 16px;">layers</span>Capas Analizadas</div>';

            const intersectedLayers = this.analysisResults.layers.filter(l => l.intersected);

            if (intersectedLayers.length === 0) {
                html += '<div style="font-size: 11px; color: #666; font-style: italic; padding: 8px;">No hay capas con hallazgos</div>';
            } else {
                intersectedLayers.forEach(layer => {
                    const layerEntry = LAYERS_REGISTRY.find(l => l.id === layer.id);
                    if (layerEntry) {
                        const color = layerEntry.style.fillColor || layerEntry.style.color || '#999';
                        html += `
                            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px; padding: 8px; border-radius: 6px; background: #f9fafb; border: 1px solid #e5e7eb; transition: all 0.2s;" onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='#f9fafb'">
                                <input type="checkbox" 
                                    id="mainmap-layer-${layer.id}" 
                                    checked 
                                    style="cursor: pointer; width: 18px; height: 18px; flex-shrink: 0;"
                                    onchange="projectDetailModal.toggleMainMapLayer('${layer.id}', this.checked)">
                                <div style="width: 14px; height: 14px; background-color: ${color}; border: 1px solid rgba(0,0,0,0.3); border-radius: 3px; flex-shrink: 0;"></div>
                                <label for="mainmap-layer-${layer.id}" style="font-size: 11px; cursor: pointer; flex: 1; margin: 0; font-weight: 500;">${layer.name} <span style="color: #9B2247; font-weight: bold;">(${layer.count})</span></label>
                            </div>
                        `;
                    }
                });
            }

            div.innerHTML = html;

            // Prevenir que los clicks en el control se propaguen al mapa
            L.DomEvent.disableClickPropagation(div);
            L.DomEvent.disableScrollPropagation(div);

            return div;
        };

        layerControl.addTo(window.map);
        this.mainMapControl = layerControl;
    }

    clearDetailMap() {
        if (this.detailMap) {
            this.detailMapLayers.forEach(l => this.detailMap.removeLayer(l));
            this.detailMapLayers = [];
            this.detailMapLayersMap = {};
            // No destruimos el mapa, solo lo limpiamos para reuso
        }
    }
}

// Instanciar el modal globalmente
const projectDetailModal = new ProjectDetailModal();
