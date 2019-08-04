import { KnownUrlParameters } from './data-interfaces';

function getUrlParam(name: string): string {
  let url = new URL(window.location.href);
  let param = url.searchParams.get(name);
  return param!;
};

function getNumber(numStr: string): number | null {
  if (numStr != null) {
    let numNum = Number(numStr);
    if (!Number.isNaN(numNum)) {
      return numNum;
    }
  }
  return null;
}

const PARAM_DATA_IDX = 'dataIdx';
const PARAM_LOOPTIME = 'loopTime';
const PARAM_TRAILLENGTH = 'trailLength';
const PARAM_HIGHLIGHTSTOPS = 'highlightStops';

function updateKeyInString(keysString: string, sParam: string, sValue: string): string {
  let sURLVariables = keysString.length > 0 ? keysString.split('&') : [];
  
  let parameterUpdated = false;
  for (let i = 0; i < sURLVariables.length; i++) {
      let sParameterName = sURLVariables[i].split('=');

      if (sParameterName[0] === sParam) {
          sURLVariables[i] = sParam+'='+(sValue||'');
          parameterUpdated = true;
      }
  }
  if (parameterUpdated === false) {
      sURLVariables.push(sParam+'='+(sValue||''));
  }

  return sURLVariables.join('&');
}

export default {
  getKnownUrlParameters(): KnownUrlParameters {
    let result: KnownUrlParameters = {
      dataUrlIdx: null,
      loopTime: null,
      trailLength: null,
      highlightedStops: null
    };

    // Convert day to dataUrlIdx
    let dataIdx = getNumber(getUrlParam(PARAM_DATA_IDX));
    if (dataIdx != null && dataIdx >= 0) {
      result.dataUrlIdx = dataIdx;
    }

    // Validate loopTime
    let loopTime = getNumber(getUrlParam(PARAM_LOOPTIME));
    if (loopTime != null && loopTime > 0 && loopTime < 999999) {
      result.loopTime = loopTime;
    }

    // Validate trailLength
    let trailLength = getNumber(getUrlParam(PARAM_TRAILLENGTH));
    if (trailLength != null && trailLength > 0 && trailLength < 999999) {
      result.trailLength = trailLength;
    }

    // Validate highlightStop
    let highlightStops = getUrlParam(PARAM_HIGHLIGHTSTOPS);
    if (highlightStops != null && highlightStops.length > 0) {
      result.highlightedStops = highlightStops.split(',');
    }

    return result;
  },

  updateUrlParameters(params: KnownUrlParameters) {
    let newStateStr = decodeURIComponent(window.location.search.substring(1));
    if (params.dataUrlIdx != null) {
      newStateStr = updateKeyInString(newStateStr, PARAM_DATA_IDX, String(params.dataUrlIdx));
    }
    if (params.loopTime != null) {
      newStateStr = updateKeyInString(newStateStr, PARAM_LOOPTIME, String(params.loopTime));
    }
    if (params.trailLength != null) {
      newStateStr = updateKeyInString(newStateStr, PARAM_TRAILLENGTH, String(params.trailLength));
    }
    if (params.highlightedStops != null) {
      newStateStr = updateKeyInString(newStateStr, PARAM_HIGHLIGHTSTOPS, params.highlightedStops.join(','));
    }
    
    let queryFilters = "?" + newStateStr;
    window.history.pushState({}, "", queryFilters);
  }
}