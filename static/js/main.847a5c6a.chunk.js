(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{134:function(e,t,n){e.exports=n(151)},139:function(e,t,n){},143:function(e,t){},146:function(e,t,n){},147:function(e,t,n){},148:function(e,t,n){},151:function(e,t,n){"use strict";n.r(t);var a=n(4),i=n.n(a),l=n(52),o=n.n(l),s=(n(139),n(1)),r=n(2),h=n(5),d=n(3),u=n(8),p=n(6),m=n(107),c=n(100),g=n(157),f=n(158),v=n(159),w=function(e){function t(e){var n;return Object(s.a)(this,t),(n=Object(h.a)(this,Object(d.a)(t).call(this,e))).animationFrame=void 0,n.state={currentTime:0},n.animationFrame=null,n.animate=n.animate.bind(Object(u.a)(n)),n.getColor=n.getColor.bind(Object(u.a)(n)),n}return Object(p.a)(t,e),Object(r.a)(t,[{key:"componentDidMount",value:function(){this.animate()}},{key:"componentWillUnmount",value:function(){null!=this.animationFrame&&window.cancelAnimationFrame(this.animationFrame)}},{key:"animate",value:function(){if(null!=this.props.loopLength){var e=Date.now()-this.props.timestampOffset,t=this.props.loopTimeMilliseconds;this.setState({currentTime:e%t*(this.props.loopLength/t)})}this.animationFrame=window.requestAnimationFrame(this.animate.bind(this))}},{key:"getColor",value:function(e){var t=this,n=this.props.color,a=e.color;if(null!=a&&(n=a),null!=e.nodes&&this.props.highlightedNodes.length>0){var i=this;e.nodes.forEach(function(e){null!=i.props.highlightedNodes.find(function(t){return e.toLowerCase()===t.toLowerCase()})&&(n=t.props.highlightColor)})}return n}},{key:"render",value:function(){var e=this.props,t=e.handleOnHover,n=e.initialViewState,i=e.nodes,l=e.trips,o=e.trailLength,s=e.viewport,r=this.state.currentTime,h=[];return null!=l&&h.push(new g.a({id:"trips",data:l,getPath:function(e){return e.segments.map(function(e){return e.coordinates})},getTimestamps:function(e){return e.segments.map(function(e){return e.timestamp})},getColor:this.getColor,opacity:.3,widthMinPixels:2,trailLength:o,currentTime:r})),null!=i&&h.push(new f.a({id:"geojson-layer",data:i,filled:!0,getFillColor:function(){return[0,255,178,150]},stroked:!0,extruded:!1,pointRadiusScale:100,getRadius:function(){return.4},pickable:!0,autoHighlight:!0,highlightColor:[0,255,178,250],onHover:t,onClick:function(e){return console.log(e.object.properties.name)}})),0===h.length?null:a.createElement(v.a,{initialViewState:n,viewState:s,layers:h})}}]),t}(a.Component),b=(n(146),function(e){function t(){return Object(s.a)(this,t),Object(h.a)(this,Object(d.a)(t).apply(this,arguments))}return Object(p.a)(t,e),Object(r.a)(t,[{key:"render",value:function(){return a.createElement("div",{className:"spinner-container"},a.createElement("div",{className:"spinner"},a.createElement("div",{className:"spinner-circle spinner-circle-outer"}),a.createElement("div",{className:"spinner-circle spinner-circle-inner"}),a.createElement("div",{className:"spinner-circle spinner-circle-single-1"}),a.createElement("div",{className:"spinner-circle spinner-circle-single-2"}),a.createElement("div",{className:"text"},"Loading")))}}]),t}(a.Component));function C(e){return new URL(window.location.href).searchParams.get(e)}function L(e){if(null!=e){var t=Number(e);if(!Number.isNaN(t))return t}return null}function T(e,t,n){for(var a=e.length>0?e.split("&"):[],i=!1,l=0;l<a.length;l++){a[l].split("=")[0]===t&&(a[l]=t+"="+(n||""),i=!0)}return!1===i&&a.push(t+"="+(n||"")),a.join("&")}var k={getKnownUrlParameters:function(){var e={dataSampleIdx:null,loopTime:null,trailLength:null,highlightedNodes:null},t=L(C("dataIdx"));null!=t&&t>=0&&(e.dataSampleIdx=t);var n=L(C("loopTime"));null!=n&&n>0&&n<999999&&(e.loopTime=n);var a=L(C("trailLength"));null!=a&&a>0&&a<999999&&(e.trailLength=a);var i=C("highlightNodes");return null!=i&&i.length>0&&(e.highlightedNodes=i.split(",")),e},updateUrlParameters:function(e){var t=decodeURIComponent(window.location.search.substring(1));null!=e.dataSampleIdx&&(t=T(t,"dataIdx",String(e.dataSampleIdx))),null!=e.loopTime&&(t=T(t,"loopTime",String(e.loopTime))),null!=e.trailLength&&(t=T(t,"trailLength",String(e.trailLength))),null!=e.highlightedNodes&&(t=T(t,"highlightNodes",e.highlightedNodes.join(",")));var n="?"+t;window.history.pushState({},"",n)}},S=n(106),y=(n(147),n(148),n(149),{color:[23,184,190],colors:[[0,255,246],[255,235,86],[255,109,245],[0,255,119]],dataSamples:[{title:"SE QLD Transport",tripsUrl:"data/south-east-qld/trips.json",geoJsonUrl:"data/south-east-qld/geojson-stops.json",nodeListUrl:"data/south-east-qld/stops-list.json",initialPartialViewport:{latitude:-27.44,longitude:153.05,zoom:11}},{title:"SC Transport",tripsUrl:"data/sunshine-coast/trips.json",geoJsonUrl:"data/sunshine-coast/geojson-stops.json",nodeListUrl:"data/sunshine-coast/stops-list.json",initialPartialViewport:{latitude:-26.65,longitude:153.02,zoom:10}}],highlightColor:[253,128,93],initialLoopTimeMinutes:1,initialTrailLength:100,initialViewport:{latitude:-27.44,longitude:153.05,zoom:11,maxZoom:20,pitch:45,bearing:0,width:500,height:500},mapboxStyle:"mapbox://styles/stevejk/cjyvgdhr610m71cs03b5z7y9t",mapboxToken:"pk.eyJ1Ijoic3RldmVqayIsImEiOiJjanl2aDBiZ2kwZDBnM2lycnN3cWpoZGJlIn0.-POx84S1T6CybWoHT069Iw",nodeLabel:"Stop",nodeLabelPlural:"Stops",title:"Trips"}),O=function(e){function t(e){var n;Object(s.a)(this,t),(n=Object(h.a)(this,Object(d.a)(t).call(this,e))).intervalId=void 0,n.knownUrlParams=void 0,n.timestampOffset=void 0,n.knownUrlParams=k.getKnownUrlParameters();var a=n.knownUrlParams.dataSampleIdx||0;return n.state={appConfig:y,dataSampleIdx:a,friendlyName:"",friendlyTime:"",highlightedNodes:null!=n.knownUrlParams.highlightedNodes?n.knownUrlParams.highlightedNodes:[],loopLength:1e3,loopTimeMinutes:n.knownUrlParams.loopTime||y.initialLoopTimeMinutes,nodeList:[],nodes:null,percentThroughLoop:0,popupInfo:null,startDate:new Date(2e3,1,1,0,0,0),timeMultiplier:1,trailLength:n.knownUrlParams.trailLength||y.initialTrailLength,trips:null,viewport:Object.assign({},y.initialViewport,y.dataSamples[a].initialPartialViewport)},n.timestampOffset=Date.now(),n.handleDataChange=n.handleDataChange.bind(Object(u.a)(n)),n.handleHighlightNodeChange=n.handleHighlightNodeChange.bind(Object(u.a)(n)),n.handleHighlightNodeReload=n.handleHighlightNodeReload.bind(Object(u.a)(n)),n.handleLoopTimeMinutesChange=n.handleLoopTimeMinutesChange.bind(Object(u.a)(n)),n.handleOnHoverGeoPoint=n.handleOnHoverGeoPoint.bind(Object(u.a)(n)),n.handleTimeChange=n.handleTimeChange.bind(Object(u.a)(n)),n.handleTrailLengthChange=n.handleTrailLengthChange.bind(Object(u.a)(n)),n.loadNodeList=n.loadNodeList.bind(Object(u.a)(n)),n.loadTrips=n.loadTrips.bind(Object(u.a)(n)),n.updateBoxInfo=n.updateBoxInfo.bind(Object(u.a)(n)),n}return Object(p.a)(t,e),Object(r.a)(t,[{key:"componentDidMount",value:function(){var e=this;window.addEventListener("resize",this.resize.bind(this)),this.resize(),this.loadTrips(this.state.dataSampleIdx),this.loadNodeList(this.state.dataSampleIdx),this.loadGeoJsonNodes(this.state.dataSampleIdx),this.intervalId=setInterval(function(){return e.updateBoxInfo()},1e3)}},{key:"componentWillUnmount",value:function(){clearInterval(this.intervalId)}},{key:"loadTrips",value:function(e){var t=this,n=this.state.appConfig.dataSamples[e].tripsUrl;Object(c.a)(n,function(e,n){if(null==e){var a=t.state.appConfig.title;null!=n.friendlyName&&(a=n.friendlyName);var i=new Date(Date.parse(n.startTimestamp)),l=n.timeMultiplier,o=n.trips,s=n.loopLength;if(o.length>0&&o.length<=10)for(var r=0;r<o.length;r++)o[r].color=t.state.appConfig.colors[r%t.state.appConfig.colors.length];t.timestampOffset=Date.now(),t.setState({friendlyName:a,startDate:i,trips:o,loopLength:s,timeMultiplier:l})}})}},{key:"loadNodeList",value:function(e){var t=this;Object(c.a)(this.state.appConfig.dataSamples[e].nodeListUrl,function(e,n){null==e&&(n.sort(),t.setState({nodeList:n}))})}},{key:"loadGeoJsonNodes",value:function(e){var t=this;Object(c.a)(this.state.appConfig.dataSamples[e].geoJsonUrl,function(e,n){null==e&&t.setState({nodes:n})})}},{key:"getLoopTime",value:function(){return 60*this.state.loopTimeMinutes*1e3}},{key:"updateBoxInfo",value:function(){if(null!=this.state.startDate){var e=Date.now()-this.timestampOffset,t=this.getLoopTime(),n=e%t,a=Math.floor(n/t*100),i=0*this.state.timeMultiplier+Math.floor(n*(this.state.loopLength/t)),l=this.toFriendlyTime(i);this.setState({friendlyTime:l,percentThroughLoop:a})}}},{key:"toFriendlyTime",value:function(e){var t=e/this.state.timeMultiplier,n=new Date(this.state.startDate.getTime()+1e3*t),a=String(n.getMinutes());return a.length<2&&(a="0"+a),n.getDate()+"/"+(n.getMonth()+1)+"/"+n.getFullYear()+" "+n.getHours()+":"+a}},{key:"handleTimeChange",value:function(e){var t=Date.now()-this.timestampOffset,n=this.getLoopTime(),a=t%n,i=e.target.value/100*n,l=this.timestampOffset+(a-i);this.timestampOffset=l}},{key:"handleTrailLengthChange",value:function(e){var t=e.target.value;if(null!=t&&t.length>0){var n=parseFloat(t);n<=0?n=1e-4:n>9999999&&(n=9999999),this.setState({trailLength:n}),this.knownUrlParams.trailLength=n,k.updateUrlParameters(this.knownUrlParams)}else this.setState({trailLength:this.state.appConfig.initialTrailLength}),this.knownUrlParams.trailLength=null,k.updateUrlParameters(this.knownUrlParams)}},{key:"handleLoopTimeMinutesChange",value:function(e){var t=e.target.value;if(null!=t&&t.length>0){var n=parseFloat(t);n<=0?n=1e-4:n>9999999&&(n=9999999);var a=Date.now()-this.timestampOffset,i=this.getLoopTime(),l=60*n*1e3,o=this.timestampOffset+(a%l-l*(a%i/i));this.timestampOffset=o,this.setState({loopTimeMinutes:n}),this.knownUrlParams.loopTime=n,k.updateUrlParameters(this.knownUrlParams)}else this.setState({loopTimeMinutes:this.state.appConfig.initialLoopTimeMinutes}),this.knownUrlParams.trailLength=null,k.updateUrlParameters(this.knownUrlParams)}},{key:"handleHighlightNodeChange",value:function(e){null==e&&(e=[]);var t=e.map(function(e){return e.value}),n=this.state.highlightedNodes.length>t.length;this.setState({highlightedNodes:t}),this.knownUrlParams.highlightedNodes=t,k.updateUrlParameters(this.knownUrlParams),n&&this.handleHighlightNodeReload()}},{key:"handleHighlightNodeReload",value:function(){this.setState({trips:Object.assign([],this.state.trips)})}},{key:"handleDataChange",value:function(e){if(null!=e&&this.state.dataSampleIdx!==e.value){this.handleHighlightNodeChange([]);var t=e.value;window.history.pushState({},"",""),this.setState({trips:null,dataSampleIdx:t}),this.loadTrips(t),this.loadNodeList(t),this.loadGeoJsonNodes(t),this.handleViewportChange(this.state.appConfig.dataSamples[t].initialPartialViewport),this.knownUrlParams.dataSampleIdx=t,k.updateUrlParameters(this.knownUrlParams)}}},{key:"handleOnHoverGeoPoint",value:function(e){this.setState({popupInfo:null!==e?e.object:null})}},{key:"resize",value:function(){this.handleViewportChange({width:window.innerWidth,height:window.innerHeight})}},{key:"handleViewportChange",value:function(e){this.setState({viewport:Object.assign({},this.state.viewport,e)})}},{key:"render",value:function(){var e=this.state,t=e.appConfig,n=e.friendlyName,i=e.trips,l=e.friendlyTime,o=e.loopLength,s=e.loopTimeMinutes,r=e.trailLength,h=e.percentThroughLoop,d=e.highlightedNodes,u=e.nodeList,p=e.dataSampleIdx,c=e.nodes,g=e.popupInfo,f=e.viewport,v=this.state.appConfig.dataSamples.map(function(e,t){return{value:t,label:e.title}}),C=u.map(function(e){return{value:e,label:e}}),L=d.map(function(e){return{value:e,label:e}}),T=a.createElement("span",null);null==i&&(T=a.createElement(b,null));var k=null;null!=g&&(k=a.createElement(m.a,{longitude:g.geometry.coordinates[0],latitude:g.geometry.coordinates[1],closeButton:!1,closeOnClick:!1,anchor:"bottom-left"},a.createElement("div",{className:"popup-inner"},this.state.appConfig.nodeLabel," ",null!=g.properties?g.properties.name:"")));var y=null;return this.state.appConfig.dataSamples.length>1&&(y=a.createElement("div",null,a.createElement("h6",null,"Select Data"),a.createElement("div",null,a.createElement(S.a,{options:v,onChange:this.handleDataChange,value:v[p]})))),a.createElement("div",{id:"container"},T,a.createElement("div",{id:"divdeckgl"},a.createElement(m.b,Object.assign({},f,{mapStyle:this.state.appConfig.mapboxStyle,dragRotate:!0,onViewportChange:this.handleViewportChange.bind(this),mapboxApiAccessToken:this.state.appConfig.mapboxToken}),a.createElement(w,{color:t.color,handleOnHover:this.handleOnHoverGeoPoint,highlightColor:t.highlightColor,highlightedNodes:d,initialViewState:t.initialViewport,loopLength:o,loopTimeMilliseconds:this.getLoopTime(),nodes:c,timestampOffset:this.timestampOffset,trips:i,trailLength:r,viewport:f}),k)),a.createElement("div",{id:"top-left-container"},a.createElement("div",{id:"title-box"},a.createElement("h1",null,n)),a.createElement("div",{id:"divinfo"},y,a.createElement("h3",null,l),a.createElement("div",null,a.createElement("h6",null,"Adjust point in time"),a.createElement("input",{className:"full-width",type:"range",min:"0",max:"100",value:String(h),onChange:this.handleTimeChange})),a.createElement("div",null,a.createElement("h6",null,"Adjust loop time"),a.createElement("div",{className:"block"},a.createElement("input",{className:"",type:"number",defaultValue:String(s),onInput:this.handleLoopTimeMinutesChange}),a.createElement("label",null,"mins"))),a.createElement("div",null,a.createElement("h6",null,"Adjust trail length"),a.createElement("div",{className:"block"},a.createElement("input",{type:"number",defaultValue:String(r),onInput:this.handleTrailLengthChange}),a.createElement("label",null,"x"))),a.createElement("div",null,a.createElement("h6",null,"Highlight ",this.state.appConfig.nodeLabelPlural),a.createElement("div",null,a.createElement(S.a,{closeMenuOnSelect:!1,isMulti:!0,options:C,onChange:this.handleHighlightNodeChange,onMenuClose:this.handleHighlightNodeReload,placeholder:"Highlight "+this.state.appConfig.nodeLabelPlural,value:L}))))))}}]),t}(a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(i.a.createElement(O,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[134,1,2]]]);
//# sourceMappingURL=main.847a5c6a.chunk.js.map