import React, { Component } from 'react';
import svgN from './weather-night.svg';
import svgJ from './weather-sunny.svg';
import svgM from './weather-sunset-up.svg';
import svgS from './weather-sunset-down.svg';
import svgNull from './weather-none.svg';
import '../dot.css'
import './index.css'
class Periode extends Component{
    render(){
        return (
            <img
                alt="period"
                className={`dot period ${this._periodeToClassName(this.props.value)}`}
                src={this._periodeToSrc(this.props.value)}/>
        )
    }

    _periodeToClassName(value) {
        switch (this._toSingleLetter(value)) {
            case "m":
                return "dot-light";
            case "s":
                return "dot-dark";
            case "j":
                return "dot-lighter";
            case "n":
                return "dot-darker";
            default:
                return "hide";

        }
    }

    _periodeToSrc(value) {
        switch (this._toSingleLetter(value)) {
            case "m":
                return svgM
            case "s":
                return svgS
            case "j":
                return svgJ
            case "n":
                return svgN
            default:
                return svgNull;

        }
    }

    _toSingleLetter(value) {
        return value === undefined || value.length === 0
            ? undefined
            : value.toLowerCase()[0];
    }
}

export default Periode;
