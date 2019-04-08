import * as itowns from 'itowns';
import * as THREE from 'three';
//import simulsJson from '../../data/simuls_sample2.json'
//import simulsJson from '../../data/simuls_sample.json'
//import simulsJson from '../../data/custom.geo3.json'
//import simulsJson from '../../data/ariege.json'
import simulsJson from '../../data/parcelles_sample'

const simulSource = new itowns.FileSource({
    //url: 'https://raw.githubusercontent.com/itownsResearch/basic_tutorial/master/data/parcelles_sample.json',
    fetchedData: simulsJson,
    //parsedData: simulsJson,
    crsOut: 'EPSG:4326', //view.tileLayer.extent.crs,
    projection: 'EPSG:4326',
    format: 'application/json',
    //zoom: { min: 11, max: 11 }, //for parcelles, 7,7 for ariege
    zoom: { min: 11, max: 11 },
    mergeFeatures: false,
    buildExtent: true
});

const simulLayer = new itowns.GeometryLayer('simuls', new THREE.Group(), {
    update: itowns.FeatureProcessing.update,
    convert: itowns.Feature2Mesh.convert({
        //altitude: () => 1,
        extrude:  (p) => { console.log("pppp", p); return 30},
        color: () => new THREE.Color(0xffb00b),
        batchId: (p, fId) => { console.log("fffId", fId) ; fId }
    }),
    //overrideAltitudeInToZero: true,
    source: simulSource
});



export {simulLayer}
