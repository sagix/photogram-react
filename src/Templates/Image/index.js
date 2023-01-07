import React, { Component } from 'react';
import './index.css'
import svgEmpty from './empty.svg';
class Image extends Component {
    render() {
        const url = this.props.url
        return (
            <img className="img" src={url ? url : svgEmpty} alt="photogram" />
        )
    }
}

export default Image;
