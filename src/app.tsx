import * as React from 'react';
import ReactMapGL, {Popup} from 'react-map-gl';
import {json as requestJson} from 'd3-request';
import DeckGLOverlay from './deckgl-overlay';
import Loader from './loader';
import {AppProps, AppState, KnownUrlParameters, TripContainer, DataSampleUrls} from './data-interfaces';
import Utils from './utils';
import Select from 'react-select';
import * as geojson from 'geojson';
import './app.css';
import './select.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ValueType, ActionMeta } from 'react-select/src/types';
import { DEFAULT_APP_CONFIG } from './default-app-config';

export default class App extends React.Component<AppProps, AppState> {

  timestampOffset: number;
  knownUrlParams: KnownUrlParameters;
  intervalId: any;

  constructor(props: any) {
    super(props);

    this.knownUrlParams = Utils.getKnownUrlParameters();

    let initialDataSampleIdx = this.knownUrlParams.dataSampleIdx || 0;

    this.state = {
      appConfig: DEFAULT_APP_CONFIG,
      friendlyName: '',
      startDate: new Date(2000, 1, 1, 0, 0, 0),
      trips: null,
      loopLength: 1000,
      loopTimeMinutes: this.knownUrlParams.loopTime || DEFAULT_APP_CONFIG.defaultLoopTimeMinutes,
      timeMultiplier: 1,
      friendlyTime: '',
      trailLength: this.knownUrlParams.trailLength || DEFAULT_APP_CONFIG.defaultTrailLength,
      percentThroughLoop: 0,
      highlightedNodes: this.knownUrlParams.highlightedNodes != null ? this.knownUrlParams.highlightedNodes : [],
      dataSampleIdx: initialDataSampleIdx,
      nodeList: [],
      nodes: null,
      popupInfo: null,
      viewport: Object.assign({}, DEFAULT_APP_CONFIG.initialViewport, DEFAULT_APP_CONFIG.dataSamples[initialDataSampleIdx].initialPartialViewport)
    };

    this.timestampOffset = Date.now();

    this.handleDataChange = this.handleDataChange.bind(this);
    this.handleHighlightNodeChange = this.handleHighlightNodeChange.bind(this);
    this.handleHighlightNodeReload = this.handleHighlightNodeReload.bind(this);
    this.handleLoopTimeMinutesChange = this.handleLoopTimeMinutesChange.bind(this);
    this.handleOnHoverGeoPoint = this.handleOnHoverGeoPoint.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.handleTrailLengthChange = this.handleTrailLengthChange.bind(this);
    this.loadTrips = this.loadTrips.bind(this);
    this.loadNodeList = this.loadNodeList.bind(this);
    this.updateBoxInfo = this.updateBoxInfo.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize.bind(this));
    this.resize();
    this.loadTrips(this.state.dataSampleIdx);
    this.loadNodeList(this.state.dataSampleIdx);
    this.loadGeoJsonNodes(this.state.dataSampleIdx);
    this.intervalId = setInterval(() => this.updateBoxInfo(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  loadTrips(dataUrlIdx: number) {
    let url = this.state.appConfig.dataSamples[dataUrlIdx].tripsUrl;
    requestJson(url, (error: any, response: TripContainer) => {
      if (error == null) {
        let friendlyName = this.state.appConfig.defaultTitle;
        if (response.friendlyName != null) {
          friendlyName = response.friendlyName;
        }
        let startDate = new Date(Date.parse(response.startTimestamp));
        let timeMultiplier = response.timeMultiplier;
        let trips = response.trips;
        let loopLength = response.loopLength;

        // allocate colours if there's a small number of trips
        if (trips.length > 0 && trips.length <= 10) {
          for (let i = 0; i < trips.length; i++) {
            trips[i].color = this.state.appConfig.colors[i % this.state.appConfig.colors.length];
          }
        }

        this.timestampOffset = Date.now();
        this.setState({
          friendlyName: friendlyName,
          startDate: startDate,
          trips: trips,
          loopLength: loopLength,
          timeMultiplier: timeMultiplier
        });
      }
    });
  }

  loadNodeList(dataUrlIdx: number) {
    requestJson(this.state.appConfig.dataSamples[dataUrlIdx].nodeListUrl, (error: any, response: string[]) => {
      if (error == null) {
        response.sort();
        this.setState({
          nodeList: response
        });
      }
    });
  }

  loadGeoJsonNodes(dataUrlIdx: number) {
    requestJson(this.state.appConfig.dataSamples[dataUrlIdx].geoJsonUrl, (error: any, response: geojson.FeatureCollection<geojson.Point>) => {
      if (error == null) {
        this.setState({
          nodes: response
        });
      }
    });
  }

  // the loop time in milliseconds that deck gl displays
  getLoopTime() {
    return this.state.loopTimeMinutes * 60 * 1000; // in x * 1000, x is in seconds
  }

  updateBoxInfo() {
    if (this.state.startDate != null) {
      const timestamp = Date.now() - this.timestampOffset;
      const loopTime = this.getLoopTime(); // the loop time in milliseconds that deck gl displays

      let timeThroughLoop = (timestamp % loopTime);
      let percentThroughLoop = Math.floor((timeThroughLoop / loopTime) * 100);

      // show time
      const startTime = 0 * 60 * 60 * this.state.timeMultiplier; // hourOfDay * seconds in hour
      let timeSinceStart = startTime + Math.floor(timeThroughLoop * (this.state.loopLength / loopTime));
      let calculatedFriendlyTime = this.toFriendlyTime(timeSinceStart);

      this.setState({
        friendlyTime: calculatedFriendlyTime,
        percentThroughLoop: percentThroughLoop
      });
    }
  }

  toFriendlyTime(timeSinceStart: number) {
      let realTimeSinceStart = timeSinceStart / this.state.timeMultiplier;
      let currentDate = new Date(this.state.startDate.getTime() + realTimeSinceStart * 1000);
      let minutes = String(currentDate.getMinutes());
      if (minutes.length < 2) {
        minutes = '0' + minutes;
      }
      return currentDate.getDate() + '/' + (currentDate.getMonth() + 1) + '/' + currentDate.getFullYear() + ' ' + currentDate.getHours() + ':' + minutes;
  }

  handleTimeChange(event: any) {
    const timestamp = Date.now() - this.timestampOffset;
    const loopTime = this.getLoopTime();
    let timeThroughLoop = (timestamp % loopTime);
    let newPercentThroughLoop = event.target.value;
    let newTimeThroughLoop = (newPercentThroughLoop / 100) * loopTime;
    let newTimestampOffset = this.timestampOffset + (timeThroughLoop - newTimeThroughLoop);
    this.timestampOffset = newTimestampOffset;
  }

  handleTrailLengthChange(event: any) {
    let trailLengthStr = event.target.value;
    if (trailLengthStr != null && trailLengthStr.length > 0) {
      let trailLength = parseFloat(trailLengthStr);
      if (trailLength <= 0) {
        trailLength = 0.0001;
      } else if (trailLength > 9999999) {
        trailLength = 9999999;
      }
      this.setState({trailLength: trailLength});
      this.knownUrlParams.trailLength = trailLength;
      Utils.updateUrlParameters(this.knownUrlParams);
    } else {
      this.setState({trailLength: this.state.appConfig.defaultTrailLength});
      this.knownUrlParams.trailLength = null;
      Utils.updateUrlParameters(this.knownUrlParams);
    }
  }

  handleLoopTimeMinutesChange(event: any) {
    let loopTimeMinutesStr = event.target.value;
    if (loopTimeMinutesStr != null && loopTimeMinutesStr.length > 0) {
      let loopTimeMinutes = parseFloat(loopTimeMinutesStr);
      if (loopTimeMinutes <= 0) {
        loopTimeMinutes = 0.0001;
      } else if (loopTimeMinutes > 9999999) {
        loopTimeMinutes = 9999999;
      }
      const timestamp = Date.now() - this.timestampOffset;
      const loopTime = this.getLoopTime(); // the loop time in milliseconds that deck gl displays
  
      let newLoopTime = loopTimeMinutes * 60 * 1000; // in x * 1000, x is in seconds
  
      // Adjust the timestampOffset so that the new loop time kicks off at the same time as currently
      let newTimestampOffset = this.timestampOffset 
        + ((timestamp % newLoopTime) - (newLoopTime * ((timestamp % loopTime) / loopTime)));
      this.timestampOffset = newTimestampOffset;
  
      this.setState({
        loopTimeMinutes: loopTimeMinutes
      });
      this.knownUrlParams.loopTime = loopTimeMinutes;
      Utils.updateUrlParameters(this.knownUrlParams);
    } else {
      this.setState({loopTimeMinutes: this.state.appConfig.defaultLoopTimeMinutes});
      this.knownUrlParams.trailLength = null;
      Utils.updateUrlParameters(this.knownUrlParams);
    }
  }

  handleHighlightNodeChange(highlightedNodesCommaSep: ValueType<any>) {
    if (highlightedNodesCommaSep == null) {
      highlightedNodesCommaSep = [];
    }
    let highlightedNodes: string[] = highlightedNodesCommaSep.map((n: any) => n.value);
    let highlightedNodesRemoved = this.state.highlightedNodes.length > highlightedNodes.length;
    this.setState({highlightedNodes: highlightedNodes});
    this.knownUrlParams.highlightedNodes = highlightedNodes;
    Utils.updateUrlParameters(this.knownUrlParams);
    if (highlightedNodesRemoved) {
      this.handleHighlightNodeReload();
    }
  }

  handleHighlightNodeReload() {
    // create a new array for trips so the colours are updated
    this.setState({trips: Object.assign([], this.state.trips)});
  }

  handleDataChange(dataSampleOption: ValueType<any>) {    
    if (dataSampleOption != null && this.state.dataSampleIdx !== dataSampleOption.value) {
      this.handleHighlightNodeChange([]);
      let dataSampleIdx = dataSampleOption.value as number;
      window.history.pushState({}, '', '')
      this.setState({trips: null, dataSampleIdx: dataSampleIdx});
      this.loadTrips(dataSampleIdx);
      this.loadNodeList(dataSampleIdx);
      this.loadGeoJsonNodes(dataSampleIdx);
      this.handleViewportChange(this.state.appConfig.dataSamples[dataSampleIdx].initialPartialViewport);
      this.knownUrlParams.dataSampleIdx = dataSampleIdx;
      Utils.updateUrlParameters(this.knownUrlParams);
    }
  }

  handleOnHoverGeoPoint(info: any) {
    this.setState({popupInfo: info !== null ? info.object : null});
  }

  resize() {
    this.handleViewportChange({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  handleViewportChange(viewport: any) {
    this.setState({
      viewport: Object.assign({}, this.state.viewport, viewport)
    });
  }

  render() {
    const {appConfig, friendlyName, trips, friendlyTime, loopLength, loopTimeMinutes, trailLength, percentThroughLoop, highlightedNodes, nodeList, dataSampleIdx: dataUrlIdx, nodes, popupInfo, viewport} = this.state;

    const dataSampleOptions: any[] = this.state.appConfig.dataSamples.map((n: DataSampleUrls, idx: number) => { return { "value": idx, "label": n.title} });
    const nodeListOptions: any[] = nodeList.map(n => { return { "value": n, "label": n} });
    const highlightedNodesVl: any[] = highlightedNodes.map(n => { return { "value": n, "label": n} });

    let loader = <span></span>;
    if (trips == null) {
      loader = <Loader />;
    }

    let popupEle = null;
    if (popupInfo != null) {
      popupEle =
        <Popup longitude={popupInfo.geometry.coordinates[0]} latitude={popupInfo.geometry.coordinates[1]} closeButton={false} closeOnClick={false} anchor="bottom-left">
          <div>{this.state.appConfig.nodeLabel} {popupInfo.properties != null ? popupInfo.properties.name : ''}</div>
        </Popup>;
    }

    let selectDataEle = null;
    if (this.state.appConfig.dataSamples.length > 1) {
      selectDataEle = <div><h6>Select Data</h6><div><Select options={dataSampleOptions} onChange={this.handleDataChange} value={dataSampleOptions[dataUrlIdx]} /></div></div>;
    }

    return (
      <div id="container">
        {loader}
        <div id="divdeckgl">
          <ReactMapGL 
            {...viewport}
            mapStyle={this.state.appConfig.mapboxStyle}
            dragRotate={true}
            onViewportChange={this.handleViewportChange.bind(this)}
            mapboxApiAccessToken={this.state.appConfig.mapboxToken}>
            <DeckGLOverlay 
              color={appConfig.color}
              handleOnHover={this.handleOnHoverGeoPoint}
              highlightColor={appConfig.highlightColor}
              highlightedNodes={highlightedNodes}
              initialViewState={appConfig.initialViewport}
              loopLength={loopLength}
              loopTimeMilliseconds={this.getLoopTime()}
              nodes={nodes!}
              timestampOffset={this.timestampOffset}
              trips={trips}
              trailLength={trailLength}
              viewport={viewport}
              />
            {popupEle}
          </ReactMapGL>
        </div>
        <div id="top-left-container">
          <div id="title-box"><h1>{friendlyName}</h1></div>
          <div id="divinfo">
            {selectDataEle}
            <h3>{friendlyTime}</h3>
            <div>
              <h6>Adjust point in time</h6>
              <input className="full-width" type="range" min="0" max="100" value={String(percentThroughLoop)} onChange={this.handleTimeChange} />
            </div>
            <div>
              <h6>Adjust loop time</h6>
              <div className="block">
                <input className="" type="number" defaultValue={String(loopTimeMinutes)} onInput={this.handleLoopTimeMinutesChange} /><label>mins</label>
              </div>
            </div>
            <div>
              <h6>Adjust trail length</h6>
              <div className="block">
                <input type="number" defaultValue={String(trailLength)} onInput={this.handleTrailLengthChange} /><label>x</label>
              </div>
            </div>
            <div>
              <h6>Highlight {this.state.appConfig.nodeLabelPlural}</h6>
              <div>
                <Select
                  closeMenuOnSelect={false}
                  isMulti
                  options={nodeListOptions}
                  onChange={this.handleHighlightNodeChange}
                  onMenuClose={this.handleHighlightNodeReload}
                  placeholder={"Highlight " + this.state.appConfig.nodeLabelPlural}
                  value={highlightedNodesVl}
                />
              </div>
          </div>
          </div>
        </div>
      </div>
    );
  }
}