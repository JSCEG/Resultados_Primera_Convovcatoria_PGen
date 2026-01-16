# Catálogo de capas GeoJSON (cdn.sassoapps.com)
Este documento describe las capas GeoJSON disponibles en tu CDN, sus geometrías, propiedades más comunes y cómo integrarlas en tu geovisualizador con **Leaflet** + **Turf.js** para analizar un polígono (KML convertido a GeoJSON).
## Convención de URLs
- Carpeta CDN: `https://cdn.sassoapps.com/geojson/`
- El nombre del archivo se URL-encodea (acentos, espacios). Ejemplo: `Centrales_El%C3%A9ctricas_privadas_y_de_CFE.geojson`.
## Índice de capas
- **Centrales Eléctricas privadas y de CFE** — https://cdn.sassoapps.com/geojson/Centrales%20El%C3%A9ctricas%20privadas%20y%20de%20CFE.geojson
- **Subestaciones Eléctricas** — https://cdn.sassoapps.com/geojson/Subestaciones%20El%C3%A9ctricas.geojson
- **íneas de Transmisión** — https://cdn.sassoapps.com/geojson/%C3%ADneas%20de%20Transmisi%C3%B3n.geojson
- **Gerencias de Control Regional** — https://cdn.sassoapps.com/geojson/Gerencias%20de%20Control%20Regional.geojson
- **División Regional de Banxico** — https://cdn.sassoapps.com/geojson/Divisi%C3%B3n%20Regional%20de%20Banxico.geojson
- **Ductos integrados a SISTRANGAS** — https://cdn.sassoapps.com/geojson/Ductos%20integrados%20a%20SISTRANGAS.geojson
- **Ductos no integrados a SISTRANGAS** — https://cdn.sassoapps.com/geojson/Ductos%20no%20integrados%20a%20SISTRANGAS.geojson

---
## Detalle por capa
### Centrales Eléctricas privadas y de CFE
**URL:** https://cdn.sassoapps.com/geojson/Centrales%20El%C3%A9ctricas%20privadas%20y%20de%20CFE.geojson
**Tipo raíz:** `FeatureCollection`
**Features:** **908**
**Tipos de geometría:**
- `Point`: 908
**BBox (aprox. WGS84 lon/lat):** `-117.071152, 15.023950, -86.419998, 32.663296`
**Propiedades detectadas:** 109 claves
**Claves más comunes (hasta 40):**
`NumeroPermiso`, `Ubicación`, `EF_ID`, `MPO_ID`, `Dirección`, `Razón_social`, `Numero_de_Expediente`, `Modalidad`, `FechaOtorgamiento`, `Capacidad_autorizada_MW`, `Generación_estimada_anual`, `Inversion_estimada_mdls`, `Fecha_de_Entrada_en_Operación`, `Energetico_primario`, `Actividad_economica`, `Tecnología`, `Estatus_instalacion`, `EmpresaLíder`, `PaísDeOrigen`, `Subasta`, `RFC`, `Estatus`, `FechaRecepcion`, `Tipo_permiso`, `Inicio_operaciones`, `Latitud_GEO`, `Longitud_GEO`, `Comentarios`, `Tipo_planta`, `FuenteEnergia`, `Combustible_autorizado`, `Clasifica_Menú`, `Tipo_Empresa`, `Inicio_vigencia`, `Periodo`, `NumeroPermiso_1`, `Razón_social_1`, `Modalidad_1`, `FechaOtorgamiento_1`, `Generacion_autorizada_gwh`
**Ejemplos de `properties` (primeras features, recortado):**
```json
{
  "NumeroPermiso": "07/COG/94",
  "Ubicación": "Nuevo León",
  "EF_ID": 19,
  "MPO_ID": 46,
  "Dirección": "Km. 7; de la Vía F.F.C.C. a Matamoros; C.P. 66490; San Nicolás de los Garza; Nuevo León",
  "Razón_social": "Productora de Papel; S. A. de C. V.",
  "Numero_de_Expediente": "NULL",
  "Modalidad": "COG.",
  "FechaOtorgamiento": "20/07/1994",
  "Capacidad_autorizada_MW": 18.0
}
```
```json
{
  "NumeroPermiso": "08/COG/94",
  "Ubicación": "Coahuila",
  "EF_ID": 5,
  "MPO_ID": 27,
  "Dirección": "Carretera Monterrey-Saltillo Km. 12.5, Ramos Arizpe, Coahuila.",
  "Razón_social": "Fersinsa Gist-Brocades, S. A. de C. V.",
  "Numero_de_Expediente": "NULL",
  "Modalidad": "COG.",
  "FechaOtorgamiento": "20/07/1994",
  "Capacidad_autorizada_MW": 6.0
}
```
```json
{
  "NumeroPermiso": "09/AUT/94",
  "Ubicación": "Campeche",
  "EF_ID": 4,
  "MPO_ID": 3,
  "Dirección": "Complejo Abkatún-D, en la Sonda de Campeche, Cd. del Carmen, Campeche",
  "Razón_social": "Pemex-Exploración y Producción, Complejo Marino de Producción Abkatún-D",
  "Numero_de_Expediente": "NULL",
  "Modalidad": "AUT.",
  "FechaOtorgamiento": "06/09/1994",
  "Capacidad_autorizada_MW": 7.119999886
}
```
**Qué puedes obtener en el análisis del polígono:**
- Conteo de puntos **dentro** del polígono (`booleanPointInPolygon`).
- Lista de entidades tocadas (por ejemplo, nombres/ids) y agregados por algún campo (p. ej. `Empresa`, `Tipo`, `Región`).
- Distancia al punto más cercano si no hay intersección (`nearestPoint` + `distance`).

---
### Subestaciones Eléctricas
**URL:** https://cdn.sassoapps.com/geojson/Subestaciones%20El%C3%A9ctricas.geojson
**Tipo raíz:** `FeatureCollection`
**Features:** **2790**
**Tipos de geometría:**
- `Polygon`: 2790
**BBox (aprox. WGS84 lon/lat):** `-117.109423, 14.630504, -86.782373, 32.663333`
**Propiedades detectadas:** 9 claves
**Claves más comunes (hasta 40):**
`fid`, `id`, `nom_obj`, `codigo`, `calif_pos`, `condicion`, `nom_geo`, `nom_cono`, `clase_geo`
**Ejemplos de `properties` (primeras features, recortado):**
```json
{
  "fid": 1,
  "id": 327511530,
  "nom_obj": "Subestación eléctrica",
  "codigo": 6792.0,
  "calif_pos": "Definida",
  "condicion": "En operación",
  "nom_geo": "N/D",
  "nom_cono": "N/D",
  "clase_geo": "Servicios e instalaciones"
}
```
```json
{
  "fid": 2,
  "id": 326135523,
  "nom_obj": "Subestación eléctrica",
  "codigo": 6792.0,
  "calif_pos": "Definida",
  "condicion": "En operación",
  "nom_geo": "Nueva Italia",
  "nom_cono": "N/D",
  "clase_geo": "Servicios e instalaciones"
}
```
```json
{
  "fid": 3,
  "id": 37201599,
  "nom_obj": "Subestación eléctrica",
  "codigo": 6792.0,
  "calif_pos": "Definida",
  "condicion": "En operación",
  "nom_geo": "N/D",
  "nom_cono": "N/D",
  "clase_geo": "Servicios e instalaciones"
}
```
**Qué puedes obtener en el análisis del polígono:**
- Polígonos que intersectan o contienen tu polígono (`booleanIntersects`, `booleanContains`).
- Área de traslape (si haces `intersect`) y el atributo administrativo asociado (p. ej. región).

---
### íneas de Transmisión
**URL:** https://cdn.sassoapps.com/geojson/%C3%ADneas%20de%20Transmisi%C3%B3n.geojson
**Tipo raíz:** `FeatureCollection`
**Features:** **3451**
**Tipos de geometría:**
- `MultiLineString`: 3451
**BBox (aprox. WGS84 lon/lat):** `-117.109009, 14.554280, -86.746683, 32.664763`
**Propiedades detectadas:** 7 claves
**Claves más comunes (hasta 40):**
`fid`, `g_id`, `nombre_lt`, `caracteri`, `tension_kv`, `categ_kv`, `longi_km`
**Ejemplos de `properties` (primeras features, recortado):**
```json
{
  "fid": 1.0,
  "g_id": 1.0,
  "nombre_lt": "L.T. CT LERMA-SAMULA I",
  "caracteri": "115KV-1C-8.6KM-TA",
  "tension_kv": 115.0,
  "categ_kv": 2.0,
  "longi_km": 8.69
}
```
```json
{
  "fid": 2.0,
  "g_id": 2.0,
  "nombre_lt": "L.T. SAMULA II-KALA",
  "caracteri": "115KV-1C-14.21KM-TA",
  "tension_kv": 115.0,
  "categ_kv": 2.0,
  "longi_km": 14.21
}
```
```json
{
  "fid": 3.0,
  "g_id": 3.0,
  "nombre_lt": "L.T. SAMULA I-SAMULA II",
  "caracteri": "115KV-1C-5.10KM-TA",
  "tension_kv": 115.0,
  "categ_kv": 2.0,
  "longi_km": 5.1
}
```
**Qué puedes obtener en el análisis del polígono:**
- Conteo de líneas que **intersectan** el polígono (`booleanIntersects`).
- Longitud de tramos **dentro** del polígono (`lineSplit` o `lineIntersect` + recorte con `polygonToLine`/`lineSlice`).

---
### Gerencias de Control Regional
**URL:** https://cdn.sassoapps.com/geojson/Gerencias%20de%20Control%20Regional.geojson
**Tipo raíz:** `FeatureCollection`
**Features:** **8**
**Tipos de geometría:**
- `MultiPolygon`: 7
- `Polygon`: 1
**BBox (aprox. WGS84 lon/lat):** `-118.407650, 14.532098, -86.711905, 32.718654`
**Propiedades detectadas:** 3 claves
**Claves más comunes (hasta 40):**
`fid`, `Field1`, `id`
**Ejemplos de `properties` (primeras features, recortado):**
```json
{
  "fid": 1,
  "Field1": "Gerencia de Control Regional Noreste",
  "id": 6
}
```
```json
{
  "fid": 2,
  "Field1": "Gerencia de Control Regional Central",
  "id": 1
}
```
```json
{
  "fid": 3,
  "Field1": "Gerencia de Control Regional Norte",
  "id": 5
}
```
**Qué puedes obtener en el análisis del polígono:**
- Polígonos que intersectan o contienen tu polígono (`booleanIntersects`, `booleanContains`).
- Área de traslape (si haces `intersect`) y el atributo administrativo asociado (p. ej. región).

---
### División Regional de Banxico
**URL:** https://cdn.sassoapps.com/geojson/Divisi%C3%B3n%20Regional%20de%20Banxico.geojson
**Tipo raíz:** `FeatureCollection`
**Features:** **4**
**Tipos de geometría:**
- `Polygon`: 1
- `MultiPolygon`: 3
**BBox (aprox. WGS84 lon/lat):** `-118.365114, 14.532098, -86.711905, 32.718654`
**Propiedades detectadas:** 1 claves
**Claves más comunes (hasta 40):**
`banxico`
**Ejemplos de `properties` (primeras features, recortado):**
```json
{
  "banxico": "Centro"
}
```
```json
{
  "banxico": "Sur"
}
```
```json
{
  "banxico": "Norte"
}
```
**Qué puedes obtener en el análisis del polígono:**
- Polígonos que intersectan o contienen tu polígono (`booleanIntersects`, `booleanContains`).
- Área de traslape (si haces `intersect`) y el atributo administrativo asociado (p. ej. región).

---
### Ductos integrados a SISTRANGAS
**URL:** https://cdn.sassoapps.com/geojson/Ductos%20integrados%20a%20SISTRANGAS.geojson
**Tipo raíz:** `FeatureCollection`
**Features:** **69**
**Tipos de geometría:**
- `MultiLineString`: 69
**BBox (aprox. WGS84 lon/lat):** `-111.098978, 16.166300, -92.485961, 31.734471`
**Propiedades detectadas:** 10 claves
**Claves más comunes (hasta 40):**
`ducto`, `proyecto`, `tipo`, `longitud_k`, `tramo`, `permiso_cr`, `inicio_de_`, `zona_tarif`, `integrado_`, `notas`
**Ejemplos de `properties` (primeras features, recortado):**
```json
{
  "ducto": "SISTRANGAS",
  "proyecto": null,
  "tipo": "Gasoductos existentes operados por CENAGAS",
  "longitud_k": 293.8669397,
  "tramo": "NACO-HERMOSILLO",
  "permiso_cr": "G/059/TRA/1999",
  "inicio_de_": null,
  "zona_tarif": "Zona Norte",
  "integrado_": "Si",
  "notas": "La longitud y el tramo expresados son estimados, para fines informativos y no corresponden a la ubicación exacta del gasoducto"
}
```
```json
{
  "ducto": "SISTRANGAS",
  "proyecto": null,
  "tipo": "Gasoductos existentes operados por CENAGAS",
  "longitud_k": 341.73771,
  "tramo": "JUAREZ-CHIHUAUA",
  "permiso_cr": "G/061/TRA/1999",
  "inicio_de_": "1962",
  "zona_tarif": "Zona Norte",
  "integrado_": "Si",
  "notas": "La longitud y el tramo expresados son estimados, para fines informativos y no corresponden a la ubicación exacta del gasoducto"
}
```
```json
{
  "ducto": "SISTRANGAS",
  "proyecto": null,
  "tipo": "Gasoductos existentes operados por CENAGAS",
  "longitud_k": 434.3739,
  "tramo": "EL ENCINO-LA LAGUNA",
  "permiso_cr": "G/061/TRA/1999",
  "inicio_de_": "1962",
  "zona_tarif": "Zona Norte",
  "integrado_": "Si",
  "notas": "La longitud y el tramo expresados son estimados, para fines informativos y no corresponden a la ubicación exacta del gasoducto"
}
```
**Qué puedes obtener en el análisis del polígono:**
- Conteo de líneas que **intersectan** el polígono (`booleanIntersects`).
- Longitud de tramos **dentro** del polígono (`lineSplit` o `lineIntersect` + recorte con `polygonToLine`/`lineSlice`).

---
### Ductos no integrados a SISTRANGAS
**URL:** https://cdn.sassoapps.com/geojson/Ductos%20no%20integrados%20a%20SISTRANGAS.geojson
**Tipo raíz:** `FeatureCollection`
**Features:** **27**
**Tipos de geometría:**
- `MultiLineString`: 27
**BBox (aprox. WGS84 lon/lat):** `-112.244336, 19.009044, -99.326659, 31.555129`
**Propiedades detectadas:** 14 claves
**Claves más comunes (hasta 40):**
`nombre`, `proyecto`, `tipo`, `capacidad_`, `inversin_m`, `desarrolla`, `promotor`, `longitud_k`, `tramo`, `permiso_cr`, `fecha_de_i`, `zona_tarif`, `integrado_`, `observacio`
**Ejemplos de `properties` (primeras features, recortado):**
```json
{
  "nombre": "PUERTO LIBERTAD - GUAYMAS",
  "proyecto": "PROYECTO NOROESTE",
  "tipo": "Gasoducto privado",
  "capacidad_": 770.0,
  "inversin_m": 0.0,
  "desarrolla": "IENova",
  "promotor": "CFE",
  "longitud_k": 270.913903742,
  "tramo": null,
  "permiso_cr": "G/311/TRA/2013"
}
```
```json
{
  "nombre": "SASABE - PUERTO LIBERTAD",
  "proyecto": "PROYECTO NOROESTE",
  "tipo": "Gasoducto privado",
  "capacidad_": 770.0,
  "inversin_m": 569.0,
  "desarrolla": "IENova",
  "promotor": "CFE",
  "longitud_k": 235.934849555,
  "tramo": null,
  "permiso_cr": "G/311/TRA/2013"
}
```
```json
{
  "nombre": "EL ENCINO - TOPOLOBAMPO",
  "proyecto": "PROYECTO NOROESTE",
  "tipo": "Gasoducto privado",
  "capacidad_": 670.0,
  "inversin_m": 1008.0,
  "desarrolla": "TransCanada",
  "promotor": "CFE",
  "longitud_k": 488.44531341,
  "tramo": "El Encino - Topolobampo",
  "permiso_cr": "G/337/TRA/2014\n"
}
```
**Qué puedes obtener en el análisis del polígono:**
- Conteo de líneas que **intersectan** el polígono (`booleanIntersects`).
- Longitud de tramos **dentro** del polígono (`lineSplit` o `lineIntersect` + recorte con `polygonToLine`/`lineSlice`).

---
## Integración recomendada en tu geovisualizador (Leaflet + Turf)
### 1) Registro único de capas (catálogo)
Crea un catálogo JS/JSON central (ej. `layers-registry.js`) para que el proyecto y tu futuro agente solo tengan que **agregar una entrada** para nuevas capas.
```js
const LAYERS_REGISTRY = [
  {
    id: "centrales",
    name: "Centrales Eléctricas (privadas y CFE)",
    url: "https://cdn.sassoapps.com/geojson/Centrales%20El%C3%A9ctricas%20privadas%20y%20de%20CFE.geojson",
    kind: "points", // points | lines | polygons
    analyze: {
      mode: "intersect",
      report: ["count_inside", "nearest_distance"],
      groupBy: ["Empresa", "Tipo"]
    },
    style: { color: "#ff6600" }
  },
  // ...
];
```
### 2) Carga asíncrona y control de capas
Carga cada GeoJSON con `fetch`, crea una capa `L.geoJSON`, y regístrala en el control de capas. Tu UI móvil ya sincroniza lo que haya en el control de capas de Leaflet.
```js
async function loadGeoJsonLayer(entry) {
  const res = await fetch(entry.url);
  const geo = await res.json();
  const layer = L.geoJSON(geo, {
    style: entry.kind !== "points" ? () => entry.style : undefined,
    pointToLayer: entry.kind === "points"
      ? (ft, latlng) => L.circleMarker(latlng, { radius: 5, ...entry.style })
      : undefined,
    onEachFeature: (ft, lyr) => {
      lyr.on("click", () => console.log(entry.name, ft.properties));
    }
  });
  entry._layer = layer;
  return layer;
}
```
### 3) Flujo de análisis espacial con Turf
1. Usuario carga KML → conviertes a GeoJSON (Polygon/MultiPolygon).
2. Normalizas geometrías (WGS84, corrige rings si aplica).
3. Para cada entrada del catálogo, ejecutas su función de análisis y produces un JSON de resultados.
4. Ese JSON alimenta tu modal de detalle / bottom sheet.
```js
function analyzePolygonAgainstLayer(polygonGeo, layerGeo, entry) {
  const poly = polygonGeo;
  const feats = layerGeo.features || [];
  const hits = [];
  for (const f of feats) {
    const g = f.geometry;
    if (!g) continue;
    let intersected = false;
    if (entry.kind === "points") {
      intersected = turf.booleanPointInPolygon(f, poly);
    } else {
      intersected = turf.booleanIntersects(f, poly);
    }
    if (intersected) hits.push(f);
  }
  // Agregados
  const result = {
    id: entry.id,
    name: entry.name,
    intersected: hits.length > 0,
    count: hits.length,
    groups: {}
  };
  if (entry.analyze?.groupBy?.length) {
    for (const gKey of entry.analyze.groupBy) {
      result.groups[gKey] = hits.reduce((acc, h) => {
        const v = (h.properties && h.properties[gKey]) ?? "(sin dato)";
        acc[v] = (acc[v] || 0) + 1;
        return acc;
      }, {});
    }
  }
  return result;
}
```
### 4) Base maps
Tu `map-config.js` construye `baseLayersForControl` a partir de `layerConfigs` y lo usa para el control de capas/base maps (incluye MapTiler/CARTO/ESRI/Stadia y estilos Crema/Gris/Ninguno).
## Reglas para tu futuro “agente de capas”
Para que el agente “agrega una capa más” sin romper nada, pídele que: 
1) Agregue una entrada en `LAYERS_REGISTRY` (id, name, url, kind, groupBy, estilo).
2) Si la capa es grande, agregue caché (IndexedDB / localForage) o compresión (GeoJSON simplificado, vector tiles).
3) Defina qué métricas debe regresar el análisis: `count`, `nearestDistanceKm`, `lengthKmInside`, `areaKm2Overlap`, y top-N agrupaciones.
4) Actualice el “render” del panel de resultados para mostrar la nueva capa automáticamente (sin hardcode).
