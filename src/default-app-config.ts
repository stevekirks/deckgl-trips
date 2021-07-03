import { AppConfig } from "./data-interfaces";

export const DEFAULT_APP_CONFIG: AppConfig = {
    color: [23, 184, 190], // blue
    colors: [
        [0, 255, 246], // blue
        [255, 235, 86], // yellow
        [255, 109, 245], // pink
        [0, 255, 119] // green
    ],
    dataSamples: [
        { 
            title: "SE QLD Transport", 
            tripsUrl: process.env.REACT_APP_DATA_BASE_URL! + '/south-east-qld/trips.json',
            geoJsonUrl: process.env.REACT_APP_DATA_BASE_URL! + '/south-east-qld/geojson-stops.json',
            nodeListUrl: process.env.REACT_APP_DATA_BASE_URL! + '/south-east-qld/stops-list.json',
            initialPartialViewport: {
                latitude: -27.44,
                longitude: 153.05,
                zoom: 11
            }
        },
        { 
            title: "SC Transport", 
            tripsUrl: process.env.REACT_APP_DATA_BASE_URL! + '/sunshine-coast/trips.json',
            geoJsonUrl: process.env.REACT_APP_DATA_BASE_URL! + '/sunshine-coast/geojson-stops.json',
            nodeListUrl: process.env.REACT_APP_DATA_BASE_URL! + '/sunshine-coast/stops-list.json',
            initialPartialViewport: {
                latitude: -26.65,
                longitude: 153.02,
                zoom: 10
            }
        }
    ],
    highlightColor: [253, 128, 93], // orange
    initialLoopTimeMinutes: 3,
    initialTrailLength: 100,
    initialViewport: {
        latitude: -27.44,
        longitude: 153.05,
        zoom: 11,
        maxZoom: 20,
        pitch: 45,
        bearing: 0,
        width: 500,
        height: 500
    },
    mapboxStyle: process.env.REACT_APP_MAPBOX_STYLE!,
    mapboxToken: process.env.REACT_APP_MAPBOX_TOKEN!,
    nodeLabel: "Stop",
    nodeLabelPlural: 'Stops',
    title: "Trips"
};