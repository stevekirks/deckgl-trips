import { AppSettings } from "./data-interfaces";

export const DEFAULT_APP_SETTINGS: AppSettings = {
    color: [255, 235, 86], // yellow
    colors: [
        [255, 109, 245], // pink
        [0, 255, 119] // green
    ],
    dataSamples: [],
    highlightColor: [255, 109, 245], // pink
    initialLoopTimeMinutes: 1,
    initialTrailLength: 100,
    initialViewport: {
        latitude: 19.045632,
        longitude: 68.538902,
        zoom: 3,
        maxZoom: 20,
        pitch: 45,
        bearing: 0,
        width: 500,
        height: 500
    },
    mapboxStyle: "mapbox://styles/mapbox/dark-v10",
    nodeLabel: "Node",
    nodeLabelPlural: 'Nodes',
    title: "Trips"
};