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
        const html = `
            <div class="popup-content">
                <h4 class="font-bold text-primary mb-2">${props.name || 'Proyecto'}</h4>
                <p class="text-xs text-gray-600 mb-3">${props.description || ''}</p>
                <button class="px-3 py-1 bg-primary text-white text-xs rounded hover:bg-primary/90 transition-colors" 
                    onclick="projectDetailModal.open({
                        id: '${props.id || 'DEMO-001'}',
                        name: '${props.name || 'Proyecto Demo'}',
                        location: '${props.location || 'Ubicación'}',
                        status: 'En Proceso',
                        description: '${props.description || 'Descripción del proyecto'}',
                        coordinates: {
                            lat: ${feature.geometry.coordinates[1]},
                            lng: ${feature.geometry.coordinates[0]}
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
                    <span class="material-icons-round text-xs">analytics</span>
                    Ejecutar Análisis
                </button>
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
                        type: 'Point',
                        coordinates: [-106.6419, 28.6329] // Chihuahua
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
                        type: 'Point',
                        coordinates: [-111.8910, 31.7922] // Sonora
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
                        type: 'Point',
                        coordinates: [-97.1428, 22.1505] // Veracruz
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
