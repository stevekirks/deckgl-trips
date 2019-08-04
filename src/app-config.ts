import { AppConfig } from "./data-interfaces";

export const CURRENT_APP_CONFIG: AppConfig = {
    name: "Default",
    defaultTitle: "Buses and Ferries",
    dataUrls: [
        { 
        label: "Buses", 
        value: process.env.REACT_APP_DATA_URL_1!
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
    geoJsonUrl: process.env.REACT_APP_GEOJSON_URL!,
    stopListUrl: process.env.REACT_APP_STOP_LIST_URL!,
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