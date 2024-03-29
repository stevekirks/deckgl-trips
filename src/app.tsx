import { useRef, useState, useEffect } from 'react';
import Map, { Popup, MapRef, NavigationControl } from 'react-map-gl';
import DeckGLOverlay from './deckgl-overlay';
import InfoBox from './info-box';
import Loader from './loader';
import { AppSettings, KnownUrlParameters, Trip, TripContainer } from './data-interfaces';
import * as Utils from './utils';
import * as geojson from 'geojson';
import './app.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { DEFAULT_APP_SETTINGS } from './default-app-config';

const App = () => {

  const [knownUrlParams, setKnownUrlParams] = useState<KnownUrlParameters>(Utils.getKnownUrlParameters());
  const [appSettings, setAppSettings] = useState<AppSettings>(DEFAULT_APP_SETTINGS);
  const [dataSampleIdx, setDataSampleIdx] = useState(knownUrlParams.dataSampleIdx || -1);
  const [friendlyName, setFriendlyName] = useState('');
  const [highlightedNodes, setHighlightedNodes] = useState(knownUrlParams.highlightedNodes != null ? knownUrlParams.highlightedNodes : []);
  const [loopLength, setLoopLength] = useState(1000);
  const [loopTimeMinutes, setLoopTimeMinutes] = useState(knownUrlParams.loopTime || DEFAULT_APP_SETTINGS.initialLoopTimeMinutes);
  const [nodeList, setNodeList] = useState<string[]>([]);
  const [nodes, setNodes] = useState<geojson.FeatureCollection<geojson.Point> | null>(null);
  const [popupInfo, setPopupInfo] = useState<any>(null);
  const [startDate, setStartDate] = useState<Date>(new Date(2000, 1, 1, 0, 0, 0));
  const [timestampOffset, setTimestampOffset] = useState<number>(Date.now());
  const [timeMultiplier, setTimeMultiplier] = useState(1);
  const [trailLength, setTrailLength] = useState(knownUrlParams.trailLength || DEFAULT_APP_SETTINGS.initialTrailLength);
  const [trips, setTrips] = useState<Trip[] | null>(null);
  const [mapHeight, setMapHeight] = useState(window.innerHeight);

  const mapRef = useRef<MapRef>(null);

  const reloadTrips = () => {
    // create a new array for trips so the colours are updated
    setTrips((prevTrips) => { return prevTrips ? [...prevTrips] : prevTrips; });
  }

  const handleHighlightedNodes = (pHighlightedNodes: string[]) => {
    setHighlightedNodes(pHighlightedNodes);
    setKnownUrlParams((prevKnownUrlParams) => { return { ...prevKnownUrlParams, highlightedNodes: pHighlightedNodes }; });
    setNodes((prevNodes) => { return prevNodes ? {...prevNodes} : prevNodes; });
  }

  const handleLoopTimeMinutes = (pLoopTimeMinutes: number) => {
    setLoopTimeMinutes(pLoopTimeMinutes);
    setKnownUrlParams((prevKnownUrlParams) => { return { ...prevKnownUrlParams, loopTime: pLoopTimeMinutes }; });
  }

  const handleOnClickGeoPoint = (info: any) => {
    console.log(info.object.properties.name)
    const node = info.object.properties.name;
    const highlightedNodeIdx = highlightedNodes.indexOf(node);
    const pHighlightedNodes = highlightedNodes.slice(0);
    if (highlightedNodeIdx == -1) {
      pHighlightedNodes.push(node);
    } else {
      pHighlightedNodes.splice(highlightedNodeIdx, 1);
    }
    handleHighlightedNodes(pHighlightedNodes);
    reloadTrips();
  }

  const handleOnHoverGeoPoint = (info: any) => {
    setPopupInfo(info !== null ? info.object : null);
  }

  const handleTimestampOffset = (pTimestampOffset: number) => { setTimestampOffset(pTimestampOffset); }

  const handleTrailLength = (pTrailLength: number) => {
    setTrailLength(pTrailLength);
    setKnownUrlParams((prevKnownUrlParams) => { return { ...prevKnownUrlParams, trailLength: pTrailLength }; });
  }

  const handleDataChange = (pDataSampleIdx: number) => {
    setDataSampleIdx(pDataSampleIdx);
  }

  useEffect(() => {
    const loadAppSettings = () => {
      fetch('app-settings.json', {
        method: "GET",
        headers: { "Accept": "application/json; charset=utf-8" }
      }).then(function (fetchResponse) {
        if (fetchResponse.status === 200) {
          fetchResponse.json().then((pAppSettings: AppSettings) => {
            setAppSettings((prevAppSettings) => { return { ...prevAppSettings, ...pAppSettings }; });
          });
        } else {
          console.log('Sorry, could not load config (' + fetchResponse.status + ')');
        }
      }).catch(function (error) {
        console.log(error);
      });
    };

    const handleWindowResize = () => setMapHeight(window.innerHeight);
    window.addEventListener('resize', handleWindowResize);

    loadAppSettings();
    return () => window.removeEventListener("resize", handleWindowResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLoopTimeMinutes(knownUrlParams.loopTime || appSettings.initialLoopTimeMinutes);
    setTrailLength(knownUrlParams.trailLength || appSettings.initialTrailLength);
  }, [knownUrlParams, appSettings]);

  useEffect(() => {
    const loadTrips = (dataUrlIdx: number) => {
      let url = appSettings.dataSamples[dataUrlIdx].tripsUrl;
      fetch(url)
        .then(function (fetchResponse) {
          if (fetchResponse.status === 200) {
            fetchResponse.json().then((response: TripContainer) => {
              let pFriendlyName = appSettings.title;
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
                  pTrips[i].color = appSettings.colors[i % appSettings.colors.length];
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
            console.log('Something went wrong loading trips (' + fetchResponse.status + ')');
          }
        }).catch(function (error) {
          console.log(error);
        });
    };

    const loadNodeList = (dataUrlIdx: number) => {
      fetch(appSettings.dataSamples[dataUrlIdx].nodeListUrl)
        .then(function (fetchResponse) {
          if (fetchResponse.status === 200) {
            fetchResponse.json().then((response: string[]) => {
              response.sort();
              setNodeList(response);
            });
          } else {
            console.log('Something went wrong loading node list (' + fetchResponse.status + ')');
          }
        }).catch(function (error) {
          console.log(error);
        });
    };

    const loadGeoJsonNodes = (dataUrlIdx: number) => {
      fetch(appSettings.dataSamples[dataUrlIdx].geoJsonUrl)
        .then(function (fetchResponse) {
          if (fetchResponse.status === 200) {
            fetchResponse.json().then((response: geojson.FeatureCollection<geojson.Point>) => {
              setNodes(response);
            });
          } else {
            console.log('Something went wrong loading GeoJSON nodes (' + fetchResponse.status + ')');
          }
        }).catch(function (error) {
          console.log(error);
        });
    };

    if (appSettings.dataSamples.length > 0) {
      if (dataSampleIdx <= -1) {
        setDataSampleIdx(0);
      } else {
        setKnownUrlParams((prevKnownUrlParams) => { return { ...prevKnownUrlParams, dataSampleIdx: dataSampleIdx }; });
        setDataSampleIdx(dataSampleIdx);
        loadTrips(dataSampleIdx);
        loadNodeList(dataSampleIdx);
        loadGeoJsonNodes(dataSampleIdx);
        mapRef.current?.flyTo({
          center: [
            appSettings.dataSamples[dataSampleIdx].initialPartialViewState.longitude, 
            appSettings.dataSamples[dataSampleIdx].initialPartialViewState.latitude
          ], 
          duration: 2000,
          zoom: appSettings.dataSamples[dataSampleIdx].initialPartialViewState.zoom
        });
      }
    }
  }, [dataSampleIdx, appSettings]);

  useEffect(() => {
    window.history.pushState({}, '', '');
    Utils.updateUrlParameters(knownUrlParams);
  }, [knownUrlParams]);

  let loader = <span></span>;
  if (trips == null) {
    loader = <Loader />;
  }

  let popupEle = null;
  if (popupInfo != null) {
    popupEle =
      <Popup longitude={popupInfo.geometry.coordinates[0]} latitude={popupInfo.geometry.coordinates[1]} closeButton={false} closeOnClick={false} anchor="bottom-left">
        <div className="popup-inner">{appSettings.nodeLabel} {popupInfo.properties != null ? popupInfo.properties.name : ''}</div>
      </Popup>;
  }

  return (
    <div id="container">
      {loader}
      <div id="divdeckgl">
        <Map
          maxZoom={appSettings.maxZoom}
          initialViewState={appSettings.initialViewState}
          ref={mapRef}
          mapStyle={appSettings.mapboxStyle}
          dragRotate={true}
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN!}
          style={{height: mapHeight}}
          >
          <DeckGLOverlay
            color={appSettings.color}
            handleOnClickGeoPoint={handleOnClickGeoPoint}
            handleOnHoverGeoPoint={handleOnHoverGeoPoint}
            highlightColor={appSettings.highlightColor}
            highlightedNodes={highlightedNodes}
            loopLength={loopLength}
            loopTimeMinutes={loopTimeMinutes}
            nodes={nodes!}
            timestampOffset={timestampOffset}
            trips={trips}
            trailLength={trailLength}
          />
          {popupEle}
          <NavigationControl />
        </Map>
      </div>
      <InfoBox
        appConfig={appSettings}
        dataSampleIdx={dataSampleIdx}
        friendlyName={friendlyName}
        handleDataChange={handleDataChange}
        highlightedNodes={highlightedNodes}
        handleHighlightedNodes={handleHighlightedNodes}
        loopLength={loopLength}
        loopTimeMinutes={loopTimeMinutes}
        handleLoopTimeMinutes={handleLoopTimeMinutes}
        nodeList={nodeList}
        startDate={startDate}
        timestampOffset={timestampOffset}
        handleTimestampOffset={handleTimestampOffset}
        timeMultiplier={timeMultiplier}
        trailLength={trailLength}
        handleTrailLength={handleTrailLength}
        reloadTrips={reloadTrips}
      />
    </div>
  );
}

export default App;