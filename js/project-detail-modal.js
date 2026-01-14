/**
 * Project Detail Modal System
 * Gestiona la visualización de detalles de proyectos con análisis de capas
 */

class ProjectDetailModal {
    constructor() {
        this.modal = null;
        this.currentProject = null;
        this.analysisResults = null;
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
        if (selectedTab) selectedTab.style.display = 'block';

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

    runLayerAnalysis() {
        if (!this.currentProject) return;

        // Mostrar estado de carga
        const resultsDiv = document.getElementById('analysisResults');
        resultsDiv.innerHTML = `
            <div class="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <div class="flex items-center justify-center gap-3">
                    <div class="animate-spin">
                        <span class="material-icons-round">hourglass_top</span>
                    </div>
                    <p class="text-gray-600 dark:text-gray-400">Analizando capas...</p>
                </div>
            </div>
        `;

        // Simular análisis (será reemplazado con lógica real)
        setTimeout(() => {
            this.displayAnalysisResults();
        }, 2000);
    }

    displayAnalysisResults() {
        const project = this.currentProject;
        const resultsDiv = document.getElementById('analysisResults');

        // Datos simulados de análisis
        const analysisData = {
            layers: [
                { name: 'Centrales Eléctricas', intersected: true, count: 2, distance: '45.2 km' },
                { name: 'Subestaciones', intersected: true, count: 5, distance: '12.8 km' },
                { name: 'Líneas de Transmisión', intersected: false, count: 0, distance: '89.5 km' },
                { name: 'Municipios', intersected: true, count: 1, distance: 'Dentro' },
                { name: 'Cuerpos de Agua', intersected: false, count: 0, distance: '156.3 km' },
            ],
            summary: {
                totalIntersections: 8,
                areaOfInfluence: '2,450.5 km²',
                riskLevel: 'Moderado'
            }
        };

        this.analysisResults = analysisData;

        let resultsHTML = `
            <div class="space-y-6">
                <!-- Resumen de Análisis -->
                <div class="grid grid-cols-3 gap-4">
                    <div class="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                        <span class="text-[10px] text-yellow-700 dark:text-yellow-600 font-bold uppercase block mb-1">Intersecciones</span>
                        <span class="text-2xl font-bold text-yellow-800 dark:text-yellow-400">${analysisData.summary.totalIntersections}</span>
                    </div>
                    <div class="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                        <span class="text-[10px] text-blue-700 dark:text-blue-600 font-bold uppercase block mb-1">Área de Influencia</span>
                        <span class="text-2xl font-bold text-blue-800 dark:text-blue-400">${analysisData.summary.areaOfInfluence}</span>
                    </div>
                    <div class="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                        <span class="text-[10px] text-red-700 dark:text-red-600 font-bold uppercase block mb-1">Nivel de Riesgo</span>
                        <span class="text-2xl font-bold text-red-800 dark:text-red-400">${analysisData.summary.riskLevel}</span>
                    </div>
                </div>

                <!-- Detalles de Capas -->
                <div>
                    <h4 class="text-sm font-bold text-primary uppercase tracking-wider mb-3">Intersecciones de Capas</h4>
                    <div class="space-y-2">
        `;

        analysisData.layers.forEach(layer => {
            const statusIcon = layer.intersected ?
                '<span class="material-icons-round text-red-500 text-sm">warning</span>' :
                '<span class="material-icons-round text-green-500 text-sm">check_circle</span>';

            resultsHTML += `
                <div class="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 ${layer.intersected ? 'bg-red-50 dark:bg-red-900/10' : 'bg-green-50 dark:bg-green-900/10'}">
                    <div class="flex items-center gap-3 flex-1">
                        ${statusIcon}
                        <div>
                            <p class="text-sm font-semibold text-gray-800 dark:text-white">${layer.name}</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">${layer.intersected ? layer.count + ' intersección(es)' : 'Sin intersecciones'}</p>
                        </div>
                    </div>
                    <span class="text-xs font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap ml-2">${layer.distance}</span>
                </div>
            `;
        });

        resultsHTML += `
                    </div>
                </div>

                <!-- Acciones -->
                <div class="flex gap-3">
                    <button onclick="projectDetailModal.exportAnalysis()" class="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                        <span class="material-icons-round text-sm">download</span>
                        Exportar Análisis
                    </button>
                    <button class="flex-1 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:brightness-110 transition-all flex items-center justify-center gap-2">
                        <span class="material-icons-round text-sm">share</span>
                        Compartir Resultados
                    </button>
                </div>
            </div>
        `;

        resultsDiv.innerHTML = resultsHTML;
    }

    exportAnalysis() {
        if (!this.analysisResults) return;

        const data = JSON.stringify(this.analysisResults, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `análisis-${this.currentProject.id}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Instanciar el modal globalmente
const projectDetailModal = new ProjectDetailModal();
