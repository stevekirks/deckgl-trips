<p align="right">
  <a href="https://dev.azure.com/stevekirks/Public/_build/latest?definitionId=2&branchName=master">
    <img src="https://dev.azure.com/stevekirks/Public/_apis/build/status/deckgl-trips?branchName=master" alt="build" />
  </a>
</p>

<h1 align="center">deck.gl trips | <a href="https://stevekirks.github.io/deckgl-trips">demo website</a></h1>

This is an implementation of the deck.gl trips layer. Built using [deck.gl](https://uber.github.io/deck.gl) with [Create-React-App](https://facebook.github.io/create-react-app/) [Typescript](https://facebook.github.io/create-react-app/docs/adding-typescript).

Sample data is of South-East Queensland Bus & Ferry service locations from the [Translink real-time data feed](https://data.qld.gov.au/dataset/translink-real-time-data), transformed to suit.

### Features
-   trip movement
-   jump to time, adjust speed and trail length
-   highlight trips that stop at a bus stop
-   hover over bus stops to get their Id

## Usage
Clone this repo, set environment variables `REACT_APP_MAPBOX_TOKEN` and `REACT_APP_MAPBOX_STYLE` with a [Mapbox](https://www.mapbox.com/) token and style (can be set in the file `.env.development`). Then:
```
npm install
npm start
```

### Data format
Sample data is stored in the `public/data` folder. Not all bus stops are shown, only a handful of the most popular ones.
