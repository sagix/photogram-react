import React, { Component } from 'react';
import svgN from './svg/weather-night.svg';
import svgJ from './svg/weather-sunny.svg';
import svgM from './svg/weather-sunset-up.svg';
import svgS from './svg/weather-sunset-down.svg';
class Periode extends Component{
    render(){
        return (
            <img className={`tpl-small-dot tpl-small-periode ${this._periodeToClassName(this.props.value)}`} src={this._periodeToSrc(this.props.value)}/>
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
                return undefined;

        }
    }

    _toSingleLetter(value) {
        return value === undefined || value.length == 0
            ? undefined
            : value.toLowerCase()[0];
    }
}

export default Periode;
