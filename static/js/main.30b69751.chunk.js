(this["webpackJsonpdeckgl-trips"]=this["webpackJsonpdeckgl-trips"]||[]).push([[0],{108:function(e,t){},142:function(e,t,n){e.exports=n(159)},147:function(e,t,n){},150:function(e,t){},155:function(e,t,n){},156:function(e,t,n){},157:function(e,t,n){},159:function(e,t,n){"use strict";n.r(t);var i=n(4),a=n.n(i),l=n(66),o=n.n(l),s=(n(147),n(72)),r=n(73),h=n(77),d=n(74),u=n(37),p=n(79),c=n(109),m=n(101),g=n(169),f=n(175),v=n(174),b=function(e){function t(e){var n;return Object(s.a)(this,t),(n=Object(h.a)(this,Object(d.a)(t).call(this,e))).animationFrame=void 0,n.state={currentTime:0},n.animationFrame=null,n.animate=n.animate.bind(Object(u.a)(n)),n.getColor=n.getColor.bind(Object(u.a)(n)),n}return Object(p.a)(t,e),Object(r.a)(t,[{key:"componentDidMount",value:function(){this.animate()}},{key:"componentWillUnmount",value:function(){null!=this.animationFrame&&window.cancelAnimationFrame(this.animationFrame)}},{key:"animate",value:function(){if(null!=this.props.loopLength){var e=Date.now()-this.props.timestampOffset,t=this.props.loopTimeMilliseconds;this.setState({currentTime:e%t*(this.props.loopLength/t)})}this.animationFrame=window.requestAnimationFrame(this.animate.bind(this))}},{key:"getColor",value:function(e){var t=this,n=this.props.color,i=e.color;if(null!=i&&(n=i),null!=e.nodes&&this.props.highlightedNodes.length>0){var a=this;e.nodes.forEach((function(e){null!=a.props.highlightedNodes.find((function(t){return e.toLowerCase()===t.toLowerCase()}))&&(n=t.props.highlightColor)}))}return n}},{key:"render",value:function(){var e=this.props,t=e.handleOnHover,n=e.initialViewState,a=e.nodes,l=e.trips,o=e.trailLength,s=e.viewport,r=this.state.currentTime,h=[];return null!=l&&h.push(new g.a({id:"trips",data:l,getPath:function(e){return e.segments.map((function(e){return e.coordinates}))},getTimestamps:function(e){return e.segments.map((function(e){return e.timestamp}))},getColor:this.getColor,opacity:.3,widthMinPixels:2,trailLength:o,currentTime:r})),null!=a&&h.push(new f.a({id:"geojson-layer",data:a,filled:!0,getFillColor:function(){return[0,255,178,150]},stroked:!0,extruded:!1,pointRadiusScale:100,getRadius:function(){return.4},pickable:!0,autoHighlight:!0,highlightColor:[0,255,178,250],onHover:t,onClick:function(e){return console.log(e.object.properties.name)}})),0===h.length?null:i.createElement(v.a,{initialViewState:n,viewState:s,layers:h})}}]),t}(i.Component),w=(n(155),function(e){function t(){return Object(s.a)(this,t),Object(h.a)(this,Object(d.a)(t).apply(this,arguments))}return Object(p.a)(t,e),Object(r.a)(t,[{key:"render",value:function(){return i.createElement("div",{className:"spinner-container"},i.createElement("div",{className:"spinner"},i.createElement("div",{className:"spinner-circle spinner-circle-outer"}),i.createElement("div",{className:"spinner-circle spinner-circle-inner"}),i.createElement("div",{className:"spinner-circle spinner-circle-single-1"}),i.createElement("div",{className:"spinner-circle spinner-circle-single-2"}),i.createElement("div",{className:"text"},"Loading")))}}]),t}(i.Component));function C(e){return new URL(window.location.href).searchParams.get(e)}function L(e){if(null!=e){var t=Number(e);if(!Number.isNaN(t))return t}return null}function T(e,t,n){for(var i=e.length>0?e.split("&"):[],a=!1,l=0;l<i.length;l++){i[l].split("=")[0]===t&&(i[l]=t+"="+(n||""),a=!0)}return!1===a&&i.push(t+"="+(n||"")),i.join("&")}var k=function(){var e={dataSampleIdx:null,loopTime:null,trailLength:null,highlightedNodes:null},t=L(C("dataIdx"));null!=t&&t>=0&&(e.dataSampleIdx=t);var n=L(C("loopTime"));null!=n&&n>0&&n<999999&&(e.loopTime=n);var i=L(C("trailLength"));null!=i&&i>0&&i<999999&&(e.trailLength=i);var a=C("highlightNodes");return null!=a&&a.length>0&&(e.highlightedNodes=a.split(",")),e},S=function(e){var t=decodeURIComponent(window.location.search.substring(1));null!=e.dataSampleIdx&&(t=T(t,"dataIdx",String(e.dataSampleIdx))),null!=e.loopTime&&(t=T(t,"loopTime",String(e.loopTime))),null!=e.trailLength&&(t=T(t,"trailLength",String(e.trailLength))),null!=e.highlightedNodes&&(t=T(t,"highlightNodes",e.highlightedNodes.join(",")));var n="?"+t;window.history.pushState({},"",n)},y=n(110),N=(n(156),n(157),n(158),{color:[23,184,190],colors:[[0,255,246],[255,235,86],[255,109,245],[0,255,119]],dataSamples:[{title:"SE QLD Transport",tripsUrl:"data/south-east-qld/trips.json",geoJsonUrl:"data/south-east-qld/geojson-stops.json",nodeListUrl:"data/south-east-qld/stops-list.json",initialPartialViewport:{latitude:-27.44,longitude:153.05,zoom:11}},{title:"SC Transport",tripsUrl:"data/sunshine-coast/trips.json",geoJsonUrl:"data/sunshine-coast/geojson-stops.json",nodeListUrl:"data/sunshine-coast/stops-list.json",initialPartialViewport:{latitude:-26.65,longitude:153.02,zoom:10}}],highlightColor:[253,128,93],initialLoopTimeMinutes:1,initialTrailLength:100,initialViewport:{latitude:-27.44,longitude:153.05,zoom:11,maxZoom:20,pitch:45,bearing:0,width:500,height:500},mapboxStyle:"mapbox://styles/stevejk/cjyvgdhr610m71cs03b5z7y9t",mapboxToken:"pk.eyJ1Ijoic3RldmVqayIsImEiOiJjanl2aDBiZ2kwZDBnM2lycnN3cWpoZGJlIn0.-POx84S1T6CybWoHT069Iw",nodeLabel:"Stop",nodeLabelPlural:"Stops",title:"Trips"}),O=function(e){function t(e){var n;Object(s.a)(this,t),(n=Object(h.a)(this,Object(d.a)(t).call(this,e))).intervalId=void 0,n.knownUrlParams=void 0,n.timestampOffset=void 0,n.knownUrlParams=k();var i=n.knownUrlParams.dataSampleIdx||0;return n.state={appConfig:N,dataSampleIdx:i,friendlyName:"",friendlyTime:"",hideInfoBox:!1,highlightedNodes:null!=n.knownUrlParams.highlightedNodes?n.knownUrlParams.highlightedNodes:[],loopLength:1e3,loopTimeMinutes:n.knownUrlParams.loopTime||N.initialLoopTimeMinutes,nodeList:[],nodes:null,percentThroughLoop:0,popupInfo:null,startDate:new Date(2e3,1,1,0,0,0),timeMultiplier:1,trailLength:n.knownUrlParams.trailLength||N.initialTrailLength,trips:null,viewport:Object.assign({},N.initialViewport,N.dataSamples[i].initialPartialViewport)},n.timestampOffset=Date.now(),n.handleDataChange=n.handleDataChange.bind(Object(u.a)(n)),n.handleHighlightNodeChange=n.handleHighlightNodeChange.bind(Object(u.a)(n)),n.handleHighlightNodeReload=n.handleHighlightNodeReload.bind(Object(u.a)(n)),n.handleLoopTimeMinutesChange=n.handleLoopTimeMinutesChange.bind(Object(u.a)(n)),n.handleOnHoverGeoPoint=n.handleOnHoverGeoPoint.bind(Object(u.a)(n)),n.handleTimeChange=n.handleTimeChange.bind(Object(u.a)(n)),n.handleTrailLengthChange=n.handleTrailLengthChange.bind(Object(u.a)(n)),n.loadNodeList=n.loadNodeList.bind(Object(u.a)(n)),n.loadTrips=n.loadTrips.bind(Object(u.a)(n)),n.updateBoxInfo=n.updateBoxInfo.bind(Object(u.a)(n)),n}return Object(p.a)(t,e),Object(r.a)(t,[{key:"componentDidMount",value:function(){var e=this;window.addEventListener("resize",this.resize.bind(this)),this.resize(),this.loadTrips(this.state.dataSampleIdx),this.loadNodeList(this.state.dataSampleIdx),this.loadGeoJsonNodes(this.state.dataSampleIdx),this.intervalId=setInterval((function(){return e.updateBoxInfo()}),1e3)}},{key:"componentWillUnmount",value:function(){clearInterval(this.intervalId)}},{key:"loadTrips",value:function(e){var t=this,n=this.state.appConfig.dataSamples[e].tripsUrl;Object(m.a)(n,(function(e,n){if(null==e){var i=t.state.appConfig.title;null!=n.friendlyName&&(i=n.friendlyName);var a=new Date(Date.parse(n.startTimestamp)),l=n.timeMultiplier,o=n.trips,s=n.loopLength;if(o.length>0&&o.length<=10)for(var r=0;r<o.length;r++)o[r].color=t.state.appConfig.colors[r%t.state.appConfig.colors.length];t.timestampOffset=Date.now(),t.setState({friendlyName:i,startDate:a,trips:o,loopLength:s,timeMultiplier:l})}}))}},{key:"loadNodeList",value:function(e){var t=this;Object(m.a)(this.state.appConfig.dataSamples[e].nodeListUrl,(function(e,n){null==e&&(n.sort(),t.setState({nodeList:n}))}))}},{key:"loadGeoJsonNodes",value:function(e){var t=this;Object(m.a)(this.state.appConfig.dataSamples[e].geoJsonUrl,(function(e,n){null==e&&t.setState({nodes:n})}))}},{key:"getLoopTime",value:function(){return 60*this.state.loopTimeMinutes*1e3}},{key:"updateBoxInfo",value:function(){if(null!=this.state.startDate){var e=Date.now()-this.timestampOffset,t=this.getLoopTime(),n=e%t,i=Math.floor(n/t*100),a=0*this.state.timeMultiplier+Math.floor(n*(this.state.loopLength/t)),l=this.toFriendlyTime(a);this.setState({friendlyTime:l,percentThroughLoop:i})}}},{key:"toFriendlyTime",value:function(e){var t=e/this.state.timeMultiplier,n=new Date(this.state.startDate.getTime()+1e3*t),i=String(n.getMinutes());return i.length<2&&(i="0"+i),n.getDate()+"/"+(n.getMonth()+1)+"/"+n.getFullYear()+" "+n.getHours()+":"+i}},{key:"handleTimeChange",value:function(e){var t=Date.now()-this.timestampOffset,n=this.getLoopTime(),i=t%n,a=e.target.value/100*n,l=this.timestampOffset+(i-a);this.timestampOffset=l}},{key:"handleTrailLengthChange",value:function(e){var t=e.target.value;if(null!=t&&t.length>0){var n=parseFloat(t);n<=0?n=1e-4:n>9999999&&(n=9999999),this.setState({trailLength:n}),this.knownUrlParams.trailLength=n,S(this.knownUrlParams)}else this.setState({trailLength:this.state.appConfig.initialTrailLength}),this.knownUrlParams.trailLength=null,S(this.knownUrlParams)}},{key:"handleLoopTimeMinutesChange",value:function(e){var t=e.target.value;if(null!=t&&t.length>0){var n=parseFloat(t);n<=0?n=1e-4:n>9999999&&(n=9999999);var i=Date.now()-this.timestampOffset,a=this.getLoopTime(),l=60*n*1e3,o=this.timestampOffset+(i%l-l*(i%a/a));this.timestampOffset=o,this.setState({loopTimeMinutes:n}),this.knownUrlParams.loopTime=n,S(this.knownUrlParams)}else this.setState({loopTimeMinutes:this.state.appConfig.initialLoopTimeMinutes}),this.knownUrlParams.trailLength=null,S(this.knownUrlParams)}},{key:"handleHighlightNodeChange",value:function(e){null==e&&(e=[]);var t=e.map((function(e){return e.value})),n=this.state.highlightedNodes.length>t.length;this.setState({highlightedNodes:t}),this.knownUrlParams.highlightedNodes=t,S(this.knownUrlParams),n&&this.handleHighlightNodeReload()}},{key:"handleHighlightNodeReload",value:function(){this.setState({trips:Object.assign([],this.state.trips)})}},{key:"handleDataChange",value:function(e){if(null!=e&&this.state.dataSampleIdx!==e.value){this.handleHighlightNodeChange([]);var t=e.value;window.history.pushState({},"",""),this.setState({trips:null,dataSampleIdx:t}),this.loadTrips(t),this.loadNodeList(t),this.loadGeoJsonNodes(t),this.handleViewportChange(this.state.appConfig.dataSamples[t].initialPartialViewport),this.knownUrlParams.dataSampleIdx=t,S(this.knownUrlParams)}}},{key:"handleOnHoverGeoPoint",value:function(e){this.setState({popupInfo:null!==e?e.object:null})}},{key:"resize",value:function(){this.handleViewportChange({width:window.innerWidth,height:window.innerHeight})}},{key:"handleViewportChange",value:function(e){this.setState({viewport:Object.assign({},this.state.viewport,e)})}},{key:"handleInfoBoxVisibility",value:function(e){this.setState({hideInfoBox:e})}},{key:"render",value:function(){var e=this,t=this.state,n=t.appConfig,a=t.dataSampleIdx,l=t.friendlyName,o=t.friendlyTime,s=t.hideInfoBox,r=t.highlightedNodes,h=t.loopLength,d=t.loopTimeMinutes,u=t.nodeList,p=t.nodes,m=t.percentThroughLoop,g=t.popupInfo,f=t.trailLength,v=t.trips,C=t.viewport,L=this.state.appConfig.dataSamples.map((function(e,t){return{value:t,label:e.title}})),T=u.map((function(e){return{value:e,label:e}})),k=r.map((function(e){return{value:e,label:e}})),S=i.createElement("span",null);null==v&&(S=i.createElement(w,null));var N=null;null!=g&&(N=i.createElement(c.a,{longitude:g.geometry.coordinates[0],latitude:g.geometry.coordinates[1],closeButton:!1,closeOnClick:!1,anchor:"bottom-left"},i.createElement("div",{className:"popup-inner"},this.state.appConfig.nodeLabel," ",null!=g.properties?g.properties.name:"")));var O=null;return this.state.appConfig.dataSamples.length>1&&(O=i.createElement("div",null,i.createElement("h6",null,"Select Data"),i.createElement("div",null,i.createElement(y.a,{options:L,onChange:this.handleDataChange,value:L[a]})))),i.createElement("div",{id:"container"},S,i.createElement("div",{id:"divdeckgl"},i.createElement(c.b,Object.assign({},C,{mapStyle:this.state.appConfig.mapboxStyle,dragRotate:!0,onViewportChange:this.handleViewportChange.bind(this),mapboxApiAccessToken:this.state.appConfig.mapboxToken}),i.createElement(b,{color:n.color,handleOnHover:this.handleOnHoverGeoPoint,highlightColor:n.highlightColor,highlightedNodes:r,initialViewState:n.initialViewport,loopLength:h,loopTimeMilliseconds:this.getLoopTime(),nodes:p,timestampOffset:this.timestampOffset,trips:v,trailLength:f,viewport:C}),N)),i.createElement("div",{id:"top-left-container"},i.createElement("div",{id:"title-box"},i.createElement("h1",null,l)),i.createElement("div",{id:"divinfo",className:s?"hide":""},i.createElement("button",{id:"btnHideInfoBox",className:"btn-transparent right-align",onClick:function(){return e.handleInfoBoxVisibility(!0)}},"X"),O,i.createElement("h3",null,o),i.createElement("div",null,i.createElement("h6",null,"Adjust point in time"),i.createElement("input",{className:"full-width",type:"range",min:"0",max:"100",value:String(m),onChange:this.handleTimeChange})),i.createElement("div",null,i.createElement("h6",null,"Adjust loop time"),i.createElement("div",{className:"block"},i.createElement("input",{className:"",type:"number",defaultValue:String(d),onInput:this.handleLoopTimeMinutesChange}),i.createElement("label",null,"mins"))),i.createElement("div",null,i.createElement("h6",null,"Adjust trail length"),i.createElement("div",{className:"block"},i.createElement("input",{type:"number",defaultValue:String(f),onInput:this.handleTrailLengthChange}),i.createElement("label",null,"x"))),i.createElement("div",null,i.createElement("h6",null,"Highlight ",this.state.appConfig.nodeLabelPlural),i.createElement("div",null,i.createElement(y.a,{closeMenuOnSelect:!1,isMulti:!0,options:T,onChange:this.handleHighlightNodeChange,onMenuClose:this.handleHighlightNodeReload,placeholder:"Highlight "+this.state.appConfig.nodeLabelPlural,value:k})))),i.createElement("button",{id:"btnShowInfoBox",className:"btn-transparent "+(s?"":"hide"),onClick:function(){return e.handleInfoBoxVisibility(!1)}},"SHOW INFO BOX")))}}]),t}(i.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(a.a.createElement(O,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[142,1,2]]]);
//# sourceMappingURL=main.30b69751.chunk.js.map