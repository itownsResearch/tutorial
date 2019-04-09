
import * as itowns from 'itowns';
import * as THREE from 'three';

const getShapeSource = async function(){
    const res = await itowns.Fetcher.multiple('data/test/batis_from_the_deep', {
        arrayBuffer: ['shp', 'dbf', 'shx'],
        text: ['prj'],
    });
    const feature = await itowns.ShapefileParser.parse(res, { buildExtent: true, crsOut: 'EPSG:4326' });
    const source = new itowns.FileSource({ parsedData: feature, zoom: { min: 14, max: 21 }, projection: 'EPSG:4326' });
    return source;
}

async function buildShapeRasterLayer() {
    const shapeSource = await getShapeSource();
    const shapeLayer = new itowns.ColorLayer('deepLearnedbatis', { source: shapeSource, style: {fill : 'green', stroke: 'yellow'} } );
    return shapeLayer;
}

/* does not seem to work, zoom level problem perhaps, like for geojsons */
async function buildShapeGeomLayer() {
    const shapeSource = await getShapeSource();
    const shapeLayer = new itowns.GeometryLayer('deepLearnedbatisGeom', new THREE.Group(), {
        update: itowns.FeatureProcessing.update,
        convert: itowns.Feature2Mesh.convert({
            altitude: () => 10,
            extrude:  (p) => {  30 },
            color: () => new THREE.Color(0xff0000),
            batchId: (p, fId) => { /*console.log("p", p)*/ ; fId }
        }),
        overrideAltitudeInToZero: true,
        mergeFeatures: false,
        source: shapeSource
    });
    return shapeLayer;
}

export { buildShapeRasterLayer, buildShapeGeomLayer }