<p align="right">
  <a href="https://github.com/stevekirks/deckgl-trips/actions/workflows/deploy.yml">
    <img src="https://github.com/stevekirks/deckgl-trips/actions/workflows/deploy.yml/badge.svg" alt="cd" />
  </a>
</p>

<h1 align="center">deck.gl trips | <a href="https://stevekirks.github.io/deckgl-trips">example</a></h1>

This is an example of the deck.gl trips layer. Built using [deck.gl](https://deck.gl) and [Create-React-App](https://create-react-app.dev) with [Typescript](https://create-react-app.dev/docs/adding-typescript/).

Sample data is a short timespan of South-East Queensland Bus & Ferry service locations from the [Translink data feed](https://data.qld.gov.au/dataset/translink-real-time-data), [transformed](https://github.com/stevekirks/gtfs-protobuf-to-trips-rs) to suit.

### Features
-   Trip movement
-   Jump to time, adjust speed and trail length
-   Highlight trips that pass through a node (in the sample these are bus/ferry stops)
-   Hover over nodes to get their Id

### Usage
Clone this repo, set environment variable `REACT_APP_MAPBOX_TOKEN` with a [Mapbox](https://www.mapbox.com/) token. This variable can be set in the `.env.development` file. Then:
```
npm install
npm start
```

### Data format
Sample data is stored in the `public/data` folder. Not all bus/ferry vehicles or stops are shown.
If you wish to use different data, colors or basemap, modify `public/app-settings.json`.
