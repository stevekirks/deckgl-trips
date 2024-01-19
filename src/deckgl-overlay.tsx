import { useState, useEffect } from 'react';
import {DeckProps, GeoJsonLayer, TripsLayer} from 'deck.gl/typed';
import {DeckglOverlayProps, Trip, Waypoint} from './data-interfaces';
import { Color, Position } from '@deck.gl/core/typed';
import {MapboxOverlay} from '@deck.gl/mapbox/typed';
import { Feature, Point } from 'geojson';
import { useControl } from 'react-map-gl';

function DeckGLMapboxOverlay(props: DeckProps) {
  const deck = useControl<MapboxOverlay>(() => new MapboxOverlay(props));

  deck.setProps(props);
  return null;
}

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

    return color as Color;
  }

  const getNodeColor = (d: unknown) => {
    let node = d as Feature<Point>;
    let color = [0, 255, 178, 150];

    if (props.highlightedNodes.length > 0
      && node.properties?.name
      && props.highlightedNodes.find((hn: string) => node.properties?.name.toLowerCase() === hn.toLowerCase()) != null) {
        color = [255, 109, 245, 150];
    }

    return color as Color;
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
      widthMinPixels: 3,
      transitions: {
        getColor: {
          type: 'interpolation',
          duration: 700,
          easing: (t: any) => ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2,
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
      onHover: props.handleOnHoverGeoPoint,
      onClick: props.handleOnClickGeoPoint,
      transitions: {
        getFillColor: {
          type: 'interpolation',
          duration: 700,
          easing: (t: any) => ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2,
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
    <DeckGLMapboxOverlay
      layers={layers}
    />
  );
}

export default DeckGLOverlay;