import * as itowns from 'itowns';
import parcellesJson from '../../data/parcelles_sample'

//console.log('ll', parcellesJson)
const getJsonSource = async function () {
    let geojson = await itowns.GeoJsonParser.parse(parcellesJson, {
        buildExtent: true,
        //crsIn: 'EPSG:4326',
        crsOut: 'EPSG:4326', //view.tileLayer.extent.crs,
        mergeFeatures: true,
        withNormal: false,
        withAltitude: false,
    });
    const source =  new itowns.FileSource({ parsedData: geojson, projection: 'EPSG:4326' });
    return source;
}

async function buildParcellesLayer () {
    const parcellesLayer = new itowns.ColorLayer('parcelles', {
        name: 'parcelles',
        transparent: true,
        zoom: {
            min: 13,
            max: 14
        },
        style: {
            fill: "red",
            fillOpacity: 0.8,
            stroke: "cyan",
        },
        source: await getJsonSource(),
    });
    return parcellesLayer;
}

export default buildParcellesLayer;
