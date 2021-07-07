import { useState, useEffect } from 'react';
import { DataSampleUrls, InfoBoxProps} from './data-interfaces';
import Select from 'react-select';
import './info-box.css';
import './select.css';
import { ValueType } from 'react-select/src/types';

const InfoBox = (props: InfoBoxProps) => {

  const {handleLoopTimeMinutes, handleTimestampOffset, handleTrailLength, handleDataChange, handleHighlightedNodes, reloadTrips} = props;

  const [friendlyTime, setFriendlyTime] = useState('');
  const [hideInfoBox, setHideInfoBox] = useState(false);
  const [percentThroughLoop, setPercentThroughLoop] = useState(0);
  const [updateBoxInfoLoopToggle, setUpdateBoxInfoLoopToggle] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => setUpdateBoxInfoLoopToggle(updateBoxInfoLoopToggle => !updateBoxInfoLoopToggle), 1000);
    return () => {
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Update Box Info

    const toFriendlyTime = (timeSinceStart: number) => {
      let realTimeSinceStart = timeSinceStart / props.timeMultiplier;
      let currentDate = new Date(props.startDate.getTime() + realTimeSinceStart * 1000);
      let minutes = String(currentDate.getMinutes());
      if (minutes.length < 2) {
        minutes = '0' + minutes;
      }
      return currentDate.getDate() + '/' + (currentDate.getMonth() + 1) + '/' + currentDate.getFullYear() + ' ' + currentDate.getHours() + ':' + minutes;
    }

    if (props.startDate != null) {
      const pTimestamp = Date.now() - props.timestampOffset;
      const pLoopTime = props.loopTimeMinutes * 60 * 1000; // the loop time in milliseconds that deck gl displays

      let timeThroughLoop = (pTimestamp % pLoopTime);
      let pPercentThroughLoop = Math.floor((timeThroughLoop / pLoopTime) * 100);

      // show time
      let timeSinceStart = Math.floor(timeThroughLoop * (props.loopLength / pLoopTime));
      let calculatedFriendlyTime = toFriendlyTime(timeSinceStart);

      setFriendlyTime(calculatedFriendlyTime);
      setPercentThroughLoop(pPercentThroughLoop);
    }
  }, [updateBoxInfoLoopToggle, props.timestampOffset, props.loopLength, props.loopTimeMinutes, props.startDate, props.timeMultiplier]);

  // the loop time in milliseconds that deck gl displays
  const getLoopTime = () => {
    return props.loopTimeMinutes * 60 * 1000; // in x * 1000, x is in seconds
  }

  const handleTimeChange = (event: any) => {
    const timestamp = Date.now() - props.timestampOffset;
    const loopTime = getLoopTime();
    let timeThroughLoop = (timestamp % loopTime);
    let newPercentThroughLoop = event.target.value;
    let newTimeThroughLoop = (newPercentThroughLoop / 100) * loopTime;
    let newTimestampOffset = props.timestampOffset + (timeThroughLoop - newTimeThroughLoop);
    handleTimestampOffset(newTimestampOffset);
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
      handleTrailLength(pTrailLength);
    } else {
      handleTrailLength(props.appConfig.initialTrailLength);
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
      const timestamp = Date.now() - props.timestampOffset;
      const loopTime = getLoopTime(); // the loop time in milliseconds that deck gl displays
  
      let newLoopTime = pLoopTimeMinutes * 60 * 1000; // in x * 1000, x is in seconds
  
      // Adjust the timestampOffset so that the new loop time kicks off at the same time as currently
      let newTimestampOffset = props.timestampOffset 
        + ((timestamp % newLoopTime) - (newLoopTime * ((timestamp % loopTime) / loopTime)));
      handleTimestampOffset(newTimestampOffset);
  
      handleLoopTimeMinutes(pLoopTimeMinutes);
    } else {
      handleLoopTimeMinutes(props.appConfig.initialLoopTimeMinutes);
    }
  }

  const handleHighlightNodeChange = (highlightedNodesCommaSep: ValueType<any, any>) => {
    if (highlightedNodesCommaSep == null) {
      highlightedNodesCommaSep = [];
    }
    let pHighlightedNodes: string[] = highlightedNodesCommaSep.map((n: any) => n.value);
    let highlightedNodesRemoved = props.highlightedNodes.length > pHighlightedNodes.length;
    handleHighlightedNodes(pHighlightedNodes);
    if (highlightedNodesRemoved) {
      reloadTrips();
    }
  }

  const handleDataSelectChange = (dataSampleOption: ValueType<any, any>) => {    
    if (dataSampleOption != null) {
      handleHighlightNodeChange([]);
      handleDataChange(dataSampleOption.value as number);
    }
  }

  const handleInfoBoxVisibility = (pHideInfoBox: boolean) => {
    setHideInfoBox(pHideInfoBox);
  }

  const dataSampleOptions: any[] = props.appConfig.dataSamples.map((n: DataSampleUrls, idx: number) => { return { "value": idx, "label": n.title} });
  const nodeListOptions: any[] = props.nodeList.map(n => { return { "value": n, "label": n} });
  const highlightedNodesVl: any[] = props.highlightedNodes.map(n => { return { "value": n, "label": n} });

  let selectDataEle = null;
  if (props.appConfig.dataSamples.length > 1) {
    selectDataEle = <div><h6>Select Data</h6><div><Select options={dataSampleOptions} onChange={handleDataSelectChange} value={dataSampleOptions[props.dataSampleIdx]} /></div></div>;
  }

  return (
    <div id="top-left-container">
      <div id="title-box"><h1>{props.friendlyName}</h1></div>
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
            <input className="" type="number" value={String(props.loopTimeMinutes)} onInput={handleLoopTimeMinutesChange} /><label>mins</label>
          </div>
        </div>
        <div>
          <h6>Adjust trail length</h6>
          <div className="block">
            <input type="number" value={String(props.trailLength)} onInput={handleTrailLengthChange} /><label>x</label>
          </div>
        </div>
        <div>
          <h6>Highlight {props.appConfig.nodeLabelPlural}</h6>
          <div>
            <Select
              closeMenuOnSelect={false}
              isMulti
              options={nodeListOptions}
              onChange={handleHighlightNodeChange}
              onMenuClose={props.reloadTrips}
              placeholder={"Highlight " + props.appConfig.nodeLabelPlural}
              value={highlightedNodesVl}
            />
          </div>
        </div>
      </div>
      <button id="btnShowInfoBox" className={"btn-transparent " + (hideInfoBox ? "" : "hide")} onClick={() => handleInfoBoxVisibility(false)}>SHOW INFO BOX</button>
    </div>
  );
}

export default InfoBox;