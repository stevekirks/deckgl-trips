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
    initialViewState: {
        latitude: -27.44,
        longitude: 153.05,
        zoom: 11,
        pitch: 45,
        bearing: 0,
        padding: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
        }
    },
    maxZoom: 20,
    mapboxStyle: "mapbox://styles/mapbox/dark-v10",
    nodeLabel: "Node",
    nodeLabelPlural: 'Nodes',
    title: "Trips"
};