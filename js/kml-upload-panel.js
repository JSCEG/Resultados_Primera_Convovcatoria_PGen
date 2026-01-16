/**
 * KML Upload Panel
 * Panel para cargar archivos KML y mostrar datos de demostración
 */

class KMLUploadPanel {
    constructor(kmlHandler) {
        this.kmlHandler = kmlHandler;
        this.init();
    }

    init() {
        this.createPanel();
        this.setupEventListeners();
    }

    createPanel() {
        const panelHTML = `
        <div id="kmlUploadPanel" class="fixed bottom-6 right-6 z-40 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all transform">
            
            <!-- Header -->
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary to-secondary">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <span class="material-icons-round text-white">upload_file</span>
                        <h3 class="text-white font-bold text-sm">Cargar Datos</h3>
                    </div>
                    <button class="p-1 hover:bg-white/20 rounded-lg transition-colors" onclick="kmlUploadPanel.toggleCollapse()">
                        <span class="material-icons-round text-white text-sm">expand_less</span>
                    </button>
                </div>
            </div>

            <!-- Content -->
            <div id="panelContent" class="p-6 space-y-4">
                
                <!-- Demo Section -->
                <div class="space-y-2">
                    <h4 class="text-xs font-bold text-primary uppercase tracking-widest">Demostración</h4>
                    <button id="loadDemoBtn" class="w-full px-4 py-2.5 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                        <span class="material-icons-round text-sm">play_circle</span>
                        Cargar Datos Demo
                    </button>
                    <p class="text-xs text-gray-500 dark:text-gray-400">3 proyectos de ejemplo para explorar</p>
                </div>

                <div class="h-px bg-gray-200 dark:bg-gray-700"></div>

                <!-- KML Upload Section -->
                <div class="space-y-2">
                    <h4 class="text-xs font-bold text-primary uppercase tracking-widest">Cargar KML</h4>
                    
                    <div id="dropZone" class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all" ondrop="kmlUploadPanel.handleDrop(event)" ondragover="event.preventDefault()" ondragenter="this.classList.add('border-primary', 'bg-primary/5');" ondragleave="this.classList.remove('border-primary', 'bg-primary/5');">
                        <span class="material-icons-round text-gray-400 text-3xl block mb-2">cloud_upload</span>
                        <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">
                            <strong>Arrastra un archivo KML</strong> o
                        </p>
                        <label class="text-xs text-primary cursor-pointer font-semibold hover:underline">
                            selecciona uno
                            <input type="file" accept=".kml" id="kmlInput" style="display: none;" onchange="kmlUploadPanel.handleFileSelect(event)">
                        </label>
                    </div>
                </div>

                <!-- Loaded Layers -->
                <div class="space-y-2" id="layersList" style="display: none;">
                    <h4 class="text-xs font-bold text-primary uppercase tracking-widest">Capas Cargadas</h4>
                    <div id="layerItems" class="space-y-2">
                        <!-- Dinámico -->
                    </div>
                </div>

                <!-- Status Message -->
                <div id="statusMessage" class="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-400" style="display: none;">
                    <span id="statusText"></span>
                </div>

            </div>

            <!-- Footer -->
            <div class="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-center text-[10px] text-gray-500 dark:text-gray-400">
                Esperando datos KML...
            </div>
        </div>
        `;

        document.body.insertAdjacentHTML('beforeend', panelHTML);
        this.panel = document.getElementById('kmlUploadPanel');
    }

    setupEventListeners() {
        document.getElementById('loadDemoBtn').addEventListener('click', () => {
            this.loadDemoData();
        });
    }

    loadDemoData() {
        const demoData = KMLHandler.createDemoData();

        // Mostrar estado de carga
        this.showStatus('Cargando datos de demostración...', 'info');

        setTimeout(() => {
            // Agregar GeoJSON al mapa
            this.kmlHandler.addGeoJSON(
                demoData,
                'demo-projects',
                {
                    color: '#9B2247',
                    weight: 2,
                    opacity: 0.8,
                    fillOpacity: 0.5
                }
            );

            // Mostrar confirmación
            this.showStatus(`${demoData.features.length} proyectos cargados exitosamente`, 'success');

            // Actualizar lista de capas
            this.updateLayersList();

            // Zoom a los datos
            if (window.map && this.kmlHandler.layers['demo-projects']) {
                const bounds = this.kmlHandler.layers['demo-projects'].getBounds();
                if (bounds.isValid()) {
                    window.map.fitBounds(bounds, { padding: [50, 50] });
                }
            }
        }, 500);
    }

    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processKMLFile(files[0]);
        }
    }

    handleFileSelect(e) {
        const files = e.target.files;
        if (files.length > 0) {
            this.processKMLFile(files[0]);
        }
    }

    async processKMLFile(file) {
        if (!file.name.toLowerCase().endsWith('.kml')) {
            this.showStatus('Por favor selecciona un archivo KML', 'error');
            return;
        }

        this.showStatus(`Procesando ${file.name}...`, 'info');

        try {
            const geojson = await this.kmlHandler.loadKML(file);

            // Agregar al mapa
            const layerName = file.name.replace('.kml', '');
            this.kmlHandler.addGeoJSON(geojson, layerName);

            // Actualizar UI
            this.showStatus(`${geojson.features.length} features cargados`, 'success');
            this.updateLayersList();

            // Zoom
            if (window.map && this.kmlHandler.layers[layerName]) {
                const bounds = this.kmlHandler.layers[layerName].getBounds();
                if (bounds.isValid()) {
                    window.map.fitBounds(bounds, { padding: [50, 50] });
                }
            }

            // Iniciar Análisis Automático
            if (window.globalLayerManager && window.turf) {
                this.showStatus('Analizando capas relacionadas...', 'info');
                
                // Mostrar botón de reset
                document.getElementById('resetAnalysisBtn').classList.remove('hidden');

                // Combinar geometrías para crear un área de análisis única
                // turf.combine devuelve un FeatureCollection con un feature MultiGeometry
                const combined = turf.combine(geojson);
                const analysisGeometry = combined.features[0];

                // Transferir propiedades del KML original a la geometría de análisis
                // para que GlobalLayerManager pueda mostrar el nombre y descripción
                if (geojson.features && geojson.features.length > 0) {
                    const firstProps = geojson.features[0].properties || {};
                    analysisGeometry.properties = {
                        name: layerName, // Usar nombre del archivo como fallback
                        description: firstProps.description || `Archivo: ${file.name}`
                    };
                    
                    // Si el primer feature tiene nombre, usarlo (muchos KMLs tienen un Placemark principal)
                    if (firstProps.name) {
                        analysisGeometry.properties.name = firstProps.name;
                    }
                }

                if (analysisGeometry) {
                    // Ejecutar análisis (asíncrono)
                    window.globalLayerManager.performAnalysis(analysisGeometry)
                        .then(results => {
                            const count = results.layers.length;
                            if (count > 0) {
                                this.showStatus(`Análisis: ${count} capas relacionadas encontradas`, 'success');
                            } else {
                                this.showStatus('Análisis: No se encontraron capas relacionadas', 'info');
                            }
                        })
                        .catch(err => {
                            console.error('Error en análisis:', err);
                            this.showStatus('Error en el análisis de capas', 'error');
                        });
                }
            }
        } catch (error) {
            this.showStatus('Error: ' + error.message, 'error');
        }
    }

    updateLayersList() {
        const layersList = document.getElementById('layersList');
        const layerItems = document.getElementById('layerItems');

        const layers = Object.keys(this.kmlHandler.layers);

        if (layers.length === 0) {
            layersList.style.display = 'none';
            return;
        }

        layersList.style.display = 'block';
        layerItems.innerHTML = layers.map(name => `
            <div class="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                <div class="flex items-center gap-2 flex-1">
                    <span class="w-3 h-3 rounded-full bg-primary"></span>
                    <span class="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">${name}</span>
                </div>
                <button class="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors" onclick="kmlUploadPanel.removeLayer('${name}')">
                    <span class="material-icons-round text-xs text-gray-400">close</span>
                </button>
            </div>
        `).join('');
    }

    removeLayer(name) {
        if (this.kmlHandler.layers[name]) {
            window.map.removeLayer(this.kmlHandler.layers[name]);
            delete this.kmlHandler.layers[name];
            this.updateLayersList();
            this.showStatus(`Capa "${name}" removida`, 'info');
        }
    }

    showStatus(message, type = 'info') {
        const statusDiv = document.getElementById('statusMessage');
        const statusText = document.getElementById('statusText');

        statusText.textContent = message;
        statusDiv.style.display = 'block';
        statusDiv.className = `p-3 rounded-lg border text-xs ${type === 'success' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400' :
                type === 'error' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400' :
                    'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400'
            }`;

        // Auto-hide after 3 seconds for success messages
        if (type === 'success') {
            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, 3000);
        }
    }

    toggleCollapse() {
        const content = document.getElementById('panelContent');
        content.style.display = content.style.display === 'none' ? 'block' : 'none';
    }

    /**
     * Resetea el análisis y limpia el mapa
     */
    resetAnalysis() {
        // Limpiar capas KML del mapa
        const layers = Object.keys(this.kmlHandler.layers);
        layers.forEach(name => this.removeLayer(name));
        
        // Reset Global Layer Manager (salir de modo análisis)
        if (window.globalLayerManager) {
            window.globalLayerManager.exitAnalysisMode();
            // Asegurar que todas las capas globales se apaguen o reseteen
            Object.keys(window.globalLayerManager.layerStates).forEach(id => {
                 window.globalLayerManager.toggleLayer(id, false);
            });
            window.globalLayerManager.refresh();
        }

        // Reset UI
        document.getElementById('resetAnalysisBtn').classList.add('hidden');
        document.getElementById('kmlInput').value = ''; // Limpiar input file
        
        // Mensaje
        this.showStatus('Análisis reiniciado. Mapa limpio.', 'info');
    }
}
