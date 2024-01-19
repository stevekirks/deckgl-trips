import { FeatureCollection, Point } from 'geojson';
import { ViewState } from 'react-map-gl';

export interface AppSettings {
    color: number[],
    colors: number[][],
    title: string,
    dataSamples: DataSampleUrls[],
    highlightColor: number[],
    initialLoopTimeMinutes: number,
    initialTrailLength: number,
    initialViewState: ViewState,
    maxZoom: number,
    mapboxStyle: string,
    nodeLabel: string,
    nodeLabelPlural: string
};

export interface DeckglOverlayProps {
    color: number[],
    handleOnClickGeoPoint: (info: any) => void,
    handleOnHoverGeoPoint: (info: any) => void,
    highlightColor: number[],
    highlightedNodes: string[],
    loopLength: number,
    loopTimeMinutes: number,
    nodes: FeatureCollection<Point>,
    timestampOffset: number,
    trips: Trip[] | null,
    trailLength: number
}

export interface DataSampleUrls {
    title: string,
    tripsUrl: string,
    geoJsonUrl: string,
    nodeListUrl: string,
    initialPartialViewState: PartialViewState
}

export interface InfoBoxProps {
    appConfig: AppSettings,

    dataSampleIdx: number,

    handleDataChange: (pDataSampleIdx: number) => void,

    friendlyName: string,

    highlightedNodes: string[],
    handleHighlightedNodes: (pHighlightedNodes: string[]) => void,

    loopLength: number,

    loopTimeMinutes: number,
    handleLoopTimeMinutes: (pLoopTimeMinutes: number) => void,

    nodeList: string[],

    startDate: Date,

    timestampOffset: number,
    handleTimestampOffset: (pTimestampOffset: number) => void,

    timeMultiplier: number,

    trailLength: number,
    handleTrailLength: (pTrailLength: number) => void,

    reloadTrips: () => void;
}

export interface KnownUrlParameters {
    dataSampleIdx: number | null,
    loopTime: number | null,
    trailLength: number | null,
    highlightedNodes: string[] | null
};

export interface PartialViewState {
    latitude: number,
    longitude: number,
    zoom: number
}

export interface TripContainer {
    startTimestamp: string | number,
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

export interface Waypoint {
    coordinates: number[],
    timestamp: number,
    tripId: string
}