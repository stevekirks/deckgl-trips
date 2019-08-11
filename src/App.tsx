import * as React from 'react';
import * as ReactDOM from 'react-dom';
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
import { CURRENT_APP_CONFIG } from './app-config';

export default class App extends React.Component<AppProps, AppState> {

  timestampOffset: number;
  knownUrlParams: KnownUrlParameters;
  highlighedStopsChangedBeforeReload: boolean;

  constructor(props: any) {
    super(props);

    this.knownUrlParams = Utils.getKnownUrlParameters();

    let initialDataSampleIdx = this.knownUrlParams.dataSampleIdx || 0;

    this.state = {
      friendlyName: '',
      startDate: new Date(2000, 1, 1, 0, 0, 0),
      trips: null,
      loopLength: 1000,
      loopTimeMinutes: this.knownUrlParams.loopTime || CURRENT_APP_CONFIG.defaultLoopTimeMinutes,
      timeMultiplier: 1,
      friendlyTime: '',
      trailLength: this.knownUrlParams.trailLength || CURRENT_APP_CONFIG.defaultTrailLength,
      percentThroughLoop: 0,
      highlightedStops: this.knownUrlParams.highlightedStops != null ? this.knownUrlParams.highlightedStops : [],
      dataSampleIdx: initialDataSampleIdx,
      stopList: [],
      stops: null,
      popupInfo: null,
      viewport: Object.assign({}, CURRENT_APP_CONFIG.getInitialViewport(), CURRENT_APP_CONFIG.dataSamples[initialDataSampleIdx].getInitialPartialViewport()) 
    };

    this.timestampOffset = Date.now();
    this.highlighedStopsChangedBeforeReload = false;

    this.handleDataChange = this.handleDataChange.bind(this);
    this.handleHighlightStopChange = this.handleHighlightStopChange.bind(this);
    this.handleHighlightStopReload = this.handleHighlightStopReload.bind(this);
    this.handleLoopTimeMinutesChange = this.handleLoopTimeMinutesChange.bind(this);
    this.handleOnHoverGeoPoint = this.handleOnHoverGeoPoint.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.handleTrailLengthChange = this.handleTrailLengthChange.bind(this);
    this.loadTrips = this.loadTrips.bind(this);
    this.loadStopList = this.loadStopList.bind(this);
    this.updateBoxInfo = this.updateBoxInfo.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize.bind(this));
    this.resize();
    this.loadTrips(this.state.dataSampleIdx);
    this.loadStopList(this.state.dataSampleIdx);
    this.loadGeoJsonStops(this.state.dataSampleIdx);
  }

  componentWillUnmount() {
  }

  loadTrips(dataUrlIdx: number) {
    let url = CURRENT_APP_CONFIG.dataSamples[dataUrlIdx].tripsUrl;
    requestJson(url, (error: any, response: TripContainer) => {
      if (error == null) {
        let friendlyName = CURRENT_APP_CONFIG.defaultTitle;
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
            trips[i].color = CURRENT_APP_CONFIG.colors[i % CURRENT_APP_CONFIG.colors.length];
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

  loadStopList(dataUrlIdx: number) {
    requestJson(CURRENT_APP_CONFIG.dataSamples[dataUrlIdx].stopListUrl, (error: any, response: any) => {
      if (error == null) {
        let stops = response as string[];
        stops.sort();
        this.setState({
          stopList: stops
        });
      }
    });
  }

  loadGeoJsonStops(dataUrlIdx: number) {
    requestJson(CURRENT_APP_CONFIG.dataSamples[dataUrlIdx].geoJsonUrl, (error: any, response: any) => {
      if (error == null) {
        let stops = response as geojson.FeatureCollection<geojson.Point>;
        this.setState({
          stops: stops
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
      this.setState({trailLength: CURRENT_APP_CONFIG.defaultTrailLength});
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
      this.setState({loopTimeMinutes: CURRENT_APP_CONFIG.defaultLoopTimeMinutes});
      this.knownUrlParams.trailLength = null;
      Utils.updateUrlParameters(this.knownUrlParams);
    }
  }

  handleHighlightStopChange(highlightedStopsCommaSep: ValueType<any>, action: ActionMeta) {
    if (highlightedStopsCommaSep == null) {
      highlightedStopsCommaSep = [];
    }
    let highlightedStops: string[] = highlightedStopsCommaSep.map((n: any) => n.value);
    let highlightedStopsRemoved = this.state.highlightedStops.length > highlightedStops.length;
    if (this.state.highlightedStops.length !== highlightedStops.length) {
      this.highlighedStopsChangedBeforeReload = true;
    }
    this.setState({highlightedStops: highlightedStops});
    this.knownUrlParams.highlightedStops = highlightedStops;
    Utils.updateUrlParameters(this.knownUrlParams);
    if (highlightedStopsRemoved) {
      this.handleHighlightStopReload();
    }
  }

  handleHighlightStopReload() {
    if (this.highlighedStopsChangedBeforeReload === true) {
      // a forceUpdate doesn't update the trip colours, so remove and re-add
      let cacheTrips = this.state.trips;
      this.setState({trips: null});
      setTimeout(() => {
        this.highlighedStopsChangedBeforeReload = false;
        this.setState({trips: cacheTrips});
      }, 200);
    }
  }

  handleDataChange(dataSampleOption: ValueType<any>, action: ActionMeta) {    
    if (dataSampleOption != null && this.state.dataSampleIdx !== dataSampleOption.value) {
      let dataSampleIdx = dataSampleOption.value as number;
      window.history.pushState({}, '', '')
      this.setState({trips: null, dataSampleIdx: dataSampleIdx});
      this.loadTrips(dataSampleIdx);
      this.loadStopList(dataSampleIdx);
      this.loadGeoJsonStops(dataSampleIdx);
      this.handleViewportChange(CURRENT_APP_CONFIG.dataSamples[dataSampleIdx].getInitialPartialViewport());
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
    const {friendlyName, trips, friendlyTime, loopLength, loopTimeMinutes, trailLength, percentThroughLoop, highlightedStops, stopList, dataSampleIdx: dataUrlIdx, stops, popupInfo, viewport} = this.state;

    const dataSampleOptions: any[] = CURRENT_APP_CONFIG.dataSamples.map((n: DataSampleUrls, idx: number) => { return { "value": idx, "label": n.title} });
    const stopListOptions: any[] = stopList.map(n => { return { "value": n, "label": n} });
    const highlightedStopsVl: any[] = highlightedStops.map(n => { return { "value": n, "label": n} });

    let loader = <span></span>;
    if (trips == null) {
      loader = <Loader />;
    }

    let popupEle = null;
    if (popupInfo != null) {
      popupEle =
        <Popup longitude={popupInfo.geometry.coordinates[0]} latitude={popupInfo.geometry.coordinates[1]} closeButton={false} closeOnClick={false} anchor="bottom-left">
          <div>Bus Stop {popupInfo.properties != null ? popupInfo.properties.name : ''}</div>
        </Popup>;
    }

    let selectDataEle = null;
    if (CURRENT_APP_CONFIG.dataSamples.length > 1) {
      selectDataEle = <div><h6>Select Data</h6><div><Select options={dataSampleOptions} onChange={this.handleDataChange} value={dataSampleOptions[dataUrlIdx]} /></div></div>;
    }

    return (
      <div id="container">
        {loader}
        <div id="divdeckgl">
          <ReactMapGL 
            {...viewport}
            mapStyle={CURRENT_APP_CONFIG.mapboxStyle}
            dragRotate={true}
            onViewportChange={this.handleViewportChange.bind(this)}
            mapboxApiAccessToken={CURRENT_APP_CONFIG.mapboxToken}>
            <DeckGLOverlay 
              handleOnHover={this.handleOnHoverGeoPoint}
              highlightedStops={highlightedStops}
              loopLength={loopLength}
              loopTimeMilliseconds={this.getLoopTime()}
              periodicTripUpdateCallback={this.updateBoxInfo}
              stops={stops!}
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
              <h6>Highlight Stops</h6>
              <div>
                <Select
                  closeMenuOnSelect={false}
                  isMulti
                  options={stopListOptions}
                  onChange={this.handleHighlightStopChange}
                  onMenuClose={this.handleHighlightStopReload}
                  placeholder="Highlight stop(s)"
                  value={highlightedStopsVl}
                />
              </div>
          </div>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.body.appendChild(document.createElement('div')));