import { useState, useEffect } from 'react';
import ReactMapGL, {Popup} from 'react-map-gl';
import DeckGLOverlay from './deckgl-overlay';
import InfoBox from './info-box';
import Loader from './loader';
import {AppConfig, KnownUrlParameters, Trip, TripContainer} from './data-interfaces';
import * as Utils from './utils';
import * as geojson from 'geojson';
import './app.css';
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
  const [highlightedNodes, setHighlightedNodes] = useState(knownUrlParams.highlightedNodes != null ? knownUrlParams.highlightedNodes : []);
  const [loopLength, setLoopLength] = useState(1000);
  const [loopTimeMinutes, setLoopTimeMinutes] = useState(knownUrlParams.loopTime || DEFAULT_APP_CONFIG.initialLoopTimeMinutes);
  const [nodeList, setNodeList] = useState<string[]>([]);
  const [nodes, setNodes] = useState<geojson.FeatureCollection<geojson.Point> | null>(null);
  const [popupInfo, setPopupInfo] = useState<any>(null);
  const [startDate, setStartDate] = useState<Date>(new Date(2000, 1, 1, 0, 0, 0));
  const [timestampOffset, setTimestampOffset] = useState<number>(Date.now());
  const [timeMultiplier, setTimeMultiplier] = useState(1);
  const [trailLength, setTrailLength] = useState(knownUrlParams.trailLength || DEFAULT_APP_CONFIG.initialTrailLength);
  const [trips, setTrips] = useState<Trip[] | null>(null);
  const [viewport, setViewport] = useState(Object.assign({}, DEFAULT_APP_CONFIG.initialViewport, DEFAULT_APP_CONFIG.dataSamples[initialDataSampleIdx].initialPartialViewport));

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

  const handleDataChange = (pDataSampleIdx: number) => {    
    if (dataSampleIdx !== pDataSampleIdx) {
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

  const reloadTrips = () => {
    // create a new array for trips so the colours are updated
    setTrips(Object.assign([], trips));
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

  useEffect(() => {
    window.addEventListener('resize', resize);
    resize();
    loadTrips(dataSampleIdx);
    loadNodeList(dataSampleIdx);
    loadGeoJsonNodes(dataSampleIdx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <InfoBox 
        appConfig={appConfig} 
        dataSampleIdx={dataSampleIdx}
        friendlyName={friendlyName}
        handleDataChange={handleDataChange}
        highlightedNodes={highlightedNodes}
        setHighlightedNodes={setHighlightedNodes}
        loopLength={loopLength}
        loopTimeMinutes={loopTimeMinutes}
        setLoopTimeMinutes={setLoopTimeMinutes}
        nodeList={nodeList}
        startDate={startDate}
        timestampOffset={timestampOffset}
        setTimestampOffset={setTimestampOffset}
        timeMultiplier={timeMultiplier}
        trailLength={trailLength}
        setTrailLength={setTrailLength}
        reloadTrips={reloadTrips}
        />
    </div>
  );
}

export default App;