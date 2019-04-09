import * as itowns from 'itowns';
import darkJson from './layers/dark'
import batiLayer from './layers/bati'
import buildParcellesLayer from './layers/parcelles_raster';
import { simulLayer } from './layers/json_geom'
import GuiTools from './GUI/GuiTools'
import { addMeshToScene } from './utils/CreateMesh'
import {buildShapeRasterLayer, buildShapeGeomLayer} from './layers/shape_batis'

let positionOnGlobe = { longitude: 2.46315, latitude: 48.819609, altitude: 5500 };
let viewerDiv = document.getElementById('viewerDiv');

let globeView = new itowns.GlobeView(viewerDiv, positionOnGlobe);
const menuGlobe = new GuiTools('menuDiv', globeView);
const htmlInfo = document.getElementById('info');
//console.log(globeView.tileLayer.extent.crs)

let darkSource = new itowns.TMSSource(darkJson.source);
let darkLayer = new itowns.ColorLayer('DARK', {
    source: darkSource,
});

let loadLayers = async function() {
    console.log('loading dark');
    const dark = await globeView.addLayer(darkLayer).then(() => true).catch((r) => { console.error(r); return false });
    console.log('--dark done');
    console.log('loading bati');
    const batitopo = await globeView.addLayer(batiLayer).then(() => true).catch((r) => { console.error(r); return false });
    //const batitopo = true;
    console.log('--bati done');
    console.log('loading parcelles');
    let parcelles_raster = await buildParcellesLayer();
    const parcelles = await globeView.addLayer(parcelles_raster).then(() => true).catch((r) => { console.error(r); return false });
    console.log('--parcelles done');
    console.log('loading bati simulé');
    let simuls = await globeView.addLayer(simulLayer).then(() => true).catch((r) => { console.error(r); return false });
    console.log('--bati simulé done');
    console.log('loading shapes for rasterization')
    let batisFromShp = await buildShapeRasterLayer();
    let shapes = await globeView.addLayer(batisFromShp).then(() => true).catch((r) => { console.error(r); return false });
    //const shapes = true
    console.log('--shapefile done');
    // console.log('loading shapes as a geom layer')
    // let shapeGeoms = await buildShapeGeomLayer();
    // let shapesg = globeView.addLayer(shapeGeoms).then(() => true).catch((r) => { console.error(r); return false });
    // console.log('--shapefile as geom done');
    return dark && batitopo && parcelles && simuls && shapes;
}();

let time = 0;
globeView.addEventListener(itowns.GLOBE_VIEW_EVENTS.GLOBE_INITIALIZED, async () => {
    //let loaded = await loadLayers;
    console.log('globe initialized');
    if (await loadLayers) {
        console.log('layers loaded!');
        menuGlobe.addLayersGUI();
        addMeshToScene(globeView);
        window.addEventListener('mousemove', pickingRaster, false);
        window.addEventListener('mousemove', pickingGeomLayer, false);
        animate();
    } else {
        console.error('something bad happened during layers loading..');
    }
});


function pickingRaster(event) {
    let layer = globeView.getLayers(l => l.name == 'parcelles')[0];
    if (layer.visible == false)
        return;
    let geocoord = globeView.controls.pickGeoPosition(globeView.eventToViewCoords(event));
    if (geocoord === undefined)
        return;
    let result = itowns.FeaturesUtils.filterFeaturesUnderCoordinate(geocoord, layer.source.parsedData, 5);
    htmlInfo.innerHTML = 'Parcelle';
    htmlInfo.innerHTML += '<hr>';
    if (result[0] !== undefined) {
        const props = result[0].geometry.properties;
        //console.log(result[0])
        for (const k in props) {
            if (k === 'bbox' || k === 'geometry_name')
                continue;
            htmlInfo.innerHTML += '<li>' + k + ': ' + props[k] + '</li>';
        }
    }
}

function pickingGeomLayer(event) {
    const layer_is_visible = globeView.getLayers(l => l.id === 'simuls')[0].visible;
    if (!layer_is_visible)
        return;
    let results = globeView.pickObjectsAt(event, 5, 'simuls');
    if (results.length < 1)
        return;
    const id = results[0].object.geometry.attributes.batchId.array[results[0].face.a]
    const props = results[0].object.feature.geometry[id].properties;
    //batchId = intersects[0].object.geometry.attributes.batchId.array[intersects[0].face.a];
    htmlInfo.innerHTML = 'Batiment';
    htmlInfo.innerHTML += '<hr>';
    //let props = results[0].feature.geometry.properties;
    for (const k in props) {
        if (k === 'bbox' || k === 'geometry_name' || k === 'id' || k === 'id_parc' || k === 'imu_dir')
            continue;
        htmlInfo.innerHTML += '<li><b>' + k + ':</b> [' + props[k] + ']</li>';
    }
};

function animate(){
    let cyl = globeView.myObj;
    cyl.rotation.z = Math.sin(time) * 2.0;
    cyl.material.uniforms.time.value = time;
    cyl.updateMatrixWorld();

    time += 0.01;
    if (time > 2*Math.PI){
        time = 0.1;//-Math.PI/2;
    }
    globeView.notifyChange(true);
    requestAnimationFrame(animate);
};