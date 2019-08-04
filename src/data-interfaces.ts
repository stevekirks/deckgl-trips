import * as geojson from 'geojson';

export interface AppProps { };
export interface AppState { 
  friendlyName: string,
  startDate: Date,
  trips: Trip[] | null,
  loopLength: number,
  loopTimeMinutes: number,
  timeMultiplier: number,
  friendlyTime: string,
  trailLength: number,
  percentThroughLoop: number,
  dataUrlIdx: number,
  stopList: string[],
  highlightedStops: string[],
  stops: geojson.FeatureCollection<geojson.Point> | null,
  popupInfo: geojson.Feature<geojson.Point> | null,
  viewport: Viewport
 };

 export interface DeckglOverlayProps {
    handleOnHover: (info: any) => void,
    highlightedStops: string[],
    loopLength: number,
    loopTimeMilliseconds: number,
    periodicTripUpdateCallback: () => void,
    stops: geojson.FeatureCollection<geojson.Point>,
    timestampOffset: number,
    trips: Trip[] | null,
    trailLength: number,
    viewport: any
 }
 export interface DeckflOverlayState {
    currentTime: number
 }
 
 export interface AppConfig {
    name: string,
    defaultTitle: string,
    dataUrls: LabelValue[],
    mapboxStyle: string,
    color: number[],
    colors: number[][],
    highlightColor: number[],
    defaultLoopTimeMinutes: number,
    defaultTrailLength: number,
    geoJsonUrl: string,
    stopListUrl: string,
    mapboxToken: string,
    getInitialViewport: () => Viewport
};

export interface LabelValue {
    label: string,
    value: string
}

export interface KnownUrlParameters {
    dataUrlIdx: number | null,
    loopTime: number | null,
    trailLength: number | null,
    highlightedStops: string[] | null
};

export interface TripContainer {
    startTimestamp: string,
    loopLength: number,
    timeMultiplier: number,
    friendlyName?: string,
    trips: Trip[]
}

export interface Trip {
    stops: string[],
    startTime: number,
    endTime: number,
    color?: any,
    segments: Waypoint[]
}

export interface Viewport {
    latitude: number,
    longitude: number,
    zoom: number,
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