import { AppConfig } from "./data-interfaces";

export const CURRENT_APP_CONFIG: AppConfig = {
    name: "Default",
    defaultTitle: "Trips",
    dataSamples: [
        { 
            title: "SE QLD Transport", 
            tripsUrl: process.env.REACT_APP_DATA_BASE_URL! + '/south-east-qld/trips.json',
            geoJsonUrl: process.env.REACT_APP_DATA_BASE_URL! + '/south-east-qld/geojson-stops.json',
            stopListUrl: process.env.REACT_APP_DATA_BASE_URL! + '/south-east-qld/stops-list.json',
            getInitialPartialViewport: () => {
                return {
                    latitude: -27.44,
                    longitude: 153.05,
                    zoom: 11
                };
            }
        },
        { 
            title: "SC Transport", 
            tripsUrl: process.env.REACT_APP_DATA_BASE_URL! + '/sunshine-coast/trips.json',
            geoJsonUrl: process.env.REACT_APP_DATA_BASE_URL! + '/sunshine-coast/geojson-stops.json',
            stopListUrl: process.env.REACT_APP_DATA_BASE_URL! + '/sunshine-coast/stops-list.json',
            getInitialPartialViewport: () => {
                return {
                    latitude: -26.65,
                    longitude: 153.02,
                    zoom: 10
                };
            }
        }
    ],
    mapboxStyle: process.env.REACT_APP_MAPBOX_STYLE!,
    color: [23, 184, 190], // blue
    colors: [
        [0, 255, 246], // blue
        [255, 235, 86], // yellow
        [255, 109, 245], // pink
        [0, 255, 119] // green
    ],
    highlightColor: [253, 128, 93], // orange
    defaultLoopTimeMinutes: 1,
    defaultTrailLength: 100,
    mapboxToken: process.env.REACT_APP_MAPBOX_TOKEN!,
    getInitialViewport: () => {
        return {
            latitude: -27.44,
            longitude: 153.05,
            zoom: 11,
            maxZoom: 20,
            pitch: 45,
            bearing: 0,
            width: 500,
            height: 500
        };
    }
};