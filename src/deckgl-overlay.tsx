import { useState, useEffect } from 'react';
import DeckGL, {GeoJsonLayer, TripsLayer} from 'deck.gl';
import {DeckglOverlayProps, Trip, Waypoint} from './data-interfaces';
import { RGBAColor, Position } from '@deck.gl/core';
import { useCallback } from 'react';

const DeckGLOverlay = (props: DeckglOverlayProps) => {

  const [currentTime, setCurrentTime] = useState(0);
  const [animation] = useState({id:0});

  useEffect(() => {
    const animate = () => {
      if (props.loopLength != null) {
        const timestamp = Date.now() - props.timestampOffset;
        const loopTime = props.loopTimeMinutes * 60 * 1000; // in x * 1000, x is in seconds
        setCurrentTime((timestamp % loopTime) * (props.loopLength / loopTime));
      }
      animation.id = window.requestAnimationFrame(animate);
    }

    animation.id = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(animation.id);
  }, [animation, props.loopLength, props.timestampOffset, props.loopTimeMinutes]);

  const getColor = useCallback((d: Trip) => {
    let color = props.color;
    const tagColor = d.color;
    if (tagColor != null) {
      color = tagColor;
    }

    if (d.nodes != null) {
      if (props.highlightedNodes.length > 0) {
        d.nodes.forEach((n: string) => {
          if (props.highlightedNodes.find((hn: string) => n.toLowerCase() === hn.toLowerCase()) != null) {
            color = props.highlightColor;
          }
        });
      }
    }

    return color as RGBAColor;
  }, [props.color, props.highlightColor, props.highlightedNodes]);

  let layers = [];
  
  if (props.trips != null) {
    layers.push(new TripsLayer({
      id: 'trips',
      data: props.trips,
      getPath: (d: Trip) => d.segments.map((p: Waypoint) => p.coordinates as Position),
      getTimestamps: (d: Trip) => d.segments.map((p: Waypoint) => p.timestamp),
      getColor: getColor,
      opacity: 0.3,
      widthMinPixels: 2,
      trailLength: props.trailLength,
      currentTime
    }));
  }

  if (props.nodes != null) {
    layers.push(new GeoJsonLayer({
      id: 'geojson-layer',
      data: props.nodes,
      filled: true,
      getFillColor: () => [0, 255, 178, 150],
      stroked: true,
      extruded: false,
      pointRadiusScale: 100,
      getRadius: () => 0.4,
      pickable: true,
      autoHighlight: true,
      highlightColor: [0, 255, 178, 250],
      onHover: props.handleOnHover,
      onClick: (info: any) => console.log(info.object.properties.name)
    }));
  }

  if (layers.length === 0) {
    return null;
  }

  return (
    <DeckGL
      initialViewState={props.initialViewState}
      viewState={props.viewport}
      layers={layers}
    />
  );
}

export default DeckGLOverlay;