import * as itowns from 'itowns';
import * as THREE from 'three';

const wfsSource = new itowns.WFSSource({
    url: 'http://wxs.ign.fr/oej022d760omtb9y4b19bubh/geoportail/wfs?',
    version: '2.0.0',
    typeName: 'BDTOPO_BDD_WLD_WGS84G:bati_remarquable,BDTOPO_BDD_WLD_WGS84G:bati_indifferencie,BDTOPO_BDD_WLD_WGS84G:bati_industriel',
    projection: 'EPSG:4326',
    // extent: {
    //     west: 4.568,
    //     east: 5.18,
    //     south: 45.437,
    //     north: 46.03,
    // },
    zoom: { min: 15, max: 15 },
    format: 'application/json',
});

let batiLayer = new itowns.GeometryLayer('Buildings', new THREE.Group(), {
    update: itowns.FeatureProcessing.update,
    convert: itowns.Feature2Mesh.convert({
        //altitude: () => 0,
        extrude:  (p) => p.hauteur,
        color: () => new THREE.Color(0xcab0ff),
    }),
    overrideAltitudeInToZero: true,
    source: wfsSource
});

export default batiLayer