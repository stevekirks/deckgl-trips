import { useState, useEffect } from 'react';
import ReactMapGL, {Popup} from 'react-map-gl';
import DeckGLOverlay from './deckgl-overlay';
import Loader from './loader';
import {AppConfig, KnownUrlParameters, Trip, TripContainer, DataSampleUrls} from './data-interfaces';
import * as Utils from './utils';
import Select from 'react-select';
import * as geojson from 'geojson';
import './app.css';
import './select.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ValueType } from 'react-select/src/types';
import { DEFAULT_APP_CONFIG } from './default-app-config';

// Workaround: next 4 lines are to fix issue https://github.com/mapbox/mapbox-gl-js/issues/10565
// Install packages worker-loader & mapbox-gl
import mapboxgl from "mapbox-gl";
// eslint-disable-next-line import/no-webpack-loader-syntax
(mapboxgl as any).workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

const App = () => {

  let knownUrlParams: KnownUrlParameters = Utils.getKnownUrlParameters();
  let initialDataSampleIdx = knownUrlParams.dataSampleIdx || 0;

  const [appConfig] = useState<AppConfig>(DEFAULT_APP_CONFIG);
  const [dataSampleIdx, setDataSampleIdx] = useState(initialDataSampleIdx);
  const [friendlyName, setFriendlyName] = useState('');
  const [friendlyTime, setFriendlyTime] = useState('');
  const [hideInfoBox, setHideInfoBox] = useState(false);
  const [highlightedNodes, setHighlightedNodes] = useState(knownUrlParams.highlightedNodes != null ? knownUrlParams.highlightedNodes : []);
  const [loopLength, setLoopLength] = useState(1000);
  const [loopTimeMinutes, setLoopTimeMinutes] = useState(knownUrlParams.loopTime || DEFAULT_APP_CONFIG.initialLoopTimeMinutes);
  const [nodeList, setNodeList] = useState<string[]>([]);
  const [nodes, setNodes] = useState<geojson.FeatureCollection<geojson.Point> | null>(null);
  const [percentThroughLoop, setPercentThroughLoop] = useState(0);
  const [popupInfo, setPopupInfo] = useState<any>(null);
  const [startDate, setStartDate] = useState<Date>(new Date(2000, 1, 1, 0, 0, 0));
  const [timestampOffset, setTimestampOffset] = useState<number>(Date.now());
  const [timeMultiplier, setTimeMultiplier] = useState(1);
  const [trailLength, setTrailLength] = useState(knownUrlParams.trailLength || DEFAULT_APP_CONFIG.initialTrailLength);
  const [trips, setTrips] = useState<Trip[] | null>(null);
  const [updateBoxInfoLoopToggle, setUpdateBoxInfoLoopToggle] = useState(false);
  const [viewport, setViewport] = useState(Object.assign({}, DEFAULT_APP_CONFIG.initialViewport, DEFAULT_APP_CONFIG.dataSamples[initialDataSampleIdx].initialPartialViewport));

  useEffect(() => {
    window.addEventListener('resize', resize);
    resize();
    loadTrips(dataSampleIdx);
    loadNodeList(dataSampleIdx);
    loadGeoJsonNodes(dataSampleIdx);
    const intervalId = setInterval(() => setUpdateBoxInfoLoopToggle(updateBoxInfoLoopToggle => !updateBoxInfoLoopToggle), 1000);
    return () => {
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Update Box Info

    const toFriendlyTime = (timeSinceStart: number) => {
      let realTimeSinceStart = timeSinceStart / timeMultiplier;
      let currentDate = new Date(startDate.getTime() + realTimeSinceStart * 1000);
      let minutes = String(currentDate.getMinutes());
      if (minutes.length < 2) {
        minutes = '0' + minutes;
      }
      return currentDate.getDate() + '/' + (currentDate.getMonth() + 1) + '/' + currentDate.getFullYear() + ' ' + currentDate.getHours() + ':' + minutes;
    }

    if (startDate != null) {
      const pTimestamp = Date.now() - timestampOffset;
      const pLoopTime = loopTimeMinutes * 60 * 1000; // the loop time in milliseconds that deck gl displays

      let timeThroughLoop = (pTimestamp % pLoopTime);
      let pPercentThroughLoop = Math.floor((timeThroughLoop / pLoopTime) * 100);

      // show time
      let timeSinceStart = Math.floor(timeThroughLoop * (loopLength / pLoopTime));
      let calculatedFriendlyTime = toFriendlyTime(timeSinceStart);

      setFriendlyTime(calculatedFriendlyTime);
      setPercentThroughLoop(pPercentThroughLoop);
    }
  }, [updateBoxInfoLoopToggle, timestampOffset, loopLength, loopTimeMinutes, startDate, timeMultiplier]);

  const loadTrips = (dataUrlIdx: number) => {
    let url = appConfig.dataSamples[dataUrlIdx].tripsUrl;
    fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Accept": "application/json; charset=utf-8"
        }
    }).then(function (fetchResponse) {
        if (fetchResponse.status === 200) {
          fetchResponse.json().then((response: TripContainer) => {
            let pFriendlyName = appConfig.title;
            if (response.friendlyName != null) {
              pFriendlyName = response.friendlyName;
            }
            let pStartDate = Number(response.startTimestamp) 
              ? new Date(response.startTimestamp as number * 1000)
              : new Date(Date.parse(response.startTimestamp as string));
            let pTimeMultiplier = response.timeMultiplier;
            let pTrips = response.trips;
            let pLoopLength = response.loopLength;

            // allocate colours if there's a small number of trips
            if (pTrips.length > 0 && pTrips.length <= 10) {
              for (let i = 0; i < pTrips.length; i++) {
                pTrips[i].color = appConfig.colors[i % appConfig.colors.length];
              }
            }

            setStartDate(pStartDate);
            setTimestampOffset(Date.now());
            setFriendlyName(pFriendlyName);
            setTrips(pTrips);
            setLoopLength(pLoopLength);
            setTimeMultiplier(pTimeMultiplier);
          });
        } else {
          console.log('Sorry, something went wrong (' + fetchResponse.status + ')');
        }
    }).catch(function (error) {
        console.log(error);
    });
  }

  const loadNodeList = (dataUrlIdx: number) => {
    fetch(appConfig.dataSamples[dataUrlIdx].nodeListUrl, {
      method: "GET",
      headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Accept": "application/json; charset=utf-8"
      }
    }).then(function (fetchResponse) {
        if (fetchResponse.status === 200) {
          fetchResponse.json().then((response: string[]) => {
            response.sort();
            setNodeList(response);
          });
        } else {
          console.log('Sorry, something went wrong (' + fetchResponse.status + ')');
        }
    }).catch(function (error) {
        console.log(error);
    });
  }

  const loadGeoJsonNodes = (dataUrlIdx: number) => {
    fetch(appConfig.dataSamples[dataUrlIdx].geoJsonUrl, {
      method: "GET",
      headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Accept": "application/json; charset=utf-8"
      }
    }).then(function (fetchResponse) {
        if (fetchResponse.status === 200) {
          fetchResponse.json().then((response: geojson.FeatureCollection<geojson.Point>) => {
            setNodes(response);
          });
        } else {
          console.log('Sorry, something went wrong (' + fetchResponse.status + ')');
        }
    }).catch(function (error) {
        console.log(error);
    });
  }

  // the loop time in milliseconds that deck gl displays
  const getLoopTime = () => {
    return loopTimeMinutes * 60 * 1000; // in x * 1000, x is in seconds
  }

  const handleTimeChange = (event: any) => {
    const timestamp = Date.now() - timestampOffset;
    const loopTime = getLoopTime();
    let timeThroughLoop = (timestamp % loopTime);
    let newPercentThroughLoop = event.target.value;
    let newTimeThroughLoop = (newPercentThroughLoop / 100) * loopTime;
    let newTimestampOffset = timestampOffset + (timeThroughLoop - newTimeThroughLoop);
    setTimestampOffset(newTimestampOffset);
  }

  const handleTrailLengthChange = (event: any) => {
    let trailLengthStr = event.target.value;
    if (trailLengthStr != null && trailLengthStr.length > 0) {
      let pTrailLength = parseFloat(trailLengthStr);
      if (pTrailLength <= 0) {
        pTrailLength = 0.0001;
      } else if (pTrailLength > 9999999) {
        pTrailLength = 9999999;
      }
      setTrailLength(pTrailLength);
      knownUrlParams.trailLength = pTrailLength;
      Utils.updateUrlParameters(knownUrlParams);
    } else {
      setTrailLength(appConfig.initialTrailLength);
      knownUrlParams.trailLength = null;
      Utils.updateUrlParameters(knownUrlParams);
    }
  }

  const handleLoopTimeMinutesChange = (event: any) => {
    let loopTimeMinutesStr = event.target.value;
    if (loopTimeMinutesStr != null && loopTimeMinutesStr.length > 0) {
      let pLoopTimeMinutes = parseFloat(loopTimeMinutesStr);
      if (pLoopTimeMinutes <= 0) {
        pLoopTimeMinutes = 0.0001;
      } else if (pLoopTimeMinutes > 9999999) {
        pLoopTimeMinutes = 9999999;
      }
      const timestamp = Date.now() - timestampOffset;
      const loopTime = getLoopTime(); // the loop time in milliseconds that deck gl displays
  
      let newLoopTime = pLoopTimeMinutes * 60 * 1000; // in x * 1000, x is in seconds
  
      // Adjust the timestampOffset so that the new loop time kicks off at the same time as currently
      let newTimestampOffset = timestampOffset 
        + ((timestamp % newLoopTime) - (newLoopTime * ((timestamp % loopTime) / loopTime)));
      setTimestampOffset(newTimestampOffset);
  
      setLoopTimeMinutes(pLoopTimeMinutes);
      knownUrlParams.loopTime = pLoopTimeMinutes;
      Utils.updateUrlParameters(knownUrlParams);
    } else {
      setLoopTimeMinutes(appConfig.initialLoopTimeMinutes);
      knownUrlParams.trailLength = null;
      Utils.updateUrlParameters(knownUrlParams);
    }
  }

  const handleHighlightNodeChange = (highlightedNodesCommaSep: ValueType<any, any>) => {
    if (highlightedNodesCommaSep == null) {
      highlightedNodesCommaSep = [];
    }
    let pHighlightedNodes: string[] = highlightedNodesCommaSep.map((n: any) => n.value);
    let highlightedNodesRemoved = highlightedNodes.length > pHighlightedNodes.length;
    setHighlightedNodes(pHighlightedNodes);
    knownUrlParams.highlightedNodes = pHighlightedNodes;
    Utils.updateUrlParameters(knownUrlParams);
    if (highlightedNodesRemoved) {
      handleHighlightNodeReload();
    }
  }

  const handleHighlightNodeReload = () => {
    // create a new array for trips so the colours are updated
    setTrips(Object.assign([], trips));
  }

  const handleDataChange = (dataSampleOption: ValueType<any, any>) => {    
    if (dataSampleOption != null && dataSampleIdx !== dataSampleOption.value) {
      handleHighlightNodeChange([]);
      let pDataSampleIdx = dataSampleOption.value as number;
      window.history.pushState({}, '', '')
      setTrips(null);
      setDataSampleIdx(pDataSampleIdx);
      loadTrips(pDataSampleIdx);
      loadNodeList(pDataSampleIdx);
      loadGeoJsonNodes(pDataSampleIdx);
      handleViewportChange(appConfig.dataSamples[pDataSampleIdx].initialPartialViewport);
      knownUrlParams.dataSampleIdx = pDataSampleIdx;
      Utils.updateUrlParameters(knownUrlParams);
    }
  }

  const handleOnHoverGeoPoint = (info: any) => {
    setPopupInfo(info !== null ? info.object : null);
  }

  const resize = () => {
    handleViewportChange({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  const handleViewportChange = (pViewport: any) => {
    setViewport(Object.assign({}, viewport, pViewport));
  }

  const handleInfoBoxVisibility = (pHideInfoBox: boolean) => {
    setHideInfoBox(pHideInfoBox);
  }

  const dataSampleOptions: any[] = appConfig.dataSamples.map((n: DataSampleUrls, idx: number) => { return { "value": idx, "label": n.title} });
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
        <div className="popup-inner">{appConfig.nodeLabel} {popupInfo.properties != null ? popupInfo.properties.name : ''}</div>
      </Popup>;
  }

  let selectDataEle = null;
  if (appConfig.dataSamples.length > 1) {
    selectDataEle = <div><h6>Select Data</h6><div><Select options={dataSampleOptions} onChange={handleDataChange} value={dataSampleOptions[dataSampleIdx]} /></div></div>;
  }

  return (
    <div id="container">
      {loader}
      <div id="divdeckgl">
        <ReactMapGL 
          {...viewport}
          mapStyle={appConfig.mapboxStyle}
          dragRotate={true}
          onViewportChange={handleViewportChange}
          mapboxApiAccessToken={appConfig.mapboxToken}>
          <DeckGLOverlay 
            color={appConfig.color}
            handleOnHover={handleOnHoverGeoPoint}
            highlightColor={appConfig.highlightColor}
            highlightedNodes={highlightedNodes}
            initialViewState={appConfig.initialViewport}
            loopLength={loopLength}
            loopTimeMinutes={loopTimeMinutes}
            nodes={nodes!}
            timestampOffset={timestampOffset}
            trips={trips}
            trailLength={trailLength}
            viewport={viewport}
            />
          {popupEle}
        </ReactMapGL>
      </div>
      <div id="top-left-container">
        <div id="title-box"><h1>{friendlyName}</h1></div>
        <div id="divinfo" className={hideInfoBox ? "hide" : ""}>
          <button id="btnHideInfoBox" className="btn-transparent right-align" onClick={() => handleInfoBoxVisibility(true)}>X</button>
          {selectDataEle}
          <h3>{friendlyTime}</h3>
          <div>
            <h6>Adjust point in time</h6>
            <input className="full-width" type="range" min="0" max="100" value={String(percentThroughLoop)} onChange={handleTimeChange} />
          </div>
          <div>
            <h6>Adjust loop time</h6>
            <div className="block">
              <input className="" type="number" defaultValue={String(loopTimeMinutes)} onInput={handleLoopTimeMinutesChange} /><label>mins</label>
            </div>
          </div>
          <div>
            <h6>Adjust trail length</h6>
            <div className="block">
              <input type="number" defaultValue={String(trailLength)} onInput={handleTrailLengthChange} /><label>x</label>
            </div>
          </div>
          <div>
            <h6>Highlight {appConfig.nodeLabelPlural}</h6>
            <div>
              <Select
                closeMenuOnSelect={false}
                isMulti
                options={nodeListOptions}
                onChange={handleHighlightNodeChange}
                onMenuClose={handleHighlightNodeReload}
                placeholder={"Highlight " + appConfig.nodeLabelPlural}
                value={highlightedNodesVl}
              />
            </div>
          </div>
        </div>
        <button id="btnShowInfoBox" className={"btn-transparent " + (hideInfoBox ? "" : "hide")} onClick={() => handleInfoBoxVisibility(false)}>SHOW INFO BOX</button>
      </div>
    </div>
  );
}

export default App;