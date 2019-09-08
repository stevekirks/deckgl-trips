import * as React from 'react';
import DeckGL, {GeoJsonLayer, TripsLayer} from 'deck.gl';
import {DeckglOverlayProps, Trip, DeckflOverlayState} from './data-interfaces';
import { CURRENT_APP_CONFIG } from './app-config';

export default class DeckGLOverlay extends React.Component<DeckglOverlayProps, DeckflOverlayState> {

  animationFrame: number | null;

  constructor(props: any) {
    super(props);

    this.state = {
      currentTime: 0
    };

    this.animationFrame = null;

    this.animate = this.animate.bind(this);
    this.getColor = this.getColor.bind(this);
  }

  componentDidMount() {
    this.animate();
  }

  componentWillUnmount() {
    if (this.animationFrame != null) {
      window.cancelAnimationFrame(this.animationFrame);
    }
  }

  animate() {
    if (this.props.loopLength != null) {
      const timestamp = Date.now() - this.props.timestampOffset;
      const loopTime = this.props.loopTimeMilliseconds; // the loop time in milliseconds that deck gl displays

      // 432000 == 5 days

      this.setState({
        currentTime: (timestamp % loopTime) * (this.props.loopLength / loopTime)
      });
    }
    this.animationFrame = window.requestAnimationFrame(this.animate.bind(this));
  }
  
  getColor(d: Trip) {
    let color = CURRENT_APP_CONFIG.color;

    const tagColor = d.color;
    if (tagColor != null) {
      color = tagColor;
    }

    if (d.nodes != null) {
      if (this.props.highlightedNodes.length > 0) {
        let self = this;
        d.nodes.forEach((n: string) => {
          if (self.props.highlightedNodes.find((hn: string) => n.toLowerCase() === hn.toLowerCase()) != null) {
            color = CURRENT_APP_CONFIG.highlightColor;
          }
        });
      }
    }

    return color;
  }

  render() {
    const {trips, trailLength, nodes, handleOnHover, viewport} = this.props;
    const {currentTime} = this.state;

    let layers = [];
    
    if (trips != null) {
      layers.push(new TripsLayer({
        id: 'trips',
        data: trips,
        getPath: (d: any) => d.segments.map((p: any) => p.coordinates),
        getTimestamps: (d: any) => d.segments.map((p: any) => p.timestamp),
        getColor: this.getColor,
        opacity: 0.3,
        widthMinPixels: 2,
        trailLength,
        currentTime
      }));
    }

    if (nodes != null) {
      layers.push(new GeoJsonLayer({
        id: 'geojson-layer',
        data: nodes,
        filled: true,
        getFillColor: (d: any) => [0, 255, 178, 150],
        stroked: true,
        extruded: false,
        pointRadiusScale: 100,
        getRadius: (d: any) => 0.4,
        pickable: true,
        autoHighlight: true,
        highlightColor: [0, 255, 178, 250],
        onHover: handleOnHover,
        onClick: (info: any) => console.log(info.object.properties.name)
      }));
    }

    if (layers.length === 0) {
      return null;
    }

    return (
      <DeckGL
        initialViewState={CURRENT_APP_CONFIG.getInitialViewport()}
        viewState={viewport}
        layers={layers}
      />
    );
  }
}
