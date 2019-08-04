import * as React from 'react';
import './loader.css';

export default class Loader extends React.Component<any, any> {

  render() {
    return <div className="spinner-container"><div className="spinner">
        <div className="spinner-circle spinner-circle-outer"></div>
        <div className="spinner-circle spinner-circle-inner"></div>
        <div className="spinner-circle spinner-circle-single-1"></div>
        <div className="spinner-circle spinner-circle-single-2"></div>
        <div className="text">Loading</div>
    </div></div>;
  }
}
