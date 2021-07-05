import * as geojson from 'geojson';
import React from 'react';


export interface AppConfig {
    color: number[],
    colors: number[][],
    title: string,
    dataSamples: DataSampleUrls[],
    highlightColor: number[],
    initialLoopTimeMinutes: number,
    initialTrailLength: number,
    initialViewport: Viewport,
    mapboxStyle: string,
    mapboxToken: string,
    nodeLabel: string,
    nodeLabelPlural: string
};

export interface DeckglOverlayProps {
    color: number[],
    handleOnHover: (info: any) => void,
    highlightColor: number[],
    highlightedNodes: string[],
    initialViewState: Viewport,
    loopLength: number,
    loopTimeMinutes: number,
    nodes: geojson.FeatureCollection<geojson.Point>,
    timestampOffset: number,
    trips: Trip[] | null,
    trailLength: number,
    viewport: any
}

export interface DataSampleUrls {
    title: string,
    tripsUrl: string,
    geoJsonUrl: string,
    nodeListUrl: string,
    initialPartialViewport: PartialViewport
}

export interface InfoBoxProps {
    appConfig: AppConfig,

    dataSampleIdx: number,

    handleDataChange: (pDataSampleIdx: number) => void,

    friendlyName: string,

    highlightedNodes: string[],
    setHighlightedNodes: React.Dispatch<React.SetStateAction<string[]>>,

    loopLength: number,

    loopTimeMinutes: number,
    setLoopTimeMinutes: React.Dispatch<React.SetStateAction<number>>,

    nodeList: string[],

    startDate: Date,

    timestampOffset: number,
    setTimestampOffset: React.Dispatch<React.SetStateAction<number>>,

    timeMultiplier: number,

    trailLength: number,
    setTrailLength: React.Dispatch<React.SetStateAction<number>>

    reloadTrips: () => void;
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