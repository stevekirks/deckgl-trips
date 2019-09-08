import * as geojson from 'geojson';

 
export interface AppConfig {
    defaultTitle: string,
    nodeLabel: string,
    nodeLabelPlural: string,
    dataSamples: DataSampleUrls[],
    mapboxStyle: string,
    color: number[],
    colors: number[][],
    highlightColor: number[],
    defaultLoopTimeMinutes: number,
    defaultTrailLength: number,
    mapboxToken: string,
    initialViewport: Viewport
};

export interface AppProps { };
export interface AppState {
    appConfig: AppConfig,
    friendlyName: string,
    startDate: Date,
    trips: Trip[] | null,
    loopLength: number,
    loopTimeMinutes: number,
    timeMultiplier: number,
    friendlyTime: string,
    trailLength: number,
    percentThroughLoop: number,
    dataSampleIdx: number,
    nodeList: string[],
    highlightedNodes: string[],
    nodes: geojson.FeatureCollection<geojson.Point> | null,
    popupInfo: geojson.Feature<geojson.Point> | null,
    viewport: Viewport
 };

 export interface DeckglOverlayProps {
    color: number[],
    handleOnHover: (info: any) => void,
    highlightColor: number[],
    highlightedNodes: string[],
    initialViewState: Viewport,
    loopLength: number,
    loopTimeMilliseconds: number,
    nodes: geojson.FeatureCollection<geojson.Point>,
    timestampOffset: number,
    trips: Trip[] | null,
    trailLength: number,
    viewport: any
 }
 export interface DeckflOverlayState {
    currentTime: number
 }

export interface DataSampleUrls {
    title: string,
    tripsUrl: string,
    geoJsonUrl: string,
    nodeListUrl: string,
    initialPartialViewport: PartialViewport
}

export interface KnownUrlParameters {
    dataSampleIdx: number | null,
    loopTime: number | null,
    trailLength: number | null,
    highlightedNodes: string[] | null
};

export interface PartialViewport {
    latitude: number,
    longitude: number,
    zoom: number
}

export interface TripContainer {
    startTimestamp: string,
    loopLength: number,
    timeMultiplier: number,
    friendlyName?: string,
    trips: Trip[]
}

export interface Trip {
    nodes: string[],
    startTime: number,
    endTime: number,
    color?: number[],
    segments: Waypoint[]
}

export interface Viewport {
    latitude: number,
    longitude: number,
    zoom: number
    maxZoom: number,
    pitch: number,
    bearing: number,
    width?: number,
    height?: number
}

export interface Waypoint {
    coordinates: number[],
    timestamp: number,
    tripId: string
}