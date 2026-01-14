/**
 * KML Handler - Gestiona la carga y procesamiento de archivos KML
 */

class KMLHandler {
    constructor(map) {
        this.map = map;
        this.layers = {};
        this.projects = [];
    }

    /**
     * Carga un archivo KML
     */
    loadKML(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const kmlString = e.target.result;
                    const kmlLayer = this.parseKML(kmlString);
                    resolve(kmlLayer);
                } catch (error) {
                    reject(new Error('Error al procesar KML: ' + error.message));
                }
            };

            reader.onerror = () => {
                reject(new Error('Error al leer el archivo'));
            };

            reader.readAsText(file);
        });
    }

    /**
     * Parsea un string KML y extrae features
     */
    parseKML(kmlString) {
        const parser = new DOMParser();
        const kmlDoc = parser.parseFromString(kmlString, 'text/xml');

        if (kmlDoc.getElementsByTagName('parsererror').length > 0) {
            throw new Error('KML inválido');
        }

        const placemarks = kmlDoc.getElementsByTagName('Placemark');
        const features = [];

        for (let placemark of placemarks) {
            const feature = this.parsePlacemark(placemark);
            if (feature) {
                features.push(feature);
            }
        }

        return {
            type: 'FeatureCollection',
            features: features
        };
    }

    /**
     * Parsea un Placemark individual
     */
    parsePlacemark(placemark) {
        const name = placemark.querySelector('name')?.textContent || 'Sin nombre';
        const description = placemark.querySelector('description')?.textContent || '';

        // Buscar geometría
        let geometry = null;
        let type = null;

        const point = placemark.querySelector('Point');
        const linestring = placemark.querySelector('LineString');
        const polygon = placemark.querySelector('Polygon');

        if (point) {
            const coords = point.querySelector('coordinates')?.textContent || '';
            const [lng, lat] = coords.trim().split(',').map(Number);
            geometry = { coordinates: [lng, lat], type: 'Point' };
            type = 'Point';
        } else if (linestring) {
            const coords = linestring.querySelector('coordinates')?.textContent || '';
            const coordinates = coords.trim().split('\n').map(c =>
                c.trim().split(',').slice(0, 2).map(Number)
            );
            geometry = { coordinates, type: 'LineString' };
            type = 'LineString';
        } else if (polygon) {
            const outerRing = polygon.querySelector('outerBoundaryIs coordinates')?.textContent || '';
            const coordinates = [outerRing.trim().split('\n').map(c =>
                c.trim().split(',').slice(0, 2).map(Number)
            )];
            geometry = { coordinates, type: 'Polygon' };
            type = 'Polygon';
        }

        if (!geometry) return null;

        return {
            type: 'Feature',
            geometry: geometry,
            properties: {
                name: name,
                description: description
            }
        };
    }

    /**
     * Agrega un GeoJSON a la capa del mapa
     */
    addGeoJSON(geojson, layerName, style) {
        const geoJsonLayer = L.geoJSON(geojson, {
            style: style || this.defaultStyle,
            pointToLayer: (feature, latlng) => {
                return L.circleMarker(latlng, {
                    radius: 6,
                    fillColor: '#9B2247',
                    color: '#fff',
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            },
            onEachFeature: (feature, layer) => {
                const popup = this.createPopup(feature);
                layer.bindPopup(popup);
            }
        });

        geoJsonLayer.addTo(this.map);
        this.layers[layerName] = geoJsonLayer;
        return geoJsonLayer;
    }

    /**
     * Crea un popup para un feature
     */
    createPopup(feature) {
        const props = feature.properties;

        // Calcular centro del feature
        let centerLat, centerLng;
        if (feature.geometry.type === 'Point') {
            centerLng = feature.geometry.coordinates[0];
            centerLat = feature.geometry.coordinates[1];
        } else if (feature.geometry.type === 'Polygon') {
            const coords = feature.geometry.coordinates[0];
            const lats = coords.map(c => c[1]);
            const lngs = coords.map(c => c[0]);
            centerLat = (Math.max(...lats) + Math.min(...lats)) / 2;
            centerLng = (Math.max(...lngs) + Math.min(...lngs)) / 2;
        } else if (feature.geometry.type === 'LineString') {
            const coords = feature.geometry.coordinates;
            const lats = coords.map(c => c[1]);
            const lngs = coords.map(c => c[0]);
            centerLat = (Math.max(...lats) + Math.min(...lats)) / 2;
            centerLng = (Math.max(...lngs) + Math.min(...lngs)) / 2;
        }

        const html = `
            <div class="leaflet-popup-refined">
                <div class="popup-card">
                    <div class="popup-header">
                        <h2 class="popup-title">${props.name || 'Proyecto'}</h2>
                        <button class="popup-close" onclick="this.closest('.leaflet-popup').remove()">
                            <span class="material-icons-round">close</span>
                        </button>
                    </div>
                    <p class="popup-description">${props.description || 'Proyecto sin descripción'}</p>
                    <div class="popup-actions">
                        <button class="popup-btn popup-btn-info" 
                            onclick="projectDetailModal.open({
                                id: '${props.id || 'DEMO-001'}',
                                name: '${props.name || 'Proyecto Demo'}',
                                location: '${props.location || 'Ubicación'}',
                                status: 'En Proceso',
                                description: '${props.description || 'Descripción del proyecto'}',
                                coordinates: {
                                    lat: ${centerLat},
                                    lng: ${centerLng}
                                },
                                specs: {
                                    'Capacidad': '150.5 MW',
                                    'Área': '420 Ha',
                                    'Inversión': '85.2M USD'
                                },
                                contact: {
                                    name: 'Responsable del Proyecto',
                                    company: 'Empresa Operadora'
                                }
                            })">
                            <span class="material-icons-round">info</span>
                            <span>Info</span>
                        </button>
                        <button class="popup-btn popup-btn-analysis" 
                            onclick="projectDetailModal.openAnalysis({
                                id: '${props.id || 'DEMO-001'}',
                                name: '${props.name || 'Proyecto Demo'}',
                                coordinates: {
                                    lat: ${centerLat},
                                    lng: ${centerLng}
                                }
                            })">
                            <span class="material-icons-round">analytics</span>
                            <span>Análisis</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        return html;
    }

    defaultStyle = {
        color: '#9B2247',
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.5
    };

    /**
     * Crea datos de demostración
     */
    static createDemoData() {
        return {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    geometry: {
                        type: 'Polygon',
                        coordinates: [[
                            [-106.7, 28.5],
                            [-106.5, 28.5],
                            [-106.5, 28.7],
                            [-106.7, 28.7],
                            [-106.7, 28.5]
                        ]]
                    },
                    properties: {
                        id: 'PGEN-CHI-001',
                        name: 'Planta Solar Chihuahua',
                        location: 'Desierto del Chihuahua, Región Norte',
                        description: 'Instalación de 350,000 paneles solares fotovoltaicos con seguidores a eje único.'
                    }
                },
                {
                    type: 'Feature',
                    geometry: {
                        type: 'Polygon',
                        coordinates: [[
                            [-112.0, 31.6],
                            [-111.7, 31.6],
                            [-111.7, 31.9],
                            [-112.0, 31.9],
                            [-112.0, 31.6]
                        ]]
                    },
                    properties: {
                        id: 'PGEN-SON-001',
                        name: 'Parque Eólico Sonora',
                        location: 'Llanura de Sonora, Región Noroeste',
                        description: 'Instalación de 250 aerogeneradores de 5 MW cada uno.'
                    }
                },
                {
                    type: 'Feature',
                    geometry: {
                        type: 'Polygon',
                        coordinates: [[
                            [-97.3, 22.0],
                            [-96.9, 22.0],
                            [-96.9, 22.3],
                            [-97.3, 22.3],
                            [-97.3, 22.0]
                        ]]
                    },
                    properties: {
                        id: 'PGEN-VER-001',
                        name: 'Central Geotérmica Veracruz',
                        location: 'Campo Geotérmico, Región Sur',
                        description: 'Desarrollo de campo geotérmico con 100 MW de capacidad instalada.'
                    }
                }
            ]
        };
    }
}
