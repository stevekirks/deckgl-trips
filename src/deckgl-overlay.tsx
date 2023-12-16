import { useState, useEffect } from 'react';
import DeckGL, {GeoJsonLayer, TripsLayer} from 'deck.gl';
import {DeckglOverlayProps, Trip, Waypoint} from './data-interfaces';
import { RGBAColor, Position } from '@deck.gl/core';
import { Feature, Point } from 'geojson';

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

  const getTripColor = (d: Trip) => {
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
  }

  const getNodeColor = (d: unknown) => {
    let node = d as Feature<Point>;
    let color = [0, 255, 178, 150];

    if (props.highlightedNodes.length > 0
      && node.properties?.name
      && props.highlightedNodes.find((hn: string) => node.properties?.name.toLowerCase() === hn.toLowerCase()) != null) {
        color = [255, 109, 245, 150];
    }

    return color as RGBAColor;
  }

  const getNodeRadius = (d: unknown) => {
    let node = d as Feature<Point>;
    if (props.highlightedNodes.length > 0
      && node.properties?.name
      && props.highlightedNodes.find((hn: string) => node.properties?.name.toLowerCase() === hn.toLowerCase()) != null) {
        return 0.8;
    }
    return 0.4;
  };

  let layers = [];
  
  if (props.trips != null) {
    layers.push(new TripsLayer({
      id: 'trips',
      data: props.trips,
      currentTime,
      getColor: getTripColor,
      getPath: (d: Trip) => d.segments.map((p: Waypoint) => p.coordinates as Position),
      getTimestamps: (d: Trip) => d.segments.map((p: Waypoint) => p.timestamp),
      opacity: 0.3,
      trailLength: props.trailLength,
      widthMinPixels: 2,
      transitions: {
        getColor: {
          type: 'interpolation',
          duration: 700,
          easing: (t) => ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2,
        }
      }
    }));
  }

  if (props.nodes != null) {
    layers.push(new GeoJsonLayer({
      id: 'geojson-layer',
      data: props.nodes,
      autoHighlight: true,
      extruded: false,
      filled: true,
      getFillColor: getNodeColor,
      getPointRadius: getNodeRadius,
      highlightColor: [0, 255, 178, 250],
      pickable: true,
      pointRadiusScale: 100,
      stroked: true,
      onHover: props.handleOnHover,
      onClick: (info: any) => console.log(info.object.properties.name),
      transitions: {
        getFillColor: {
          type: 'interpolation',
          duration: 700,
          easing: (t) => ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2,
        },
        getRadius: {
          type: 'spring',
          stiffness: 0.2,
          damping: 0.3
        }
      }
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