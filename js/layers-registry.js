/**
 * LAYERS_REGISTRY - Catálogo de capas GeoJSON para análisis espacial
 * Referencia: instrucciones/Capas_GeoJSON_SassoApps.md
 * 
 * NOTA: Algunas capas están comentadas temporalmente porque los archivos
 * no están disponibles en el CDN (error 404). Descomenta cuando estén disponibles.
 */

const LAYERS_REGISTRY = [
    {
        id: "centrales",
        name: "Centrales Eléctricas (privadas y CFE)",
        // URL corregida: Los archivos en CDN usan guiones bajos (_) en lugar de espacios
        url: "https://cdn.sassoapps.com/geojson/Centrales_El%C3%A9ctricas_privadas_y_de_CFE.geojson",
        kind: "points",
        analyze: {
            mode: "intersect",
            report: ["count_inside", "nearest_distance"],
            groupBy: ["Energetico_primario", "Tecnología", "Modalidad"]
        },
        style: {
            radius: 6,
            fillColor: "#ff6600",
            color: "#fff",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        },
        icon: {
            url: "https://cdn.sassoapps.com/iconos_snien/planta_generacion.png",
            size: [24, 24],
            anchor: [12, 12]
        }
    },

    {
        id: "subestaciones",
        name: "Subestaciones Eléctricas",
        url: "https://cdn.sassoapps.com/geojson/Subestaciones_El%C3%A9ctricas.geojson",
        kind: "polygons",
        analyze: {
            mode: "intersect",
            report: ["count_inside"],
            groupBy: ["condicion"]
        },
        style: {
            fillColor: "#3388ff",
            color: "#0055ff",
            weight: 2,
            opacity: 0.8,
            fillOpacity: 0.4
        }
    },
    {
        id: "lineas_transmision",
        name: "Líneas de Transmisión",
        url: "https://cdn.sassoapps.com/geojson/L%C3%ADneas_de_Transmisi%C3%B3n.geojson",
        kind: "lines",
        analyze: {
            mode: "intersect",
            report: ["count_inside", "length_inside"],
            groupBy: ["tension_kv"]
        },
        style: {
            color: "#e6194b",
            weight: 3,
            opacity: 0.7
        }
    },
    {
        id: "gerencias_control",
        name: "Gerencias de Control Regional",
        url: "https://cdn.sassoapps.com/geojson/Gerencias_de_Control_Regional.geojson",
        kind: "polygons",
        analyze: {
            mode: "intersect",
            report: ["area_overlap"],
            groupBy: ["Field1"]
        },
        style: {
            fillColor: "#9B2247", // Guinda institucional
            color: "#9B2247",
            weight: 2,
            opacity: 0.8,
            fillOpacity: 0.2
        }
    },
    {
        id: "banxico",
        name: "División Regional de Banxico",
        url: "https://cdn.sassoapps.com/geojson/Divisi%C3%B3n_Regional_de_Banxico.geojson",
        kind: "polygons",
        analyze: {
            mode: "intersect",
            report: ["area_overlap"],
            groupBy: ["banxico"]
        },
        style: {
            fillColor: "#A57F2C", // Dorado institucional
            color: "#A57F2C",
            weight: 2,
            opacity: 0.8,
            fillOpacity: 0.2
        }
    },
    {
        id: "ductos_sistrangas",
        name: "Ductos integrados a SISTRANGAS",
        url: "https://cdn.sassoapps.com/geojson/Ductos_integrados_a_SISTRANGAS.geojson",
        kind: "lines",
        analyze: {
            mode: "intersect",
            report: ["count_inside", "length_inside"],
            groupBy: ["tipo", "zona_tarif"]
        },
        style: {
            color: "#3cb44b",
            weight: 4,
            opacity: 0.8
        }
    },
    {
        id: "ductos_no_sistrangas",
        name: "Ductos no integrados a SISTRANGAS",
        url: "https://cdn.sassoapps.com/geojson/Ductos_no_integrados_a_SISTRANGAS.geojson",
        kind: "lines",
        analyze: {
            mode: "intersect",
            report: ["count_inside", "length_inside"],
            groupBy: ["tipo", "nombre"]
        },
        style: {
            color: "#911eb4",
            weight: 4,
            opacity: 0.8,
            dashArray: "5, 10"
        }
    }
];
