import * as itowns from 'itowns';
import * as THREE from 'three';
import simulsJson from '../../data/simuls_sample.json'

const simulSource = new itowns.FileSource({
    fetchedData: simulsJson,
    crsOut: 'EPSG:4326', //view.tileLayer.extent.crs,
    projection: 'EPSG:4326',
    format: 'application/json',
    zoom: { min: 17, max: 17 },    
});

const simulLayer = new itowns.GeometryLayer('simuls', new THREE.Group(), {
    update: itowns.FeatureProcessing.update,
    convert: itowns.Feature2Mesh.convert({
        //altitude: () => 1,
        extrude:  (p) => p.hauteur,
        color: () => new THREE.Color(0x00ff55),
        batchId: (p, fId) => fId
    }),
    //overrideAltitudeInToZero: true,
    mergeFeatures: false,
    source: simulSource
});

export {simulLayer}
